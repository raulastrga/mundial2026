# Graph Report - .  (2026-07-10)

## Corpus Check
- Corpus is ~42,176 words - fits in a single context window. You may not need a graph.

## Summary
- 66 nodes · 55 edges · 12 communities (4 shown, 8 thin omitted)
- Extraction: 55% EXTRACTED · 45% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

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
- Frontend Design Skill

## God Nodes (most connected - your core abstractions)
1. `Graphify Skill` - 9 edges
2. `plugin` - 2 edges
3. `xorDecrypt()` - 2 edges
4. `getFirebaseConfig()` - 2 edges
5. `$schema` - 1 edges
6. `.opencode/plugins/graphify.js` - 1 edges
7. `IMPORTANT: keep the reminder string free of backticks and $(...) constructs.` - 1 edges
8. `short_name` - 1 edges
9. `start_url` - 1 edges
10. `display` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Index Page` --conceptually_related_to--> `Sorteo Page`  [INFERRED]
  index.html → sorteo.html
- `Graphify Skill` --references--> `Add and Watch Reference`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/add-watch.md
- `Graphify Skill` --references--> `Exports Reference`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/exports.md
- `Graphify Skill` --references--> `Extraction Specification Reference`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/extraction-spec.md
- `Graphify Skill` --references--> `GitHub and Merge Reference`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/github-and-merge.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Reference Set** — opencode_skills_graphify_references_add_watch, opencode_skills_graphify_references_exports, opencode_skills_graphify_references_extraction_spec, opencode_skills_graphify_references_github_and_merge, opencode_skills_graphify_references_hooks, opencode_skills_graphify_references_query, opencode_skills_graphify_references_transcribe, opencode_skills_graphify_references_update [EXTRACTED 1.00]

## Communities (12 total, 8 thin omitted)

### Community 1 - "Graphify Documentation"
Cohesion: 0.20
Nodes (9): Add and Watch Reference, Exports Reference, Extraction Specification Reference, GitHub and Merge Reference, Hooks Reference, Query Reference, Transcribe Reference, Update Reference (+1 more)

### Community 2 - "PWA Manifest"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 3 - "Firebase Messaging"
Cohesion: 0.50
Nodes (4): firebaseConfig, getFirebaseConfig(), messaging, xorDecrypt()

### Community 4 - "OpenCode Core"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **27 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `short_name`, `description` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 23 inferred relationships involving `iOS Icons` (e.g. with `120.png` and `128.png`) actually correct?**
  _`iOS Icons` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `IMPORTANT: keep the reminder string free of backticks and $(...) constructs.` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `iOS Icons` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._