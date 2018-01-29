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
        'transform',
        'transformOrigin',
        'boxShadow',
        'transition',
        'animation',
        'animationDelay',
        'animationDirection',
        'animationDuration',
        'animationFillMode',
        'animationIterationCount',
        'animationName',
        'animationPlayState',
        'animationTimingFunction',
        'userSelect',
        'justifyContent',
        'alignItems',
        'flexWrap',
    ]);
    const cssPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
    const cssValueString = (item) => {
        const key = item[0];
        let value = item[1];
        if (_typeof(value) === 'function') {
            value = value();
        }
        if (_typeof(value) === 'number' && cssNoMeasurement.has(key) === false) {
            value = `${value}px`;
        }
        return [key, value];
    };

    const _typeof = new Function('obj', 'return typeof obj');
    const arrayify = (obj) => Object.keys(obj)
        .map(key => {
            let value = obj[key];

            if (_typeof(value) === 'object' && Array.isArray(value) == false) {
                value = arrayify(value, false);
            }

            return [key, value];
        });
    const renderTextIndented = (value, indent = 0) => {
        const tabs = '  '.repeat(indent);
        let lines = [];

        const key = value[0];
        const val = value[1];
        const lineVals = (Array.isArray(value) === true) ? value : [value];

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
    }

    const Sheet = () => {
        let stuff = [];
        return {
            addStyles(styles) {
                stuff = stuff.concat(
                    arrayify(styles)
                );
            },
            renderText(useIndent = false) {
                if (useIndent === true) {
                    return renderTextIndented(stuff).join('\n');
                }
                return null;
            },
            attach(head = null) {
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
