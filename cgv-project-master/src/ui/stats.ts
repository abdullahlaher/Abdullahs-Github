import Stats from 'three/examples/jsm/libs/stats.module'

const stats = Stats()
export function showStats() {
  document.body.appendChild(stats.dom)
}

export function updateStats() {
  stats.update()
}
