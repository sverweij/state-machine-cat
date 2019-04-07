module.exports = function (pInStream) {
    return new Promise((pResolve, pReject) => {
        let lInput = "";

        pInStream
            .resume()
            .setEncoding("utf8")
            .on("data", (pChunk) => {
                lInput += pChunk;
            })
            .on("end", () => {
                try {
                    pInStream.pause();
                    pResolve(lInput);
                }
                catch (e) {
                    pReject(e);
                }
            })
            .on("error", (e) => {
                pReject(e);
            });
    });
};
