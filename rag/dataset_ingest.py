import os
import json
from typing import Dict, Any
from rag.vectorstore import VectorStore, VectorDocument

def load_and_ingest_all(data_dir: str = "./data") -> VectorStore:
    store = VectorStore(collection_name="swaraj_history")
    
    # 1. Freedom Fighters
    ff_path = os.path.join(data_dir, "freedom_fighters.json")
    if os.path.exists(ff_path):
        with open(ff_path, "r", encoding="utf-8") as f:
            fighters = json.load(f)
            for ff in fighters:
                content = f"{ff['name']} ({ff.get('title', '')}). Born: {ff.get('birth_year')} - Died: {ff.get('death_year')}. Region: {ff.get('region')}. Category: {ff.get('category')}. Movements: {', '.join(ff.get('movements', []))}. Biography: {ff['biography']} Early Life: {ff.get('early_life', '')} Major Contributions: {' '.join(ff.get('major_contributions', []))}"
                meta = {
                    "doc_type": "person",
                    "person": ff["name"],
                    "person_id": ff["id"],
                    "category": ff.get("category"),
                    "region": ff.get("region"),
                    "birth_year": ff.get("birth_year"),
                    "death_year": ff.get("death_year"),
                    "title": ff["name"],
                    "source": "National Archives & Freedom Fighter Corpus",
                    "source_url": ff["sources"][0]["url"] if ff.get("sources") else "https://nationalarchives.nic.in"
                }
                store.add_documents([VectorDocument(doc_id=f"person_{ff['id']}", content=content, metadata=meta)])

    # 2. Timeline Events
    te_path = os.path.join(data_dir, "timeline_events.json")
    if os.path.exists(te_path):
        with open(te_path, "r", encoding="utf-8") as f:
            events = json.load(f)
            for ev in events:
                content = f"Event: {ev['title']} ({ev['year']}). Date: {ev.get('date')}. Location: {ev.get('location')}. Region: {ev.get('region')}. Category: {ev.get('category')}. Description: {ev['description']} Key Figures: {', '.join(ev.get('key_figures', []))}. Impact: {ev.get('impact', '')}"
                meta = {
                    "doc_type": "event",
                    "event_id": ev["id"],
                    "year": ev["year"],
                    "date": ev.get("date"),
                    "region": ev.get("region"),
                    "category": ev.get("category"),
                    "title": ev["title"],
                    "source": "Freedom Struggle Chronology",
                    "source_url": "https://nationalarchives.nic.in"
                }
                store.add_documents([VectorDocument(doc_id=f"event_{ev['id']}", content=content, metadata=meta)])

    # 3. Locations
    loc_path = os.path.join(data_dir, "locations.json")
    if os.path.exists(loc_path):
        with open(loc_path, "r", encoding="utf-8") as f:
            locations = json.load(f)
            for loc in locations:
                content = f"Historical Center: {loc['name']}, {loc.get('state')}. Description: {loc['description']} Key Figures: {', '.join(loc.get('key_figures', []))}."
                meta = {
                    "doc_type": "location",
                    "location_id": loc["id"],
                    "location_name": loc["name"],
                    "title": loc["name"],
                    "source": "Historical Geography of India",
                    "source_url": "https://nationalarchives.nic.in"
                }
                store.add_documents([VectorDocument(doc_id=f"loc_{loc['id']}", content=content, metadata=meta)])

    return store
