// worker/account.ts
import { prisma } from '../server/db.server';

const EXPIRY_MINUTES = 120; 

export async function AccountCleanup() {
  const expiryTime = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);
  
  console.log(`[${new Date().toISOString()}] 🔍 Checking for expired accounts...`);
  
  const expiredCount = await prisma.user.count({
    where: {
      emailVerified: false,
      createdAt: { lt: expiryTime },
      updatedAt: { lt: expiryTime },
    },
  });
  
  if (expiredCount > 0) {
    const result = await prisma.user.deleteMany({
      where: {
        emailVerified: false,
        createdAt: { lt: expiryTime },
        updatedAt: { lt: expiryTime },
      },
    });
    
    console.log(`[${new Date().toISOString()}] 🧹 Deleted ${result.count} expired accounts`);
    return result.count;
  } else {
    console.log(`[${new Date().toISOString()}] ✅ No expired accounts found`);
    return 0;
  }
}