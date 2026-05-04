import { z } from 'zod';

// --- Pet Schemas ---

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const TagSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
});

export const PetSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: CategorySchema.optional(),
  photoUrls: z.array(z.string()),
  tags: z.array(TagSchema).optional(),
  status: z.enum(['available', 'pending', 'sold']).optional(),
});

export const PetListSchema = z.array(PetSchema);

// --- Order Schemas ---

export const OrderSchema = z.object({
  id: z.number().optional(),
  petId: z.number(),
  quantity: z.number(),
  shipDate: z.string().optional(),
  status: z.enum(['placed', 'approved', 'delivered']).optional(),
  complete: z.boolean().optional(),
});

export const ApiErrorSchema = z.object({
  code: z.number().optional(),
  type: z.string().optional(),
  message: z.string().optional(),
});

// --- Type exports ---
export type Pet = z.infer<typeof PetSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
