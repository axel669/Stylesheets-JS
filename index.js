"use strict";

(function () {
    var cssNoMeasurement = new Set(["animationIterationCount", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount", "fillOpacity", "flex", "flexGrow", "flexPositive", "flexShrink", "flexNegative", "flexOrder", "fontWeight", "lineClamp", "lineHeight", "opacity", "order", "orphans", "stopOpacity", "strokeDashoffset", "strokeOpacity", "strokeWidth", "tabSize", "widows", "zIndex", "zoom"]);
    var cssPrefixNames = new Set(['userSelect']);
    var cssPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
    var cssValueString = function cssValueString(key, value) {
        if (_typeof(value) === 'function') {
            value = value();
        }
        if (_typeof(value) === 'number' && cssNoMeasurement.has(key) === false) {
            value = value + "px";
        }
        return value;
    };

    var _typeof = new Function('obj', 'return typeof obj');
    var arrayify = function arrayify(obj) {
        return Object.keys(obj).map(function (key) {
            var value = obj[key];

            if (_typeof(value) === 'object' && Array.isArray(value) == false) {
                value = arrayify(value, false);
                return { key: key, value: value };
            }

            return { name: key, value: value };
        });
    };
    var renderTextIndented = function renderTextIndented(item) {
        var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var tabs = '  '.repeat(indent);
        var lines = [];

        var key = item.key;
        var name = item.name;
        var value = item.value;

        if (key !== undefined) {
            lines.push("" + tabs + key + " {");
            value.forEach(function (val) {
                return lines = lines.concat(renderTextIndented(val, indent + 1));
            });
            lines.push(tabs + "}");
        } else {
            var displayName = name.replace(/[A-Z]/g, function (s) {
                return "-" + s.toLowerCase();
            });
            if (Array.isArray(value) === true) {
                value.forEach(function (val) {
                    return lines.push("" + tabs + displayName + ": " + cssValueString(name, val) + ";");
                });
            } else {
                var cssVal = cssValueString(name, value);
                if (cssPrefixNames.has(name) === true) {
                    cssPrefixes.forEach(function (prefix) {
                        return lines.push("" + tabs + prefix + displayName + ": " + cssVal + ";");
                    });
                } else {
                    lines.push("" + tabs + displayName + ": " + cssVal + ";");
                }
            }
        }

        return lines.join('\n');
    };
    var renderText = function renderText(item) {
        var lines = [];

        var key = item.key;
        var name = item.name;
        var value = item.value;

        if (key !== undefined) {
            lines.push(key + "{");
            value.forEach(function (val) {
                return lines = lines.concat(renderText(val));
            });
            lines.push("}");
        } else {
            var displayName = name.replace(/[A-Z]/g, function (s) {
                return "-" + s.toLowerCase();
            });
            if (Array.isArray(value) === true) {
                value.forEach(function (val) {
                    return lines.push(displayName + ":" + cssValueString(name, val) + ";");
                });
            } else {
                var cssVal = cssValueString(name, value);
                if (cssPrefixNames.has(name) === true) {
                    cssPrefixes.forEach(function (prefix) {
                        return lines.push("" + prefix + displayName + ": " + cssVal + ";");
                    });
                } else {
                    lines.push(displayName + ": " + cssVal + ";");
                }
            }
        }

        return lines.join('');
    };

    var Sheet = function Sheet() {
        var stuff = [];
        var elem = null;
        var attr = {};

        var renderTextCall = function renderTextCall() {
            var useIndent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (useIndent === true) {
                return stuff.map(function (thing) {
                    return renderTextIndented(thing);
                }).join('\n');
            }
            return stuff.map(renderText).join('');
        };

        return {
            addStyles: function addStyles(styles) {
                stuff = stuff.concat(arrayify(styles));
            },

            renderText: renderTextCall,
            attach: function attach() {
                var head = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                if (elem !== null) {
                    return;
                }

                if (head === null) {
                    head = document.head;
                }

                elem = document.createElement("style");
                Object.keys(attr).forEach(function (name) {
                    return elem.setAttribute(name, attr[name]);
                });
                elem.innerHTML = renderTextCall(true);
                head.appendChild(elem);
            },
            remove: function remove() {
                if (elem === null) {
                    return;
                }

                elem.parentNode.removeChild(elem);
                elem = null;
            },

            get attrs() {
                return attr;
            }
        };
    };

    if (typeof window !== 'undefined') {
        window.ssjs = {
            create: Sheet
        };
    }
    if (typeof module !== 'undefined') {
        module.exports = {
            create: Sheet
        };
    }
})();
