(() => {
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
    const cssPrefixNames = new Set([
        'userSelect'
    ]);
    const cssPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
    const cssValueString = (key, value) => {
        if (_typeof(value) === 'function') {
            value = value();
        }
        if (_typeof(value) === 'number' && cssNoMeasurement.has(key) === false) {
            value = `${value}px`;
        }
        return value;
    };

    const _typeof = new Function('obj', 'return typeof obj');
    const arrayify = (obj) => Object.keys(obj)
        .map(key => {
            let value = obj[key];

            if (_typeof(value) === 'object' && Array.isArray(value) == false) {
                value = arrayify(value, false);
                return {key, value};
            }

            return {name: key, value};
        });
    const renderTextIndented = (item, indent = 0) => {
        const tabs = '  '.repeat(indent);
        let lines = [];

        const key = item.key;
        const name = item.name;
        const value = item.value;

        if (key !== undefined) {
            lines.push(`${tabs}${key} {`);
            value.forEach(
                val => lines = lines.concat(renderTextIndented(val, indent + 1))
            );
            lines.push(tabs + "}");
        }
        else {
            const displayName = name.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`);
            if (Array.isArray(value) === true) {
                value.forEach(
                    val => lines.push(`${tabs}${displayName}: ${cssValueString(name, val)};`)
                );
            }
            else {
                const cssVal = cssValueString(name, value);
                if (cssPrefixNames.has(name) === true) {
                    cssPrefixes.forEach(
                        prefix => lines.push(`${tabs}${prefix}${displayName}: ${cssVal};`)
                    );
                }
                else {
                    lines.push(`${tabs}${displayName}: ${cssVal};`);
                }
            }
        }

        return lines.join('\n');
    }
    const renderText = (item) => {
        let lines = [];

        const key = item.key;
        const name = item.name;
        const value = item.value;

        if (key !== undefined) {
            lines.push(`${key}{`);
            value.forEach(
                val => lines = lines.concat(renderText(val))
            );
            lines.push("}");
        }
        else {
            const displayName = name.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`);
            if (Array.isArray(value) === true) {
                value.forEach(
                    val => lines.push(`${displayName}:${cssValueString(name, val)};`)
                );
            }
            else {
                const cssVal = cssValueString(name, value);
                if (cssPrefixNames.has(name) === true) {
                    cssPrefixes.forEach(
                        prefix => lines.push(`${prefix}${displayName}: ${cssVal};`)
                    );
                }
                else {
                    lines.push(`${displayName}: ${cssVal};`);
                }
            }
        }

        return lines.join('');
    }

    const Sheet = () => {
        let stuff = [];
        let elem = null;
        const attr = {};

        const renderTextCall = (useIndent = false) => {
            if (useIndent === true) {
                return stuff
                    .map(thing => renderTextIndented(thing))
                    .join('\n');
            }
            return stuff.map(renderText).join('');
        };

        return {
            addStyles(styles) {
                stuff = stuff.concat(
                    arrayify(styles)
                );
            },
            renderText: renderTextCall,
            attach(head = null) {
                if (elem !== null) {
                    return;
                }

                if (head === null) {
                    head = document.head;
                }

                elem = document.createElement("style");
                Object.keys(attr).forEach(
                    name => elem.setAttribute(name, attr[name])
                );
                elem.innerHTML = renderTextCall(true);
                head.appendChild(elem);
            },
            remove() {
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
