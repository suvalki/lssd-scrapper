/*
  Warnings:

  - Added the required column `sid` to the `ForumAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForumAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumAccount_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ForumAccount" ("active", "createdAt", "createdId", "id", "login", "password") SELECT "active", "createdAt", "createdId", "id", "login", "password" FROM "ForumAccount";
DROP TABLE "ForumAccount";
ALTER TABLE "new_ForumAccount" RENAME TO "ForumAccount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
