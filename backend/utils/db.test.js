const { login, signup } = require("./db")


describe("DB functiont testing", () => {
    test("Login as admin with correct credentials", async () => {
        expect(await login('admin', 'password')).toBe(true);
    })

    test("Login as admin with wrong credentials", async () => {
        expect(await login('admin', 'password1')).toBe(false);
    })

    test("Sign up as admin which already exists", async () => {
        expect(await signup('admin', 'password1')).toBe(false)
    })
    
    test("Sign up as user which does not exists", async () => {
        expect(await login('user1', 'password1')).toBe(false)
        expect(await signup('user1', 'password1')).toBe(true)
        expect(await login('user1', 'password1')).toBe(true)
    })
})