const queryString = require("query-string");
const smcat = require("../src");
const toRasterURI = require("./to-raster-uri");

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
  sample: "/samples/mediaplayer.smcat"
};

function startsWith(pCharacter) {
  return pKey => pKey.substr(0, 1) === pCharacter;
}

function toKeyValue(pQueryParams) {
  return pKey => ({ name: pKey.substr(1), value: pQueryParams[pKey] });
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
  return pEvent => {
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
    toRasterURI(lSVGs[0].outerHTML, pRasterURI => {
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

function theme2attr(pTheme) {
  const THEME2ATTR = {
    engineering: {
      dotGraphAttrs: [
        { name: "bgcolor", value: "dodgerblue" },
        { name: "color", value: "white" },
        { name: "fontname", value: "courier" },
        { name: "fontcolor", value: "white" }
      ],
      dotNodeAttrs: [
        { name: "color", value: "white" },
        { name: "fontname", value: "courier" },
        { name: "fontcolor", value: "white" }
      ],
      dotEdgeAttrs: [
        { name: "color", value: "white" },
        { name: "fontname", value: "courier" },
        { name: "fontcolor", value: "white" }
      ]
    },
    reverse: {
      dotGraphAttrs: [
        { name: "bgcolor", value: "black" },
        { name: "color", value: "white" },
        { name: "fontcolor", value: "white" }
      ],
      dotNodeAttrs: [
        { name: "color", value: "white" },
        { name: "fontcolor", value: "white" }
      ],
      dotEdgeAttrs: [
        { name: "color", value: "white" },
        { name: "fontcolor", value: "white" }
      ]
    },
    contrast: {
      dotGraphAttrs: [
        { name: "bgcolor", value: "black" },
        { name: "color", value: "yellow" },
        { name: "fontcolor", value: "yellow" }
      ],
      dotNodeAttrs: [
        { name: "color", value: "yellow" },
        { name: "fontcolor", value: "yellow" }
      ],
      dotEdgeAttrs: [
        { name: "color", value: "yellow" },
        { name: "fontcolor", value: "yellow" }
      ]
    },
    policetape: {
      dotGraphAttrs: [{ name: "bgcolor", value: "yellow" }],
      dotNodeAttrs: [],
      dotEdgeAttrs: []
    },
    transparent: {
      dotGraphAttrs: [{ name: "bgcolor", value: "transparent" }],
      dotNodeAttrs: [],
      dotEdgeAttrs: []
    },
    zany: {
      dotGraphAttrs: [
        { name: "bgcolor", value: "deeppink" },
        { name: "color", value: "green" },
        { name: "fontname", value: '"Comic Sans MS"' },
        { name: "fontcolor", value: "green" },
        { name: "nslimit", value: "0" },
        { name: "nslimit1", value: "1" }
      ],
      dotNodeAttrs: [
        { name: "color", value: "green" },
        { name: "fontname", value: '"Comic Sans MS"' },
        { name: "fontcolor", value: "green" }
      ],
      dotEdgeAttrs: [
        { name: "color", value: "green" },
        { name: "fontname", value: '"Comic Sans MS"' },
        { name: "fontcolor", value: "green" }
      ]
    }
  };
  return (
    THEME2ATTR[pTheme] || {
      dotGraphAttrs: [],
      dotNodeAttrs: [],
      dotEdgeAttrs: []
    }
  );
}
function render() {
  window.output.innerHTML = "Loading ...";
  try {
    const lOptions = Object.assign(
      {
        inputType: gModel.inputType,
        outputType: gModel.outputType,
        engine: gModel.engine,
        direction: gModel.direction,
        desugar: gModel.desugar
      },
      theme2attr(gModel.theme),
      getAttrFromQueryParams(queryString.parse(location.search))
    );
    const lResult = smcat.render(gModel.inputscript, lOptions);
    window.output.style = `background-color: ${
      (
        lOptions.dotGraphAttrs.find(pOption => pOption.name === "bgcolor") || {
          value: "transparent"
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
      lRetval = `<pre>${JSON.stringify(pResult, null, "    ")}</pre>`;
      break;
    }
    case "dot":
    case "scxml":
    case "xmi": {
      lRetval = `<pre>${pResult.replace(/</g, "&lt;")}</pre>`;
      break;
    }
    case "svg": {
      lRetval = pFitToWidth
        ? pResult.replace(/svg width="[^"]+"/g, 'svg width="100%"')
        : pResult;
      break;
    }
    default: {
      lRetval = `<pre>${pResult}</pre>`;
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
  window.contextmenu.style = `display: block; position: absolute; z-index: 2; left: ${pX}px; top: ${pY -
    70}px`;
}

function hideContextMenu() {
  window.contextmenu.style = "display : none";
}

function logError(pError) {
  LOG && console.error(pError);
  gtag("event", "exception", {
    description: pError,
    fatal: false
  });
}

gModel = getState(LOCALSTORAGE_KEY, gModel);

window.svg.addEventListener("click", updateViewModel("outputType"), false);
window.dot.addEventListener("click", updateViewModel("outputType"), false);
window.json.addEventListener("click", updateViewModel("outputType"), false);
window.smcat.addEventListener("click", updateViewModel("outputType"), false);
window.scjson.addEventListener("click", updateViewModel("outputType"), false);
window.scxml.addEventListener("click", updateViewModel("outputType"), false);
window.xmi.addEventListener("click", updateViewModel("outputType"), false);
window.html.addEventListener("click", updateViewModel("outputType"), false);
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
window.output.addEventListener("contextmenu", pEvent => {
  if (outputIsSaveable()) {
    pEvent.preventDefault();
    showContextMenu(pEvent.pageX, pEvent.pageY);
  }
});

window.output.addEventListener("click", pEvent => {
  hideContextMenu();
});

window.addEventListener("keyup", pEvent => {
  if (pEvent.code === "Escape") {
    hideContextMenu();
  }
});

window.sample.addEventListener("change", pEvent => {
  if (pEvent.target.value) {
    gModel.sample = pEvent.target.value;

    fetch(pEvent.target.value)
      .then(pResponse => {
        if (pResponse.status === 200) {
          return pResponse.text();
        }
        logError(pResponse);
      })
      .then(pSourceText => {
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
