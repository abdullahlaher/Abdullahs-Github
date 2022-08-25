import CannonDebugger from 'cannon-es-debugger'

export function enableDebugger(world, scene) {
  return CannonDebugger(scene, world, {
    color: 0xffffff,
    scale: 1.0,
  })
}
