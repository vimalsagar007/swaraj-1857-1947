# SWARAJ 1857–1947 | Cinematic Agentic AI Historical Platform

### "A Tribute to the Heroes Who Gave India Its Freedom"

[![Agentic AI Platform](https://img.shields.io/badge/Agentic_AI-Google_Enterprise_Agent_Runtime-blue)](https://cloud.google.com/vertex-ai)
[![Protocol](https://img.shields.io/badge/Protocol-A2A%20%7C%20MCP-gold)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

Created as a production-quality, cinematic Agentic AI historical research and tribute platform dedicated to the Indian freedom struggle from **1857 to 1947**.

Created by **Vimal Sagar Yarraguntla**

> *"Created as a humble digital tribute to the freedom fighters of India, so that their courage, sacrifice and contribution may be remembered by future generations."*

---

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Agentic AI Concepts & Architecture](#2-agentic-ai-concepts--architecture)
   - [2.1 Multi-Agent System (MAS) & A2A Protocol](#21-multi-agent-system-mas--a2a-protocol)
   - [2.2 Model Context Protocol (MCP) Server & Tools](#22-model-context-protocol-mcp-server--tools)
   - [2.3 Grounded Hybrid RAG Architecture](#23-grounded-hybrid-rag-architecture)
   - [2.4 Fact-Checking & Evidence Verification Engine](#24-fact-checking--evidence-verification-engine)
   - [2.5 Visual Provenance Safeguards (Archival vs. AI)](#25-visual-provenance-safeguards-archival-vs-ai)
   - [2.6 Real-Time Agent Progress Monitor](#26-real-time-agent-progress-monitor)
3. [User Experience & Features](#3-user-experience--features)
4. [Comprehensive Test Suite](#4-comprehensive-test-suite)
5. [API Reference](#5-api-reference)
6. [Deployment & Security Protocol](#6-deployment--security-protocol)
7. [Homage & Dedication](#7-homage--dedication)

---

## 1. System Architecture

```mermaid
flowchart TD
    U[User / Explorer] --> UI[Cinematic React Frontend]
    
    subgraph Frontend Experience Layer
        UI --> HERO[Cinematic Opening Sequence]
        UI --> ASK[Ask Swaraj AI Assistant]
        UI --> DIR[Freedom Fighter Directory]
        UI --> TIME[1857-1947 Interactive Timeline]
        UI --> MAP[Geographical Hotspot Map]
        UI --> AUDIO[Web Audio Ambient Soundscape]
    end

    ASK --> ORCH[Orchestrator Agent]
    
    subgraph Multi-Agent Network (A2A Specification)
        ORCH --> RAG_A[RAG Retrieval Specialist]
        ORCH --> BIO_A[Biography Specialist]
        ORCH --> TIME_A[Timeline Specialist]
        ORCH --> RES_A[Public API Research Specialist]
        ORCH --> IMG_A[Archival & Visual Research Agent]
        ORCH --> FACT_A[Fact Verification Specialist]
        ORCH --> CITE_A[Citation & Provenance Agent]
    end

    subgraph Tooling Layer (Model Context Protocol - MCP)
        RES_A --> MCP_SVR[Swaraj MCP Server]
        RAG_A --> MCP_SVR
        
        MCP_SVR --> VSTORE[(Hybrid VectorStore / RAG Index)]
        MCP_SVR --> WIKI_DATA[Wikidata SPARQL / REST API]
        MCP_SVR --> WIKI_COMM[Wikimedia Commons API]
        MCP_SVR --> ARCHIVE[Internet Archive API]
        MCP_SVR --> OPENLIB[Open Library API]
    end

    subgraph Verification & Output Layer
        FACT_A --> STATUS{Evidence Status}
        STATUS -->|Supported| S_OK[SUPPORTED]
        STATUS -->|Partially Supported| S_PART[PARTIALLY_SUPPORTED]
        
        CITE_A --> DRAWER[Verified Citations Drawer]
        IMG_A --> BADGE[Archival vs AI Image Badges]
    end

    ORCH --> API_OUT[FastAPI REST Response]
    API_OUT --> UI
```

---

## 2. Agentic AI Concepts & Architecture

### 2.1 Multi-Agent System (MAS) & A2A Protocol
The platform employs a **Multi-Agent Architecture** following the **Agent-to-Agent (A2A)** specification:
- **Orchestrator Agent (`OrchestratorAgent`)**: Serves as the central coordinator. Parses user intent, plans workflow execution, dispatches tasks to specialist agents, aggregates findings, and synthesizes final grounded responses.
- **Biography Specialist (`BiographyAgent`)**: Focuses on analyzing individual freedom fighters, their early life, revolutionary philosophy, organizations, and lasting impact.
- **Timeline Specialist (`TimelineAgent`)**: Maps historical event trajectories from 1857 to 1947, analyzing historical cause-and-effect relationships and period comparisons.
- **Public API Research Agent (`ResearchAgent`)**: Queries external live archives (Wikidata, Wikimedia Commons, Internet Archive, Open Library).
- **Visual Research Agent (`ImageResearchAgent`)**: Fetches authentic historical archival photos and marks artistic reconstructions clearly as `"AI-generated historical visualizations"`.
- **Fact Verification Agent (`FactVerificationAgent`)**: Validates generated statements against retrieved primary sources to eliminate hallucinations.
- **Citation Agent (`CitationAgent`)**: Formats grounded citations `[1]`, `[2]` with publisher details, URL, retrieval timestamp, and verification status.

### 2.2 Model Context Protocol (MCP) Server & Tools
A dedicated **MCP Server (`mcp/server.py`)** encapsulates all search and data retrieval functionality into standardized, typed tools:
1. `retrieve_rag(query, category, region, year_gte, year_lte)`: RAG vector store search with metadata filtering.
2. `search_wikidata(query)`: Queries Wikidata entity registry.
3. `search_wikimedia(query)`: Retrieves historical media from Wikimedia Commons.
4. `search_internet_archive(query)`: Queries digital primary sources on Internet Archive.
5. `search_public_history_sources(query)`: Aggregated multi-source query.
6. `search_person(name)`: Deep lookup for freedom fighters.
7. `search_event(event_name)`: Detailed event lookup.
8. `search_location(location_name)`: Regional resistance center search.
9. `verify_source(claim, document_id)`: Source evidence checking.
10. `get_timeline()`: Complete 1857–1947 event sequence.

### 2.3 Grounded Hybrid RAG Architecture
- **In-Memory Hybrid Vector Store (`rag/vectorstore.py`)**: Combines TF-IDF keyword indexing with semantic title matching and structured metadata filters.
- **Metadata Filtering**: Supports exact filtering on `year_gte`, `year_lte`, `region`, `category`, and `person`.
- **Automatic Ingestion (`rag/dataset_ingest.py`)**: Indexes structured historical records into vector documents with chunking and source tagging.

### 2.4 Fact-Checking & Evidence Verification Engine
Before any answer is returned to the user, the **Fact Verification Agent** evaluates claims against retrieved RAG documents and public API records:
- `SUPPORTED`: Claim is fully corroborated by high-confidence archival sources.
- `PARTIALLY_SUPPORTED`: Claim is supported by secondary sources or partial documents.
- `INSUFFICIENT_EVIDENCE`: Claim lacks direct archival documentation.

### 2.5 Visual Provenance Safeguards (Archival vs. AI)
To prevent historical misrepresentation:
- **Authentic Archival Photos**: Sourced from Wikimedia Commons and public archives with explicit license metadata (Public Domain, CC-BY-SA).
- **AI Visualizations**: Any generated illustrative artwork is explicitly tagged with a prominent badge: `"AI-generated historical visualization"`. Real freedom fighters' archival portraits are never replaced with AI caricatures.

### 2.6 Real-Time Agent Progress Monitor
During response generation, the user interface streams step-by-step agent execution milestones:
- `✓ Understanding question & identifying entities`
- `✓ Querying Swaraj RAG knowledge base`
- `✓ Consulting public archives (Wikidata / Wikimedia / Internet Archive)`
- `✓ Dispatching Biography & Timeline specialist agents`
- `✓ Verifying evidence & checking claims`
- `✓ Preparing grounded citations & provenance drawer`

---

## 3. User Experience & Features

- **Cinematic Museum Aesthetic**: Dark charcoal background (`#0F0F11`), antique gold borders (`#D4AF37`), parchment cream typography, glassmorphic panels, and subtle golden glows.
- **Ambient Soundscape Controller**: Built-in Web Audio API Tanpura/Flute drone with `[MUSIC OFF]` / `[MUSIC ON]` toggle, volume slider, and persistent `localStorage` preference (default `OFF`).
- **Opening Hero Sequence**: Interactive historical prelude ("1857" → "THE FIRST GREAT SPARKS OF RESISTANCE" → "1947" → "THE DAWN OF INDEPENDENCE").
- **Freedom Fighter Directory**: Interactive directory with category filter tabs (*National Leaders, Revolutionaries, Women Leaders, Tribal Leaders, Military Leaders, Social Reformers, Regional Leaders*) and instant modal profiles.
- **1857–1947 Interactive Timeline**: Milestone timeline from the 1857 Revolt to the 1947 Independence, highlighting key figures, locations, and historical impacts.
- **Geographical Resistance Map**: Interactive hotspot map covering Meerut, Delhi, Jhansi, Champaran, Amritsar, Kakori, Dandi, Mumbai, Kolkata, and the Andhra agency.

---

## 4. Comprehensive Test Suite

The test suite (`tests/test_swaraj_system.py`) verifies the 10 core historical queries across RAG retrieval, public API integration, multi-agent orchestration, image attribution, and fact verification.

```bash
python3 tests/test_swaraj_system.py
```

### Verified Test Cases

| # | Query | Primary Agent | Verification Check |
|---|-------|---------------|--------------------|
| 1 | *"Tell me about Bhagat Singh."* | `BiographyAgent` + RAG | Confirms biography context, citations `[1]`, and `SUPPORTED` evidence status. |
| 2 | *"What was the contribution of Rani Lakshmibai?"* | `BiographyAgent` + `TimelineAgent` | Verifies 1857 Revolt role, Jhansi resistance details, and primary citations. |
| 3 | *"Who were the women freedom fighters?"* | `OrchestratorAgent` | Verifies filtering across Sarojini Naidu, Aruna Asaf Ali, Rani Lakshmibai, and Kasturba. |
| 4 | *"Show freedom fighters connected with Andhra Pradesh."* | `ResearchAgent` + RAG | Validates regional filtering for Alluri Sitarama Raju and the Rampa Rebellion. |
| 5 | *"What happened during the Quit India Movement?"* | `TimelineAgent` | Confirms 1942 milestone details, Bombay session, and major leaders. |
| 6 | *"Find historical images of Subhas Chandra Bose."* | `ImageResearchAgent` | Verifies archival image retrieval and `AI-generated historical visualization` badge tags. |
| 7 | *"Give me the timeline from 1857 to 1947."* | `TimelineAgent` | Validates complete chronological event mapping from 1857 Revolt to 1947 Independence. |
| 8 | *"Compare Non-Cooperation and Civil Disobedience."* | `OrchestratorAgent` | Verifies comparative analysis between 1920 (Non-Cooperation) and 1930 (Salt Satyagraha). |
| 9 | *"Who participated in the Kakori action?"* | `BiographyAgent` + RAG | Confirms HRA revolutionaries (Ram Prasad Bismil, Ashfaqulla Khan, Chandrashekhar Azad). |
| 10 | *"Show me reliable sources about Alluri Sitarama Raju."* | `CitationAgent` + MCP | Verifies source provenance metadata, publisher attribution, and direct URLs. |

### Test Suite Output
```text
Ran 10 tests in 126.125s

OK
```

---

## 5. API Reference

### `POST /api/chat`
Process a query using the grounded multi-agent orchestrator engine.
- **Request**: `{"query": "Tell me about Bhagat Singh."}`
- **Response**:
  ```json
  {
    "query": "Tell me about Bhagat Singh.",
    "answer": "Bhagat Singh (1907–1931) was one of India's most influential revolutionaries...",
    "citations": [
      {
        "id": 1,
        "title": "Bhagat Singh Archival Profile",
        "publisher": "National Archives of India / RAG Store",
        "url": "https://en.wikipedia.org/wiki/Bhagat_Singh",
        "support_status": "SUPPORTED",
        "retrieval_date": "2026-09-27"
      }
    ],
    "fact_check_status": "SUPPORTED",
    "images": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/5/54/Bhagat_Singh_1929.jpg",
        "title": "Bhagat Singh Portrait (1929)",
        "source": "Wikimedia Commons",
        "license": "Public Domain",
        "is_ai_generated": false
      }
    ],
    "agent_activity": [
      {"step": "RAG Retrieval", "status": "COMPLETED", "docs_found": 3},
      {"step": "Public API Research", "status": "COMPLETED"},
      {"step": "Fact Verification", "status": "VERIFIED"}
    ]
  }
  ```

### `GET /.well-known/agent-card.json`
Provides standard Agent-to-Agent (A2A) metadata for discovery and inter-agent communication.

---

## 6. Deployment & Security Protocol

### Pre-Commit Secret Scanner
Run before every git commit to ensure zero API keys or secret tokens are committed:
```bash
python3 scripts/secret_scan.py
```

### Google Enterprise Agent Runtime Deployment
```bash
./scripts/deploy-agent.sh
```
Executes pre-flight secret scan, validates `.well-known/agent-card.json`, bundles multi-agent dependencies, and registers the agent with Google Enterprise Agent Runtime.

---

## 7. Homage & Dedication

**SWARAJ 1857–1947** is created by **Vimal Sagar Yarraguntla** as a tribute to the freedom fighters of India.

> *"May we remember their courage. May we understand their sacrifices. May we preserve their stories."*
