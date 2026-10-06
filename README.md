# Mathematical Foundations of Machine Learning

A Jekyll documentation website using the [Just the Docs](https://just-the-docs.com/) theme.

## Publish on GitHub Pages

1. Push these files to the `main` branch of this repository.
2. Open **Settings → Pages** in GitHub and set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy Jekyll site to GitHub Pages** and select **Run workflow** if the initial run has not succeeded. Later pushes to `main` deploy automatically.

The site will be available at <https://archipelagoing.github.io/MathFoundMachineLearn/> once deployment succeeds.

## Preview locally

With Ruby 3.3 or later and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

Open <http://localhost:4000/MathFoundMachineLearn/>.

## Edit the site

- Edit `index.md` to update the homepage.
- Add Markdown pages under `docs/`, starting with YAML front matter:

  ```yaml
  ---
  title: Linear Algebra
  nav_order: 3
  ---
  ```

- Adjust the site title, navigation links, and theme options in `_config.yml`.
- Use Jekyll's `relative_url` filter for internal links so they work under the repository's GitHub Pages path.

The build workflow is in `.github/workflows/pages.yml`.

## Gram–Schmidt walkthrough

The Problem 4 page is in `docs/gram-schmidt.md`. Its ten-step walkthrough uses local JavaScript and SVG, with no external visualization dependencies. The 3D display uses an orthonormal coordinate system for the three-dimensional subspace containing this problem's vectors in ℝ⁴, preserving their lengths and angles.

To check the basis, projection, closest-point identity, and display geometry with Node.js:

```sh
node tests/gram-schmidt.mjs
```
