var ssjs = (function () {
    'use strict';

    const cssNoMeasurement = new Set([
        "animation-iteration-count",
        "box-flex",
        "box-flex-group",
        "box-ordinal-group",
        "column-count",
        "fill-opacity",
        "flex",
        "flex-grow",
        "flex-positive",
        "flex-shrink",
        "flex-negative",
        "flex-order",
        "font-weight",
        "line-clamp",
        "line-height",
        "opacity",
        "order",
        "orphans",
        "stop-opacity",
        "stroke-dashoffset",
        "stroke-opacity",
        "stroke-width",
        "tab-size",
        "widows",
        "z-index",
        "zoom"
    ]);
    const cssPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""];
    const prefixMap = ["user-select"].reduce(
        (prefixes, name) => ({
            ...prefixes,
            [name]: cssPrefixes
        }),
        {}
    );

    const renderCSS = ([selector, valueBase], tab, depth, theme) => {
        const tabString = tab.repeat(depth);

        const parts = [];

        if (Array.isArray(valueBase) === true) {
            parts.push(`${tabString}${selector} {`);
            parts.push(...valueBase.map(
                value => renderCSS(value, tab, depth + 1, theme)
            ));
            parts.push(`${tabString}}`);
        }
        else {
            const value = getCSSValue(valueBase, selector, theme);
            const name = getCSSName(selector);
            if (value !== null) {
                const selectors = getPrefixedSelector(name);
                for (const _name of selectors) {
                    for (const _value of value) {
                        parts.push(`${tabString}${_name}: ${_value};`);
                    }
                }
            }
        }

        return parts.join("\n");
    };
    const getPrefixedSelector = selector => (prefixMap[selector] || [""])
        .map(prefix => `${prefix}${selector}`);
    const getCSSName = name => name.replace(
        /[A-Z]/g,
        (s) => `-${s.toLowerCase()}`
    );
    const getCSSValue = (value, name, theme) => {
        if (value === null || value === undefined) {
            return null;
        }

        if (typeof value === "function") {
            return getCSSValue(value(theme), name, theme);
        }

        if (Array.isArray(value) === true) {
            return value.map(
                val => getCSSValue(val, name, theme)
            );
        }

        if (value.toCSS !== undefined) {
            return [value.toCSS()];
        }

        if (typeof value === "number" && cssNoMeasurement.has(name) === false) {
            return [`${value}px`];
        }

        return [value];
    };

    const prepObj = (obj, parent = "", current = [], top = []) => {
        for (const [selectorBase, value] of Object.entries(obj)) {
            const selector = selectorBase.replace(/&/g, parent);

            if (parent === "" || selectorBase.indexOf("&") !== -1) {
                const items = [];
                top.push([selector, items]);
                prepObj(value, selector, items, top);
            }
            else {
                if (typeof value === "object" && value.toCSS === undefined) {
                    const items = [];
                    current.push([selector, items]);
                    prepObj(value, selector, items, top);
                }
                else {
                    current.push([selector, value]);
                }
            }
        }

        return top;
    };
    const lerp = (from, to, by) => from + ((to - from) * by);
    const sumsq = values => values.reduce((total, n) => total + (n ** 2), 0);
    const blendValues = values => Math.sqrt(sumsq(values) / values.length);
    const color = (r, g, b, a = 1) => ({
        get r() {return r},
        get g() {return g},
        get b() {return b},
        get a() {return a},
        opacity: alpha => color(r, g, b, alpha),
        invert: () => color(255 - r, 255 - g, 255 - b, a),
        darken: factor => color(
            lerp(r, 0, factor)|0,
            lerp(g, 0, factor)|0,
            lerp(b, 0, factor)|0,
            a
        ),
        lighten: factor => color(
            lerp(r, 255, factor)|0,
            lerp(g, 255, factor)|0,
            lerp(b, 255, factor)|0,
            a
        ),
        toCSS: () => `rgba(${r}, ${g}, ${b}, ${a})`
    });
    color.fromHex = hex => {
        if (hex.startsWith("#") === true) {
            hex = hex.slice(1);
        }
        const [r, g, b, a] = (hex.length <= 4)
            ? [
                parseInt(hex.slice(0, 1).repeat(2), 16),
                parseInt(hex.slice(1, 2).repeat(2), 16),
                parseInt(hex.slice(2, 3).repeat(2), 16),
                parseInt(hex.slice(3, 4).repeat(2) || "FF", 16) / 255,
            ]
            : [
                parseInt(hex.slice(0, 2), 16),
                parseInt(hex.slice(2, 4), 16),
                parseInt(hex.slice(4, 6), 16),
                parseInt(hex.slice(6, 8) || "FF", 16) / 255,
            ];

        return color(r, g, b, a);
    };
    color.blend = (...colors) => color(
        blendValues(colors.map(c => c.r))|0,
        blendValues(colors.map(c => c.g))|0,
        blendValues(colors.map(c => c.b))|0,
        blendValues(colors.map(c => c.a))
    );

    const initUpdate = (attrs) => {
        if (typeof window !== "undefined") {
            const element = document.createElement("style");

            for (const [attr, value] of Object.entries(attrs)) {
                element.setAttribute(attr, value);
            }

            document.querySelector("head").appendChild(element);

            return css => {
                element.innerHTML = css;
                return css;
            };
        }

        return css => css;
    };
    const sheet = (styles, attrs = {}) => {
        const cssSource = prepObj(styles);

        const update = initUpdate(attrs);

        return {
            generate: (theme, tab = "    ") => update(
                cssSource
                    .map(decl => renderCSS(decl, tab, 0, theme))
                    .join("\n")
            )
        };
    };

    sheet.color = color;

    return sheet;

}());
