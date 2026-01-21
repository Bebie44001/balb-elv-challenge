import express from 'express'
import { fileURLToPath } from 'url'

function isValidPerson(p){
  return (
    p &&
    typeof p.name === 'string' &&
    Number.isFinite(p.currentFloor) &&
    Number.isFinite(p.dropOffFloor)
  )
}

export function createApp(){
  const app = express()
  app.use(express.json())

  // Allow the Level 8 visualizer (served from a different port) to call this API.
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.status(204).end()
    next()
  })

  // In-memory store (Level 9). Resettable for demos/tests.
  let requests = []
  let riders = []

  // Health
  app.get('/health', (req, res) => res.json({ ok: true }))

  // State
  app.get('/state', (req, res) => res.json({ requests, riders }))
  app.post('/reset', (req, res) => {
    requests = []
    riders = []
    res.status(204).end()
  })

  // Requests CRUD
  app.get('/requests', (req, res) => res.json(requests))
  app.post('/requests', (req, res) => {
    const person = req.body
    if(!isValidPerson(person)) return res.status(400).json({ error: 'Invalid person payload' })
    requests.push(person)
    res.status(201).json(person)
  })
  app.delete('/requests', (req, res) => {
    requests = []
    res.status(204).end()
  })
  app.delete('/requests/:index', (req, res) => {
    const idx = Number(req.params.index)
    if(!Number.isInteger(idx) || idx < 0 || idx >= requests.length){
      return res.status(404).json({ error: 'Request not found' })
    }
    const [removed] = requests.splice(idx, 1)
    res.json(removed)
  })

  // Riders CRUD
  app.get('/riders', (req, res) => res.json(riders))
  app.post('/riders', (req, res) => {
    const person = req.body
    if(!isValidPerson(person)) return res.status(400).json({ error: 'Invalid person payload' })
    riders.push(person)
    res.status(201).json(person)
  })
  app.delete('/riders', (req, res) => {
    riders = []
    res.status(204).end()
  })
  app.delete('/riders/:index', (req, res) => {
    const idx = Number(req.params.index)
    if(!Number.isInteger(idx) || idx < 0 || idx >= riders.length){
      return res.status(404).json({ error: 'Rider not found' })
    }
    const [removed] = riders.splice(idx, 1)
    res.json(removed)
  })

  return app
}

export function startServer({ port } = {}){
  const app = createApp()
  const actualPort = Number(port ?? process.env.PORT ?? 3000)
  const server = app.listen(actualPort, () => {
    console.log(`Elevator API listening on http://localhost:${actualPort}`)
  })
  return { app, server, port: actualPort }
}


const isRunDirectly = (() => {
  try {
    return fileURLToPath(import.meta.url) === process.argv[1]
  } catch {
    return false
  }
})()

if (isRunDirectly) startServer()


