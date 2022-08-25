const loadingDiv = document.getElementById('loading')
const loadingText = document.getElementById('loading-text')
//functionality to show and hide loading screens
export function hideLoading() {
  loadingDiv.innerHTML = ''
  loadingDiv.style.display = 'none'
}
export function setLoadingText(text: string) {
  loadingText.innerHTML = text
}
export function showLoading(message: string) {
  loadingDiv.innerHTML = message
  loadingDiv.style.display = 'block'
}
