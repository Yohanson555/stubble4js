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
