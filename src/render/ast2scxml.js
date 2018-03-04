const Handlebars = require("handlebars/dist/handlebars.runtime");
const ast2scjson = require("./ast2scjson");

/* eslint import/no-unassigned-import: 0 */
require("./scxml.template");

module.exports = {
    render(pAST) {
        return Handlebars.templates['scxml.template.hbs'](ast2scjson.render(pAST));
    }
};
/*
 This file is part of state-machine-cat.

 smcat is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 smcat is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with smcat.  If not, see <http://www.gnu.org/licenses/>.
 */
