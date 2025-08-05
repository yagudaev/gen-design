-- CreateTable
CREATE TABLE "transcription_records" (
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

    CONSTRAINT "transcription_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transcription_records_userId_idx" ON "transcription_records"("userId");

-- CreateIndex
CREATE INDEX "transcription_records_createdAt_idx" ON "transcription_records"("createdAt");

-- AddForeignKey
ALTER TABLE "transcription_records" ADD CONSTRAINT "transcription_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
