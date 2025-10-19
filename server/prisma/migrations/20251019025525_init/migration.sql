-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currentPlayers" INTEGER NOT NULL,
    "peakPlayers24h" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "rating" DOUBLE PRECISION,
    "metacritic" INTEGER,
    "genres" TEXT[],
    "image" TEXT,
    "owners" TEXT,
    "positiveReviews" INTEGER,
    "negativeReviews" INTEGER,
    "userScore" INTEGER,
    "averagePlaytime" INTEGER,
    "recentPlaytime" INTEGER,
    "price" TEXT,
    "tags" TEXT[],

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerHistory" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerCount" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalPlayers" INTEGER NOT NULL,
    "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gamesData" JSONB NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsCache" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "image" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "game" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_appId_key" ON "Game"("appId");

-- CreateIndex
CREATE INDEX "Game_currentPlayers_idx" ON "Game"("currentPlayers");

-- CreateIndex
CREATE INDEX "Game_trend_idx" ON "Game"("trend");

-- CreateIndex
CREATE INDEX "PlayerHistory_gameId_timestamp_idx" ON "PlayerHistory"("gameId", "timestamp");

-- CreateIndex
CREATE INDEX "PlayerHistory_timestamp_idx" ON "PlayerHistory"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE INDEX "Country_code_idx" ON "Country"("code");

-- CreateIndex
CREATE INDEX "NewsCache_type_createdAt_idx" ON "NewsCache"("type", "createdAt");

-- CreateIndex
CREATE INDEX "NewsCache_expiresAt_idx" ON "NewsCache"("expiresAt");

-- CreateIndex
CREATE INDEX "ApiLog_endpoint_timestamp_idx" ON "ApiLog"("endpoint", "timestamp");

-- CreateIndex
CREATE INDEX "ApiLog_timestamp_idx" ON "ApiLog"("timestamp");

-- AddForeignKey
ALTER TABLE "PlayerHistory" ADD CONSTRAINT "PlayerHistory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
