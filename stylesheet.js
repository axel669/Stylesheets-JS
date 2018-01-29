"use strict";

(function () {
    var cssNoMeasurement = new Set(["animationIterationCount", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount", "fillOpacity", "flex", "flexGrow", "flexPositive", "flexShrink", "flexNegative", "flexOrder", "fontWeight", "lineClamp", "lineHeight", "opacity", "order", "orphans", "stopOpacity", "strokeDashoffset", "strokeOpacity", "strokeWidth", "tabSize", "widows", "zIndex", "zoom"]);
    var cssPrefixNames = new Set(['transform', 'transformOrigin', 'boxShadow', 'transition', 'animation', 'animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction', 'userSelect', 'justifyContent', 'alignItems', 'flexWrap']);
    var cssPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
    var cssValueString = function cssValueString(item) {
        var key = item[0];
        var value = item[1];
        if (_typeof(value) === 'function') {
            value = value();
        }
        if (_typeof(value) === 'number' && cssNoMeasurement.has(key) === false) {
            value = value + "px";
        }
        return [key, value];
    };

    var _typeof = new Function('obj', 'return typeof obj');
    var arrayify = function arrayify(obj) {
        return Object.keys(obj).map(function (key) {
            var value = obj[key];

            if (_typeof(value) === 'object' && Array.isArray(value) == false) {
                value = arrayify(value, false);
            }

            return [key, value];
        });
    };
    var renderTextIndented = function renderTextIndented(value) {
        var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var tabs = '  '.repeat(indent);
        var lines = [];

        var key = value[0];
        var val = value[1];
        var lineVals = Array.isArray(value) === true ? value : [value];

        // lines.push(`${tabs}${key} {`);
        // lines.push(tabs + "}");

        // values.forEach(
        //     valueInfo => {
        //         const key = valueInfo[0];
        //         const value = valueInfo[1];
        //         lines.push(`${tabs}${key} {`);
        //
        //         let lineVals = (Array.isArray(value) === true) ? value : [value];
        //
        //         lineVals.forEach(val => {
        //             if (Array.isArray(val[1]) === true && Array.isArray(val[1][0]) === true) {
        //                 lines = lines.concat(renderTextIndented(val[0], indent + 1));
        //             }
        //             else {
        //                 const cssVal = cssValueString(val);
        //                 lines.push(`${tabs}  ${cssVal[0]}: ${cssVal[1]};`);
        //             }
        //         });
        //
        //         lines.push(tabs + "}");
        //     }
        // );

        return lines;
    };

    var Sheet = function Sheet() {
        var stuff = [];
        return {
            addStyles: function addStyles(styles) {
                stuff = stuff.concat(arrayify(styles));
            },
            renderText: function renderText() {
                var useIndent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                if (useIndent === true) {
                    return renderTextIndented(stuff).join('\n');
                }
                return null;
            },
            attach: function attach() {
                var head = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            },

            //testing
            get stuff() {
                return stuff;
            }
        };
    };

    if (typeof window !== 'undefined') {
        window.ssjs = {
            create: Sheet
        };
    }
})();