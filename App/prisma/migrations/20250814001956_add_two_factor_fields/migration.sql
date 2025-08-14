/*
  Warnings:

  - You are about to alter the column `featured` on the `blog_posts` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `published` on the `blog_posts` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - Made the column `id` on table `blog_posts` required. This step will fail if there are existing NULL values in that column.

*/
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
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("active", "createdAt", "deletedAt", "email", "emailVerified", "id", "image", "name", "password", "role", "updatedAt") SELECT "active", "createdAt", "deletedAt", "email", "emailVerified", "id", "image", "name", "password", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
