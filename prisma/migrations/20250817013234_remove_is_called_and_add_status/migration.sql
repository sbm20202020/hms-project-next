/*
  Warnings:

  - You are about to drop the column `isCalled` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" DROP COLUMN "isCalled",
ADD COLUMN     "status" TEXT DEFAULT 'attente';
