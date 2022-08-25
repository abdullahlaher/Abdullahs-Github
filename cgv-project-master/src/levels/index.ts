type Level = {
  index: number
  name: string
  numOfPassengers: number
  timeToPickUp: number
  isAllYouCanPickUp?: boolean
  numberOfPassengersPerBlock: number
  carHealth: number
}

export const levels: Level[] = [
  {
    index: 0,
    name: 'Basic',
    numOfPassengers: 5,
    timeToPickUp: 59,
    numberOfPassengersPerBlock: 3,
    carHealth: 1000,
  },
  {
    index: 1,
    name: 'Intermediate',
    numOfPassengers: 10,
    timeToPickUp: 59,
    numberOfPassengersPerBlock: 2,
    carHealth: 500,
  },
  {
    index: 2,
    name: 'Mid',
    numOfPassengers: 15,
    timeToPickUp: 59,
    numberOfPassengersPerBlock: 2,
    carHealth: 400,
  },
  {
    index: 3,
    name: 'Advanced',
    numOfPassengers: 20,
    timeToPickUp: 59,
    numberOfPassengersPerBlock: 2,
    carHealth: 300,
  },
  {
    index: 4,
    name: 'Pro',
    numOfPassengers: 25,
    timeToPickUp: 59,
    numberOfPassengersPerBlock: 1,
    carHealth: 200,
  },
  {
    index: 5,
    name: 'Unlimited',
    numOfPassengers: 0,
    timeToPickUp: 59,
    isAllYouCanPickUp: true,
    numberOfPassengersPerBlock: 1,
    carHealth: 100,
  },
]

export function getLevelByIndex(index: number): Level {
  const level = levels.find(level => level.index === index)
  if (!level) return levels[0]
  return level
}
