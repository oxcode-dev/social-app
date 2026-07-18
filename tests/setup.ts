import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import  { beforeAll, afterAll, afterEach } from "vitest";
import { MONGO_URI } from "../src/config";

let mongo: MongoMemoryServer;

beforeAll(async () => {

    mongo = await MongoMemoryServer.create();

    await mongoose.connect(MONGO_URI);
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