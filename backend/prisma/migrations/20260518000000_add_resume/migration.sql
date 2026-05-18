-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "basic" JSONB NOT NULL,
    "selfEvaluation" JSONB NOT NULL,
    "education" JSONB NOT NULL,
    "works" JSONB NOT NULL,
    "projects" JSONB NOT NULL,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);
