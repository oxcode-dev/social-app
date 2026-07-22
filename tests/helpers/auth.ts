import request from "supertest";
import app from "../../src";

const payload = {
    first_name: "Samuel",
    last_name: "John",
    username: "sam_john",
    email: "sam@example.com",
    password: "Password123!"
};

export async function registerUserTest() {

    const response = await request(app)
        .post("/api/auth/register")
        .send(payload);

    return response.body;
}