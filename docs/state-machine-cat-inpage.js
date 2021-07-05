import { render } from "../src/index.cjs";

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

function getScriptSource(pScript) {
  const lSourceURL = pScript.getAttribute("src");
  if (lSourceURL) {
    return fetch(lSourceURL).then(getResponseStatus).then(getResponseText);
  }
  // when there's no "src" attribute, return the textContent
  // (in a Promise to have a consistent interface)
  return new Promise((pResolve, pReject) => {
    if (pScript.textContent && pScript.textContent.length > 0) {
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
function renderScript(pScriptElement) {
  if (!pScriptElement.dataset.renderedby) {
    pScriptElement.dataset.renderedby = "state-machine-cat";
    getScriptSource(pScriptElement)
      .then((pSrc) => {
        pScriptElement.after(
          renderInElement(pSrc, {
            inputType: MIME2LANG[pScriptElement.type],
            outputType:
              pScriptElement.getAttribute("data-output-type") || "svg",
            direction: pScriptElement.dataset.direction || "top-down",
            engine: pScriptElement.dataset.engine || "dot",
            desugar: pScriptElement.dataset.desugar || false,
            dotGraphAttrs: [{ name: "bgcolor", value: "transparent" }],
          })
        );
      })
      .catch((pErr) => {
        pScriptElement.after(
          renderCodeError(
            `Could not render ${
              pScriptElement.src
                ? `"${pScriptElement.src}"`
                : (pScriptElement.textContent && "provided text content") ||
                  "(no text content)"
            }${pErr ? `: ${pErr}` : ""}`
          )
        );
      });
  }
}

function observerCallback(pEntries, _pObserver) {
  pEntries.forEach((pEntry) => {
    if (pEntry.isIntersecting) {
      const lScriptElement = pEntry.target.previousElementSibling;
      if (lScriptElement.tagName === "SCRIPT") {
        renderScript(lScriptElement);
      }
    }
  });
}

let OBSERVER = new IntersectionObserver(observerCallback, { threshold: 1 });

const SCRIPT_ELEMENTS = [...document.scripts].filter(
  (pScript) => !!MIME2LANG[pScript.type]
);

SCRIPT_ELEMENTS.forEach((pScriptElement) => {
  // scripts are not visible, hence observing them for visibility
  // is doing nothing. Workaround: insert a marker element right
  // after it that _is_ visible, and observe that.
  const lScriptMarker = document.createElement("smcat-marker");
  pScriptElement.after(lScriptMarker);

  OBSERVER.observe(lScriptMarker);
});

// Observer trickery, of course, is nice, but when you print a page
// you want all of the graphs to show up anyway. This ensures that
// that indeed happens at the right time:
window.addEventListener("beforeprint", (_pEvent) => {
  SCRIPT_ELEMENTS.forEach(renderScript);
});

/* eslint security/detect-object-injection: 0 */
