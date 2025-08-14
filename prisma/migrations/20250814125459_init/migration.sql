-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "sexe" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "numeroSecu" TEXT NOT NULL,
    "typePatient" TEXT NOT NULL,
    "convention" TEXT NOT NULL,
    "contactUrgence" TEXT NOT NULL,
    "telephoneUrgence" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "antecedents" TEXT NOT NULL,
    "traitements" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "medecinTraitant" TEXT NOT NULL,
    "derniereVisite" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
