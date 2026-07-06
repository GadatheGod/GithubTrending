function render(repoListEl, feedContainer, repos, hasSearch, loadingEl) {
  if (repos.length === 0) {
    feedContainer.innerHTML = '';
    if (hasSearch) {
      feedContainer.innerHTML = '<div class="no-results"><i class="fas fa-search-minus"></i> No repositories match your search.</div>';
    }
    return;
  }

  feedContainer.innerHTML = '';

  repos.forEach((repo, index) => {
    const item = document.createElement('div');
    item.className = 'feed-item';

    const rankDiv = document.createElement('div');
    rankDiv.className = 'rank';
    rankDiv.textContent = repo.rank;

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

    const descDiv = document.createElement('div');
    descDiv.className = 'repo-description';
    descDiv.textContent = repo.description || '';

    titleDiv.appendChild(nameSpan);
    titleDiv.appendChild(expandBtn);
    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(descDiv);

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

    item.appendChild(rankDiv);
    item.appendChild(contentDiv);
    item.appendChild(metricsDiv);
    item.appendChild(detailsDiv);

    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = item.classList.toggle('expanded');
      expandBtn.innerHTML = isExpanded ? '▲' : '▼';
    });

    feedContainer.appendChild(item);
  });
}

function formatStars(stars) {
  if (stars >= 1000) {
    return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return stars.toString();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { render, formatStars };
} else {
  window.renderer = { render, formatStars };
}
