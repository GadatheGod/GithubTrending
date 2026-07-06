const { parseStars } = require('../scripts/scrape-trending');

describe('parseStars', () => {
  it('returns 0 for null', () => {
    expect(parseStars(null)).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(parseStars('')).toBe(0);
  });

  it('parses plain number', () => {
    expect(parseStars('1234')).toBe(1234);
  });

  it('parses number with commas', () => {
    expect(parseStars('1,234')).toBe(1234);
  });

  it('parses thousands with k suffix', () => {
    expect(parseStars('12.5k')).toBe(12500);
  });

  it('parses millions with m suffix', () => {
    expect(parseStars('1.2m')).toBe(1200000);
  });

  it('parses whole thousands with k suffix', () => {
    expect(parseStars('50k')).toBe(50000);
  });
});
