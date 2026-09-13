export const debounce = <Args extends unknown[]>(func: (...args: Args) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: Args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}
