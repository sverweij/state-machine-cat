import * as queryString from "query-string";
import * as smcat from "../src";
import { toRasterURI } from "./sitesrc/to-raster-uri";
import { themeAttributeMap } from "./sitesrc/theme-attribute-map";

const LOCALSTORAGE_KEY = `state-machine-cat-${smcat.version.split(".")[0]}`;
const DEFAULT_INPUTSCRIPT = `initial,
"media player off",

"media player on" {
  stopped, playing, paused;

  stopped => playing : play;
  playing => stopped : stop;
  playing => paused  : pause;
  paused  => playing : pause;
  paused  => stopped : stop;
};

initial            => "media player off";
"media player off" => stopped           : power;
"media player on"  => "media player off" : power;`;

let gModel = {
  outputType: "svg",
  inputType: "smcat",
  engine: "dot",
  theme: "vanilla",
  direction: "top-down",
  fitToWidth: false,
  desugar: false,
  autoRender: true,
  inputscript: DEFAULT_INPUTSCRIPT,
  sample: "/samples/mediaplayer.smcat",
};

function startsWith(pCharacter) {
  return (pKey) => pKey.substr(0, 1) === pCharacter;
}

function toKeyValue(pQueryParams) {
  return (pKey) => ({ name: pKey.substr(1), value: pQueryParams[pKey] });
}

function persistState(pKey, pState) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(pKey, JSON.stringify(pState));
  }
}
function getState(pKey, pDefault) {
  let lRetval = pDefault;
  if (typeof localStorage !== "undefined") {
    try {
      lRetval = JSON.parse(localStorage.getItem(pKey)) || pDefault;
    } catch (e) {
      console.warn(e);
    }
  }
  return lRetval;
}

function toVectorURI(pSVGSource) {
  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<!DOCTYPE svg [<!ENTITY nbsp "&#160;">]>'.concat(pSVGSource)
    )
  );
}

function updateViewModel(pTarget) {
  return (pEvent) => {
    gModel[pTarget || pEvent.target.id] =
      pEvent.target.type === "checkbox"
        ? pEvent.target.checked
        : pEvent.target.value;
    persistState(LOCALSTORAGE_KEY, gModel);
    showModel(gModel);
  };
}

function outputIsSaveable() {
  const lSVGs = window.output.getElementsByTagName("svg");
  return lSVGs.length > 0;
}

function showModel(pModel) {
  document.getElementById("autoRender").checked = pModel.autoRender;
  document.getElementById("fitToWidth").checked = pModel.fitToWidth;
  document.getElementById("desugar").checked = pModel.desugar;
  document.getElementById("engine").value = pModel.engine;
  document.getElementById("theme").value = pModel.theme;
  document.getElementById("direction").value = pModel.direction;
  document.getElementById("sample").value = pModel.sample;
  document.getElementById("inputscript").value = pModel.inputscript;
  document.getElementById(pModel.outputType).checked = true;
  document.getElementById(`input_${pModel.inputType}`).checked = true;

  if (gModel.autoRender) {
    document.getElementById("render").style = "display : none";
    render();
  } else {
    document.getElementById("render").style = "";
  }

  if (outputIsSaveable()) {
    const lSVGs = window.output.getElementsByTagName("svg");
    const lUniqueIshPostfix = new Date().toISOString();
    document.getElementById("save-svg").href = toVectorURI(lSVGs[0].outerHTML);
    document.getElementById(
      "save-svg"
    ).download = `state-machine-${lUniqueIshPostfix}.svg`;
    toRasterURI(lSVGs[0].outerHTML, (pRasterURI) => {
      document.getElementById("save-png").href = pRasterURI;
      document.getElementById(
        "save-png"
      ).download = `state-machine-${lUniqueIshPostfix}.png`;
    });
  }
}

function getAttrFromQueryParams(pQueryParams) {
  const lDotGraphAttrs = Object.keys(pQueryParams)
    .filter(startsWith("G"))
    .map(toKeyValue(pQueryParams));
  const lDotNodeAttrs = Object.keys(pQueryParams)
    .filter(startsWith("N"))
    .map(toKeyValue(pQueryParams));
  const lDotEdgeAttrs = Object.keys(pQueryParams)
    .filter(startsWith("E"))
    .map(toKeyValue(pQueryParams));
  let lRetval = {};
  if (lDotGraphAttrs.length > 0) {
    lRetval.dotGraphAttrs = lDotGraphAttrs;
  }
  if (lDotNodeAttrs.length > 0) {
    lRetval.dotNodeAttrs = lDotNodeAttrs;
  }
  if (lDotEdgeAttrs.length > 0) {
    lRetval.dotEdgeAttrs = lDotEdgeAttrs;
  }

  return lRetval;
}

function theme2attr(pThemeAttributeMap, pTheme) {
  return (
    pThemeAttributeMap[pTheme] || {
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: [],
    }
  );
}

function sanitizeLocation(pLocationString) {
  return pLocationString.slice(0, 1024).replace(/</g, "&lt;");
}

function render() {
  window.output.innerHTML = "Loading ...";
  try {
    const lSanitizedLocation = sanitizeLocation(location.search);
    const lOptions = Object.assign(
      {
        inputType: gModel.inputType,
        outputType: gModel.outputType,
        engine: gModel.engine,
        direction: gModel.direction,
        desugar: gModel.desugar,
      },
      theme2attr(themeAttributeMap, gModel.theme),
      getAttrFromQueryParams(queryString.parse(lSanitizedLocation))
    );
    const lResult = smcat.render(gModel.inputscript, lOptions);
    window.output.style = `background-color: ${
      (
        lOptions.dotGraphAttrs.find(
          (pOption) => pOption.name === "bgcolor"
        ) || {
          value: "transparent",
        }
      ).value
    }`;
    window.output.innerHTML = formatToOutput(
      lResult,
      gModel.outputType,
      gModel.fitToWidth
    );
  } catch (pError) {
    window.output.innerHTML = pError;
  }
}

function formatToOutput(pResult, pOutputType, pFitToWidth) {
  let lRetval = pResult;

  switch (pOutputType) {
    case "json":
    case "scjson": {
      lRetval = `<pre>${JSON.stringify(pResult, null, "    ").replace(
        /</g,
        "&lt;"
      )}</pre>`;
      break;
    }
    case "svg": {
      lRetval = pFitToWidth
        ? pResult.replace(/svg width="[^"]+"/g, 'svg width="100%"')
        : pResult;
      break;
    }
    default: {
      lRetval = `<pre>${pResult.replace(/</g, "&lt;")}</pre>`;
      break;
    }
  }

  return lRetval;
}

function setTextAreaToWindowHeight() {
  window.inputscript.style.height = "${height}px".replace(
    "${height}",
    window.innerHeight - 120
  );
}

function showContextMenu(pX, pY) {
  window.contextmenu.style = `display: block; position: absolute; z-index: 2; left: ${pX}px; top: ${
    pY - 70
  }px`;
}

function hideContextMenu() {
  window.contextmenu.style = "display : none";
}

function logError(pError) {
  LOG && console.error(pError);
  gtag("event", "exception", {
    description: pError,
    fatal: false,
  });
}

gModel = getState(LOCALSTORAGE_KEY, gModel);

window.svg.addEventListener("click", updateViewModel("outputType"), false);
window.dot.addEventListener("click", updateViewModel("outputType"), false);
window.json.addEventListener("click", updateViewModel("outputType"), false);
window.smcat.addEventListener("click", updateViewModel("outputType"), false);
window.scjson.addEventListener("click", updateViewModel("outputType"), false);
window.scxml.addEventListener("click", updateViewModel("outputType"), false);
window.svg.addEventListener("click", updateViewModel("outputType"), false);
window.inputscript.addEventListener("input", updateViewModel());
window.direction.addEventListener("change", updateViewModel());
window.engine.addEventListener("change", updateViewModel());
window.theme.addEventListener("change", updateViewModel());
window.input_json.addEventListener(
  "click",
  updateViewModel("inputType"),
  false
);
window.input_smcat.addEventListener(
  "click",
  updateViewModel("inputType"),
  false
);
window.input_scxml.addEventListener(
  "click",
  updateViewModel("inputType"),
  false
);
window.fitToWidth.addEventListener("click", updateViewModel(), false);
window.autoRender.addEventListener("click", updateViewModel(), false);
window.desugar.addEventListener("click", updateViewModel(), false);
window.render.addEventListener("click", () => render(), false);
window.addEventListener("resize", setTextAreaToWindowHeight);
window.output.addEventListener("contextmenu", (pEvent) => {
  if (outputIsSaveable()) {
    pEvent.preventDefault();
    console.log(pEvent);

    showContextMenu(pEvent.clientX, pEvent.clientY);
  }
});

document.getElementById("save-svg").addEventListener("click", hideContextMenu);
document.getElementById("save-png").addEventListener("click", hideContextMenu);

window.output.addEventListener("click", hideContextMenu);

window.addEventListener("keyup", (pEvent) => {
  if (pEvent.code === "Escape") {
    hideContextMenu();
  }
});

window.sample.addEventListener("change", (pEvent) => {
  if (pEvent.target.value) {
    gModel.sample = pEvent.target.value;

    fetch(pEvent.target.value)
      .then((pResponse) => {
        if (pResponse.status === 200) {
          return pResponse.text();
        }
        logError(pResponse);
      })
      .then((pSourceText) => {
        if (pSourceText) {
          gModel.inputscript = pSourceText;
          persistState(LOCALSTORAGE_KEY, gModel);
          showModel(gModel);
        }
      })
      .catch(logError);
  }
});

window.version.innerHTML = "state machine cat ${version}".replace(
  "${version}",
  smcat.version
);
setTextAreaToWindowHeight();
showModel(gModel);
/* global LOG */
/* global gtag */
