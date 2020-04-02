import { render } from "../src";

const MIME2LANG = Object.freeze({
  "text/x-smcat": "smcat",
  "text/x-scxml": "scxml",
  "text/x-smcat-json": "json"
});

function getScriptSrc(pScript) {
  const lSrcURL = pScript.getAttribute("src");
  if (lSrcURL) {
    return fetch(lSrcURL)
      .then(pResponse => {
        return pResponse.text();
      })
      .then(pText => {
        return pText;
      });
  }
  return new Promise((pResolve, pReject) => {
    if (pScript.textContent) {
      pResolve(pScript.textContent);
    } else {
      pReject();
    }
  });
}

function renderSafeish(pSrc, pOptions) {
  let lReturnValue = render(pSrc, pOptions);

  switch (pOptions.outputType) {
    case "json":
    case "scjson": {
      lReturnValue = `<pre>${JSON.stringify(lReturnValue, null, "    ").replace(
        /</g,
        "&lt;"
      )}</pre>`;
      break;
    }
    case "svg": {
      break;
    }
    default: {
      lReturnValue = `<pre>${lReturnValue.replace(/</g, "&lt;")}</pre>`;
      break;
    }
  }
  return lReturnValue;
}

function renderAllScriptElements() {
  const lScripts = document.scripts;

  for (let i = 0; i < lScripts.length; i++) {
    if (
      !!MIME2LANG[lScripts[i].type] &&
      !lScripts[i].hasAttribute("data-renderedby")
    ) {
      getScriptSrc(lScripts[i])
        .then(pSrc => {
          lScripts[i].insertAdjacentHTML(
            "afterend",
            renderSafeish(pSrc, {
              inputType: MIME2LANG[lScripts[i].type],
              outputType: lScripts[i].getAttribute("data-output-type") || "svg",
              direction:
                lScripts[i].getAttribute("data-direction") || "top-down",
              engine: lScripts[i].getAttribute("data-engine") || "dot",
              desugar: lScripts[i].getAttribute("data-desugar") || false,
              dotGraphAttrs: [{ name: "bgcolor", value: "transparent" }]
            })
          );
          lScripts[i].setAttribute("data-renderedby", "state-machine-cat");
        })
        .catch(pErr => {
          lScripts[i].insertAdjacentHTML(
            "afterend",
            `<code style="color:red">Could not render ${
              lScripts[i].src
                ? `"${lScripts[i].src}"`
                : (lScripts[i].textContent && "provided text content") ||
                  "(no text content)"
            }${pErr ? `: ${pErr}` : ""}<code>`
          );
        });
    }
  }
}

renderAllScriptElements();

/* eslint security/detect-object-injection: 0 */
