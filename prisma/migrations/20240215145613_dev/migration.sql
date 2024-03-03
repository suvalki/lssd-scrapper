/*
  Warnings:

  - Added the required column `roleId` to the `InviteCode` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "InviteCode_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InviteCode" ("activatedId", "code", "createdAt", "createdId", "id", "status") SELECT "activatedId", "code", "createdAt", "createdId", "id", "status" FROM "InviteCode";
DROP TABLE "InviteCode";
ALTER TABLE "new_InviteCode" RENAME TO "InviteCode";
CREATE UNIQUE INDEX "InviteCode_activatedId_key" ON "InviteCode"("activatedId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
