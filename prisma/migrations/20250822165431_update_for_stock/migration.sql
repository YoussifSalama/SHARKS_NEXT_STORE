-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "sold" JSONB NOT NULL DEFAULT '{"count": 0}';
