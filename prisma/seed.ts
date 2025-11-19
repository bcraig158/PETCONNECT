// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const data = [
    { slug: 'alpha', name: 'Alpha Gadget', description: 'Sleek everyday gadget.', imageUrl: '/images/alpha.jpg', unitAmount: 19900, currency: 'usd' },
    { slug: 'beta', name: 'Beta Headphones', description: 'Wireless, noise-cancelling.', imageUrl: '/images/beta.jpg', unitAmount: 12900, currency: 'usd' },
    { slug: 'gamma', name: 'Gamma Watch', description: 'Fitness + notifications.', imageUrl: '/images/gamma.jpg', unitAmount: 14900, currency: 'usd' },
    { slug: 'delta', name: 'Delta Charger', description: 'Fast USB-C charging.', imageUrl: '/images/delta.jpg', unitAmount: 3900, currency: 'usd' },
    { slug: 'epsilon', name: 'Epsilon Backpack', description: 'Travel friendly.', imageUrl: '/images/epsilon.jpg', unitAmount: 8900, currency: 'usd' },
    { slug: 'zeta', name: 'Zeta Keyboard', description: 'Mechanical, compact.', imageUrl: '/images/zeta.jpg', unitAmount: 9900, currency: 'usd' },
  ];
  
  await db.product.createMany({ data, skipDuplicates: true });
  console.log('✅ Seeded products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

