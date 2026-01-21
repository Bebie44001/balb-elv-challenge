import Person from '../person.js'
import ApiElevator from '../api/ApiElevator.js'

// Level 8 + Level 9 combined:
// - UI uses ApiElevator, so requests/riders insertions/deletions happen via Express CRUD calls.
// - Start the API first: `npm run api`
const elevator = new ApiElevator({ baseUrl: 'http://localhost:3000' })
// Keep the UI deterministic regardless of the user's time (Level 6 behavior can surprise people visually).
elevator.checkReturnToLoby = () => false

const MAX_FLOOR = 9

const els = {
  name: document.getElementById('name'),
  currentFloor: document.getElementById('currentFloor'),
  dropOffFloor: document.getElementById('dropOffFloor'),
  addRequest: document.getElementById('addRequest'),
  dispatchBaseline: document.getElementById('dispatchBaseline'),
  dispatchEfficient: document.getElementById('dispatchEfficient'),
  reset: document.getElementById('reset'),

  statFloor: document.getElementById('statFloor'),
  statStops: document.getElementById('statStops'),
  statTraversed: document.getElementById('statTraversed'),
  statRequests: document.getElementById('statRequests'),
  statRiders: document.getElementById('statRiders'),

  building: document.getElementById('building'),
  requestsList: document.getElementById('requestsList'),
  ridersList: document.getElementById('ridersList'),
}

function clampFloor(n){
  if(Number.isNaN(n)) return 0
  return Math.max(0, Math.min(MAX_FLOOR, n))
}

function buildBuilding(){
  els.building.innerHTML = ''
  for(let f = 0; f <= MAX_FLOOR; f++){
    const floor = document.createElement('div')
    floor.className = 'floor'
    floor.dataset.floor = String(f)

    const name = document.createElement('div')
    name.className = 'floorName'
    name.textContent = `Floor ${f}`

    const shaft = document.createElement('div')
    shaft.className = 'shaft'

    floor.appendChild(name)
    floor.appendChild(shaft)
    els.building.appendChild(floor)
  }
}

function renderElevatorCar(){
  document.querySelectorAll('.shaft').forEach(s => { s.innerHTML = '' })
  const shaft = document.querySelector(`.floor[data-floor="${elevator.currentFloor}"] .shaft`)
  if(!shaft) return

  const car = document.createElement('div')
  car.className = 'car'
  car.textContent = 'E'
  shaft.appendChild(car)
}

function renderLists(){
  els.requestsList.innerHTML = ''
  elevator.requests.forEach(r => {
    const li = document.createElement('li')
    li.textContent = `${r.name}: ${r.currentFloor} → ${r.dropOffFloor}`
    els.requestsList.appendChild(li)
  })

  els.ridersList.innerHTML = ''
  elevator.riders.forEach(r => {
    const li = document.createElement('li')
    li.textContent = `${r.name}: ${r.currentFloor} → ${r.dropOffFloor}`
    els.ridersList.appendChild(li)
  })
}

function renderStats(){
  els.statFloor.textContent = String(elevator.currentFloor)
  els.statStops.textContent = String(elevator.stops)
  els.statTraversed.textContent = String(elevator.floorsTraversed)
  els.statRequests.textContent = String(elevator.requests.length)
  els.statRiders.textContent = String(elevator.riders.length)
}

function render(){
  renderElevatorCar()
  renderLists()
  renderStats()
}

els.addRequest.addEventListener('click', async () => {
  const name = (els.name.value || 'Guest').trim() || 'Guest'
  const currentFloor = clampFloor(Number(els.currentFloor.value))
  const dropOffFloor = clampFloor(Number(els.dropOffFloor.value))
  const person = new Person(name, currentFloor, dropOffFloor)
  try {
    await elevator.addRequest(person)
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('API not reachable. Start it with: npm run api')
    return
  }
  render()
})

els.dispatchBaseline.addEventListener('click', async () => {
  try {
    await elevator.dispatchApi()
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('API not reachable. Start it with: npm run api')
    return
  }
  render()
})

els.dispatchEfficient.addEventListener('click', async () => {
  // Efficient dispatch is only implemented on the local Elevator (Level 7).
  // For the Level 9-backed UI, use the baseline API dispatch for now.
  // (If you want, we can implement an API-backed efficient dispatcher too.)
  try {
    await elevator.dispatchApi()
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('API not reachable. Start it with: npm run api')
    return
  }
  render()
})

els.reset.addEventListener('click', async () => {
  try {
    await elevator.resetApi()
  } catch (e) {
    // eslint-disable-next-line no-alert
    alert('API not reachable. Start it with: npm run api')
    return
  }
  elevator.checkReturnToLoby = () => false
  render()
})

buildBuilding()
render()


