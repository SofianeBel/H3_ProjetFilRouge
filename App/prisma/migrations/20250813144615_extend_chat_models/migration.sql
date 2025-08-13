/*
  Warnings:

  - You are about to alter the column `featured` on the `blog_posts` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `published` on the `blog_posts` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - Made the column `id` on table `blog_posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN "attachments" JSONB;

-- CreateTable
CREATE TABLE "chat_visitors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "fingerprint" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blog_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "readTime" INTEGER,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "coverImage" TEXT,
    "ogImage" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT,
    "tags" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_blog_posts" ("authorId", "categoryId", "content", "coverImage", "createdAt", "excerpt", "featured", "id", "metaDescription", "metaTitle", "ogImage", "published", "publishedAt", "readTime", "slug", "tags", "title", "updatedAt", "viewCount") SELECT "authorId", "categoryId", "content", "coverImage", "createdAt", "excerpt", "featured", "id", "metaDescription", "metaTitle", "ogImage", "published", "publishedAt", "readTime", "slug", "tags", "title", "updatedAt", "viewCount" FROM "blog_posts";
DROP TABLE "blog_posts";
ALTER TABLE "new_blog_posts" RENAME TO "blog_posts";
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE TABLE "new_chat_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedToUserId" TEXT,
    "lastMessageAt" DATETIME,
    "visitorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chat_conversations_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "chat_conversations_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "chat_conversations_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "chat_visitors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_chat_conversations" ("assignedToUserId", "contactId", "createdAt", "id", "lastMessageAt", "status", "updatedAt") SELECT "assignedToUserId", "contactId", "createdAt", "id", "lastMessageAt", "status", "updatedAt" FROM "chat_conversations";
DROP TABLE "chat_conversations";
ALTER TABLE "new_chat_conversations" RENAME TO "chat_conversations";
CREATE INDEX "chat_conversations_status_lastMessageAt_idx" ON "chat_conversations"("status", "lastMessageAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
