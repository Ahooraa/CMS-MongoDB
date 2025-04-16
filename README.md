# 📘 MongoDB Document-Based System for Article & Social Interaction Platform

## 📌 Overview
This project implements a document-oriented MongoDB schema to support a multi-functional platform where users can publish articles, interact with content (comments, likes), and manage media and categorization. The system is optimized for flexibility, scalability, and rich data relationships without relying on a relational database.

---

## 📂 Collections Summary

### 1. `users`
Stores core information about each user.  
**Fields**: `fullname`, `email`, `password`, `role`, `is_active`, `last_login`, `join_date`, etc.  
**Roles**: `admin`, `editor`, `reader`

### 2. `userSettings`
One-to-one settings for each user.  
**Fields**: `user_id`, `dark_mode`, `language`, `email_notifications`, `font_size`, `timezone`  
**Relationship**: One-to-One with `users`

### 3. `userLogs`
Tracks actions taken by users in the system.  
**Fields**: `user_id`, `action`, `datetime`, `metadata.device`, `metadata.ip_address`, etc.  
**Relationship**: One-to-Many with `users`

### 4. `articles`
Represents published or drafted articles.  
**Fields**: `title`, `content`, `category_id`, `authors[]`, `published_date`, `status`, `tags[]`, `metadata.read_time`, etc.  
**Relationships**:
- Many-to-Many with `users` (via `authors`)
- Many-to-Many with `tags`
- Many-to-One with `categories`

### 5. `categories`
Hierarchical structure for grouping articles.  
**Fields**: `name`, `parent_id`  
**Relationship**: One-to-Many (self-referencing hierarchy)

### 6. `tags`
Represents reusable labels for articles.  
**Fields**: `name`  
**Relationship**: Many-to-Many with `articles`

### 7. `comments`
Stores user comments on articles.  
**Fields**: `article_id`, `user_id`, `comment_text`, `created_at`, `is_active`, `parent_id`  
**Relationships**:
- One-to-Many with `articles`
- One-to-Many with `users`
- One-to-Many (self) for nested replies

### 8. `likes`
Tracks likes by users on articles or comments.  
**Fields**: `associated_id`, `target_type`, `user_id`, `created_at`  
**Relationships**:
- Many-to-One with `users`
- Many-to-One with either `articles` or `comments`  
**Note**: Enforced unique combination of `user_id`, `associated_id`, `target_type` to prevent duplicates

### 9. `media`
Stores information about uploaded media files.  
**Fields**: `file_url`, `file_type`, `file_size`, `uploaded_by`, `uploaded_date`, `media_type`, `resolution`, `duration`, `quality`  
**Relationship**: Many-to-One with `users`

---

## 🧩 Design Notes
- The system uses **schema validation** via JSON Schema to enforce field types and allowed values.
- Relationships are managed via ObjectId references and `$lookup` aggregation.
- Collections are organized around **real-world entities** and designed for flexibility.
- One-to-One constraint in `userSettings` is enforced via a **unique index on `user_id`**.

---

## 📈 Future Extensions
- Audit trails for content changes  
- Soft delete support via `is_deleted`  
- Full-text search on articles and comments  
- Role-based access enforcement at query level

---

## 🛠 Tools
- MongoDB  
- MongoDB Compass  
- Aggregation Framework  
- JSON Schema Validation

---

## 👤 Author
This project schema is structured for real-world, document-oriented database design and is ready to support scalable feature development.