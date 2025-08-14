-- CreateTable
CREATE TABLE "SharedActivityOption" (
    "id" TEXT NOT NULL,
    "activityText" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedActivityOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedLocationOption" (
    "id" TEXT NOT NULL,
    "locationText" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedLocationOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedActivityOption_activityText_key" ON "SharedActivityOption"("activityText");

-- CreateIndex
CREATE UNIQUE INDEX "SharedLocationOption_locationText_key" ON "SharedLocationOption"("locationText");
