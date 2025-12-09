import { describe, it, expect, beforeAll } from '@jest/globals';

describe('API Service Availability', () => {
  let apiUrl: string;

  beforeAll(() => {
    apiUrl = process.env.API_URL || 'http://localhost:3002';
    console.log(`Testing API at: ${apiUrl}`);
  });

  it('should return 404 from root endpoint (API is running)', async () => {
    const response = await fetch(`${apiUrl}/`);

    // API service returns 404 for root but this confirms it's running
    expect([404, 200]).toContain(response.status);
  });

  it('should have valid response time', async () => {
    const startTime = Date.now();
    const response = await fetch(`${apiUrl}/`);
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    // Just check that we got a response (404 is fine, means API is up)
    expect(response.status).toBeDefined();
    expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
  });
});
