## v 1.0.3

- New error types added.
- Stubble options can be passed to `Stubble()` by the second parameter:

Available options: - `ignoreUnregisteredHelperErrors` - ignore errors of 'Unregistered helpers' - `ignoreTagCaseSensetive` - ignore case of open and close tags

## v 1.0.4

- one string template bug fixed

## v 1.1.0

- nested same named blocks available now

## v 1.1.1

- Bug fix: there was a problem with multy attributes on custom block helpers. Now it's fixed.

## v 2.0.0

- Re-implemented with TypeScript

## v 2.0.1

- Minor publish fix

## v 2.1.0

- Added support for left-hand conditions. Now the IF block conditions can contain only the left part of the condition.

## v 2.1.1

- EACH and WITH blocks are now has a default value for situations, when context value is null or undefined

## v 2.1.2

- Bug fix: IF block conditions with comparison operators now correctly handle falsy left-hand values (e.g. `{{#if A == 0}}` with `A` equal to `0`, `""` or `false`). Previously such comparisons were short-circuited to `false` regardless of the right-hand value.

## v 2.2.0

- Added support for `{{else}}` and `{{elseif <condition>}}` branches inside an `{{#if}}` block. Branches are evaluated top-to-bottom, the first matching one is rendered, and `{{else}}` is used as a fallback when no condition matches. Nested IF blocks with their own `else`/`elseif` are handled correctly.

## v 2.2.1

- Security: fixed 15 vulnerabilities (2 low, 4 moderate, 8 high, 1 critical) reported by `npm audit` in transitive devDependencies (`@babel/core`, `@babel/traverse`, `@babel/helpers`, `braces`, `cross-spawn`, `json5`, `lodash`, `micromatch`, `minimatch`, `moment`, `picomatch`, `semver`, etc.) via `npm audit fix`.
- Security: forced `js-yaml` to `^4.2.0` through `overrides` in `package.json` to close the remaining 18 moderate advisories (GHSA-h67p-54hq-rp68, GHSA-mh29-5h37-fv8m) coming from the `babel-plugin-istanbul` → `@istanbuljs/load-nyc-config` coverage chain, without downgrading `ts-jest`.
