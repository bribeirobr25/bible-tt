# Database Schema for Phase 7+ (User Features)

**Purpose:** Reference schema for when user-facing features are implemented (bookmarks, reading progress, user accounts, community notes).  
**Status:** Not implemented. Static-first approach (PLAN.md) is correct for Phase 1-6.  
**Use this when:** You need to add user data storage (estimated: Phase 7, 6+ months post-launch).

**Architecture Note:** Content (books, chapters, verses) remains in markdown → SSG. This database stores **user data only**.

---

## PostgreSQL Schema

### Core Translation Tables (Future Reference - Content Stays in Markdown)

These tables are **NOT NEEDED** for Phase 1-6. They're documented here as an alternative architecture if you ever migrate away from static markdown. For now, **ignore these** and use the markdown parser.

```sql
-- THESE ARE NOT IMPLEMENTED - REFERENCE ONLY
-- Content stays in markdown files, not in database

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_pt VARCHAR(100) NOT NULL,
  name_de VARCHAR(100) NOT NULL,
  book_order INT NOT NULL,
  testament VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Similar unused tables: chapters, verses, notes, glossary_terms, cross_references
-- See Plan B proposal for full schema
-- DO NOT IMPLEMENT THESE unless migrating away from markdown
```

---

## User Features Schema (Implement in Phase 7+)

### User Sessions & Preferences

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  
  -- Preferences (client-side storage backup)
  language VARCHAR(10) DEFAULT 'en', -- 'en' | 'pt' | 'de'
  reading_mode VARCHAR(20) DEFAULT 'continuous', -- 'continuous' | 'verse-by-verse'
  edition VARCHAR(50) DEFAULT 'transparent',
  font_size VARCHAR(10) DEFAULT 'medium',
  
  -- Analytics
  first_seen TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW(),
  total_reading_time_minutes INT DEFAULT 0,
  
  INDEX idx_token (session_token),
  INDEX idx_last_seen (last_seen)
);
```

### Bookmarks

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  
  -- Reference to markdown content (by path, not FK)
  book_slug VARCHAR(50) NOT NULL, -- 'genesis'
  chapter_number INT NOT NULL, -- 1
  verse_number INT, -- Optional (can bookmark whole chapter)
  
  -- User note
  note TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Prevent duplicate bookmarks
  UNIQUE(session_id, book_slug, chapter_number, verse_number),
  
  INDEX idx_session (session_id, created_at DESC)
);
```

### Reading Progress

```sql
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  
  -- Reference to content
  book_slug VARCHAR(50) NOT NULL,
  chapter_number INT NOT NULL,
  
  -- Progress tracking
  last_verse_read INT,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  
  -- Time tracking
  reading_time_seconds INT DEFAULT 0,
  last_read_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(session_id, book_slug, chapter_number),
  
  INDEX idx_session_progress (session_id, last_read_at DESC),
  INDEX idx_book_chapter (book_slug, chapter_number)
);
```

### Analytics Events (Lightweight)

```sql
CREATE TABLE reading_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL,
  -- 'chapter_viewed' | 'verse_read' | 'note_expanded' 
  -- 'tier_switched' | 'language_changed' | 'bookmark_created'
  
  -- Context (JSONB for flexibility)
  metadata JSONB,
  -- { book: 'genesis', chapter: 1, verse: 3, tier: 2, duration_ms: 45000 }
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_session_events (session_id, created_at DESC),
  INDEX idx_event_type (event_type, created_at DESC)
);
```

### User Accounts (Optional - Phase 8+)

```sql
-- Only if you want persistent cross-device sync
-- Otherwise, sessions are sufficient (localStorage + optional cloud backup)

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Link anonymous session to user account
  linked_session_id UUID REFERENCES user_sessions(id)
);

-- OAuth providers (if using Clerk/Auth0/NextAuth)
CREATE TABLE auth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google' | 'github' | 'email'
  provider_user_id VARCHAR(255) NOT NULL,
  
  UNIQUE(provider, provider_user_id)
);
```

### Community Notes (Phase 9+ - Complex)

```sql
-- User-submitted study notes alongside TT official notes
-- Requires moderation workflow

CREATE TABLE community_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Reference to verse
  book_slug VARCHAR(50) NOT NULL,
  chapter_number INT NOT NULL,
  verse_number INT NOT NULL,
  
  -- Content
  title VARCHAR(200),
  content TEXT NOT NULL,
  note_type VARCHAR(20), -- Optional categorization like TT notes
  
  -- Moderation
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMP,
  
  -- Engagement
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_verse (book_slug, chapter_number, verse_number, status),
  INDEX idx_user (user_id, created_at DESC),
  INDEX idx_moderation (status, created_at)
);

CREATE TABLE note_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES community_notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote INT NOT NULL, -- 1 = upvote, -1 = downvote
  
  UNIQUE(note_id, user_id),
  
  INDEX idx_note (note_id)
);
```

---

## Indexes for Performance

```sql
-- User sessions
CREATE INDEX idx_sessions_active ON user_sessions(last_seen DESC) 
  WHERE last_seen > NOW() - INTERVAL '30 days';

-- Reading events (time-series optimization)
CREATE INDEX idx_events_recent ON reading_events(created_at DESC) 
  WHERE created_at > NOW() - INTERVAL '7 days';

-- Bookmarks (most recent first)
CREATE INDEX idx_bookmarks_recent ON bookmarks(session_id, created_at DESC);

-- Reading progress (active chapters)
CREATE INDEX idx_progress_active ON reading_progress(session_id, last_read_at DESC) 
  WHERE completed = FALSE;
```

---

## Migration Strategy (When Implementing)

### Phase 7: Basic User Features
1. Implement `user_sessions` table
2. Implement `bookmarks` table
3. Implement `reading_progress` table
4. Deploy with localStorage fallback (works offline, syncs when online)

### Phase 8: User Accounts
1. Implement `users` table
2. Implement `auth_providers` table (OAuth)
3. Migration path: link existing anonymous sessions to user accounts

### Phase 9: Community Features
1. Implement `community_notes` table
2. Implement moderation workflow
3. Implement `note_votes` table

---

## API Endpoints (Phase 7 Reference)

```typescript
// /api/bookmarks
POST   /api/bookmarks              // Create bookmark
GET    /api/bookmarks              // List user's bookmarks
DELETE /api/bookmarks/[id]         // Delete bookmark
PUT    /api/bookmarks/[id]         // Update note

// /api/progress
POST   /api/progress               // Update reading progress
GET    /api/progress               // Get all progress
GET    /api/progress/[book]/[ch]   // Get chapter progress

// /api/session
POST   /api/session                // Create/update session
GET    /api/session/[token]        // Get session data

// /api/events (analytics)
POST   /api/events                 // Track event (batch supported)
```

---

## Environment Variables (Phase 7)

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/bible_tt"
DATABASE_POOL_SIZE=10

# Session
SESSION_SECRET="random-secret-256-bit"
SESSION_MAX_AGE=2592000 # 30 days

# Optional: User accounts
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="random-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

## ORM Setup (Drizzle)

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infrastructure/database/schema.ts',
  out: './src/infrastructure/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

```typescript
// src/infrastructure/database/schema.ts
import { pgTable, uuid, varchar, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  language: varchar('language', { length: 10 }).default('en'),
  readingMode: varchar('reading_mode', { length: 20 }).default('continuous'),
  // ... rest of fields
});

export const bookmarks = pgTable('bookmarks', {
  // ... schema
});
```

---

## Data Flow (Phase 7 Architecture)

```
┌─────────────────────────────────────────────────┐
│ CLIENT (Browser)                                │
│ ┌─────────────────────────────────────────────┐ │
│ │ localStorage (offline-first)                │ │
│ │ - Bookmarks                                 │ │
│ │ - Reading progress                          │ │
│ │ - Preferences                               │ │
│ └─────────────────────────────────────────────┘ │
│              ↕ (sync when online)               │
│ ┌─────────────────────────────────────────────┐ │
│ │ API Client                                  │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│ SERVER (Vercel Edge Functions)                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ API Routes (/api/bookmarks, /api/progress)  │ │
│ └─────────────────────────────────────────────┘ │
│              ↕                                   │
│ ┌─────────────────────────────────────────────┐ │
│ │ Drizzle ORM                                 │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│ DATABASE (Neon PostgreSQL)                       │
│ - user_sessions                                  │
│ - bookmarks                                      │
│ - reading_progress                               │
│ - reading_events                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CONTENT (Still static!)                          │
│ markdown files → SSG → CDN                       │
│ (Unchanged from Phase 1-6)                       │
└─────────────────────────────────────────────────┘
```

---

## Cost Estimation (Phase 7)

### Neon PostgreSQL (Free Tier)
- **Storage:** 0.5GB (sufficient for 10K users' bookmarks/progress)
- **Compute:** 191 hours/month (more than enough for serverless functions)
- **Cost:** $0/month

### When to Upgrade ($19/month Neon Scale)
- **Storage:** > 0.5GB (estimate: ~50K users)
- **Compute:** > 191 hours/month (high traffic)
- **Active connections:** Need more than default pool

**Estimated timeline to paid tier:** 12-18 months post-launch

---

## Testing Strategy (Phase 7)

```typescript
// Test with SQLite in-memory for fast CI
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database(':memory:');
const db = drizzle(sqlite);

describe('Bookmarks', () => {
  beforeEach(async () => {
    // Recreate schema
    await db.execute(sql`CREATE TABLE bookmarks (...)`);
  });
  
  it('should create bookmark', async () => {
    // Test implementation
  });
});
```

---

## Security Considerations (Phase 7)

1. **Session tokens:** Use crypto.randomBytes(32) for token generation
2. **Rate limiting:** Implement per-session rate limits on bookmark creation
3. **Input validation:** Validate book_slug/chapter_number against known content
4. **SQL injection:** Drizzle ORM handles this automatically
5. **CORS:** Restrict API endpoints to your domain only
6. **User data privacy:** No PII except optional email (for accounts)

---

## Monitoring (Phase 7)

```typescript
// Add database query monitoring
import * as Sentry from '@sentry/nextjs';

export async function createBookmark(data: BookmarkInput) {
  const transaction = Sentry.startTransaction({
    op: 'db.query',
    name: 'createBookmark'
  });
  
  try {
    const result = await db.insert(bookmarks).values(data);
    transaction.finish();
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    Sentry.captureException(error);
    throw error;
  }
}
```

---

## Alternative: Serverless Storage (Simpler Than Full Database)

If user features are very lightweight, consider **Vercel KV (Redis)** instead:

```typescript
// Simpler than PostgreSQL for key-value data
import { kv } from '@vercel/kv';

// Store bookmarks
await kv.set(`bookmarks:${sessionId}`, bookmarksArray);

// Retrieve bookmarks
const bookmarks = await kv.get(`bookmarks:${sessionId}`);
```

**Pros:** Simpler, faster, free tier (256MB)  
**Cons:** No relational queries, no analytics aggregation

**When to use:** If you only need bookmarks + progress tracking (no community notes)

---

*Schema saved 2026-04-17 for future reference (Phase 7+)*  
*Do NOT implement this now. Static-first approach (PLAN.md) is correct for Phase 1-6.*
