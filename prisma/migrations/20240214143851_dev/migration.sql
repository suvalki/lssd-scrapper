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
    CONSTRAINT "Template_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("code", "createdAt", "createdId", "description", "elements", "id", "name") SELECT "code", "createdAt", "createdId", "description", "elements", "id", "name" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE TABLE "new_ForumAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ForumAccount_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ForumAccount" ("active", "createdAt", "createdId", "id", "login", "password") SELECT "active", "createdAt", "createdId", "id", "login", "password" FROM "ForumAccount";
DROP TABLE "ForumAccount";
ALTER TABLE "new_ForumAccount" RENAME TO "ForumAccount";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "id", "login", "name", "password", "roleId") SELECT "createdAt", "id", "login", "name", "password", "roleId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
CREATE INDEX "User_roleId_idx" ON "User"("roleId");
CREATE TABLE "new__PermissionToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__PermissionToRole" ("A", "B") SELECT "A", "B" FROM "_PermissionToRole";
DROP TABLE "_PermissionToRole";
ALTER TABLE "new__PermissionToRole" RENAME TO "_PermissionToRole";
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");
CREATE TABLE "new_InviteCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "activatedId" INTEGER,
    "createdId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InviteCode_activatedId_fkey" FOREIGN KEY ("activatedId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InviteCode_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InviteCode" ("activatedId", "code", "createdAt", "createdId", "id", "status") SELECT "activatedId", "code", "createdAt", "createdId", "id", "status" FROM "InviteCode";
DROP TABLE "InviteCode";
ALTER TABLE "new_InviteCode" RENAME TO "InviteCode";
CREATE UNIQUE INDEX "InviteCode_activatedId_key" ON "InviteCode"("activatedId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
