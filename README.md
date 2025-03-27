# EV Charger Management System

A SaaS platform for electricians to manage and diagnose EV charger problems through a ticket system.

## Project Overview

This application provides electricians with a comprehensive tool to manage EV charger maintenance and troubleshooting. Key features include:

- **Ticket Management**: Create, view, and update maintenance tickets
- **Diagnostics Interface**: Analyze EV charger issues efficiently
- **Maintenance History**: Track previous work and recurring problems
- **Knowledge Base**: Access troubleshooting guides and technical documentation

## Tech Stack

- **Frontend**: React with TypeScript, Shadcn UI components, TailwindCSS
- **Backend**: Node.js with Express
- **State Management**: TanStack React Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Storage**: In-memory database with typed interfaces (can be connected to PostgreSQL)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ev-charger-management.git
   cd ev-charger-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

The application consists of both frontend and backend components that run concurrently.

#### Starting the Development Server

Run the following command to start both the client and server:

```bash
npm run dev
```

This command:
- Starts the Express backend server
- Launches the Vite development server for the frontend
- Automatically refreshes when code changes are made

#### Accessing the Application

Once started, the application will be available at:
- [http://localhost:3000](http://localhost:3000) (when running locally)
- Or the URL provided by your hosting platform

## Project Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Application entry point
│   └── index.html           # HTML entry point
├── server/                  # Backend Node.js server
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Data storage interface
│   └── vite.ts              # Vite server configuration
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema and TypeScript types
└── package.json             # Project dependencies and scripts
```

## Development Workflow

1. **Backend Development**:
   - Define schemas in `shared/schema.ts`
   - Implement storage operations in `server/storage.ts`
   - Create API endpoints in `server/routes.ts`

2. **Frontend Development**:
   - Create UI components in `client/src/components`
   - Implement pages in `client/src/pages`
   - Set up routing in `client/src/App.tsx`

## Contributing

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Submit a pull request

## License

[Your chosen license]