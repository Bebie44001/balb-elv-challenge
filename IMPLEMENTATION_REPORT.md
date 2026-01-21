# Elevator Challenge - Full Implementation Report

## Overview

This repository implements **Levels 1-9** of the Elevator Challenge. All levels are fully functional and tested.

---

## Levels Implemented

### Level 1: Basic Elevator and Person Classes

**Status:** Complete and tested

**Files:**
- `elevator.js` - Main Elevator class
- `person.js` - Person class

**Features:**
- Elevator starts at floor 0 (lobby)
- Tracks current floor
- Stores collection of requests and current riders
- Person has name, currentFloor, and dropOffFloor
- Elevator can pick up person and drop them off

---

### Level 2: Test Suite for Up/Down Scenarios

**Status:** Complete and tested

**Files:**
- `tests/elevator_test.cjs` - Comprehensive test suite

**Tests:**
- Person goes up
- Person goes down
- Unit tests for all Elevator methods
- Asserts total stops and floors traversed

---

### Level 3: Track Floors Traversed and Stops

**Status:** Complete and tested

**Features:**
- Elevator tracks `floorsTraversed` counter
- Elevator tracks `stops` counter
- All tests verify these metrics

---

### Level 4: Multiple People Support

**Status:** Complete and tested

**Features:**
- Elevator handles multiple requests
- First-come-first-served order
- `dispatch()` method processes all requests sequentially

**Example:**
- Bob (floor 3 → 9) requested first
- Sue (floor 6 → 2) requested second
- Elevator picks up Bob, drops him at 9, then picks up Sue, drops her at 2

---

### Level 5: Four Scenario Test Suite

**Status:** Complete and tested

**Test Scenarios:**
1. Person A goes up, Person B goes up
2. Person A goes up, Person B goes down
3. Person A goes down, Person B goes up
4. Person A goes down, Person B goes down

**All tests assert:**
- Total number of stops
- Total floors traversed
- Total number of requests and current riders

---

### Level 6: Return to Lobby Based on Time

**Status:** Complete and tested

**Features:**
- Before 12:00 PM: Elevator returns to floor 0 if no riders
- After 12:00 PM: Elevator stays on last drop-off floor if no riders
- `checkReturnToLoby()` method determines behavior
- `returnToLoby()` executes the return

---

### Level 7: Efficient Algorithm

**Status:** Complete and tested

**Files:**
- `elevator.js` - Added `dispatchEfficient()` method

**Features:**
- New efficient dispatch algorithm using nearest-stop heuristics
- Processes all requests/dropoffs in optimal order
- **Proven more efficient**: Tests show fewer floors traversed than baseline `dispatch()`
- Comparison test verifies efficiency across all four Level 5 scenarios

**Algorithm:**
- Picks up/drops off based on current direction and nearest stops
- Minimizes backtracking and unnecessary movements

---

### Level 8: DOM Visualizer

**Status:** Complete and functional

**Files:**
- `visualizer/index.html` - HTML structure
- `visualizer/style.css` - Styling for building/elevator visualization
- `visualizer/ui.js` - Interactive UI logic

**Features:**
- Visual representation of building floors
- Real-time elevator position indicator
- Form to add new requests (name, current floor, drop-off floor)
- Buttons to dispatch elevator (standard and efficient)
- Reset button
- Displays current floor, stops, and floors traversed
- **Level 9 compliant**: Uses API-backed `ApiElevator` instead of direct array mutations

---

### Level 9: API-Backed CRUD Operations

**Status:** Complete and tested

**Files:**
- `server/index.js` - Express backend with CRUD endpoints
- `api/elevatorApiClient.js` - HTTP client wrapper
- `api/ApiElevator.js` - API-backed Elevator subclass
- `tests/level9_api_test.mjs` - Level 9 test suite

**Features:**

**Backend API (`server/index.js`):**
- `GET /health` - Health check
- `GET /state` - Get current requests and riders
- `POST /reset` - Reset all state
- `GET /requests` - List all requests
- `POST /requests` - Add a request
- `DELETE /requests` - Clear all requests
- `DELETE /requests/:index` - Remove specific request
- `GET /riders` - List all riders
- `POST /riders` - Add a rider
- `DELETE /riders` - Clear all riders
- `DELETE /riders/:index` - Remove specific rider
- CORS enabled for cross-origin requests

**API Client (`api/elevatorApiClient.js`):**
- Wraps all HTTP calls to Express backend
- Handles async/await patterns
- Error handling

**API Elevator (`api/ApiElevator.js`):**
- Extends base `Elevator` class
- **Replaces all array mutations with HTTP calls:**
  - `addRequest()` → `POST /requests`
  - `hasPickupApi()` → `DELETE /requests/:index` + `POST /riders`
  - `hasDropoffApi()` → `DELETE /riders/:index`
  - `dispatchApi()` → Full dispatch using API calls
- Syncs state via `GET /state`

**Compliance:**
-  All insertions of requests/riders use `POST` endpoints
-  All deletions of requests/riders use `DELETE` endpoints
-  No direct array mutations in API-backed path
-  Visualizer uses `ApiElevator` (Level 9 compliant)

---

## File Structure

```
utd-elevator-challenge/
├── elevator.js                 # Base Elevator class (Levels 1-7)
├── person.js                   # Person class (Level 1)
├── package.json                # Dependencies and scripts
├── README.md                   # Challenge specifications
├── CHANGES.md                  # Summary of changes
├── IMPLEMENTATION_REPORT.md    # This file
│
├── tests/
│   ├── elevator_test.cjs       # Test suite for Levels 1-7
│   └── level9_api_test.mjs     # Test suite for Level 9 (ESM)
│
├── api/
│   ├── elevatorApiClient.js    # HTTP client for API calls (Level 9)
│   └── ApiElevator.js          # API-backed Elevator subclass (Level 9)
│
├── server/
│   └── index.js                # Express backend server (Level 9)
│
└── visualizer/
    ├── index.html              # UI HTML (Level 8)
    ├── style.css               # UI styling (Level 8)
    └── ui.js                   # UI logic (Levels 8+9)
```

---

## Dependencies

### Production
- `express` - Web server framework (Level 9)

### Development
- `chai` - Assertion library
- `mocha` - Test framework
- `babel-core` - Transpilation for legacy CJS tests
- `babel-preset-es2015` - Babel preset
- `nodemon` - Development server (optional)
- `http-server` - Static file server for UI (via npx)

---

## How to Run

### Prerequisites

```bash
npm install
```

### 1. Run Tests

#### All Tests (Levels 1-9)
```bash
npm run test:all
```

#### Levels 1-7 Only
```bash
npm test
```

#### Level 9 Only
```bash
npm run test:level9
```

### 2. Run the Application

#### Option A: UI + API (Recommended for Level 9)

**Terminal 1 - Start API Server:**
```bash
npm run api
```
- Server starts on `http://localhost:3000`
- You should see: `Elevator API listening on http://localhost:3000`

**Terminal 2 - Start UI:**
```bash
npm run ui
```
- Server starts on `http://localhost:8080`
- You should see available URLs

**Open in Browser:**
```
http://localhost:8080/visualizer/
```

#### Option B: API Only (For testing endpoints)

**Start API:**
```bash
npm run api
```

**Test endpoints:**
```bash
# Health check
curl http://localhost:3000/health

# Get state
curl http://localhost:3000/state

# Add request
curl -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","currentFloor":3,"dropOffFloor":9}'
```

---

## Usage Guide

### Using the Visualizer (Level 8 + 9)

1. **Start both servers** (API + UI) as described above
2. **Open** `http://localhost:8080/visualizer/` in your browser
3. **Add Request:**
   - Enter person name
   - Enter current floor
   - Enter drop-off floor
   - Click "Add Request"
4. **Dispatch Elevator:**
   - Click "Dispatch (Standard)" for first-come-first-served
   - Click "Dispatch (Efficient)" for optimized algorithm
5. **Reset:**
   - Click "Reset" to clear all requests and reset elevator

### Using the API Programmatically (Level 9)

```javascript
import ApiElevator from './api/ApiElevator.js';
import Person from './person.js';

// Create API-backed elevator
const elevator = new ApiElevator({ baseUrl: 'http://localhost:3000' });

// Add request (uses POST /requests)
const person = new Person('Alice', 2, 5);
await elevator.addRequest(person);

// Dispatch (uses API calls for all operations)
await elevator.dispatchApi();

// Reset (uses POST /reset)
await elevator.reset();
```

---

## Testing Details

### Test Files Explained

**`tests/elevator_test.cjs` (Levels 1-7):**
- Uses CommonJS format
- Requires Babel transpilation (`babel-core/register`)
- Tests synchronous Elevator operations
- 10 passing tests

**`tests/level9_api_test.mjs` (Level 9):**
- Uses native ESM format (`.mjs`)
- Cannot use Babel (incompatible with modern syntax)
- Tests async API operations
- Starts/stops Express server automatically
- 2 passing tests

**Why separated:**
- Legacy Babel parser cannot handle ESM syntax (`import`, `import()`)
- Separate test suites avoid tooling conflicts
- Both suites can run independently or together

### Running Tests

```bash
# Run everything
npm run test:all

# Expected output:
# - 10 passing (Levels 1-7)
# - 2 passing (Level 9)
```

---

## Architecture

### Level 1-7: Synchronous, In-Memory

```
Elevator (elevator.js)
├── requests[]  ← Direct array mutations
├── riders[]    ← Direct array mutations
└── Methods operate synchronously
```

### Level 8: DOM Visualization

```
Visualizer (visualizer/ui.js)
├── Uses Elevator or ApiElevator
└── Renders DOM representation
```

### Level 9: API-Backed

```
ApiElevator (api/ApiElevator.js)
├── Extends Elevator
├── Uses ElevatorApiClient
│   └── HTTP calls → Express Server
└── No direct array mutations
    └── All changes via POST/DELETE
```

---

## Key Design Decisions

### 1. Preserved Original Elevator Class

- `elevator.js` remains unchanged for Level 9
- Tests for Levels 1-7 continue to work
- `ApiElevator` extends `Elevator` rather than replacing it
- Allows both implementations to coexist

### 2. Separate Test Suites

- Legacy Babel suite for Levels 1-7 (CJS)
- Modern ESM suite for Level 9
- Avoids tooling conflicts

### 3. Visualizer Uses API (Level 9 Compliance)

- Visualizer uses `ApiElevator` instead of `Elevator`
- All requests/riders managed via API
- Demonstrates full Level 9 compliance

### 4. CORS Enabled

- Express server sends CORS headers
- Allows UI (`localhost:8080`) to call API (`localhost:3000`)
- Required for browser-based UI

---

## Troubleshooting

### "API not reachable" Error

**Problem:** UI shows "API not reachable"

**Solution:**
1. Make sure API server is running: `npm run api`
2. Check console for CORS errors
3. Verify API is listening on port 3000
4. Restart API server after code changes

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::3000`

**Solution:**
1. Find process using port: `netstat -ano | findstr :3000`
2. Kill the process or use a different port
3. Set `PORT` environment variable: `PORT=3001 npm run api`

### 404 Errors for person.js or ApiElevator.js

**Problem:** Browser can't find ES modules

**Solution:**
1. Ensure `npm run ui` serves project root (`.`) not just `visualizer/`
2. Open `http://localhost:8080/visualizer/` (with trailing slash)
3. Check browser console for exact 404 paths

### Tests Fail for Level 9

**Problem:** `npm run test:level9` fails

**Solution:**
1. Ensure Express server can start (no port conflicts)
2. Check Node.js version (should support native ESM)
3. Verify `tests/level9_api_test.mjs` uses correct import syntax

---

## Compliance Checklist

### Level 1 ✅
- [x] Elevator class with floor 0 start
- [x] Person class with name, currentFloor, dropOffFloor
- [x] Pickup and drop-off functionality

### Level 2 ✅
- [x] Tests for up/down scenarios
- [x] Unit tests for all methods
- [x] Asserts stops and floors traversed

### Level 3 ✅
- [x] Tracks floors traversed
- [x] Tracks total stops

### Level 4 ✅
- [x] Multiple people support
- [x] First-come-first-served order

### Level 5 ✅
- [x] Four scenario tests
- [x] Asserts stops, floors, requests, riders

### Level 6 ✅
- [x] Returns to lobby before 12 PM
- [x] Stays on floor after 12 PM

### Level 7 ✅
- [x] Efficient algorithm implemented
- [x] Proven more efficient in tests
- [x] Tested against all four scenarios

### Level 8 ✅
- [x] DOM representation
- [x] Visualizes elevator process
- [x] Interactive UI

### Level 9 ✅
- [x] Express backend with CRUD
- [x] All insertions use POST endpoints
- [x] All deletions use DELETE endpoints
- [x] No direct array mutations in API path
- [x] Visualizer uses API-backed elevator

---


## Author Notes

- All levels completed and tested
- Code follows TDD principles
- Clean separation of concerns
- Backward compatible (original tests still pass)
- Level 9 fully compliant with "replace insertions/deletions with API calls" requirement

---

**Last Updated:** 2026-01-20
**Status:** All Levels Complete 

