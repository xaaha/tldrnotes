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

## Comprehensive Note on using PostgreSQL with Podman (Container)

Recently I needed to use different version of `PostgreSQL` on the same machine. While I found several way to version control PostgreSQL, they weren't an elegent solution. So, I decided to use container (podman in this case) to use different version of PostgreSQL.

## 1. Setting Up PostgreSQL with Podman

### 1.1. Pull the PostgreSQL Image

Pull the latest PostgreSQL image:

```bash
podman pull postgres:17.4
```

### 1.2. Create a Volume for Persistent Data

To ensure data persists even after the container is removed:

```bash
podman volume create postgres_data
```

### 1.3. Run the PostgreSQL Container

Run the container with persistent storage and security constraints:

```bash
podman run --name postgresql \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  --security-opt=no-new-privileges:true \
  --cap-drop=ALL \
  --cap-add=CHOWN \
  --cap-add=DAC_OVERRIDE \
  --cap-add=SETGID \
  --cap-add=SETUID \
  docker.io/library/postgres:17.4
```

This is not practical to run this command regularly from the shell. So, the solution is to use a compose file. Docker has `docker-compose.yaml` file. Likewise, Podman has `podmancompose.yaml` file.

### 1.4. Use Podman Compose for Simplification

Install `podman-compose` (use Homebrew, pip, or another installer of your choice):

```bash
brew install podman-compose
```

Create a `podman-compose.yaml` file:

```yaml
services:
  postgresql:
    image: docker.io/library/postgres:17.4
    container_name: postgresql
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - cms_postgres_data:/var/lib/postgresql/data
    ports:
      - 5432:5432
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - DAC_OVERRIDE
      - SETGID
      - SETUID
volumes:
  cms_postgres_data:
    driver: local
```

Run the setup:

```bash
# with installed podman-compose file. `-d` for detached mode
podman-compose up -d
# or this is also acceptable
podman compose -f file-name.yaml up -d # if in root, file name is optional
```

---

## 2. Accessing PostgreSQL

### 2.1. Interactive Terminal

> [!Important]
> This is how you get to Postgres CLI

```bash
podman exec -it postgresql psql -U POSTGRES_USER
```

### 2.2 PostgreSQL Basic Commands

| **Command**                             | **Description**                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `podman ps`                             | List all running containers                                                                          |
| `podman ps -a`                          | List all containers (including stopped ones)                                                         |
| `podman start <container-name>`         | **Start** an **existing container**                                                                  |
| `podman stop <container-name>`          | **Stop** a running **container**                                                                     |
| `podman rm <container-name>`            | **Remove** a stopped **container**                                                                   |
| `podman logs <container-name>`          | **View** container **log**s                                                                          |
| `podman exec -it <container-name> bash` | Access container's shell                                                                             |
| `podman inspect <container-name>`       | View detailed container information                                                                  |
| `\du`                                   | **List Roles**: All roles (users) along with their attributes. Example, SuperUser, Create Role, etc. |
| \l or \list                             | **List** all available **databases**.                                                                |
| \c database_name                        | **Switches** to the specified **database**.                                                          |
| \dt                                     | **List**s all **tables** in the **current schema** (use \dv for views).                              |
| \d table_name                           | **Display**s the **structure** of a **specific table**, including columns, types, and constraints.   |
| \\?                                     | **List**s all available psql **commands** with short descriptions.                                   |
| \r                                      | **Resets** or clears the query buffer.                                                               |
| \q                                      | **Exits PSQL** interactive terminal.                                                                 |

### 2.3 Postgres Data Types

Types are basically a way of defining what kind of data you want to store in a column. For example, you might say “I only want to store integers in this column” or “I only want to store strings that are smaller than 140 characters in this column”.

PostgreSQL supports a [wide variety of data types](https://www.postgresql.org/docs/current/static/datatype.html) but for now we are going to stick with a few of the basic ones.

- `int` - This is used to store integers between -2147483648 and 2147483647.
- `serial` - This is used to store integers between 1 and 2147483647. The big difference between `int` and `serial` is that serial will automatically set a value if you don’t provide one, and the new value will always increase by 1. This is useful for things like the `id` column, where you want every row to have a unique value and are okay with the database deciding what value to use.
- `varchar` - This is like a string in Go or other programming languages, except we have to tell the database what the max length of any string we are storing is going to be.
- `text` - This is a type that is specific to PostgreSQL. This might not be available on other SQL Databases. It is basically the same as `varchar` under the hood, but you don’t have to specify a maximum string length when you declare your field.

With these types we can go about creating some rules about what kind of data can be stored in each column when we declare our tables.

### 2.4 PostgreSQL Constraints

There are [many constraints available in Postgres](https://www.postgresql.org/docs/current/static/ddl-constraints.html) but for now we will mostly be using the following. Below are some of the most commonly used constraints in PostgreSQL.

1. **_UNIQUE_**

   - Ensures that every record in your database has a unique value for the field(s) defined with the UNIQUE constraint.
   - Example Use: Guarantee that no two users share the same email address.
   - Note: PostgreSQL treats text case-sensitively, so "User@example.com" and "user@example.com" would be considered different by default.

1. **_NOT NULL_**

   - Ensures that every record for that field has a value; it prevents the insertion of NULL values.
   - Example Use: For mandatory fields like a user's first name or last name where an empty value should not be allowed.

1. **_PRIMARY KEY_**

   - A combination of `UNIQUE` and `NOT NULL` constraints.
   - Automatically creates an index on the column(s) for faster lookups.
   - Only one primary key is allowed per table.
   - Example Use: Typically used for a table's id to uniquely identify each row.

1. **_FOREIGN KEY_**

   - Ensures the referential integrity of the data in one table to match the data in another table.
   - It creates a link between two tables by ensuring that a value in a column (or a set of columns) matches a value in the primary key or a unique key in another table.
   - Example Use: Linking an order to a customer by ensuring every order’s customer_id exists in the customers table.

1. **_CHECK_**

   - Ensures that the value in a column meets a specific condition.
   - It can validate data by running an expression each time data is inserted or updated.
   - Example Use: Limiting the age of a user: CHECK (age >= 18).

1. **_EXCLUSION (Advanced Constraint)_**

   - Provides a way to ensure that if any two rows are compared on a specified set of columns or expressions using a specified operator, not all comparisons will return true.
   - Often used in scenarios where you need range exclusion, such as ensuring no overlapping time intervals.
   - Example Use: Booking systems to avoid overlapping reservations on the same resource.

1. **_DEFERRABLE and NOT DEFERRABLE (Constraint Timing)_**
   - These keywords aren’t constraints by themselves but modify behavior for constraints such as `FOREIGN KEY` or `UNIQUE`.
   - DEFERRABLE constraints can be deferred until the end of a transaction, allowing temporary violations within a transaction that eventually resolves.
   - Example Use: Complex transactional updates where intermediate states might temporarily violate a unique condition.

---

## 3. Security Best Practices

### 3.1. Create a Superuser

Instead of using the default `root` user:

```sql
CREATE ROLE dbadmin WITH LOGIN SUPERUSER PASSWORD 'secure_password';
```

### 3.2. Application-Specific User

Create a regular user:

```sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_user_password';
GRANT CONNECT ON DATABASE myapp_db TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

### 3.3. Enable SSL/TLS

Generate and configure SSL certificates:

```bash
openssl req -new -x509 -days 365 -nodes -out server.crt -keyout server.key -subj "/CN=postgres"
podman cp server.crt postgresql:/var/lib/postgresql/data/
podman cp server.key postgresql:/var/lib/postgresql/data/
podman exec postgresql chown postgres:postgres /var/lib/postgresql/data/server.*
podman exec postgresql chmod 600 /var/lib/postgresql/data/server.key
```

Enable SSL in PostgreSQL:

```sql
ALTER SYSTEM SET ssl = 'on';
```

---

## 4. Database Management

### 4.1. Create a Database

```sql
CREATE DATABASE myapp_db;
```

### 4.2. Connect to a Database

```sql
\c myapp_db
```

---

## 5. Schema and Table Management

### 5.1. Create a Schema

```sql
CREATE SCHEMA customer_data;
```

### 5.2. Create Tables with Best Practices

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. Data Management

### 6.1. Insert Data

```sql
INSERT INTO customers (first_name, last_name, email)
VALUES ('John', 'Doe', 'john.doe@example.com');
```

### 6.2. Query Data

```sql
SELECT * FROM customers;
```

---

## 7. Backup and Restore

### 7.1. Backup

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

### 7.2. Restore

```bash
podman exec -i postgresql psql -U dbadmin -d myapp_db < myapp_db_backup.sql
```

```shell
# Copy backup to container
podman cp ./my_database_backup.sql postgresql:/tmp/my_database_backup.sql

# Restore database
podman exec -it postgresql bash
psql -U root -d my_database < /tmp/my_database_backup.sql
```

---

## 8. Performance Optimization

### 8.1. Connection Pooling with PgBouncer

Pull and run PgBouncer:

```bash
podman pull edoburu/pgbouncer:latest
podman run --name pgbouncer \
  --link postgresql:postgres \
  -e DATABASE_URL="postgres://dbadmin:secure_password@postgres/myapp_db" \
  -e POOL_MODE=transaction \
  -e MAX_CLIENT_CONN=100 \
  -p 6432:5432 \
  edoburu/pgbouncer:latest
```

---

## 9. Troubleshooting

### 9.1. Common Issues

- **Cannot connect**: Ensure the container is running (`podman ps`) and port `5432` is mapped (`podman port postgresql`).
- **Forgot password**:

  ```sql
  ALTER USER root WITH PASSWORD 'new_password';
  ```

---

## 10. Automate Start up

Ensure container restarts after reboots:

```bash
podman run --name postgresql \
  --restart=always \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  docker.io/library/postgres:17.4
```

---

## 11. Backing Up Volumes

### 11.1. Create a Backup

```bash
tar -czvf postgres_data_backup.tar.gz -C /var/lib/containers/storage/volumes/postgres_data/_data .
```

### 11.2. Restore a Backup

```bash
tar -xzvf postgres_data_backup.tar.gz -C /var/lib/containers/storage/volumes/postgres_data/_data
```
