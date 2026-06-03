-- CreateTable
CREATE TABLE "ai_plan_recommendations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_plan" TEXT NOT NULL,
    "workout_plan" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_plan_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_plan_recommendations_user_id_key" ON "ai_plan_recommendations"("user_id");

-- AddForeignKey
ALTER TABLE "ai_plan_recommendations" ADD CONSTRAINT "ai_plan_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
