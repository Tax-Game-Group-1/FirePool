import { pgTable, integer, serial, text, boolean, doublePrecision} from 'drizzle-orm/pg-core';

/*
    NB: when you change this schema,
    delete dizzle folder, then run:
    npx drizzle-kit generate
    make sure all tables are created beforhand in pg admin
*/
  
export const tblAdmin = pgTable("users", {
    id: serial('id').primaryKey(),
    email: text('email'),
    username: text('username'), // add a fixed length? e.g. { length: 20 }
    password: text('password') // same ^^^
});

export const tblGameInstance = pgTable('gameInstance', {
    gameId: serial('gameId').primaryKey(),
    adminId: integer('adminId').references(() => tblAdmin.id),
    taxCoefficient: doublePrecision("taxCoefficient"),
    maxPlayers: integer("maxPlayers"),
    finePercent: doublePrecision('finePercent'),
    roundNumber: integer("roundNumber"),
    auditProbability: doublePrecision("auditProbability"),
    kickPlayersOnBankruptcy: boolean("kickPlayersOnBankruptcy")
}); 

export const tblPlayer = pgTable('player', {
    playerId: serial('playerId').primaryKey(),
    gameId: integer('gameId').references(() => tblGameInstance.gameId),
    playerName: text('playerName') 
});

export const tblRoundInstance = pgTable('roundInstance', {
    roundId: serial('roundId').primaryKey(),
    gameId: integer('gameId').references(() => tblGameInstance.gameId)
});

export const tblUniverse = pgTable('universe', {
    universeId: serial('universeId').primaryKey(),
    gameId: integer('gameId').references(() => tblGameInstance.gameId),
    ministerId: integer('ministerId'),
    universeName: text('universeName')
});

export const tblUniverseRound = pgTable('universeRound', {
    roundId: integer('roundId').references(() => tblRoundInstance.roundId).primaryKey(),
    universeId: integer('universeId').references(() => tblUniverse.universeId),
    taxRate: integer('taxRate'),
    moneyPool: integer('moneyPool'),
    distributedTaxReturns: integer('distributedTaxReturns')
});

export const tblPlayerRound = pgTable('playerRound', {
    roundId: integer('roundId').references(() => tblRoundInstance.roundId).primaryKey(),
    universeId: integer('universeId').references(() => tblUniverse.universeId),
    playerId: integer('playerId').references(() => tblPlayer.playerId),
    income: integer('income'),
    declaredIncome: integer('declaredIncome'),
    isAudited: boolean('isAudited'),
    isFined: boolean('isFined'),
    totalAssets: integer('totalAssets')
});