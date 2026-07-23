import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../src/index.ts";
import { logoutUserTest, registerUserTest, UserResponse } from "../helpers/auth.ts";

describe("Logout", () => {
    let user: UserResponse;
    beforeEach(async () => {

        const loginUser = await registerUserTest()

        user = loginUser;

    });

    const endpoint = "/api/auth/logout";

    it("should logout an existing user", async () => {

        const user = await registerUserTest()

        const response = await request(app)
            .delete(endpoint)
            .set("Authorization", `Bearer ${user.token}`);
        
        console.log(response.error)

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        await logoutUserTest(user.token)

    });
})