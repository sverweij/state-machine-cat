define(function (require) {
    var stategenny = require('../src/index');

    function render(pType){
        window.output.innerHTML = "";
        stategenny.translate(
            window.inputscript.value,
            {
                inputType: "stategenny",
                outputType: pType
            },
            function (pError, pSuccess){
                if (Boolean(pError)){
                    window.output.innerHTML = pError;
                }
                if (Boolean(pSuccess)){
                    window.output.innerHTML =
                        (pType === "json" ? JSON.stringify(pSuccess, null, "  ") : pSuccess);
                }

            }
        );
    }

    function setTextAreaToWindowHeight(){
        window.inputscript.style.height = '${height}px'.replace('${height}', window.innerHeight);
    }

    window.json.addEventListener("click", function(){render("json");}, false);
    window.dot.addEventListener("click", function(){render("dot");}, false);
    window.stategenny.addEventListener("click", function(){render("stategenny");}, false);
    window.svg.addEventListener("click", function(){render("svg");}, false);

    window.addEventListener("resize", setTextAreaToWindowHeight);

    setTextAreaToWindowHeight();
    window.version.innerHTML = "stategenny ${version}".replace("${version}", stategenny.version);
    render("json");


});
