import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly databasePath = join(process.cwd(), 'data', 'freelanceu.db');
  private db: Database.Database;

  onModuleInit() {
    const directory = dirname(this.databasePath);
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    this.db = new Database(this.databasePath);
    this.db.pragma('foreign_keys = ON');
  }

  onModuleDestroy() {
    this.db?.close();
  }

  connection(): Database.Database {
    return this.db;
  }
}
