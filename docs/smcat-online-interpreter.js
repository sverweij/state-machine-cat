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
        switch (pType){
            case "json": {
                window.output.innerHTML = "<pre>" + JSON.stringify(lResult, null, "    ") + "</pre>";
                break;
            }
            case "scjson": {
                window.output.innerHTML = "<pre>" + JSON.stringify(lResult, null, "    ") + "</pre>";
                break;
            }
            case "dot":
            case "scxml": {
                window.output.innerHTML = "<pre>" + lResult.replace(/</g, "&lt;") + "</pre>";
                break;
            }
            case "svg": {
                window.output.innerHTML = lResult;
                break;
            }
            default: {
                window.output.innerHTML = "<pre>" + lResult + "</pre>";
            }
        }
    } catch (pError) {
        window.output.innerHTML = pError;
    }
}

function setTextAreaToWindowHeight(){
    window.inputscript.style.height = '${height}px'.replace('${height}', window.innerHeight - 120);
}

window.json.addEventListener(
    "click",
    function(){
        render("json");
    },
    false
);
window.dot.addEventListener(
    "click",
    function(){
        render("dot");
    },
    false
);
window.smcat.addEventListener(
    "click",
    function(){
        render("smcat");
    },
    false
);
window.scjson.addEventListener(
    "click",
    function(){
        render("scjson");
    },
    false
);
window.scxml.addEventListener(
    "click",
    function(){
        render("scxml");
    },
    false
);
window.html.addEventListener(
    "click",
    function(){
        render("html");
    },
    false
);
window.svg.addEventListener(
    "click",
    function(){
        render("svg", "dot");
    },
    false
);
window.inputscript.addEventListener(
    "input",
    function(){
        if (window.autorender.checked){
            render();
        }
    },
    false
);

window["top-down"].addEventListener(
    "click",
    function(){
        render(null, null, "top-down");
    },
    false
);

window["left-right"].addEventListener(
    "click",
    function(){
        render(null, null, "left-right");
    },
    false
);

window.autorender.addEventListener(
    "click",
    function(){
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
    function(){
        render();
    }
);

if (window.engine) {
    window.engine.addEventListener(
        "change",
        function(pEvent){
            gCurrentEngine = pEvent.target.value;
            render();
        }
    );
}

if (window.samples) {
    window.samples.addEventListener(
        "change",
        function(pEvent){
            if (pEvent.target.value) {
                fetch(pEvent.target.value)
                .then(function(pResponse) {
                    if (pResponse.status === 200) {
                        return pResponse.text();
                    } else {
                        console.error(pResponse);
                        // log an error in ga
                    }
                     
                })
                .then(function(pSourceText) {
                    if(pSourceText){
                        document.getElementById('inputscript').value = pSourceText;
                        if (window.autorender.checked){
                            render();
                        }
                    }
                }).catch(function(pError) {
                    // log an error in ga
                    console.error(pError);
                });
            }
        }
    )
}

window.addEventListener("resize", setTextAreaToWindowHeight);

setTextAreaToWindowHeight();
window.version.innerHTML = "state machine cat ${version}".replace("${version}", smcat.version);
render(gCurrentRenderer, gCurrentEngine, gCurrentDirection);
