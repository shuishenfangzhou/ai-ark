# Technology Stack

## Frontend Architecture

### Core Technologies
- **Framework**: Vanilla JavaScript ES6+ with Vite build system
- **Styling**: Tailwind CSS (CDN) for utility-first styling
- **Icons**: FontAwesome 6.4.0 for consistent iconography
- **Charts**: Chart.js for data visualization

### Build System
- **Bundler**: Vite 6.0.0 for fast development and optimized builds
- **Package Manager**: npm
- **Deployment**: Vercel with SPA routing configuration

## Development Workflow

### Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run E2E tests
npx playwright test

# Generate test data
python generate_data_quick.py
```

### Testing
- **E2E Testing**: Playwright with multi-browser support
- **Test Coverage**: 16 tests covering core user flows
- **CI/CD**: Automated testing on Vercel deployments

## Data Management

### Static Data Approach
- Tools data stored in `/public/toolsData.json`
- Python scripts for data generation and management
- Logo assets managed in `/assets/logos/` and `/public/assets/logos/`

### Data Generation Scripts
- `tools_manager.py`: Main data management with logo downloading
- `generate_data_quick.py`: Fast data generation without logo downloads
- Supports 283+ tools across 15 categories

## Architecture Patterns

### State Management
- Vanilla JavaScript with global state object
- Local storage for user preferences and favorites
- No external state management library

### Component Structure
- Modular JavaScript functions for UI components
- Event-driven architecture for user interactions
- Infinite scroll with intersection observer

### Performance Optimizations
- Lazy loading for images with fallback avatars
- Infinite scroll pagination (36 items per batch)
- CDN-based assets for faster loading
- Optimized bundle size with Vite

## Browser Support
- Modern browsers with ES6+ support
- Mobile-first responsive design
- Progressive enhancement approach