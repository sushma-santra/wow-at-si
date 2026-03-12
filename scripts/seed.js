// scripts/seed.js
/**
 * Seed script to initialize the database
 * Usage: node scripts/seed.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Add sample allowed emails
    const allowedEmails = [
      "user1@company.com",
      "user2@company.com",
      "user3@company.com",
      "admin@company.com",
    ];

    console.log("📧 Adding allowed emails...");
    for (const email of allowedEmails) {
      await prisma.allowedEmail.upsert({
        where: { email },
        update: {},
        create: { email },
      });
      console.log(`  ✓ ${email}`);
    }

    console.log("\n✅ Database seed completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Update the allowed emails in your CSV file");
    console.log("2. Upload the CSV through the admin dashboard");
    console.log("3. Start the development server: npm run dev");
    console.log("4. Visit http://localhost:3000 and sign in with Google\n");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
