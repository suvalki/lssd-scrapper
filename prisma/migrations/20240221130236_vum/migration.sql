/*
  Warnings:

  - You are about to drop the `ForumFields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ForumFields";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topicId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "forumUserCreated" TEXT NOT NULL,
    "answers" INTEGER NOT NULL,
    "createdId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Topic_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
