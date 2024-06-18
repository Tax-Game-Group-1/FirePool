import {describe} from "@jest/globals";
import {clearTables, createAdminUser, getAdminIdByUserName} from "./queries";

describe("test admin queries", () => {

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
})