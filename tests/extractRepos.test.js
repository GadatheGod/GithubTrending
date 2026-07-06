const cheerio = require('cheerio');
const { extractRepoFromRow } = require('../scripts/scrape-trending');

const sampleHTML = `
<article class="Box-row">
  <h2>
    <a href="/user/repo">
      <span class="d-inline-block copy-range" itemprop="name codeRepository">user/repo</span>
    </a>
  </h2>
  <p>This is a sample repository description</p>
  <a class="d-block link-color-fg-muted mt-1" href="/user/repo/stargazers">
    1,234 stars
  </a>
  <span class="ml-0" itemprop="programmingLanguage">JavaScript</span>
</article>
`;

describe('extractRepoFromRow', () => {
  let $;

  beforeEach(() => {
    $ = cheerio.load(sampleHTML);
  });

  it('extracts repo name from h2 link', () => {
    const repo = extractRepoFromRow($('article.Box-row').first(), 0);
    expect(repo.name).toBe('user/repo');
  });

  it('extracts description from paragraph', () => {
    const repo = extractRepoFromRow($('article.Box-row').first(), 0);
    expect(repo.description).toBe('This is a sample repository description');
  });

  it('extracts star count', () => {
    const repo = extractRepoFromRow($('article.Box-row').first(), 0);
    expect(repo.stars).toBe(1234);
  });

  it('extracts language', () => {
    const repo = extractRepoFromRow($('article.Box-row').first(), 0);
    expect(repo.language).toBe('JavaScript');
  });

  it('generates correct github url', () => {
    const repo = extractRepoFromRow($('article.Box-row').first(), 0);
    expect(repo.url).toBe('https://github.com/user/repo');
  });

  it('sets rank based on position', () => {
    const repo = extractRepoFromRow($('article.Box-row').first(), 0);
    expect(repo.rank).toBe(1);
  });

  it('handles missing description', () => {
    const html = `
    <article class="Box-row">
      <h2>
        <a href="/user/repo">
          <span class="d-inline-block copy-range" itemprop="name codeRepository">user/repo</span>
        </a>
      </h2>
      <a class="d-block link-color-fg-muted mt-1" href="/user/repo/stargazers">
        100 stars
      </a>
      <span itemprop="programmingLanguage">Python</span>
    </article>
    `;
    const local$ = cheerio.load(html);
    const repo = extractRepoFromRow(local$('article.Box-row').first(), 0);
    expect(repo.description).toBeNull();
  });
});
