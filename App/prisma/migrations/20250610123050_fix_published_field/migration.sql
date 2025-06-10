/*
  Warnings:

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
    "published" INTEGER NOT NULL DEFAULT 0,
    "featured" INTEGER NOT NULL DEFAULT 0,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
