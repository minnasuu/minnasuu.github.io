-- AlterTable: Add isDraft column to Article
ALTER TABLE "Article" ADD COLUMN "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- Migrate: Copy all drafts into Article table with isDraft = true
INSERT INTO "Article" ("id", "title", "summary", "content", "publishDate", "tags", "readTime", "coverImage", "link", "type", "isDraft", "createdAt", "updatedAt")
SELECT "id", "title", "summary", "content", "publishDate", "tags", "readTime", "coverImage", "link", "type", true, "createdAt", "updatedAt"
FROM "Draft";

-- DropTable: Remove Draft table
DROP TABLE "Draft";
