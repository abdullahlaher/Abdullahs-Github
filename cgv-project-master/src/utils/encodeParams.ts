export const encryptUrlParams = (param: string) => {
  //return base 64 encoded string
  return btoa(param)
}
export const decryptUrlParams = (param: string) => {
  return atob(param)
}
