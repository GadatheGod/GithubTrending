let trendingData = null;
let currentPeriod = 'today';

const feed = document.getElementById('feedContainer');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const repoCountEl = document.getElementById('repoCount');
const updateTimeEl = document.getElementById('updateTime');
const timeLinks = document.querySelectorAll('.time-link');

async function loadTrendingData() {
  try {
    const response = await fetch('data/trending.json');
    if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
    trendingData = await response.json();
    updateStats(getCurrentRepos().length);
    renderFeed(getCurrentRepos());
  } catch (err) {
    feed.innerHTML = `<div class="no-results"><i class="fas fa-exclamation-circle"></i> Failed to load trending data. Please try again later.</div>`;
  }
}

function getCurrentRepos() {
  return trendingData[currentPeriod]?.repos || [];
}

function updateStats(count) {
  repoCountEl.textContent = `${count} trending repositories`;
  updateTimeEl.textContent = 'Just now';
}

function formatStars(stars) {
  if (stars >= 1000) {
    return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return stars.toString();
}

function getLangClass(lang) {
  const map = {
    'Python': 'lang-python',
    'Rust': 'lang-rust',
    'C++': 'lang-cpp',
    'TypeScript': 'lang-typescript',
    'JavaScript': 'lang-javascript',
    'Go': 'lang-go',
    'Shell': 'lang-shell',
    'Ruby': 'lang-ruby'
  };
  return map[lang] || '';
}

function renderFeed(data) {
  feed.innerHTML = '';
  if (data.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-results';
    empty.innerHTML = '<i class="fas fa-search-minus"></i> No repositories match your search.';
    feed.appendChild(empty);
    return;
  }

  data.forEach((repo) => {
    const item = document.createElement('div');
    item.className = `feed-item ${getLangClass(repo.language)}`;

    // Rank
    const rank = document.createElement('div');
    rank.className = 'col-rank';
    rank.textContent = repo.rank;

    // Repo name
    const repoCol = document.createElement('div');
    repoCol.className = 'col-repo';
    repoCol.innerHTML = `<i class="fas fa-book repo-icon"></i> <span class="repo-name"><a href="${repo.url}" target="_blank" rel="noopener">${repo.name}</a></span>`;

    // Description
    const desc = document.createElement('div');
    desc.className = 'col-description';
    desc.textContent = repo.description || '';

    // Stars
    const stars = document.createElement('div');
    stars.className = 'col-stars';
    stars.innerHTML = `<i class="fas fa-star"></i> <span class="stars-count">${formatStars(repo.stars)}</span>`;

    // Language
    const lang = document.createElement('div');
    lang.className = 'col-language';
    lang.innerHTML = `<span class="lang-dot"></span> ${repo.language}`;

    // Action (GitHub link)
    const action = document.createElement('div');
    action.className = 'col-action';
    action.innerHTML = `<a href="${repo.url}" class="github-link" title="View on GitHub" target="_blank" rel="noopener"><i class="fab fa-github"></i></a>`;

    item.appendChild(rank);
    item.appendChild(repoCol);
    item.appendChild(desc);
    item.appendChild(stars);
    item.appendChild(lang);
    item.appendChild(action);

    feed.appendChild(item);
  });
}

function filterFeed(query) {
  const q = query.toLowerCase().trim();
  const repos = getCurrentRepos();
  const filtered = repos.filter(repo => {
    const name = repo.name.toLowerCase();
    const desc = repo.description?.toLowerCase() || '';
    const lang = repo.language.toLowerCase();
    return name.includes(q) || desc.includes(q) || lang.includes(q);
  });
  renderFeed(filtered);
  updateStats(filtered.length);
}

timeLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    timeLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    currentPeriod = link.dataset.period;
    searchInput.value = '';
    filterFeed('');
  });
});

searchInput.addEventListener('input', (e) => {
  filterFeed(e.target.value);
});

refreshBtn.addEventListener('click', () => {
  refreshBtn.disabled = true;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  setTimeout(() => {
    loadTrendingData();
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    refreshBtn.disabled = false;
    searchInput.value = '';
    filterFeed('');
  }, 500);
});

loadTrendingData();
