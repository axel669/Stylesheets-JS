export default {
    input: "src/ss.js",
    output: [
        {
            file: "standalone/ss.js",
            format: "iife",
            name: "ssjs"
        },
        {
            file: "index.js",
            format: "cjs"
        },
        {
            file: "esm/index.js",
            format: "esm"
        }
    ]
};
