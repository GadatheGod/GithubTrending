let trendingData = null;
let currentPeriod = 'today';

const feedContainer = document.getElementById('feedContainer');
const searchInput = document.getElementById('searchInput');
const languageFilter = document.getElementById('languageFilter');
const refreshBtn = document.getElementById('refreshBtn');
const timeLinks = document.querySelectorAll('.time-link');

async function loadTrendingData() {
  feedContainer.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Loading trending repositories...</p></div>';

  try {
    const response = await fetch('data/trending.json');
    if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
    trendingData = await response.json();
    populateLanguageFilter();
    update();
  } catch (err) {
    feedContainer.innerHTML = `<div class="loading-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load trending data. Please try again later.</p></div>`;
  }
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

function update() {
  if (!trendingData) return;

  const repos = trendingData[currentPeriod]?.repos || [];
  const search = searchInput.value;
  const language = languageFilter.value;

  const filtered = window.filters.filter(repos, { search, language, sortBy: 'rank' });
  window.renderer.render(feedContainer, feedContainer, filtered, !!search);
}

timeLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    timeLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentPeriod = link.dataset.period;
    searchInput.value = '';
    languageFilter.value = '';
    update();
  });
});

searchInput.addEventListener('input', () => {
  update();
});

languageFilter.addEventListener('change', () => {
  update();
});

refreshBtn.addEventListener('click', () => {
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  setTimeout(() => {
    loadTrendingData();
  }, 400);
});

loadTrendingData();
