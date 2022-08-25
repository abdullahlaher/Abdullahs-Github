import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { pickRandom } from '../utils/pickRandom'
import * as CANNON from 'cannon-es'
import { Object3D } from 'three'
import { Coordinates } from '../lib/types'
import { collisionEventListener } from './onCarCollision'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'
//different types of clusters
const clusters = [
  'apartments',
  'bus',
  'coffeeshop',
  'factory',
  'fastfood',
  'gas',
  'house',
  'house2',
  'house3',
  'park',
  'residence',
  'shoparea',
  'shops',
  'stadium',
  'supermarket',
]
//points that a person can be spawned at relative to the cluster
export const points: Coordinates[] = [
  { x: 85, z: 85 },
  { x: 85, z: 67.5 },
  { x: 85, z: 50 },
  { x: 85, z: -67.5 },
  { x: 85, z: -85 },
  { x: 132.5, z: 85 },
  { x: 132.5, z: -85 },
  { x: 150, z: 85 },
  { x: 150, z: -85 },
  { x: 167.5, z: 85 },
  { x: 167.5, z: -85 },
  { x: 215, z: 85 },
  { x: 215, z: 67.5 },
  { x: 215, z: 50 },
  { x: 215, z: -67.5 },
  { x: 215, z: -85 },
]

let dict: Record<string, GLTF> = {}
const Gloader = new GLTFLoader()
let buildingCoordinates: Coordinates[] = []
async function preloadClusters() {
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i]
    const url = '../resources/models/buildings/' + cluster + '.gltf'
    const model = await Gloader.loadAsync(url)
    dict[cluster] = model
  }
}
export async function addClusters(scene, world) {
  await preloadClusters()
  for (let x = 0; x < 1000; x += 100) {
    for (let z = 0; z < 1000; z += 100) {
      const cluster = pickRandom(clusters)
      //@ts-ignore
      const gltf: Object3D = SkeletonUtils.clone(dict[cluster].scene)
      gltf.scale.set(1.5, 1.5, 1.5)
      const xPosBuilding = x + 35
      const zPosBuilding = z + 35

      gltf.position.setX(xPosBuilding)
      gltf.position.setY(1)
      gltf.position.setZ(zPosBuilding)
      //use to keep track of positions of buildings when generating passengers
      buildingCoordinates.push({
        x: x,
        z: z,
        y: 1,
      })
      scene.add(gltf)

      const objMaterial = new CANNON.Material('objMaterial')
      const objShape = new CANNON.Box(new CANNON.Vec3(30, 20, 30))
      let objBody = new CANNON.Body({
        mass: 0,
        material: objMaterial,
        shape: objShape,
      })
      objBody.addEventListener('collide', collisionEventListener)
      objBody.position = new CANNON.Vec3(x + 50, 10, z + 50)

      world.addBody(objBody)
    }
  }
  return { buildingCoordinates }
}

export function getNearestBuildingCoordinates(x, z) {
  let nearest = { x: 0, z: 0, y: 0 }
  let minDistance = Infinity
  for (let i = 0; i < buildingCoordinates.length; i++) {
    const building = buildingCoordinates[i]
    const distance = Math.sqrt(
      Math.pow(building.x - x, 2) + Math.pow(building.z - z, 2),
    )
    if (distance < minDistance) {
      minDistance = distance
      nearest = { ...building, y: 1 }
    }
  }
  return nearest
}
