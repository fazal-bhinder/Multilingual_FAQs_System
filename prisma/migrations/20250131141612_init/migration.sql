-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "translations" JSONB NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);
