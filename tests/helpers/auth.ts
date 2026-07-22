import request from "supertest";
import app from "../../src";

const payload = {
    first_name: "Samuel",
    last_name: "John",
    username: "sam_john",
    email: "sam@example.com",
    password: "Password123!"
};

type UserResponse = {
    token: string;
    success: boolean;
    message: string; 
    user: { 
        id: string
        email: string
        first_name: string
        last_name: string
        username: string
        avatar: string
        bio: string
    }
}

export async function registerUserTest() : Promise<UserResponse> {

    const response = await request(app)
        .post("/api/auth/register")
        .send(payload);

    return response.body;
}

export async function deleteUserTest(token: string) {

    const response = await request(app)
        .post("/api/profile/delete-account")
        .send(token);

    return response.body;
}