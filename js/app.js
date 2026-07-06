const { filter } = require('./filters');
const { render } = require('./renderer');

let trendingData = null;
let currentPeriod = 'today';

const container = document;
const repoListEl = document.getElementById('repoList');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const noResultsEl = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const languageFilter = document.getElementById('languageFilter');
const sortSelect = document.getElementById('sortSelect');
const filterBtns = document.querySelectorAll('.filter-btn');

async function loadTrendingData() {
  loadingEl.style.display = 'block';
  repoListEl.style.display = 'none';
  errorEl.style.display = 'none';
  noResultsEl.style.display = 'none';

  try {
    const response = await fetch('data/trending.json');
    if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
    trendingData = await response.json();
    loadingEl.style.display = 'none';
    populateLanguageFilter();
    update();
  } catch (err) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.textContent = `Failed to load trending data. Please try again later. (${err.message})`;
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
  const sortBy = sortSelect.value;

  const filtered = filter(repos, { search, language, sortBy });
  render(repoListEl, noResultsEl, filtered, !!search);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPeriod = btn.dataset.period;
    searchInput.value = '';
    languageFilter.value = '';
    sortSelect.value = 'rank';
    update();
  });
});

searchInput.addEventListener('input', () => {
  update();
});

languageFilter.addEventListener('change', () => {
  update();
});

sortSelect.addEventListener('change', () => {
  update();
});

loadTrendingData();
