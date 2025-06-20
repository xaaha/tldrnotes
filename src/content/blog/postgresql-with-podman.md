---
title: Using PostgreSQL with Podman
date: 2025-05-01
image:
  {
    src: "/images/using_postgresql_with_podman.jpg",
    alt: "Using PostgreSQL with Podman",
  }
description: Comprehensive guide to using podman container for PostgreSQL
draft: false
category: PostgreSQL Podman
---

## Comprehensive Guide: PostgreSQL with Podman

Recently I needed to use different version of `PostgreSQL` on the same machine. While I found several way to version control PostgreSQL, they weren't an elegent solution. So, I decided to use container (podman in this case) to use different version of PostgreSQL.

## 1. Basic Podman Commands

First, essential Podman commands you'll need:

| **Command**                             | **Description**                              |
| --------------------------------------- | -------------------------------------------- |
| `podman ps`                             | List all running containers                  |
| `podman ps -a`                          | List all containers (including stopped ones) |
| `podman start <container-name>`         | Start an existing container                  |
| `podman stop <container-name>`          | Stop a running container                     |
| `podman rm <container-name>`            | Remove a stopped container                   |
| `podman logs <container-name>`          | View container logs                          |
| `podman exec -it <container-name> bash` | Access container's shell                     |
| `podman inspect <container-name>`       | View detailed container information          |

## 2. Setting Up PostgreSQL Container

### 2.1. Pull the PostgreSQL Image

```bash
podman pull postgres:17.4
```

### 2.2. Create a Volume for Data Persistence

```bash
podman volume create postgres_data
```

### 2.3. Run PostgreSQL with Volume

```bash
podman run --name postgresql \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  docker.io/library/postgres:17.4
```

> [!Note]
> If you don't provide the `--name postgresql` podman will assign a random name, which confused me.

## 3. Managing Your PostgreSQL Container

### 3.1. Basic Container Operations

```bash
# Start container
podman start postgresql

# Stop container
podman stop postgresql

# Remove container (if needed)
podman rm postgresql
```

### 3.2. Accessing PostgreSQL

> [!Important]
> This is how you get to postgres CLI.

```bash
# Access psql terminal
podman exec -it postgresql psql -U root
```

### 3.3. Basic Database Operations

Once in psql terminal:

```sql
-- List databases
\l

-- Switch to postgres database
\c postgres

-- Create a test table
CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exit psql
\q
```

## 4. Volume Management

### 4.1. Volume Commands

```bash
# List volumes
podman volume ls

# Inspect volume
podman volume inspect postgres_data
```

### 4.2. Verify Volume Mounting

```bash
# Check volume mounting
podman inspect postgresql
```

## 5. Backup and Restore

### 5.1. Creating Database Backup

```bash
# Access container
podman exec -it postgresql bash

# Create backup
pg_dump -U root -d my_database > /tmp/my_database_backup.sql

# Exit container
exit

# Copy backup to host
podman cp postgresql:/tmp/my_database_backup.sql ./my_database_backup.sql
```

### 5.2. Restoring from Backup

```bash
# Copy backup to container
podman cp ./my_database_backup.sql postgresql:/tmp/my_database_backup.sql

# Restore database
podman exec -it postgresql bash
psql -U root -d my_database < /tmp/my_database_backup.sql
```

## 6. Automation and Advanced Setup

### 6.1. Auto-restart Configuration

```bash
podman run --name postgresql \
  --restart=always \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  docker.io/library/postgres:17.4
```

### 6.2. Using Same Volume on Different Machines

To use the same volume on different machines:

1. **Back up the volume content**:

   ```bash
   # Create a tar archive of the volume
   podman volume export postgres_data > postgres_data.tar
   ```

2. **On the target machine**:

   ```bash
   # Create a new volume
   podman volume create postgres_data

   # Import the volume data
   podman volume import postgres_data postgres_data.tar
   ```

3. **Mount the volume** on the target machine using the same container configuration as shown in section 2.3.

## 7. Troubleshooting Tips

1. **Connection Issues**:

   ```bash
   # Check port mapping
   podman port postgresql
   ```

2. **Password Reset**:

   ```bash
   # Access container shell
   podman exec -it postgresql bash

   # Access psql
   psql -U root

   # Reset password
   ALTER USER root WITH PASSWORD 'new_password';
   ```

3. **Volume Issues**:
   - Always verify volume mounting using `podman inspect postgresql`
   - Check volume permissions if you encounter access issues
   - Use `podman logs postgresql` to check for volume-related errors
