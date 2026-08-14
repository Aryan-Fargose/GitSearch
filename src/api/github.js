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