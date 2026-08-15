import axios from 'axios'

const BASE_URL = 'https://api.github.com'

export async function searchRepos(query) {
  const res = await axios.get(`${BASE_URL}/search/repositories`, {
    params: { q: query, per_page: 20 },
  })
  return res.data.items
}
export async function getRepoDetails(owner, repo) {
  const res = await axios.get(`${BASE_URL}/repos/${owner}/${repo}`)
  return res.data
}
export async function getRepoLanguages(owner, repo) {
  const res = await axios.get(`${BASE_URL}/repos/${owner}/${repo}/languages`)
  return res.data
}
export async function getCommitActivity(owner, repo) {
  const res = await axios.get(`${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`)
  return res.data
}
export async function getContributors(owner, repo) {
  const res = await axios.get(`${BASE_URL}/repos/${owner}/${repo}/contributors`, {
    params: { per_page: 30 },
  })
  return res.data
}
export async function searchUsers(query) {
  const res = await axios.get(`${BASE_URL}/search/users`, {
    params: { q: query, per_page: 20 },
  })
  return res.data.items
}

export async function getUserProfile(username) {
  const res = await axios.get(`${BASE_URL}/users/${username}`)
  return res.data
}

export async function getUserRepos(username) {
  const res = await axios.get(`${BASE_URL}/users/${username}/repos`, {
    params: { sort: 'updated', per_page: 6 },
  })
  return res.data
}