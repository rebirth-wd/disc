# Islands

React components that hydrate on the client live here. Everything else on the site is static Astro.

- Default to `client:visible` so the JavaScript loads only when the island scrolls into view.
- Use `client:load` only for islands that are above the fold and must be interactive immediately.
- Use `client:only="react"` only when the component cannot be server-rendered (it touches `window` or `document` during render).
- Give every island typed props and keep it small; pass data in from the Astro page rather than fetching inside the island.
