import { render } from "../src";

const MIME2LANG = Object.freeze({
  "text/x-smcat": "smcat",
  "text/x-scxml": "scxml",
  "text/x-smcat-json": "json",
});

function getResponseStatus(pResponse) {
  if (pResponse.ok) {
    return Promise.resolve(pResponse);
  } else {
    return Promise.reject(new Error(pResponse.statusText));
  }
}

function getResponseText(pResponse) {
  return pResponse.text();
}

function getScriptSrc(pScript) {
  const lSourceURL = pScript.getAttribute("src");
  if (lSourceURL) {
    return fetch(lSourceURL).then(getResponseStatus).then(getResponseText);
  }
  return new Promise((pResolve, pReject) => {
    if (pScript.textContent) {
      pResolve(pScript.textContent);
    } else {
      pReject(new Error("ERROR: this element doesn't contain any text"));
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

function renderInElement(pSource, pOptions) {
  let lRenderedString = render(pSource, pOptions);

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
  [...document.scripts]
    .filter(
      (pScript) =>
        !!MIME2LANG[pScript.type] && !pScript.hasAttribute("data-renderedby")
    )
    .forEach((pScript) => {
      getScriptSrc(pScript)
        .then((pSrc) => {
          pScript.after(
            renderInElement(pSrc, {
              inputType: MIME2LANG[pScript.type],
              outputType: pScript.getAttribute("data-output-type") || "svg",
              direction: pScript.getAttribute("data-direction") || "top-down",
              engine: pScript.getAttribute("data-engine") || "dot",
              desugar: pScript.getAttribute("data-desugar") || false,
              dotGraphAttrs: [{ name: "bgcolor", value: "transparent" }],
            })
          );
          pScript.setAttribute("data-renderedby", "state-machine-cat");
        })
        .catch((pErr) => {
          pScript.after(
            renderCodeError(
              `Could not render ${
                pScript.src
                  ? `"${pScript.src}"`
                  : (pScript.textContent && "provided text content") ||
                    "(no text content)"
              }${pErr ? `: ${pErr}` : ""}`
            )
          );
        });
    });
}

renderAllScriptElements();

/* eslint security/detect-object-injection: 0 */
