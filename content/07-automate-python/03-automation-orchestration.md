# Module 3: Automation and Orchestration

*"Alright, final module of this course. You've got the fundamentals, you know the libraries—now let's build workflows. Ansible for infrastructure automation, APIs for integration, scheduling for periodic tasks, logging for audit trails. In 2026, security automation isn't a luxury; it's a necessity. Manual tasks don't scale. Automation does."

---

## Why Automation Matters

**Scale.** A security team of 5 can't manually check 10,000 endpoints. Automation turns impossible tasks into scheduled jobs that run while you sleep.

**Consistency.** Humans make mistakes. Automation does the same thing, the same way, every time.

**Speed.** Incident response measured in minutes, not hours. Vulnerability scans that finish overnight.

---

## Ansible — Infrastructure Automation

**Purpose:** Agentless automation for configuration management, application deployment, and orchestration

**Installation:**
```bash
# macOS
brew install ansible

# Ubuntu/Debian
sudo apt install ansible

# Python pip
pip install ansible
```

### Ansible Concepts

| Component | Purpose |
|-----------|---------|
| **Inventory** | List of managed hosts |
| **Playbook** | YAML file defining tasks |
| **Module** | Pre-built automation units |
| **Role** | Reusable collection of tasks |
| **Vault** | Encrypted secrets storage |

### Basic Playbook

```yaml
# security_hardening.yml
---
- name: Security Hardening Playbook
  hosts: webservers
  become: yes
  
  tasks:
    - name: Ensure SSH is configured securely
      ansible.builtin.lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "^PermitRootLogin"
        line: "PermitRootLogin no"
        validate: '/usr/sbin/sshd -t -f %s'
      notify: Restart SSH
    
    - name: Ensure firewall is enabled
      ansible.builtin.service:
        name: ufw
        state: started
        enabled: yes
    
    - name: Install security updates
      ansible.builtin.apt:
        upgrade: dist
        update_cache: yes
        cache_valid_time: 3600

  handlers:
    - name: Restart SSH
      ansible.builtin.service:
        name: ssh
        state: restarted
```

### Security Automation Examples

```yaml
# vulnerability_scan.yml
---
- name: Run Vulnerability Scan
  hosts: all
  gather_facts: no
  
  tasks:
    - name: Install Nessus Agent
      ansible.builtin.package:
        name: nessus-agent
        state: present
    
    - name: Configure Nessus Agent
      ansible.builtin.template:
        src: nessus_config.j2
        dest: /opt/nessus_agent/etc/nessus-config.json
        mode: '0600'
    
    - name: Start Nessus Agent
      ansible.builtin.service:
        name: nessus-agent
        state: started
        enabled: yes
    
    - name: Link agent to scanner
      ansible.builtin.command: >
        /opt/nessus_agent/sbin/nessuscli agent link
        --key={{ nessus_key }}
        --host={{ nessus_server }}
        --port=8834
      register: link_result
      changed_when: "'Linked to' in link_result.stdout"
```

### Ansible Vault for Secrets

```bash
# Create encrypted vault
ansible-vault create secrets.yml

# Edit encrypted vault
ansible-vault edit secrets.yml

# Run playbook with vault
ansible-playbook -i inventory site.yml --ask-vault-pass
ansible-playbook -i inventory site.yml --vault-password-file vault_pass.txt
```

---

## API Integration — Connecting Systems

### REST API Patterns

```python
import requests
from typing import Dict, Any

class SecurityAPI:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def get_vulnerabilities(self, severity: str = "critical") -> Dict[str, Any]:
        """Fetch vulnerabilities from security platform."""
        response = requests.get(
            f"{self.base_url}/api/v1/vulnerabilities",
            headers=self.headers,
            params={"severity": severity},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    
    def create_incident(self, title: str, description: str) -> Dict[str, Any]:
        """Create security incident ticket."""
        payload = {
            "title": title,
            "description": description,
            "priority": "high",
            "category": "security"
        }
        response = requests.post(
            f"{self.base_url}/api/v1/incidents",
            headers=self.headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
```

### GraphQL APIs

```python
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Setup GraphQL client
transport = RequestsHTTPTransport(
    url="https://api.securityplatform.com/graphql",
    headers={"Authorization": "Bearer token123"},
    verify=True
)

client = Client(transport=transport, fetch_schema_from_transport=True)

# Query
discover_query = gql("""
    query GetVulnerabilities($severity: Severity!) {
        vulnerabilities(severity: $severity) {
            id
            cveId
            severity
            affectedHosts {
                hostname
                ipAddress
            }
        }
    }
""")

result = client.execute(discover_query, variable_values={"severity": "CRITICAL"})
```

---

## Web Scraping — OSINT Automation

### Scrapy Framework

**Installation:**
```bash
pip install scrapy
```

**Security Use Cases:** CVE monitoring, security bulletins, threat intelligence

```python
# security_spider.py
import scrapy

class CVESpider(scrapy.Spider):
    name = "cve_spider"
    start_urls = ["https://cve.mitre.org/data/downloads/index.html"]
    
    def parse(self, response):
        # Extract CVE download links
        for link in response.css('a[href$=".csv"]'):
            yield {
                'filename': link.css('::text').get(),
                'url': response.urljoin(link.attrib['href'])
            }
        
        # Follow pagination
        next_page = response.css('a.next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
```

**Run Scrapy:**
```bash
scrapy crawl cve_spider -o cves.json
```

### BeautifulSoup — Quick Parsing

```python
from bs4 import BeautifulSoup
import requests

def parse_security_advisory(url: str) -> dict:
    """Parse security advisory HTML."""
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract CVE IDs
    cve_pattern = re.compile(r'CVE-\d{4}-\d+')
    cves = cve_pattern.findall(soup.get_text())
    
    # Extract severity
    severity_elem = soup.find('span', class_='severity')
    severity = severity_elem.text if severity_elem else "Unknown"
    
    return {
        "cves": list(set(cves)),
        "severity": severity,
        "url": url
    }
```

---

## Database Interaction — Storing Security Data

### SQLAlchemy ORM

**Installation:**
```bash
pip install sqlalchemy
```

```python
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class Vulnerability(Base):
    __tablename__ = 'vulnerabilities'
    
    id = Column(Integer, primary_key=True)
    cve_id = Column(String(20), unique=True, nullable=False)
    severity = Column(String(10), nullable=False)
    description = Column(String(500))
    discovered_date = Column(DateTime, default=datetime.utcnow)
    
# Setup
engine = create_engine('sqlite:///security.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

# Usage
session = Session()

# Add vulnerability
vuln = Vulnerability(
    cve_id="CVE-2026-1234",
    severity="Critical",
    description="Remote code execution in..."
)
session.add(vuln)
session.commit()

# Query
critical_vulns = session.query(Vulnerability).filter_by(severity="Critical").all()
for v in critical_vulns:
    print(f"{v.cve_id}: {v.description}")

session.close()
```

---

## Scheduling — Automated Execution

### Schedule Library (Development)

**Installation:**
```bash
pip install schedule
```

```python
import schedule
import time

def vulnerability_scan():
    """Run daily vulnerability scan."""
    print("Starting vulnerability scan...")
    # Scan logic here
    print("Scan complete.")

def compliance_check():
    """Run hourly compliance check."""
    print("Checking compliance...")
    # Check logic here

# Schedule jobs
schedule.every().day.at("02:00").do(vulnerability_scan)
schedule.every().hour.do(compliance_check)

# Keep running
while True:
    schedule.run_pending()
    time.sleep(60)
```

### System Cron (Production)

```bash
# Edit crontab
crontab -e

# Daily scan at 2 AM
0 2 * * * /usr/bin/python3 /opt/security/daily_scan.py >> /var/log/security/scan.log 2>&1

# Weekly report on Mondays at 8 AM
0 8 * * 1 /usr/bin/python3 /opt/security/weekly_report.py

# Hourly health check
0 * * * * /usr/bin/python3 /opt/security/health_check.py
```

---

## Logging — Audit Trails

### Python Logging Module

```python
import logging
from logging.handlers import RotatingFileHandler, SysLogHandler

# Configure logging
def setup_logging():
    logger = logging.getLogger("security_automation")
    logger.setLevel(logging.INFO)
    
    # File handler with rotation
    file_handler = RotatingFileHandler(
        "security.log",
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.INFO)
    
    # Syslog handler (for SIEM integration)
    syslog_handler = SysLogHandler(address=('localhost', 514))
    syslog_handler.setLevel(logging.WARNING)
    
    # Format
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    syslog_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(syslog_handler)
    
    return logger

# Usage
logger = setup_logging()
logger.info("Starting vulnerability scan")
logger.warning("High severity vulnerability detected: CVE-2026-1234")
logger.error("Scan failed: connection timeout")
```

---

## Configuration Management

### Pydantic Settings

**Installation:**
```bash
pip install pydantic-settings
```

```python
from pydantic_settings import BaseSettings
from pydantic import SecretStr

class SecurityConfig(BaseSettings):
    """Configuration with validation and env var support."""
    
    nessus_server: str = "localhost"
    nessus_port: int = 8834
    api_key: SecretStr  # Loaded from env: SECURITY_API_KEY
    timeout: int = 30
    threads: int = 10
    
    class Config:
        env_prefix = "SECURITY_"
        env_file = ".env"

# Usage
config = SecurityConfig()
print(config.nessus_server)
print(config.api_key.get_secret_value())  # Decrypt for use
```

### Environment Variables

```python
import os
from typing import Optional

def get_config() -> dict:
    """Load configuration from environment."""
    return {
        "nessus_server": os.getenv("NESSUS_SERVER", "localhost"),
        "nessus_api_key": os.getenv("NESSUS_API_KEY"),
        "timeout": int(os.getenv("SCAN_TIMEOUT", "30")),
        "log_level": os.getenv("LOG_LEVEL", "INFO")
    }

# Validate required config
config = get_config()
if not config["nessus_api_key"]:
    raise ValueError("NESSUS_API_KEY environment variable required")
```

---

## Complete Security Automation Workflow

### Example: Automated Vulnerability Management

```python
#!/usr/bin/env python3
"""
Automated Vulnerability Management Workflow
- Scan for vulnerabilities
- Query threat intelligence
- Create tickets for critical findings
- Send notification
"""

import logging
import schedule
from datetime import datetime
from typing import List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def run_vulnerability_scan() -> List[dict]:
    """Run vulnerability scan and return findings."""
    logger.info("Starting vulnerability scan")
    # Implementation with Nessus API
    return []

def enrich_with_threat_intel(vulns: List[dict]) -> List[dict]:
    """Enrich vulnerabilities with EPSS scores."""
    logger.info("Enriching with threat intelligence")
    # Query EPSS API
    return vulns

def create_tickets(critical_vulns: List[dict]):
    """Create incident tickets for critical findings."""
    logger.info(f"Creating tickets for {len(critical_vulns)} critical vulnerabilities")
    # Integration with ticketing system

def send_notification(count: int):
    """Send summary notification."""
    logger.info(f"Sending notification: {count} vulnerabilities found")
    # Send email/Slack notification

def daily_workflow():
    """Execute complete vulnerability management workflow."""
    try:
        # 1. Scan
        vulns = run_vulnerability_scan()
        
        # 2. Enrich
        enriched = enrich_with_threat_intel(vulns)
        
        # 3. Filter critical
        critical = [v for v in enriched if v["severity"] == "Critical"]
        
        # 4. Create tickets
        if critical:
            create_tickets(critical)
        
        # 5. Notify
        send_notification(len(vulns))
        
        logger.info("Workflow completed successfully")
        
    except Exception as e:
        logger.error(f"Workflow failed: {e}")
        raise

# Schedule
schedule.every().day.at("02:00").do(daily_workflow)

if __name__ == "__main__":
    logger.info("Security automation service started")
    while True:
        schedule.run_pending()
        time.sleep(60)
```

---

## Key Takeaways

1. **Ansible for infrastructure.** Playbooks, roles, vault for secrets. Agentless, idempotent, scalable.

2. **APIs connect everything.** REST and GraphQL for SIEM, ticketing, threat intelligence integration.

3. **Schedule wisely.** Schedule library for dev/testing, system cron for production. Log everything.

4. **Configuration matters.** Pydantic for type-safe config, environment variables for secrets. Never hardcode credentials.

5. **Logging is auditing.** Security automation must be auditable. Log start, end, actions, errors.

---

## Course 7 Summary

| Module | Key Topics |
|--------|------------|
| **Python Fundamentals** | 3.12/3.13 features, data structures, file handling, error handling |
| **Security Scripting** | Requests, Paramiko, Scapy, Cryptography, hashlib |
| **Automation & Orchestration** | Ansible, APIs, web scraping, scheduling, logging |

**Status:** ✅ **Complete**

---

*"Course 7 complete. You can now automate security tasks with Python. Last course: Put It to Work—portfolio building, interview prep, and career development."

---

## References

- Ansible Documentation: https://docs.ansible.com/ansible/latest/
- Ansible Network Automation: https://docs.ansible.com/ansible/latest/network/getting_started/index.html
- Ansible Project Site: https://ansible.com
- Scrapy Documentation: https://docs.scrapy.org/en/latest/
- Scrapy Project Site: https://scrapy.org/
- BeautifulSoup Documentation: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
- BeautifulSoup Project Page: https://www.crummy.com/software/BeautifulSoup/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/en/20/
- SQLAlchemy Tutorial: https://docs.sqlalchemy.org/en/20/tutorial/index.html
- Schedule Library: https://schedule.readthedocs.io/en/stable/
- Schedule GitHub: https://github.com/dbader/schedule
- Pydantic Settings: https://pydantic-settings.readthedocs.io/en/latest/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- Uvicorn Documentation: https://www.uvicorn.org/
- GQL (GraphQL): https://gql.readthedocs.io/en/stable/
- GQL GitHub: https://github.com/graphql-python/gql
- Python Logging: https://docs.python.org/3/library/logging.html
