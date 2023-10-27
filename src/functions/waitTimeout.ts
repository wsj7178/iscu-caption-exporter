export async function waitTimeout(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
