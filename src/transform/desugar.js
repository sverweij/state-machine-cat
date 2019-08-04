const deSugarForks = require("./desugarForks");
const deSugarJoins = require("./desugarJoins");

module.exports = pMachine => deSugarJoins(deSugarForks(pMachine));
