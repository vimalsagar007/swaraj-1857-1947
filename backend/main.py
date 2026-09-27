import os
import json
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agents.orchestrator import OrchestratorAgent

app = FastAPI(
    title="Swaraj 1857-1947 API",
    description="Backend API and Multi-Agent Orchestrator for Swaraj 1857-1947 Historical Platform",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Orchestrator Agent
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
orchestrator = OrchestratorAgent(data_dir=DATA_DIR)

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = "default_session"
    filters: Optional[Dict[str, Any]] = None

class VerifyRequest(BaseModel):
    claim: str

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Swaraj 1857-1947 Historical Platform", "version": "1.0.0"}

@app.get("/.well-known/agent-card.json")
def get_agent_card():
    card_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".well-known", "agent-card.json")
    if os.path.exists(card_path):
        with open(card_path, "r", encoding="utf-8") as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Agent card not found")

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    return orchestrator.process_query(query=req.query, session_id=req.session_id)

@app.post("/api/research")
def research_endpoint(req: ChatRequest):
    return orchestrator.process_query(query=req.query, session_id=req.session_id)

@app.get("/api/person/{person_id}")
def get_person(person_id: str):
    res = orchestrator.mcp.call_tool("search_person", {"query": person_id})
    docs = res.get("results", [])
    if docs:
        return {"status": "success", "person": docs[0]["metadata"], "content": docs[0]["content"]}
    raise HTTPException(status_code=404, detail=f"Freedom fighter '{person_id}' not found")

@app.get("/api/event/{event_id}")
def get_event(event_id: str):
    res = orchestrator.mcp.call_tool("search_event", {"query": event_id})
    docs = res.get("results", [])
    if docs:
        return {"status": "success", "event": docs[0]["metadata"], "content": docs[0]["content"]}
    raise HTTPException(status_code=404, detail=f"Event '{event_id}' not found")

@app.get("/api/location/{location_id}")
def get_location(location_id: str):
    res = orchestrator.mcp.call_tool("search_location", {"query": location_id})
    docs = res.get("results", [])
    if docs:
        return {"status": "success", "location": docs[0]["metadata"], "content": docs[0]["content"]}
    raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found")

@app.get("/api/search")
def search_all(q: str = Query(..., min_length=1)):
    res = orchestrator.mcp.call_tool("retrieve_rag", {"query": q, "top_k": 10})
    return {"status": "success", "query": q, "results": res.get("results", [])}

@app.get("/api/timeline")
def get_timeline():
    res = orchestrator.mcp.call_tool("get_timeline", {})
    return {"status": "success", "events": res.get("results", [])}

@app.get("/api/sources")
def get_sources(q: str = Query(default="1857-1947")):
    res = orchestrator.mcp.call_tool("get_sources", {"query": q})
    return {"status": "success", "sources": res.get("sources", [])}

@app.post("/api/verify")
def verify_claim(req: VerifyRequest):
    res = orchestrator.mcp.call_tool("verify_source", {"claim": req.claim})
    return {"status": "success", "verification": res.get("verification", {})}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
