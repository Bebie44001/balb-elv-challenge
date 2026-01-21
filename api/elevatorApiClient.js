export default class ElevatorApiClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  async getState(){
    const res = await fetch(`${this.baseUrl}/state`)
    if(!res.ok) throw new Error(`GET /state failed: ${res.status}`)
    return await res.json()
  }

  async reset(){
    const res = await fetch(`${this.baseUrl}/reset`, { method: 'POST' })
    if(!res.ok) throw new Error(`POST /reset failed: ${res.status}`)
  }

  async addRequest(person){
    const res = await fetch(`${this.baseUrl}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    })
    if(!res.ok) throw new Error(`POST /requests failed: ${res.status}`)
    return await res.json()
  }

  async listRequests(){
    const res = await fetch(`${this.baseUrl}/requests`)
    if(!res.ok) throw new Error(`GET /requests failed: ${res.status}`)
    return await res.json()
  }

  async deleteRequest(index){
    const res = await fetch(`${this.baseUrl}/requests/${index}`, { method: 'DELETE' })
    if(!res.ok) throw new Error(`DELETE /requests/${index} failed: ${res.status}`)
    return await res.json()
  }

  async addRider(person){
    const res = await fetch(`${this.baseUrl}/riders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person),
    })
    if(!res.ok) throw new Error(`POST /riders failed: ${res.status}`)
    return await res.json()
  }

  async listRiders(){
    const res = await fetch(`${this.baseUrl}/riders`)
    if(!res.ok) throw new Error(`GET /riders failed: ${res.status}`)
    return await res.json()
  }

  async deleteRider(index){
    const res = await fetch(`${this.baseUrl}/riders/${index}`, { method: 'DELETE' })
    if(!res.ok) throw new Error(`DELETE /riders/${index} failed: ${res.status}`)
    return await res.json()
  }
}


