const smcat = require('../src');

let gCurrentRenderer   = "svg";
let gCurrentEngine     = "dot";
let gCurrentDirection  = "top-down";
let gCurrentFitToWidth = false;
let gInputType         = "smcat";

function render(pOutputType, pEngine, pDirection, pFitToWidth, pInputType){
    pOutputType = Boolean(pOutputType) ? pOutputType : gCurrentRenderer;
    gCurrentRenderer = pOutputType;
    pEngine = Boolean(pEngine) ? pEngine : gCurrentEngine;
    gCurrentEngine = pEngine;
    pDirection = Boolean(pDirection) ? pDirection : gCurrentDirection;
    gCurrentDirection = pDirection;
    pFitToWidth = typeof pFitToWidth === 'undefined' ? gCurrentFitToWidth : pFitToWidth;
    gCurrentFitToWidth = pFitToWidth;
    pInputType = pInputType ? pInputType : gInputType;
    gInputType = pInputType;

    window.output.innerHTML = 'Loading ...';
    try {
        const lResult = smcat.render(
            window.inputscript.value,
            {
                inputType: pInputType,
                outputType: pOutputType,
                engine: pEngine,
                direction: pDirection
            }
        );
        window.output.innerHTML = formatToOutput(lResult, pOutputType, pFitToWidth);
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
        lRetval = pFitToWidth? pResult.replace(/svg width="[^"]+"/g, 'svg width="100%"'): pResult;
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

window.json.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.json`,
                event_label: 're:json'
            },
            render, "json"
        );
    },
    false
);
window.dot.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.dot`,
                event_label: 're:dot'
            },
            render, "dot"
        );
    },
    false
);
window.smcat.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.smcat`,
                event_label: 're:smcat'
            },
            render, "smcat"
        );
    },
    false
);
window.scjson.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.scjson`,
                event_label: 're:sjson'
            },
            render, "scjson"
        );
    },
    false
);
window.scxml.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.scxml`,
                event_label: 're:scxml'
            },
            render, "scxml"
        );
    },
    false
);
window.html.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.html`,
                event_label: 're:html'
            },
            render, "html"
        );
    },
    false
);
window.svg.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.svg`,
                event_label: 're:svg'
            },
            render, "svg", "dot"
        );
    },
    false
);


window.inputscript.addEventListener(
    "input",
    () => {
        if (window.autorender.checked){
            render();
        }
    },
    false
);

if (window.input_json){
    window.input_json.addEventListener(
        "click",
        (pEvent) => {
            timeTag(
                {
                    event_category: `render.${gCurrentRenderer}`,
                    event_label: 're:inputtype ${pEvent.target.value}'
                },
                render, null, null, null, null, pEvent.target.value
            );
        },
        false
    );
}

if (window.input_smcat){
    window.input_smcat.addEventListener(
        "click",
        (pEvent) => {
            timeTag(
                {
                    event_category: `render.${gCurrentRenderer}`,
                    event_label: 're:inputtype ${pEvent.target.value}'
                },
                render, null, null, null, null, pEvent.target.value
            );
        },
        false
    );
}

if (window.fittowidth){
    window.fittowidth.addEventListener(
        "click",
        () => {
            if (window.fittowidth.checked){
                timeTag(
                    {
                        event_category: `render.${gCurrentRenderer}`,
                        event_label: `re:with fittowidth true`
                    },
                    render, null, null, null, true
                );
            } else {
               timeTag(
                    {
                        event_category: `render.${gCurrentRenderer}`,
                        event_label: `re:with fittowidth false`
                    },
                    render, null, null, null, false
                );
            }
        }
    );
}

window.autorender.addEventListener(
    "click",
    () => {
        if (window.autorender.checked){
            window.render.style = "display : none";
            render();
        } else {
            window.render.style = "";
        }
    }
);

window.render.addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.${gCurrentRenderer}`,
                event_label: 'render button clicked'
            },
            render
        );
    }
);

if (window.direction){
    window.direction.addEventListener(
        "change",
        (pEvent) => {
            timeTag(
                {
                    event_category: `render.${gCurrentRenderer}`,
                    event_label: 're:direction ${pEvent.target.value}'
                },
                render, null, null, pEvent.target.value
            );
        }
    );
}

if (window.engine) {
    window.engine.addEventListener(
        "change",
        (pEvent) => {
            timeTag(
                {
                    event_category: `render.${gCurrentRenderer}`,
                    event_label: `re:with engine ${pEvent.target.value}`
                },
                render, null, pEvent.target.value, null
            );
        }
    );
}

if (window.samples) {
    window.samples.addEventListener(
        "change",
        (pEvent) => {
            if (pEvent.target.value) {
                fetch(pEvent.target.value)
                    .then((pResponse) => {
                        if (pResponse.status === 200) {
                            return pResponse.text();
                        }
                        logError(pResponse);
                    })
                    .then((pSourceText) => {
                        if (pSourceText){
                            document.getElementById('inputscript').value = pSourceText;
                            if (window.autorender.checked){
                                timeTag(
                                    {
                                        event_category: `render.${gCurrentRenderer}`,
                                        event_label: `${pEvent.target.value}`
                                    },
                                    render
                                );
                            }
                        }
                    }).catch(logError);
            }
        }
    );
}

function timeTag(pTagConfig, pFunction, ...pArguments) {
    const lTimingStart = Date.now();
    pFunction(...pArguments);
    const lTiming = Object.assign(
        {},
        pTagConfig,
        {
            dim_timing: Date.now() - lTimingStart
        }
    );
    LOG && console.log(lTiming);
    gtag('event', 'performance', lTiming);
}

function logError(pError) {
    LOG && console.error(pError);
    gtag('event', 'exception', {
        'description': pError,
        'fatal': false
    });
}

window.addEventListener("resize", setTextAreaToWindowHeight);

setTextAreaToWindowHeight();
window.version.innerHTML = "state machine cat ${version}".replace("${version}", smcat.version);
timeTag(
    {
        event_category: `render.${gCurrentRenderer}`,
        event_label: 'initial sample'
    },
    render, gCurrentRenderer, gCurrentEngine, gCurrentDirection
);
/* global LOG */
/* global gtag */
