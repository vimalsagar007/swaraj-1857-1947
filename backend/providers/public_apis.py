import urllib.request
import urllib.parse
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("swaraj_providers")

class PublicAPIProvider:
    """Standardized Public REST API Provider base interface."""
    def search(self, query: str) -> List[Dict[str, Any]]:
        raise NotImplementedError

class WikidataProvider(PublicAPIProvider):
    def search(self, query: str) -> List[Dict[str, Any]]:
        url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={urllib.parse.quote(query)}&language=en&format=json"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'SwarajHistoryAgent/1.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                results = []
                for item in data.get('search', [])[:3]:
                    results.append({
                        "title": item.get('label', query),
                        "description": item.get('description', 'Wikidata historical entry'),
                        "url": item.get('concepturi', f"https://www.wikidata.org/wiki/{item.get('id')}"),
                        "source": "Wikidata",
                        "published_date": "Historical record",
                        "image_url": "",
                        "license": "CC0 1.0 Universal"
                    })
                return results
        except Exception as e:
            logger.warning(f"Wikidata API call failed: {e}")
            return []

class WikimediaProvider(PublicAPIProvider):
    def search(self, query: str) -> List[Dict[str, Any]]:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url|extmetadata&format=json"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'SwarajHistoryAgent/1.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                pages = data.get('query', {}).get('pages', {})
                results = []
                for page_id, page in pages.items():
                    imageinfo = page.get('imageinfo', [{}])[0]
                    img_url = imageinfo.get('url', '')
                    extmeta = imageinfo.get('extmetadata', {})
                    
                    # Ensure URL is a valid web image file, not a PDF or DJVU document
                    if img_url and any(img_url.lower().split('?')[0].endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']):
                        results.append({
                            "title": page.get('title', query).replace('File:', ''),
                            "description": extmeta.get('ObjectName', {}).get('value', page.get('title')),
                            "url": imageinfo.get('descriptionurl', img_url),
                            "source": "Wikimedia Commons",
                            "published_date": extmeta.get('DateTimeOriginal', {}).get('value', 'Historic'),
                            "image_url": img_url,
                            "license": extmeta.get('LicenseShortName', {}).get('value', 'Public Domain / CC-BY-SA')
                        })
                        if len(results) >= 3:
                            break
                return results
        except Exception as e:
            logger.warning(f"Wikimedia API call failed: {e}")
            return []

class InternetArchiveProvider(PublicAPIProvider):
    def search(self, query: str) -> List[Dict[str, Any]]:
        url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(query)}+AND+mediatype:texts&fl[]=identifier,title,description,publicdate&rows=3&output=json"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'SwarajHistoryAgent/1.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                docs = data.get('response', {}).get('docs', [])
                results = []
                for d in docs:
                    identifier = d.get('identifier')
                    results.append({
                        "title": d.get('title', query),
                        "description": d.get('description', ['Historical archive text'])[0] if isinstance(d.get('description'), list) else str(d.get('description', '')),
                        "url": f"https://archive.org/details/{identifier}" if identifier else "https://archive.org",
                        "source": "Internet Archive",
                        "published_date": d.get('publicdate', 'Historic'),
                        "image_url": "",
                        "license": "Public Domain / Open Access"
                    })
                return results
        except Exception as e:
            logger.warning(f"Internet Archive API call failed: {e}")
            return []

class OpenLibraryProvider(PublicAPIProvider):
    def search(self, query: str) -> List[Dict[str, Any]]:
        url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(query)}&limit=3"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'SwarajHistoryAgent/1.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                docs = data.get('docs', [])
                results = []
                for d in docs:
                    key = d.get('key')
                    results.append({
                        "title": d.get('title', query),
                        "description": f"Author(s): {', '.join(d.get('author_name', ['Unknown']))}",
                        "url": f"https://openlibrary.org{key}" if key else "https://openlibrary.org",
                        "source": "Open Library",
                        "published_date": str(d.get('first_publish_year', 'Historic')),
                        "image_url": f"https://covers.openlibrary.org/b/id/{d.get('cover_i')}-M.jpg" if d.get('cover_i') else "",
                        "license": "Public Access"
                    })
                return results
        except Exception as e:
            logger.warning(f"Open Library API call failed: {e}")
            return []

class AggregatedPublicSources:
    def __init__(self):
        self.providers = [
            WikidataProvider(),
            WikimediaProvider(),
            InternetArchiveProvider(),
            OpenLibraryProvider()
        ]

    def fetch_all(self, query: str) -> List[Dict[str, Any]]:
        combined = []
        for p in self.providers:
            try:
                res = p.search(query)
                combined.extend(res)
            except Exception as err:
                logger.error(f"Provider error: {err}")
        return combined
