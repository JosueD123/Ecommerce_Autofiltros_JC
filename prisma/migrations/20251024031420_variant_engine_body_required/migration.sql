/*
  Warnings:

  - Made the column `engine` on table `vehiclevariant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `body` on table `vehiclevariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `vehiclevariant` MODIFY `engine` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `body` VARCHAR(191) NOT NULL DEFAULT '';
