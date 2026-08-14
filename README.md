# GitSearch
## Deployment Link

**Live app:** [https://aryan-fargose.github.io/GitSearch/](https://aryan-fargose.github.io/GitSearch/)

A modern web application for searching and exploring GitHub repositories — built with React, Vite, and the GitHub REST API.

## Overview

GitSearch lets you search for any public GitHub repository and dive into its details: stars, forks, open issues, license, primary language, a visual language breakdown, weekly commit activity over the past year, and a sorted contributors list — all pulled live from the GitHub API.

## Features Implemented

- **Repository search** — debounced search input (no request fired on every keystroke), with loading, empty, and error states
- **Repository details page** — name, owner, description, stars, forks, open issues, primary language, license, creation date, last updated date, and a link to the repo on GitHub
- **Language statistics** — pie chart visualizing relative language usage, built from GitHub's languages-by-bytes endpoint
- **Commit activity** — bar chart of weekly commits over the last year, with graceful handling of GitHub's "still computing stats" (202) response via short retries
- **Contributors** — avatar, username, and contribution count, sorted by contribution count, linking to each contributor's GitHub profile
- **Robust state handling** — centralized error messaging that distinguishes network failures, 404s, and rate-limit errors (with exact reset time), used consistently across the app

## Technologies & Libraries Used

- **React** (Vite) — UI and component structure
- **React Router** — client-side routing (`/` search, `/repo/:owner/:repo` details)
- **Tailwind CSS v4** — styling
- **Axios** — API requests
- **Recharts** — data visualization (language pie chart, commit activity bar chart)
- **GitHub REST API** — repository search, details, languages, commit activity, and contributors endpoints

## Setup Instructions

```bash
git clone https://github.com/Aryan-Fargose/GitSearch.git
cd GitSearch
npm install
npm run dev
```

The app runs locally at `http://localhost:5173`.

## Project Structure
## Screenshots

_Screenshots coming soon._


