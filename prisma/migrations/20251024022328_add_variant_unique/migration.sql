/*
  Warnings:

  - A unique constraint covering the columns `[modelId,year,engine,body]` on the table `VehicleVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `VehicleVariant_modelId_year_engine_body_key` ON `VehicleVariant`(`modelId`, `year`, `engine`, `body`);
