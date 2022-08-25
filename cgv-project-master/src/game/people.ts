import * as CANNON from 'cannon-es'
import * as THREE from 'three'

import { Group, Scene } from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Coordinates } from '../lib/types'
import { pickRandom } from '../utils/pickRandom'
import { points } from './addClusters'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
const allPeople: Person[] = []
var peopleHit: Record<number, Person> = []
let peopleHitStack = []
//list of people gltf types
const people = ['boy', 'girl', 'man', 'grandpa']
//stores the id of the person and the object so it can be removed
let dict: Record<string, GLTF> = {}
const Gloader = new GLTFLoader()
//load people once to be used everywhere
async function preloadPeople() {
  for (let i = 0; i < people.length; i++) {
    const person = people[i]
    const url = '../resources/models/people/' + person + '.glb'
    const model = await Gloader.loadAsync(url)
    dict[person] = model
  }
}

let peopleHitArray: string[] = []
interface Person {
  body: CANNON.Body
  object: Group
}

export async function addPerson(
  personObj,
  x: number,
  z: number,
  scene: Scene,
  world: CANNON.World,
) {
  //create a person object using the gltf model

  personObj.position.setX(x)
  personObj.position.setY(0)
  personObj.position.setZ(z)

  const geometry = new THREE.CircleGeometry(2.5, 32)
  const material = new THREE.MeshBasicMaterial({ color: '#37e0e0' })
  const circle = new THREE.Mesh(geometry, material)
  circle.rotateX(-Math.PI / 2)
  circle.position.setX(x)
  circle.position.setY(43)
  circle.position.setZ(z + 8)
  personObj.attach(circle)

  //make the person object collidable
  const personShape = new CANNON.Box(new CANNON.Vec3(2, 3, 2))

  const personBody = new CANNON.Body({
    mass: 0,
    material: new CANNON.Material(`personMaterial`),
    shape: personShape,
  })
  personBody.collisionResponse = false
  personBody.position = new CANNON.Vec3(x, 3, z)

  const uniqueId = `x:${x}-z:${z}`
  personBody.addEventListener('collide', e => {
    //add the person to the list of people to remove
    const id = e.body.id
    peopleHitStack.push(id)
    const person: Person = {
      body: personBody,
      object: personObj,
    }
    allPeople.push(person)
    peopleHit[id] = person
    if (!peopleHitArray.includes(uniqueId)) {
      peopleHitArray.push(uniqueId)
    }
  })

  world.addBody(personBody)
  scene.add(personObj)
}

export function getPeopleHitStack() {
  return peopleHitStack
}
export function getPeopleHit() {
  return peopleHit
}
export function getNumberOfPeopleHit() {
  return peopleHitArray.length
}

export function resetPeopleState() {
  peopleHit = []
  peopleHitStack = []
  peopleHitArray = []
}

export function removePersonFromWorld(
  person: Person,
  world: CANNON.World,
  scene: Scene,
) {
  world.removeBody(person.body)
  scene.remove(person.object)
}

export async function regeneratePassengers(
  buildingCoordinates: Coordinates[],
  world: CANNON.World,
  scene: Scene,
  numberOfPeople: number,
) {
  allPeople.forEach(person => {
    removePersonFromWorld(person, world, scene)
  })
  resetPeopleState()
  await addPeople(buildingCoordinates, numberOfPeople, scene, world)
}

export async function addPeople(
  buildingCoordinates: Coordinates[],
  numberOfPeopleToAddPerBuilding: number,
  scene: Scene,
  world: CANNON.World,
) {
  await preloadPeople()
  for (let i = 0; i < buildingCoordinates.length; i++) {
    const building = buildingCoordinates[i]
    //choose a random number between 0 and the number of people to add
    //const numberOfPeopleToAdd = Math.random() * numberOfPeopleToAddPerBuilding
    for (let j = 0; j < numberOfPeopleToAddPerBuilding; j++) {
      let point = pickRandom(points)
      let x = Math.abs(building.x + point.x)
      let z = Math.abs(building.z + point.z)
      let isXInRange = x < 1000 && x > 0
      let isZInRange = z < 1000 && z > 0

      while (!isXInRange || !isZInRange) {
        point = pickRandom(points)
        x = Math.abs(building.x + point.x)
        z = Math.abs(building.z + point.z)
        isXInRange = x < 1000 && x > 0
        isZInRange = z < 1000 && z > 0
      }
      //@ts-ignore

      const person: Object3D = SkeletonUtils.clone(
        dict[pickRandom(people)].scene,
      )
      await addPerson(person, x, z, scene, world)
    }
  }
}
