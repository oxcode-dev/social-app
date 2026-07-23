import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../src/index.ts";
import { logoutUserTest, registerUserTest } from "../helpers/auth.ts";

describe("Logout", () => {

    const endpoint = "/api/auth/logout";

    it("should logout an existing user", async () => {

        const user = await registerUserTest()

        const response = await request(app)
            .delete(endpoint)
            .send();

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        await logoutUserTest(user.token)

    });
})