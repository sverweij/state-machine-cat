const queryString = require('query-string');
const smcat = require('../src');

const QUERY_PARAMS = queryString.parse(location.search);
const DOT_GRAPH_PARAMETERS = Object.keys(QUERY_PARAMS).map((pKey) => ({name: pKey, value: QUERY_PARAMS[pKey]}));

const LOCALSTORAGE_KEY = `state-machine-cat-${smcat.version.split('.')[0]}`;
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
    direction: "top-down",
    fitToWidth: false,
    autoRender: true,
    inputscript: DEFAULT_INPUTSCRIPT,
    sample: "/samples/mediaplayer.smcat"
};

function persistState(pKey, pState){
    if (typeof localStorage !== 'undefined'){
        localStorage.setItem(pKey, JSON.stringify(pState));
    }
}
function getState(pKey, pDefault){
    let lRetval = pDefault;
    if (typeof localStorage !== 'undefined'){
        try {
            lRetval = JSON.parse(localStorage.getItem(pKey)) || pDefault;
        } catch (e) {
            console.warn(e);
        }
    }
    return lRetval;
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

function showModel(pModel) {
    document.getElementById("autoRender").checked = pModel.autoRender;
    document.getElementById("fitToWidth").checked = pModel.fitToWidth;
    document.getElementById("engine").value = pModel.engine;
    document.getElementById("direction").value = pModel.direction;
    document.getElementById("sample").value = pModel.sample;
    document.getElementById("inputscript").value = pModel.inputscript;
    document.getElementById(pModel.outputType).checked = true;
    document.getElementById(`input_${pModel.inputType}`).checked = true;

    if (gModel.autoRender){
        document.getElementById("render").style = "display : none";
        render();
    } else {
        document.getElementById("render").style = "";
    }

}

function render(){
    window.output.innerHTML = 'Loading ...';
    try {
        const lResult = smcat.render(
            gModel.inputscript,
            {
                inputType: gModel.inputType,
                outputType: gModel.outputType,
                engine: gModel.engine,
                direction: gModel.direction,
                dotGraphParameters: DOT_GRAPH_PARAMETERS
            }
        );
        window.output.innerHTML = formatToOutput(lResult, gModel.outputType, gModel.fitToWidth);
    } catch (pError) {
        window.output.innerHTML = pError;
    }
}

function formatToOutput(pResult, pOutputType, pFitToWidth){
    let lRetval = pResult;

    switch (pOutputType){
    case "json":
    case "scjson": {
        lRetval = `<pre>${JSON.stringify(pResult, null, "    ")}</pre>`;
        break;
    }
    case "dot":
    case "scxml": {
        lRetval = `<pre>${pResult.replace(/</g, "&lt;")}</pre>`;
        break;
    }
    case "svg": {
        lRetval = pFitToWidth ? pResult.replace(/svg width="[^"]+"/g, 'svg width="100%"') : pResult;
        break;
    }
    default: {
        lRetval = `<pre>${pResult}</pre>`;
        break;
    }
    }

    return lRetval;
}

function setTextAreaToWindowHeight(){
    window.inputscript.style.height = '${height}px'.replace('${height}', window.innerHeight - 120);
}

function logError(pError) {
    LOG && console.error(pError);
    gtag('event', 'exception', {
        'description': pError,
        'fatal': false
    });
}

gModel = getState(LOCALSTORAGE_KEY, gModel);

window.svg.addEventListener("click", updateViewModel('outputType'), false);
window.dot.addEventListener("click", updateViewModel('outputType'), false);
window.json.addEventListener("click", updateViewModel('outputType'), false);
window.smcat.addEventListener("click", updateViewModel('outputType'), false);
window.scjson.addEventListener("click", updateViewModel('outputType'), false);
window.scxml.addEventListener("click", updateViewModel('outputType'), false);
window.html.addEventListener("click", updateViewModel('outputType'), false);
window.svg.addEventListener("click", updateViewModel('outputType'), false);
window.inputscript.addEventListener("input", updateViewModel());

window.direction.addEventListener("change", updateViewModel());
window.engine.addEventListener("change", updateViewModel());
window.input_json.addEventListener("click", updateViewModel('inputType'), false);
window.input_smcat.addEventListener("click", updateViewModel('inputType'), false);
window.fitToWidth.addEventListener("click", updateViewModel(), false);
window.autoRender.addEventListener("click", updateViewModel(), false);
window.render.addEventListener("click", () => render(), false);
window.addEventListener("resize", setTextAreaToWindowHeight);

window.sample.addEventListener(
    "change",
    (pEvent) => {
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
                    if (pSourceText){
                        gModel.inputscript = pSourceText;
                        persistState(LOCALSTORAGE_KEY, gModel);
                        showModel(gModel);
                    }
                }).catch(logError);
        }
    }
);

window.version.innerHTML = "state machine cat ${version}".replace("${version}", smcat.version);
setTextAreaToWindowHeight();
showModel(gModel);
/* global LOG */
/* global gtag */
