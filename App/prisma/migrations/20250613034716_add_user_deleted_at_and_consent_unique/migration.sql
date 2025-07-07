/*
  Warnings:

  - A unique constraint covering the columns `[userId,consentType]` on the table `data_processing_consents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "deletedAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "data_processing_consents_userId_consentType_key" ON "data_processing_consents"("userId", "consentType");
