-- CreateTable
CREATE TABLE "InviteCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    CONSTRAINT "InviteCode_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "elements" TEXT NOT NULL,
    CONSTRAINT "Template_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ForumAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    CONSTRAINT "ForumAccount_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_code_key" ON "InviteCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_createdId_key" ON "InviteCode"("createdId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_createdId_key" ON "Template"("createdId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumAccount_createdId_key" ON "ForumAccount"("createdId");
