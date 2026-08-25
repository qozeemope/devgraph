# DevGraph

A graph-powered developer ecosystem explorer built with React, FastAPI, and CognoDB.

DevGraph lets users explore developers, projects, technologies, and their relationships. The system recommends developers for a project based on both direct and related technical skills.

## Why a graph database?

The core of DevGraph is relationship discovery.

A relational database can store developers, projects, and technologies. But multi-step relationship queries become complex and slow. A graph database makes connections explicit. Traversal becomes a natural way to discover related developers and skills.

## Data Model

```
(Developer)
|
HAS_SKILL
|
(Technology) <--- RELATED_TO ---> (Technology)
|
USES
|
(Project)
|
BELONGS_TO
|
(Domain)

(Developer) --- WORKED_ON ---> (Project)
```

### Nodes

- Developer
- Project
- Technology
- Domain

### Relationships

- HAS_SKILL
- WORKED_ON
- USES
- RELATED_TO
- BELONGS_TO

## Main Graph Queries

### Developer discovery

Find developers with specific technologies and proficiency levels.

### Project recommendations

Find developers whose skills directly match a project's technologies.

### Related-skill discovery

The application performs a multi-hop traversal:

```
Project -> Technology -> RELATED_TO -> Technology -> HAS_SKILL -> Developer
```

This finds developers with skills related to the technologies used by a project.

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Vite

### Backend

- Python
- FastAPI
- Neo4j Python Driver

### Database

- CognoDB
- openCypher over Bolt

## Project Structure

```
devgraph/
├── backend/
│   └── app/
│       ├── routers/
│       ├── services/
│       ├── database.py
│       ├── main.py
│       ├── seed.py
│       └── test_queries.py
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
│
└── README.md
```

## Setup

### 1. Create a CognoDB instance

Create a free CognoDB instance at:

[https://console.cognodb.com](https://console.cognodb.com)

Save the generated Bolt URI and password.

### 2. Backend

```powershell
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```env
COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password
```

Seed the database:

```powershell
python -m app.seed
```

Start the API:

```powershell
uvicorn app.main:app --reload
```

API:

[http://localhost:8000](http://localhost:8000)

Health check:

[http://localhost:8000/health](http://localhost:8000/health)

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:

[http://localhost:5173](http://localhost:5173)

## Environment Variables

Database credentials are loaded from environment variables and excluded from Git using `.gitignore`.

## Features

- Developer directory
- Developer profiles
- Project directory
- Project details
- Technology information
- Graph statistics
- Developer recommendations
- Direct and related skill matching
- Loading, empty, and error states
- Graceful database connection handling

## Author

Qozeem Salami
