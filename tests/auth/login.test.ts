// tests/auth/register.test.ts

import request from "supertest";
import bcrypt from "bcryptjs";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../src/index.ts";
import { User } from "../../src/models/user.ts";


describe("Login", () => {

    let req , res;

    beforeEach(() => {
        // Reset mocks before each test
        vi.restoreAllMocks();

        // Re-create fresh, mocked Express response and request objects
        req = { body: {} };
        res = {
            status: vi.fn().mockReturnThis(), // Allows chaining: res.status().json()
            json: vi.fn(),
        };
    });
    const endpoint = "/api/auth/login";

    const payload = {
        email: "sam@example.com",
        password: "Password123!"
    };

    it('should return 400 if email or password is missing', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                email: "sam@example.com",
                // password: "Password123!"
            });

        expect(response.status).toBe(400);
        expect(response.body.status).toBeFalsy();
        // expect(response.body.status).toHaveBeenCalledWith({ error: 'Email and password are required' });
    });

    it("should login an existing user with valid credentials", async () => {
        // Mock the database to return a valid user payload
        // vi.mocked(User.findOne).mockResolvedValue({
        //     email: 'test@example.com',
        //     password: 'correctpassword123',
        //     first_name: "Samuel",
        //     last_name: "John",
        //     username: "sam_john",
        //     id: "123456789",
        //     _id: "123456789",
        //     fullName: "Samuel John",
        //     // email: "sam@example.com",
        //     // password: "Password123!"
        // });

        const response = await request(app)
            .post(endpoint)
            .send(payload);

        console.log(response.body)

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user.email)
            .toBe(payload.email);

    });

});