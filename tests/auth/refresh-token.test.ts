import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../src/index.ts";
import { deleteUserTest, logoutUserTest, registerUserTest, type UserResponse } from "../helpers/auth.ts";


describe("Refresh Token", () => {
    let user: UserResponse;
    beforeEach(async () => {

        const loginUser = await registerUserTest()

        user = loginUser;

    });

    const endpoint = "/api/auth/refresh-token";

    it('should check if refresh is not valid', async () => {
        await logoutUserTest(user.token)

        const response = await request(app)
            .post(endpoint)
            .set("Authorization", `Bearer ${user.token}`);

        console.log(response.body)

        expect(response.status).toBe(400);
        expect(response.body.status).toBeFalsy();

    });

    // it("should login an existing user with valid credentials", async () => {

    //     // const user = await registerUserTest()
    //     await logoutUserTest(user.token)

    //     const response = await request(app)
    //         .post(endpoint)
    //         .send(payload);

    //     expect(response.status).toBe(201);

    //     expect(response.body.success).toBe(true);

    //     expect(response.body.user.email).toBe(payload.email);

    // });

});