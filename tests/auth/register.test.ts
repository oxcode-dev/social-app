// tests/auth/register.test.ts

import request from "supertest";
import bcrypt from "bcryptjs";
import { describe, it, expect } from "vitest";
import app from "../../src/index.ts";
import { User } from "../../src/models/user.ts";


describe("Register", () => {

    const endpoint = "/api/auth/register";

    const payload = {
        first_name: "Samuel",
        last_name: "John",
        username: "sam_john",
        email: "sam@example.com",
        password: "Password123!"
    };

    it("should register a new user", async () => {

        const response = await request(app)
            .post(endpoint)
            .send(payload);

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user.email)
            .toBe(payload.email);

    });

    it("should hash password", async () => {

        await request(app)
            .post(endpoint)
            .send(payload);

        const user = await User.findOne({
            email: payload.email
        }).select("+password");

        console.log(user)

        expect(user).not.toBeNull();

        const match = await bcrypt.compare(
            payload.password,
            user!.password
        );

        expect(match).toBe(true);

    });

    it("should reject duplicate email", async () => {

        await User.create(payload);

        const response = await request(app)
            .post(endpoint)
            .send(payload);

        expect(response.status).toBe(400);

    });

    it("should reject invalid email", async () => {

        const response = await request(app)
            .post(endpoint)
            .send({
                ...payload,
                email: "invalid"
            });

        expect(response.status).toBe(400);

    });

    it("should reject weak password", async () => {

        const response = await request(app)
            .post(endpoint)
            .send({
                ...payload,
                password: "123"
            });

        expect(response.status).toBe(400);

    });

});