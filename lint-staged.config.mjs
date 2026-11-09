/** @type {import("lint-staged").Configuration} */
export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,mdx,css,yaml,yml}": ["prettier --write"],
};
