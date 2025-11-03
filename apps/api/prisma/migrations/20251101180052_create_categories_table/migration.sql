/*
  Warnings:

  - Added the required column `categoryCollectId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryKindId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryTypeId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "category_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "userId" TEXT,
    CONSTRAINT "categories_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "category_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "categoryKindId" TEXT NOT NULL,
    "categoryTypeId" TEXT NOT NULL,
    "categoryCollectId" TEXT NOT NULL,
    CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tasks_categoryKindId_fkey" FOREIGN KEY ("categoryKindId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tasks_categoryTypeId_fkey" FOREIGN KEY ("categoryTypeId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tasks_categoryCollectId_fkey" FOREIGN KEY ("categoryCollectId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("completed", "createdAt", "id", "title", "userId") SELECT "completed", "createdAt", "id", "title", "userId" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");
CREATE INDEX "tasks_categoryKindId_idx" ON "tasks"("categoryKindId");
CREATE INDEX "tasks_categoryTypeId_idx" ON "tasks"("categoryTypeId");
CREATE INDEX "tasks_categoryCollectId_idx" ON "tasks"("categoryCollectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "category_types_name_key" ON "category_types"("name");
