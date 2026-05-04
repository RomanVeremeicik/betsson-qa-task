import { APIRequestContext } from '@playwright/test';
import { z } from 'zod';

/**
 * Parses and validates an API response body against a Zod schema.
 * Throws a descriptive error if validation fails, making test failures easy to debug.
 */
export async function parseResponse<T>(
  response: { json: () => Promise<unknown>; status: () => number },
  schema: z.ZodSchema<T>
): Promise<T> {
  const body = await response.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new Error(
      `API response schema validation failed:\n${result.error.toString()}\n\nReceived:\n${JSON.stringify(body, null, 2)}`
    );
  }

  return result.data;
}

/**
 * Generates a unique pet ID for test isolation (avoids collisions in shared petstore)
 */
export function generatePetId(): number {
  return Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
}

/**
 * Builds a valid pet payload for POST /pet
 */
export function buildPetPayload(overrides: Partial<{
  id: number;
  name: string;
  status: 'available' | 'pending' | 'sold';
  photoUrls: string[];
}> = {}) {
  return {
    id: overrides.id ?? generatePetId(),
    name: overrides.name ?? 'TestDog',
    category: { id: 1, name: 'Dogs' },
    photoUrls: overrides.photoUrls ?? ['https://example.com/dog.jpg'],
    tags: [{ id: 1, name: 'friendly' }],
    status: overrides.status ?? 'available',
  };
}

/**
 * Retries an API call up to maxRetries times if a condition is not met.
 * Useful for eventually-consistent endpoints.
 */
export async function retryRequest(
  fn: () => Promise<{ status: () => number }>,
  expectedStatus: number,
  maxRetries = 3,
  delayMs = 500
): Promise<{ status: () => number }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fn();
    if (response.status() === expectedStatus) return response;
    if (attempt < maxRetries) await new Promise(r => setTimeout(r, delayMs));
  }
  return fn();
}
