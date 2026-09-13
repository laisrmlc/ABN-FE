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

Vue and Vue Router are used for the application itself. The remaining dependencies are development tools required for the Vue and TypeScript setup, testing, linting, formatting and building the project.

No additional UI or utility libraries were added.

### Sass

I added Sass in order to use Nesting and use BEM CSS pattern. It compiles to plain CSS, so it works seamlessly with Vue's `scoped` styles and adds no runtime cost.

### CSS reset

`src/assets/reset.scss` is a small hand-written reset (based on Josh Comeau's modern CSS reset) instead of a library like `normalize.css` or `destyle.css`. It only touches the browser defaults that actually cause bugs — `box-sizing`, default margins, image sizing, and form elements not inheriting the page's font — while keeping accessible defaults like a readable `line-height` and heading/paragraph text wrapping. Since it's plain CSS with no build step or config of its own, it fits the project's "no extra libraries" approach better than adding a dependency for something this small, and it's imported once, globally, in `main.ts` rather than duplicated across scoped component styles.
