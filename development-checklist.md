Complete these steps before launching this theme. Each step explains _what to do_, _how to do it_, and _why it matters_.

---

## 1. Code quality check

**What it does:** Scans your entire project for errors, warnings, and style issues.

**Why it matters:** Errors in your code can crash pages or cause unexpected behavior. Fixing them before launch prevents problems from reaching your users.

**Run this command in your terminal:**

```sh
npm run astro-check
```

- Fix every **error** (shown in red), **warning** (shown in yellow), and lint issue it reports
- Re-run the command until you see zero issues
- Don't ignore warnings — they can silently cause problems too

---

## 2. Page speed scores

**What it does:** [Unlighthouse](https://unlighthouse.dev/) crawls every page on your site and scores each one out of 100 across four categories.

**Why it matters:** Slow or inaccessible pages frustrate users and rank lower in search engines. These scores are a reliable signal of overall site health.

Hit these targets on **both desktop and mobile**:

| Page type       | Performance | Accessibility | Best Practices | SEO  |
| --------------- | ----------- | ------------- | -------------- | ---- |
| Homepage        | 100+        | 100+          | 100+           | 100+ |
| All other pages | 95+         | 100+          | 100+           | 100+ |

> **Tip:** Desktop and mobile scores can differ significantly — make sure to test both.

---

## 3. Broken links

**What it does:** Crawls your entire site and saves a list of every broken link to a text file.

**Why it matters:** Links that lead nowhere create a bad user experience and hurt your SEO ranking.

**Step 1 —** Make sure your local development server is running, then run:

```sh
blc http://localhost:4321/ -ovre --filter-level 0 > broken-links.txt
```

**Step 2 —** Open the `broken-links.txt` file it creates.

**Step 3 —** Search for `├─BROKEN─` inside that file.

**Step 4 —** Fix or remove each broken link you find.

> **Tip:** If `blc` isn't installed yet, run `npm install -g broken-link-checker` first.

---

## 4. Run tests

**What it does:** Runs automated checks that verify your code does what it's supposed to.

**Why it matters:** If any test fails, something is broken and needs fixing before launch. Tests catch regressions — bugs you accidentally introduced while working on something else.

```sh
npm run test
```

- All tests must show as **passed** (green)
- If any test fails, read the error message — it tells you exactly what broke and where
- Do not launch with failing tests

---

## 5. Run all scripts

**What it does:** Runs every script defined in your `package.json` file (builds, linters, generators, etc.).

**Why it matters:** Each script represents a task your project depends on. If any of them fail, something in your project is broken.

- Open `package.json` and find the `"scripts"` section
- Run each script one by one: `npm run <script-name>`
- **Skip** any scripts that mention "multilingual" or translation-related tasks
- All other scripts must complete without errors

---

## 6. Security vulnerabilities

**What it does:** Scans your installed packages for known security issues.

**Why it matters:** Third-party packages you install can have known security holes (called vulnerabilities). These commands check whether any of your packages are affected.

```sh
npm audit
```

```sh
pnpm audit
```

- Run **both** commands — they may catch different issues
- Fix all **high** and **critical** severity issues before launch
- Try `npm audit fix` to automatically fix issues where possible

---

## 7. Cleanup

**What it does:** Removes unused files and dead code from your project.

**Why it matters:** Unused images add load time. Unused code causes confusion and makes your project harder to maintain. A clean codebase is faster and easier to work with.

- Delete any images that are not referenced anywhere in your code
- Read through every file in the `config` folder line by line
- Remove any variables, functions, imports, or components that are no longer used
- Search for `TODO` and `FIXME` comments and address them

> **Tip:** Your code editor may highlight unused imports in gray — those are generally safe to delete.

---

## 8. Update dependencies

**What it does:** Checks for outdated packages and updates them to their latest versions.

**Why it matters:** Package updates include bug fixes, security patches, and new features. Running on old versions means missing those improvements.

```sh
npm outdated -g
```

```sh
npm update
```

- The first command **lists** outdated packages
- The second command **updates** them
- After updating, check each package's changelog (usually on GitHub or npm) for **breaking changes**

> **What is a breaking change?** It means the package changed in a way that could break your existing code. Always read the upgrade notes and apply any required code changes.

---

## 9. No hardcoded text

**What it does:** Ensures all visible text and links come from language files, not written directly into your code.

**Why it matters:** Text written directly in your code (e.g. `<h1>Welcome</h1>`) can't be translated or updated centrally. Storing it in language files makes your site easier to maintain and localize.

- Search your codebase for any English words or sentences typed directly into HTML/JSX/template files
- Move them into `en.json` and `fr.json` with matching keys
- Replace the hardcoded text with a dynamic reference to that key
- Also check for hardcoded URLs — these should live in config, not scattered throughout your code

---

## 10. Config validation

**What it does:** Verifies that every setting in `config.toml` actually affects the site as expected.

**Why it matters:** Config options that are broken or ignored create silent bugs — the setting exists but does nothing. Every option should visibly change the site when toggled.

**Run this in your dev command to watch for changes:**

```sh
npm run toml:watch -- --watch
```

- Open each section (called a "table") in `config.toml` one by one
- For boolean options: toggle them between `true` and `false` and confirm the site updates
- Changes should reflect in the browser **without restarting the server**

> **What is a "table" in TOML?** It's a section that starts with `[section-name]` — think of it as a group of related settings.

---

## 11. Deploy to all platforms

**What it does:** Publishes your site to three different hosting platforms and verifies everything works on each.

**Why it matters:** Each hosting platform behaves slightly differently. Deploying to all three confirms your site works everywhere — not just on your machine.

**Before deploying:** Push your latest code to your Git repository (GitHub, GitLab, etc.). Each platform will automatically build and deploy from your repo.

After each deployment, visit the live URL and manually check your key pages.

- [ ] **Netlify** — [netlify.com](https://netlify.com)
- [ ] **Vercel** — [vercel.com](https://vercel.com)
- [ ] **Cloudflare Pages** — [pages.cloudflare.com](https://pages.cloudflare.com)
