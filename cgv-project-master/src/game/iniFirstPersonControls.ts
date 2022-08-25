import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
//various camera angles to enable first person controls
export function initFirstPersonControls(camera, renderer) {
  const controls = new FirstPersonControls(camera, renderer.domElement)
  controls.lookSpeed = 0.002
  controls.lookVertical = true
  controls.constrainVertical = true
  controls.verticalMin = Math.PI / 1.7
  controls.verticalMax = Math.PI / 1.9
  controls.lookAt(camera.position.x, camera.position.y, camera.position.z)
  return controls
}
