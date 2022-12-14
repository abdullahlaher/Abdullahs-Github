import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
var speed = 0
var maxSpeed = 0.8
var minSpeed = -0.8

var vehicle
var angle = 0

//contains all the logic related to the car physics engine
export async function createPlayer(world, scene, wheelMaterial) {
  var chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.3, 6.1))
  var chassisBody = new CANNON.Body({ mass: 150 })

  chassisBody.addShape(chassisShape)
  chassisBody.position.set(500, 0.2, 500)
  chassisBody.angularVelocity.set(0, 0, 0)
  //rotate chassis body
  chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI)

  const loader = new GLTFLoader()
  const player = await loader.loadAsync('../resources/models/taxi.glb')
  player.scene.traverse(function (node) {
    if ((<THREE.Mesh>node).isMesh) {
      //(<THREE.Mesh> node).geometry.computeVertexNormals();
      node.castShadow = true
      node.receiveShadow = true
    }
  })

  const car = player.scene
  car.scale.set(2.5, 2.5, 2.5)
  car.castShadow = true
  scene.add(car)
  vehicle = new CANNON.RaycastVehicle({
    chassisBody: chassisBody,
    indexRightAxis: 0, // x
    indexUpAxis: 1, // y
    indexForwardAxis: 2, // z
  })

  //values relating to the physics engine
  var options = {
    radius: 0.8,
    directionLocal: new CANNON.Vec3(0, -1, 0),
    suspensionStiffness: 25,
    suspensionRestLength: 0.4,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.5,
    maxSuspensionForce: 200000,
    rollInfluence: 0.3,
    axleLocal: new CANNON.Vec3(-1, 0, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.25,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  }
  //generate wheels
  var axlewidth = 2.2
  options.chassisConnectionPointLocal.set(axlewidth, 0, -3.2)
  vehicle.addWheel(options)

  options.chassisConnectionPointLocal.set(-axlewidth, 0, -3.2)
  vehicle.addWheel(options)

  options.chassisConnectionPointLocal.set(axlewidth, 0, 3.4)
  vehicle.addWheel(options)

  options.chassisConnectionPointLocal.set(-axlewidth, 0, 3.4)
  vehicle.addWheel(options)

  vehicle.addToWorld(world)
  const wheelBodies = [],
    wheelVisuals = []
  vehicle.wheelInfos.forEach(function (wheel) {
    var shape = new CANNON.Cylinder(
      wheel.radius,
      wheel.radius,
      wheel.radius / 2,
      20,
    )
    var body = new CANNON.Body({ mass: 1, material: wheelMaterial })
    var q = new CANNON.Quaternion()
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
    body.addShape(shape, new CANNON.Vec3(), q)
    wheelBodies.push(body)
    // wheel visual body
    var geometry = new THREE.CylinderGeometry(
      wheel.radius,
      wheel.radius,
      0.4,
      32,
    )
    var material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      emissive: 0x000000,
      side: THREE.DoubleSide,
      flatShading: true,
    })
    var cylinder = new THREE.Mesh(geometry, material)
    cylinder.geometry.rotateZ(Math.PI / 2)
    wheelVisuals.push(cylinder)
    //cylinder.scale.set(3,3,3);
    scene.add(cylinder)
  })

  return {
    vehicle,
    chassisBody,
    wheelBodies,
    wheelVisuals,
    car,
  }
}
export function addEventListener(world, wheelBodies, wheelVisuals) {
  world.addEventListener('postStep', function () {
    for (var i = 0; i < vehicle.wheelInfos.length; i++) {
      vehicle.updateWheelTransform(i)
      var t = vehicle.wheelInfos[i].worldTransform
      // update wheel physics
      if (wheelBodies[i]) {
        wheelBodies[i].position.copy(t.position)
        wheelBodies[i].quaternion.copy(t.quaternion)
        // update wheel visuals
        wheelVisuals[i].position.copy(t.position)
        wheelVisuals[i].quaternion.copy(t.quaternion)
      }
    }
  })
}

export function moveCar(carBody, carMesh) {
  if (speed > maxSpeed) speed = maxSpeed
  if (speed < minSpeed) speed = minSpeed

  carBody.position.x += speed * Math.sin(angle)
  carBody.position.z += speed * Math.cos(angle)

  if (carMesh) {
    //@ts-ignore
    carMesh.position.copy(carBody.position)

    //@ts-ignore
    carMesh.quaternion.copy(carBody.quaternion)
  }
}
export function navigate(e) {
  if (e.type != 'keydown' && e.type != 'keyup') return
  var keyup = e.type == 'keyup'
  vehicle.setBrake(0, 0)
  vehicle.setBrake(0, 1)
  vehicle.setBrake(0, 2)
  vehicle.setBrake(0, 3)

  var engineForce = 800,
    maxSteerVal = 0.3
  switch (e.keyCode) {
    case 38: // forward
      vehicle.applyEngineForce(keyup ? 0 : -engineForce, 2)
      vehicle.applyEngineForce(keyup ? 0 : -engineForce, 3)
      break

    case 40: // backward
      vehicle.applyEngineForce(keyup ? 0 : engineForce, 2)
      vehicle.applyEngineForce(keyup ? 0 : engineForce, 3)
      break

    case 39: // right
      vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 2)
      vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 3)
      break

    case 37: // left
      vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 2)
      vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 3)
      break

    case 87: // forward
      vehicle.applyEngineForce(keyup ? 0 : -engineForce, 2)
      vehicle.applyEngineForce(keyup ? 0 : -engineForce, 3)
      break

    case 83: // backward
      vehicle.applyEngineForce(keyup ? 0 : engineForce, 2)
      vehicle.applyEngineForce(keyup ? 0 : engineForce, 3)
      break

    case 68: // right
      vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 2)
      vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 3)
      break

    case 65: // left
      vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 2)
      vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 3)
      break
  }
}

export function getAngle() {
  return angle
}
