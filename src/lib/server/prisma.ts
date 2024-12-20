import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: ReturnType<typeof prismaWithExtensions> | undefined;
}

console.log("🚀 Initializing Prisma with extensions");  // Add this

const prismaWithExtensions = () => {
    console.log("📊 Creating extended Prisma client");  // Add this
    return new PrismaClient({
        log: ['error'],
        datasourceUrl: process.env.DATABASE_URL
    }).$extends({
        query: {
            async $allOperations({ model, operation, args, query }) {
                console.log("⚡️ Before operation:", { model, operation });  // Add this
                const start = performance.now();
                const result = await query(args);
                const end = performance.now();
                const time = end - start;
                
                console.log("✅ Database operation:", {
                    model,
                    operation,
                    args,
                    time: `${time.toFixed(2)}ms`
                });

                return result;
            }
        }
    });
};

const prisma = global.prisma || prismaWithExtensions();

if (process.env.NODE_ENV !== 'production') {
    console.log("🔄 Setting up global prisma instance");  // Add this
    if (!global.prisma) {
        global.prisma = prisma;
    }
}

export { prisma };