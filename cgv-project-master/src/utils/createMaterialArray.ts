import * as THREE from 'three'
export function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename)
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image)
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
  })
  return materialArray
}

export function createPathStrings(filename) {
  const basePath = './resources/skybox/'
  const baseFilename = basePath + filename
  const fileType = '.bmp'
  const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
  const pathStings = sides.map(side => {
    return baseFilename + '_' + side + fileType
  })
  return pathStings
}
