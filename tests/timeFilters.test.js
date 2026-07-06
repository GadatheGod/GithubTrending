const { TIME_FILTERS, getTrendingUrl } = require('../scripts/scrape-trending');

describe('TIME_FILTERS', () => {
  it('includes today filter', () => {
    expect(TIME_FILTERS.find(f => f.key === 'today')).toBeDefined();
  });

  it('includes weekly filter', () => {
    expect(TIME_FILTERS.find(f => f.key === 'weekly')).toBeDefined();
  });

  it('includes monthly filter', () => {
    expect(TIME_FILTERS.find(f => f.key === 'monthly')).toBeDefined();
  });

  it('has exactly 3 filters', () => {
    expect(TIME_FILTERS).toHaveLength(3);
  });
});

describe('getTrendingUrl', () => {
  it('returns today url for daily', () => {
    expect(getTrendingUrl('daily')).toBe('https://github.com/trending?since=daily');
  });

  it('returns weekly url for weekly', () => {
    expect(getTrendingUrl('weekly')).toBe('https://github.com/trending?since=weekly');
  });

  it('returns monthly url for monthly', () => {
    expect(getTrendingUrl('monthly')).toBe('https://github.com/trending?since=monthly');
  });
});
