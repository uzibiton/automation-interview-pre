import { describe, it, expect, beforeAll } from '@jest/globals';

describe('API Health Check', () => {
  let apiUrl: string;

  beforeAll(() => {
    apiUrl = process.env.API_URL || 'http://localhost:3002';
    console.log(`Testing API at: ${apiUrl}`);
  });

  it('should return 200 from health endpoint', async () => {
    const response = await fetch(`${apiUrl}/health`);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('healthy');
  });

  it('should have valid response time', async () => {
    const startTime = Date.now();
    const response = await fetch(`${apiUrl}/health`);
    const endTime = Date.now();

    const responseTime = endTime - startTime;

    expect(response.ok).toBe(true);
    expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
  });
});
