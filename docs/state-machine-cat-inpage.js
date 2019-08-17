import * as smcat from '../src';

const MIME2LANG = Object.freeze({
  "text/x-smcat": "smcat",
  "text/x-scxml": "scxml",
  "text/x-smcat-json": "json"
});

function renderAllScriptElements() {
  const lScripts = document.scripts;

  for (let i = 0; i < lScripts.length; i++) {
    if (
      !!MIME2LANG[lScripts[i].type] &&
      !lScripts[i].hasAttribute("data-renderedby")
    ) {
      lScripts[i].insertAdjacentHTML(
        "afterend",
        smcat.render(lScripts[i].textContent, {
          inputType: MIME2LANG[lScripts[i].type],
          outputType: "svg",
          direction: lScripts[i].getAttribute("data-direction") || "top-down",
        })
      );
      lScripts[i].setAttribute("data-renderedby", "state-machine-cat");
    }
  }
}

renderAllScriptElements();

/* eslint security/detect-object-injection: 0 */
