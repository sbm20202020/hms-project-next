-- DropForeignKey
ALTER TABLE "public"."DossierPatient" DROP CONSTRAINT "DossierPatient_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Employe" DROP CONSTRAINT "Employe_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- AlterTable
ALTER TABLE "public"."DossierPatient" ALTER COLUMN "patientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Employe" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RolePermission" ALTER COLUMN "roleId" DROP NOT NULL,
ALTER COLUMN "permissionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."DossierPatient" ADD CONSTRAINT "DossierPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employe" ADD CONSTRAINT "Employe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
