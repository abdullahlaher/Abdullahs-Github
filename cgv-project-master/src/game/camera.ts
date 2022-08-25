import { getInsetHeight, getInsetWidth } from './initScene'

//makes the camera follow the car
export function doCameraThings(
  camera,
  mapCamera,
  chassisBody,
  renderer,
  scene,
) {
  if (chassisBody.position.x < 930) {
    camera.position.x =
      chassisBody.position.x + 50 * Math.cos((2 * Math.PI) / 180)
  } else {
    camera.position.x = 930 + 50 * Math.cos((2 * Math.PI) / 180)
  }

  camera.position.y = chassisBody.position.y + 40

  if (chassisBody.position.z < 930) {
    camera.position.z = chassisBody.position.z + 40
  } else {
    camera.position.z = 970
  }

  if (chassisBody.position.x > 935 || chassisBody.position.x < 60) {
    mapCamera.position.x = mapCamera.position.x
  } else {
    mapCamera.position.x = chassisBody.position.x
  }

  if (chassisBody.position.z > 980 || chassisBody.position.z < 40) {
    mapCamera.position.z = mapCamera.position.z
  } else {
    mapCamera.position.z = chassisBody.position.z
  }

  //mapCamera.position.z = chassisBody.position.z
  //mapCamera.position.x = chassisBody.position.x

  camera.lookAt(
    chassisBody.position.x,
    chassisBody.position.y,
    chassisBody.position.z,
  )

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)

  renderer.render(scene, camera)

  renderer.setClearColor(0x333333)

  renderer.clearDepth()

  renderer.setScissorTest(true)

  const insetWidth = getInsetWidth()
  const insetHeight = getInsetHeight()

  renderer.setScissor(
    970,
    insetWidth - insetHeight + 50,
    insetWidth + 140,
    insetHeight,
  )
  renderer.setViewport(
    970,
    insetWidth - insetHeight + 50,
    insetWidth + 140,
    insetHeight,
  )

  renderer.render(scene, mapCamera)

  renderer.setScissorTest(false)
}
//first person controls camera
export function firstPersonCamera(
  camera,
  mapCamera,
  chassisBody,
  renderer,
  scene,
) {
  camera.position.x = chassisBody.position.x
  camera.position.y = chassisBody.position.y + 5.5
  camera.position.z = chassisBody.position.z
  mapCamera.position.z = chassisBody.position.z
  mapCamera.position.x = chassisBody.position.x

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)

  renderer.render(scene, camera)

  renderer.setClearColor(0x333333)

  renderer.clearDepth()

  renderer.setScissorTest(true)

  const insetWidth = getInsetWidth()
  const insetHeight = getInsetHeight()
  renderer.setScissor(
    1100,
    insetWidth - insetHeight + 50,
    insetWidth + 20,
    insetHeight + 20,
  )
  renderer.setViewport(
    1100,
    insetWidth - insetHeight + 50,
    insetWidth + 20,
    insetHeight + 20,
  )

  renderer.render(scene, mapCamera)

  renderer.setScissorTest(false)
}
