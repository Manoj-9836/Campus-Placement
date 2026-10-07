
# Lendi frontend

Lendi is a TanStack Start frontend for tracking coding practice, contests,
question sheets, notes, connected profiles and portfolio activity.

## Development

```bash
npm install
npm run dev
```

The app is served from this directory. For a production verification run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Structure

- `src/routes` contains the file-based TanStack routes.
- `src/components/layout` contains the application shell and navigation.
- `src/components/ui` contains reusable Radix/Tailwind primitives.
- `src/config` contains application-wide configuration such as branding and storage keys.
- `src/lib` contains the local state store, mock domain data, error handling and utilities.
- `src/styles.css` defines the semantic design tokens and shared utilities.

The current frontend uses a local store backed by `localStorage`; the store API
is intentionally isolated so it can be replaced with server mutations without
rewriting route components.
