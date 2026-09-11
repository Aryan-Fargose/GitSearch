import axios from 'axios'

const BASE_URL = 'https://api.github.com'

// 5-minute in-memory cache to prevent redundant calls when switching tabs or re-searching
const cache = new Map()
const CACHE_TTL_MS = 5 * 60 * 1000

export function getAuthToken() {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GITHUB_TOKEN) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('github_token')) ||
    ''
  )
}

export function setAuthToken(token) {
  if (typeof localStorage !== 'undefined') {
    if (token) {
      localStorage.setItem('github_token', token.trim())
    } else {
      localStorage.removeItem('github_token')
    }
  }
}

function getHeaders() {
  const token = getAuthToken()
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function cachedGet(url, params = {}) {
  const cacheKey = `${url}?${JSON.stringify(params)}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const res = await axios.get(url, {
    params,
    headers: getHeaders(),
  })

  cache.set(cacheKey, { data: res.data, timestamp: Date.now() })
  return res.data
}

export async function searchRepos(query) {
  const data = await cachedGet(`${BASE_URL}/search/repositories`, {
    q: query,
    per_page: 20,
  })
  return data.items || []
}

export async function getRepoDetails(owner, repo) {
  return cachedGet(`${BASE_URL}/repos/${owner}/${repo}`)
}

export async function getRepoLanguages(owner, repo) {
  return cachedGet(`${BASE_URL}/repos/${owner}/${repo}/languages`)
}

export async function getCommitActivity(owner, repo) {
  return cachedGet(`${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`)
}

export async function getContributors(owner, repo) {
  return cachedGet(`${BASE_URL}/repos/${owner}/${repo}/contributors`, {
    per_page: 30,
  })
}

export async function searchUsers(query) {
  const data = await cachedGet(`${BASE_URL}/search/users`, {
    q: query,
    per_page: 20,
  })
  return data.items || []
}

export async function getUserProfile(username) {
  return cachedGet(`${BASE_URL}/users/${username}`)
}

export async function getUserRepos(username) {
  return cachedGet(`${BASE_URL}/users/${username}/repos`, {
    sort: 'updated',
    per_page: 6,
  })
}