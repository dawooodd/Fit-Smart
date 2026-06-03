-- CreateTable
CREATE TABLE "daily_ai_summaries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "summary" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_ai_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "daily_ai_summaries_user_id_date_idx" ON "daily_ai_summaries"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_ai_summaries_user_id_date_key" ON "daily_ai_summaries"("user_id", "date");

-- AddForeignKey
ALTER TABLE "daily_ai_summaries" ADD CONSTRAINT "daily_ai_summaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
