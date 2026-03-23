# Module 2: Security Scripting with Python

*"Alright, fundamentals down—now let's build real security tools. HTTP requests for API testing, SSH automation for server hardening, packet crafting for network reconnaissance, cryptography for secure operations. These are the libraries that power security automation. Learn them, master them, and you'll automate tasks that used to take hours into scripts that run in minutes."

---

## Requests — HTTP for Humans (and Security Testers)

**Purpose:** HTTP library for API testing, web scanning, security automation

**Installation:**
```bash
pip install requests
```

### Basic Usage

```python
import requests

# Simple GET request
response = requests.get("https://api.example.com/users")
print(response.status_code)
print(response.json())

# POST with authentication
response = requests.post(
    "https://api.example.com/login",
    json={"username": "admin", "password": "secret"},
    timeout=10
)
```

### Security Testing Patterns

```python
# SSL/TLS verification (default: True)
response = requests.get(
    "https://api.example.com",
    verify=True  # Verify certificates
)

# Custom headers (User-Agent, Authorization)
headers = {
    "User-Agent": "SecurityScanner/1.0",
    "Authorization": "Bearer token123"
}
response = requests.get(url, headers=headers)

# Proxy support for traffic interception
proxies = {
    "http": "http://127.0.0.1:8080",
    "https": "http://127.0.0.1:8080"
}
response = requests.get(url, proxies=proxies)

# Session persistence (cookies)
session = requests.Session()
session.headers.update({"User-Agent": "SecurityScanner/1.0"})
login = session.post("https://api.example.com/login", json=creds)
dashboard = session.get("https://api.example.com/dashboard")
```

### Security Best Practices

- **Always set timeouts** — Prevent hanging requests
- **Verify SSL** — Don't disable in production
- **Handle exceptions** — Network errors, HTTP errors
- **Rate limiting** — Don't overwhelm targets

---

## Paramiko — SSH Automation

**Purpose:** Pure-Python SSHv2 implementation for remote server management

**Installation:**
```bash
pip install paramiko
```

### SSH Connection

```python
import paramiko

# Key-based authentication
key = paramiko.RSAKey.from_private_key_file("/home/user/.ssh/id_rsa")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

client.connect(
    hostname="192.168.1.10",
    username="admin",
    pkey=key,
    timeout=10
)

# Execute command
stdin, stdout, stderr = client.exec_command("uname -a")
print(stdout.read().decode())

client.close()
```

### SFTP File Transfer

```python
# Secure file transfer
transport = paramiko.Transport(("192.168.1.10", 22))
transport.connect(username="admin", password="secret")  # Use keys in production

sftp = paramiko.SFTPClient.from_transport(transport)

# Upload
sftp.put("local_file.txt", "/remote/path/file.txt")

# Download
sftp.get("/var/log/auth.log", "auth.log")

sftp.close()
transport.close()
```

### Security Automation Use Cases

```python
# Automated hardening check
def check_ssh_config(host, username, key_file):
    """Verify SSH security settings on remote host."""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    client.connect(hostname=host, username=username, key_filename=key_file)
    
    # Check SSH config
    _, stdout, _ = client.exec_command("cat /etc/ssh/sshd_config")
    config = stdout.read().decode()
    
    issues = []
    if "PermitRootLogin yes" in config:
        issues.append("Root login enabled")
    if "PasswordAuthentication yes" in config:
        issues.append("Password authentication enabled")
    
    client.close()
    return issues
```

---

## Scapy — Packet Crafting and Analysis

**Purpose:** Interactive packet manipulation program for network discovery, scanning, and testing

**Installation:**
```bash
# macOS
brew install libpcap
pip install scapy

# Linux
sudo apt install libpcap-dev
pip install scapy
```

### Basic Packet Creation

```python
from scapy.all import *

# Create IP packet
ip = IP(dst="192.168.1.1")

# Create TCP packet
tcp = TCP(dport=80, flags="S")  # SYN flag

# Combine and send
packet = ip/tcp
response = sr1(packet, timeout=2)

if response:
    print(f"Port 80 is open on {response[IP].src}")
```

### Network Discovery

```python
# ARP scan (local network)
ans, unans = arping("192.168.1.0/24", timeout=2)

for s, r in ans:
    print(f"{r[ARP].psrc} is at {r[ARP].hwsrc}")
```

### Port Scanning

```python
# TCP SYN scan
target = "192.168.1.1"
ports = [22, 80, 443, 3306, 5432]

for port in ports:
    pkt = IP(dst=target)/TCP(dport=port, flags="S")
    resp = sr1(pkt, timeout=1, verbose=0)
    
    if resp is None:
        print(f"Port {port}: Filtered")
    elif resp.haslayer(TCP):
        if resp[TCP].flags == "SA":  # SYN-ACK
            print(f"Port {port}: Open")
            # Send RST to close
            send(IP(dst=target)/TCP(dport=port, flags="R"))
        elif resp[TCP].flags == "RA":  # RST-ACK
            print(f"Port {port}: Closed")
```

### Packet Sniffing

```python
def packet_handler(pkt):
    if pkt.haslayer(TCP) and pkt.haslayer(Raw):
        print(f"{pkt[IP].src}:{pkt[TCP].sport} -> {pkt[IP].dst}:{pkt[TCP].dport}")
        print(f"Payload: {pkt[Raw].load[:100]}")

# Sniff HTTP traffic
sniff(filter="tcp port 80", prn=packet_handler, count=100)
```

---

## Cryptography — Secure Operations

**Purpose:** Cryptographic recipes and primitives for Python

**Installation:**
```bash
pip install cryptography
```

### Fernet (Symmetric Encryption)

```python
from cryptography.fernet import Fernet

# Generate key
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
token = cipher.encrypt(b"Sensitive security data")
print(token)  # URL-safe base64-encoded

# Decrypt
decrypted = cipher.decrypt(token)
print(decrypted.decode())

# Save key securely
with open("secret.key", "wb") as f:
    f.write(key)
```

### Hashing with hashlib

```python
import hashlib

# SHA-256 (recommended)
sha256 = hashlib.sha256()
sha256.update(b"password123")
digest = sha256.hexdigest()
print(digest)

# File integrity check
def file_hash(filepath):
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

# Verify file integrity
if file_hash("document.pdf") == expected_hash:
    print("File integrity verified")
else:
    print("File has been modified!")
```

### Password Hashing

```python
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

# Generate salt
salt = os.urandom(16)

# Key derivation
kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=480000,  # OWASP recommended
)
key = base64.urlsafe_b64encode(kdf.derive(b"user_password"))

# Store: salt + key (salt is not secret)
```

---

## Socket Programming — Low-Level Networking

**Standard Library:** No installation needed

### TCP Client

```python
import socket

def check_port(host, port, timeout=5):
    """Check if port is open."""
    try:
        sock = socket.create_connection((host, port), timeout)
        sock.close()
        return True
    except (socket.timeout, ConnectionRefusedError):
        return False

# Scan range
for port in range(1, 1025):
    if check_port("192.168.1.1", port):
        print(f"Port {port} is open")
```

### Raw Sockets (Requires Privileges)

```python
# ICMP ping (requires root on some systems)
import socket
import struct

def checksum(source):
    """Calculate ICMP checksum."""
    if len(source) % 2:
        source += b'\x00'
    s = sum(struct.unpack('!%dH' % (len(source) // 2), source))
    s = (s & 0xffff) + (s >> 16)
    return ~s & 0xffff
```

---

## Regular Expressions — Pattern Matching

**Standard Library:** `import re`

### Log Parsing

```python
import re

# Parse Apache access log
log_pattern = re.compile(
    r'(?P<ip>\S+)\s+'           # IP address
    r'\S+\s+'                    # ident
    r'\S+\s+'                    # auth user
    r'\[(?P<time>[^\]]+)\]\s+'  # timestamp
    r'"(?P<request>[^"]*)"\s+'   # request
    r'(?P<status>\d+)\s+'        # status
    r'(?P<size>\d+)'             # size
)

line = '192.168.1.1 - - [23/Mar/2026:10:15:30 +0000] "GET /admin HTTP/1.1" 401 523'
match = log_pattern.match(line)
if match:
    print(f"IP: {match.group('ip')}")
    print(f"Status: {match.group('status')}")
```

### IOC Extraction

```python
# Extract indicators of compromise
text = """
Malware contacted 192.168.1.100 and evil-domain.com
Hash: d41d8cd98f00b204e9800998ecf8427e
"""

# IP addresses
ips = re.findall(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', text)

# Domains
domains = re.findall(r'\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\b', text)

# MD5 hashes
hashes = re.findall(r'\b[a-f0-9]{32}\b', text)

print(f"IPs: {ips}")
print(f"Domains: {domains}")
print(f"Hashes: {hashes}")
```

---

## JSON/YAML Parsing — Configuration and Data

### JSON (Standard Library)

```python
import json

# Parse API response
with open("vulnerability_scan.json", "r") as f:
    scan_results = json.load(f)

for vuln in scan_results["vulnerabilities"]:
    print(f"{vuln['cve_id']}: {vuln['severity']}")

# Save results
with open("output.json", "w") as f:
    json.dump(results, f, indent=2)
```

### YAML (PyYAML)

```python
import yaml

# Parse configuration
with open("security_config.yaml", "r") as f:
    config = yaml.safe_load(f)  # Use safe_load for security

print(config["scan_targets"])
print(config["timeout"])

# Security note: yaml.load() can execute arbitrary code
# Always use yaml.safe_load() for untrusted input
```

---

## Subprocess — Running External Tools

**Standard Library:** `import subprocess`

### Safe Execution

```python
import subprocess

def run_scan(target):
    """Run nmap securely with argument list."""
    # Use list, not string (prevents injection)
    result = subprocess.run(
        ["nmap", "-sV", "-p", "22,80,443", target],
        capture_output=True,
        text=True,
        timeout=300
    )
    return result.stdout

# NEVER do this with untrusted input:
# subprocess.run(f"nmap {user_input}", shell=True)  # DANGEROUS
```

### Process Management

```python
# Long-running process with timeout
try:
    result = subprocess.run(
        ["masscan", "-p1-65535", "192.168.1.0/24"],
        capture_output=True,
        text=True,
        timeout=3600  # 1 hour max
    )
except subprocess.TimeoutExpired:
    print("Scan timed out")
```

---

## Key Takeaways

1. **Requests for HTTP/APIs.** SSL verification, session persistence, proxy support. Essential for API security testing.

2. **Paramiko for SSH.** Automate server hardening, remote command execution, secure file transfers.

3. **Scapy for packets.** Build custom scanners, craft packets, analyze traffic. Powerful but requires root privileges.

4. **Cryptography for security.** Fernet for encryption, hashlib for integrity, PBKDF2 for passwords. Don't roll your own crypto.

5. **Subprocess carefully.** Never use `shell=True` with untrusted input. Use argument lists, timeouts, and proper error handling.

---

*"Now you can script security tasks. Last module: automation and orchestration—putting it all together into workflows."

---

## References

- Requests Documentation: https://requests.readthedocs.io/en/latest/
- Requests PyPI: https://pypi.org/project/requests/
- Paramiko Documentation: https://www.paramiko.org/
- Paramiko API Docs: https://docs.paramiko.org/
- Scapy Documentation: https://scapy.readthedocs.io/en/latest/
- Scapy Installation: https://scapy.readthedocs.io/en/latest/installation.html
- Cryptography Documentation: https://cryptography.io/en/latest/
- Cryptography Installation: https://cryptography.io/en/latest/installation/
- Crypto 101 Learning: https://www.crypto101.io/
- Cryptopals Challenges: https://cryptopals.com/
- Python Socket Docs: https://docs.python.org/3/library/socket.html
- Python re Module: https://docs.python.org/3/library/re.html
- Python JSON Module: https://docs.python.org/3/library/json.html
- PyYAML Documentation: https://pyyaml.org/wiki/PyYAMLDocumentation
- Python Subprocess: https://docs.python.org/3/library/subprocess.html
