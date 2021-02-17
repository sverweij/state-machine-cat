# Hacking on state-machine-cat

If you want to change or add to the functionality of state-machine-cat - here's
some notes that might be of help.

## Adding a new output format ('renderer')

### Render function

A render function takes a state machine cat AST (that adheres to the state machine cat
AST [JSON schema](smcat-ast.schema.json)) and emits a string in the format you desire:

```typescript
function render(pAST: IStateMachine): string;
```

### Steps to add it to the api (and command line interface)

- put the render function in a package under `src/render` (if it's multiple files in their
  own folder) - or publish your renderer to npm so it can be imported:
- Require it in `src/render/index.js` and add it to the OUTPUTTYPE2RENDERFUNCTION constant.
- Add it to the `outputTypes.values` array in `src/options.js`
- Write tests to make sure the render functions work

### Steps to add it to the website

The site uses no frameworks - there's just a handlebars template that translates to
an index.html and a javascript module that serves as the entry for creating a
bundle.

- in the handlebars template (`docs/index.hbs`) add a new list item

```html
...
<li class="mdl-list__item">
  <span class="mdl-list__item-primary-content">
    <label
      class="mdl-radio mdl-js-radio mdl-js-ripple-effect"
      for="YOURRENDERER"
    >
      <input
        type="radio"
        id="YOURRENDERER"
        class="mdl-radio__button"
        name="outputtyperg"
        value="YOURRENDERER"
      />
      <span class="mdl-radio__label">YOURRENDERER</span>
    </label>
  </span>
</li>
...
```

- in `docs/smcat-online-interpreter.js` add event listener next to the other ones

```javascript
...
window.YOURRENDERER.addEventListener("click", updateViewModel('outputType'), false);
...
```

- `npm run build` to build the site (esbuild to prod; `docs/index.hbs`
  -> `docs/index.html`).
- To test start a simple webserver in the `docs` folder (e.g. with
  `python -m SimpleHTTPServer 8481`) and open your webbrowser on http://localhost:8481
  or http://localhost:8481/dev for the development version (uncompressed bundle with
  source maps for easy debugging).
