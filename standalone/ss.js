var SSJS = (function () {
    'use strict';

    var nullref0, ref0;
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
    const cssPrefixed = new Set(["userSelect"]);
    const cssPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ``];
    const processValue = (key, value) => {
        const type = typeof value;
        if (type === "string") {
            return value;
        }
        if (type === "number" && cssNoMeasurement.has(key) === false) {
            return `${value}px`;
        }
        if (Array.isArray(value) === true) {
            return value.map((val) => cssValue(key, val));
        }
        return value;
    };
    const genParts = (css, theme, parent = ``, depth = -1) => {
        var ref0;

        const parts = [];
        const tabs = "    ".repeat(Math.max(0, depth));
        const innerTabs = "    ".repeat(depth + 1);
        const attachments = [];
        if (parent !== ``) {
            parts.push(`${tabs}${parent} {`);
        }
        for (const key of Object.keys((ref0 = css))) {
            const value = ref0[key];
            switch (true) {
                case key.indexOf("&") !== -1:
                    attachments.push(
                        genParts(value, theme, key.replace(/&/g, parent), depth)
                    );
                    break;
                case typeof value === "object" && Array.isArray(value) === false:
                    parts.push(genParts(value, theme, key, depth + 1));
                    break;
                default: {
                    const keyStr = key.replace(
                        /[A-Z]/g,
                        (letter) => `-${letter.toLowerCase()}`
                    );
                    const rawValue =
                        typeof value === "function" ? value(theme) : value;
                    const cssValue = processValue(key, rawValue);
                    switch (true) {
                        case cssPrefixed.has(key) === true:
                            for (const prefix of cssPrefixes) {
                                parts.push(
                                    `${innerTabs}${prefix}${keyStr}: ${cssValue};`
                                );
                            }
                            break;
                        case Array.isArray(cssValue) === true:
                            for (const value of cssValue) {
                                parts.push(`${innerTabs}${keyStr}: ${value};`);
                            }
                            break;
                        default:
                            parts.push(`${innerTabs}${keyStr}: ${cssValue};`);
                    }
                }
            }
        }
        if (parent !== ``) {
            parts.push(`${tabs}}`);
        }
        parts.push(...attachments);
        return parts.join("\n");
    };
    const Sheet = (() => {
        const construct = function construct(css, attr) {
            const self = {};
            const publicAPI = {};
            Object.defineProperties(publicAPI, {
                generate: {
                    configurable: false,
                    get: () => (theme) => {
                        self.elem.innerHTML = genParts(self.css, theme);
                    }
                }
            });
            Object.defineProperties(self, {});
            Object.defineProperties(
                self,
                Object.getOwnPropertyDescriptors(publicAPI)
            );
            Object.defineProperties(publicAPI, {});
            self.css = css;
            self.elem = document.createElement("style");
            const attributes = (nullref0 = attr) != null ? nullref0 : {};
            for (const key of Object.keys((ref0 = attributes))) {
                const value = ref0[key];
                self.elem.setAttribute(key, value);
            }
            document.querySelector("head").appendChild(self.elem);
            return publicAPI;
        };
        return (...args) => construct.apply({}, args);
    })();

    return Sheet;

}());
