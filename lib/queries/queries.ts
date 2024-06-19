import bcrypt from 'bcrypt'
import {db} from '../db'
import {tblAdmin} from '../schema'
import {and, eq} from "drizzle-orm";
import {Game, Citizen, Minister, ForeignWorker, LocalWorker, Universe, Player} from '&/gameManager/gameManager';

export const BCRYPT_SALT_ROUNDS = 10;

//test admin users
//username: admin
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
    clearTables
}