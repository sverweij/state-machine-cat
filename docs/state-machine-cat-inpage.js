import { render } from "../src";

const MIME2LANG = Object.freeze({
  "text/x-smcat": "smcat",
  "text/x-scxml": "scxml",
  "text/x-smcat-json": "json",
});

function getScriptSrc(pScript) {
  const lSrcURL = pScript.getAttribute("src");
  if (lSrcURL) {
    return fetch(lSrcURL).then((pResponse) => {
      return pResponse.text();
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

function renderPre(pString) {
  let lReturnValue = document.createElement("pre");
  lReturnValue.textContent = pString;
  return lReturnValue;
}

function renderCodeError(pString) {
  const lReturnValue = document.createElement("code");
  lReturnValue.setAttribute("style", "color:red");
  lReturnValue.textContent = pString;
  return lReturnValue;
}

function renderInElement(pSrc, pOptions) {
  let lRenderedString = render(pSrc, pOptions);

  switch (pOptions.outputType) {
    case "json":
    case "scjson": {
      return renderPre(JSON.stringify(lRenderedString, null, "  "));
    }
    case "svg": {
      return new DOMParser().parseFromString(lRenderedString, "image/svg+xml")
        .documentElement;
    }
    default: {
      return renderPre(lRenderedString);
    }
  }
}

function renderAllScriptElements() {
  const lScripts = document.scripts;

  for (let i = 0; i < lScripts.length; i++) {
    if (
      !!MIME2LANG[lScripts[i].type] &&
      !lScripts[i].hasAttribute("data-renderedby")
    ) {
      getScriptSrc(lScripts[i])
        .then((pSrc) => {
          lScripts[i].insertAdjacentElement(
            "afterend",
            renderInElement(pSrc, {
              inputType: MIME2LANG[lScripts[i].type],
              outputType: lScripts[i].getAttribute("data-output-type") || "svg",
              direction:
                lScripts[i].getAttribute("data-direction") || "top-down",
              engine: lScripts[i].getAttribute("data-engine") || "dot",
              desugar: lScripts[i].getAttribute("data-desugar") || false,
              dotGraphAttrs: [{ name: "bgcolor", value: "transparent" }],
            })
          );
          lScripts[i].setAttribute("data-renderedby", "state-machine-cat");
        })
        .catch((pErr) => {
          lScripts[i].insertAdjacentElement(
            "afterend",
            renderCodeError(
              `Could not render ${
                lScripts[i].src
                  ? `"${lScripts[i].src}"`
                  : (lScripts[i].textContent && "provided text content") ||
                    "(no text content)"
              }${pErr ? `: ${pErr}` : ""}`
            )
          );
        });
    }
  }
}

renderAllScriptElements();

/* eslint security/detect-object-injection: 0 */
