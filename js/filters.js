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

function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || '#666666';
}

function formatStars(stars) {
  if (stars >= 1000) {
    return (stars / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return stars.toString();
}

function filter(repos, { search, language, sortBy }) {
  let result = [...repos];

  if (search) {
    const term = search.toLowerCase().trim();
    result = result.filter(repo =>
      repo.name.toLowerCase().includes(term) ||
      (repo.description && repo.description.toLowerCase().includes(term))
    );
  }

  if (language) {
    result = result.filter(repo => repo.language === language);
  }

  if (sortBy === 'stars') {
    result.sort((a, b) => b.stars - a.stars);
  }

  return result;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filter, getLanguageColor, formatStars };
} else {
  window.filters = { filter, getLanguageColor, formatStars };
}
