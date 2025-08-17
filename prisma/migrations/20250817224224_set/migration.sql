/*
  Warnings:

  - Added the required column `age` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateNaissance` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Contact" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "dateNaissance" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sexe" TEXT,
ADD COLUMN     "ville" TEXT;
