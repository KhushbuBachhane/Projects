# DisasterWatch

Real-Time Disaster Alert Platform built with the MERN stack.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React + Vite Client                      │
│  (Auth, Map, Dashboard, Reports, Admin Panel, Dark Mode)    │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                   Express.js Server                          │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Routes  │→│ Controllers│→│  Models  │→│   MongoDB     │  │
│  └──────────┘ └────────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────┐ ┌────────────┐                                 │
│  │   JWT    │ │  Socket.IO │  Real-time disaster alerts      │
│  └──────────┘ └────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
DisasterWatch/
├── client/                          # React + Vite frontend (Phase 2)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/                          # Express backend (Phase 1 - DONE)
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── disasterController.js
│   │   ├── userController.js
│   │   ├── emergencyContactController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect + admin guard
│   │   ├── errorHandler.js
│   │   └── upload.js                # Multer image upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Disaster.js
│   │   └── EmergencyContact.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── disasterRoutes.js
│   │   ├── userRoutes.js
│   │   ├── emergencyContactRoutes.js
│   │   └── statsRoutes.js
│   ├── socket/
│   │   └── index.js                 # Socket.IO events
│   ├── uploads/                     # Uploaded disaster images
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## Database Schemas

### User
| Field    | Type   | Description              |
|----------|--------|--------------------------|
| name     | String | User display name        |
| email    | String | Unique, lowercase        |
| password | String | Hashed with bcrypt       |
| role     | String | `user` or `admin`        |

### Disaster
| Field       | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| title       | String   | Report title                                     |
| description | String   | Detailed description                             |
| category    | Enum     | Flood, Fire, Earthquake, Accident, Storm, Landslide |
| severity    | Enum     | Low, Medium, High, Critical                      |
| latitude    | Number   | GPS latitude                                     |
| longitude   | Number   | GPS longitude                                    |
| image       | String   | Uploaded image path                              |
| verified    | Boolean  | Admin-verified flag                              |
| reportedBy  | ObjectId | Reference to User                                |
| createdAt   | Date     | Auto timestamp                                   |

### EmergencyContact
| Field       | Type    | Description           |
|-------------|---------|-----------------------|
| name        | String  | Contact name          |
| phone       | String  | Phone number          |
| category    | String  | e.g. Police, Fire     |
| description | String  | Optional details      |
| isActive    | Boolean | Visible on frontend   |

## API Endpoints

### Auth
| Method | Endpoint           | Access  | Description        |
|--------|--------------------|---------|--------------------|
| POST   | /api/auth/register | Public  | Register new user  |
| POST   | /api/auth/login    | Public  | Login, get JWT     |
| GET    | /api/auth/me       | Private | Get current user   |

### Disasters
| Method | Endpoint                    | Access        | Description              |
|--------|-----------------------------|---------------|--------------------------|
| GET    | /api/disasters              | Public        | List with filters        |
| GET    | /api/disasters/:id          | Public        | Get single report        |
| POST   | /api/disasters              | Private       | Create report (+ image)  |
| PUT    | /api/disasters/:id          | Owner/Admin   | Update report            |
| DELETE | /api/disasters/:id          | Owner/Admin   | Delete report            |
| PATCH  | /api/disasters/:id/verify   | Admin         | Verify report            |
| PATCH  | /api/disasters/:id/severity | Admin         | Update severity          |

**Query params for GET /api/disasters:** `category`, `severity`, `search`, `startDate`, `endDate`, `verified`, `page`, `limit`

### Users (Admin)
| Method | Endpoint              | Access | Description      |
|--------|-----------------------|--------|------------------|
| GET    | /api/users            | Admin  | List all users   |
| GET    | /api/users/:id        | Admin  | Get user by ID   |
| PATCH  | /api/users/:id/role   | Admin  | Change user role |
| DELETE | /api/users/:id        | Admin  | Delete user      |

### Emergency Contacts
| Method | Endpoint                      | Access | Description       |
|--------|-------------------------------|--------|-------------------|
| GET    | /api/emergency-contacts       | Public | List contacts     |
| POST   | /api/emergency-contacts       | Admin  | Create contact    |
| PUT    | /api/emergency-contacts/:id   | Admin  | Update contact    |
| DELETE | /api/emergency-contacts/:id   | Admin  | Delete contact    |

### Dashboard Stats
| Method | Endpoint    | Access  | Description                    |
|--------|-------------|---------|--------------------------------|
| GET    | /api/stats  | Private | Aggregated dashboard statistics|

## Socket.IO Events

### Client → Server
| Event        | Description              |
|--------------|--------------------------|
| joinAlerts   | Join the alerts room     |

### Server → Client
| Event            | Payload        | Description              |
|------------------|----------------|--------------------------|
| newDisaster      | Disaster object| New report created       |
| disasterUpdated  | Disaster object| Report updated           |
| disasterDeleted  | { _id }        | Report deleted           |
| disasterVerified | Disaster object| Report verified by admin |
| severityUpdated  | Disaster object| Severity changed         |

## Backend Setup

1. Copy environment file:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit `.env` with your MongoDB Atlas URI and JWT secret.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:5000`.

## Frontend Setup

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Copy environment file (optional — Vite proxy handles API in dev):
   ```bash
   cp .env.example .env
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

Frontend runs at `http://localhost:5173`.

## Running Full Stack

Terminal 1 (backend):
```bash
cd server && npm run dev
```

Terminal 2 (frontend):
```bash
cd client && npm run dev
```

## Frontend Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with hero, map preview, recent reports |
| `/login` | Public | User login |
| `/register` | Public | User registration |
| `/map` | Public | Full-screen interactive Leaflet map |
| `/disasters` | Public | Searchable/filterable report list |
| `/disasters/:id` | Public | Single report detail |
| `/report` | Private | Submit disaster report with map + photo |
| `/dashboard` | Private | Statistics and charts |
| `/emergency` | Public | Emergency contact numbers |
| `/admin` | Admin | Admin dashboard overview |
| `/admin/reports` | Admin | Verify, update severity, delete reports |
| `/admin/users` | Admin | Manage user roles |
| `/admin/contacts` | Admin | Manage emergency contacts |

## Next Phase

Frontend setup with React + Vite + Tailwind CSS, Leaflet map, Socket.IO client, dashboard charts, admin panel, and dark mode — **COMPLETE**.
