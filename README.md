# TaskKernel

TaskKernel is a gamified progress tracker web app for students and everyday users who want a simple way to build habits, develop skills, and stay consistent. Users create tasks, check them off each day, and earn progression through a leveling system and rewards.

## Live Demo

[taskkernel.netlify.app](https://taskkernel.netlify.app)

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and Netlify for continuous deployment.

- Every push to `main` automatically triggers the CI pipeline
- The pipeline installs dependencies and builds the React app
- Netlify auto-deploys the frontend on every successful push to `main`
- Any team member can push a change and see it live within minutes

## Features

- Create tasks/goals with a target frequency (days per week)
- Mark daily completions (one completion per task per day)
- Weekly calendar view for completion history
- Progression system (levels, streaks, achievements)
- Progress charts and summaries (planned)

## Tech Stack

- Frontend: React + Tailwind CSS
- Backend: Spring Boot + JWT authentication
- Database: PostgreSQL
- Deployment: Netlify (frontend), Render (backend)
- CI/CD: GitHub Actions

## Roadmap

**Phase 1 (MVP):**

- Login / registration
- Create / edit / delete tasks
- Daily completion checkboxes
- Weekly calendar view
- Basic progression (XP per completion)

**Phase 2 (Game Mechanics):**

- Level thresholds
- Streak tracking
- Achievement badges
- Progress charts
- Visual character/avatar progression

**Phase 3 (Polish):**

- Animations for completions
- Mobile responsive layout
- Better visualizations

## Repository Structure

- frontend/ –> React user interface
- backend/ –> Server/API (future development)
- docs/ –> Sprint notes and class artifacts

## How to Run

> This project is under active development. Frontend setup is available now; backend setup will be added in a future sprint.

### Prerequisites

- Git
- Node.js (LTS) + npm
- Java 17 _(backend planned)_

### Frontend

Run the React development server locally:

- git clone https://github.com/spencerwest-dev/TaskKernel.git
- cd TaskKernel
- cd frontend
- npm install
- npm start

## Authors

- Max Acevedo
- Morris Chi
- Jorge Valdez Dominguez
- Janeth Loera
- Jorge Merino
- Ben Ulaj
- Spencer West

## License

TBD (MIT recommended).
