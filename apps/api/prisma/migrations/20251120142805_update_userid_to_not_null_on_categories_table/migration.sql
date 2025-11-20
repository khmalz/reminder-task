/*
  Warnings:

  - Made the column `userId` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "categories_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "category_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_categories" ("createdAt", "id", "title", "typeId", "updatedAt", "userId") SELECT "createdAt", "id", "title", "typeId", "updatedAt", "userId" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE INDEX "categories_typeId_idx" ON "categories"("typeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
