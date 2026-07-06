const { formatStars } = require('../js/renderer');

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
