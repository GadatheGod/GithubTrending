# GitHub Trending

A static site that displays trending GitHub repositories, updated daily via GitHub Actions.

## Features

- **Three time filters**: Today, Weekly, Monthly
- **Search**: Filter repos by name or description
- **Language filter**: Auto-populated dropdown from scraped data
- **Sorting**: By rank or star count
- **Clean minimal design**: Responsive, mobile-friendly

## Project Structure

```
.github/workflows/    GitHub Actions workflows
css/                  Stylesheets
data/                 Scraped trending data (updated by CI)
js/                   Application modules (filters, renderer, orchestrator)
scripts/              Scraper script
tests/                Jest test suite
index.html            Main site entry point
```

## Local Development

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm test
```

### Scrape trending repos locally

```bash
npm run scrape
```

This runs the scraper and updates `data/trending.json`. The site reads from this file.

### Serve the site

The site is static — serve it with any HTTP server:

```bash
npx serve .
```

Or open `index.html` directly in a browser (some browsers may restrict fetch for local files).

## Deployment

### GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings > Pages**
3. Select your branch (e.g., `main`) and `/ (root)` folder
4. Save — your site will be live at `https://yourusername.github.io/GithubTrending`

### How it works

1. **GitHub Action** (`.github/workflows/update-trending.yml`) runs daily at 08:00 UTC
2. It scrapes `github.com/trending` for Today, Weekly, and Monthly data
3. Saves the results to `data/trending.json` and commits back to the repo
4. The static site reads this JSON file and renders the UI

### Manual trigger

The GitHub Action can be manually triggered from the **Actions** tab without waiting for the schedule.

## Testing

The project uses Jest for testing with a TDD approach (vertical slices):

| Test Suite | What it verifies |
|---|---|
| `parseStars.test.js` | Star count parsing (k, m, commas, plain numbers) |
| `extractRepos.test.js` | HTML parsing — name, description, stars, language, URL |
| `timeFilters.test.js` | URL construction for daily/weekly/monthly filters |
| `dataFormat.test.js` | Output JSON structure and data integrity |
| `filters.test.js` | Filtering logic — search, language, sort (pure function) |
| `renderer.test.js` | Rendering — DOM state transitions |

```bash
npm test        # Run all tests
npm test -- -t "test name"  # Run a specific test
```

## Architecture

The frontend is split into three deep modules:

- **`js/filters.js`** — Filters module: `filter(repos, { search, language, sortBy })` returns filtered/sorted repos. Pure function, zero DOM dependency.
- **`js/renderer.js`** — Renderer module: `render(repoListEl, noResultsEl, repos, hasSearch)` updates DOM. Accepts elements as parameters.
- **`js/app.js`** — Orchestrator: wires modules together, binds events, manages state. Thin adapter layer.

The scraper exports four functions for testing: `parseStars`, `extractRepoFromRow`, `TIME_FILTERS`, `getTrendingUrl`.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Scraper**: Node.js with axios and cheerio
- **Testing**: Jest
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages
