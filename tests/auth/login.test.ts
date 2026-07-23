import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../src/index.ts";
import { deleteUserTest, logoutUserTest, registerUserTest, type UserResponse } from "../helpers/auth.ts";


describe("Login", () => {
    let user: UserResponse;
    beforeEach(async () => {

        const loginUser = await registerUserTest()

        user = loginUser;

    });

    const endpoint = "/api/auth/login";

    const payload = {
        email: "sam@example.com",
        password: "Password123!"
    };

    it('should return 400 if email or password is missing', async () => {
        await logoutUserTest(user.token)

        const response = await request(app)
            .post(endpoint)
            .send({
                email: "sam@example.com",
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBeFalsy();

    });

    it("should login an existing user with valid credentials", async () => {

        await logoutUserTest(user.token)

        const response = await request(app)
            .post(endpoint)
            .send(payload);
        
        // console.log(response.error)

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user.email).toBe(payload.email);

    });

});