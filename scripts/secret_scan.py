import os
import sys
import re

SECRET_PATTERNS = [
    r"ghp_[a-zA-Z0-9]{36}",
    r"github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}",
    r"AIzaSy[a-zA-Z0-9_\-]{35}",
    r"-----BEGIN PRIVATE KEY-----",
    r"password\s*=\s*['\"][^'\"]+['\"]",
    r"secret\s*=\s*['\"][^'\"]+['\"]"
]

EXCLUDE_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}
EXCLUDE_FILES = {".env.example", "secret_scan.py"}

def scan_file(filepath):
    secrets_found = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            for pattern in SECRET_PATTERNS:
                matches = re.findall(pattern, content)
                if matches:
                    secrets_found.append((pattern, len(matches)))
    except Exception:
        pass
    return secrets_found

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"Scanning directory: {root_dir} for secret tokens...")
    
    total_found = 0
    for current_dir, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for file in files:
            if file in EXCLUDE_FILES or file.endswith(".png") or file.endswith(".jpg"):
                continue
            filepath = os.path.join(current_dir, file)
            found = scan_file(filepath)
            if found:
                print(f"[SECURITY ALERT] Secrets found in {filepath}: {found}")
                total_found += len(found)
                
    if total_found > 0:
        print("\nFAIL: Potential sensitive credentials discovered!")
        sys.exit(1)
    else:
        print("SUCCESS: Secret scan passed clean! No sensitive credentials found.")

if __name__ == "__main__":
    main()
