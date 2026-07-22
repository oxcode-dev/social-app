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

    beforeEach(() => {
        vi.clearAllMocks(); // Clear tracking between tests
    });

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
        // Mock the database to return a valid user payload
        // Define what the mocked function should return
        // let mockUser :IUser = {
        //     email: 'test@example.com',
        //     password: 'correctpassword123',
        //     first_name: "Samuel",
        //     last_name: "John",
        //     username: "sam_john",
        //     id: "123456789",
        //     _id: "123456789",
        //     fullName: "Samuel John",
        //     saved: [],
        //     followers: [],
        //     followings: [],
        //     bio: "",
        // }
        // vi.mocked(User.findOne).mockResolvedValue(mockUser);

        // const result = await fetchUserByEmail(mockUser.email);


        const response = await request(app)
            .post(endpoint)
            .send(payload);

        console.log(response.error)

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user.email)
            .toBe(payload.email);

    });

});