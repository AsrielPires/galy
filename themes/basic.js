"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galy = exports.item = exports.stack = void 0;
const galhui_1 = require("galhui");
const style_1 = require("galhui/style");
const stack = ({ brd }) => ({
    "._.stack": {
        height: "100%",
        display: "flex",
        hr: {
            flex: "0 0",
            border: "none",
        },
        "&.h": {
            hr: { borderLeft: (0, style_1.border)(brd, 4), },
        },
        "&.v": {
            flexDirection: "column",
            hr: { borderTop: (0, style_1.border)(brd, 4), },
        },
        "*": { margin: 0, borderRadius: 0 }
    },
});
exports.stack = stack;
function item(ctx) {
    return {
        [(0, galhui_1.cc)("l-i" /* item */)]: {
            // ...col,
            ["." + "hd" /* head */]: {}
        },
    };
}
exports.item = item;
function galy(ctx) {
    ctx(exports.stack)(item);
    return {
        "._.galy": {
            height: "100%",
            ["." + "l" /* left */]: {},
            ["." + "r" /* right */]: {},
            ["." + "b" /* bottom */]: {},
        },
    };
}
exports.galy = galy;
