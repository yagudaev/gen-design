-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "passwordSalt" TEXT,
    "referralSource" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "stripeCustomerId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "totalCredits" INTEGER NOT NULL DEFAULT 10000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "impersonatingUserId" INTEGER,
    "voice" TEXT NOT NULL DEFAULT 'echo',
    "aiContext" TEXT,
    "model" TEXT NOT NULL DEFAULT 'openai',
    CONSTRAINT "User_impersonatingUserId_fkey" FOREIGN KEY ("impersonatingUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "AdminUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "voice" TEXT,
    CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transcription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "transcriptText" TEXT NOT NULL,
    "audioFileName" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "targetApp" TEXT,
    "targetAppBundle" TEXT,
    "deviceName" TEXT,
    "quality" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedAt" DATETIME NOT NULL,
    "processingStatus" TEXT NOT NULL DEFAULT 'completed',
    "processingNotes" TEXT,
    CONSTRAINT "Transcription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_userId_key" ON "AdminUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_slug_key" ON "Conversation"("slug");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

-- CreateIndex
CREATE INDEX "Transcription_userId_idx" ON "Transcription"("userId");

-- CreateIndex
CREATE INDEX "Transcription_createdAt_idx" ON "Transcription"("createdAt");
