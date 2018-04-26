module.exports = function (pInStream) {
    return new Promise((pResolve, pReject) => {
        let lInput = "";
        pInStream.resume();
        pInStream.setEncoding("utf8");
        pInStream.on("data", (pChunk) => {
            lInput += pChunk;
        });
        pInStream.on("end", () => {
            try {
                pInStream.pause();
                pResolve(lInput);
            }
            catch (e) {
                pReject(e);
            }
        });
        pInStream.on("error", (e) => {
            pReject(e);
        });
    });
};
