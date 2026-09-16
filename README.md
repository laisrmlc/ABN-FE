# TV Show Dashboard

Frontend assessment built with Vue 3 and TypeScript using the TVMaze API.

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

The project intentionally keeps dependencies to a minimum.

Vue and Vue Router are used for the application itself. Most of the remaining dependencies are development tools required for the Vue and TypeScript setup, testing, linting, formatting and building the project. The one exception is DOMPurify, added for the reason described below.

### Sass

Sass was added in order to use Nesting and use BEM CSS pattern. It compiles to plain CSS, so it works seamlessly with Vue's `scoped` styles and adds no runtime cost.

### CSS reset

`src/assets/reset.scss` is a small reset based on Josh Comeau's modern CSS reset, used instead of a library like `normalize.css` or `destyle.css`. It only touches defaults that actually cause bugs (`box-sizing`, default margins, image sizing, form elements not inheriting the page's font), keeping accessible defaults like readable `line-height` and text wrapping. It's plain CSS with no build step, imported once, globally, in `main.ts`.

### DOMPurify

The show summary from the TVMaze API contains HTML tags. Rather than rendering that HTML with `v-html` (which would need ongoing sanitization to stay XSS-safe as a permanent trade-off), DOMPurify is used with `ALLOWED_TAGS: []` to strip all tags and keep only the plain text, which is then rendered with normal text interpolation instead. This removes the dangerous sink entirely rather than just sanitizing what goes into it, at the cost of losing any inline formatting, like bold, the summary had.

### AbortSignal and AbortController

AbortSignal and AbortController were added to avoid keeping requests alive when their results are no longer needed. This helps prevent unnecessary work and makes request handling more predictable, especially when a component is unmounted or a request takes longer than expected. This project is small and the amount of TV shows are not big, but in case it grows to a bigger scale it already has this implemented.

### Debounce

Debounce was added to avoid triggering the operation on every input change. Instead, it waits until the user stops typing for a short period before executing it, reducing unnecessary work and improving performance.

### Filters

Both the name and genre filters are applied simultaneously. I treated them as combined filters, so the results must match both criteria when both are selected.
