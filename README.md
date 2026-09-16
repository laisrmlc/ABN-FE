# TV Show Dashboard

Frontend assessment built with Vue 3 and TypeScript, using the TVMaze API.

## Requirements

- Node.js 24.12+ (LTS)
- npm

## Running the project

Install the dependencies:

npm install

Start the development server:

npm run dev

## Running the tests

npm run test

## Dependencies

The project dependencies were kept to a minimum. Vue and Vue Router run the app. Almost everything else is a dev tool (TypeScript, testing, linting, formatting, build). The one runtime exception is DOMPurify: show summaries from the TVMaze API come with HTML in them, and I didn't want to render that with `v-html` without sanitizing it first, so DOMPurify strips the tags down to plain text. Sass is only used for nesting and BEM-style class names and compiles away to plain CSS. For tests Vitest and @vue/test-utils were used since they reuse the app's own Vite config.

## Project structure

Code is organized by feature under `pages/` (Dashboard, ShowDetails, NotFound). Shared concerns get their own folder: `composables/` for data-fetching state, `utils/` for API calls and helpers, `types/` for shared interfaces, `router/` for route definitions. Tests live in a `__tests__` folder next to what they cover, and a shared fixtures file holds the mock shows so tests don't each invent their own data.

Each page component owns its state and data fetching, while its children stay presentational (props in, events out). `EmptyState` is a small shared component (image + message) used both for the 404 page and for the "no shows match your search" state in the dashboard, instead of two near-identical screens. Icons are SVG files under `assets/icons/`.

## Routing

Vue Router with browser history. All three routes (dashboard, show details, catch-all not-found) are imported statically, not lazy-loaded. With only three routes, code-splitting isn't worth the complexity yet.

## State management

No Pinia or Vuex. Each page keeps its state in its own composable, and nothing needs to be shared across unrelated parts of the app.

## Performance

Every request has a five-second timeout, and also aborts if the component unmounts first, whichever happens sooner, using the native `AbortController`/`AbortSignal` APIs. An aborted request just gets ignored instead of showing an error, since the user already navigated away. A timed-out request currently shows the same generic error as any other failure. That's a simplification I made on purpose.

The full list of shows is fetched once, and the name search and genre filter both run in memory afterwards, so there's no extra request per keystroke or filter change. The search input is still debounced, but only to avoid recomputing and re-announcing results on every keystroke.

## Accessibility

Since this is a single-page app, the browser never reloads between routes, so I update `document.title` myself on route and show changes. Without that, screen reader users lose their main cue that navigation happened.

Changing the search or genre filter changes what's on screen without a full reload, so a visually hidden live region announces the new result count, politely rather than assertively, so it doesn't interrupt mid-keystroke.

Route changes in an SPA don't reset focus the way a full page load would, so I move it manually: the dashboard heading gets focus on mount, the show details heading once its show has loaded, and the show list once it finishes loading. Loading and error states use `status` and `alert` roles, and decorative icons are hidden from assistive tech. Dashboard thumbnails use an empty alt, since the show name is already visible text right next to them. The show details poster gets a descriptive alt, since nothing next to it repeats the name.

## Error handling

For error handling, I wanted to make sure the user knows when something went wrong without exposing unnecessary technical details.

When a request fails, the UI shows a clear and consistent error message. The original error is not displayed because it is not useful for the user and may expose backend details. It is still logged to the console to help with debugging during development.

When no shows match the filters in this case, I reuse the `EmptyState` component instead of showing an error.
