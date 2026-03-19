import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "waitlist.db"));
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS applicants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    twitter_handle TEXT,
    telegram_handle TEXT,
    source TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    referral_code TEXT UNIQUE,
    referred_by_code TEXT,
    ip_address TEXT,
    user_agent TEXT,
    admin_notes TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    confirmed_at TEXT,
    email_sent_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
  CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
  CREATE INDEX IF NOT EXISTS idx_applicants_referral_code ON applicants(referral_code);
  CREATE INDEX IF NOT EXISTS idx_applicants_referred_by ON applicants(referred_by_code);
`);

export default db;
