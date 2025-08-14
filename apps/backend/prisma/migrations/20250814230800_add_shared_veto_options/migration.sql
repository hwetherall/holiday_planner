-- CreateTable
CREATE TABLE "SharedVetoOption" (
    "id" TEXT NOT NULL,
    "vetoText" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedVetoOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedVetoOption_vetoText_key" ON "SharedVetoOption"("vetoText");
