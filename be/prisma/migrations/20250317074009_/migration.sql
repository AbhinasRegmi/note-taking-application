/*
  Warnings:

  - You are about to drop the column `textsearchable_index_col` on the `notes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "notes_textsearchable_index_col_idx";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "textsearchable_index_col";
