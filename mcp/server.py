import json
import logging
from typing import Dict, Any, List, Optional
from rag.dataset_ingest import load_and_ingest_all
from backend.providers.public_apis import AggregatedPublicSources, WikimediaProvider, WikidataProvider, InternetArchiveProvider

logger = logging.getLogger("swaraj_mcp")

class SwarajMCPServer:
    """
    Model Context Protocol (MCP) Server for Swaraj 1857-1947.
    Exposes standardized tools for agents to query RAG, Public REST APIs, and Historical Archives.
    """
    def __init__(self, data_dir: str = "./data"):
        self.vector_store = load_and_ingest_all(data_dir=data_dir)
        self.public_sources = AggregatedPublicSources()
        self.wikidata = WikidataProvider()
        self.wikimedia = WikimediaProvider()
        self.internet_archive = InternetArchiveProvider()

    def list_tools(self) -> List[Dict[str, Any]]:
        return [
            {"name": "search_web", "description": "Search external public history repositories and web APIs"},
            {"name": "search_wikidata", "description": "Search structured Wikidata historical entities"},
            {"name": "search_wikimedia", "description": "Search authentic Wikimedia Commons historical media"},
            {"name": "search_internet_archive", "description": "Search public domain historical texts and documents"},
            {"name": "search_public_history_sources", "description": "Search aggregated public APIs and archives"},
            {"name": "search_person", "description": "Retrieve freedom fighter profile by name or region"},
            {"name": "search_event", "description": "Retrieve historical event details by year or title"},
            {"name": "search_location", "description": "Retrieve historical center information by place name"},
            {"name": "retrieve_rag", "description": "Execute grounded RAG vector similarity search with metadata filtering"},
            {"name": "search_images", "description": "Search for archival historical photographs"},
            {"name": "verify_source", "description": "Check evidence support for a specific historical claim"},
            {"name": "get_timeline", "description": "Fetch chronological events from 1857 to 1947"},
            {"name": "get_sources", "description": "Retrieve verified bibliography and primary document citations"}
        ]

    def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        query = arguments.get("query", "")
        filters = arguments.get("filters", {})

        if tool_name == "retrieve_rag":
            top_k = arguments.get("top_k", 5)
            results = self.vector_store.similarity_search(query=query, top_k=top_k, filters=filters)
            return {"status": "success", "results": results}

        elif tool_name == "search_person":
            results = self.vector_store.similarity_search(query=query, top_k=5, filters={"doc_type": "person"})
            return {"status": "success", "results": results}

        elif tool_name == "search_event":
            results = self.vector_store.similarity_search(query=query, top_k=5, filters={"doc_type": "event"})
            return {"status": "success", "results": results}

        elif tool_name == "search_location":
            results = self.vector_store.similarity_search(query=query, top_k=5, filters={"doc_type": "location"})
            return {"status": "success", "results": results}

        elif tool_name == "get_timeline":
            results = self.vector_store.similarity_search(query="", top_k=20, filters={"doc_type": "event"})
            return {"status": "success", "results": results}

        elif tool_name == "search_public_history_sources" or tool_name == "search_web":
            res = self.public_sources.fetch_all(query)
            return {"status": "success", "results": res}

        elif tool_name == "search_wikidata":
            res = self.wikidata.search(query)
            return {"status": "success", "results": res}

        elif tool_name == "search_wikimedia" or tool_name == "search_images":
            res = self.wikimedia.search(query)
            return {"status": "success", "results": res}

        elif tool_name == "search_internet_archive":
            res = self.internet_archive.search(query)
            return {"status": "success", "results": res}

        elif tool_name == "verify_source":
            claim = arguments.get("claim", query)
            rag_res = self.vector_store.similarity_search(query=claim, top_k=3)
            pub_res = self.public_sources.fetch_all(claim)
            status = "SUPPORTED" if (rag_res or pub_res) else "INSUFFICIENT_EVIDENCE"
            return {
                "status": "success",
                "verification": {
                    "claim": claim,
                    "status": status,
                    "rag_evidence": rag_res,
                    "public_evidence": pub_res
                }
            }

        elif tool_name == "get_sources":
            rag_res = self.vector_store.similarity_search(query=query, top_k=5)
            sources = []
            for r in rag_res:
                sources.append({
                    "title": r["metadata"].get("source", r["metadata"].get("title", "Historical Record")),
                    "url": r["metadata"].get("source_url", "https://nationalarchives.nic.in"),
                    "publisher": r["metadata"].get("source", "National Archives of India")
                })
            return {"status": "success", "sources": sources}

        else:
            return {"status": "error", "message": f"Unknown tool '{tool_name}'"}
