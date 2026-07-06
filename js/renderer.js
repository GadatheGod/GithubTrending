function render(repoListEl, noResultsEl, repos, hasSearch) {
  if (repos.length === 0) {
    repoListEl.style.display = 'none';
    noResultsEl.style.display = hasSearch ? 'block' : 'none';
    return;
  }

  noResultsEl.style.display = 'none';
  repoListEl.style.display = 'block';

  repoListEl.innerHTML = repos.map(repo => `
    <a href="${repo.url}" target="_blank" rel="noopener" class="repo-card">
      <span class="repo-rank">${repo.rank}</span>
      <div class="repo-content">
        <div class="repo-name">
          <a href="${repo.url}" target="_blank" rel="noopener">${repo.name}</a>
        </div>
        ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
        <div class="repo-meta">
          ${repo.language && repo.language !== 'Unknown' ? `
            <span class="repo-language">
              <span class="language-dot" style="background-color: ${getLanguageColor(repo.language)}"></span>
              ${repo.language}
            </span>
          ` : ''}
          <span class="repo-stars">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ${formatStars(repo.stars)}
          </span>
        </div>
      </div>
    </a>
  `).join('');
}

function getLanguageColor(language) {
  const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'Python': '#3572A5',
    'Java': '#b07219', 'Go': '#00ADD8', 'Rust': '#dea584',
    'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600',
    'Ruby': '#701516', 'PHP': '#4F5D95', 'Swift': '#F05138',
    'Kotlin': '#A97BFF', 'Dart': '#00B4AB', 'Shell': '#89e051',
    'HTML': '#e34c26', 'CSS': '#563d7c', 'Vue': '#41b883',
    'Svelte': '#ff3e00', 'Perl': '#0298c3', 'Haskell': '#5e5086',
    'Elixir': '#6e4a7e', 'Scala': '#c22d40', 'R': '#198CE7',
    'Julia': '#a270ba', 'Lua': '#000080', 'Zig': '#ec915c',
    'Nim': '#ffc200', 'OCaml': '#3be133', 'Erlang': '#B8399D',
    'Clojure': '#db5855', 'F#': '#b845fc', 'D': '#a1735b',
    'Fortran': '#4d4cba', 'Racket': '#3c5caa', 'Prolog': '#74283c',
    'PowerShell': '#012456', 'Jupyter Notebook': '#DA5B0B',
    'Jupyter': '#DA5B0B', 'QMake': '#005BAA', 'Makefile': '#427819',
    'CMake': '#DA3434', 'TeX': '#3D6117', 'LaTeX': '#3D6117',
    'Scratch': '#FFB900', 'GDScript': '#355570',
    'Tcl': '#e8b975', 'Vim Script': '#199f4b', 'Awk': '#f0a9f0',
    'PureBasic': '#aeaed4', 'NetLogo': '#79D9D9', 'MATLAB': '#e16737'
  };
  return LANGUAGE_COLORS[language] || '#666666';
}

function formatStars(stars) {
  if (stars >= 1000) {
    return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return stars.toString();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { render };
} else {
  window.renderer = { render };
}
