export const getShows = async () => {
  const response = await fetch('https://api.tvmaze.com/shows')
  return await response.json()
}
