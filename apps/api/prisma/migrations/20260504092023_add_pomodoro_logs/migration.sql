-- CreateTable
CREATE TABLE "pomodoro_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "durationMinutes" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pomodoro_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pomodoro_logs_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "pomodoro_logs_userId_idx" ON "pomodoro_logs"("userId");

-- CreateIndex
CREATE INDEX "pomodoro_logs_taskId_idx" ON "pomodoro_logs"("taskId");
