# Graph Report - mundial2026  (2026-07-14)

## Corpus Check
- 27 files · ~42,236 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 166 nodes · 145 edges · 50 communities (38 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88c0b1e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- iOS Icons
- Graphify Documentation
- PWA Manifest
- Firebase Messaging
- OpenCode Core
- Graphify Plugin
- Entry Pages
- H2H Database
- Dictionary
- Team Data
- Calendar Service
- Sorteo Mundial 2026 Page
- renderizado.js
- What You Must Do When Invoked
- graphify reference: extra exports and benchmark
- weather.js
- graphify reference: query, path, explain
- firebase-init.js
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `construirInterfaz()` - 12 edges
2. `What You Must Do When Invoked` - 12 edges
3. `/graphify` - 10 edges
4. `graphify reference: extra exports and benchmark` - 8 edges
5. `actualizarResultados()` - 6 edges
6. `renderizarMiJornada()` - 6 edges
7. `graphify reference: query, path, explain` - 5 edges
8. `Step 3 - Extract entities and relationships` - 4 edges
9. `renderizarBracketDefinitivo()` - 3 edges
10. `cargarBracketOficial()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **iOS App Icons** — public_icons_ios_120, public_icons_ios_128, public_icons_ios_144, public_icons_ios_152, public_icons_ios_16, public_icons_ios_167, public_icons_ios_180, public_icons_ios_192, public_icons_ios_20, public_icons_ios_256, public_icons_ios_29, public_icons_ios_32, public_icons_ios_40, public_icons_ios_50, public_icons_ios_512, public_icons_ios_57, public_icons_ios_58, public_icons_ios_60, public_icons_ios_64, public_icons_ios_72, public_icons_ios_76, public_icons_ios_80, public_icons_ios_87 [INFERRED 0.95]

## Communities (50 total, 12 thin omitted)

### Community 0 - "iOS Icons"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 1 - "Graphify Documentation"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 2 - "PWA Manifest"
Cohesion: 0.50
Nodes (4): firebaseConfig, getFirebaseConfig(), messaging, xorDecrypt()

### Community 3 - "Firebase Messaging"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 35 - "renderizado.js"
Cohesion: 0.15
Nodes (22): actualizarResultados(), calcularEquiposEliminados(), calcularEstadisticasAvanzadas(), calcularStatsDesdeResultados(), cargarBracketOficial(), construirInterfaz(), eliminatoriasPorMatchNumber, esFechaPasada() (+14 more)

### Community 36 - "What You Must Do When Invoked"
Cohesion: 0.13
Nodes (15): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+7 more)

### Community 37 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 38 - "weather.js"
Cohesion: 0.48
Nodes (6): actualizarBadgesClima(), buscarCoordenadas(), cargarClimaSedes(), coordenadasCiudades, obtenerClimaParaSede(), obtenerIconoClima()

### Community 39 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 41 - "firebase-init.js"
Cohesion: 0.50
Nodes (4): firebaseConfig, getFirebaseConfig(), messaging, xorDecrypt()

### Community 42 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 43 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 44 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **67 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `short_name`, `description` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `What You Must Do When Invoked` to `iOS Icons`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `/graphify` connect `iOS Icons` to `What You Must Do When Invoked`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `IMPORTANT: keep the reminder string free of backticks and $(...) constructs.` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._