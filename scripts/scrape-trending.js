const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const TIME_FILTERS = [
  { key: 'today', since: 'daily', label: 'Today' },
  { key: 'weekly', since: 'weekly', label: 'Weekly' },
  { key: 'monthly', since: 'monthly', label: 'Monthly' }
];

function getTrendingUrl(since) {
  return `https://github.com/trending?since=${since}`;
}

function extractRepoFromRow($row, index = 0) {
  const fullName = $row.find('h2 a').attr('href')?.replace(/^\/|\/$/g, '') || '';
  if (!fullName) return null;

  const description = $row.find('p').text().trim() || null;
  const starsLink = $row.find('a[href$="/stargazers"]').first();
  const starsStr = starsLink.text().trim().replace(/\s/g, '');
  const language = $row.find('span[itemprop="programmingLanguage"]').first().text().trim() || 'Unknown';
  const currentUrl = $row.find('h2 a').attr('href')?.replace(/^\/|\/$/g, '');

  return {
    rank: index + 1,
    name: fullName,
    url: `https://github.com/${currentUrl || fullName}`,
    description: description || null,
    stars: parseStars(starsStr),
    language: language,
    scrapeTime: new Date().toISOString()
  };
}

async function scrapeTrending(url) {
  const { data: html } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 30000
  });

  const $ = cheerio.load(html);
  const repos = [];

  $('article.Box-row').each((index, element) => {
    const repo = extractRepoFromRow($(element), index);
    if (repo) {
      repos.push(repo);
    }
  });

  return repos;
}

function parseStars(starsStr) {
  if (!starsStr) return 0;
  const cleaned = starsStr.replace(/,/g, '').toLowerCase();
  if (cleaned.endsWith('m')) {
    return Math.floor(parseFloat(cleaned) * 1000000);
  }
  if (cleaned.endsWith('k')) {
    return Math.floor(parseFloat(cleaned) * 1000);
  }
  return parseInt(cleaned) || 0;
}

async function main() {
  const allData = {};

  for (const filter of TIME_FILTERS) {
    console.log(`Scraping ${filter.label} trending...`);
    try {
      const url = getTrendingUrl(filter.since);
      const repos = await scrapeTrending(url);
      allData[filter.key] = {
        period: filter.label,
        scrapedAt: new Date().toISOString(),
        repos: repos
      };
      console.log(`  Found ${repos.length} repos for ${filter.label}`);
    } catch (err) {
      console.error(`  Error scraping ${filter.label}:`, err.message);
      allData[filter.key] = {
        period: filter.label,
        scrapedAt: new Date().toISOString(),
        repos: [],
        error: err.message
      };
    }
  }

  const outputPath = path.join(__dirname, '..', 'data', 'trending.json');
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`\nData saved to ${outputPath}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { parseStars, extractRepoFromRow, TIME_FILTERS, getTrendingUrl };
