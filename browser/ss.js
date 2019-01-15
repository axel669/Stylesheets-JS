var SSJS = (function () {
    'use strict';

    const cssNoMeasurement = new Set([
        "animationIterationCount",
        "boxFlex",
        "boxFlexGroup",
        "boxOrdinalGroup",
        "columnCount",
        "fillOpacity",
        "flex",
        "flexGrow",
        "flexPositive",
        "flexShrink",
        "flexNegative",
        "flexOrder",
        "fontWeight",
        "lineClamp",
        "lineHeight",
        "opacity",
        "order",
        "orphans",
        "stopOpacity",
        "strokeDashoffset",
        "strokeOpacity",
        "strokeWidth",
        "tabSize",
        "widows",
        "zIndex",
        "zoom"
    ]);
    const cssPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ``];
    const prefixMap = ["userSelect"].reduce(
        (prefixes, name) => ({
            ...prefixes,
            [name]: cssPrefixes
        }),
        {}
    );
    const cssValueString = (key, value) => {
        const type = typeof value;
        if (type === "function") {
            return value();
        }
        if (type === "number" && cssNoMeasurement.has(key) === false) {
            return `${value}px`;
        }
        return value;
    };
    const arrayify = (obj) =>
        Object.keys(obj).map((key) => {
            let value = obj[key];
            if (typeof value === "object" && Array.isArray(value) === false) {
                value = arrayify(value);
                return {
                    key: key,
                    value: value
                };
            }
            return {
                name: key,
                value: value
            };
        });
    const renderText = (cssItem, options) => {
        var nullref0;

        const tab = options.tab.repeat(options.indent);
        const parts = [];
        const { split } = options;
        const { key, name, value } = cssItem;
        if (key !== undefined) {
            parts.push(`${tab}${key}${split}{`);
            for (const val of value) {
                parts.push(
                    renderText(val, {
                        ...options,
                        indent: options.indent + 1
                    })
                );
            }
            parts.push(`${tab}}`);
        } else {
            const displayName = name.replace(
                /[A-Z]/g,
                (match) => `-${match.toLowerCase()}`
            );
            if (Array.isArray(value) === true) {
                for (const valueItem of value) {
                    const cssValue = cssValueString(name, valueItem);
                    parts.push(`${tab}${displayName}:${split}${cssValue};`);
                }
            } else {
                const cssValue = cssValueString(name, value);
                const prefixes =
                    (nullref0 = prefixMap[name]) != null ? nullref0 : [``];
                for (const prefix of prefixes) {
                    parts.push(
                        `${tab}${prefix}${displayName}:${split}${cssValue};`
                    );
                }
            }
        }
        return parts.join(options.join);
    };
    renderText.min = (items) =>
        items
            .map((item) =>
                renderText(item, {
                    split: ``,
                    join: ``,
                    tab: ``,
                    indent: 0
                })
            )
            .join(``);
    renderText.normal = (items, tab = "    ") =>
        items
            .map((item) =>
                renderText(item, {
                    split: " ",
                    join: "\n",
                    tab: tab,
                    indent: 0
                })
            )
            .join("\n");
    const Sheet = (() => {
        const construct = function construct() {
            const self = {};
            const publicAPI = {};
            Object.defineProperties(publicAPI, {
                addStyles: {
                    configurable: false,
                    get: () => (styles) => {
                        self.entries.push(...arrayify(styles));
                    }
                },
                attach: {
                    configurable: false,
                    get: () => (renderStyle = "normal") => {
                        var ref0;

                        if (self.element !== null) {
                            return;
                        }
                        self.element = document.createElement("style");
                        for (const name of Object.keys((ref0 = self.attributes))) {
                            const attrValue = ref0[name];
                            self.element.setAttribute(name, attrValue);
                        }
                        self.element.innerHTML = renderText[renderStyle](
                            self.entries
                        );
                        document.head.appendChild(self.element);
                    }
                },
                render: {
                    configurable: false,
                    get: () => (renderStyle = "normal") =>
                        renderText[renderStyle](self.entries)
                }
            });
            Object.defineProperties(self, {});
            Object.defineProperties(
                self,
                Object.getOwnPropertyDescriptors(publicAPI)
            );
            Object.defineProperties(publicAPI, {
                attr: {
                    configurable: false,
                    get: () => self.attributes
                }
            });
            self.element = null;
            self.entries = [];
            self.attributes = {};
            return publicAPI;
        };
        return (...args) => construct.apply({}, args);
    })();
    var ssjs = {
        create: Sheet
    };

    return ssjs;

}());
