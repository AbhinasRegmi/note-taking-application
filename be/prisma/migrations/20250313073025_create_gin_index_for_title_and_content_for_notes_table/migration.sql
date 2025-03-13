-- DropIndex
DROP INDEX "notes_slug_key";

-- DropIndex
DROP INDEX "notes_title_key";

-- AlterTable
ALTER TABLE "notes" 
ADD COLUMN "textsearchable_index_col"
tsvector generated always as (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))) stored;

-- CreateIndex
CREATE INDEX "notes_textsearchable_index_col_idx" ON "notes" USING GIN ("textsearchable_index_col");

-- RenameIndex
ALTER INDEX "notes_title_userId_slug_key" RENAME TO "notes_userId_slug_key";
