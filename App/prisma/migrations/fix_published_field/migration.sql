-- Convertir les valeurs existantes en booléens
UPDATE blog_posts
SET published = CASE 
    WHEN published = 'true' THEN 1
    WHEN published = 'false' THEN 0
    WHEN published = 1 THEN 1
    WHEN published = 0 THEN 0
    ELSE 0
END;

-- Modifier le type de la colonne en INTEGER (SQLite n'a pas de type BOOLEAN natif)
ALTER TABLE blog_posts RENAME TO blog_posts_old;
CREATE TABLE blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    published INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    viewCount INTEGER NOT NULL DEFAULT 0,
    readTime INTEGER,
    metaTitle TEXT,
    metaDescription TEXT,
    coverImage TEXT,
    ogImage TEXT,
    categoryId TEXT,
    authorId TEXT,
    tags TEXT NOT NULL,
    publishedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL
);

-- Copier les données de l'ancienne table vers la nouvelle
INSERT INTO blog_posts
SELECT 
    id,
    title,
    slug,
    excerpt,
    content,
    published,
    featured,
    viewCount,
    readTime,
    metaTitle,
    metaDescription,
    coverImage,
    ogImage,
    categoryId,
    authorId,
    tags,
    publishedAt,
    createdAt,
    updatedAt
FROM blog_posts_old;

-- Supprimer l'ancienne table
DROP TABLE blog_posts_old; 