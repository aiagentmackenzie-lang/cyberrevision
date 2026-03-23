# Module 2: Linux Security

*"Alright, you've got the basics down—now let's lock this thing down. Linux isn't secure by default; it's secure by configuration. SELinux, AppArmor, audit trails, SSH hardening—this is where you separate the professionals from the amateurs. In 2026, attackers are automated and persistent. Your defenses need to be systematic and layered."*

---

## Why Linux Security Matters

**Default ≠ Secure.** Linux distributions ship functional, not hardened. Every service running is an attack surface. Every open port is a potential entry point. Your job: minimize exposure, log everything, and detect anomalies.

**Reality Check:** The average time to detect a breach is 287 days. Linux security is about reducing that window to hours or minutes.

---

## Mandatory Access Control — SELinux vs AppArmor

### SELinux (Security-Enhanced Linux)

**Maintained by:** Red Hat, NSA origin
**Default in:** RHEL, CentOS, Fedora, Rocky Linux, AlmaLinux

**How It Works:**
- **Label-based security** — every process, file, port has a security context
- **Type Enforcement (TE)** — processes run in confined domains, can only access allowed types
- **Contexts:** `user:role:type:level` (e.g., `system_u:system_r:httpd_t:s0`)

**SELinux Modes:**

| Mode | Behavior |
|------|----------|
| **Enforcing** | Policy enforced, violations denied |
| **Permissive** | Policy logged but not enforced (troubleshooting) |
| **Disabled** | SELinux completely off |

**Key Commands:**
```bash
getenforce                  # Check current mode
sestatus                    # Detailed status
semanage login -l           # List user mappings
semanage fcontext -l        # File context rules
restorecon -R /var/www      # Restore file contexts
ausearch -m AVC -ts recent  # Check SELinux denials
```

**2026 Status:** RHEL 9 includes improved usability. Targeted policy is default; strict policy for high-security environments.

### AppArmor

**Maintained by:** Canonical (Ubuntu), SUSE
**Default in:** Ubuntu, Debian, SUSE/openSUSE

**How It Works:**
- **Path-based profiles** — easier to understand than SELinux labels
- **Two modes:** Enforce (block violations) or Complain (log only)
- **Text-based profiles** — simple syntax for defining capabilities

**Key Commands:**
```bash
aa-status                   # Check AppArmor status
aa-enforce /etc/apparmor.d/profile    # Enable enforcement
aa-complain /etc/apparmor.d/profile   # Set to complain mode
aa-genprof application      # Generate profile (interactive)
aa-logprof                  # Update profile from logs
```

### SELinux vs AppArmor (2026)

| Factor | SELinux | AppArmor |
|--------|---------|----------|
| Enterprise/Government | ✅ Preferred | ⚠️ |
| Ease of Use | Steep curve | Gentler |
| Granularity | Higher | Good enough |
| Cloud/Containers | ✅ | ✅ |
| Learning Curve | Hard | Easy |

**Bottom Line:** Both work. Use what's default on your distribution. SELinux for maximum security; AppArmor for simplicity.

---

## Intrusion Detection — Know When You're Compromised

### AIDE (Advanced Intrusion Detection Environment)

**What It Does:** Monitors file integrity—alerts when critical files change.

**Monitored Attributes:**
- Permissions, inode, user, group
- Size, modification time, access time, change time
- Checksums: SHA-256, SHA-512, Tiger, RMD160

**Setup:**
```bash
sudo aideinit                 # Initialize database
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
sudo aide --check             # Check for changes
sudo aide --update            # Update database after legitimate changes
```

**2026 Note:** Now dynamically linked by default (static linking deprecated). GPG verification available.

### Modern Alternatives

| Tool | Features | Best For |
|------|----------|----------|
| **OSSEC** | HIDS + log analysis + rootkit detection | Distributed monitoring |
| **Wazuh** | Fork of OSSEC, modern SIEM integration | Enterprise |
| **Samhain** | File integrity + stealth capabilities | High-security environments |

**Best Practice:** Combine file integrity monitoring (AIDE) with log-based anomaly detection (OSSEC/Wazuh).

---

## Logging and Audit — Your Security Camera

### systemd-journald (Modern Default)

**Advantages:**
- **Binary format** with full indexing—searches are fast
- **Structured logging** with metadata (unit, user, PID)
- **Forward Secure Sealing (FSS)** — tamper-evident logs
- **Automatic compression** and rotation

**Key Commands:**
```bash
journalctl -u sshd            # Logs for specific service
journalctl -f                 # Follow in real-time
journalctl --since "1 hour ago"
journalctl -p err             # Only errors and above
journalctl -u nginx --since today | grep "error"
```

**Security Tip:** Enable FSS to detect log tampering:
```bash
sudo systemd-journald-fss-setup  # Initialize sealing
journalctl --verify               # Check integrity
```

### Audit Framework (auditd)

**Purpose:** Low-level system call auditing—track who did what, when.

**Components:**
- `auditd` — Userspace daemon
- `auditctl` — Rule management
- `ausearch` — Log searching
- `aureport` — Report generation

**Critical Rules to Implement:**
```bash
# Monitor user/group changes
-w /etc/passwd -p wa -k identity_changes
-w /etc/group -p wa -k identity_changes
-w /etc/shadow -p wa -k identity_changes
-w /etc/gshadow -p wa -k identity_changes

# Monitor sudoers
-w /etc/sudoers -p wa -k sudoers_changes
-w /etc/sudoers.d/ -p wa -k sudoers_changes

# Monitor SSH keys
-w /etc/ssh/sshd_config -p wa -k ssh_config_changes
-w /root/.ssh/ -p wa -k root_ssh_keys
```

**Analysis:**
```bash
sudo ausearch -k identity_changes    # Search by key
sudo aureport --login                # Login reports
sudo aureport --file                 # File access reports
```

**Boot Parameter:** Add `audit=1` to kernel parameters to ensure all processes are auditable from boot.

---

## SSH Hardening — Lock Down Remote Access

### OpenSSH 9.9 Updates (September 2024)

**Security Changes:**
- **DSA removed** — Disabled by default at compile time
- **Pre-auth compression removed** — Reduces attack surface
- **Post-quantum key exchange:** `mlkem768x25519-sha256` (hybrid ML-KEM + X25519)
- **RefuseConnection option** — Drop at first auth request (brute-force protection)
- **Private key protection** — Excluded from core dumps

### 2026 SSH Hardening Checklist

**Edit `/etc/ssh/sshd_config`:**

```bash
# Authentication
PermitRootLogin no              # Never allow root login
PasswordAuthentication no       # Use keys only
PubkeyAuthentication yes
AuthenticationMethods publickey

# Algorithms (disable weak)
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
KexAlgorithms mlkem768x25519-sha256,curve25519-sha256
MACs hmac-sha2-512-etm@openssh.com

# Session settings
X11Forwarding no                # Disable X11
MaxAuthTries 3                  # Limit attempts
ClientAliveInterval 300         # Keepalive
ClientAliveCountMax 2
LoginGraceTime 30               # Random jitter up to 4s (anti-timing)

# Logging
LogLevel VERBOSE
SyslogFacility AUTH

# Access control (examples)
# AllowUsers user1@10.0.0.* user2@192.168.1.*
# DenyUsers baduser
```

**Post-Quantum Note:** Enable `mlkem768x25519-sha256` for hybrid post-quantum key exchange. Future-proofing against quantum computers.

### SSH Key Management

```bash
# Generate strong key (ed25519 preferred)
ssh-keygen -t ed25519 -C "user@hostname"

# Generate RSA if needed (minimum 4096)
ssh-keygen -t rsa -b 4096 -C "backup@legacy"

# Copy key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# Set correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

**Security Alert:** Never share private keys. Use separate keys per system. Rotate keys periodically.

---

## PAM — Pluggable Authentication

**Purpose:** Modular authentication system—how Linux verifies users.

**Config Path:** `/etc/pam.d/`

**Four Management Groups:**

| Group | Purpose |
|-------|---------|
| `auth` | Verify identity (password, key, biometrics) |
| `account` | Check account validity (expiration, time restrictions) |
| `password` | Password change policies |
| `session` | Session setup/teardown |

### Security Hardening

**Add to `/etc/pam.d/common-auth`:**
```
auth required pam_faillock.so preauth silent deny=5 unlock_time=900
auth required pam_faillock.so authfail deny=5 unlock_time=900
```

**Add to `/etc/pam.d/common-password`:**
```
password required pam_pwquality.so retry=3 minlen=12 dcredit=-1 ucredit=-1 ocredit=-1 lcredit=-1
```

**This enforces:**
- Account lockout after 5 failed attempts
- 15-minute lockout duration
- Passwords minimum 12 characters
- At least one digit, uppercase, lowercase, and special character

---

## Firewalls — Control Network Access

### ufw (Uncomplicated Firewall) — Ubuntu/Debian

**Simplest option for basic needs:**

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw limit ssh                    # Rate limit SSH
sudo ufw enable
sudo ufw status verbose
```

### firewalld — RHEL/CentOS/Fedora

**Zone-based, dynamic management:**

```bash
sudo firewall-cmd --set-default-zone=public
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --remove-service=http
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

### nftables (The Future)

**Modern backend** replacing iptables:
- Better performance
- Unified IPv4/IPv6
- Atomic rule updates

**2026 Status:** Both ufw and firewalld can use nftables backend. Direct nftables for complex scenarios.

---

## Security Scanning — Know Your Gaps

### Lynis — Security Auditing

**Purpose:** Automated security auditing against CIS benchmarks, PCI DSS, HIPAA, etc.

**Usage:**
```bash
sudo lynis audit system
```

**Output:**
- Warnings (fix immediately)
- Suggestions (hardening opportunities)
- Detailed report: `/var/log/lynis-report.dat`

**Workflow:**
1. Run baseline scan
2. Review warnings and suggestions
3. Implement fixes incrementally
4. Re-run to verify improvements
5. Schedule regular scans

---

## Container Security — The New Perimeter

### Rootless Containers (2026 Best Practice)

**Definition:** Running containers as non-root user—not just the container process, but the entire container runtime.

**Benefits:**
- Mitigates container breakout vulnerabilities
- No daemon running as root (Podman)
- Works in shared/HPC environments

### Docker Rootless Mode

```bash
# Install rootless Docker
dockerd-rootless-setuptool.sh install

# Run container
rootlesskit docker run --rm hello-world
```

### Podman (Rootless by Default)

```bash
# No daemon, works without root
podman run -it ubuntu:24.04

# Same commands as Docker
podman build -t myapp .
podman run -d --name web -p 8080:80 myapp
```

### Container Security Checklist (2026)

1. **Run rootless** whenever possible
2. **Scan images** for CVEs (Trivy, Clair, Snyk)
3. **Use minimal base images** (Alpine, Distroless, Scratch)
4. **Drop capabilities** — `--cap-drop=ALL`, add only needed
5. **Read-only rootfs** — `--read-only`
6. **Security profiles** — AppArmor, SELinux, Seccomp
7. **Resource limits** — CPU, memory, PIDs
8. **No privileged containers** in production
9. **Network policies** — Isolate container traffic
10. **No hardcoded secrets** — Use secrets management

---

## Key Takeaways

1. **MAC is mandatory.** SELinux or AppArmor—use it. Don't disable; learn to configure.

2. **SSH hardening is critical.** Keys only, root disabled, post-quantum algorithms, rate limiting.

3. **Log everything.** journald + auditd + remote forwarding. You can't detect what you don't log.

4. **Rootless containers.** The future of container security. Podman makes this easy.

5. **Automate scanning.** Lynis, vulnerability scanners, regular audits. Security is continuous.

---

*"Last module of this course: SQL. The language of databases—and the vector for one of the most common attacks. Let's learn to use it and defend against injection."*
