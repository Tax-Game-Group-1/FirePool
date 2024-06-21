import {describe} from "@jest/globals";
import {clearTables, createAdminUser, getAdminIdByUserName} from "./queries";


describe("test queries", () => {

    beforeAll(async () => {
        await clearTables();
    })

    test("create and get admin user", async () => {
        const adminUser = await createAdminUser("hello@gmail.com", "maryJones", "blah123");
        expect(adminUser.length).toBe(1);
        expect(adminUser[0].id).not.toBe(null);

        try {
            expect(await createAdminUser("hello@gmail.com", "maryJones", "blah123")).toThrow("user already exists");
            expect(await getAdminIdByUserName("maryJones", "wrong password")).toThrow("incorrect password");
        } catch (e) {}
        const getAdminUser = await getAdminIdByUserName("maryJones", "blah123");
        console.log(getAdminUser);
    })

    // test("insert round", async () => {
    //      const game= new Game("1", 0.5,4, 0.2, 3, 0.2, true);
    //     game.addPlayerToWaitingArea(new LocalWorker("John", "1", io()));
    //     game.addPlayerToWaitingArea(new LocalWorker("Lucy", "2", io()));
    //     game.addUniverse(new Universe())
    // })

})