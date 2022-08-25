import { getNumberOfPeopleHit } from './game/people'
import { getLevelByIndex, levels } from './levels'
import { animate } from './main'
import { setLoadingText } from './ui/loading'
import { decryptUrlParams, encryptUrlParams } from './utils/encodeParams'
import { getUrlSearchParams } from './utils/params'
import { startTimer } from './utils/timer'
import { pauseMusic, playMusic } from './game/soundEffects'

var paused = false
var encodedLevel = getUrlSearchParams('secret')
var levelIndex
try {
  levelIndex = parseInt(decryptUrlParams(encodedLevel))
  if (isNaN(levelIndex) || levelIndex < 0 || levelIndex > levels.length) {
    levelIndex = 0
  }
} catch (e) {
  levelIndex = 0
}
let level = getLevelByIndex(levelIndex)

export async function getCurrentLevel() {
  return levelIndex
}

const isUnlimited = level.isAllYouCanPickUp
if (levelIndex != 0) {
  setLoadingText(
    isUnlimited
      ? 'Unlimited pickup round'
      : `You're levelling up bossa! - Level ${levelIndex + 1}`,
  )
}
const menuHeading = document.createElement('h1')
const hitCountDiv = document.createElement('h1')
var hitCount = 0
const pauseButton = document.createElement('button')
const restartButton = document.createElement('button')
const unlimitedButton = document.createElement('button')
const viewLeaderboardButton = document.createElement('button')
const countDown = document.createElement('h1')
const menuButton = document.createElement('button')
const creditsText = document.createElement('h1')
const characterCredits = 'Characters by micaelsampaio, via Sketchfab'
const buildingCredits = 'Buildings by corashina, via Github'

//todo: make this into an actual progress bar
const healthBar = document.createElement('progress')
healthBar.className = 'progress-bar'
healthBar.max = level.carHealth

const healthDisplayDiv = document.createElement('div')
healthDisplayDiv.style.display = 'flex'
healthDisplayDiv.style.flexDirection = 'row'
healthDisplayDiv.style.position = 'absolute'
healthDisplayDiv.style.top = '17%'
//healthDisplayDiv.style.backgroundColor = "red"

const menuDisplayDiv = document.createElement('div')
//use flex row
menuDisplayDiv.style.display = 'none'
menuDisplayDiv.style.flexDirection = 'column'
menuDisplayDiv.style.position = 'fixed'
menuDisplayDiv.style.top = '15%'
menuDisplayDiv.style.left = '30%'
menuDisplayDiv.style.width = '40%'
menuDisplayDiv.style.height = '75%'
menuDisplayDiv.style.borderRadius = '25px'
menuDisplayDiv.style.backgroundColor = 'rgba(0, 0, 0, .6)'

const topLevelDisplayDiv = document.createElement('div')
//use flex row
topLevelDisplayDiv.style.display = 'flex'
topLevelDisplayDiv.style.flexDirection = 'row'
topLevelDisplayDiv.style.justifyContent = 'space-between'
topLevelDisplayDiv.style.position = 'absolute'
topLevelDisplayDiv.style.top = '0%'
topLevelDisplayDiv.style.left = '0%'
topLevelDisplayDiv.style.width = '100%'

//topLevelDisplayDiv.style.backgroundColor = '#FF0000'
let target = level.numOfPassengers
let carHealth = level.carHealth
export function initGameLogic() {
  createMenuDiv()
  showHitCounter()
  displayTimer()
  createHealthBar()
  createPauseButton()
}
export function displayTimer() {
  countDown.className = 'onScreenText'
  countDown.innerHTML = level.timeToPickUp.toString()
  countDown.style.marginLeft = '-19%'
  startTimer(level.timeToPickUp, countDown, onCountEnd)
  addToDisplayDiv(countDown)
}

async function onCountEnd() {
  paused = true
  const peopleHit = getNumberOfPeopleHit()
  if (peopleHit < target) {
    //make the renderer blurred
    location.replace('/lost.html')
    target = -1
  }
  if (isUnlimited) {
    const encryptedParam = encryptUrlParams(peopleHit.toString())

    location.replace(
      `https://itekisi-leaderboard.vercel.app/add-username?score=${encryptedParam}`,
    )
  }
}

async function moveToNextLevel() {
  paused = true
  const encryptedLevel = encryptUrlParams((levelIndex + 1).toString())
  location.replace(window.location.origin + '?secret=' + encryptedLevel)
}
async function goToLevel(level) {
  paused = true
  if (level === '0') {
    location.replace('/')
    return
  }
  const encryptedLevel = encryptUrlParams(level)
  location.replace(window.location.origin + '?secret=' + encryptedLevel)
}
function showHitCounter() {
  hitCountDiv.className = 'onScreenText'
  hitCountDiv.innerHTML = 'Passengers:' + (target - hitCount)
  addToDisplayDiv(hitCountDiv)
}
function addToDisplayDiv(element) {
  topLevelDisplayDiv.appendChild(element)
  document.body.appendChild(topLevelDisplayDiv)
}

function addToMenuDiv(element) {
  menuDisplayDiv.appendChild(element)
  document.body.appendChild(menuDisplayDiv)
}

function addToHealthDiv(element) {
  healthDisplayDiv.appendChild(element)
  document.body.appendChild(healthDisplayDiv)
}

function createHealthBar() {
  healthBar.value = carHealth
  addToHealthDiv(healthBar)
}
export function createResumeButton() {
  pauseButton.className = 'menuButtons'
  pauseButton.innerHTML = 'Resume'
  pauseButton.onclick = () => {
    paused = false
    playMusic()
    hideMenuDiv()
    animate()
  }
  addToMenuDiv(pauseButton)
}

export function createRestartButton() {
  restartButton.className = 'menuButtons'
  restartButton.innerHTML = 'Restart'
  restartButton.onclick = () => {
    goToLevel('0')
  }
  addToMenuDiv(restartButton)
}

export function createUnlimitedButton() {
  unlimitedButton.className = 'menuButtons'
  unlimitedButton.innerHTML = 'Unlimited Pickup Round'
  unlimitedButton.onclick = () => {
    goToLevel('5')
  }
  addToMenuDiv(unlimitedButton)
}

export function createLeaderboardButton() {
  viewLeaderboardButton.className = 'menuButtons'
  viewLeaderboardButton.innerHTML = 'View Leaderboard'
  viewLeaderboardButton.onclick = () => {
    //go to leaderboard page
    const url = 'https://itekisi-leaderboard.vercel.app/'

    location.replace(url)
  }
  addToMenuDiv(viewLeaderboardButton)
}

export function createPauseButton() {
  menuButton.className = 'pauseButton'
  menuButton.innerHTML = '||'
  menuButton.onclick = () => {
    paused = true
    pauseMusic()
    showMenuDiv()
  }
  addToDisplayDiv(menuButton)
}

export function createMenuDiv() {
  menuHeading.className = 'menuHeading'
  menuHeading.innerHTML = 'MENU'
  addToMenuDiv(menuHeading)
  createResumeButton()
  createRestartButton()
  createUnlimitedButton()
  createLeaderboardButton()
  createHealthBar()
  creditsText.className = 'creditsText'
  creditsText.innerHTML = characterCredits + '<br />' + buildingCredits
  addToMenuDiv(creditsText)
}

export function showMenuDiv() {
  menuDisplayDiv.style.display = 'flex'
}

export function hideMenuDiv() {
  menuDisplayDiv.style.display = 'none'
}

export function getPaused() {
  return paused
}
export async function updateHitCount() {
  if (!isUnlimited && getNumberOfPeopleHit() >= target && target != -1) {
    await moveToNextLevel()
  }

  const hitCountDivText = isUnlimited
    ? `Picked up: ${getNumberOfPeopleHit()}`
    : 'Passengers: ' + (target - getNumberOfPeopleHit())
  hitCountDiv.innerHTML = hitCountDivText
}

export function onCarCollision(velocity) {
  carHealth -= velocity
  if (carHealth <= 0) {
    location.replace('/lost.html')
  }
  createHealthBar()
}
export function getNumberOfPeopleToAdd() {
  return level.numberOfPassengersPerBlock
}
