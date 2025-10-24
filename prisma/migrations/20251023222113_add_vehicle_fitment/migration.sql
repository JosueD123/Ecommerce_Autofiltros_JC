-- CreateTable
CREATE TABLE `VehicleMake` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VehicleMake_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleModel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `makeId` INTEGER NOT NULL,

    UNIQUE INDEX `VehicleModel_makeId_name_key`(`makeId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleVariant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `engine` VARCHAR(191) NULL,
    `body` VARCHAR(191) NULL,
    `modelId` INTEGER NOT NULL,

    INDEX `VehicleVariant_modelId_year_idx`(`modelId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductFitment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `ProductFitment_productId_variantId_key`(`productId`, `variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VehicleModel` ADD CONSTRAINT `VehicleModel_makeId_fkey` FOREIGN KEY (`makeId`) REFERENCES `VehicleMake`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleVariant` ADD CONSTRAINT `VehicleVariant_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `VehicleModel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductFitment` ADD CONSTRAINT `ProductFitment_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductFitment` ADD CONSTRAINT `ProductFitment_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `VehicleVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
