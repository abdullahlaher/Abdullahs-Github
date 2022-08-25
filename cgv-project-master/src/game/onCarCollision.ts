import { onCarCollision } from '../gameLogic'

//handles car health
export function collisionEventListener(e) {
  var relativeVelocity = e.contact.getImpactVelocityAlongNormal()
  onCarCollision(relativeVelocity)
}
