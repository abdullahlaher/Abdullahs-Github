import * as THREE from 'three'
import { pickRandom } from '../utils/pickRandom'
import { getCurrentLevel } from '../gameLogic'
import { shuffle } from '../utils/shuffle'

const listener = new THREE.AudioListener()
const sound = new THREE.Audio(listener)
const audioLoader = new THREE.AudioLoader()
const songs = ['bopha', 'mmapula', 'ndihamba-nawe', 'paris', 'woza', 'sister-bethina']
let shuffled = await shuffle(songs)
const musicSound = new THREE.Audio(listener);
export async function playPickupSound(camera) {
  // create an AudioListener and add it to the camera
  camera.add(listener)

  // create a global audio source
  // load a sound and set it as the Audio object's buffer
  const sounds = ['bossa', 'chief', 'cuzzie', 'vibes', 'shup']
  const buffer = await audioLoader.loadAsync('../resources/audio/' + pickRandom(sounds) + '.ogg')

  sound.setBuffer(buffer)
  sound.setVolume(0.4)
  sound.play()
}
export async function queueBackroundMusic(scene) {
  scene.add(listener)
  const audioLoader = new THREE.AudioLoader()
  const buffer = await audioLoader.loadAsync(
    '../resources/audio/' + shuffled[await getCurrentLevel()] + '.mp3',
  )
  musicSound.setBuffer(buffer)
  musicSound.setVolume(0.1)
  musicSound.play()
}
export async function pauseMusic(){
  musicSound.pause()
}
export async function playMusic(){
  musicSound.play()
}