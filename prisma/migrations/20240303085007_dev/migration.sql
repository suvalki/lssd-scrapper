-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "forumUserCreated" TEXT NOT NULL,
    "answers" INTEGER NOT NULL,
    "createdId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Topic_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Topic" ("answers", "createdAt", "createdId", "forumUserCreated", "id", "name", "pages", "topicId") SELECT "answers", "createdAt", "createdId", "forumUserCreated", "id", "name", "pages", "topicId" FROM "Topic";
DROP TABLE "Topic";
ALTER TABLE "new_Topic" RENAME TO "Topic";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
