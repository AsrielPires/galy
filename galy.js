"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.col = exports.row = exports.stack = exports.itab = exports.icol = exports.irow = exports.ibox = exports.divisor = exports.Ctx = exports.defineSize = void 0;
const galho_1 = require("galho");
const s_1 = require("galho/s");
const galhui_1 = require("galhui");
const inutil_1 = require("inutil");
const orray_1 = require("orray");
function defineSize(items, apply) {
    let size = 0, l = items.length, sizes = [];
    for (let i of items) {
        let s = i.sz;
        if ((s || (s = 0)) > 95)
            s = 95;
        else if (s === 0)
            s = 100 / l;
        sizes.push(s);
        size += s;
    }
    let result = sizes.map(s => s * 100 / size);
    if (apply)
        for (let i = 0; i < l; i++)
            items[i].sz = result[i];
    return result;
}
exports.defineSize = defineSize;
class Ctx extends galho_1.E {
    constructor(i, root) {
        super(i);
        this.root = this.item(root);
        i.left && (i.left = (0, orray_1.orray)(i.left));
        i.right && (i.right = (0, orray_1.orray)(i.right));
        i.bottom && (i.bottom = (0, orray_1.orray)(i.bottom));
    }
    view() {
        let { left, right, bottom } = this.i;
        return (0, galho_1.div)("_ galy", [
            left && (0, galho_1.div)("l"),
            this.root,
            right && (0, galho_1.div)("r"),
            bottom && (0, galho_1.div)("b"),
        ]);
    }
    change() {
        if (!this.ignoreChange) {
            if ((0, inutil_1.t)(this.i.compress)) {
                this.ignoreChange = true;
                this.root.compress();
                this.ignoreChange = false;
            }
            this.emit("change");
        }
    }
    prots(key) {
        let t = this.i.boxes[key];
        if (!t)
            throw (0, inutil_1.notF)(key, null, "prototypes");
        return t;
    }
    item(item) {
        switch (item.tp) {
            case "s" /* stack */:
                return new Stack(this, item);
            case "t" /* tab */:
                return new Tab(this, item);
            case "i" /* box */:
                return new Box(this, item.base ? (0, inutil_1.extend)(item, this.prots(item.base)) : item);
        }
    }
}
exports.Ctx = Ctx;
class Stack {
    constructor(ctx, i) {
        this.ctx = ctx;
        this.i = i;
        i.$ = this;
    }
    render() {
        let { list, o } = this.i, ctx = this.ctx;
        return (0, orray_1.bind)((0, orray_1.orray)(list, v => (0, inutil_1.isA)(v) ? v : [100 / (0, inutil_1.l)(list), v]), (0, galho_1.div)(["_", "stack", o]), {
            insert([sz, item], index, s) {
                s.place(index && index * 2 - 1, [
                    //dupla negação para não inserir 0
                    !!index && divisor("h", (l, r) => {
                        this[index - 1][0] = l;
                        this[index][0] = r;
                        ctx.change();
                    }),
                    (0, galho_1.g)(ctx.item(item)).css(o == "h" ? "width" : "height", `${sz}%`)
                ]);
            },
            remove: (_, index, parent) => {
                if (index)
                    parent.childs(index * 2 - 1, index * 2 + 1).remove();
                else
                    parent.childs(0, 2).remove();
            }
        });
    }
    compress() {
        let { list, persist: p } = this.i, _l = (0, inutil_1.l)(list);
        if (!_l) {
            if (!p)
                return null;
        }
        else if (_l == 1)
            return list[0][1];
        else
            for (let i = 0; i < _l; i++) {
                let t0 = list[i], t = t0[1].$.compress();
                switch (t) {
                    case null:
                        //TODO: remove from context
                        list.removeAt(i--);
                        break;
                    case undefined:
                        break;
                    default:
                        (0, orray_1.replace)(list, t0, [t0[0], t]);
                }
            }
    }
}
function divisor(o, endcallback) {
    let hr = (0, galho_1.g)('hr', "l-d" /* divisor */);
    return hr.on('mousedown', function () {
        let parent = hr.parent(), parentRect = (0, s_1.rect)(parent), prev = hr.prev(), next = hr.next(), l, r, div = galhui_1.$.lyDivW / 2, clamp = (value, min, max) => value < min ? min : value > max ? max : value, trigger = () => {
            let e = new Event("resize", { bubbles: true });
            prev.emit(e);
            next.emit(e);
        };
        function moveEventX(e) {
            let p = parentRect.width * 0.05;
            l = clamp(e.clientX - parentRect.left, p, parentRect.left - p);
            prev.css('width', `calc(${(l = l / parentRect.width * 100)}% - ${div}px)`);
            next.css('width', `calc(${(r = 100 - l)}% - ${div}px)`);
            trigger();
        }
        function moveEventY(e) {
            let p = parentRect.height * 0.05;
            l = clamp(e.clientX - parentRect.top, p, parentRect.top - p);
            prev.css('height', `calc(${(l = l / parentRect.height * 100)}% - ${div}px)`);
            next.css('height', `calc(${(r = 100 - l)}% - ${div}px)`);
            trigger();
        }
        galhui_1.body.css({ cursor: 'col-resize', userSelect: "none" });
        let t = o == "h" ? moveEventX : moveEventY;
        galhui_1.doc
            .on('mousemove', t)
            .one('mouseup', () => {
            galhui_1.body.uncss(["cursor", "userSelect"]);
            galhui_1.doc.off('mousemove', t);
            endcallback === null || endcallback === void 0 ? void 0 : endcallback(l, r);
        });
    });
}
exports.divisor = divisor;
class Tab {
    constructor(ctx, i) {
        this.i = i;
        i.$ = this;
    }
    render() {
        let i = this.i, list = i.list;
        return (0, galho_1.div)("_ tab", [
            (0, orray_1.bind)(list, (0, galho_1.div)("hd" /* head */), {
                tag: (v, a) => v.cls("on" /* on */, a),
                insert: box => box.$.head().cls("i" /* item */)
                    .add((0, galhui_1.close)(e => { e.stopPropagation(); (0, orray_1.remove)(list, box); }))
                    .on('click', () => (0, orray_1.setTag)(list, "on", box))
            }),
            (0, inutil_1.call)((0, galho_1.div)("bd" /* body */), b => {
                var _a;
                let cb = (v) => {
                    var _a;
                    b.attr("id", false).uncls().cls("bd" /* body */);
                    if (v) {
                        b.set(v.$.render(true));
                        //v.$.focus?.(b);
                    }
                    else
                        b.set((_a = i.empty) === null || _a === void 0 ? void 0 : _a.call(i));
                };
                (0, orray_1.ontag)(list, "on" /* on */, cb);
                cb((_a = (0, orray_1.getTag)(list, "on" /* on */)) === null || _a === void 0 ? void 0 : _a.value);
            }),
        ]);
    }
    compress() {
        let { list, persist: p } = this.i;
        if (!list) {
            if (!p)
                return null;
        }
        else if ((0, inutil_1.l)(list) == 1)
            if (inutil_1.l[0].selfContain)
                return inutil_1.l[0];
    }
}
class Box {
    constructor(ctx, i) {
        this.i = i;
        if (i.def && (0, inutil_1.isU)(i.dt))
            i.dt = i.def();
        i.$ = this;
    }
    render(headerless) {
        let bd = (0, galho_1.wrap)(this.i.render());
        return headerless ? bd.cls("i" /* item */) : (0, galho_1.div)("_ tab", [
            this.head().cls("_ bar"),
            (0, galho_1.div)("bd" /* body */, bd)
        ]);
    }
    head() {
        let i = this.i;
        return (0, galho_1.div)(0, [
            (0, galhui_1.icon)(i.icon),
            (0, inutil_1.lazy)(i.title),
            (0, galhui_1.close)(() => { })
        ]);
    }
    compress() { }
}
/**box interface */
const ibox = (base) => ({ tp: "i" /* box */, base });
exports.ibox = ibox;
/**row interface */
const irow = (...list) => ({ tp: "s" /* stack */, o: "h", list });
exports.irow = irow;
/**col interface */
const icol = (...list) => ({ tp: "s" /* stack */, o: "v", list });
exports.icol = icol;
/**tab interface */
const itab = (...list) => ({ tp: "t" /* tab */, list });
exports.itab = itab;
const stack = (o, list) => (0, galho_1.div)(["_", "stack", o], list.map((v, i) => {
    let [sz, item] = (0, inutil_1.isA)(v) ? v : [100 / (0, inutil_1.l)(list), v];
    return [
        !!i && divisor("h"),
        (0, galho_1.g)(item).css(o == "h" ? "width" : "height", `${sz}%`)
    ];
}));
exports.stack = stack;
const row = (...list) => (0, exports.stack)("h", list);
exports.row = row;
const col = (...list) => (0, exports.stack)("v", list);
exports.col = col;
