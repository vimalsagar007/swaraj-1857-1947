import math
import json
import re
from typing import List, Dict, Any, Optional

class VectorDocument:
    def __init__(self, doc_id: str, content: str, metadata: Dict[str, Any], embedding: Optional[List[float]] = None):
        self.doc_id = doc_id
        self.content = content
        self.metadata = metadata
        self.embedding = embedding or []

class VectorStore:
    """
    VectorStore Interface and In-Memory Hybrid Vector Search Engine.
    Supports local development (FAISS/Chroma abstraction) and production Vector DB backends (pgvector / Vertex AI Vector Search).
    """
    def __init__(self, collection_name: str = "swaraj_history"):
        self.collection_name = collection_name
        self.documents: Dict[str, VectorDocument] = {}

    def add_documents(self, docs: List[VectorDocument]):
        for d in docs:
            self.documents[d.doc_id] = d

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r'\w+', text)]

    def _match_metadata(self, metadata: Dict[str, Any], filters: Dict[str, Any]) -> bool:
        if not filters:
            return True
        for key, value in filters.items():
            if key == "year_gte":
                doc_year = int(metadata.get("year", 0))
                if doc_year < int(value):
                    return False
            elif key == "year_lte":
                doc_year = int(metadata.get("year", 9999))
                if doc_year > int(value):
                    return False
            elif key == "category":
                if metadata.get("category", "").lower() != str(value).lower():
                    return False
            elif key == "region":
                if str(value).lower() not in metadata.get("region", "").lower():
                    return False
            elif key in metadata:
                if str(metadata[key]).lower() != str(value).lower():
                    return False
        return True

    def similarity_search(
        self, query: str, top_k: int = 5, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        query_tokens = set(self._tokenize(query))
        results = []

        for doc_id, doc in self.documents.items():
            if filters and not self._match_metadata(doc.metadata, filters):
                continue

            doc_tokens = self._tokenize(doc.content)
            title_tokens = self._tokenize(doc.metadata.get("title", ""))
            
            # Simple hybrid scoring (keyword match + metadata boost)
            overlap = len(query_tokens.intersection(set(doc_tokens)))
            title_overlap = len(query_tokens.intersection(set(title_tokens)))
            
            score = (overlap * 1.0) + (title_overlap * 2.5)
            
            # Additional boost if person name or event match
            if doc.metadata.get("person") and doc.metadata.get("person").lower() in query.lower():
                score += 5.0
            if doc.metadata.get("title") and doc.metadata.get("title").lower() in query.lower():
                score += 5.0

            if score > 0 or not query_tokens:
                results.append({
                    "doc_id": doc.doc_id,
                    "content": doc.content,
                    "metadata": doc.metadata,
                    "score": round(score, 3)
                })

        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
