// File: src/lib/db/schema.ts

import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

/**
 * Tabel ini menyimpan informasi pengguna yang mendaftar di aplikasi Anda.
 * Informasi dasar seperti nama, email, dan gambar profil.
 */
export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

/**
 * Tabel ini diperlukan untuk mendukung login melalui penyedia OAuth (Google, GitHub, dll).
 * Setiap baris menghubungkan 'user' dengan akun spesifik di penyedia OAuth.
 */
export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

/**
 * Tabel ini menyimpan sesi login pengguna. Auth.js menggunakan ini
 * untuk memverifikasi siapa yang sedang login.
 */
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

/**
 * Tabel ini digunakan untuk fitur "magic link" atau login tanpa password.
 * Menyimpan token verifikasi yang dikirim ke email pengguna.
 */
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);