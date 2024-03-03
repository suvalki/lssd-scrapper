/*
  Warnings:

  - Added the required column `status` to the `InviteCode` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ForumAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL
);
INSERT INTO "new_ForumAccount" ("active", "createdId", "id", "login", "password") SELECT "active", "createdId", "id", "login", "password" FROM "ForumAccount";
DROP TABLE "ForumAccount";
ALTER TABLE "new_ForumAccount" RENAME TO "ForumAccount";
CREATE UNIQUE INDEX "ForumAccount_createdId_key" ON "ForumAccount"("createdId");
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "elements" TEXT NOT NULL
);
INSERT INTO "new_Template" ("code", "createdId", "description", "elements", "id", "name") SELECT "code", "createdId", "description", "elements", "id", "name" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_createdId_key" ON "Template"("createdId");
CREATE TABLE "new__PermissionToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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
    "createdId" INTEGER NOT NULL
);
INSERT INTO "new_InviteCode" ("code", "createdId", "id") SELECT "code", "createdId", "id" FROM "InviteCode";
DROP TABLE "InviteCode";
ALTER TABLE "new_InviteCode" RENAME TO "InviteCode";
CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");
CREATE UNIQUE INDEX "InviteCode_activatedId_key" ON "InviteCode"("activatedId");
CREATE UNIQUE INDEX "InviteCode_createdId_key" ON "InviteCode"("createdId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL
);
INSERT INTO "new_User" ("id", "login", "name", "password", "roleId") SELECT "id", "login", "name", "password", "roleId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
CREATE INDEX "User_roleId_idx" ON "User"("roleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
