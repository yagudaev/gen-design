# Gen Design

An AI-powered design exploration tool that helps designers create and iterate on ideas using their existing design systems.

## Overview

Gen Design is a generative AI tool for designers that makes it easy to:
- Import existing design systems (colors, typography, components)
- Generate new design concepts based on your design system
- Explore AI-driven design variations and ideas
- Maintain consistency with your brand guidelines

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gen-design.git
cd gen-design
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp website/.env.example website/.env.local
```

4. Run the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
gen-design/
├── website/          # Next.js web application
├── shared/           # Shared components and utilities
└── package.json      # Root package configuration
```

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: Prisma ORM
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API (and other LLMs)

## Features (Planned)

- **Design System Import**: Easy import from Figma, Sketch, or manual configuration
- **AI-Powered Generation**: Create variations and new concepts using your design tokens
- **Component Library**: Build and manage reusable design components
- **Version Control**: Track iterations and design evolution
- **Collaboration**: Share and collaborate on design explorations

## Development

```bash
# Run development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint
```

## License

Private - All rights reserved

## Contact

For questions or feedback, please reach out to [your-email@example.com]