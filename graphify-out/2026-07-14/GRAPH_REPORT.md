# Graph Report - .  (2026-07-10)

## Corpus Check
- Corpus is ~42,176 words - fits in a single context window. You may not need a graph.

## Summary
- 65 nodes · 31 edges · 35 communities (27 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 34

## God Nodes (most connected - your core abstractions)
1. `graphify Skill` - 9 edges
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
- `graphify Skill` --references--> `graphify add/watch flow`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/add-watch.md
- `graphify Skill` --references--> `graphify exports flow`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/exports.md
- `graphify Skill` --references--> `graphify extraction specification`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/extraction-spec.md
- `graphify Skill` --references--> `graphify github and merge flow`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/github-and-merge.md
- `graphify Skill` --references--> `graphify hooks flow`  [EXTRACTED]
  .opencode/skills/graphify/SKILL.md → .opencode/skills/graphify/references/hooks.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **iOS App Icons** — public_icons_ios_120, public_icons_ios_128, public_icons_ios_144, public_icons_ios_152, public_icons_ios_16, public_icons_ios_167, public_icons_ios_180, public_icons_ios_192, public_icons_ios_20, public_icons_ios_256, public_icons_ios_29, public_icons_ios_32, public_icons_ios_40, public_icons_ios_50, public_icons_ios_512, public_icons_ios_57, public_icons_ios_58, public_icons_ios_60, public_icons_ios_64, public_icons_ios_72, public_icons_ios_76, public_icons_ios_80, public_icons_ios_87 [INFERRED 0.95]

## Communities (35 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.20
Nodes (9): graphify add/watch flow, graphify exports flow, graphify extraction specification, graphify github and merge flow, graphify hooks flow, graphify query flow, graphify transcribe flow, graphify update flow (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 2 - "Community 2"
Cohesion: 0.50
Nodes (4): firebaseConfig, getFirebaseConfig(), messaging, xorDecrypt()

### Community 3 - "Community 3"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **27 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `short_name`, `description` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `$schema`, `.opencode/plugins/graphify.js`, `IMPORTANT: keep the reminder string free of backticks and $(...) constructs.` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._