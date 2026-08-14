export function getErrorMessage(err) {
  if (!err.response) {
    return 'Network error — please check your internet connection and try again.'
  }

  const status = err.response.status

  if (status === 404) {
    return 'Repository not found.'
  }

  if (status === 403) {
    const resetHeader = err.response.headers?.['x-ratelimit-reset']
    if (resetHeader) {
      const resetTime = new Date(parseInt(resetHeader, 10) * 1000)
      const formatted = resetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `GitHub API rate limit reached. Try again after ${formatted}.`
    }
    return 'GitHub API rate limit reached. Please wait a bit and try again.'
  }

  return 'Something went wrong. Please try again.'
}