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

const renderCSS = ([selector, valueBase], options = {}, depth = 0) => {
    const {tab = "    ", newline = "\n", spacer = " "} = options;
    const tabString = tab.repeat(depth);

    const parts = [];

    if (Array.isArray(valueBase) === true) {
        parts.push(`${tabString}${selector}${spacer}{`);
        parts.push(...valueBase.map(
            value => renderCSS(value, options, depth + 1)
        ));
        parts.push(`${tabString}}`);
    }
    else {
        const value = getCSSValue(valueBase, selector);
        const name = getCSSName(selector);
        if (value !== null) {
            const selectors = getPrefixedSelector(name);
            for (const _name of selectors) {
                for (const _value of value) {
                    parts.push(`${tabString}${_name}:${spacer}${_value};`);
                }
            }
        }
    }

    return parts.join(newline);
};
const getPrefixedSelector = selector => (prefixMap[selector] || [""])
    .map(prefix => `${prefix}${selector}`);
const getCSSName = name => name.replace(
    /[A-Z]/g,
    (s) => `-${s.toLowerCase()}`
);
const getCSSValue = (value, name) => {
    if (value === null || value === undefined) {
        return null;
    }

    if (value.toCSS !== undefined) {
        return [value.toCSS()];
    }

    if (Array.isArray(value) === true) {
        return value.map(
            val => getCSSValue(val, name)
        );
    }

    return [value];
};

const testSource = {
    test: {
        a: 1,
        b: 0,
        "&[c]": {
            d: 'e',
            userSelect: "none"
        },
        wat: {
            toCSS: () => "hi"
        },
        from: {
            "zero": "to 100"
        }
    },
    "@media": {
        "@keyframes test": {
            from: {
                opacity: 0
            },
            to: {
                opacity: 1
            }
        }
    }
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

const prepped = prepObj(testSource);
console.log(
    JSON.stringify(prepped, null, '  ')
);
console.log(
    prepped.map(
        decl => renderCSS(decl)
    ).join("\n")
);
