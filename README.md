# keystrokes

A small interactive guide to the atomic operations behind a text editor's keystroke handling. Each entry pairs a prose explanation with the actual reducer source and a live demo you can type into.

## What's covered

- **Insert character** — splice a glyph at the cursor and advance.
- **Backspace** — remove the character before the cursor.
- **Delete (forward)** — remove the character after the cursor; cursor stays put.
- **Cursor movement** — `ArrowLeft` / `ArrowRight` / `Home` / `End` with clamping.
- **Word-wise movement** — Alt/Option + arrow jumps across `\w` boundaries.
- **Typing (everything together)** — all of the above composed into one reducer.

Every algorithm is a pure `(state, event) => newState` function over `{ text, cursor }`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- [Shiki](https://shiki.style/) for the syntax-highlighted source panels

## Layout

```
src/
  App.tsx                 hash-routed shell (sidebar + main page)
  components/
    Sidebar.tsx           grouped navigation
    FunctionPage.tsx      title, prose, code, demo
    EditorDemo.tsx        keystroke-driven playground
    CodeBlock.tsx         Shiki-rendered source
  lib/
    editor.ts             shared types + diff helper for the demo
    highlighter.ts        Shiki setup
  algorithms/             the reducers being taught (imported as both
                          modules and ?raw source strings)
  functions/index.tsx     registry: title, blurb, prose, code, demo
```

## Running it

```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # type-check and produce a production build
npm run lint     # run ESLint
npm run preview  # serve the production build locally
```
