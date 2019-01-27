import tea from "@axel669/teascript/rollup";

export default {
    input: "src/ssjs.tea",
    output: [
        {
            file: "standalone/ss.js",
            format: "iife",
            name: "SSJS"
        },
        {
            file: "ss.js",
            format: "cjs"
        },
        {
            file: "es6/ss.js",
            format: "esm"
        }
    ],
    plugins: [
        tea({
            include: ["src/**.tea"]
        })
    ]
};
