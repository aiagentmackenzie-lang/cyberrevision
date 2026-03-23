# Module 1: Linux Fundamentals

*"Alright, listen up. If you're going to work in cybersecurity, you need to be comfortable on the command line. Windows might dominate the desktop, but Linux runs the internet—servers, containers, cloud, IoT, security tools. The shell is your home. Learn to navigate it, or you'll be lost when it matters. Let's get you fluent in Linux."*

---

## Why Linux Matters for Security

**Linux powers the infrastructure:** 96% of web servers, 90% of cloud workloads, 100% of supercomputers. Every security tool worth using runs on Linux. Your SIEM, your vulnerability scanner, your penetration testing distro—all Linux-based.

**The command line is faster.** Point-and-click doesn't scale. When you're investigating a breach at 3 AM, you need to grep logs, pivot through data, and script responses. That happens at the shell.

---

## Distributions — Pick Your Weapon

### For Security Work

| Distro | Best For | Notes |
|--------|----------|-------|
| **Kali Linux** | Penetration testing | Rolling release, 600+ security tools pre-installed |
| **Ubuntu 24.04 LTS** | General purpose | 15-year security maintenance with Pro, massive community |
| **RHEL 10** | Enterprise | FIPS 140-3 certified, ~10 year lifecycle |
| **Fedora 43** | Latest features | Atomic Desktops (Silverblue), bleeding edge |

### 2026 Security-Hardened Distros

| Distro | Purpose | Key Features |
|--------|---------|------------|
| **Qubes OS** | Security by isolation | Xen-based virtualization, compartmentalization |
| **Tails** | Anonymous operations | Tor routing, amnesiac, anti-forensics |
| **Secureblue** | Hardened Fedora | Immutable, verified boot, minimal attack surface |
| **Ubuntu Core** | IoT/embedded | Strict confinement, transactional updates |

**Key Trend (2026):** **Immutable distributions** are gaining traction. Read-only root filesystems prevent tampering—updates are atomic rollbacks. This is the future of secure Linux.

---

## File System Hierarchy — Know Where Things Live

The **Filesystem Hierarchy Standard (FHS 3.0)** defines where everything goes:

| Path | Purpose | Security Relevance |
|------|---------|-------------------|
| `/bin` | Essential commands | Core utilities available in single-user mode |
| `/sbin` | System binaries | Administrative commands (fdisk, reboot) |
| `/etc` | Configuration | **All system configs live here**—backup regularly |
| `/home` | User directories | User data, SSH keys, personal configs |
| `/var` | Variable data | **Logs** (`/var/log`), mail, spool files |
| `/tmp` | Temporary files | World-writable; cleaned on reboot |
| `/proc` | Process info | Virtual filesystem—kernel and process data |
| `/dev` | Device files | Hardware access (disks, terminals) |
| `/opt` | Optional software | Third-party applications |
| `/usr` | User programs | Secondary hierarchy, often read-only |

**2026 Note:** The `/usr` merge trend—`/bin` and `/sbin` are symlinks to `/usr/bin` and `/usr/sbin` on modern Fedora/RHEL. Don't panic if paths seem different.

---

## Command Line Basics — Your Daily Bread

### Navigation

```bash
pwd                     # Where am I?
cd /var/log             # Change directory
cd ~                    # Go home
cd -                    # Go back (previous directory)
ls -la                  # List all files (long format)
ls -lh                  # Human-readable sizes (KB, MB, GB)
find / -name "*.conf"   # Find files by name
locate sshd_config      # Quick search (uses database)
```

### File Operations

```bash
touch file.txt          # Create empty file
cp -r source/ dest/     # Copy recursively
mv old.txt new.txt      # Move/rename
rm -rf dir/             # **DANGEROUS**: Remove recursively
                        # Never run this without verification
ln -s target link       # Symbolic link
tar -czvf backup.tar.gz files/   # Create compressed archive
tar -xzvf backup.tar.gz        # Extract archive
```

**Warning:** `rm -rf /` will destroy your system. Aliases like `alias rm='rm -i'` add safety prompts.

### Viewing Files

```bash
cat file.txt            # Display entire file
less file.txt           # Paginated view (q to quit)
head -n 20 file.txt     # First 20 lines
tail -f /var/log/syslog # Follow log in real-time
grep "error" file.txt   # Search for pattern
grep -i "error" file.txt # Case-insensitive
grep -r "pattern" /etc  # Recursive search
```

**Pro Tip:** `tail -f` is essential for watching logs during incident response. Pipe to `grep` to filter: `tail -f /var/log/auth.log | grep "Failed"`

---

## Bash vs ZSH — Choose Your Shell

| Feature | Bash | ZSH |
|---------|------|-----|
| Default on | Most servers | macOS, many desktops |
| Completion | Basic | Advanced (menu, fuzzy) |
| Plugins | Limited | Oh My Zsh, Prezto, syntax highlighting |
| Speed | Fast | Slightly slower |

**2026 Recommendation:**
- **ZSH for interactive shells** (your daily terminal)—better UX, auto-suggestions, git integration
- **Bash for scripts** (automation)—maximum portability across systems

**ZSH Advantages:**
- Auto-suggestions as you type (gray text, accept with right arrow)
- Syntax highlighting (red = invalid command)
- Shared command history across tabs
- Spelling correction
- Better tab completion

---

## Permissions — The Foundation of Access Control

### Traditional Permissions (chmod)

```bash
# Numeric mode
chmod 755 script.sh     # rwxr-xr-x (owner read/write/execute, group/others read/execute)
chmod 644 file.txt      # rw-r--r-- (owner read/write, group/others read only)
chmod 700 ~/.ssh        # rwx------ (private directory)

# Symbolic mode (safer, more readable)
chmod u+x script.sh     # Add execute for user
chmod go-w file.txt     # Remove write for group and others
chmod +x script.sh      # Add execute for all
```

**Permission Meanings:**

| Octal | Binary | Permissions |
|-------|--------|-------------|
| 7 | 111 | rwx (read, write, execute) |
| 6 | 110 | rw- (read, write) |
| 5 | 101 | r-x (read, execute) |
| 4 | 100 | r-- (read only) |
| 0 | 000 | --- (no access) |

### Ownership (chown)

```bash
chown user:group file.txt        # Change owner and group
chown -R user:group directory/   # Recursive (use carefully)
chown root:root /etc/shadow      # Reset to root ownership
```

### Access Control Lists (ACLs)

Beyond traditional permissions—grant specific users/groups access:

```bash
# View ACLs
getfacl file.txt

# Grant specific user access
setfacl -m u:username:rwx file.txt

# Grant specific group access
setfacl -m g:developers:rw file.txt

# Remove ACL entry
setfacl -x u:username file.txt

# Default ACLs (for new files in directory)
setfacl -d -m u:username:rwx directory/
```

**Security Note:** ACLs are increasingly important in container environments and shared development directories. Traditional permissions are often too coarse.

---

## Users and Groups — Identity Management

### User Management

```bash
# Create user
sudo useradd -m -s /bin/bash username    # -m creates home directory
sudo passwd username                      # Set password
sudo usermod -aG sudo username           # Add to sudo group
sudo userdel -r username                 # Delete user and home directory

# 2026: systemd-homed (new approach for portable users)
sudo homectl create username
sudo homectl update --shell=/bin/zsh username
```

### Group Management

```bash
sudo groupadd developers
sudo gpasswd -a username developers      # Add user to group
sudo gpasswd -d username developers      # Remove from group
groups username                          # Show user's groups
```

### Critical Files

| File | Purpose | Permissions |
|------|---------|-------------|
| `/etc/passwd` | User accounts | 644 (world readable) |
| `/etc/shadow` | **Encrypted passwords** | 640 (root only) |
| `/etc/group` | Group definitions | 644 |
| `/etc/sudoers` | Sudo permissions | 440 (root only) |

**Security Check:** `ls -la /etc/shadow` should show `root:root` ownership and `640` permissions. If it's world-readable, you have a major vulnerability.

---

## Processes — What's Running

### Process Management

```bash
ps aux                      # All processes (detailed)
ps -ef                      # All processes (alternate format)
top                         # Interactive process viewer
htop                        # Enhanced top (if installed)
pgrep firefox               # Find process by name
pkill firefox               # Kill by name
```

### Process Signals

| Command | Signal | Effect |
|---------|--------|--------|
| `kill -15 PID` | SIGTERM | Graceful termination (default) |
| `kill -9 PID` | SIGKILL | Force kill (cannot be caught) |
| `kill -1 PID` | SIGHUP | Reload configuration |
| `killall process` | - | Kill all instances |

**Best Practice:** Always try `-15` first. `-9` is the nuclear option—data loss may occur.

### Background Jobs

```bash
long_running_command &      # Run in background
Ctrl+Z                      # Suspend foreground process
bg                          # Resume in background
fg                          # Bring to foreground
jobs                        # List background jobs
```

---

## systemd — Modern Service Management

### Core Commands

```bash
systemctl status sshd         # Check service status
sudo systemctl start sshd     # Start service
sudo systemctl stop sshd      # Stop service
sudo systemctl restart sshd   # Restart service
sudo systemctl enable sshd    # Start on boot
sudo systemctl disable sshd   # Disable on boot
```

### Logs with journalctl

```bash
journalctl -u sshd            # Logs for specific service
journalctl -f                 # Follow (like tail -f)
journalctl --since "1 hour ago"
journalctl -p err             # Only errors
journalctl -b                 # Current boot only
```

**Security Advantage:** journald uses binary format with cryptographic sealing (Forward Secure Sealing). Tamper-resistant logging.

---

## Package Management

### APT (Debian/Ubuntu)

```bash
sudo apt update               # Update package list
sudo apt upgrade              # Upgrade installed packages
sudo apt install package      # Install package
sudo apt remove package       # Remove package
sudo apt purge package        # Remove + delete configs
sudo apt autoremove           # Clean unused dependencies
apt search keyword            # Search packages
```

### DNF (RHEL/Fedora)

```bash
sudo dnf update               # Update all
sudo dnf install package      # Install
sudo dnf remove package       # Remove
sudo dnf search keyword       # Search
dnf list installed            # List installed packages
```

**2026 Update:** DNF5 is replacing DNF in Fedora 41+—faster with better dependency resolution.

---

## Shell Scripting Basics

### Script Structure

```bash
#!/bin/bash
set -euo pipefail             # Strict mode

# Variables
NAME="Raphael"
readonly VERSION="1.0"        # Constant

# Conditionals
if [[ -f "$file" ]]; then
    echo "File exists"
elif [[ -d "$dir" ]]; then
    echo "Directory exists"
else
    echo "Neither exists"
fi

# Loops
for file in *.txt; do
    echo "Processing: $file"
done

# Functions
backup_file() {
    local filename="$1"
    cp "$filename" "$filename.bak"
}
```

**Security Best Practice:** Always use `set -euo pipefail` at the top of scripts:
- `-e`: Exit on error
- `-u`: Error on undefined variables
- `-o pipefail`: Pipeline fails if any command fails

---

## Key Takeaways

1. **Learn the shell.** Point-and-click won't save you in a breach. Grep, awk, sed—these are your tools.

2. **Permissions are critical.** Understand chmod, chown, ACLs. One wrong permission can expose everything.

3. **systemd is standard.** journalctl, systemctl—master these for modern Linux.

4. **Script safely.** Use strict mode (`set -euo pipefail`), quote variables, validate inputs.

5. **Immutable distros are the future.** Read-only root filesystems prevent tampering. Get familiar with the concept.

---

*"Next up: locking down Linux. SELinux, AppArmor, SSH hardening, audit trails—how to actually secure the systems you're managing."*
