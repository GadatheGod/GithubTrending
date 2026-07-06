const axios = require('axios');
const cheerio = require('cheerio');

async function debug() {
  const { data: html } = await axios.get('https://github.com/trending?since=daily', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(html);
  const first = $('article.Box-row').first();
  
  console.log('Stars selector text:', first.find('a.d-block.link-color-fg-muted').text());
  console.log('All anchor tags:');
  first.find('a').each((i, el) => {
    console.log(`  ${i}: href="${$(el).attr('href')}" text="${$(el).text().trim().substring(0, 50)}"`);
  });
  
  console.log('\nStar-related elements:');
  first.find('*').each((i, el) => {
    const text = $(el).text().trim();
    if (text.includes('star') || text.includes('Star')) {
      console.log(`  ${$(el).attr('class') || ''}: "${text}"`);
    }
  });
}

debug().catch(console.error);
