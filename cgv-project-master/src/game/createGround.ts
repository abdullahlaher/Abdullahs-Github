import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export async function createPlane(planeSize) {
  const loader = new THREE.TextureLoader()
  const texture = await loader.loadAsync('resources/groundBlock.png')

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  const repeats = planeSize / 100
  texture.repeat.set(repeats, repeats)

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(planeGeo, planeMat)
  mesh.translateX(500)
  mesh.translateZ(500)
  //mesh.rotation.x = Math.PI * -.5;
  mesh.rotation.x = Math.PI / 2
  mesh.receiveShadow = true
  return mesh
}
export async function createGroundMaterial(world) {
  var groundMaterial = new CANNON.Material('groundMaterial')
  var wheelMaterial = new CANNON.Material('wheelMaterial')
  var wheelGroundContactMaterial = new CANNON.ContactMaterial(
    wheelMaterial,
    groundMaterial,
    {
      friction: 1,
      restitution: 0,
      contactEquationStiffness: 1000,
    },
  )

  world.addContactMaterial(wheelGroundContactMaterial)
  return {
    groundMaterial,
    wheelMaterial,
  }
}