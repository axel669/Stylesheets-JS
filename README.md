
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

- [SSJS](#ssjs)
  - [API](#api)
    - [`ssjs.create(styles, attributes)`](#ssjscreatestyles-attributes)
      - [`styles`](#styles)
        - [Example](#example)
      - [`attributes`](#attributes)
    - [`StyleSheet.generate(theme[, tab])`](#stylesheetgeneratetheme-tab)
      - [`theme`](#theme)
      - [`tab`](#tab)

<!-- /code_chunk_output -->
# SSJS
Small lib to create stylesheets using pure js on client &amp; server side

## API

### `ssjs.create(styles, attributes)`
```
ssjs.create(styles, attributes) -> StyleSheet
```

#### `styles`
An object containing the styles to generate. Uses the same form as React
styles.

The styles object can contain nested values to allow reuse of branching styles.
A style key can reference the fully expanded parent key using `&`.

##### Example
```javascript
// theme
{
    button: {
        secondary: {
            disabled: {
                color: "gray",
            },
        },
    },
}

// styles
{
    "button": {
        padding: 8,
        "&.primary": {
            backgroundColor: "blue",
            "&[flat]": {
                backgroundColor: "white",
                color: "blue",
            },
        },
        "&.secondary": {
            backgroundColor: "green",
            "&[flat], &[disabled]": {
                backgroundColor: "white",
                color: theme => theme.button.secondary.disabled.color,
            },
        },
    },
}
```
generates the following CSS
```css
button {
    padding: 8px;
}
button.primary {
    background-color: blue;
}
button.primary[flat] {
    background-color: white;
    color: blue;
}
button.secondary {
    background-color: green;
}
button.secondary[flat], button.secondary[disabled] {
    background-color: white;
    color: gray;
}
```

#### `attributes`
Attributes to attach to the style tag generated.

### `StyleSheet.generate(theme[, tab])`
```
StyleSheet.generate(theme, tab = "    ")
```

#### `theme`
An object containing the values to use for the theme.

#### `tab`
The character(s) to use for tabbing nested css. Defaults to 4 spaces.
