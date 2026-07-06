const { render } = require('../js/renderer');

describe('render', () => {
  let repoListEl, noResultsEl;

  beforeEach(() => {
    repoListEl = { style: { display: '' } };
    noResultsEl = { style: { display: '' } };
  });

  it('shows repos and hides no-results', () => {
    const repos = [
      { name: 'user/repo', description: 'A repo', stars: 100, language: 'JavaScript', rank: 1, url: 'https://github.com/user/repo' }
    ];
    render(repoListEl, noResultsEl, repos, false);
    expect(repoListEl.style.display).toBe('block');
    expect(noResultsEl.style.display).toBe('none');
  });

  it('hides repos and shows no-results when empty with search', () => {
    render(repoListEl, noResultsEl, [], true);
    expect(repoListEl.style.display).toBe('none');
    expect(noResultsEl.style.display).toBe('block');
  });

  it('hides both when empty without search', () => {
    render(repoListEl, noResultsEl, [], false);
    expect(repoListEl.style.display).toBe('none');
    expect(noResultsEl.style.display).toBe('none');
  });

  it('renders multiple repos', () => {
    const repos = [
      { name: 'user/a', description: 'Desc A', stars: 500, language: 'Python', rank: 1, url: 'https://github.com/user/a' },
      { name: 'user/b', description: 'Desc B', stars: 1000, language: 'Rust', rank: 2, url: 'https://github.com/user/b' }
    ];
    render(repoListEl, noResultsEl, repos, false);
    expect(repoListEl.style.display).toBe('block');
  });

  it('renders repo without description', () => {
    const repos = [
      { name: 'user/repo', description: null, stars: 50, language: 'Go', rank: 1, url: 'https://github.com/user/repo' }
    ];
    render(repoListEl, noResultsEl, repos, false);
    expect(repoListEl.style.display).toBe('block');
  });
});
