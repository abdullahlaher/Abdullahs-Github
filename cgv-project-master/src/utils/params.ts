export function getUrlSearchParams(prop: string): string | null {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  })
  //@ts-ignore
  return params[prop]
}
