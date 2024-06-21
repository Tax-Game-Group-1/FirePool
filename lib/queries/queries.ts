import bcrypt from 'bcrypt'
import {db} from '../db'
import {tblAdmin, tblGameInstance} from '../schema'
import {and, eq} from "drizzle-orm";
import {Game, Citizen, Minister, ForeignWorker, LocalWorker, Universe, Player} from '&/gameManager/gameManager';

export const BCRYPT_SALT_ROUNDS = 10;

//test admin users
//username: janeDoe123
//password: mypass123

const createAdminUser = async (email: string, username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    //check that user does not exist
    const admin = await db.select().from(tblAdmin).where(eq(tblAdmin.email, email));

    if (!(admin.length == 0)) {
        throw "user already exists";
    }

    return db.insert(tblAdmin).values({
        email: email, password: hashedPassword, username: username
    }).returning({id: tblAdmin.id});
}


const getAdminIdByUserName = async (username: string, password: string) => {
    const result = await db.select({
        id: tblAdmin.id,
        password: tblAdmin.password
    }).from(tblAdmin).where(and(eq(tblAdmin.username, username)));
    if (result.length == 0)
        throw "user not found";
    if (bcrypt.compare(result[0].password, password)) {
        return result[0].id;
    }
    throw "incorrect password";
}


const createGame = async (adminId: number, name: string, taxCoefficient: number, maxPlayers: number, finePercent: number, roundNumber: number, auditProbability: number, kickPlayersOnBankruptcy: boolean) => {
    //test that the game is valid by seeing if you can create an instance
    const testId = "1";
    const testGame = new Game(testId, name, taxCoefficient, maxPlayers, finePercent, roundNumber, auditProbability, kickPlayersOnBankruptcy);

    if (adminId == null)
        throw "Admin ID cannot be null";
    if (taxCoefficient == null)
        throw "Tax coefficient cannot be null";
    if (maxPlayers == null)
        throw "Max players cannot be null";
    if (finePercent == null)
        throw "Fine percent cannot be null";
    if (roundNumber == null)
        throw "Round number cannot be null";
    if (auditProbability == null)
        throw "Audit probability cannot be null";
    if (kickPlayersOnBankruptcy == null)
        throw "Kick players on bankruptcy flag cannot be null";
    if (name == null)
        throw "Name cannot be null"

    /*
    gameId: serial('gameId').primaryKey(),
    adminId: integer('adminId').references(() => tblAdmin.id),
    name: text('name'),
    taxCoefficient: doublePrecision("taxCoefficient"),
    maxPlayers: integer("maxPlayers"),
    finePercent: doublePrecision('finePercent'),
    roundNumber: integer("roundNumber"),
    auditProbability: doublePrecision("auditProbability"),
    kickPlayersOnBank
    */

    //if game created successfully, nothing will be thrown by this point, insert it into the database
    
    console.log("TRYING OT INSERT")
    return await db.insert(tblGameInstance).values({
        adminId: adminId,  
        name: name, 
        taxCoefficient: taxCoefficient, 
        maxPlayers: maxPlayers, 
        finePercent: finePercent, 
        roundNumber: roundNumber,
        auditProbability: auditProbability,
        kickPlayersOnBankruptcy: kickPlayersOnBankruptcy
    }).returning({gameId: tblGameInstance.gameId})
}

const getAdminGames = async (adminId: number) => {
    return await db.select().from(tblGameInstance).where(eq(tblGameInstance.adminId, adminId))
}

const editAdminGame = async (game: Game) => {
    return await db.update(tblGameInstance)
    .set({name : game.name, auditProbability: game.auditProbability, finePercent: game.penalty, kickPlayersOnBankruptcy: game.kickPlayersOnBankruptcy, maxPlayers: game.maxPlayers, roundNumber: game.roundNumber, taxCoefficient: game.taxCoefficient })
    .where(eq(tblGameInstance.gameId, parseInt(game.id)));
}

/*
 get the game manager object
 insert the last round added to the game object
 This function should be called every round
 */
const insertRound = (g: Game) => {

}

const clearTables = async () => {
    try {
        await db.delete(tblAdmin);
    } catch (e) {
        console.error(e);
    }
}

export {
    createAdminUser,
    getAdminIdByUserName,
    clearTables, 
    createGame, 
    getAdminGames
}