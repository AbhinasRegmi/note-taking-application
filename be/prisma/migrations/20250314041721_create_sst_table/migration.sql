-- CreateTable
CREATE TABLE "single_sign_in_tokens" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "single_sign_in_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "single_sign_in_tokens_token_idx" ON "single_sign_in_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "single_sign_in_tokens_token_key" ON "single_sign_in_tokens"("token");
