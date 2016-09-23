define(function (require) {
    var smcat = require('../src/index');
    var gCurrentRenderer = "svg";
    var gCurrentEngine   = "dot";

    function render(pType, pEngine){
        pType = Boolean(pType) ? pType : gCurrentRenderer;
        gCurrentRenderer = pType;
        pEngine = Boolean(pEngine) ? pEngine : gCurrentEngine;
        gCurrentEngine = pEngine;

        window.output.innerHTML = "";
        smcat.render(
            window.inputscript.value,
            {
                inputType: "smcat",
                outputType: pType,
                engine: pEngine
            },
            function (pError, pSuccess){
                if (Boolean(pError)){
                    window.output.innerHTML = pError;
                }
                if (Boolean(pSuccess)){
                    switch (pType){
                    case "json": {
                        window.output.innerHTML = "<pre>" + JSON.stringify(pSuccess, null, "    ") + "</pre>";
                        break;
                    }
                    case "svg": {
                        window.output.innerHTML = pSuccess;
                        break;
                    }
                    default: {
                        window.output.innerHTML = "<pre>" + pSuccess + "</pre>";
                    }
                    }
                }

            }
        );
    }

    function setTextAreaToWindowHeight(){
        window.inputscript.style.height = '${height}px'.replace('${height}', window.innerHeight - 100);
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

    window.addEventListener("resize", setTextAreaToWindowHeight);

    setTextAreaToWindowHeight();
    window.version.innerHTML = "SM-cat ${version}".replace("${version}", smcat.version);
    render(gCurrentRenderer);

});
