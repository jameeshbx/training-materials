-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
