# Module 1: Python Fundamentals for Security

*"Alright, listen up. If you're going to automate security tasks, you need to speak Python. It's the lingua franca of cybersecurity—SIEM integrations, penetration testing tools, incident response scripts, everything runs on Python. In 2026, with Python 3.12 and 3.13 bringing type hints, better error messages, and even a JIT compiler, there's no excuse. Let's get you fluent."*

---

## Why Python for Security

**Ubiquitous.** Every security tool worth using has a Python API or is written in Python. Metasploit, Burp Suite, Scapy, Impacket—these are Python-powered.

**Readable.** Security code needs to be reviewed, audited, maintained. Python's clarity matters when you're debugging at 3 AM during an incident.

**Extensive Libraries.** From cryptography to packet manipulation, Python's ecosystem has you covered.

---

## Python 3.12/3.13 — What's New (2026)

### Python 3.12 (October 2023)

**Key Security-Relevant Features:**

| Feature | Benefit |
|---------|---------|
| **PEP 695: Type Parameter Syntax** | Cleaner generic types for security tools |
| **PEP 701: F-string Enhancements** | Better logging and output formatting |
| **hashlib Improvements** | SHA-256/SHA-3 replaced with formally verified HACL* code |
| **Per-Interpreter GIL** | Better multi-core utilization for parallel scans |
| **Improved Error Messages** | Better "Did you mean..." suggestions |

### Python 3.13 (October 2024)

**Key Security-Relevant Features:**

| Feature | Benefit |
|---------|---------|
| **PEP 703: Free-Threaded CPython** | `python3.13t` — GIL can be disabled for true parallelism |
| **PEP 744: JIT Compiler** | Faster security script execution (experimental) |
| **PEP 594 Removals** | 19 legacy modules removed (reduces attack surface) |
| **Color by Default** | Better tracebacks for debugging security issues |

**Installation:**
```bash
# macOS (Homebrew)
brew install python@3.13

# Ubuntu/Debian
sudo apt install python3.13 python3.13-venv

# Check version
python3.13 --version
```

---

## Data Structures — Your Building Blocks

### Lists (Ordered, Mutable)

**Security Use Cases:** Port lists, IP addresses, scan results

```python
# Port scanning results
open_ports = [22, 80, 443, 8080, 3306]

# Add to list
open_ports.append(5432)        # PostgreSQL

# Check membership (O(1))
if 443 in open_ports:
    print("HTTPS is open")

# List comprehension (preferred)
high_ports = [p for p in open_ports if p > 1024]

# Remove duplicates
unique_ports = list(set(open_ports))
```

### Dictionaries (Key-Value Mapping)

**Security Use Cases:** Configurations, scan results, API responses

```python
# Configuration
config = {
    "target": "192.168.1.1",
    "ports": [80, 443],
    "timeout": 5.0,
    "threads": 10
}

# Safe access with default
timeout = config.get("timeout", 30)  # Returns 30 if key missing

# Merge configs (Python 3.9+)
defaults = {"timeout": 30, "retries": 3}
merged = defaults | config  # config overrides defaults

# Iterate
for key, value in config.items():
    print(f"{key}: {value}")
```

### Sets (Unique Elements)

**Security Use Cases:** Blocked IPs, unique findings, comparison operations

```python
# Blocked IPs
blocked_ips = {"192.168.1.100", "10.0.0.5", "172.16.0.1"}

# Fast membership test
if "192.168.1.100" in blocked_ips:
    print("IP is blocked")

# Set operations (critical for security analysis)
allowed = {"192.168.1.1", "192.168.1.100"}
blocked = {"192.168.1.100", "10.0.0.1"}

conflict = allowed & blocked      # Intersection: {'192.168.1.100'}
all_ips = allowed | blocked       # Union
only_allowed = allowed - blocked  # Difference: {'192.168.1.1'}
```

---

## File Handling — Secure by Default

### Text Files (Logs, Configs)

**Always use context managers (`with`) and explicit encoding:**

```python
# Reading logs
with open("/var/log/auth.log", "r", encoding="utf-8") as f:
    for line in f:  # Memory-efficient line-by-line
        if "Failed password" in line:
            process_failure(line)

# Writing results
with open("scan_results.txt", "w", encoding="utf-8") as f:
    f.write("Port Scan Results:\n")
    f.writelines([f"{p}\n" for p in open_ports])
```

### Binary Files (Malware Analysis)

```python
# Check file signatures
with open("suspicious.exe", "rb") as f:
    header = f.read(16)
    
    if header[:2] == b"MZ":
        print("Windows executable detected")
    elif header[:4] == b"\x7fELF":
        print("Linux executable detected")
```

### Pathlib (Modern Approach)

```python
from pathlib import Path

log_dir = Path("/var/log")
report_path = log_dir / "security" / "scan_2026-03-23.log"

# Safe operations
if report_path.exists():
    content = report_path.read_text(encoding="utf-8")

# Create directories
output_dir = Path("reports/2026-03")
output_dir.mkdir(parents=True, exist_ok=True)
```

---

## Error Handling — Fail Securely

### Try/Except Patterns for Security

```python
import logging
import socket

def scan_port(host: str, port: int) -> bool:
    """Scan single port with proper error handling."""
    try:
        sock = socket.create_connection((host, port), timeout=5)
        sock.close()
        return True
    except ConnectionRefusedError:
        # Expected: port is closed
        return False
    except socket.timeout:
        # Expected: filtered/dropped
        logging.warning(f"Timeout on {host}:{port}")
        return False
    except OSError as e:
        # Unexpected network error
        logging.error(f"Network error: {e}")
        raise  # Re-raise for caller to handle
```

### Custom Security Exceptions

```python
class SecurityError(Exception):
    """Base class for security-related exceptions."""
    pass

class AuthenticationError(SecurityError):
    """Raised when authentication fails."""
    pass

class AuthorizationError(SecurityError):
    """Raised when permission is denied."""
    pass

# Usage
def access_sensitive_data(user):
    if not user.authenticated:
        raise AuthenticationError("User not authenticated")
    if not user.has_permission("sensitive_data"):
        raise AuthorizationError("Permission denied")
```

### Exception Chaining (Audit Trails)

```python
try:
    config = load_config("security.conf")
except FileNotFoundError as e:
    # Chain exceptions for better debugging
    raise ConfigurationError("Security config missing") from e

# Suppress chaining when appropriate (from None)
try:
    api_key = os.environ["API_KEY"]
except KeyError:
    raise AuthenticationError("API key not configured") from None
```

---

## Virtual Environments — Isolate Your Tools

### venv (Standard Library)

```bash
# Create environment
python3 -m venv security-tools

# Activate
source security-tools/bin/activate  # macOS/Linux
security-tools\Scripts\activate    # Windows

# Install packages
pip install requests cryptography scapy

# Verify
which python  # Should show venv path

# Deactivate
deactivate
```

### Poetry (Modern Dependency Management)

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Create project
poetry new security-scanner
cd security-scanner

# Add dependencies
poetry add requests cryptography
poetry add --group dev pytest mypy ruff

# Install all dependencies
poetry install

# Run in environment
poetry run python scanner.py

# Or enter shell
poetry shell
```

### pyproject.toml Configuration

```toml
[project]
name = "security-scanner"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.31.0",
    "cryptography>=42.0.0",
    "click>=8.1.0",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "mypy>=1.8", "ruff>=0.2"]
```

**Security Best Practices:**
- Pin dependency versions for reproducible builds
- Use `poetry.lock` (committed for applications, not for libraries)
- Scan dependencies for vulnerabilities (`safety check`, `pip-audit`)
- Never commit `.venv/` or `__pycache__/` directories

---

## Type Hints — Code That Documents Itself

### Basic Annotations

```python
def scan_target(
    host: str,
    ports: list[int],
    timeout: float = 5.0
) -> dict[int, bool]:
    """Scan ports on target host.
    
    Args:
        host: Target IP address or hostname
        ports: List of ports to scan
        timeout: Connection timeout in seconds
    
    Returns:
        Dictionary mapping port to open status
    """
    results: dict[int, bool] = {}
    for port in ports:
        results[port] = check_port(host, port, timeout)
    return results
```

### Modern Syntax (Python 3.10+)

```python
# Union with | (Python 3.10+)
def parse_port(port: str | int) -> int: ...

# Optional shorthand
def get_config(key: str) -> str | None: ...

# Literal types for status codes
from typing import Literal
StatusCode = Literal[200, 201, 400, 401, 403, 404, 500]

def make_request() -> StatusCode: ...
```

### Generic Types (Python 3.12 - PEP 695)

```python
# New compact syntax
def process_results[T](items: list[T]) -> list[T]:
    return [item for item in items if item is not None]

class SecurityScanner[T]:
    def __init__(self) -> None:
        self.targets: list[T] = []
```

---

## Key Takeaways

1. **Python 3.12/3.13 bring real improvements.** Type hints, better error messages, performance gains.

2. **Data structures matter.** Lists for ordered data, dicts for mappings, sets for uniqueness and comparison.

3. **File handling must be secure.** Explicit encoding, context managers, pathlib for path safety.

4. **Error handling should be explicit.** Don't let exceptions bubble silently. Log, handle, or re-raise.

5. **Virtual environments are mandatory.** Isolate dependencies. Poetry or venv—just use something.

---

*"Now you know the language. Next module: security-specific scripting—HTTP requests, SSH automation, packet crafting, cryptography."*

---

## References

- Python 3.12 Release Notes: https://docs.python.org/3/whatsnew/3.12.html
- Python 3.13 Release Notes: https://docs.python.org/3/whatsnew/3.13.html
- Python Tutorial: https://docs.python.org/3/tutorial/
- Data Structures: https://docs.python.org/3/tutorial/datastructures.html
- File I/O: https://docs.python.org/3/tutorial/inputoutput.html
- Error Handling: https://docs.python.org/3/tutorial/errors.html
- Modules: https://docs.python.org/3/tutorial/modules.html
- venv Documentation: https://docs.python.org/3/library/venv.html
- Poetry Documentation: https://python-poetry.org/docs/
- Packaging Tutorial: https://packaging.python.org/en/latest/tutorials/installing-packages/
