const fs = require('fs');
const path = require('path');

describe('trending.json data format', () => {
  let data;

  beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'trending.json');
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  });

  it('has today, weekly, and monthly sections', () => {
    expect(data).toHaveProperty('today');
    expect(data).toHaveProperty('weekly');
    expect(data).toHaveProperty('monthly');
  });

  it('each section has period, scrapedAt, and repos', () => {
    for (const key of ['today', 'weekly', 'monthly']) {
      expect(data[key]).toHaveProperty('period');
      expect(data[key]).toHaveProperty('scrapedAt');
      expect(data[key]).toHaveProperty('repos');
      expect(Array.isArray(data[key].repos)).toBe(true);
    }
  });

  describe('repo object structure', () => {
    it('today repos have required fields', () => {
      if (data.today.repos.length === 0) return;
      const repo = data.today.repos[0];
      expect(repo).toHaveProperty('rank');
      expect(repo).toHaveProperty('name');
      expect(repo).toHaveProperty('url');
      expect(repo).toHaveProperty('description');
      expect(repo).toHaveProperty('stars');
      expect(repo).toHaveProperty('language');
    });

    it('repo name is in owner/repo format', () => {
      if (data.today.repos.length === 0) return;
      const repo = data.today.repos[0];
      expect(repo.name).toMatch(/^[\w-]+\/[\w-]+$/);
    });

    it('repo url is a valid github url', () => {
      if (data.today.repos.length === 0) return;
      const repo = data.today.repos[0];
      expect(repo.url).toMatch(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/);
    });

    it('stars is a non-negative number', () => {
      if (data.today.repos.length === 0) return;
      const repo = data.today.repos[0];
      expect(Number.isInteger(repo.stars)).toBe(true);
      expect(repo.stars).toBeGreaterThanOrEqual(0);
    });

    it('rank is a positive integer', () => {
      if (data.today.repos.length === 0) return;
      const repo = data.today.repos[0];
      expect(Number.isInteger(repo.rank)).toBe(true);
      expect(repo.rank).toBeGreaterThanOrEqual(1);
    });

    it('scrapedAt is a valid iso timestamp', () => {
      for (const key of ['today', 'weekly', 'monthly']) {
        const date = new Date(data[key].scrapedAt);
        expect(isNaN(date.getTime())).toBe(false);
      }
    });
  });
});
