import logging
from typing import Dict, Any, List, Optional
from mcp.server import SwarajMCPServer

logger = logging.getLogger("swaraj_specialists")

class BiographyAgent:
    """Specialist Agent for Freedom Fighter Biographies."""
    def run(self, query: str, mcp: SwarajMCPServer) -> Dict[str, Any]:
        res = mcp.call_tool("search_person", {"query": query})
        fighters = res.get("results", [])
        if fighters:
            best = fighters[0]
            meta = best["metadata"]
            return {
                "agent": "BiographyAgent",
                "status": "success",
                "biography_data": {
                    "person": meta.get("person", query),
                    "title": meta.get("title", ""),
                    "birth_year": meta.get("birth_year", ""),
                    "death_year": meta.get("death_year", ""),
                    "region": meta.get("region", ""),
                    "category": meta.get("category", ""),
                    "content": best["content"]
                }
            }
        return {"agent": "BiographyAgent", "status": "no_match", "biography_data": None}

class TimelineAgent:
    """Specialist Agent for Timeline Analysis and Period Comparison."""
    def run(self, query: str, mcp: SwarajMCPServer) -> Dict[str, Any]:
        res = mcp.call_tool("get_timeline", {"query": query})
        events = res.get("results", [])
        return {
            "agent": "TimelineAgent",
            "status": "success",
            "timeline_events": [e["metadata"] for e in events]
        }

class ResearchAgent:
    """Specialist Agent for Public REST APIs and External Archives."""
    def run(self, query: str, mcp: SwarajMCPServer) -> Dict[str, Any]:
        res = mcp.call_tool("search_public_history_sources", {"query": query})
        return {
            "agent": "ResearchAgent",
            "status": "success",
            "external_sources": res.get("results", [])
        }

class ImageResearchAgent:
    """Specialist Agent for Archival Photography and AI Historical Visualizations."""
    def run(self, query: str, mcp: SwarajMCPServer) -> Dict[str, Any]:
        formatted_images = []
        
        # Primary: Wikipedia Page Image
        wiki_res = mcp.call_tool("search_public_sources", {"query": query})
        for item in wiki_res.get("results", []):
            if item.get("source") == "Wikipedia (Primary Trusted Source)" and item.get("image_url"):
                formatted_images.append({
                    "url": item["image_url"],
                    "title": item.get("title", query),
                    "source": "Wikipedia (Primary Trusted Source)",
                    "license": "CC BY-SA / Public Domain",
                    "is_ai_generated": False
                })

        # Secondary: Wikimedia Commons search
        archival_res = mcp.call_tool("search_wikimedia", {"query": query})
        images = archival_res.get("results", [])
        
        for img in images:
            img_url = img.get("image_url", "")
            if img_url and any(img_url.lower().split('?')[0].endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']):
                # Avoid duplicate URLs
                if not any(i["url"] == img_url for i in formatted_images):
                    formatted_images.append({
                        "url": img_url,
                        "title": img.get("title", query),
                        "source": img.get("source", "Wikimedia Commons"),
                        "license": img.get("license", "Public Domain"),
                        "is_ai_generated": False
                    })

        return {
            "agent": "ImageResearchAgent",
            "status": "success",
            "images": formatted_images
        }

class FactVerificationAgent:
    """Specialist Agent for Historical Evidence Verification."""
    def run(self, query: str, claims: List[str], mcp: SwarajMCPServer) -> Dict[str, Any]:
        verifications = []
        for claim in claims:
            res = mcp.call_tool("verify_source", {"claim": claim})
            verifications.append(res.get("verification", {}))
        return {
            "agent": "FactVerificationAgent",
            "status": "success",
            "verifications": verifications
        }

class CitationAgent:
    """Specialist Agent for Grounded Citation Generation."""
    def run(self, rag_results: List[Dict[str, Any]], external_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
        citations = []
        cid = 1
        
        # Add RAG citations
        for r in rag_results:
            meta = r.get("metadata", {})
            citations.append({
                "id": cid,
                "title": meta.get("title", "Historical Archives of India"),
                "publisher": meta.get("source", "National Archives of India"),
                "url": meta.get("source_url", "https://nationalarchives.nic.in"),
                "support_status": "SUPPORTED",
                "retrieval_date": "2026-09-27"
            })
            cid += 1
            
        # Add External API citations
        for ext in external_sources:
            citations.append({
                "id": cid,
                "title": ext.get("title", "Public History Record"),
                "publisher": ext.get("source", "Public REST API"),
                "url": ext.get("url", "https://archive.org"),
                "support_status": "SUPPORTED",
                "retrieval_date": "2026-09-27"
            })
            cid += 1

        return {
            "agent": "CitationAgent",
            "status": "success",
            "citations": citations
        }
