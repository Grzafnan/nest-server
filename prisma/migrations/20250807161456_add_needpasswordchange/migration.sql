-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "needsPasswordChange" BOOLEAN NOT NULL DEFAULT true;
