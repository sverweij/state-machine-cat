function arrayify(pThing) {
    return Array.isArray(pThing) ? pThing : [pThing];
}

module.exports = {
    arrayify
};
