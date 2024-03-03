-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "elements" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("code", "createdAt", "createdId", "description", "elements", "id", "name") SELECT "code", "createdAt", "createdId", "description", "elements", "id", "name" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE TABLE "new_ForumFields" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "elements" TEXT NOT NULL,
    CONSTRAINT "ForumFields_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ForumFields" ("elements", "id", "userId") SELECT "elements", "id", "userId" FROM "ForumFields";
DROP TABLE "ForumFields";
ALTER TABLE "new_ForumFields" RENAME TO "ForumFields";
CREATE TABLE "new_InviteCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "activatedId" INTEGER,
    "createdId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InviteCode_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InviteCode_activatedId_fkey" FOREIGN KEY ("activatedId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InviteCode_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InviteCode" ("activatedId", "code", "createdAt", "createdId", "id", "roleId", "status") SELECT "activatedId", "code", "createdAt", "createdId", "id", "roleId", "status" FROM "InviteCode";
DROP TABLE "InviteCode";
ALTER TABLE "new_InviteCode" RENAME TO "InviteCode";
CREATE UNIQUE INDEX "InviteCode_activatedId_key" ON "InviteCode"("activatedId");
CREATE TABLE "new_ForumAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "sid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumAccount_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ForumAccount" ("active", "createdAt", "createdId", "id", "login", "password", "sid") SELECT "active", "createdAt", "createdId", "id", "login", "password", "sid" FROM "ForumAccount";
DROP TABLE "ForumAccount";
ALTER TABLE "new_ForumAccount" RENAME TO "ForumAccount";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
