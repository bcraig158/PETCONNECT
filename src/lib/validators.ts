// src/lib/validators.ts
import { z } from 'zod';

export const productSelectionSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
});

export const fullCheckoutSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    address1: z.string().min(3),
    address2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
});

