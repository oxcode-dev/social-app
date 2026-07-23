import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { deleteAllUsers, storeUser } from './services/userServices.ts';


async function createUsers(email: string = '') {
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const user = storeUser({
        email: email || faker.internet.email(),
        password: hashedPassword,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        username: faker.phone.number(),
    });

    return user;
}

async function runSeed() {
    await deleteAllUsers();

    await createUsers('user@customer.com');
    await createUsers('user@admin.com');

}

export default runSeed;
