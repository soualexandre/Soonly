import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Seeding database...');

    const password = await bcrypt.hash('123456', 10);

    await prisma.user.createMany({
        data: [
            {
                id: uuidv4(),
                name: 'Alice Silva',
                email: 'alice@example.com',
                passwordHash: password,
            },
            {
                id: uuidv4(),
                name: 'Bruno Oliveira',
                email: 'bruno@example.com',
                passwordHash: password,
            },
            {
                id: uuidv4(),
                name: 'Carla Mendes',
                email: 'carla@example.com',
                passwordHash: password,
            },
        ],
    });

    console.log('✅ Seed completed.');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        //@ts-ignore
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
