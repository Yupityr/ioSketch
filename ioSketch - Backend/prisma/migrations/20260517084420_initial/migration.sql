-- CreateEnum
CREATE TYPE "answerStatus" AS ENUM ('ANSWERED', 'ANSWERING', 'FORFEIT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sketch" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "status" "answerStatus" NOT NULL DEFAULT 'ANSWERING',
    "sketchURL" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sketch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Sketch" ADD CONSTRAINT "Sketch_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sketch" ADD CONSTRAINT "Sketch_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
