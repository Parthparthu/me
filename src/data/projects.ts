import { Project } from '../types/project';

export const projectsData: Project[] = [
  {
    id: 'oweo',
    slug: 'oweo',
    name: 'Oweo',
    tagline: 'Offline-first expense tracking & debt splitting PWA with heuristic text parsing',
    shortDescription: 'A mobile-first Progressive Web App for personal expense tracking, group debt splitting, and financial insights built for seamless daily budgeting.',
    longDescription: 'Oweo solves the double friction of personal expense logging and group expense splitting. Built with React, TypeScript, Zustand, and Recharts, it features heuristic natural-language text parsing for quick expense entry, an offline-first storage engine, and a debt minimization graph algorithm to simplify multi-person balances.',
    category: 'Web / PWA',
    tier: 'Tier A',
    status: 'Production',
    featured: true,
    technologies: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand v5', 'Recharts', 'Firebase', 'Vitest', 'PWA'],
    primaryLanguage: 'TypeScript',
    repositoryUrl: 'https://github.com/Parthparthu/Oweo',
    liveUrl: 'https://parthparthu.github.io/Oweo/',
    role: 'Lead Architect & Systems Engineer',
    date: '2025',
    caseStudy: {
      problem: 'Most expense apps are either overly complex accounting tools with too many menus, or simple splitters that require continuous internet connectivity, making them useless in low-connectivity travel situations.',
      solution: 'Created an offline-first Progressive Web App optimized for one-thumb mobile interactions with quick heuristic text parsing (e.g. "Dinner ₹1200 with Rahul") and visual cashflow charts.',
      architecture: 'Client-first architecture using Zustand v5 for state management with local persistence, synced opportunistically with Firebase Cloud Firestore. Recharts provides responsive visualization of monthly spending distributions.',
      keyFeatures: [
        'Offline-first architecture with instant local reads and writes',
        'Smart heuristic text parser extracting amounts, categories, and split partners',
        'Debt simplification graph algorithm reducing total payment transactions among groups',
        'Visual expense breakdowns and monthly analytics via Recharts',
        'Custom currency support tailored for Indian Rupee (INR) and UPI payment flows',
        'Installable PWA for iOS, Android, and Desktop'
      ],
      challenges: [
        'Implementing debt simplification algorithms to resolve circular debts across groups without complex matrix solvers.',
        'Handling state synchronization conflicts when multiple users log shared group expenses offline.'
      ],
      engineeringDecisions: [
        {
          decision: 'Zustand v5 over Redux or Context API',
          rationale: 'Minimal bundle size, zero boilerplate, and straightforward selector-based re-render optimization.',
          tradeoff: 'Requires discipline to structure store slices cleanly.'
        },
        {
          decision: 'Heuristic client-side parser rather than server NLP API',
          rationale: 'Preserves instantaneous typing feedback and works completely offline without API latency.'
        }
      ],
      lessonsLearned: [
        'Mobile web applications require strict attention to touch target sizing (>=44px) and viewport height (`100dvh`) to prevent mobile browser URL bar jumping.',
        'Offline-first data models must treat local storage as the primary source of truth, not merely a secondary cache.'
      ],
      futurePlans: [
        'Receipt scanning using client-side OCR (Tesseract.js)',
        'Direct UPI deep-linking for one-tap settlement inside Indian payment apps'
      ],
      metrics: [
        { label: 'State Engine', value: 'Zustand v5' },
        { label: 'Latency', value: '0ms (Offline First)' },
        { label: 'Platform Support', value: 'PWA (iOS/Android)' }
      ]
    }
  },
  {
    id: 'numora',
    slug: 'numora',
    name: 'Numora',
    tagline: 'Mobile-first PWA for mobile number numerology & 43-rule directional pattern analysis',
    shortDescription: 'A privacy-first, client-side Progressive Web App calculating mobile-number numerology totals, validating configurable rules, and detecting 43 directional forbidden digit patterns.',
    longDescription: 'Numora is a production-grade Progressive Web App built with a framework-agnostic pure TypeScript engine. It analyzes 10-digit telephone numbers in real-time, executing recursive single-digit reductions, validating customizable target totals (defaults 3, 5, 6), and running overlapping window scans across 43 directional forbidden pattern pairs with zero server roundtrips.',
    category: 'Web / PWA',
    tier: 'Tier A',
    status: 'Production',
    featured: true,
    technologies: ['TypeScript', 'React 19', 'Vite', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'GSAP', 'Vitest', 'PWA'],
    primaryLanguage: 'TypeScript',
    repositoryUrl: 'https://github.com/Parthparthu/Numora',
    liveUrl: 'https://parthparthu.github.io/Numora/',
    role: 'Lead Architect & Developer',
    date: '2025',
    caseStudy: {
      problem: 'Existing numerology and phone number analysis tools were either ad-riddled, clunky desktop-only websites, or forced users to submit sensitive telephone numbers to third-party servers, raising serious privacy concerns.',
      solution: 'Engineered a client-side-only Progressive Web App that performs all computational analysis directly inside the browser. Users receive instant validation, visual positional masking (e.g. 82########), and interactive rule customization without any network exposure.',
      architecture: 'Decoupled architecture separating a zero-dependency pure TypeScript calculation engine (`src/engine`) from the React UI and WebGL rendering layers. The engine exposes an immutable `analyzeNumber()` API that is 100% unit-tested via Vitest before mounting to the UI.',
      keyFeatures: [
        'Pure TypeScript framework-agnostic calculation engine with comprehensive Vitest suite',
        'Directional pattern detection: evaluates pairs independently (e.g. 35 vs 53)',
        'Positional masking engine generating visual masks (e.g., 82######## for matched sequences)',
        'Overlapping pattern scanning across adjacent 2-digit windows',
        'Session-only live rule customization (Required Totals & 43 Forbidden Pattern pairs)',
        'Offline-ready PWA with service worker caching via vite-plugin-pwa',
        'Zero backend requirement: 100% privacy-preserving client-side execution'
      ],
      challenges: [
        'Preserving leading zeros in 10-digit phone strings (e.g., 0123456789) through recursive summation pipelines where standard JavaScript number coercions truncate zeros.',
        'Efficiently highlighting multi-occurrence and overlapping forbidden digit sequences without unnecessary DOM re-renders.'
      ],
      engineeringDecisions: [
        {
          decision: 'Pure TypeScript engine with zero framework dependencies',
          rationale: 'Keeps core computational logic isolated, portable, and easily testable without React lifecycle overhead.',
          tradeoff: 'Required explicit adapter layers to bind engine state to reactive UI components.'
        },
        {
          decision: 'Client-side only processing (Zero Telemetry)',
          rationale: 'Phone numbers are personally identifiable information (PII); local processing guarantees zero data leakage.',
          tradeoff: 'Cannot gather server-side aggregate usage analytics.'
        },
        {
          decision: 'Session-only custom rules with persistent appearance preference',
          rationale: 'Ensures users can safely experiment with custom numerology rules without accidentally corrupting baseline system configurations permanently.'
        }
      ],
      lessonsLearned: [
        'Separating calculation domain logic from UI rendering dramatically simplifies writing edge-case unit tests.',
        'PWA caching strategies require explicit cache invalidation mechanisms on deployment pushes to prevent stale service workers.'
      ],
      futurePlans: [
        'Exportable PDF analysis reports for professional consultants',
        'Batch number scanning via CSV upload utilizing Web Workers to maintain UI thread responsiveness'
      ],
      metrics: [
        { label: 'Engine Test Coverage', value: '100% Core Spec' },
        { label: 'Network Latency', value: '0ms (Offline First)' },
        { label: 'Forbidden Patterns', value: '43 Pairs' }
      ]
    }
  },
  {
    id: 'insidertracker',
    slug: 'insidertracker',
    name: 'InsiderTracker',
    tagline: 'Real-time SEC EDGAR Form 4 insider trading visualizer & differential alerting engine',
    shortDescription: 'A full-stack financial platform ingesting SEC EDGAR Form 4 filings to detect, parse, and highlight high-value C-suite stock transactions exceeding $500K.',
    longDescription: 'InsiderTracker monitors corporate insider buying and selling behavior directly from official SEC EDGAR RSS feeds and raw XML filings. Featuring a Python FastAPI backend with scheduled pollers and a thread-safe in-memory datastore, paired with a React and TypeScript frontend for sorting, filtering by ticker/role, and alerting on major market moves.',
    category: 'Full-Stack / Systems',
    tier: 'Tier A',
    status: 'Production',
    featured: true,
    technologies: ['FastAPI', 'Python', 'React', 'TypeScript', 'Tailwind CSS', 'SEC EDGAR API', 'REST API', 'Vite'],
    primaryLanguage: 'Python / TypeScript',
    repositoryUrl: 'https://github.com/Parthparthu/InsiderTracker',
    role: 'Full-Stack Engineer',
    date: '2025',
    caseStudy: {
      problem: 'Retail investors typically only see insider transactions days after financial news outlets report them, or must pay hundreds of dollars a month for institutional financial terminals to access clean SEC Form 4 filings.',
      solution: 'Built an open-source, full-stack tracker that directly polls the SEC EDGAR RSS feed, parses raw Form 4 XML filings, calculates transaction values, and categorizes trades into a real-time leaderboard without requiring paid external API subscriptions.',
      architecture: 'FastAPI asynchronous backend with scheduled background polling workers parsing SEC XML schemas into structured Pydantic models. Data is served via REST endpoints with ticker and role query filters. The React + TypeScript frontend renders transaction tables with dynamic color-coding and highlight indicators.',
      keyFeatures: [
        'Direct automated SEC EDGAR RSS feed polling and XML document parsing',
        'Differential alerting engine tagging transactions >$500,000 with real-time badges',
        'Dynamic buy/sell color coding (Green for Buys, Red for Sells) with high-value glow indicators',
        'Top 5 Buys daily executive leaderboard for rapid high-conviction screening',
        'Filterable by ticker symbol (e.g. AAPL, NVDA), executive role (CEO, CFO, Director), and date',
        'Thread-safe data storage model and health monitoring endpoints'
      ],
      challenges: [
        'Handling SEC EDGAR rate-limiting and user-agent compliance (fair access policy required specific Header format).',
        'Normalizing inconsistent XML schemas across Form 4 filings where non-derivative and derivative transactions have differing field structures.'
      ],
      engineeringDecisions: [
        {
          decision: 'Direct SEC XML parsing rather than relying on 3rd-party financial APIs',
          rationale: 'Avoids costly monthly API subscriptions and guarantees zero rate-limit dependency on third-party aggregators.',
          tradeoff: 'Backend must manage schema variations and edge cases in SEC XML documentation.'
        },
        {
          decision: 'Differential snapshot alerting engine',
          rationale: 'Compares consecutive poller snapshots to instantly flag new high-impact filings as they arrive.'
        }
      ],
      lessonsLearned: [
        'Building resilient data ingestion pipelines requires aggressive error handling and defensive fallback types for external government APIs.',
        'Thread safety is critical when background pollers update shared datastores queried concurrently by REST API clients.'
      ],
      futurePlans: [
        'Historical backtesting correlation between insider purchase clusters and 90-day price trajectories',
        'Automated webhook notifications to Telegram or Discord for transactions >$1,000,000'
      ],
      metrics: [
        { label: 'Filing Threshold Alert', value: '>$500,000' },
        { label: 'Data Source', value: 'SEC EDGAR Direct' },
        { label: 'API Endpoints', value: '4 REST Routes' }
      ]
    }
  },
  {
    id: 'codeclash-ai',
    slug: 'codeclash-ai',
    name: 'CodeClash AI (MVP)',
    tagline: '1v1 live competitive coding battle platform with secure evaluation microservice',
    shortDescription: 'A real-time competitive coding platform featuring a Next.js web application and a dedicated FastAPI code evaluation microservice with sandboxed execution.',
    longDescription: 'CodeClash AI enables head-to-head live competitive programming duels. Architected as a modular monorepo containing a Next.js web application, a secure FastAPI Python evaluation microservice, and Supabase real-time synchronization with Google OAuth authentication and relational problem schemas.',
    category: 'Full-Stack / Systems',
    tier: 'Tier A',
    status: 'Active Development',
    featured: true,
    technologies: ['Next.js', 'FastAPI', 'Python', 'TypeScript', 'Supabase', 'SQL', 'Docker', 'Tailwind CSS'],
    primaryLanguage: 'TypeScript / Python',
    repositoryUrl: 'https://github.com/Parthparthu/MVP',
    role: 'Systems & Backend Architect',
    date: '2025',
    caseStudy: {
      problem: 'Traditional competitive programming platforms lack real-time head-to-head combat dynamics with immediate feedback, while evaluating untrusted student code poses serious security and resource-exhaustion risks.',
      solution: 'Engineered a distributed platform where a Next.js web client communicates with Supabase for real-time match state, and offloads user-submitted code to an isolated FastAPI evaluation microservice with strict timeout and execution boundaries.',
      architecture: 'Monorepo architecture with `/apps/web` (Next.js frontend and matchmaking routes) and `/apps/evaluator` (FastAPI Python execution microservice). Seeded with automated problem generators and a normalized relational schema in Supabase.',
      keyFeatures: [
        '1v1 real-time live duel state synchronization powered by Supabase Realtime',
        'Dedicated FastAPI evaluation microservice with timeout guardrails',
        'Automated problem seed pipeline (`generate_problems.py`) generating diverse test suites',
        'Google OAuth and session management backed by Supabase Auth',
        'Clean monorepo structure with shared TypeScript definitions and schema migrations'
      ],
      challenges: [
        'Safely isolating arbitrary student code execution without allowing container escape, infinite loops, or disk exhaustion.',
        'Synchronizing opponent keystrokes and submission state without introducing race conditions during simultaneous test evaluations.'
      ],
      engineeringDecisions: [
        {
          decision: 'Decoupled evaluation microservice from Next.js server',
          rationale: 'Code execution is CPU-intensive and dangerous; isolating it protects the web server and allows independent horizontal scaling.',
          tradeoff: 'Requires orchestrating inter-service networking and handling evaluator connection timeouts.'
        },
        {
          decision: 'Supabase for auth and real-time state',
          rationale: 'Drastically reduces operational overhead for live websockets and PostgreSQL relational constraints.'
        }
      ],
      lessonsLearned: [
        'Designing a sandbox requires defense-in-depth: memory limits, process timeouts, and restricted standard library imports.',
        'Monorepo structures enhance velocity when sharing data contracts between frontend clients and backend services.'
      ],
      futurePlans: [
        'AI opponent mode using LLMs fine-tuned to simulate human coding speeds and mistakes',
        'Support for multi-language execution (C++, Java, Rust) in the evaluation sandbox'
      ],
      metrics: [
        { label: 'Architecture', value: 'Distributed Monorepo' },
        { label: 'Evaluator', value: 'FastAPI Microservice' },
        { label: 'Auth & DB', value: 'Supabase PostgreSQL' }
      ]
    }
  },
  {
    id: 'stockscreener',
    slug: 'stockscreener',
    name: 'Real-Time Stock Screener',
    tagline: 'High-speed technical screener filtering Nifty 500 & NYSE equities via WebSockets',
    shortDescription: 'A multi-market financial screening engine streaming live indicator calculations (RSI, SMA crossovers, volume breakouts) across Indian and US stock markets.',
    longDescription: 'Real-Time Stock Screener bridges Indian (NSE Nifty 500) and US (NYSE) market data. Powered by a Python 3.13 FastAPI backend that computes technical indicators on incoming ticker batches and broadcasts updates over WebSockets to a reactive dashboard.',
    category: 'Real-Time / Financial',
    tier: 'Tier A',
    status: 'Completed',
    featured: true,
    technologies: ['Python 3.13', 'FastAPI', 'WebSockets', 'React', 'yfinance', 'Tailwind CSS', 'Vite'],
    primaryLanguage: 'Python / JavaScript',
    repositoryUrl: 'https://github.com/Parthparthu/StockScreener',
    role: 'Backend & Data Engineer',
    date: '2025',
    caseStudy: {
      problem: 'Retail swing traders lack free, programmable screeners that can simultaneously evaluate quantitative parameters across both Indian (NSE) and US (NYSE) equities in real-time.',
      solution: 'Engineered a concurrent screening service in Python using FastAPI and WebSockets that monitors technical criteria (P/E ratio, RSI momentum, 20/50 SMA golden crosses, volume surges) and pushes signals instantly to connected clients.',
      architecture: 'FastAPI async poller batches ticker requests to avoid rate limits, evaluates mathematical indicator formulas asynchronously, and pushes structured JSON payloads across open WebSocket connections to a React frontend.',
      keyFeatures: [
        'Dual-market coverage: NSE Nifty 500 (India) and NYSE (United States)',
        'WebSocket real-time streaming pipeline for sub-second UI updates',
        'Technical indicator calculations: Relative Strength Index (RSI), SMA crossovers, Volume multiples',
        'Value and momentum multi-parameter filtering',
        'Clean client-side grid with live update indicators'
      ],
      challenges: [
        'Managing concurrent ticker data retrieval without exceeding external data rate limits.',
        'Handling differing market trading hours and timezone conversions across IST and EST.'
      ],
      engineeringDecisions: [
        {
          decision: 'WebSockets over HTTP polling',
          rationale: 'Significantly reduces network overhead and ensures immediate notification of breakout signals.',
          tradeoff: 'Requires maintaining connection state and reconnection logic on the client.'
        },
        {
          decision: 'Python 3.13 with async FastAPI',
          rationale: 'High concurrency I/O performance combined with Python mathematical and financial analysis ecosystem.'
        }
      ],
      lessonsLearned: [
        'WebSocket connection management requires robust heartbeat/ping-pong monitoring and exponential backoff retry handlers.',
        'Batching requests is crucial when dealing with hundreds of equity tickers concurrently.'
      ],
      futurePlans: [
        'Custom PineScript-like indicator builder interface',
        'Automated notification triggers for candlestick patterns'
      ],
      metrics: [
        { label: 'Markets Covered', value: 'Nifty 500 & NYSE' },
        { label: 'Protocols', value: 'WebSockets + REST' },
        { label: 'Backend', value: 'Python 3.13 FastAPI' }
      ]
    }
  },
  {
    id: 'breakoutscanner',
    slug: 'breakoutscanner',
    name: 'BreakoutScanner',
    tagline: 'Stock screener with 3D web visualizations and Express.js API proxy',
    shortDescription: 'A stock screening application pairing React and Three.js 3D data representations with an Express.js server querying Yahoo Finance.',
    longDescription: 'BreakoutScanner explores 3D data visualization for financial technical indicators. Using Three.js and React, the frontend renders volume and price vectors in a 3D coordinate space, supported by an Express.js backend handling ticker caching and market requests.',
    category: 'Real-Time / Financial',
    tier: 'Tier B',
    status: 'Completed',
    featured: false,
    technologies: ['React', 'Three.js', 'Express.js', 'Node.js', 'Tailwind CSS', 'Yahoo Finance API'],
    primaryLanguage: 'JavaScript',
    repositoryUrl: 'https://github.com/Parthparthu/BreakoutScanner',
    role: 'Frontend & 3D Visualizer',
    date: '2024',
    caseStudy: {
      problem: 'Standard 2D financial tables make it difficult to quickly spot multidimensional breakout relationships between volume, price change, and volatility.',
      solution: 'Created a prototype 3D visualization canvas mapping volume spikes along the Z-axis, allowing visual inspection of abnormal market moves.',
      architecture: 'Node.js Express backend acting as an API proxy and cache for Yahoo Finance requests, feeding a React frontend running a Three.js WebGL canvas.',
      keyFeatures: [
        'Three.js 3D scatter and bar representations of stock breakout candidates',
        'Express.js API proxy server preventing CORS issues and caching ticker data',
        'Tailwind CSS UI controls for adjusting screening thresholds'
      ],
      challenges: [
        'Balancing WebGL render loop performance with dynamic React state updates.',
        'Managing Yahoo Finance API query rate constraints.'
      ],
      engineeringDecisions: [
        {
          decision: 'Express proxy server',
          rationale: 'Avoids browser CORS restrictions and adds a caching layer to avoid duplicate ticker requests.'
        }
      ],
      lessonsLearned: [
        '3D charts are visually captivating but must remain legible and directly informative for financial decision-making.',
        'WebGL frame rates suffer if geometries are recreated in every render loop rather than updated via buffers.'
      ],
      futurePlans: [
        'Transitioning to React Three Fiber for declarative scene graph composition'
      ]
    }
  },
  {
    id: 'bilingsystem',
    slug: 'bilingsystem',
    name: 'BilingSystem',
    tagline: 'Small business invoice generator & customer loyalty reward engine in Python & SQLite',
    shortDescription: 'A desktop retail billing software that generates formatted PDF invoices and manages automated customer loyalty reward points.',
    longDescription: 'Built in Python with SQLite, BilingSystem is tailored for small retail stores. It manages product inventory, calculates dynamic tiered discounts, generates clean printable PDF invoices, and tracks accumulated customer loyalty reward points across purchase histories.',
    category: 'Software / Tools',
    tier: 'Tier B',
    status: 'Completed',
    featured: false,
    technologies: ['Python', 'SQLite', 'ReportLab / PDF Generation', 'Database Design'],
    primaryLanguage: 'Python',
    repositoryUrl: 'https://github.com/Parthparthu/BilingSystem',
    role: 'Software Developer',
    date: '2024',
    caseStudy: {
      problem: 'Small mom-and-pop retail businesses often struggle with expensive, overcomplicated ERP billing software that lacks integrated customer retention incentives.',
      solution: 'Built a streamlined Python desktop tool with local SQLite storage that records transactions, automatically calculates reward points on every purchase, and instantly creates professional PDF bills.',
      architecture: 'Modular Python architecture: `main.py` entry point, `database.py` managing SQLite tables, `bill_generator.py` formatting PDF output, and `payment_processor.py` handling cash/digital modes.',
      keyFeatures: [
        'Automated PDF invoice generation with itemized tax and discounts',
        'Customer loyalty points reward algorithm tied to purchase volume',
        'Preloaded sample dataset and schema initialization for rapid onboarding',
        'Local SQLite database for zero-cost, zero-maintenance data persistence'
      ],
      challenges: [
        'Generating consistent, neatly paginated PDF layouts for varying item counts.',
        'Ensuring ACID transaction consistency when updating customer reward balances alongside bill creation.'
      ],
      engineeringDecisions: [
        {
          decision: 'SQLite for database management',
          rationale: 'Zero configuration required, highly reliable, and easily backed up as a single file.'
        }
      ],
      lessonsLearned: [
        'Database transactions must wrap both the invoice creation and customer balance updates atomically.',
        'Software built for retail operations must require minimal keystrokes to prevent checkout bottlenecks.'
      ],
      futurePlans: [
        'Barcode scanner integration and thermal printer support'
      ]
    }
  },
  {
    id: 'aura-ecommerce',
    slug: 'aura-ecommerce',
    name: 'AURA E-Commerce',
    tagline: 'Luxury-minimal storefront engineered with Next.js 15, TypeScript & SQLite',
    shortDescription: 'A production-ready e-commerce platform built for a luxury apparel brand targeting modern consumers, featuring server components and fluid micro-interactions.',
    longDescription: 'AURA is a modern e-commerce storefront utilizing Next.js 15, TypeScript, Tailwind CSS, and SQLite. Engineered with a luxury-minimal aesthetic, it demonstrates full-stack web architecture with cart management, server-rendered product catalogs, and responsive layouts.',
    category: 'Web / PWA',
    tier: 'Tier B',
    status: 'Completed',
    featured: false,
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'SQLite', 'React', 'Vercel'],
    primaryLanguage: 'TypeScript',
    repositoryUrl: 'https://github.com/Parthparthu/e-commerce',
    role: 'Full-Stack Developer',
    date: '2024',
    caseStudy: {
      problem: 'Many retail storefronts suffer from heavy bundle sizes, slow hydration, and cluttered layouts that degrade conversion rates.',
      solution: 'Developed a high-performance Next.js storefront with strict typography, high-contrast imagery, and server components for fast first-contentful paint.',
      architecture: 'Next.js App Router utilizing Server Components for static product catalog generation, and client boundary components for interactive shopping cart and checkout flows.',
      keyFeatures: [
        'Next.js 15 App Router architecture with optimized server-side rendering',
        'Persistent client-side shopping cart with instant item manipulation',
        'Luxury-minimal editorial visual design and responsive typography',
        'Relational SQLite database schema for products, variants, and orders'
      ],
      challenges: [
        'Coordinating server component data fetching with optimistic client-side cart updates.'
      ],
      engineeringDecisions: [
        {
          decision: 'Next.js 15 Server Components for product catalog',
          rationale: 'Zero client bundle overhead for static product pages and instantaneous search engine indexing.'
        }
      ],
      lessonsLearned: [
        'Clear boundaries between Server and Client Components are essential for minimizing JavaScript sent over the wire.'
      ],
      futurePlans: [
        'Stripe payment gateway integration with webhook confirmation'
      ]
    }
  },
  {
    id: 'neetcode-dsa',
    slug: 'neetcode-dsa',
    name: 'Algorithmic Problem Solving & DSA',
    tagline: 'Curated repository of NeetCode 150 & LeetCode algorithmic implementations in Python',
    shortDescription: 'A structured collection of optimized data structure and algorithm solutions covering arrays, graphs, trees, dynamic programming, and systems thinking.',
    longDescription: 'A dedicated engineering repository housing rigorous solutions to fundamental and advanced algorithmic problems from NeetCode and LeetCode. Each implementation emphasizes optimal asymptotic time and space complexity, edge-case documentation, and systematic memory patterns.',
    category: 'Algorithms',
    tier: 'Tier B',
    status: 'Active Development',
    featured: false,
    technologies: ['Python', 'Algorithms', 'Data Structures', 'NeetCode', 'Complexity Analysis'],
    primaryLanguage: 'Python',
    repositoryUrl: 'https://github.com/Parthparthu/neetcode-submissions',
    role: 'Author',
    date: '2024 - Present',
    caseStudy: {
      problem: 'Writing working code is insufficient for production systems; engineers must deeply understand asymptotic scaling, memory footprints, and algorithmic trade-offs.',
      solution: 'Maintained a structured repository implementing solutions across graph traversal (BFS/DFS), dynamic programming, sliding window, two-pointer techniques, and binary trees with documented time and space complexities.',
      architecture: 'Categorized modular directory structure organized by problem patterns (Sliding Window, Dynamic Programming, Trees, Heaps, Graph Theory).',
      keyFeatures: [
        'Systematic implementation of NeetCode 150 roadmap in Python',
        'Explicit O(N) time and space complexity annotations on every function',
        'Comprehensive unit tests and edge-case validation suites',
        'Demonstrates algorithmic foundations applied to real-world backend microservices'
      ],
      challenges: [
        'Mastering multi-dimensional dynamic programming state transitions and space-optimized bottom-up approaches.'
      ],
      engineeringDecisions: [
        {
          decision: 'Python for algorithm prototyping',
          rationale: 'Clean syntax allows pure focus on algorithmic structures and pointer manipulations without boilerplate.'
        }
      ],
      lessonsLearned: [
        'Pattern recognition in data structures directly translates to designing better database schemas and caching architectures in production systems.'
      ],
      futurePlans: [
        'Porting key algorithmic implementations to C++ for benchmarked execution speed comparisons'
      ]
    }
  }
];
