/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";
    var COUNTER = 0;

    return {
        clone: function (pObject) {
            return JSON.parse(JSON.stringify(pObject));
        },

        getNumber: function () {
            return (++COUNTER).toString(10);
        }


    };
});
/*
 This file is part of stategenny.

 stategenny is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 stategenny is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with stategenny.  If not, see <http://www.gnu.org/licenses/>.
 */
