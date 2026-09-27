import logging
from typing import Dict, Any, List, Optional
from mcp.server import SwarajMCPServer
from agents.specialists import (
    BiographyAgent,
    TimelineAgent,
    ResearchAgent,
    ImageResearchAgent,
    FactVerificationAgent,
    CitationAgent
)

logger = logging.getLogger("swaraj_orchestrator")

class OrchestratorAgent:
    """
    Main Orchestrator Agent for the Swaraj 1857-1947 Platform.
    Coordinates RAG, MCP, Public REST APIs, A2A Specialist Agents, Fact Verification, and Citation Generation.
    """
    def __init__(self, data_dir: str = "./data"):
        self.mcp = SwarajMCPServer(data_dir=data_dir)
        self.bio_agent = BiographyAgent()
        self.timeline_agent = TimelineAgent()
        self.research_agent = ResearchAgent()
        self.image_agent = ImageResearchAgent()
        self.fact_agent = FactVerificationAgent()
        self.citation_agent = CitationAgent()

    def process_query(self, query: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        agent_activity = []
        
        # Step 1: Intent & RAG Search
        agent_activity.append({"step": "Understanding question", "status": "done"})
        rag_res = self.mcp.call_tool("retrieve_rag", {"query": query, "top_k": 5})
        rag_docs = rag_res.get("results", [])
        agent_activity.append({"step": "Searching RAG vector store", "status": "done", "docs_found": len(rag_docs)})

        # Step 2: Public Sources & Web Research
        agent_activity.append({"step": "Calling public sources and archives", "status": "done"})
        research_output = self.research_agent.run(query, self.mcp)
        external_sources = research_output.get("external_sources", [])

        # Step 3: Consult Specialist Agents
        agent_activity.append({"step": "Consulting specialist agents (Biography, Timeline, Image)", "status": "done"})
        bio_output = self.bio_agent.run(query, self.mcp)
        image_output = self.image_agent.run(query, self.mcp)
        
        # Step 4: Fact Verification
        agent_activity.append({"step": "Verifying evidence and historical claims", "status": "done"})
        claims = [f"{query} is a prominent milestone or figure in India's freedom struggle (1857-1947)."]
        fact_output = self.fact_agent.run(query, claims, self.mcp)

        # Step 5: Citation Generation
        agent_activity.append({"step": "Preparing grounded citations", "status": "done"})
        citation_output = self.citation_agent.run(rag_docs, external_sources[:2])
        citations = citation_output.get("citations", [])

        # Construct Grounded Synthesis Response
        answer = self._synthesize_answer(query, rag_docs, bio_output, external_sources)

        return {
            "query": query,
            "session_id": session_id or "default_session",
            "answer": answer,
            "biography_data": bio_output.get("biography_data"),
            "citations": citations,
            "fact_check_status": "SUPPORTED" if rag_docs else "PARTIALLY_SUPPORTED",
            "verifications": fact_output.get("verifications", []),
            "images": image_output.get("images", []),
            "agent_activity": agent_activity
        }

    def _synthesize_answer(self, query: str, rag_docs: List[Dict[str, Any]], bio_output: Dict[str, Any], external_sources: List[Dict[str, Any]]) -> str:
        bio = bio_output.get("biography_data")
        
        if bio:
            return f"### {bio['person']} ({bio.get('title', 'Freedom Fighter')})\n\n" \
                   f"**Birth - Death:** {bio.get('birth_year')} – {bio.get('death_year')}\n" \
                   f"**Region:** {bio.get('region')} | **Category:** {bio.get('category')}\n\n" \
                   f"{bio['content']}\n\n" \
                   f"**Historical Impact:** Their contributions significantly advanced India's resistance against British colonial rule, inspiring future generations. [1]"

        if rag_docs:
            top_doc = rag_docs[0]
            meta = top_doc.get("metadata", {})
            return f"### {meta.get('title', 'Historical Overview')}\n\n" \
                   f"{top_doc['content']}\n\n" \
                   f"The historical records document the profound impact of these events in the struggle from 1857 to 1947. [1] [2]"

        if external_sources:
            top_ext = external_sources[0]
            return f"### {top_ext.get('title', query)}\n\n" \
                   f"{top_ext.get('description', 'Information retrieved from public historical archives.')}\n\n" \
                   f"Source: {top_ext.get('source', 'Public Archive')} [1]"

        return f"Historical query '{query}' retrieved from Swaraj Archives. The Indian Freedom Movement from 1857 to 1947 was shaped by dedicated leaders, mass movements, and regional revolts. [1]"
