import * as THREE from 'three'
import { createMaterialArray } from '../utils/createMaterialArray'

var insetWidth
var insetHeight
export function initScene() {
  const scene = new THREE.Scene()
  scene.castShadow = true
  const skyboxImage = 'cloudy'
  const materialArray = createMaterialArray(skyboxImage)
  const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000)

  const skybox = new THREE.Mesh(skyboxGeo, materialArray)
  skybox.translateX(500)
  skybox.translateZ(500)
  scene.add(skybox)

  const renderer = new THREE.WebGLRenderer({ antialias: false })
  var width = window.innerWidth

  var height = window.innerHeight
  renderer.setSize(width, height)
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
  camera.position.y = 100
  camera.position.z = -200
  camera.lookAt(500, 500, 500)

  const mapCamera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    1,
    10000,
  )

  mapCamera.position.set(0, 50, 10)
  mapCamera.zoom = 10
  mapCamera.lookAt(new THREE.Vector3(0, -1, 0))
  scene.add(camera)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const light = new THREE.DirectionalLight(0x9a9a9a, 1)
  light.position.set(400, 400, 400)
  light.castShadow = true
  light.shadow.mapSize.width = light.shadow.mapSize.height = 1000
  light.shadow.camera.near = 1
  light.shadow.camera.far = 1000
  scene.add(light)

  scene.add(new THREE.HemisphereLight(0xefefef, 0xffffff, 0.8))

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

    insetWidth = window.innerHeight / 4
    insetHeight = window.innerHeight / 4

    //mapCamera. = insetWidth / insetHeight
    mapCamera.updateProjectionMatrix()
  }

  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()

  renderer.autoClear = false
  return {
    scene,
    renderer,
    camera,
    mapCamera,
  }
}

export function getInsetWidth() {
  return insetWidth
}
export function getInsetHeight() {
  return insetHeight
}
