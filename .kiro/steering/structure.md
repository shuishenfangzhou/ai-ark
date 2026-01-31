# Project Structure

## Root Directory Layout

```
├── index.html              # Main application entry point
├── package.json           # Dependencies and scripts
├── vercel.json           # Deployment configuration
├── playwright.config.ts  # E2E test configuration
└── PROJECT_SUMMARY.md    # Comprehensive project documentation
```

## Source Code Organization

### `/src/` - Application Source
```
src/
├── main.js        # Main application logic and state management
├── style.css      # Custom CSS styles and animations
├── analytics.js   # Analytics and tracking utilities
└── tools_data.js  # Legacy data file (deprecated)
```

### `/public/` - Static Assets
```
public/
├── toolsData.json           # Main tools database (283+ tools)
├── robots.txt              # SEO crawler instructions
├── sitemap.xml            # SEO sitemap
└── assets/
    └── logos/             # Tool logos and brand assets
```

### `/assets/` - Development Assets
```
assets/
└── logos/                 # Original logo files for processing
```

## Data Management Structure

### `/js/` - Generated Data Files
```
js/
└── tools_data.js          # Generated JavaScript data file
```

### Python Scripts (Root Level)
```
├── tools_manager.py       # Main data management script
├── generate_data_quick.py # Fast data generation utility
├── scraper_*.py          # Web scraping utilities
└── merge_*.py            # Data merging scripts
```

## Testing Structure

### `/tests/` - E2E Tests
```
tests/
└── basic.spec.ts          # Playwright test suite (16 tests)
```

### Test Reports
```
├── playwright-report/     # Generated test reports
└── test-results/         # Test execution results
```

## Configuration Files

### Build & Development
- `package.json`: npm dependencies and scripts
- `vercel.json`: SPA routing and deployment rules
- `playwright.config.ts`: Test configuration for multiple browsers

### Project Documentation
- `.sisyphus/`: Project planning and research documentation
- `PROJECT_SUMMARY.md`: Complete project overview and metrics

## Key File Relationships

1. **Data Flow**: `tools_manager.py` → `toolsData.json` → `main.js`
2. **Build Process**: `src/` → Vite → `dist/` → Vercel
3. **Testing**: `tests/` → Playwright → `playwright-report/`

## Naming Conventions

- **Files**: kebab-case for scripts, camelCase for JS modules
- **Directories**: lowercase with hyphens
- **Assets**: descriptive names with proper extensions
- **Data**: JSON for static data, JS for generated modules

## Development Guidelines

- Keep source files in `/src/` for Vite processing
- Static assets go in `/public/` for direct serving
- Use Python scripts for data management and generation
- Follow the established testing patterns in `/tests/`