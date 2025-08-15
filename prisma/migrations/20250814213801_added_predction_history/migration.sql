-- CreateTable
CREATE TABLE "prediction_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "input_summary" JSONB NOT NULL,
    "predictions" JSONB NOT NULL,
    "consensus" JSONB NOT NULL,
    "best_model_name" TEXT NOT NULL,
    "best_prediction" INTEGER NOT NULL,
    "best_prediction_label" TEXT NOT NULL,
    "best_flood_probability" DOUBLE PRECISION NOT NULL,
    "best_confidence" DOUBLE PRECISION NOT NULL,
    "best_model_accuracy" DOUBLE PRECISION NOT NULL,
    "best_model_auc" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prediction_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prediction_history_user_id_idx" ON "prediction_history"("user_id");

-- CreateIndex
CREATE INDEX "prediction_history_created_at_idx" ON "prediction_history"("created_at");

-- AddForeignKey
ALTER TABLE "prediction_history" ADD CONSTRAINT "prediction_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
