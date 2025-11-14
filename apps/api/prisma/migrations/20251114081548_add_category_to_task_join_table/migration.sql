/*
  Warnings:

  - You are about to drop the `_CategoryToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_CategoryToTask_B_index";

-- DropIndex
DROP INDEX "_CategoryToTask_AB_unique";

-- DropIndex
DROP INDEX "users_username_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CategoryToTask";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "category_to_tasks" (
    "categoryId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,

    PRIMARY KEY ("categoryId", "taskId"),
    CONSTRAINT "category_to_tasks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "category_to_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "categories_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "category_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_categories" ("createdAt", "id", "title", "typeId", "updatedAt", "userId") SELECT "createdAt", "id", "title", "typeId", "updatedAt", "userId" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE INDEX "categories_typeId_idx" ON "categories"("typeId");
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("createdAt", "id", "isCompleted", "title", "updatedAt", "userId") SELECT "createdAt", "id", "isCompleted", "title", "updatedAt", "userId" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "category_to_tasks_taskId_idx" ON "category_to_tasks"("taskId");
