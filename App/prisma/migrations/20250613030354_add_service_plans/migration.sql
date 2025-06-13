-- CreateTable
CREATE TABLE "service_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "features" JSONB,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "originalPrice" INTEGER,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "maxUsers" INTEGER,
    "maxDevices" INTEGER,
    "duration" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_plans_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "service_plans_serviceId_slug_key" ON "service_plans"("serviceId", "slug");
