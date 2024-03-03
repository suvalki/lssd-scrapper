-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForumAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sid" TEXT NOT NULL,
    "lastCheck" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumAccount_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ForumAccount" ("active", "createdAt", "createdId", "id", "login", "password", "sid") SELECT "active", "createdAt", "createdId", "id", "login", "password", "sid" FROM "ForumAccount";
DROP TABLE "ForumAccount";
ALTER TABLE "new_ForumAccount" RENAME TO "ForumAccount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
