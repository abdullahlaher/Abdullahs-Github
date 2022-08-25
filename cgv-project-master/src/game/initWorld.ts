import * as CANNON from 'cannon-es'

export function initWorld() {
  //cannon world
  const world = new CANNON.World()
  world.broadphase = new CANNON.SAPBroadphase(world)
  world.gravity.set(0, -10, 0)
  world.defaultContactMaterial.friction = 0

  return world
}
