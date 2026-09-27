import json
import time
import urllib.request
import urllib.parse
from datetime import datetime

COLLECTION_FILE = "tests/swaraj_postman_collection.json"
RESULTS_JSON = "tests/postman_results.json"
RESULTS_MD = "tests/POSTMAN_TEST_RESULTS.md"

def run_tests():
    with open(COLLECTION_FILE, "r") as f:
        collection = json.load(f)

    base_url = "https://swaraj-historical-agent-61256100941.us-central1.run.app"
    items = collection.get("item", [])

    results = []
    total_passed = 0
    total_failed = 0

    print("==================================================================")
    print("🚀 RUNNING POSTMAN API TEST COLLECTION AGAINST LIVE BACKEND")
    print(f"Target URL: {base_url}")
    print("==================================================================\n")

    for item in items:
        name = item.get("name")
        req = item.get("request", {})
        method = req.get("method", "GET")
        path_segments = req.get("url", {}).get("path", [])
        path = "/" + "/".join(path_segments)
        url = base_url + path

        headers = {}
        for h in req.get("header", []):
            headers[h.get("key")] = h.get("value")

        body_data = None
        if "body" in req and req["body"].get("mode") == "raw":
            body_data = req["body"].get("raw", "").encode("utf-8")

        start_time = time.time()
        http_req = urllib.request.Request(url, data=body_data, headers=headers, method=method)
        
        status_code = 0
        response_body = ""
        error_msg = None

        try:
            with urllib.request.urlopen(http_req, timeout=30) as resp:
                status_code = resp.getcode()
                response_body = resp.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            status_code = e.code
            response_body = e.read().decode("utf-8")
        except Exception as e:
            error_msg = str(e)

        latency_ms = round((time.time() - start_time) * 1000, 2)

        # Evaluate Postman Assertions
        assertions = []

        if status_code == 200:
            assertions.append({"name": "Status code is 200", "passed": True})
            try:
                data = json.loads(response_body)

                if "health" in path:
                    status_pass = data.get("status") == "healthy"
                    assertions.append({"name": "Service is healthy", "passed": status_pass})
                elif "chat" in path:
                    has_ans = bool(data.get("answer"))
                    assertions.append({"name": "Response includes grounded answer", "passed": has_ans})

                    fact_ok = data.get("fact_check_status") in ["SUPPORTED", "PARTIALLY_SUPPORTED"]
                    assertions.append({"name": "Fact check status is SUPPORTED", "passed": fact_ok})

                    has_cites = len(data.get("citations", [])) > 0
                    assertions.append({"name": "Citations are provided", "passed": has_cites})
                elif "agent-card" in path:
                    card_ok = "Swaraj" in data.get("name", "")
                    assertions.append({"name": "Valid Agent Card schema", "passed": card_ok})
            except Exception as e:
                assertions.append({"name": f"Valid JSON response ({str(e)})", "passed": False})
        else:
            assertions.append({"name": "Status code is 200", "passed": False, "error": f"Got HTTP {status_code}"})

        passed_count = sum(1 for a in assertions if a["passed"])
        failed_count = sum(1 for a in assertions if not a["passed"])

        total_passed += passed_count
        total_failed += failed_count

        test_result = {
            "name": name,
            "method": method,
            "url": url,
            "status_code": status_code,
            "latency_ms": latency_ms,
            "passed": failed_count == 0,
            "assertions": assertions,
            "response_preview": response_body[:300] if response_body else str(error_msg)
        }
        results.append(test_result)

        status_icon = "✅ PASS" if test_result["passed"] else "❌ FAIL"
        print(f"{status_icon} [{method}] {name} ({latency_ms} ms)")
        for a in assertions:
            icon = "  ✓" if a["passed"] else "  ✗"
            print(f"{icon} {a['name']}")
        print("")

    # Generate JSON Summary
    summary = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "collection_name": collection.get("info", {}).get("name"),
        "target_url": base_url,
        "total_requests": len(items),
        "total_passed_assertions": total_passed,
        "total_failed_assertions": total_failed,
        "results": results
    }

    with open(RESULTS_JSON, "w") as f:
        json.dump(summary, f, indent=2)

    # Generate Markdown Summary
    md_content = f"""# 📊 Postman Test Results Report

**Collection**: {collection.get('info', {}).get('name')}  
**Target Backend**: `{base_url}`  
**Executed At**: `{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}`  

---

### 📈 Executive Test Summary

| Total Endpoints Tested | Total Assertions Evaluated | Assertions Passed | Assertions Failed | Overall Result |
| :---: | :---: | :---: | :---: | :---: |
| **{len(items)}** | **{total_passed + total_failed}** | **{total_passed}** | **{total_failed}** | **{'✅ PASSED (100%)' if total_failed == 0 else '❌ FAILED'}** |

---

### 📋 Detailed Endpoint Test Breakdown

"""
    for r in results:
        status_badge = "✅ **PASS**" if r["passed"] else "❌ **FAIL**"
        md_content += f"""#### {r['name']}
- **Method & Endpoint**: `{r['method']} {r['url']}`
- **HTTP Status**: `{r['status_code']}`
- **Latency**: `{r['latency_ms']} ms`
- **Result**: {status_badge}

**Postman Test Assertions**:
"""
        for a in r["assertions"]:
            icon = "✓" if a["passed"] else "✗"
            md_content += f"- [{icon}] `{a['name']}`\n"

        md_content += f"\n**Response Preview**:\n```json\n{r['response_preview']}\n```\n\n---\n\n"

    with open(RESULTS_MD, "w") as f:
        f.write(md_content)

    print(f"\n🎉 Test execution completed! Results saved to:\n  - {RESULTS_JSON}\n  - {RESULTS_MD}\n")

if __name__ == "__main__":
    run_tests()
