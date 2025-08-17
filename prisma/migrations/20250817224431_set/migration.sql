-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "contactId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
