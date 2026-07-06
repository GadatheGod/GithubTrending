let trendingData = null;
let currentPeriod = 'today';

const feed = document.getElementById('feedContainer');
const searchInput = document.getElementById('searchInput');
const languageFilter = document.getElementById('languageFilter');
const refreshBtn = document.getElementById('refreshBtn');
const timeLinks = document.querySelectorAll('.time-link');

async function loadTrendingData() {
  try {
    const response = await fetch('data/trending.json');
    if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
    trendingData = await response.json();
    populateLanguageFilter();
    renderFeed(getCurrentRepos());
  } catch (err) {
    feed.innerHTML = `<div class="no-results"><i class="fas fa-exclamation-circle"></i> Failed to load trending data. Please try again later.</div>`;
  }
}

function getCurrentRepos() {
  return trendingData[currentPeriod]?.repos || [];
}

function populateLanguageFilter() {
  const allRepos = Object.values(trendingData)
    .flatMap(period => period.repos || [])
    .map(repo => repo.language)
    .filter(Boolean);

  const uniqueLanguages = [...new Set(allRepos)].sort();

  uniqueLanguages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    languageFilter.appendChild(option);
  });
}

function formatStars(stars) {
  if (stars >= 1000) {
    return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return stars.toString();
}

function renderFeed(data) {
  feed.innerHTML = '';
  data.forEach((repo) => {
    const item = document.createElement('div');
    item.className = 'feed-item';

    // ── Rank ──
    const rankDiv = document.createElement('div');
    rankDiv.className = 'rank';
    rankDiv.textContent = repo.rank;

    // ── Content ──
    const contentDiv = document.createElement('div');
    contentDiv.className = 'item-content';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'item-title';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'repo-name';
    nameSpan.innerHTML = `<a href="${repo.url}" target="_blank" rel="noopener">${repo.name}</a>`;

    const expandBtn = document.createElement('button');
    expandBtn.className = 'expand-toggle';
    expandBtn.innerHTML = '▼';
    expandBtn.setAttribute('aria-label', 'Toggle details');

    const descDiv = document.createElement('div');
    descDiv.className = 'repo-description';
    descDiv.textContent = repo.description || '';

    titleDiv.appendChild(nameSpan);
    titleDiv.appendChild(expandBtn);
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(descDiv);

    // ── Metrics ──
    const metricsDiv = document.createElement('div');
    metricsDiv.className = 'item-metrics';

    const starsMetric = document.createElement('span');
    starsMetric.className = 'metric';
    starsMetric.innerHTML = `<i class="fas fa-star"></i> <span class="stars-today">${formatStars(repo.stars)}</span>`;

    const langTag = document.createElement('span');
    langTag.className = 'language-tag';
    langTag.textContent = repo.language;

    metricsDiv.appendChild(starsMetric);
    metricsDiv.appendChild(langTag);

    // ── Details ──
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'item-details';

    const inner = document.createElement('div');
    inner.className = 'item-details-inner';

    const fullDesc = document.createElement('span');
    fullDesc.className = 'full-desc';
    fullDesc.textContent = repo.description || '';

    const githubBtn = document.createElement('a');
    githubBtn.className = 'btn-github';
    githubBtn.href = repo.url;
    githubBtn.target = '_blank';
    githubBtn.rel = 'noopener';
    githubBtn.innerHTML = `<i class="fab fa-github"></i> View on GitHub`;

    inner.appendChild(fullDesc);
    inner.appendChild(githubBtn);
    detailsDiv.appendChild(inner);

    // ── Assemble ──
    item.appendChild(rankDiv);
    item.appendChild(contentDiv);
    item.appendChild(metricsDiv);
    item.appendChild(detailsDiv);

    // ── Toggle ──
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = item.classList.toggle('expanded');
      expandBtn.innerHTML = isExpanded ? '▲' : '▼';
    });

    feed.appendChild(item);
  });
}

function filterFeed(query) {
  const q = query.toLowerCase().trim();
  const items = feed.querySelectorAll('.feed-item');
  let visibleCount = 0;
  items.forEach(item => {
    const name = item.querySelector('.repo-name')?.textContent?.toLowerCase() || '';
    const desc = item.querySelector('.repo-description')?.textContent?.toLowerCase() || '';
    const lang = item.querySelector('.language-tag')?.textContent?.toLowerCase() || '';
    const match = name.includes(q) || desc.includes(q) || lang.includes(q);
    item.style.display = match ? 'flex' : 'none';
    if (match) visibleCount++;
  });

  let noResult = feed.querySelector('.no-results');
  if (visibleCount === 0 && q.length > 0) {
    if (!noResult) {
      noResult = document.createElement('div');
      noResult.className = 'no-results';
      noResult.innerHTML = '<i class="fas fa-search-minus"></i> No repositories match your search.';
      feed.appendChild(noResult);
    }
  } else {
    if (noResult) noResult.remove();
  }
}

timeLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    timeLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentPeriod = link.dataset.period;
    searchInput.value = '';
    languageFilter.value = '';
    filterFeed('');
    const repos = getCurrentRepos();
    const language = languageFilter.value;
    const filtered = language ? repos.filter(r => r.language === language) : repos;
    renderFeed(filtered);
  });
});

searchInput.addEventListener('input', (e) => {
  filterFeed(e.target.value);
});

languageFilter.addEventListener('change', () => {
  const repos = getCurrentRepos();
  const language = languageFilter.value;
  const filtered = language ? repos.filter(r => r.language === language) : repos;
  renderFeed(filtered);
  filterFeed(searchInput.value);
});

refreshBtn.addEventListener('click', () => {
  refreshBtn.disabled = true;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  setTimeout(() => {
    loadTrendingData();
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    refreshBtn.disabled = false;
    searchInput.value = '';
    languageFilter.value = '';
    filterFeed('');
    document.querySelectorAll('.feed-item').forEach(el => el.classList.remove('expanded'));
    document.querySelectorAll('.expand-toggle').forEach(btn => btn.innerHTML = '▼');
  }, 600);
});

loadTrendingData();
