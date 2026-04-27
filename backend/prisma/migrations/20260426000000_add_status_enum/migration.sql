-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('paga', 'a_vencer', 'atrasada');

-- AlterTable: migrate existing TEXT values to the new enum type
ALTER TABLE "Conta" ALTER COLUMN "status" TYPE "StatusConta" USING "status"::"StatusConta";
