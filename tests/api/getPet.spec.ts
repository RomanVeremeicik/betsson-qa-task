import { test, expect } from '@playwright/test';
import { PetSchema } from '../../schemas/petstore.schema';
import { parseResponse, buildPetPayload, generatePetId, retryRequest } from '../../utils/apiHelpers';

test.describe('GET /pet/{petId} — Find Pet by ID', () => {
  let sharedPetId: number;

  test.beforeAll(async ({ request }) => {
    sharedPetId = generatePetId();
    const payload = buildPetPayload({ id: sharedPetId, name: 'GetTestDog', status: 'available' });
    await request.post('pet', { data: payload });
  });

  test('TC-API-GET-01: should return 200 and valid schema for existing pet @smoke', async ({ request }) => {
    const response = await retryRequest(() => request.get(`pet/${sharedPetId}`), 200);
    expect(response.status()).toBe(200);
    const pet = await parseResponse(response, PetSchema);
    expect(pet.id).toBe(sharedPetId);
  });

  test('TC-API-GET-02: should return 404 for non-existent pet @regression', async ({ request }) => {
    const response = await request.get('pet/999999999999');
    expect(response.status()).toBe(404);
    const text = await response.text();
    expect(text.length).toBeGreaterThan(0);
  });

  test('TC-API-GET-03: should return error for invalid (non-numeric) pet ID @regression', async ({ request }) => {
    const response = await request.get('pet/not-a-valid-id');
    expect([400, 404, 405]).toContain(response.status());
  });

  test('TC-API-GET-04: should return all fields matching the created pet @regression', async ({ request }) => {
    const petId = generatePetId();
    const payload = buildPetPayload({ id: petId, name: 'DetailCheck', status: 'sold' });
    await request.post('pet', { data: payload });
    const response = await retryRequest(() => request.get(`pet/${petId}`), 200);
    const pet = await parseResponse(response, PetSchema);
    expect(pet.id).toBe(petId);
    expect(pet.name).toBe('DetailCheck');
    expect(pet.status).toBe('sold');
  });
});
