/*
  Warnings:

  - You are about to drop the `transcription_records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transcription_records" DROP CONSTRAINT "transcription_records_userId_fkey";

-- DropTable
DROP TABLE "transcription_records";

-- CreateTable
CREATE TABLE "Transcription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "transcriptText" TEXT NOT NULL,
    "audioFileName" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "targetApp" TEXT,
    "targetAppBundle" TEXT,
    "deviceName" TEXT,
    "quality" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "processingStatus" TEXT NOT NULL DEFAULT 'completed',
    "processingNotes" TEXT,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transcription_userId_idx" ON "Transcription"("userId");

-- CreateIndex
CREATE INDEX "Transcription_createdAt_idx" ON "Transcription"("createdAt");

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
