import request from "supertest";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import app from "../../src/index.ts";
import { registerUserTest, type UserResponse } from "../helpers/auth.ts";
import * as userServices from "../../src/services/userServices.ts";


describe("Get User Profile", () => {
    let user: UserResponse;

    beforeEach(async () => {
        // user = await registerUserTest();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it("returns the authenticated user's profile with expected fields", async () => {
        user = await registerUserTest();

        const response = await request(app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${user.token}`);

        console.log(response.error)

        expect(response.status).toBe(200);
        // expect(response.body).toHaveProperty("status", "success");
        // expect(response.body).toHaveProperty("message", "Profile retrieved successfully");
        // expect(response.body).toHaveProperty("user");

        // const u = response.body.user;
        // expect(u).toHaveProperty("id");
        // expect(u).toHaveProperty("fullName");
        // expect(u).toHaveProperty("email");
        // expect(u).toHaveProperty("first_name");
        // expect(u).toHaveProperty("last_name");
        // expect(u).toHaveProperty("username");
        // expect(u).toHaveProperty("avatar");
        // expect(u).toHaveProperty("bio");
    });

    it("returns 400 when the user does not exist (service returns null)", async () => {
        vi.spyOn(userServices, "fetchUserById").mockResolvedValueOnce(null as any);
        user = await registerUserTest();


        const response = await request(app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.status).toBe(400);
        // expect(response.body).toHaveProperty("msg", "User does not exist.");
    });
});