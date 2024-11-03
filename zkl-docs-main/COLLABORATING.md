# a small guide to collaborating

The approach we use is like this:

- we create modules that solve a single problem (by modules I mean ES6 modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#introducing_an_example)
- if your main goal A requires a sub goal B, create (or get it delegated to someone to create) module B
- each module exports <ins>pure functions</ins>
- pure functions should always check their inputs and either
  - throw errors (when something should break, let it break) (note that it's not "if it must" but "if it should"!)
  - warn developers by console.warn if something is discouraged but doesn't affect the workflow/use case
- for each class or function please add API documentation using the JSDoc format (https://github.com/jsdoc/jsdoc)

I advise you to check out https://git.fybx.dev/fyb/zkl-kds/src/branch/main/key-derivation.js and https://git.fybx.dev/fyb/zkl-kds/src/branch/main/key.js to get an idea on how to develop modules with pure functions.

might get updated occasionally, any questions -> [yigid](https://fybx.dev/telegram)