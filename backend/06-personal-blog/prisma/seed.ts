import { prisma } from '../src/lib/prisma.js';

const main = async() => {
    // delete all records
    await prisma.blog.deleteMany();
    await prisma.user.deleteMany();

    // create user
    // const alice = await prisma.user.create({
    //     data: {
    //         email: 'alice@example.com',
    //         password: 'alice123',
    //         name: 'alice',
    //     }
    // })

    // const post1 = await prisma.blog.create({
    //     data: {
    //         title: 'the first post',
    //         content: 'content of the first post',
    //         user: {
    //             connect: { id: alice.id }
    //         }
    //     }
    // })

    // const post2 = await prisma.blog.create({
    //     data: {
    //         title: 'the second post',
    //         content: 'content of the second post',
    //         user: {
    //             connect: { email: alice.email }
    //         }
    //     }
    // })

    console.log('database has been seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect;
    });