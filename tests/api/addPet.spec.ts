import { test, expect } from '@playwright/test';
import { PetSchema } from '../../schemas/petstore.schema';
import { parseResponse, buildPetPayload, generatePetId } from '../../utils/apiHelpers';

test.describe('POST /pet — Add New Pet', () => {
  test('TC-API-PET-01: should create a pet and return valid schema @smoke', async ({ request }) => {
    const payload = buildPetPayload({ name: 'Buddy', status: 'available' });
    const response = await request.post('pet', { data: payload });
    expect(response.status()).toBe(200);
    const pet = await parseResponse(response, PetSchema);
    expect(pet.name).toBe('Buddy');
    expect(pet.status).toBe('available');
  });

  test('TC-API-PET-02: created pet should be retrievable via GET @regression', async ({ request }) => {
    const petId = generatePetId();
    const payload = buildPetPayload({ id: petId, name: 'Retrievable' });
    await request.post('pet', { data: payload });
    const getResponse = await request.get(`pet/${petId}`);
    expect(getResponse.status()).toBe(200);
    const pet = await parseResponse(getResponse, PetSchema);
    expect(pet.name).toBe('Retrievable');
  });

  test('TC-API-PET-03: should create a pet with all optional fields @regression', async ({ request }) => {
    const payload = buildPetPayload({
      name: 'FullPet',
      status: 'pending',
      photoUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    });
    const response = await request.post('pet', { data: payload });
    expect(response.status()).toBe(200);
    const pet = await parseResponse(response, PetSchema);
    expect(pet.photoUrls).toHaveLength(2);
    expect(pet.status).toBe('pending');
  });

  test('TC-API-PET-04: should handle invalid pet data gracefully @regression', async ({ request }) => {
    const response = await request.post('pet', {
      data: 'not-valid-json',
      headers: { 'Content-Type': 'text/plain' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
