import './style.css'
// Shaders
import * as CANNON from 'cannon-es'
import { initScene } from './game/initScene'
import { initWorld } from './game/initWorld'
import { createGroundMaterial, createPlane } from './game/createGround'
import { addClusters } from './game/addClusters'
import { addEventListener, createPlayer, navigate } from './game/carEngine'
//import { enableDebugger } from './game/enableDebugger'
import { initFirstPersonControls } from './game/iniFirstPersonControls'
import { doCameraThings, firstPersonCamera } from './game/camera'
import { hideLoading } from './ui/loading'
import { playPickupSound, queueBackroundMusic } from './game/soundEffects'
import {
  getNumberOfPeopleToAdd,
  getPaused,
  initGameLogic,
  updateHitCount,
} from './gameLogic'
import {
  addPeople,
  getPeopleHit,
  getPeopleHitStack,
  removePersonFromWorld,
} from './game/people'
import { createBoundingBox } from './game/boundingBox'
//declare variables

const { camera, mapCamera, renderer, scene } = initScene()
const world = initWorld()
let useFpsControls = false
const plane = await createPlane(1000)
scene.add(plane)
const { wheelMaterial, groundMaterial } = await createGroundMaterial(world)
await createBoundingBox(world)
const { buildingCoordinates } = await addClusters(scene, world)
await addPeople(buildingCoordinates, getNumberOfPeopleToAdd(), scene, world)
let { chassisBody, wheelBodies, wheelVisuals, car } = await createPlayer(
  world,
  scene,
  wheelMaterial,
)

const controls = initFirstPersonControls(camera, renderer)
//used to change between controls
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    useFpsControls = !useFpsControls
  }
})

addEventListener(world, wheelBodies, wheelVisuals)
await queueBackroundMusic(scene)
//once world is loaded, start the game and hide the loading screen
hideLoading()
//used for debugging frame rate
//showStats()
export async function animate() {
  controls.update(1.0)
  renderer.render(scene, camera)
  updatePhysics()
  await updateHitCount()
  //updateStats()
  if (useFpsControls)
    firstPersonCamera(camera, mapCamera, chassisBody, renderer, scene)
  else doCameraThings(camera, mapCamera, chassisBody, renderer, scene)
  if (getPaused()) {
    return
  }
  requestAnimationFrame(animate)
}

//const cannonDebugger = enableDebugger(world, scene)

initGameLogic()
export async function updatePhysics() {
  //cannonDebugger.update()
  //update the physics world
  world.step(1 / 60)
  //on each game loop remove the necessary people from the world
  const peopleHit = getPeopleHit()
  const id = getPeopleHitStack().pop()
  const person = peopleHit[id]
  if (person) {
    playPickupSound(camera)
    removePersonFromWorld(person, world, scene)
  }
  // update the chassis position
  //@ts-ignore
  car.position.copy(chassisBody.position)

  //@ts-ignore
  car.quaternion.copy(chassisBody.quaternion)
}

var q = plane.quaternion
var planeBody = new CANNON.Body({
  mass: 0, // mass = 0 makes the body static
  material: groundMaterial,
  shape: new CANNON.Plane(),
  quaternion: new CANNON.Quaternion(-q.x, q.y, q.z, q.w),
})

world.addBody(planeBody)
window.addEventListener('keydown', navigate)
window.addEventListener('keyup', navigate)

await animate()
// chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), getAngle())

export function getNecessaryObjects() {
  return {
    world,
    scene,
    camera,
    buildingCoordinates,
    renderer,
    plane,
    planeBody,
    wheelMaterial,
    groundMaterial,
    wheelBodies,
    wheelVisuals,
    car,
    chassisBody,
    controls,
  }
}
