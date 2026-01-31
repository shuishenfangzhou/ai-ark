# AI Tools Website Upgrade Plan

## TL;DR

> **Quick Summary**: Upgrade the existing AI tools dashboard to fully mimic ai-bot.cn's functionality. Keep Vanilla HTML + Vite structure. Add 200+ tools with auto-downloaded logos. Implement all features: directory browsing, detail pages, social interaction, advanced filtering, and user contributions.
> 
> **Deliverables**: 
> - Enhanced main dashboard with sidebar navigation and smart cards
> - SPA-style detail view with breadcrumb navigation
> - 200+ AI tools with auto-downloaded logos and fallback
> - Social features (likes, favorites, popularity ranking)
> - Advanced filtering system
> - User contribution interface
> - Playwright E2E test framework
> 
> **Estimated Effort**: Medium-Large
> **Parallel Execution**: YES - UI and data tasks can run in parallel
> **Critical Path**: Data script → Logo downloads → Main dashboard → Detail view → Tests

---

## Context

### Original Request
Upgrade the AI tools dashboard based on all prompt files in the folder. Fully mimic ai-bot.cn's functionality.

### Interview Summary
**Key Discussions**:
- **Upgrade approach**: Keep Vanilla HTML structure first, enhance, then migrate to Next.js later
- **Feature scope**: ALL features (directory browsing, detail display, social interaction, advanced filtering, user contribution)
- **Tool count**: 200+ tools with auto-downloaded logos
- **Image handling**: Auto-download via Clearbit/Google Favicon, fallback to letter avatar
- **Test strategy**: Set up Playwright E2E tests

**Research Findings**:
- Package.json uses Vite for build (no test framework installed)
- Two main HTML files: index.html (basic), aibot_home.html (enhanced with charts, login modal)
- tools_manager.py exists with ~50 tools and logo download logic (Clearbit + Google Favicon)
- No test infrastructure currently
- Current implementation uses CDN for Tailwind CSS and Chart.js

### Metis Review
**Note**: Metis consultation skipped due to technical error. Plan based on direct prompt analysis.

**Identified Gaps (addressed in plan)**:
- Need to consolidate two HTML files into one main version
- Need to add logo download error handling
- Need to ensure mobile responsiveness for all new features

---

## Work Objectives

### Core Objective
Transform the existing AI tools dashboard into a comprehensive portal that fully mimics ai-bot.cn, featuring directory browsing, detailed tool pages, social interaction, advanced filtering, and user contribution capabilities.

### Concrete Deliverables
- **Main Dashboard (index.html)**: Enhanced with sidebar navigation, smart cards, search, and filters
- **Detail View System**: SPA-style toggle between list and detail views with breadcrumb navigation
- **Data System**: 200+ tools with auto-downloaded logos and proper fallback
- **Social Features**: Likes, favorites, popularity tracking
- **Advanced Filtering**: Category, cost, feature comparison
- **User Contribution**: Submit tool form, feedback mechanism
- **Test Framework**: Playwright E2E tests

### Definition of Done
- [ ] 200+ tools displayed with correct logos
- [ ] Sidebar navigation works on all screen sizes
- [ ] Clicking tool shows detail view with full info
- [ ] Search and filters work correctly
- [ ] Breadcrumb navigation present
- [ ] All Playwright tests pass
- [ ] No console errors on main page load

### Must Have
- Responsive sidebar navigation
- Smart Tool Card with proper image handling
- SPA-style detail view toggle
- 200+ tools with data
- Search and category filters
- Breadcrumb navigation
- Playwright test setup

### Must NOT Have (Guardrails)
- Backend server implementation (keep frontend-only)
- Database integration (use static JSON data)
- Real WeChat login (simulate only)
- Payment processing
- User accounts system (for this phase)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **User wants tests**: YES - Set up Playwright E2E
- **Framework**: Playwright (E2E testing)
- **QA approach**: Automated E2E tests for critical user journeys

### Test Setup Tasks
- [ ] Install Playwright and configure
- [ ] Create test file for main dashboard
- [ ] Create test file for detail view
- [ ] Create test file for search/filter
- [ ] Create test file for user interactions

### If Automated Verification Only

Each TODO includes EXECUTABLE verification procedures.

**By Deliverable Type:**

| Type | Verification Tool | Automated Procedure |
|------|------------------|---------------------|
| **Frontend/UI** | Playwright browser | Agent navigates, clicks, asserts DOM state |
| **Data Generation** | Python script | Agent runs script, verifies JS output |
| **Search/Filter** | Playwright | Agent types in search, verifies results |

**Evidence Requirements**:
- Console logs captured and checked for errors
- Screenshots saved to .sisyphus/evidence/ for visual verification
- Test result files (HTML/XML) saved

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Research ai-bot.cn structure and features
├── Task 2: Design new architecture and component structure
└── Task 3: Upgrade tools_manager.py to 200+ tools

Wave 2 (After Wave 1):
├── Task 4: Build enhanced main dashboard with sidebar
├── Task 5: Create smart Tool Card component
├── Task 6: Implement image fallback system
└── Task 7: Create data file (js/tools_data.js)

Wave 3 (After Wave 2):
├── Task 8: Build SPA detail view system
├── Task 9: Add breadcrumb navigation
├── Task 10: Implement search and filters
└── Task 11: Add social features (likes, favorites)

Wave 4 (After Wave 3):
├── Task 12: Build advanced filtering system
├── Task 13: Create user contribution interface
├── Task 14: Add SEO optimization
└── Task 15: Set up Playwright tests

Wave 5 (Final):
├── Task 16: Integration testing
├── Task 17: Performance optimization
└── Task 18: Final review and polish
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2 | None (research first) |
| 2 | 1 | 4, 5 | None |
| 3 | 2 | 7 | None (data first) |
| 4 | 2 | 8 | 5, 6 |
| 5 | 2 | 8 | 4, 6 |
| 6 | 2 | None | 4, 5 |
| 7 | 3 | 8 | None |
| 8 | 4, 5, 7 | None | 9, 10, 11 |
| 9 | 8 | None | 8, 10, 11 |
| 10 | 8 | None | 8, 9, 11 |
| 11 | 8 | None | 8, 9, 10 |
| 12 | 8 | None | 13, 14 |
| 13 | 8 | None | 12, 14 |
| 14 | None | None | 12, 13 |
| 15 | 4, 5, 8, 10, 11 | None | None (tests last) |
| 16 | 15 | None | None |
| 17 | None | None | None |
| 18 | 16, 17 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3 | general (research + implementation) |
| 2 | 4, 5, 6, 7 | general (UI + data) |
| 3 | 8, 9, 10, 11 | general (feature development) |
| 4 | 12, 13, 14 | general (advanced features + tests) |
| 5 | 15, 16, 17, 18 | general (testing + polish) |

---

## TODOs

- [ ] 1. Research ai-bot.cn structure and features

  **What to do**:
  - Analyze ai-bot.cn's UI layout, navigation, and features
  - Document all feature categories and interactions
  - Take screenshots for reference
  - Identify must-have vs nice-to-have features

  **Must NOT do**:
  - Copy code directly (inspiration only)
  - Implement features without understanding their purpose

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: UI/UX research and design understanding
  - **Skills**: [`dev-browser`, `frontend-ui-ux`]
    - `dev-browser`: Browse ai-bot.cn for analysis
    - `frontend-ui-ux`: Understand design patterns

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Tasks 2, 3
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] Create research document with ai-bot.cn feature breakdown
  - [ ] Take 5+ screenshots of key pages
  - [ ] List all features to implement (prioritized)
  - [ ] Identify navigation structure and user flows

  **Evidence to Capture**:
  - [ ] Research document in .sisyphus/research/ai-bot-cn-analysis.md
  - [ ] Screenshots in .sisyphus/research/screenshots/

---

- [ ] 2. Design new architecture and component structure

  **What to do**:
  - Create component architecture for new dashboard
  - Design sidebar navigation structure
  - Plan Tool Card component layout
  - Design detail view template
  - Plan data structure for 200+ tools

  **Must NOT do**:
  - Use complex frameworks (keep it simple)
  - Over-engineer the architecture

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: UI design and component architecture
  - **Skills**: [`frontend-ui-ux`, `dev-browser`]
    - `frontend-ui-ux`: Component design
    - `dev-browser`: Reference existing implementations

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Tasks 4, 5, 6
  - **Blocked By**: Task 1

  **Acceptance Criteria**:
  - [ ] Architecture document created
  - [ ] Component hierarchy defined
  - [ ] Data schema for tools defined
  - [ ] Navigation structure designed

  **Evidence to Capture**:
  - [ ] Architecture diagram (ASCII or mermaid)
  - [ ] Component hierarchy document
  - [ ] Data schema definition

---

- [ ] 3. Upgrade tools_manager.py to 200+ tools

  **What to do**:
  - Expand tools_db to 200+ AI tools
  - Include tools from all categories (text, image, video, audio, code, search, etc.)
  - Maintain existing logo download logic (Clearbit + Google Favicon)
  - Add error handling for failed downloads
  - Generate updated js/tools_data.js

  **Must NOT do**:
  - Use paid APIs (stick to free sources)
  - Include duplicate tools
  - Use fake data (use real tool info)

  **Recommended Agent Profile**:
  - **Category**: general
    - Reason: Python script modification
  - **Skills**: []
    - No specific skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 7
  - **Blocked By**: Task 2

  **References**:

  **Pattern References** (existing code to follow):
  - `tools_manager.py` - Current script structure and logic
  - Lines 27-77 - Existing tools_db format and fields

  **Acceptance Criteria**:
  - [ ] tools_db contains 200+ tools
  - [ ] All categories covered (text, image, video, audio, code, search, design, productivity)
  - [ ] Each tool has: name, url, category, description, tags
  - [ ] Logo download function works for all tools
  - [ ] Fallback to letter avatar if download fails
  - [ ] js/tools_data.js generated with 200+ entries

  **Evidence to Capture**:
  - [ ] Updated tools_manager.py
  - [ ] Generated js/tools_data.js (200+ entries)
  - [ ] Downloaded logos in assets/logos/

---

- [ ] 4. Build enhanced main dashboard with sidebar

  **What to do**:
  - Replace current index.html with new enhanced version
  - Implement fixed left sidebar navigation (w-64 on desktop)
  - Add main content area with grid layout
  - Implement responsive design (sidebar becomes drawer on mobile)
  - Add search bar in header
  - Add category filters

  **Must NOT do**:
  - Remove existing functionality (search, filters, display)
  - Break mobile responsiveness

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: UI/UX implementation
  - **Skills**: [`frontend-ui-ux`, `dev-browser`]
    - `frontend-ui-ux`: Tailwind CSS styling
    - `dev-browser`: Responsive testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 2

  **References**:

  **Pattern References** (existing code to follow):
  - `aibot_home.html` - Existing header, search, and layout patterns
  - Lines 96-128 - Header structure
  - Lines 184-192 - Category filter buttons

  **Acceptance Criteria**:
  - [ ] Fixed left sidebar on desktop
  - [ ] Collapsible/drawer sidebar on mobile
  - [ ] Main content area with responsive grid
  - [ ] Search bar functional
  - [ ] Category filters work
  - [ ] No console errors

  **Automated Verification**:
  ```bash
  # Verify file exists and structure
  if [ -f "index.html" ]; then echo "index.html exists"; else echo "ERROR: index.html missing"; fi
  
  # Check for sidebar element
  grep -q "sidebar" index.html && echo "Sidebar element found" || echo "ERROR: No sidebar"
  
  # Check grid layout
  grep -q "grid-cols-" index.html && echo "Grid layout found" || echo "ERROR: No grid"
  ```

  **Evidence to Capture**:
  - [ ] index.html (new enhanced version)
  - [ ] Screenshot of desktop layout
  - [ ] Screenshot of mobile layout

---

- [ ] 5. Create smart Tool Card component

  **What to do**:
  - Design Tool Card component with:
    - Header: Logo (left), Title + Tags (right)
    - Body: 2-line description (line-clamp-2)
    - Footer: Stats (visits, likes) + Link button
  - Implement hover effects (translate-y-1, shadow-lg)
  - Make cards clickable for detail view

  **Must NOT do**:
  - Use fixed height cards (use flexible heights)
  - Hide cards without logos (handle gracefully)

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: UI component design
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Card design and styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 2

  **References**:

  **Pattern References** (existing code to follow):
  - `aibot_home.html` Lines 429-467 - Existing card design
  - `Role.md` Lines 22-25 - Smart Tool Card specifications

  **Acceptance Criteria**:
  - [ ] Card displays logo, title, tags
  - [ ] Description limited to 2 lines
  - [ ] Hover effects work (translate-y-1, shadow-lg)
  - [ ] Cards are clickable
  - [ ] Stats and link button in footer

  **Automated Verification**:
  ```javascript
  // Playwright test pseudo-code
  await page.goto('index.html');
  await page.waitForSelector('.tool-card');
  const cardCount = await page.locator('.tool-card').count();
  console.log(`Found ${cardCount} tool cards`);
  // Verify hover effect
  await page.hover('.tool-card:first-child');
  await expect(page.locator('.tool-card:first-child')).toHaveClass(/translate-y-1/);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of tool cards
  - [ ] Screenshot of hover effect

---

- [ ] 6. Implement image fallback system

  **What to do**:
  - Create ImageWithFallback component/logic
  - Primary: Use downloaded logo from assets/logos/
  - Fallback 1: Try Clearbit/Google Favicon API
  - Fallback 2: Generate letter avatar (e.g., "https://ui-avatars.com/api/?name=ChatGPT&background=random")
  - Ensure all cards have consistent sizing

  **Must NOT do**:
  - Hide cards without images (show fallback)
  - Use broken image icons

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: UI image handling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Image component design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: None
  - **Blocked By**: Task 2

  **References**:

  **Pattern References** (existing code to follow):
  - `Role.md` Lines 27-37 - Image fallback specifications
  - `tools_manager.py` Lines 80-92 - Logo download logic
  - `aibot_home.html` Lines 434-436 - Existing icon handling

  **Acceptance Criteria**:
  - [ ] All tools display an image/logo
  - [ ] Downloaded logos used when available
  - [ ] Letter avatar fallback for missing logos
  - [ ] Consistent card sizing
  - [ ] No broken image icons

  **Automated Verification**:
  ```javascript
  // Verify no broken images
  const brokenImages = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).filter(img => !img.complete || img.naturalWidth === 0);
  });
  console.log(`Broken images: ${brokenImages.length}`);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of cards with various logo states
  - [ ] Console log showing fallback usage

---

- [ ] 7. Create data file (js/tools_data.js)

  **What to do**:
  - Run updated tools_manager.py
  - Verify 200+ tools generated
  - Verify logo paths are correct
  - Ensure data structure matches component expectations

  **Must NOT do**:
  - Use the old data file
  - Generate incomplete data

  **Recommended Agent Profile**:
  - **Category**: general
    - Reason: Data generation
  - **Skills**: []
    - No specific skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 8
  - **Blocked By**: Task 3

  **Acceptance Criteria**:
  - [ ] js/tools_data.js contains 200+ entries
  - [ ] Each entry has: id, name, category, desc, url, tags, logo
  - [ ] No console errors on data load
  - [ ] All tools render correctly

  **Automated Verification**:
  ```bash
  # Count tools in data file
  grep -c '"name":' js/tools_data.js
  
  # Should output: 200+
  
  # Verify file loads without errors
  node -e "require('./js/tools_data.js'); console.log('Data loaded successfully');"
  ```

  **Evidence to Capture**:
  - [ ] js/tools_data.js file
  - [ ] Screenshot of data structure
  - [ ] Console output from generation

---

- [ ] 8. Build SPA detail view system

  **What to do**:
  - Implement view toggle: List View ↔ Detail View
  - Create detail view template with:
    - Large logo (top left)
    - Tool title and full description
    - Feature list (bullet points)
    - Official link button
    - Related tools section
  - Add smooth transitions between views
  - Implement "Back to list" functionality

  **Must NOT do**:
  - Use page reload for view changes
  - Lose search/filter state when switching views

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: SPA view system
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: View transitions and UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10, 11)
  - **Blocks**: None
  - **Blocked By**: Tasks 4, 5, 7

  **References**:

  **Pattern References** (existing code to follow):
  - `高级全栈工程师和信息架构师.md` Lines 5-10 - Detail view specifications
  - `aibot_home.html` Lines 459-466 - Existing click handling

  **Acceptance Criteria**:
  - [ ] Clicking tool opens detail view
  - [ ] Detail view shows large logo, title, description
  - [ ] Feature list displays correctly
  - [ ] "Related tools" section present
  - [ ] "Back to list" button works
  - [ ] Smooth transition between views

  **Automated Verification**:
  ```javascript
  // Playwright test
  await page.click('.tool-card:first-child');
  await page.waitForSelector('.detail-view');
  await expect(page.locator('.detail-view')).toBeVisible();
  await expect(page.locator('.detail-view h1')).toContainText(/.*/);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of detail view
  - [ ] Video/screenshot of view transition

---

- [ ] 9. Add breadcrumb navigation

  **What to do**:
  - Add breadcrumb to detail view
  - Format: 首页 > {分类} > {工具名}
  - Make breadcrumbs clickable (navigation)
  - Ensure proper styling

  **Must NOT do**:
  - Show breadcrumbs on list view
  - Use non-clickable breadcrumbs

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Navigation component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Breadcrumb styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 10, 11)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **References**:

  **Pattern References** (existing code to follow):
  - `高级全栈工程师和信息架构师.md` Lines 16-17 - Breadcrumb specification
  - `aibot_home.html` - Existing header structure

  **Acceptance Criteria**:
  - [ ] Breadcrumb visible on detail view
  - [ ] Format: 首页 > 分类 > 工具名
  - [ ] Each level clickable
  - [ ] Proper styling

  **Automated Verification**:
  ```javascript
  // Playwright test
  await page.click('.tool-card:first-child');
  await page.waitForSelector('.breadcrumb');
  const breadcrumbText = await page.locator('.breadcrumb').textContent();
  console.log(`Breadcrumb: ${breadcrumbText}`);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of breadcrumb

---

- [ ] 10. Implement search and filters

  **What to do**:
  - Implement real-time search (filter by name, description, tags)
  - Add category filter buttons
  - Add pricing filter (Free/Paid)
  - Add sort options (Popularity, Newest)
  - Preserve filter state when switching views

  **Must NOT do**:
  - Lose filter state on view switch
  - Slow down with 200+ tools

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Search/filter UX
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Filter UI and logic

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9, 11)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **References**:

  **Pattern References** (existing code to follow):
  - `aibot_home.html` Lines 114-115 - Search input
  - `aibot_home.html` Lines 185-192 - Category filters
  - `aibot_home.html` Lines 327-331 - Search logic

  **Acceptance Criteria**:
  - [ ] Search works in real-time
  - [ ] Category filter works
  - [ ] Additional filters work
  - [ ] Filter state preserved on view switch
  - [ ] No lag with 200+ tools

  **Automated Verification**:
  ```javascript
  // Playwright test
  await page.fill('#search-input', 'ChatGPT');
  await page.waitForTimeout(300);
  const visibleCards = await page.locator('.tool-card:visible').count();
  console.log(`Search results: ${visibleCards}`);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of filtered results
  - [ ] Performance test results

---

- [ ] 11. Add social features (likes, favorites)

  **What to do**:
  - Add like button to each tool card
  - Add favorite/bookmark functionality
  - Track and display like counts
  - Sort by popularity (likes)
  - Store preferences in localStorage

  **Must NOT do**:
  - Require user account for basic likes
  - Make likes non-functional

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Social interaction UI
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Interactive components

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9, 10)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **References**:

  **Pattern References** (existing code to follow):
  - `aibot_home.html` Lines 440-445 - Existing rating/visits display
  - `AI Tools Dashboard.txt` Lines 102-107 - Tags display

  **Acceptance Criteria**:
  - [ ] Like button on each card
  - [ ] Favorite button on each card
  - [ ] Like count displayed
  - [ ] Clicking like increments count
  - [ ] Favorites saved to localStorage

  **Automated Verification**:
  ```javascript
  // Playwright test
  await page.click('.tool-card:first-child .like-button');
  const likeCount = await page.locator('.tool-card:first-child .like-count').textContent();
  console.log(`Likes: ${likeCount}`);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of social features
  - [ ] localStorage data sample

---

- [ ] 12. Build advanced filtering system

  **What to do**:
  - Add multi-select category filters
  - Add pricing filter (Free, Paid, Freemium)
  - Add feature filter (e.g., "Has API", "Supports Chinese")
  - Add tool comparison view
  - Add "Hot tools" ranking sidebar

  **Must NOT do**:
  - Make filters too complex to use
  - Break existing simple filters

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Advanced filtering UX
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Filter panel design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 13, 14)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **References**:

  **Pattern References** (existing code to follow):
  - `aibot_home.html` Lines 185-192 - Existing category filters
  - `AI Tools Dashboard.txt` Lines 48-54 - Filter buttons

  **Acceptance Criteria**:
  - [ ] Multi-select category filters
  - [ ] Pricing filter
  - [ ] Feature filter
  - [ ] Comparison view
  - [ ] Hot tools sidebar on detail view

  **Automated Verification**:
  ```javascript
  // Playwright test
  await page.click('.filter-group:first-child .checkbox');
  const visibleCards = await page.locator('.tool-card:visible').count();
  console.log(`Filtered results: ${visibleCards}`);
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of filter panel
  - [ ] Screenshot of comparison view

---

- [ ] 13. Create user contribution interface

  **What to do**:
  - Create "Submit Tool" form
  - Add "Report Issue" button
  - Create "Suggest Edit" functionality
  - Add simple feedback modal
  - Store submissions in localStorage (for demo)

  **Must NOT do**:
  - Require backend for submissions
  - Make forms too long

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Form UI/UX
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Form design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 12, 14)
  - **Blocks**: None
  - **Blocked By**: Task 8

  **References**:

  **Pattern References** (existing code to follow):
  - `aibot_home.html` Lines 121-124 - Login button/modal
  - `aibot_home.html` Lines 232-264 - Existing modal structure

  **Acceptance Criteria**:
  - [ ] Submit Tool button accessible
  - [ ] Form has required fields (name, url, description)
  - [ ] Report Issue button present
  - [ ] Suggest Edit functionality
  - [ ] Submissions saved to localStorage

  **Automated Verification**:
  ```javascript
  // Playwright test
  await page.click('#submit-tool-btn');
  await expect(page.locator('#submit-tool-modal')).toBeVisible();
  await page.fill('#tool-name', 'Test Tool');
  await page.fill('#tool-url', 'https://test.com');
  await page.click('#submit-btn');
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of submission form
  - [ ] localStorage submission data

---

- [ ] 14. Add SEO optimization

  **What to do**:
  - Add proper meta tags (title, description, OG tags)
  - Implement dynamic document.title on view switch
  - Add JSON-LD structured data for tools
  - Add sitemap.xml (for future)
  - Ensure semantic HTML structure

  **Must NOT do**:
  - Use non-semantic HTML
  - Forget meta tags

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: SEO implementation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Semantic HTML

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 12, 13)
  - **Blocks**: None
  - **Blocked By**: None

  **References**:

  **Pattern References** (existing code to follow):
  - `AI Tools Dashboard.txt` Lines 3-6 - Existing meta tags
  - `AI_工具集网页生成提示词.md` Lines 163-180 - JSON-LD specification

  **Acceptance Criteria**:
  - [ ] Proper meta tags in head
  - [ ] Dynamic document.title on detail view
  - [ ] JSON-LD structured data for tools
  - [ ] Semantic HTML structure
  - [ ] Open Graph tags for sharing

  **Automated Verification**:
  ```bash
  # Check meta tags
  grep -q "<title>" index.html && echo "Title tag found" || echo "ERROR: No title"
  grep -q "description" index.html && echo "Description found" || echo "ERROR: No description"
  grep -q "og:" index.html && echo "Open Graph tags found" || echo "No OG tags"
  
  # Verify JSON-LD
  grep -q "application/ld+json" index.html && echo "JSON-LD found" || echo "No JSON-LD"
  ```

  **Evidence to Capture**:
  - [ ] HTML head section
  - [ ] Screenshot of shared card (if possible)

---

- [ ] 15. Set up Playwright tests

  **What to do**:
  - Install Playwright
  - Create test configuration
  - Write E2E tests for:
    - Main dashboard load
    - Tool card rendering
    - Search functionality
    - Filter functionality
    - Detail view toggle
    - Breadcrumb navigation
    - Social interactions
    - Form submissions
  - Run all tests and fix failures

  **Must NOT do**:
  - Write tests that require backend
  - Create flaky tests

  **Recommended Agent Profile**:
  - **Category**: general
    - Reason: Test setup
  - **Skills**: []
    - No specific skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: Tasks 4-14

  **Acceptance Criteria**:
  - [ ] Playwright installed and configured
  - [ ] Test file created
  - [ ] All 7+ test scenarios implemented
  - [ ] All tests pass
  - [ ] Test report generated

  **Automated Verification**:
  ```bash
  # Run all Playwright tests
  npx playwright test
  
  # Expected: All tests pass
  # Output: test-report.html
  ```

  **Evidence to Capture**:
  - [ ] Test report (HTML/XML)
  - [ ] Test code files
  - [ ] Coverage summary

---

- [ ] 16. Integration testing

  **What to do**:
  - Test complete user flows
  - Test responsive design on multiple viewports
  - Test performance with 200+ tools
  - Test edge cases (no results, all filters applied)
  - Fix any integration issues

  **Must NOT do**:
  - Skip edge case testing
  - Ignore performance issues

  **Recommended Agent Profile**:
  - **Category**: general
    - Reason: Integration testing
  - **Skills**: []
    - No specific skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: Task 15

  **Acceptance Criteria**:
  - [ ] All user flows work
  - [ ] Responsive design verified
  - [ ] Performance acceptable (<3s load time)
  - [ ] Edge cases handled
  - [ ] No critical bugs

  **Automated Verification**:
  ```javascript
  // Performance test
  const startTime = Date.now();
  await page.goto('index.html');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  console.log(`Load time: ${loadTime}ms`);
  ```

  **Evidence to Capture**:
  - [ ] Performance report
  - [ ] Integration test results
  - [ ] Bug report (if any)

---

- [ ] 17. Performance optimization

  **What to do**:
  - Optimize image loading (lazy loading)
  - Minimize reflows and repaints
  - Optimize CSS (remove unused styles)
  - Add loading states
  - Optimize JavaScript execution

  **Must NOT do**:
  - Break existing functionality
  - Add unnecessary optimization

  **Recommended Agent Profile**:
  - **Category**: general
    - Reason: Performance tuning
  - **Skills**: []
    - No specific skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: Task 16

  **Acceptance Criteria**:
  - [ ] Lazy loading implemented
  - [ ] Load time < 3 seconds
  - [ ] Smooth scrolling and interactions
  - [ ] Loading states visible

  **Automated Verification**:
  ```javascript
  // Lighthouse-like performance check
  const metrics = await page.metrics();
  console.log(`JS Heap Used: ${metrics.JSHeapUsedSize / 1024 / 1024} MB`);
  console.log(`JS Heap Total: ${metrics.JSHeapTotalSize / 1024 / 1024} MB`);
  ```

  **Evidence to Capture**:
  - [ ] Performance metrics
  - [ ] Before/after comparison

---

- [ ] 18. Final review and polish

  **What to do**:
  - Review all implemented features against requirements
  - Polish UI (spacing, colors, typography)
  - Fix any remaining bugs
  - Verify all acceptance criteria met
  - Create final deliverable package

  **Must NOT do**:
  - Add new features (scope creep)
  - Skip final review

  **Recommended Agent Profile**:
  - **Category**: visual-engineering
    - Reason: Final polish
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: UI polish

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: Task 17

  **Acceptance Criteria**:
  - [ ] All requirements met
  - [ ] No console errors
  - [ ] Consistent design language
  - [ ] All tests pass
  - [ ] Project ready for deployment

  **Final Checklist**:
  - [ ] 200+ tools display correctly
  - [ ] Sidebar navigation works
  - [ ] Smart cards render properly
  - [ ] Image fallback works
  - [ ] Detail view functions
  - [ ] Search and filters work
  - [ ] Breadcrumb present
  - [ ] Social features work
  - [ ] Advanced filters work
  - [ ] User contribution works
  - [ ] SEO optimized
  - [ ] Tests pass

  **Evidence to Capture**:
  - [ ] Final screenshot (desktop)
  - [ ] Final screenshot (mobile)
  - [ ] Final test report
  - [ ] Performance report

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 3 | `feat(data): expand to 200+ tools` | tools_manager.py, js/tools_data.js | `grep -c '"name":' js/tools_data.js` → 200+ |
| 4 | `feat(ui): add sidebar navigation` | index.html | Sidebar renders correctly |
| 5 | `feat(ui): create smart tool cards` | index.html | Cards display with hover effects |
| 6 | `feat(ui): implement image fallback` | index.html | All cards have images |
| 8 | `feat(view): add detail view system` | index.html | Detail view toggles correctly |
| 9 | `feat(nav): add breadcrumb navigation` | index.html | Breadcrumb visible on detail |
| 10 | `feat(search): implement search and filters` | index.html | Search filters tools correctly |
| 11 | `feat(social): add likes and favorites` | index.html | Social features work |
| 12 | `feat(filter): build advanced filtering` | index.html | Filters work correctly |
| 13 | `feat(community): add contribution interface` | index.html | Forms submit successfully |
| 14 | `feat(seo): add SEO optimization` | index.html | Meta tags present |
| 15 | `test: set up Playwright E2E` | tests/*.spec.js | `npx playwright test` → All pass |
| 18 | `chore: final polish and review` | All files | All acceptance criteria met |

---

## Success Criteria

### Verification Commands
```bash
# Count tools
grep -c '"name":' js/tools_data.js

# Check meta tags
grep -E "<title>|<meta name=\"description\"" index.html

# Run tests
npx playwright test --reporter=list

# Performance test
# Open Chrome DevTools > Lighthouse > Analyze page
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All tests pass
- [ ] 200+ tools with correct logos
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Performance acceptable

---

## Plan Generated

**Plan file**: `.sisyphus/plans/ai-tools-web-upgrade.md`

**Next Steps**:
1. User reviews plan
2. User chooses: "Start Work" (immediate execution) or "High Accuracy Review" (Momus verification)
3. If "Start Work": Run `/start-work` to begin execution
4. If "High Accuracy": Enter Momus review loop

**Draft cleaned up**: `.sisyphus/drafts/ai-tools-web-upgrade.md` (deleted)
