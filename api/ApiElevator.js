import Elevator from '../elevator.js'
import ElevatorApiClient from './elevatorApiClient.js'

// Level 9: API-backed elevator.
// - Keeps the original synchronous Elevator untouched (so Level 1–8 tests remain green).
// - Mirrors request/rider insertions & deletions through HTTP CRUD calls.
// - Uses the same movement logic (moveUp/moveDown/hasStop) by syncing local arrays from the API.
export default class ApiElevator extends Elevator {
  constructor({ baseUrl } = {}) {
    super()
    this.api = new ElevatorApiClient(baseUrl)
  }

  async syncFromApi(){
    const { requests, riders } = await this.api.getState()
    this.requests = requests
    this.riders = riders
  }

  async resetApi(){
    await this.api.reset()
    this.reset()
  }

  async addRequest(person){
    await this.api.addRequest(person)
    await this.syncFromApi()
  }

  // Override pickup/dropoff to do CRUD via API rather than array mutation.
  async hasPickupApi(){
    await this.syncFromApi()
    const pickups = this.requests
      .map((request, idx) => ({ request, idx }))
      .filter(({ request }) => request.currentFloor === this.currentFloor)

    if(!pickups.length) return false

    // Delete from requests in reverse index order so indices remain valid.
    for (const { idx } of pickups.sort((a, b) => b.idx - a.idx)) {
      await this.api.deleteRequest(idx)
    }
    // Add as riders.
    for (const { request } of pickups) {
      await this.api.addRider(request)
    }
    await this.syncFromApi()
    return true
  }

  async hasDropoffApi(){
    await this.syncFromApi()
    const dropoffs = this.riders
      .map((rider, idx) => ({ rider, idx }))
      .filter(({ rider }) => rider.dropOffFloor === this.currentFloor)

    if(!dropoffs.length) return false

    for (const { idx } of dropoffs.sort((a, b) => b.idx - a.idx)) {
      await this.api.deleteRider(idx)
    }
    await this.syncFromApi()
    return true
  }

  async hasStopApi(){
    // Mirror the original semantics: stop only after traversing >= 1 floor.
    const hadPickup = await this.hasPickupApi()
    const hadDropoff = await this.hasDropoffApi()
    return (hadPickup || hadDropoff) && (this.floorsTraversed > 0)
  }

  async moveUpApi(){
    this.currentFloor++
    this.floorsTraversed++
    if(await this.hasStopApi()) this.stops++
  }

  async moveDownApi(){
    if(this.currentFloor <= 0) return
    this.currentFloor--
    this.floorsTraversed++
    if(await this.hasStopApi()) this.stops++
  }

  async goToFloorApi(person){
    // Pickup: move to person's current floor (request floor).
    while(this.currentFloor !== person.currentFloor){
      if(person.currentFloor > this.currentFloor) await this.moveUpApi()
      else await this.moveDownApi()
    }

    // Dropoffs: keep moving until no riders remain (like base implementation, but synced via API).
    await this.syncFromApi()
    while(this.riders.length){
      // Choose the next rider's dropoff in current rider order.
      const rider = this.riders[0]
      while(this.currentFloor !== rider.dropOffFloor && this.riders.length){
        if(rider.dropOffFloor > this.currentFloor) await this.moveUpApi()
        else await this.moveDownApi()
        await this.syncFromApi()
      }
      await this.syncFromApi()
    }

    this.checkReturnToLoby() && this.returnToLoby()
  }

  async dispatchApi(){
    await this.syncFromApi()
    for (const request of this.requests) {
      await this.syncFromApi()
      if(this.riders.length || this.requests.length){
        await this.goToFloorApi(request)
      }
    }
  }
}


