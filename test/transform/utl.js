const fs = require("fs");
const path = require("path");

function readFixture(pFixtureName) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, pFixtureName), "utf8")
  );
}

module.exports = {
  readFixture,
};
