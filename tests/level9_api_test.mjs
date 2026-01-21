import chaiPkg from 'chai'
import { startServer } from '../server/index.js'
import ApiElevator from '../api/ApiElevator.js'
import Person from '../person.js'

const { assert } = chaiPkg

describe('Level 9 - API-backed requests/riders', function() {
  this.timeout(5000)

  let server
  let baseUrl

  before(async function() {
    const started = startServer({ port: 0 }) // 0 => random free port
    server = started.server
    const port = server.address().port
    baseUrl = `http://localhost:${port}`
  })

  after(async function() {
    if (!server) return
    await new Promise(resolve => server.close(resolve))
  })

  beforeEach(async function() {
    await fetch(`${baseUrl}/reset`, { method: 'POST' })
  })

  it('should CRUD requests via HTTP endpoints', async () => {
    const person = { name: 'Bob', currentFloor: 3, dropOffFloor: 9 }

    // Create
    let res = await fetch(`${baseUrl}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    })
    assert.equal(res.status, 201)

    // Read
    res = await fetch(`${baseUrl}/requests`)
    const requests = await res.json()
    assert.equal(requests.length, 1)
    assert.equal(requests[0].name, 'Bob')

    // Delete by index
    res = await fetch(`${baseUrl}/requests/0`, { method: 'DELETE' })
    assert.equal(res.status, 200)

    res = await fetch(`${baseUrl}/requests`)
    const after = await res.json()
    assert.equal(after.length, 0)
  })

  it('ApiElevator should add requests and complete pickup/dropoff via API calls', async () => {
    const elevator = new ApiElevator({ baseUrl })
    elevator.checkReturnToLoby = () => false

    const req = new Person('Anne', 1, 3)
    await elevator.addRequest(req)

    // Before dispatch: request exists on server
    let res = await fetch(`${baseUrl}/state`)
    let state = await res.json()
    assert.equal(state.requests.length, 1)
    assert.equal(state.riders.length, 0)

    // Dispatch: should pick up then drop off; end with no riders/requests
    await elevator.dispatchApi()

    res = await fetch(`${baseUrl}/state`)
    state = await res.json()
    assert.equal(state.requests.length, 0)
    assert.equal(state.riders.length, 0)

    // Sanity: elevator moved
    assert.equal(elevator.currentFloor, 3)
    assert.isAtLeast(elevator.floorsTraversed, 3)
  })
})


