import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import  { beforeAll, afterAll, afterEach } from "vitest";
import { MONGO_URI } from "../src/config";
import supertest, { SuperTest, Test } from "supertest";
import app from "../src";
import { Server } from 'http';

let mongo: MongoMemoryServer;
let server: Server;
let request: any // SuperTest<Test>;

beforeAll(async () => {

    mongo = await MongoMemoryServer.create();

    await mongoose.connect(MONGO_URI);

    server = app.listen(0);

    request = supertest(app);

    // await mongoose.connect(mongo.getUri());

});

afterEach(async () => {

    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {

        await collections[key].deleteMany({});

    }

});

afterAll(async () => {

    await mongoose.connection.close();

    await mongo.stop();

});

