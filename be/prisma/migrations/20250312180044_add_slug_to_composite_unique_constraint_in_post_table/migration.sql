/*
  Warnings:

  - A unique constraint covering the columns `[title,userId,slug]` on the table `notes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notes_title_userId_slug_key" ON "notes"("userId", "slug");
