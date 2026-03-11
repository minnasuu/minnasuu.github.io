-- AlterTable: Add isAI column to Article
ALTER TABLE "Article" ADD COLUMN "isAI" BOOLEAN NOT NULL DEFAULT false;
