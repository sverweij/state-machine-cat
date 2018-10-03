const smcat = require('../src');

let gCurrentRenderer  = "svg";
let gCurrentEngine    = "dot";
let gCurrentDirection = "top-down";

function render(pType, pEngine, pDirection){
    pType = Boolean(pType) ? pType : gCurrentRenderer;
    gCurrentRenderer = pType;
    pEngine = Boolean(pEngine) ? pEngine : gCurrentEngine;
    gCurrentEngine = pEngine;
    pDirection = Boolean(pDirection) ? pDirection : gCurrentDirection;
    gCurrentDirection = pDirection;

    window.output.innerHTML = 'Loading ...';
    try {
        const lResult = smcat.render(
            window.inputscript.value,
            {
                inputType: "smcat",
                outputType: pType,
                engine: pEngine,
                direction: pDirection
            }
        );
        window.output.innerHTML = formatToOutput(lResult, pType);
    } catch (pError) {
        window.output.innerHTML = pError;
    }
}

function formatToOutput(pResult, pType){
    let lRetval = pResult;

    switch (pType){
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
        lRetval = pResult;
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

window["top-down"].addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.${gCurrentRenderer}`,
                event_label: 're:top-down'
            },
            render, null, null, "top-down"
        );
    },
    false
);

window["bottom-top"].addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.${gCurrentRenderer}`,
                event_label: 're:bottom-top'
            },
            render, null, null, "bottom-top"
        );
    },
    false
);

window["left-right"].addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.${gCurrentRenderer}`,
                event_label: 're:left-right'
            },
            render, null, null, "left-right"
        );
    },
    false
);

window["right-left"].addEventListener(
    "click",
    () => {
        timeTag(
            {
                event_category: `render.${gCurrentRenderer}`,
                event_label: 're:right-left'
            },
            render, null, null, "right-left"
        );
    },
    false
);

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
