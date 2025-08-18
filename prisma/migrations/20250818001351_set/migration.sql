/*
  Warnings:

  - You are about to drop the column `adresse` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `codePostal` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `dateNaissance` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `numeroSecu` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `sexe` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "adresse",
DROP COLUMN "age",
DROP COLUMN "codePostal",
DROP COLUMN "dateNaissance",
DROP COLUMN "email",
DROP COLUMN "nom",
DROP COLUMN "numeroSecu",
DROP COLUMN "prenom",
DROP COLUMN "sexe",
DROP COLUMN "telephone",
DROP COLUMN "ville";
