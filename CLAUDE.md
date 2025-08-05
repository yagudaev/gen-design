# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gen Design is an AI-powered design exploration tool that helps designers create and iterate on design concepts using their existing design systems. It enables seamless import of design tokens, generates AI-driven variations, and maintains brand consistency throughout the creative process.

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Database**: Prisma ORM (SQLite for development, PostgreSQL for production)
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API and other LLMs
- **Package Manager**: Yarn (NOT npm)

## CRITICAL RULES

1. **USE YARN, NOT NPM** - This project uses Yarn as the package manager. Always use yarn commands.
2. **PRESERVE USER DATA** - Never delete the database without explicit permission

## Common Commands

### Development
```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint
```

### Database
```bash
# Run database migrations
cd website && yarn prisma migrate dev

# Generate Prisma client
cd website && yarn prisma generate

# Open Prisma Studio
cd website && yarn prisma studio

# Create a new migration
cd website && yarn prisma migrate dev --name <migration_name>
```

## Project Structure

```
/
├── website/              # Next.js web application
│   ├── prisma/          # Database schema and migrations
│   ├── src/
│   │   ├── app/        # Next.js app directory
│   │   ├── components/ # React components
│   │   ├── lib/       # Utility functions and configurations
│   │   └── types/     # TypeScript type definitions
│   └── public/        # Static assets
├── shared/             # Shared components and utilities
└── README.md          # Project documentation
```

## Key Features (Planned)

1. **Design System Import**: Import design tokens from Figma, Sketch, or manual configuration
2. **AI-Powered Generation**: Create variations using existing design system constraints
3. **Component Library**: Build and manage reusable design components
4. **Version Control**: Track design iterations and evolution
5. **Collaboration**: Share and collaborate on design explorations

## Development Guidelines

1. Use TypeScript strict mode for all new code
2. Follow Next.js 14+ app directory conventions
3. Use Prisma for all database operations
4. Create reusable utilities in `/src/lib`
5. Keep components modular and testable
6. Use Tailwind CSS for styling

## Environment Variables

Create a `.env.local` file in the website directory with:
```
DATABASE_URL="file:./dev.db"  # For SQLite
# DATABASE_URL="postgresql://..."  # For PostgreSQL
OPENAI_API_KEY="your-key"
# Add other LLM API keys as needed
```

## Important Reminders

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files unless explicitly requested