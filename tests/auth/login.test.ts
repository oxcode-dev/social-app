// tests/auth/register.test.ts

import request from "supertest";
import bcrypt from "bcryptjs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../src/index.ts";
import { User } from "../../src/models/user.ts";
import { IUser } from "../../src/types/index.ts";
import { fetchUserByEmail } from "../../src/services/userServices.ts";
import { registerUserTest } from "../helpers/auth.ts";

// Intercept the model module
vi.mock('../../src/models/user.ts', () => {
    return {
        User: {
            findOne: vi.fn(),
            create: vi.fn(),
        },
    };
});

describe("Login", () => {

    const endpoint = "/api/auth/login";

    const payload = {
        email: "sam@example.com",
        password: "Password123!"
    };

    it('should return 400 if email or password is missing', async () => {
        await registerUserTest()
        const response = await request(app)
            .post(endpoint)
            .send({
                email: "sam@example.com",
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBeFalsy();
        // expect(response.body.status).toHaveBeenCalledWith({ error: 'Email and password are required' });
    });

    it("should login an existing user with valid credentials", async () => {

        await registerUserTest()

        const response = await request(app)
            .post(endpoint)
            .send(payload);

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user.email).toBe(payload.email);

    });

});