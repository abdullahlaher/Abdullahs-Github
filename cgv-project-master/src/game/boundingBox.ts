import * as CANNON from 'cannon-es'
import { collisionEventListener } from './onCarCollision'

//adds a boundary to the world
export async function createBoundingBox(world) {
  var boundryShape = new CANNON.Box(new CANNON.Vec3(500, 30, 1))
  var boundryBody = new CANNON.Body({ mass: 0 })
  boundryBody.addEventListener('collide', collisionEventListener)
  boundryBody.addShape(boundryShape)
  boundryBody.position.set(500, 0, 0)
  world.addBody(boundryBody)

  var boundryShape2 = new CANNON.Box(new CANNON.Vec3(500, 30, 1))
  var boundryBody2 = new CANNON.Body({ mass: 0 })
  boundryBody2.addEventListener('collide', collisionEventListener)
  boundryBody2.addShape(boundryShape2)
  boundryBody2.position.set(500, 0, 1000)
  world.addBody(boundryBody2)

  var boundryShape3 = new CANNON.Box(new CANNON.Vec3(500, 30, 1))
  var boundryBody3 = new CANNON.Body({ mass: 0 })

  boundryBody3.addEventListener('collide', collisionEventListener)
  boundryBody3.addShape(boundryShape3)
  boundryBody3.position.set(1000, 0, 500)
  world.addBody(boundryBody3)
  boundryBody3.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    Math.PI / 2,
  )

  var boundryShape4 = new CANNON.Box(new CANNON.Vec3(500, 30, 1))
  var boundryBody4 = new CANNON.Body({ mass: 0 })
  boundryBody4.addEventListener('collide', collisionEventListener)
  boundryBody4.addShape(boundryShape4)
  boundryBody4.position.set(0, 0, 500)
  world.addBody(boundryBody4)
  boundryBody4.quaternion.setFromAxisAngle(
    new CANNON.Vec3(0, 1, 0),
    Math.PI / 2,
  )
}
