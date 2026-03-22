import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const products = [
    {
      slug: 'premium-dog-food',
      name: 'Premium Grain-Free Dog Food',
      description: 'All-natural, grain-free recipe with real chicken. Supports healthy digestion and a shiny coat. 30lb bag.',
      imageUrl: '/images/products/dog-food.jpg',
      unitAmount: 5499,
      currency: 'usd',
    },
    {
      slug: 'interactive-cat-toy',
      name: 'Interactive Feather Wand Toy',
      description: 'Retractable wand with natural feather attachments. Hours of exercise and entertainment for cats of all ages.',
      imageUrl: '/images/products/cat-toy.jpg',
      unitAmount: 1299,
      currency: 'usd',
    },
    {
      slug: 'orthopedic-pet-bed',
      name: 'Orthopedic Memory Foam Pet Bed',
      description: 'Supports joints and muscles with premium memory foam. Machine-washable cover. Available in medium and large.',
      imageUrl: '/images/products/pet-bed.jpg',
      unitAmount: 7999,
      currency: 'usd',
    },
    {
      slug: 'reflective-dog-harness',
      name: 'Reflective No-Pull Dog Harness',
      description: 'Adjustable, padded harness with reflective stitching for nighttime walks. Reduces pulling without choking.',
      imageUrl: '/images/products/dog-harness.jpg',
      unitAmount: 3499,
      currency: 'usd',
    },
    {
      slug: 'automatic-pet-feeder',
      name: 'Smart Automatic Pet Feeder',
      description: 'Programmable 6-meal feeder with portion control. Built-in timer and voice recording to call your pet to eat.',
      imageUrl: '/images/products/auto-feeder.jpg',
      unitAmount: 6999,
      currency: 'usd',
    },
    {
      slug: 'pet-grooming-kit',
      name: 'Professional Grooming Kit',
      description: '7-piece set includes deshedding brush, nail clippers, comb, scissors, and grooming glove. Suitable for dogs and cats.',
      imageUrl: '/images/products/grooming-kit.jpg',
      unitAmount: 2499,
      currency: 'usd',
    },
  ];

  await db.product.createMany({ data: products, skipDuplicates: true });
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
