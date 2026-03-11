-- AlterTable: Add isDraft column to Article
ALTER TABLE "Article" ADD COLUMN "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- Migrate: Copy all drafts into Article table with isDraft = true (only if Draft table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Draft') THEN
    INSERT INTO "Article" ("id", "title", "summary", "content", "publishDate", "tags", "readTime", "coverImage", "link", "type", "isDraft", "createdAt", "updatedAt")
    SELECT "id", "title", "summary", "content", "publishDate", "tags", "readTime", "coverImage", "link", "type", true, "createdAt", "updatedAt"
    FROM "Draft";
  END IF;
END $$;

-- DropTable: Remove Draft table (only if exists)
DROP TABLE IF EXISTS "Draft";
