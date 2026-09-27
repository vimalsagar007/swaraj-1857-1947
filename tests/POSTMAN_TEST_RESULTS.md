# 📊 Postman Test Results Report

**Collection**: Swaraj 1857-1947 Historical Platform API Test Suite  
**Target Backend**: `https://swaraj-historical-agent-61256100941.us-central1.run.app`  
**Executed At**: `2026-09-27 11:32:11 UTC`  

---

### 📈 Executive Test Summary

| Total Endpoints Tested | Total Assertions Evaluated | Assertions Passed | Assertions Failed | Overall Result |
| :---: | :---: | :---: | :---: | :---: |
| **5** | **16** | **16** | **0** | **✅ PASSED (100%)** |

---

### 📋 Detailed Endpoint Test Breakdown

#### 01. Health Check
- **Method & Endpoint**: `GET https://swaraj-historical-agent-61256100941.us-central1.run.app/api/health`
- **HTTP Status**: `200`
- **Latency**: `2130.32 ms`
- **Result**: ✅ **PASS**

**Postman Test Assertions**:
- [✓] `Status code is 200`
- [✓] `Service is healthy`

**Response Preview**:
```json
{"status":"healthy","service":"Swaraj 1857-1947 Historical Platform","version":"1.0.0"}
```

---

#### 02. Chat Query - Shaheed Bhagat Singh
- **Method & Endpoint**: `POST https://swaraj-historical-agent-61256100941.us-central1.run.app/api/chat`
- **HTTP Status**: `200`
- **Latency**: `4445.16 ms`
- **Result**: ✅ **PASS**

**Postman Test Assertions**:
- [✓] `Status code is 200`
- [✓] `Response includes grounded answer`
- [✓] `Fact check status is SUPPORTED`
- [✓] `Citations are provided`

**Response Preview**:
```json
{"query":"Tell me about Shaheed Bhagat Singh and his role in the freedom struggle","session_id":"default_session","answer":"### Bhagat Singh (Bhagat Singh)\n\n**Birth - Death:** 1907 – 1931\n**Region:** Punjab | **Category:** Revolutionaries\n\nBhagat Singh (Shaheed-e-Azam). Born: 1907 - Died: 1931.
```

---

#### 03. Chat Query - Rani Lakshmibai 1857 Revolt
- **Method & Endpoint**: `POST https://swaraj-historical-agent-61256100941.us-central1.run.app/api/chat`
- **HTTP Status**: `200`
- **Latency**: `6282.27 ms`
- **Result**: ✅ **PASS**

**Postman Test Assertions**:
- [✓] `Status code is 200`
- [✓] `Response includes grounded answer`
- [✓] `Fact check status is SUPPORTED`
- [✓] `Citations are provided`

**Response Preview**:
```json
{"query":"What was the role of Rani Lakshmibai of Jhansi in the 1857 War of Independence?","session_id":"default_session","answer":"### Rani Lakshmibai (Rani Lakshmibai)\n\n**Birth - Death:** 1828 – 1858\n**Region:** Bundelkhand | **Category:** Women Leaders\n\nRani Lakshmibai (Jhansi Ki Rani). Born
```

---

#### 04. Chat Query - Quit India Movement 1942
- **Method & Endpoint**: `POST https://swaraj-historical-agent-61256100941.us-central1.run.app/api/chat`
- **HTTP Status**: `200`
- **Latency**: `5404.68 ms`
- **Result**: ✅ **PASS**

**Postman Test Assertions**:
- [✓] `Status code is 200`
- [✓] `Response includes grounded answer`
- [✓] `Fact check status is SUPPORTED`
- [✓] `Citations are provided`

**Response Preview**:
```json
{"query":"Explain the historical impact of the Quit India Movement of 1942","session_id":"default_session","answer":"### Mahatma Gandhi (Mahatma Gandhi)\n\n**Birth - Death:** 1869 – 1948\n**Region:** Gujarat / National | **Category:** National Leaders\n\nMahatma Gandhi (Father of the Nation). Born: 
```

---

#### 05. Agent Card Discovery
- **Method & Endpoint**: `GET https://swaraj-historical-agent-61256100941.us-central1.run.app/.well-known/agent-card.json`
- **HTTP Status**: `200`
- **Latency**: `131.7 ms`
- **Result**: ✅ **PASS**

**Postman Test Assertions**:
- [✓] `Status code is 200`
- [✓] `Valid Agent Card schema`

**Response Preview**:
```json
{"name":"Swaraj 1857-1947 Historical Research Agent","description":"Agentic AI historical platform dedicated to researching and honoring India's freedom struggle from 1857 to 1947 with grounded RAG, public source verification, citations, and multi-agent collaboration.","version":"1.0.0","creator":"V
```

---

