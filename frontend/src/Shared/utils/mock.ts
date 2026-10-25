export function mockResponse<T>(data: T, delayMs = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delayMs))
}
