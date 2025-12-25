-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "size" TEXT,
    "style" TEXT,
    "color" TEXT,
    "gender" TEXT,
    "condition" TEXT,
    "material" TEXT,
    "title" TEXT,
    "description" TEXT,
    "price" REAL,
    "costPrice" REAL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "platform" TEXT,
    "images" TEXT
);
