const { filter, getLanguageColor, formatStars } = require('../js/filters');

const sampleRepos = [
  { name: 'user/repo-a', description: 'Awesome project', stars: 5000, language: 'JavaScript', rank: 1, url: 'https://github.com/user/repo-a' },
  { name: 'user/repo-b', description: 'Machine learning toolkit', stars: 12000, language: 'Python', rank: 2, url: 'https://github.com/user/repo-b' },
  { name: 'user/repo-c', description: 'CSS framework', stars: 8000, language: 'CSS', rank: 3, url: 'https://github.com/user/repo-c' },
  { name: 'user/repo-d', description: 'Go web server', stars: 3000, language: 'Go', rank: 4, url: 'https://github.com/user/repo-d' },
  { name: 'user/repo-e', description: 'Rust CLI tool', stars: 15000, language: 'Rust', rank: 5, url: 'https://github.com/user/repo-e' }
];

describe('filter', () => {
  it('returns all repos when no criteria provided', () => {
    const result = filter(sampleRepos, {});
    expect(result).toHaveLength(5);
  });

  it('filters by search term in name', () => {
    const result = filter(sampleRepos, { search: 'repo-b' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('user/repo-b');
  });

  it('filters by search term in description', () => {
    const result = filter(sampleRepos, { search: 'machine learning' });
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Machine learning toolkit');
  });

  it('search is case insensitive', () => {
    const result = filter(sampleRepos, { search: 'MACHINE LEARNING' });
    expect(result).toHaveLength(1);
  });

  it('filters by language', () => {
    const result = filter(sampleRepos, { language: 'Python' });
    expect(result).toHaveLength(1);
    expect(result[0].language).toBe('Python');
  });

  it('filters by multiple criteria', () => {
    const result = filter(sampleRepos, { search: 'repo', language: 'JavaScript' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('user/repo-a');
  });

  it('sorts by stars descending', () => {
    const result = filter(sampleRepos, { sortBy: 'stars' });
    expect(result[0].stars).toBeGreaterThanOrEqual(result[1].stars);
    expect(result[0].stars).toBe(15000);
  });

  it('search and sort work together', () => {
    const result = filter(sampleRepos, { search: 'repo', sortBy: 'stars' });
    expect(result.length).toBeGreaterThan(0);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].stars).toBeGreaterThanOrEqual(result[i].stars);
    }
  });

  it('returns empty array when no matches', () => {
    const result = filter(sampleRepos, { search: 'zzzznonexistent' });
    expect(result).toHaveLength(0);
  });

  it('does not mutate original array', () => {
    const originalLength = sampleRepos.length;
    filter(sampleRepos, { search: 'test' });
    expect(sampleRepos).toHaveLength(originalLength);
  });
});

describe('getLanguageColor', () => {
  it('returns correct color for known language', () => {
    expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
    expect(getLanguageColor('Python')).toBe('#3572A5');
    expect(getLanguageColor('Rust')).toBe('#dea584');
  });

  it('returns default color for unknown language', () => {
    expect(getLanguageColor('UnknownLang')).toBe('#666666');
  });
});

describe('formatStars', () => {
  it('formats numbers below 1000 as-is', () => {
    expect(formatStars(500)).toBe('500');
  });

  it('formats thousands with k suffix', () => {
    expect(formatStars(5000)).toBe('5k');
    expect(formatStars(12500)).toBe('12.5k');
  });

  it('removes trailing zero after decimal', () => {
    expect(formatStars(10000)).toBe('10k');
    expect(formatStars(10500)).toBe('10.5k');
  });
});
