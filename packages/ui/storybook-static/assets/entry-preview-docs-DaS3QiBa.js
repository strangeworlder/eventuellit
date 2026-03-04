import {
  g as aa,
  n as be,
  l as ca,
  q as da,
  m as fa,
  T as Gr,
  j as ha,
  S as la,
  e as na,
  d as Os,
  h as oa,
  o as pa,
  p as ri,
  c as sa,
  k as Ur,
  i as ua,
  f as Vs,
} from "./_getPrototype-CQ77erXj.js";
import { d as ga } from "./index-DrFu-skq.js";
import { g as Dt, R as Jt, r as kt, c as ma } from "./index-mTzoL55G.js";

var Ni = { exports: {} },
  Li,
  Wr;
function xa() {
  if (Wr) return Li;
  Wr = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return (Li = e), Li;
}
var Ri, zr;
function va() {
  if (zr) return Ri;
  zr = 1;
  var e = xa();
  function i() {}
  function r() {}
  return (
    (r.resetWarningCache = i),
    (Ri = () => {
      function n(d, g, x, _, C, k) {
        if (k !== e) {
          var A = new Error(
            "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
          );
          throw ((A.name = "Invariant Violation"), A);
        }
      }
      n.isRequired = n;
      function o() {
        return n;
      }
      var f = {
        array: n,
        bigint: n,
        bool: n,
        func: n,
        number: n,
        object: n,
        string: n,
        symbol: n,
        any: n,
        arrayOf: o,
        element: n,
        elementType: n,
        instanceOf: o,
        node: n,
        objectOf: o,
        oneOf: o,
        oneOfType: o,
        shape: o,
        exact: o,
        checkPropTypes: r,
        resetWarningCache: i,
      };
      return (f.PropTypes = f), f;
    }),
    Ri
  );
}
var Hr;
function ya() {
  return Hr || ((Hr = 1), (Ni.exports = va()())), Ni.exports;
}
var ba = ya();
const Qr = Dt(ba),
  Sa = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "math",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "script",
    "search",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
  ];
var Oi, Kr;
function _a() {
  return Kr || ((Kr = 1), (Oi = Sa)), Oi;
}
var Ca = _a();
const Ea = Dt(Ca);
var Vi = {},
  Fi = {},
  Xr;
function wa() {
  return (
    Xr ||
      ((Xr = 1),
      ((e) => {
        (function i(r) {
          var n, o, f, d, g, x;
          function _(y) {
            var h = {},
              I,
              V;
            for (I in y)
              Object.hasOwn(y, I) &&
                ((V = y[I]), typeof V == "object" && V !== null ? (h[I] = _(V)) : (h[I] = V));
            return h;
          }
          function C(y, h) {
            var I, V, Q, H;
            for (V = y.length, Q = 0; V; )
              (I = V >>> 1), (H = Q + I), h(y[H]) ? (V = I) : ((Q = H + 1), (V -= I + 1));
            return Q;
          }
          (n = {
            AssignmentExpression: "AssignmentExpression",
            AssignmentPattern: "AssignmentPattern",
            ArrayExpression: "ArrayExpression",
            ArrayPattern: "ArrayPattern",
            ArrowFunctionExpression: "ArrowFunctionExpression",
            AwaitExpression: "AwaitExpression",
            BlockStatement: "BlockStatement",
            BinaryExpression: "BinaryExpression",
            BreakStatement: "BreakStatement",
            CallExpression: "CallExpression",
            CatchClause: "CatchClause",
            ChainExpression: "ChainExpression",
            ClassBody: "ClassBody",
            ClassDeclaration: "ClassDeclaration",
            ClassExpression: "ClassExpression",
            ComprehensionBlock: "ComprehensionBlock",
            ComprehensionExpression: "ComprehensionExpression",
            ConditionalExpression: "ConditionalExpression",
            ContinueStatement: "ContinueStatement",
            DebuggerStatement: "DebuggerStatement",
            DirectiveStatement: "DirectiveStatement",
            DoWhileStatement: "DoWhileStatement",
            EmptyStatement: "EmptyStatement",
            ExportAllDeclaration: "ExportAllDeclaration",
            ExportDefaultDeclaration: "ExportDefaultDeclaration",
            ExportNamedDeclaration: "ExportNamedDeclaration",
            ExportSpecifier: "ExportSpecifier",
            ExpressionStatement: "ExpressionStatement",
            ForStatement: "ForStatement",
            ForInStatement: "ForInStatement",
            ForOfStatement: "ForOfStatement",
            FunctionDeclaration: "FunctionDeclaration",
            FunctionExpression: "FunctionExpression",
            GeneratorExpression: "GeneratorExpression",
            Identifier: "Identifier",
            IfStatement: "IfStatement",
            ImportExpression: "ImportExpression",
            ImportDeclaration: "ImportDeclaration",
            ImportDefaultSpecifier: "ImportDefaultSpecifier",
            ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
            ImportSpecifier: "ImportSpecifier",
            Literal: "Literal",
            LabeledStatement: "LabeledStatement",
            LogicalExpression: "LogicalExpression",
            MemberExpression: "MemberExpression",
            MetaProperty: "MetaProperty",
            MethodDefinition: "MethodDefinition",
            ModuleSpecifier: "ModuleSpecifier",
            NewExpression: "NewExpression",
            ObjectExpression: "ObjectExpression",
            ObjectPattern: "ObjectPattern",
            PrivateIdentifier: "PrivateIdentifier",
            Program: "Program",
            Property: "Property",
            PropertyDefinition: "PropertyDefinition",
            RestElement: "RestElement",
            ReturnStatement: "ReturnStatement",
            SequenceExpression: "SequenceExpression",
            SpreadElement: "SpreadElement",
            Super: "Super",
            SwitchStatement: "SwitchStatement",
            SwitchCase: "SwitchCase",
            TaggedTemplateExpression: "TaggedTemplateExpression",
            TemplateElement: "TemplateElement",
            TemplateLiteral: "TemplateLiteral",
            ThisExpression: "ThisExpression",
            ThrowStatement: "ThrowStatement",
            TryStatement: "TryStatement",
            UnaryExpression: "UnaryExpression",
            UpdateExpression: "UpdateExpression",
            VariableDeclaration: "VariableDeclaration",
            VariableDeclarator: "VariableDeclarator",
            WhileStatement: "WhileStatement",
            WithStatement: "WithStatement",
            YieldExpression: "YieldExpression",
          }),
            (f = {
              AssignmentExpression: ["left", "right"],
              AssignmentPattern: ["left", "right"],
              ArrayExpression: ["elements"],
              ArrayPattern: ["elements"],
              ArrowFunctionExpression: ["params", "body"],
              AwaitExpression: ["argument"],
              BlockStatement: ["body"],
              BinaryExpression: ["left", "right"],
              BreakStatement: ["label"],
              CallExpression: ["callee", "arguments"],
              CatchClause: ["param", "body"],
              ChainExpression: ["expression"],
              ClassBody: ["body"],
              ClassDeclaration: ["id", "superClass", "body"],
              ClassExpression: ["id", "superClass", "body"],
              ComprehensionBlock: ["left", "right"],
              ComprehensionExpression: ["blocks", "filter", "body"],
              ConditionalExpression: ["test", "consequent", "alternate"],
              ContinueStatement: ["label"],
              DebuggerStatement: [],
              DirectiveStatement: [],
              DoWhileStatement: ["body", "test"],
              EmptyStatement: [],
              ExportAllDeclaration: ["source"],
              ExportDefaultDeclaration: ["declaration"],
              ExportNamedDeclaration: ["declaration", "specifiers", "source"],
              ExportSpecifier: ["exported", "local"],
              ExpressionStatement: ["expression"],
              ForStatement: ["init", "test", "update", "body"],
              ForInStatement: ["left", "right", "body"],
              ForOfStatement: ["left", "right", "body"],
              FunctionDeclaration: ["id", "params", "body"],
              FunctionExpression: ["id", "params", "body"],
              GeneratorExpression: ["blocks", "filter", "body"],
              Identifier: [],
              IfStatement: ["test", "consequent", "alternate"],
              ImportExpression: ["source"],
              ImportDeclaration: ["specifiers", "source"],
              ImportDefaultSpecifier: ["local"],
              ImportNamespaceSpecifier: ["local"],
              ImportSpecifier: ["imported", "local"],
              Literal: [],
              LabeledStatement: ["label", "body"],
              LogicalExpression: ["left", "right"],
              MemberExpression: ["object", "property"],
              MetaProperty: ["meta", "property"],
              MethodDefinition: ["key", "value"],
              ModuleSpecifier: [],
              NewExpression: ["callee", "arguments"],
              ObjectExpression: ["properties"],
              ObjectPattern: ["properties"],
              PrivateIdentifier: [],
              Program: ["body"],
              Property: ["key", "value"],
              PropertyDefinition: ["key", "value"],
              RestElement: ["argument"],
              ReturnStatement: ["argument"],
              SequenceExpression: ["expressions"],
              SpreadElement: ["argument"],
              Super: [],
              SwitchStatement: ["discriminant", "cases"],
              SwitchCase: ["test", "consequent"],
              TaggedTemplateExpression: ["tag", "quasi"],
              TemplateElement: [],
              TemplateLiteral: ["quasis", "expressions"],
              ThisExpression: [],
              ThrowStatement: ["argument"],
              TryStatement: ["block", "handler", "finalizer"],
              UnaryExpression: ["argument"],
              UpdateExpression: ["argument"],
              VariableDeclaration: ["declarations"],
              VariableDeclarator: ["id", "init"],
              WhileStatement: ["test", "body"],
              WithStatement: ["object", "body"],
              YieldExpression: ["argument"],
            }),
            (d = {}),
            (g = {}),
            (x = {}),
            (o = { Break: d, Skip: g, Remove: x });
          function k(y, h) {
            (this.parent = y), (this.key = h);
          }
          (k.prototype.replace = function (h) {
            this.parent[this.key] = h;
          }),
            (k.prototype.remove = function () {
              return Array.isArray(this.parent)
                ? (this.parent.splice(this.key, 1), !0)
                : (this.replace(null), !1);
            });
          function A(y, h, I, V) {
            (this.node = y), (this.path = h), (this.wrap = I), (this.ref = V);
          }
          function P() {}
          (P.prototype.path = function () {
            var h, I, V, Q, H, ee;
            function K(J, he) {
              if (Array.isArray(he)) for (V = 0, Q = he.length; V < Q; ++V) J.push(he[V]);
              else J.push(he);
            }
            if (!this.__current.path) return null;
            for (H = [], h = 2, I = this.__leavelist.length; h < I; ++h)
              (ee = this.__leavelist[h]), K(H, ee.path);
            return K(H, this.__current.path), H;
          }),
            (P.prototype.type = function () {
              var y = this.current();
              return y.type || this.__current.wrap;
            }),
            (P.prototype.parents = function () {
              var h, I, V;
              for (V = [], h = 1, I = this.__leavelist.length; h < I; ++h)
                V.push(this.__leavelist[h].node);
              return V;
            }),
            (P.prototype.current = function () {
              return this.__current.node;
            }),
            (P.prototype.__execute = function (h, I) {
              var V, Q;
              return (
                (Q = void 0),
                (V = this.__current),
                (this.__current = I),
                (this.__state = null),
                h && (Q = h.call(this, I.node, this.__leavelist[this.__leavelist.length - 1].node)),
                (this.__current = V),
                Q
              );
            }),
            (P.prototype.notify = function (h) {
              this.__state = h;
            }),
            (P.prototype.skip = function () {
              this.notify(g);
            }),
            (P.prototype.break = function () {
              this.notify(d);
            }),
            (P.prototype.remove = function () {
              this.notify(x);
            }),
            (P.prototype.__initialize = function (y, h) {
              (this.visitor = h),
                (this.root = y),
                (this.__worklist = []),
                (this.__leavelist = []),
                (this.__current = null),
                (this.__state = null),
                (this.__fallback = null),
                h.fallback === "iteration"
                  ? (this.__fallback = Object.keys)
                  : typeof h.fallback == "function" && (this.__fallback = h.fallback),
                (this.__keys = f),
                h.keys && (this.__keys = Object.assign(Object.create(this.__keys), h.keys));
            });
          function N(y) {
            return y == null ? !1 : typeof y == "object" && typeof y.type == "string";
          }
          function E(y, h) {
            return (y === n.ObjectExpression || y === n.ObjectPattern) && h === "properties";
          }
          function w(y, h) {
            for (var I = y.length - 1; I >= 0; --I) if (y[I].node === h) return !0;
            return !1;
          }
          (P.prototype.traverse = function (h, I) {
            var V, Q, H, ee, K, J, he, _e, ve, ye, oe, we;
            for (
              this.__initialize(h, I),
                we = {},
                V = this.__worklist,
                Q = this.__leavelist,
                V.push(new A(h, null, null, null)),
                Q.push(new A(null, null, null, null));
              V.length;
            ) {
              if (((H = V.pop()), H === we)) {
                if (
                  ((H = Q.pop()), (J = this.__execute(I.leave, H)), this.__state === d || J === d)
                )
                  return;
                continue;
              }
              if (H.node) {
                if (((J = this.__execute(I.enter, H)), this.__state === d || J === d)) return;
                if ((V.push(we), Q.push(H), this.__state === g || J === g)) continue;
                if (((ee = H.node), (K = ee.type || H.wrap), (ye = this.__keys[K]), !ye))
                  if (this.__fallback) ye = this.__fallback(ee);
                  else throw new Error("Unknown node type " + K + ".");
                for (_e = ye.length; (_e -= 1) >= 0; )
                  if (((he = ye[_e]), (oe = ee[he]), !!oe)) {
                    if (Array.isArray(oe)) {
                      for (ve = oe.length; (ve -= 1) >= 0; )
                        if (oe[ve] && !w(Q, oe[ve])) {
                          if (E(K, ye[_e])) H = new A(oe[ve], [he, ve], "Property", null);
                          else if (N(oe[ve])) H = new A(oe[ve], [he, ve], null, null);
                          else continue;
                          V.push(H);
                        }
                    } else if (N(oe)) {
                      if (w(Q, oe)) continue;
                      V.push(new A(oe, he, null, null));
                    }
                  }
              }
            }
          }),
            (P.prototype.replace = function (h, I) {
              var V, Q, H, ee, K, J, he, _e, ve, ye, oe, we, Ne;
              function pt(W) {
                var je, dt, qe, me;
                if (W.ref.remove()) {
                  for (dt = W.ref.key, me = W.ref.parent, je = V.length; je--; )
                    if (((qe = V[je]), qe.ref && qe.ref.parent === me)) {
                      if (qe.ref.key < dt) break;
                      --qe.ref.key;
                    }
                }
              }
              for (
                this.__initialize(h, I),
                  oe = {},
                  V = this.__worklist,
                  Q = this.__leavelist,
                  we = { root: h },
                  J = new A(h, null, null, new k(we, "root")),
                  V.push(J),
                  Q.push(J);
                V.length;
              ) {
                if (((J = V.pop()), J === oe)) {
                  if (
                    ((J = Q.pop()),
                    (K = this.__execute(I.leave, J)),
                    K !== void 0 && K !== d && K !== g && K !== x && J.ref.replace(K),
                    (this.__state === x || K === x) && pt(J),
                    this.__state === d || K === d)
                  )
                    return we.root;
                  continue;
                }
                if (
                  ((K = this.__execute(I.enter, J)),
                  K !== void 0 && K !== d && K !== g && K !== x && (J.ref.replace(K), (J.node = K)),
                  (this.__state === x || K === x) && (pt(J), (J.node = null)),
                  this.__state === d || K === d)
                )
                  return we.root;
                if (
                  ((H = J.node), !!H && (V.push(oe), Q.push(J), !(this.__state === g || K === g)))
                ) {
                  if (((ee = H.type || J.wrap), (ve = this.__keys[ee]), !ve))
                    if (this.__fallback) ve = this.__fallback(H);
                    else throw new Error("Unknown node type " + ee + ".");
                  for (he = ve.length; (he -= 1) >= 0; )
                    if (((Ne = ve[he]), (ye = H[Ne]), !!ye))
                      if (Array.isArray(ye)) {
                        for (_e = ye.length; (_e -= 1) >= 0; )
                          if (ye[_e]) {
                            if (E(ee, ve[he]))
                              J = new A(ye[_e], [Ne, _e], "Property", new k(ye, _e));
                            else if (N(ye[_e])) J = new A(ye[_e], [Ne, _e], null, new k(ye, _e));
                            else continue;
                            V.push(J);
                          }
                      } else N(ye) && V.push(new A(ye, Ne, null, new k(H, Ne)));
                }
              }
              return we.root;
            });
          function B(y, h) {
            var I = new P();
            return I.traverse(y, h);
          }
          function M(y, h) {
            var I = new P();
            return I.replace(y, h);
          }
          function G(y, h) {
            var I;
            return (
              (I = C(h, (Q) => Q.range[0] > y.range[0])),
              (y.extendedRange = [y.range[0], y.range[1]]),
              I !== h.length && (y.extendedRange[1] = h[I].range[0]),
              (I -= 1),
              I >= 0 && (y.extendedRange[0] = h[I].range[1]),
              y
            );
          }
          function L(y, h, I) {
            var V = [],
              Q,
              H,
              ee,
              K;
            if (!y.range) throw new Error("attachComments needs range information");
            if (!I.length) {
              if (h.length) {
                for (ee = 0, H = h.length; ee < H; ee += 1)
                  (Q = _(h[ee])), (Q.extendedRange = [0, y.range[0]]), V.push(Q);
                y.leadingComments = V;
              }
              return y;
            }
            for (ee = 0, H = h.length; ee < H; ee += 1) V.push(G(_(h[ee]), I));
            return (
              (K = 0),
              B(y, {
                enter: (J) => {
                  for (var he; K < V.length && ((he = V[K]), !(he.extendedRange[1] > J.range[0])); )
                    he.extendedRange[1] === J.range[0]
                      ? (J.leadingComments || (J.leadingComments = []),
                        J.leadingComments.push(he),
                        V.splice(K, 1))
                      : (K += 1);
                  if (K === V.length) return o.Break;
                  if (V[K].extendedRange[0] > J.range[1]) return o.Skip;
                },
              }),
              (K = 0),
              B(y, {
                leave: (J) => {
                  for (var he; K < V.length && ((he = V[K]), !(J.range[1] < he.extendedRange[0])); )
                    J.range[1] === he.extendedRange[0]
                      ? (J.trailingComments || (J.trailingComments = []),
                        J.trailingComments.push(he),
                        V.splice(K, 1))
                      : (K += 1);
                  if (K === V.length) return o.Break;
                  if (V[K].extendedRange[0] > J.range[1]) return o.Skip;
                },
              }),
              y
            );
          }
          return (
            (r.Syntax = n),
            (r.traverse = B),
            (r.replace = M),
            (r.attachComments = L),
            (r.VisitorKeys = f),
            (r.VisitorOption = o),
            (r.Controller = P),
            (r.cloneEnvironment = () => i({})),
            r
          );
        })(e);
      })(Fi)),
    Fi
  );
}
var Qt = {},
  Bi = {},
  mi = {},
  gi = {},
  Jr;
function ka() {
  if (Jr) return gi;
  Jr = 1;
  var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  return (
    (gi.encode = (i) => {
      if (0 <= i && i < e.length) return e[i];
      throw new TypeError("Must be between 0 and 63: " + i);
    }),
    (gi.decode = (i) => {
      var r = 65,
        n = 90,
        o = 97,
        f = 122,
        d = 48,
        g = 57,
        x = 43,
        _ = 47,
        C = 26,
        k = 52;
      return r <= i && i <= n
        ? i - r
        : o <= i && i <= f
          ? i - o + C
          : d <= i && i <= g
            ? i - d + k
            : i == x
              ? 62
              : i == _
                ? 63
                : -1;
    }),
    gi
  );
}
var Yr;
function Fs() {
  if (Yr) return mi;
  Yr = 1;
  var e = ka(),
    i = 5,
    r = 1 << i,
    n = r - 1,
    o = r;
  function f(g) {
    return g < 0 ? (-g << 1) + 1 : (g << 1) + 0;
  }
  function d(g) {
    var x = (g & 1) === 1,
      _ = g >> 1;
    return x ? -_ : _;
  }
  return (
    (mi.encode = (x) => {
      var _ = "",
        C,
        k = f(x);
      do (C = k & n), (k >>>= i), k > 0 && (C |= o), (_ += e.encode(C));
      while (k > 0);
      return _;
    }),
    (mi.decode = (x, _, C) => {
      var k = x.length,
        A = 0,
        P = 0,
        N,
        E;
      do {
        if (_ >= k) throw new Error("Expected more digits in base 64 VLQ value.");
        if (((E = e.decode(x.charCodeAt(_++))), E === -1))
          throw new Error("Invalid base64 digit: " + x.charAt(_ - 1));
        (N = !!(E & o)), (E &= n), (A = A + (E << P)), (P += i);
      } while (N);
      (C.value = d(A)), (C.rest = _);
    }),
    mi
  );
}
var Mi = {},
  Zr;
function si() {
  return (
    Zr ||
      ((Zr = 1),
      ((e) => {
        function i(L, y, h) {
          if (y in L) return L[y];
          if (arguments.length === 3) return h;
          throw new Error('"' + y + '" is a required argument.');
        }
        e.getArg = i;
        var r = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,
          n = /^data:.+,.+$/;
        function o(L) {
          var y = L.match(r);
          return y ? { scheme: y[1], auth: y[2], host: y[3], port: y[4], path: y[5] } : null;
        }
        e.urlParse = o;
        function f(L) {
          var y = "";
          return (
            L.scheme && (y += L.scheme + ":"),
            (y += "//"),
            L.auth && (y += L.auth + "@"),
            L.host && (y += L.host),
            L.port && (y += ":" + L.port),
            L.path && (y += L.path),
            y
          );
        }
        e.urlGenerate = f;
        function d(L) {
          var y = L,
            h = o(L);
          if (h) {
            if (!h.path) return L;
            y = h.path;
          }
          for (
            var I = e.isAbsolute(y), V = y.split(/\/+/), Q, H = 0, ee = V.length - 1;
            ee >= 0;
            ee--
          )
            (Q = V[ee]),
              Q === "."
                ? V.splice(ee, 1)
                : Q === ".."
                  ? H++
                  : H > 0 && (Q === "" ? (V.splice(ee + 1, H), (H = 0)) : (V.splice(ee, 2), H--));
          return (y = V.join("/")), y === "" && (y = I ? "/" : "."), h ? ((h.path = y), f(h)) : y;
        }
        e.normalize = d;
        function g(L, y) {
          L === "" && (L = "."), y === "" && (y = ".");
          var h = o(y),
            I = o(L);
          if ((I && (L = I.path || "/"), h && !h.scheme)) return I && (h.scheme = I.scheme), f(h);
          if (h || y.match(n)) return y;
          if (I && !I.host && !I.path) return (I.host = y), f(I);
          var V = y.charAt(0) === "/" ? y : d(L.replace(/\/+$/, "") + "/" + y);
          return I ? ((I.path = V), f(I)) : V;
        }
        (e.join = g), (e.isAbsolute = (L) => L.charAt(0) === "/" || r.test(L));
        function x(L, y) {
          L === "" && (L = "."), (L = L.replace(/\/$/, ""));
          for (var h = 0; y.indexOf(L + "/") !== 0; ) {
            var I = L.lastIndexOf("/");
            if (I < 0 || ((L = L.slice(0, I)), L.match(/^([^/]+:\/)?\/*$/))) return y;
            ++h;
          }
          return Array(h + 1).join("../") + y.substr(L.length + 1);
        }
        e.relative = x;
        var _ = (() => {
          var L = Object.create(null);
          return !("__proto__" in L);
        })();
        function C(L) {
          return L;
        }
        function k(L) {
          return P(L) ? "$" + L : L;
        }
        e.toSetString = _ ? C : k;
        function A(L) {
          return P(L) ? L.slice(1) : L;
        }
        e.fromSetString = _ ? C : A;
        function P(L) {
          if (!L) return !1;
          var y = L.length;
          if (
            y < 9 ||
            L.charCodeAt(y - 1) !== 95 ||
            L.charCodeAt(y - 2) !== 95 ||
            L.charCodeAt(y - 3) !== 111 ||
            L.charCodeAt(y - 4) !== 116 ||
            L.charCodeAt(y - 5) !== 111 ||
            L.charCodeAt(y - 6) !== 114 ||
            L.charCodeAt(y - 7) !== 112 ||
            L.charCodeAt(y - 8) !== 95 ||
            L.charCodeAt(y - 9) !== 95
          )
            return !1;
          for (var h = y - 10; h >= 0; h--) if (L.charCodeAt(h) !== 36) return !1;
          return !0;
        }
        function N(L, y, h) {
          var I = w(L.source, y.source);
          return I !== 0 ||
            ((I = L.originalLine - y.originalLine), I !== 0) ||
            ((I = L.originalColumn - y.originalColumn), I !== 0 || h) ||
            ((I = L.generatedColumn - y.generatedColumn), I !== 0) ||
            ((I = L.generatedLine - y.generatedLine), I !== 0)
            ? I
            : w(L.name, y.name);
        }
        e.compareByOriginalPositions = N;
        function E(L, y, h) {
          var I = L.generatedLine - y.generatedLine;
          return I !== 0 ||
            ((I = L.generatedColumn - y.generatedColumn), I !== 0 || h) ||
            ((I = w(L.source, y.source)), I !== 0) ||
            ((I = L.originalLine - y.originalLine), I !== 0) ||
            ((I = L.originalColumn - y.originalColumn), I !== 0)
            ? I
            : w(L.name, y.name);
        }
        e.compareByGeneratedPositionsDeflated = E;
        function w(L, y) {
          return L === y ? 0 : L === null ? 1 : y === null ? -1 : L > y ? 1 : -1;
        }
        function B(L, y) {
          var h = L.generatedLine - y.generatedLine;
          return h !== 0 ||
            ((h = L.generatedColumn - y.generatedColumn), h !== 0) ||
            ((h = w(L.source, y.source)), h !== 0) ||
            ((h = L.originalLine - y.originalLine), h !== 0) ||
            ((h = L.originalColumn - y.originalColumn), h !== 0)
            ? h
            : w(L.name, y.name);
        }
        e.compareByGeneratedPositionsInflated = B;
        function M(L) {
          return JSON.parse(L.replace(/^\)]}'[^\n]*\n/, ""));
        }
        e.parseSourceMapInput = M;
        function G(L, y, h) {
          if (
            ((y = y || ""),
            L && (L[L.length - 1] !== "/" && y[0] !== "/" && (L += "/"), (y = L + y)),
            h)
          ) {
            var I = o(h);
            if (!I) throw new Error("sourceMapURL could not be parsed");
            if (I.path) {
              var V = I.path.lastIndexOf("/");
              V >= 0 && (I.path = I.path.substring(0, V + 1));
            }
            y = g(f(I), y);
          }
          return d(y);
        }
        e.computeSourceURL = G;
      })(Mi)),
    Mi
  );
}
var Di = {},
  $r;
function Bs() {
  if ($r) return Di;
  $r = 1;
  var e = si(),
    i = Object.prototype.hasOwnProperty,
    r = typeof Map < "u";
  function n() {
    (this._array = []), (this._set = r ? new Map() : Object.create(null));
  }
  return (
    (n.fromArray = (f, d) => {
      for (var g = new n(), x = 0, _ = f.length; x < _; x++) g.add(f[x], d);
      return g;
    }),
    (n.prototype.size = function () {
      return r ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    }),
    (n.prototype.add = function (f, d) {
      var g = r ? f : e.toSetString(f),
        x = r ? this.has(f) : i.call(this._set, g),
        _ = this._array.length;
      (!x || d) && this._array.push(f), x || (r ? this._set.set(f, _) : (this._set[g] = _));
    }),
    (n.prototype.has = function (f) {
      if (r) return this._set.has(f);
      var d = e.toSetString(f);
      return i.call(this._set, d);
    }),
    (n.prototype.indexOf = function (f) {
      if (r) {
        var d = this._set.get(f);
        if (d >= 0) return d;
      } else {
        var g = e.toSetString(f);
        if (i.call(this._set, g)) return this._set[g];
      }
      throw new Error('"' + f + '" is not in the set.');
    }),
    (n.prototype.at = function (f) {
      if (f >= 0 && f < this._array.length) return this._array[f];
      throw new Error("No element indexed by " + f);
    }),
    (n.prototype.toArray = function () {
      return this._array.slice();
    }),
    (Di.ArraySet = n),
    Di
  );
}
var ji = {},
  es;
function Aa() {
  if (es) return ji;
  es = 1;
  var e = si();
  function i(n, o) {
    var f = n.generatedLine,
      d = o.generatedLine,
      g = n.generatedColumn,
      x = o.generatedColumn;
    return d > f || (d == f && x >= g) || e.compareByGeneratedPositionsInflated(n, o) <= 0;
  }
  function r() {
    (this._array = []),
      (this._sorted = !0),
      (this._last = { generatedLine: -1, generatedColumn: 0 });
  }
  return (
    (r.prototype.unsortedForEach = function (o, f) {
      this._array.forEach(o, f);
    }),
    (r.prototype.add = function (o) {
      i(this._last, o)
        ? ((this._last = o), this._array.push(o))
        : ((this._sorted = !1), this._array.push(o));
    }),
    (r.prototype.toArray = function () {
      return (
        this._sorted ||
          (this._array.sort(e.compareByGeneratedPositionsInflated), (this._sorted = !0)),
        this._array
      );
    }),
    (ji.MappingList = r),
    ji
  );
}
var ts;
function Ms() {
  if (ts) return Bi;
  ts = 1;
  var e = Fs(),
    i = si(),
    r = Bs().ArraySet,
    n = Aa().MappingList;
  function o(f) {
    f || (f = {}),
      (this._file = i.getArg(f, "file", null)),
      (this._sourceRoot = i.getArg(f, "sourceRoot", null)),
      (this._skipValidation = i.getArg(f, "skipValidation", !1)),
      (this._sources = new r()),
      (this._names = new r()),
      (this._mappings = new n()),
      (this._sourcesContents = null);
  }
  return (
    (o.prototype._version = 3),
    (o.fromSourceMap = (d) => {
      var g = d.sourceRoot,
        x = new o({ file: d.file, sourceRoot: g });
      return (
        d.eachMapping((_) => {
          var C = { generated: { line: _.generatedLine, column: _.generatedColumn } };
          _.source != null &&
            ((C.source = _.source),
            g != null && (C.source = i.relative(g, C.source)),
            (C.original = { line: _.originalLine, column: _.originalColumn }),
            _.name != null && (C.name = _.name)),
            x.addMapping(C);
        }),
        d.sources.forEach((_) => {
          var C = _;
          g !== null && (C = i.relative(g, _)), x._sources.has(C) || x._sources.add(C);
          var k = d.sourceContentFor(_);
          k != null && x.setSourceContent(_, k);
        }),
        x
      );
    }),
    (o.prototype.addMapping = function (d) {
      var g = i.getArg(d, "generated"),
        x = i.getArg(d, "original", null),
        _ = i.getArg(d, "source", null),
        C = i.getArg(d, "name", null);
      this._skipValidation || this._validateMapping(g, x, _, C),
        _ != null && ((_ = String(_)), this._sources.has(_) || this._sources.add(_)),
        C != null && ((C = String(C)), this._names.has(C) || this._names.add(C)),
        this._mappings.add({
          generatedLine: g.line,
          generatedColumn: g.column,
          originalLine: x != null && x.line,
          originalColumn: x != null && x.column,
          source: _,
          name: C,
        });
    }),
    (o.prototype.setSourceContent = function (d, g) {
      var x = d;
      this._sourceRoot != null && (x = i.relative(this._sourceRoot, x)),
        g != null
          ? (this._sourcesContents || (this._sourcesContents = Object.create(null)),
            (this._sourcesContents[i.toSetString(x)] = g))
          : this._sourcesContents &&
            (delete this._sourcesContents[i.toSetString(x)],
            Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
    }),
    (o.prototype.applySourceMap = function (d, g, x) {
      var _ = g;
      if (g == null) {
        if (d.file == null)
          throw new Error(
            `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`,
          );
        _ = d.file;
      }
      var C = this._sourceRoot;
      C != null && (_ = i.relative(C, _));
      var k = new r(),
        A = new r();
      this._mappings.unsortedForEach((P) => {
        if (P.source === _ && P.originalLine != null) {
          var N = d.originalPositionFor({ line: P.originalLine, column: P.originalColumn });
          N.source != null &&
            ((P.source = N.source),
            x != null && (P.source = i.join(x, P.source)),
            C != null && (P.source = i.relative(C, P.source)),
            (P.originalLine = N.line),
            (P.originalColumn = N.column),
            N.name != null && (P.name = N.name));
        }
        var E = P.source;
        E != null && !k.has(E) && k.add(E);
        var w = P.name;
        w != null && !A.has(w) && A.add(w);
      }, this),
        (this._sources = k),
        (this._names = A),
        d.sources.forEach(function (P) {
          var N = d.sourceContentFor(P);
          N != null &&
            (x != null && (P = i.join(x, P)),
            C != null && (P = i.relative(C, P)),
            this.setSourceContent(P, N));
        }, this);
    }),
    (o.prototype._validateMapping = (d, g, x, _) => {
      if (g && typeof g.line != "number" && typeof g.column != "number")
        throw new Error(
          "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.",
        );
      if (!(d && "line" in d && "column" in d && d.line > 0 && d.column >= 0 && !g && !x && !_)) {
        if (
          d &&
          "line" in d &&
          "column" in d &&
          g &&
          "line" in g &&
          "column" in g &&
          d.line > 0 &&
          d.column >= 0 &&
          g.line > 0 &&
          g.column >= 0 &&
          x
        )
          return;
        throw new Error(
          "Invalid mapping: " + JSON.stringify({ generated: d, source: x, original: g, name: _ }),
        );
      }
    }),
    (o.prototype._serializeMappings = function () {
      for (
        var d = 0,
          g = 1,
          x = 0,
          _ = 0,
          C = 0,
          k = 0,
          A = "",
          P,
          N,
          E,
          w,
          B = this._mappings.toArray(),
          M = 0,
          G = B.length;
        M < G;
        M++
      ) {
        if (((N = B[M]), (P = ""), N.generatedLine !== g))
          for (d = 0; N.generatedLine !== g; ) (P += ";"), g++;
        else if (M > 0) {
          if (!i.compareByGeneratedPositionsInflated(N, B[M - 1])) continue;
          P += ",";
        }
        (P += e.encode(N.generatedColumn - d)),
          (d = N.generatedColumn),
          N.source != null &&
            ((w = this._sources.indexOf(N.source)),
            (P += e.encode(w - k)),
            (k = w),
            (P += e.encode(N.originalLine - 1 - _)),
            (_ = N.originalLine - 1),
            (P += e.encode(N.originalColumn - x)),
            (x = N.originalColumn),
            N.name != null && ((E = this._names.indexOf(N.name)), (P += e.encode(E - C)), (C = E))),
          (A += P);
      }
      return A;
    }),
    (o.prototype._generateSourcesContent = function (d, g) {
      return d.map(function (x) {
        if (!this._sourcesContents) return null;
        g != null && (x = i.relative(g, x));
        var _ = i.toSetString(x);
        return Object.hasOwn(this._sourcesContents, _) ? this._sourcesContents[_] : null;
      }, this);
    }),
    (o.prototype.toJSON = function () {
      var d = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings(),
      };
      return (
        this._file != null && (d.file = this._file),
        this._sourceRoot != null && (d.sourceRoot = this._sourceRoot),
        this._sourcesContents &&
          (d.sourcesContent = this._generateSourcesContent(d.sources, d.sourceRoot)),
        d
      );
    }),
    (o.prototype.toString = function () {
      return JSON.stringify(this.toJSON());
    }),
    (Bi.SourceMapGenerator = o),
    Bi
  );
}
var Kt = {},
  qi = {},
  is;
function Ia() {
  return (
    is ||
      ((is = 1),
      ((e) => {
        (e.GREATEST_LOWER_BOUND = 1), (e.LEAST_UPPER_BOUND = 2);
        function i(r, n, o, f, d, g) {
          var x = Math.floor((n - r) / 2) + r,
            _ = d(o, f[x], !0);
          return _ === 0
            ? x
            : _ > 0
              ? n - x > 1
                ? i(x, n, o, f, d, g)
                : g == e.LEAST_UPPER_BOUND
                  ? n < f.length
                    ? n
                    : -1
                  : x
              : x - r > 1
                ? i(r, x, o, f, d, g)
                : g == e.LEAST_UPPER_BOUND
                  ? x
                  : r < 0
                    ? -1
                    : r;
        }
        e.search = (n, o, f, d) => {
          if (o.length === 0) return -1;
          var g = i(-1, o.length, n, o, f, d || e.GREATEST_LOWER_BOUND);
          if (g < 0) return -1;
          for (; g - 1 >= 0 && f(o[g], o[g - 1], !0) === 0; ) --g;
          return g;
        };
      })(qi)),
    qi
  );
}
var Ui = {},
  rs;
function Pa() {
  if (rs) return Ui;
  rs = 1;
  function e(n, o, f) {
    var d = n[o];
    (n[o] = n[f]), (n[f] = d);
  }
  function i(n, o) {
    return Math.round(n + Math.random() * (o - n));
  }
  function r(n, o, f, d) {
    if (f < d) {
      var g = i(f, d),
        x = f - 1;
      e(n, g, d);
      for (var _ = n[d], C = f; C < d; C++) o(n[C], _) <= 0 && ((x += 1), e(n, x, C));
      e(n, x + 1, C);
      var k = x + 1;
      r(n, o, f, k - 1), r(n, o, k + 1, d);
    }
  }
  return (
    (Ui.quickSort = (n, o) => {
      r(n, o, 0, n.length - 1);
    }),
    Ui
  );
}
var ss;
function Ta() {
  if (ss) return Kt;
  ss = 1;
  var e = si(),
    i = Ia(),
    r = Bs().ArraySet,
    n = Fs(),
    o = Pa().quickSort;
  function f(_, C) {
    var k = _;
    return (
      typeof _ == "string" && (k = e.parseSourceMapInput(_)),
      k.sections != null ? new x(k, C) : new d(k, C)
    );
  }
  (f.fromSourceMap = (_, C) => d.fromSourceMap(_, C)),
    (f.prototype._version = 3),
    (f.prototype.__generatedMappings = null),
    Object.defineProperty(f.prototype, "_generatedMappings", {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return (
          this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot),
          this.__generatedMappings
        );
      },
    }),
    (f.prototype.__originalMappings = null),
    Object.defineProperty(f.prototype, "_originalMappings", {
      configurable: !0,
      enumerable: !0,
      get: function () {
        return (
          this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot),
          this.__originalMappings
        );
      },
    }),
    (f.prototype._charIsMappingSeparator = (C, k) => {
      var A = C.charAt(k);
      return A === ";" || A === ",";
    }),
    (f.prototype._parseMappings = (C, k) => {
      throw new Error("Subclasses must implement _parseMappings");
    }),
    (f.GENERATED_ORDER = 1),
    (f.ORIGINAL_ORDER = 2),
    (f.GREATEST_LOWER_BOUND = 1),
    (f.LEAST_UPPER_BOUND = 2),
    (f.prototype.eachMapping = function (C, k, A) {
      var P = k || null,
        N = A || f.GENERATED_ORDER,
        E;
      switch (N) {
        case f.GENERATED_ORDER:
          E = this._generatedMappings;
          break;
        case f.ORIGINAL_ORDER:
          E = this._originalMappings;
          break;
        default:
          throw new Error("Unknown order of iteration.");
      }
      var w = this.sourceRoot;
      E.map(function (B) {
        var M = B.source === null ? null : this._sources.at(B.source);
        return (
          (M = e.computeSourceURL(w, M, this._sourceMapURL)),
          {
            source: M,
            generatedLine: B.generatedLine,
            generatedColumn: B.generatedColumn,
            originalLine: B.originalLine,
            originalColumn: B.originalColumn,
            name: B.name === null ? null : this._names.at(B.name),
          }
        );
      }, this).forEach(C, P);
    }),
    (f.prototype.allGeneratedPositionsFor = function (C) {
      var k = e.getArg(C, "line"),
        A = {
          source: e.getArg(C, "source"),
          originalLine: k,
          originalColumn: e.getArg(C, "column", 0),
        };
      if (((A.source = this._findSourceIndex(A.source)), A.source < 0)) return [];
      var P = [],
        N = this._findMapping(
          A,
          this._originalMappings,
          "originalLine",
          "originalColumn",
          e.compareByOriginalPositions,
          i.LEAST_UPPER_BOUND,
        );
      if (N >= 0) {
        var E = this._originalMappings[N];
        if (C.column === void 0)
          for (var w = E.originalLine; E && E.originalLine === w; )
            P.push({
              line: e.getArg(E, "generatedLine", null),
              column: e.getArg(E, "generatedColumn", null),
              lastColumn: e.getArg(E, "lastGeneratedColumn", null),
            }),
              (E = this._originalMappings[++N]);
        else
          for (var B = E.originalColumn; E && E.originalLine === k && E.originalColumn == B; )
            P.push({
              line: e.getArg(E, "generatedLine", null),
              column: e.getArg(E, "generatedColumn", null),
              lastColumn: e.getArg(E, "lastGeneratedColumn", null),
            }),
              (E = this._originalMappings[++N]);
      }
      return P;
    }),
    (Kt.SourceMapConsumer = f);
  function d(_, C) {
    var k = _;
    typeof _ == "string" && (k = e.parseSourceMapInput(_));
    var A = e.getArg(k, "version"),
      P = e.getArg(k, "sources"),
      N = e.getArg(k, "names", []),
      E = e.getArg(k, "sourceRoot", null),
      w = e.getArg(k, "sourcesContent", null),
      B = e.getArg(k, "mappings"),
      M = e.getArg(k, "file", null);
    if (A != this._version) throw new Error("Unsupported version: " + A);
    E && (E = e.normalize(E)),
      (P = P.map(String)
        .map(e.normalize)
        .map((G) => (E && e.isAbsolute(E) && e.isAbsolute(G) ? e.relative(E, G) : G))),
      (this._names = r.fromArray(N.map(String), !0)),
      (this._sources = r.fromArray(P, !0)),
      (this._absoluteSources = this._sources.toArray().map((G) => e.computeSourceURL(E, G, C))),
      (this.sourceRoot = E),
      (this.sourcesContent = w),
      (this._mappings = B),
      (this._sourceMapURL = C),
      (this.file = M);
  }
  (d.prototype = Object.create(f.prototype)),
    (d.prototype.consumer = f),
    (d.prototype._findSourceIndex = function (_) {
      var C = _;
      if ((this.sourceRoot != null && (C = e.relative(this.sourceRoot, C)), this._sources.has(C)))
        return this._sources.indexOf(C);
      var k;
      for (k = 0; k < this._absoluteSources.length; ++k)
        if (this._absoluteSources[k] == _) return k;
      return -1;
    }),
    (d.fromSourceMap = (C, k) => {
      var A = Object.create(d.prototype),
        P = (A._names = r.fromArray(C._names.toArray(), !0)),
        N = (A._sources = r.fromArray(C._sources.toArray(), !0));
      (A.sourceRoot = C._sourceRoot),
        (A.sourcesContent = C._generateSourcesContent(A._sources.toArray(), A.sourceRoot)),
        (A.file = C._file),
        (A._sourceMapURL = k),
        (A._absoluteSources = A._sources
          .toArray()
          .map((h) => e.computeSourceURL(A.sourceRoot, h, k)));
      for (
        var E = C._mappings.toArray().slice(),
          w = (A.__generatedMappings = []),
          B = (A.__originalMappings = []),
          M = 0,
          G = E.length;
        M < G;
        M++
      ) {
        var L = E[M],
          y = new g();
        (y.generatedLine = L.generatedLine),
          (y.generatedColumn = L.generatedColumn),
          L.source &&
            ((y.source = N.indexOf(L.source)),
            (y.originalLine = L.originalLine),
            (y.originalColumn = L.originalColumn),
            L.name && (y.name = P.indexOf(L.name)),
            B.push(y)),
          w.push(y);
      }
      return o(A.__originalMappings, e.compareByOriginalPositions), A;
    }),
    (d.prototype._version = 3),
    Object.defineProperty(d.prototype, "sources", {
      get: function () {
        return this._absoluteSources.slice();
      },
    });
  function g() {
    (this.generatedLine = 0),
      (this.generatedColumn = 0),
      (this.source = null),
      (this.originalLine = null),
      (this.originalColumn = null),
      (this.name = null);
  }
  (d.prototype._parseMappings = function (C, k) {
    for (
      var A = 1,
        P = 0,
        N = 0,
        E = 0,
        w = 0,
        B = 0,
        M = C.length,
        G = 0,
        L = {},
        y = {},
        h = [],
        I = [],
        V,
        Q,
        H,
        ee,
        K;
      G < M;
    )
      if (C.charAt(G) === ";") A++, G++, (P = 0);
      else if (C.charAt(G) === ",") G++;
      else {
        for (
          V = new g(), V.generatedLine = A, ee = G;
          ee < M && !this._charIsMappingSeparator(C, ee);
          ee++
        );
        if (((Q = C.slice(G, ee)), (H = L[Q]), H)) G += Q.length;
        else {
          for (H = []; G < ee; ) n.decode(C, G, y), (K = y.value), (G = y.rest), H.push(K);
          if (H.length === 2) throw new Error("Found a source, but no line and column");
          if (H.length === 3) throw new Error("Found a source and line, but no column");
          L[Q] = H;
        }
        (V.generatedColumn = P + H[0]),
          (P = V.generatedColumn),
          H.length > 1 &&
            ((V.source = w + H[1]),
            (w += H[1]),
            (V.originalLine = N + H[2]),
            (N = V.originalLine),
            (V.originalLine += 1),
            (V.originalColumn = E + H[3]),
            (E = V.originalColumn),
            H.length > 4 && ((V.name = B + H[4]), (B += H[4]))),
          I.push(V),
          typeof V.originalLine == "number" && h.push(V);
      }
    o(I, e.compareByGeneratedPositionsDeflated),
      (this.__generatedMappings = I),
      o(h, e.compareByOriginalPositions),
      (this.__originalMappings = h);
  }),
    (d.prototype._findMapping = (C, k, A, P, N, E) => {
      if (C[A] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + C[A]);
      if (C[P] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + C[P]);
      return i.search(C, k, N, E);
    }),
    (d.prototype.computeColumnSpans = function () {
      for (var C = 0; C < this._generatedMappings.length; ++C) {
        var k = this._generatedMappings[C];
        if (C + 1 < this._generatedMappings.length) {
          var A = this._generatedMappings[C + 1];
          if (k.generatedLine === A.generatedLine) {
            k.lastGeneratedColumn = A.generatedColumn - 1;
            continue;
          }
        }
        k.lastGeneratedColumn = 1 / 0;
      }
    }),
    (d.prototype.originalPositionFor = function (C) {
      var k = { generatedLine: e.getArg(C, "line"), generatedColumn: e.getArg(C, "column") },
        A = this._findMapping(
          k,
          this._generatedMappings,
          "generatedLine",
          "generatedColumn",
          e.compareByGeneratedPositionsDeflated,
          e.getArg(C, "bias", f.GREATEST_LOWER_BOUND),
        );
      if (A >= 0) {
        var P = this._generatedMappings[A];
        if (P.generatedLine === k.generatedLine) {
          var N = e.getArg(P, "source", null);
          N !== null &&
            ((N = this._sources.at(N)),
            (N = e.computeSourceURL(this.sourceRoot, N, this._sourceMapURL)));
          var E = e.getArg(P, "name", null);
          return (
            E !== null && (E = this._names.at(E)),
            {
              source: N,
              line: e.getArg(P, "originalLine", null),
              column: e.getArg(P, "originalColumn", null),
              name: E,
            }
          );
        }
      }
      return { source: null, line: null, column: null, name: null };
    }),
    (d.prototype.hasContentsOfAllSources = function () {
      return this.sourcesContent
        ? this.sourcesContent.length >= this._sources.size() &&
            !this.sourcesContent.some((C) => C == null)
        : !1;
    }),
    (d.prototype.sourceContentFor = function (C, k) {
      if (!this.sourcesContent) return null;
      var A = this._findSourceIndex(C);
      if (A >= 0) return this.sourcesContent[A];
      var P = C;
      this.sourceRoot != null && (P = e.relative(this.sourceRoot, P));
      var N;
      if (this.sourceRoot != null && (N = e.urlParse(this.sourceRoot))) {
        var E = P.replace(/^file:\/\//, "");
        if (N.scheme == "file" && this._sources.has(E))
          return this.sourcesContent[this._sources.indexOf(E)];
        if ((!N.path || N.path == "/") && this._sources.has("/" + P))
          return this.sourcesContent[this._sources.indexOf("/" + P)];
      }
      if (k) return null;
      throw new Error('"' + P + '" is not in the SourceMap.');
    }),
    (d.prototype.generatedPositionFor = function (C) {
      var k = e.getArg(C, "source");
      if (((k = this._findSourceIndex(k)), k < 0))
        return { line: null, column: null, lastColumn: null };
      var A = {
          source: k,
          originalLine: e.getArg(C, "line"),
          originalColumn: e.getArg(C, "column"),
        },
        P = this._findMapping(
          A,
          this._originalMappings,
          "originalLine",
          "originalColumn",
          e.compareByOriginalPositions,
          e.getArg(C, "bias", f.GREATEST_LOWER_BOUND),
        );
      if (P >= 0) {
        var N = this._originalMappings[P];
        if (N.source === A.source)
          return {
            line: e.getArg(N, "generatedLine", null),
            column: e.getArg(N, "generatedColumn", null),
            lastColumn: e.getArg(N, "lastGeneratedColumn", null),
          };
      }
      return { line: null, column: null, lastColumn: null };
    }),
    (Kt.BasicSourceMapConsumer = d);
  function x(_, C) {
    var k = _;
    typeof _ == "string" && (k = e.parseSourceMapInput(_));
    var A = e.getArg(k, "version"),
      P = e.getArg(k, "sections");
    if (A != this._version) throw new Error("Unsupported version: " + A);
    (this._sources = new r()), (this._names = new r());
    var N = { line: -1, column: 0 };
    this._sections = P.map((E) => {
      if (E.url) throw new Error("Support for url field in sections not implemented.");
      var w = e.getArg(E, "offset"),
        B = e.getArg(w, "line"),
        M = e.getArg(w, "column");
      if (B < N.line || (B === N.line && M < N.column))
        throw new Error("Section offsets must be ordered and non-overlapping.");
      return (
        (N = w),
        {
          generatedOffset: { generatedLine: B + 1, generatedColumn: M + 1 },
          consumer: new f(e.getArg(E, "map"), C),
        }
      );
    });
  }
  return (
    (x.prototype = Object.create(f.prototype)),
    (x.prototype.constructor = f),
    (x.prototype._version = 3),
    Object.defineProperty(x.prototype, "sources", {
      get: function () {
        for (var _ = [], C = 0; C < this._sections.length; C++)
          for (var k = 0; k < this._sections[C].consumer.sources.length; k++)
            _.push(this._sections[C].consumer.sources[k]);
        return _;
      },
    }),
    (x.prototype.originalPositionFor = function (C) {
      var k = { generatedLine: e.getArg(C, "line"), generatedColumn: e.getArg(C, "column") },
        A = i.search(k, this._sections, (N, E) => {
          var w = N.generatedLine - E.generatedOffset.generatedLine;
          return w || N.generatedColumn - E.generatedOffset.generatedColumn;
        }),
        P = this._sections[A];
      return P
        ? P.consumer.originalPositionFor({
            line: k.generatedLine - (P.generatedOffset.generatedLine - 1),
            column:
              k.generatedColumn -
              (P.generatedOffset.generatedLine === k.generatedLine
                ? P.generatedOffset.generatedColumn - 1
                : 0),
            bias: C.bias,
          })
        : { source: null, line: null, column: null, name: null };
    }),
    (x.prototype.hasContentsOfAllSources = function () {
      return this._sections.every((C) => C.consumer.hasContentsOfAllSources());
    }),
    (x.prototype.sourceContentFor = function (C, k) {
      for (var A = 0; A < this._sections.length; A++) {
        var P = this._sections[A],
          N = P.consumer.sourceContentFor(C, !0);
        if (N) return N;
      }
      if (k) return null;
      throw new Error('"' + C + '" is not in the SourceMap.');
    }),
    (x.prototype.generatedPositionFor = function (C) {
      for (var k = 0; k < this._sections.length; k++) {
        var A = this._sections[k];
        if (A.consumer._findSourceIndex(e.getArg(C, "source")) !== -1) {
          var P = A.consumer.generatedPositionFor(C);
          if (P) {
            var N = {
              line: P.line + (A.generatedOffset.generatedLine - 1),
              column:
                P.column +
                (A.generatedOffset.generatedLine === P.line
                  ? A.generatedOffset.generatedColumn - 1
                  : 0),
            };
            return N;
          }
        }
      }
      return { line: null, column: null };
    }),
    (x.prototype._parseMappings = function (C, k) {
      (this.__generatedMappings = []), (this.__originalMappings = []);
      for (var A = 0; A < this._sections.length; A++)
        for (
          var P = this._sections[A], N = P.consumer._generatedMappings, E = 0;
          E < N.length;
          E++
        ) {
          var w = N[E],
            B = P.consumer._sources.at(w.source);
          (B = e.computeSourceURL(P.consumer.sourceRoot, B, this._sourceMapURL)),
            this._sources.add(B),
            (B = this._sources.indexOf(B));
          var M = null;
          w.name &&
            ((M = P.consumer._names.at(w.name)), this._names.add(M), (M = this._names.indexOf(M)));
          var G = {
            source: B,
            generatedLine: w.generatedLine + (P.generatedOffset.generatedLine - 1),
            generatedColumn:
              w.generatedColumn +
              (P.generatedOffset.generatedLine === w.generatedLine
                ? P.generatedOffset.generatedColumn - 1
                : 0),
            originalLine: w.originalLine,
            originalColumn: w.originalColumn,
            name: M,
          };
          this.__generatedMappings.push(G),
            typeof G.originalLine == "number" && this.__originalMappings.push(G);
        }
      o(this.__generatedMappings, e.compareByGeneratedPositionsDeflated),
        o(this.__originalMappings, e.compareByOriginalPositions);
    }),
    (Kt.IndexedSourceMapConsumer = x),
    Kt
  );
}
var Gi = {},
  ns;
function Na() {
  if (ns) return Gi;
  ns = 1;
  var e = Ms().SourceMapGenerator,
    i = si(),
    r = /(\r?\n)/,
    n = 10,
    o = "$$$isSourceNode$$$";
  function f(d, g, x, _, C) {
    (this.children = []),
      (this.sourceContents = {}),
      (this.line = d ?? null),
      (this.column = g ?? null),
      (this.source = x ?? null),
      (this.name = C ?? null),
      (this[o] = !0),
      _ != null && this.add(_);
  }
  return (
    (f.fromStringWithSourceMap = function (g, x, _) {
      var C = new f(),
        k = g.split(r),
        A = 0,
        P = () => {
          var M = L(),
            G = L() || "";
          return M + G;
          function L() {
            return A < k.length ? k[A++] : void 0;
          }
        },
        N = 1,
        E = 0,
        w = null;
      return (
        x.eachMapping((M) => {
          if (w !== null)
            if (N < M.generatedLine) B(w, P()), N++, (E = 0);
            else {
              var G = k[A] || "",
                L = G.substr(0, M.generatedColumn - E);
              (k[A] = G.substr(M.generatedColumn - E)), (E = M.generatedColumn), B(w, L), (w = M);
              return;
            }
          for (; N < M.generatedLine; ) C.add(P()), N++;
          if (E < M.generatedColumn) {
            var G = k[A] || "";
            C.add(G.substr(0, M.generatedColumn)),
              (k[A] = G.substr(M.generatedColumn)),
              (E = M.generatedColumn);
          }
          w = M;
        }, this),
        A < k.length && (w && B(w, P()), C.add(k.splice(A).join(""))),
        x.sources.forEach((M) => {
          var G = x.sourceContentFor(M);
          G != null && (_ != null && (M = i.join(_, M)), C.setSourceContent(M, G));
        }),
        C
      );
      function B(M, G) {
        if (M === null || M.source === void 0) C.add(G);
        else {
          var L = _ ? i.join(_, M.source) : M.source;
          C.add(new f(M.originalLine, M.originalColumn, L, G, M.name));
        }
      }
    }),
    (f.prototype.add = function (g) {
      if (Array.isArray(g))
        g.forEach(function (x) {
          this.add(x);
        }, this);
      else if (g[o] || typeof g == "string") g && this.children.push(g);
      else
        throw new TypeError(
          "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + g,
        );
      return this;
    }),
    (f.prototype.prepend = function (g) {
      if (Array.isArray(g)) for (var x = g.length - 1; x >= 0; x--) this.prepend(g[x]);
      else if (g[o] || typeof g == "string") this.children.unshift(g);
      else
        throw new TypeError(
          "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + g,
        );
      return this;
    }),
    (f.prototype.walk = function (g) {
      for (var x, _ = 0, C = this.children.length; _ < C; _++)
        (x = this.children[_]),
          x[o]
            ? x.walk(g)
            : x !== "" &&
              g(x, { source: this.source, line: this.line, column: this.column, name: this.name });
    }),
    (f.prototype.join = function (g) {
      var x,
        _,
        C = this.children.length;
      if (C > 0) {
        for (x = [], _ = 0; _ < C - 1; _++) x.push(this.children[_]), x.push(g);
        x.push(this.children[_]), (this.children = x);
      }
      return this;
    }),
    (f.prototype.replaceRight = function (g, x) {
      var _ = this.children[this.children.length - 1];
      return (
        _[o]
          ? _.replaceRight(g, x)
          : typeof _ == "string"
            ? (this.children[this.children.length - 1] = _.replace(g, x))
            : this.children.push("".replace(g, x)),
        this
      );
    }),
    (f.prototype.setSourceContent = function (g, x) {
      this.sourceContents[i.toSetString(g)] = x;
    }),
    (f.prototype.walkSourceContents = function (g) {
      for (var x = 0, _ = this.children.length; x < _; x++)
        this.children[x][o] && this.children[x].walkSourceContents(g);
      for (var C = Object.keys(this.sourceContents), x = 0, _ = C.length; x < _; x++)
        g(i.fromSetString(C[x]), this.sourceContents[C[x]]);
    }),
    (f.prototype.toString = function () {
      var g = "";
      return (
        this.walk((x) => {
          g += x;
        }),
        g
      );
    }),
    (f.prototype.toStringWithSourceMap = function (g) {
      var x = { code: "", line: 1, column: 0 },
        _ = new e(g),
        C = !1,
        k = null,
        A = null,
        P = null,
        N = null;
      return (
        this.walk((E, w) => {
          (x.code += E),
            w.source !== null && w.line !== null && w.column !== null
              ? ((k !== w.source || A !== w.line || P !== w.column || N !== w.name) &&
                  _.addMapping({
                    source: w.source,
                    original: { line: w.line, column: w.column },
                    generated: { line: x.line, column: x.column },
                    name: w.name,
                  }),
                (k = w.source),
                (A = w.line),
                (P = w.column),
                (N = w.name),
                (C = !0))
              : C &&
                (_.addMapping({ generated: { line: x.line, column: x.column } }),
                (k = null),
                (C = !1));
          for (var B = 0, M = E.length; B < M; B++)
            E.charCodeAt(B) === n
              ? (x.line++,
                (x.column = 0),
                B + 1 === M
                  ? ((k = null), (C = !1))
                  : C &&
                    _.addMapping({
                      source: w.source,
                      original: { line: w.line, column: w.column },
                      generated: { line: x.line, column: x.column },
                      name: w.name,
                    }))
              : x.column++;
        }),
        this.walkSourceContents((E, w) => {
          _.setSourceContent(E, w);
        }),
        { code: x.code, map: _ }
      );
    }),
    (Gi.SourceNode = f),
    Gi
  );
}
var as;
function La() {
  return (
    as ||
      ((as = 1),
      (Qt.SourceMapGenerator = Ms().SourceMapGenerator),
      (Qt.SourceMapConsumer = Ta().SourceMapConsumer),
      (Qt.SourceNode = Na().SourceNode)),
    Qt
  );
}
const Ra = "2.1.0",
  Oa = { version: Ra };
var os;
function Va() {
  return (
    os ||
      ((os = 1),
      ((e) => {
        (() => {
          var i, r, n, o, f, d, g, x, _, C, k, A, P, N, E, w, B, M, G, L, y, h, I, V, Q, H;
          (f = wa()), (d = sa()), (i = f.Syntax);
          function ee(a) {
            return Object.hasOwn(Ce.Expression, a.type);
          }
          function K(a) {
            return Object.hasOwn(Ce.Statement, a.type);
          }
          (r = {
            Sequence: 0,
            Yield: 1,
            Assignment: 1,
            Conditional: 2,
            ArrowFunction: 2,
            Coalesce: 3,
            LogicalOR: 4,
            LogicalAND: 5,
            BitwiseOR: 6,
            BitwiseXOR: 7,
            BitwiseAND: 8,
            Equality: 9,
            Relational: 10,
            BitwiseSHIFT: 11,
            Additive: 12,
            Multiplicative: 13,
            Exponentiation: 14,
            Await: 15,
            Unary: 15,
            Postfix: 16,
            OptionalChaining: 17,
            Call: 18,
            New: 19,
            TaggedTemplate: 20,
            Member: 21,
            Primary: 22,
          }),
            (n = {
              "??": r.Coalesce,
              "||": r.LogicalOR,
              "&&": r.LogicalAND,
              "|": r.BitwiseOR,
              "^": r.BitwiseXOR,
              "&": r.BitwiseAND,
              "==": r.Equality,
              "!=": r.Equality,
              "===": r.Equality,
              "!==": r.Equality,
              is: r.Equality,
              isnt: r.Equality,
              "<": r.Relational,
              ">": r.Relational,
              "<=": r.Relational,
              ">=": r.Relational,
              in: r.Relational,
              instanceof: r.Relational,
              "<<": r.BitwiseSHIFT,
              ">>": r.BitwiseSHIFT,
              ">>>": r.BitwiseSHIFT,
              "+": r.Additive,
              "-": r.Additive,
              "*": r.Multiplicative,
              "%": r.Multiplicative,
              "/": r.Multiplicative,
              "**": r.Exponentiation,
            });
          var J = 1,
            he = 2,
            _e = 4,
            ve = 8,
            ye = 16,
            oe = 32,
            we = 64,
            Ne = he | _e,
            pt = J | he,
            W = J | he | _e,
            je = J,
            dt = _e,
            qe = J | _e,
            me = J,
            We = J | oe,
            Pt = 0,
            it = J | ye,
            rt = J | ve;
          function Tt() {
            return {
              indent: null,
              base: null,
              parse: null,
              comment: !1,
              format: {
                indent: { style: "    ", base: 0, adjustMultilineComment: !1 },
                newline: `
`,
                space: " ",
                json: !1,
                renumber: !1,
                hexadecimal: !1,
                quotes: "single",
                escapeless: !1,
                compact: !1,
                parentheses: !0,
                semicolons: !0,
                safeConcatenation: !1,
                preserveBlankLines: !1,
              },
              moz: { comprehensionExpressionStartsWithAssignment: !1, starlessGenerator: !1 },
              sourceMap: null,
              sourceMapRoot: null,
              sourceMapWithCode: !1,
              directive: !1,
              raw: !0,
              verbatim: null,
              sourceCode: null,
            };
          }
          function Ze(a, c) {
            var p = "";
            for (c |= 0; c > 0; c >>>= 1, a += a) c & 1 && (p += a);
            return p;
          }
          function qt(a) {
            return /[\r\n]/g.test(a);
          }
          function Ie(a) {
            var c = a.length;
            return c && d.code.isLineTerminator(a.charCodeAt(c - 1));
          }
          function St(a, c) {
            var p;
            for (p in c) Object.hasOwn(c, p) && (a[p] = c[p]);
            return a;
          }
          function _t(a, c) {
            var p, m;
            function S(O) {
              return typeof O == "object" && O instanceof Object && !(O instanceof RegExp);
            }
            for (p in c)
              Object.hasOwn(c, p) &&
                ((m = c[p]), S(m) ? (S(a[p]) ? _t(a[p], m) : (a[p] = _t({}, m))) : (a[p] = m));
            return a;
          }
          function st(a) {
            var c, p, m, S, O;
            if (a !== a) throw new Error("Numeric literal whose value is NaN");
            if (a < 0 || (a === 0 && 1 / a < 0))
              throw new Error("Numeric literal whose value is negative");
            if (a === 1 / 0) return _ ? "null" : C ? "1e400" : "1e+400";
            if (((c = "" + a), !C || c.length < 3)) return c;
            for (
              p = c.indexOf("."),
                !_ && c.charCodeAt(0) === 48 && p === 1 && ((p = 0), (c = c.slice(1))),
                m = c,
                c = c.replace("e+", "e"),
                S = 0,
                (O = m.indexOf("e")) > 0 && ((S = +m.slice(O + 1)), (m = m.slice(0, O))),
                p >= 0 && ((S -= m.length - p - 1), (m = +(m.slice(0, p) + m.slice(p + 1)) + "")),
                O = 0;
              m.charCodeAt(m.length + O - 1) === 48;
            )
              --O;
            return (
              O !== 0 && ((S -= O), (m = m.slice(0, O))),
              S !== 0 && (m += "e" + S),
              (m.length < c.length ||
                (k &&
                  a > 1e12 &&
                  Math.floor(a) === a &&
                  (m = "0x" + a.toString(16)).length < c.length)) &&
                +m === a &&
                (c = m),
              c
            );
          }
          function mt(a, c) {
            return (a & -2) === 8232
              ? (c ? "u" : "\\u") + (a === 8232 ? "2028" : "2029")
              : a === 10 || a === 13
                ? (c ? "" : "\\") + (a === 10 ? "n" : "r")
                : String.fromCharCode(a);
          }
          function hi(a) {
            var c, p, m, S, O, F, D, z;
            if (((p = a.toString()), a.source)) {
              if (((c = p.match(/\/([^/]*)$/)), !c)) return p;
              for (m = c[1], p = "", D = !1, z = !1, S = 0, O = a.source.length; S < O; ++S)
                (F = a.source.charCodeAt(S)),
                  z
                    ? ((p += mt(F, z)), (z = !1))
                    : (D ? F === 93 && (D = !1) : F === 47 ? (p += "\\") : F === 91 && (D = !0),
                      (p += mt(F, z)),
                      (z = F === 92));
              return "/" + p + "/" + m;
            }
            return p;
          }
          function Nt(a, c) {
            var p;
            return a === 8
              ? "\\b"
              : a === 12
                ? "\\f"
                : a === 9
                  ? "\\t"
                  : ((p = a.toString(16).toUpperCase()),
                    _ || a > 255
                      ? "\\u" + "0000".slice(p.length) + p
                      : a === 0 && !d.code.isDecimalDigit(c)
                        ? "\\0"
                        : a === 11
                          ? "\\x0B"
                          : "\\x" + "00".slice(p.length) + p);
          }
          function Ut(a) {
            if (a === 92) return "\\\\";
            if (a === 10) return "\\n";
            if (a === 13) return "\\r";
            if (a === 8232) return "\\u2028";
            if (a === 8233) return "\\u2029";
            throw new Error("Incorrectly classified character");
          }
          function Lt(a) {
            var c, p, m, S;
            for (S = A === "double" ? '"' : "'", c = 0, p = a.length; c < p; ++c)
              if (((m = a.charCodeAt(c)), m === 39)) {
                S = '"';
                break;
              } else if (m === 34) {
                S = "'";
                break;
              } else m === 92 && ++c;
            return S + a + S;
          }
          function Gt(a) {
            var c = "",
              p,
              m,
              S,
              O = 0,
              F = 0,
              D,
              z;
            for (p = 0, m = a.length; p < m; ++p) {
              if (((S = a.charCodeAt(p)), S === 39)) ++O;
              else if (S === 34) ++F;
              else if (S === 47 && _) c += "\\";
              else if (d.code.isLineTerminator(S) || S === 92) {
                c += Ut(S);
                continue;
              } else if (
                !d.code.isIdentifierPartES5(S) &&
                ((_ && S < 32) || (!_ && !P && (S < 32 || S > 126)))
              ) {
                c += Nt(S, a.charCodeAt(p + 1));
                continue;
              }
              c += String.fromCharCode(S);
            }
            if (
              ((D = !(A === "double" || (A === "auto" && F < O))),
              (z = D ? "'" : '"'),
              !(D ? O : F))
            )
              return z + c + z;
            for (a = c, c = z, p = 0, m = a.length; p < m; ++p)
              (S = a.charCodeAt(p)),
                ((S === 39 && D) || (S === 34 && !D)) && (c += "\\"),
                (c += String.fromCharCode(S));
            return c + z;
          }
          function ze(a) {
            var c,
              p,
              m,
              S = "";
            for (c = 0, p = a.length; c < p; ++c) (m = a[c]), (S += Array.isArray(m) ? ze(m) : m);
            return S;
          }
          function fe(a, c) {
            if (!h) return Array.isArray(a) ? ze(a) : a;
            if (c == null) {
              if (a instanceof o) return a;
              c = {};
            }
            return c.loc == null
              ? new o(null, null, h, a, c.name || null)
              : new o(
                  c.loc.start.line,
                  c.loc.start.column,
                  h === !0 ? c.loc.source || null : h,
                  a,
                  c.name || null,
                );
          }
          function Pe() {
            return E || " ";
          }
          function $(a, c) {
            var p, m, S, O;
            return (
              (p = fe(a).toString()),
              p.length === 0
                ? [c]
                : ((m = fe(c).toString()),
                  m.length === 0
                    ? [a]
                    : ((S = p.charCodeAt(p.length - 1)),
                      (O = m.charCodeAt(0)),
                      ((S === 43 || S === 45) && S === O) ||
                      (d.code.isIdentifierPartES5(S) && d.code.isIdentifierPartES5(O)) ||
                      (S === 47 && O === 105)
                        ? [a, Pe(), c]
                        : d.code.isWhiteSpace(S) ||
                            d.code.isLineTerminator(S) ||
                            d.code.isWhiteSpace(O) ||
                            d.code.isLineTerminator(O)
                          ? [a, c]
                          : [a, E, c]))
            );
          }
          function ne(a) {
            return [g, a];
          }
          function pe(a) {
            var c;
            (c = g), (g += x), a(g), (g = c);
          }
          function Le(a) {
            var c;
            for (c = a.length - 1; c >= 0 && !d.code.isLineTerminator(a.charCodeAt(c)); --c);
            return a.length - 1 - c;
          }
          function Pi(a, c) {
            var p, m, S, O, F, D, z, re;
            for (
              p = a.split(/\r\n|[\r\n]/), D = Number.MAX_VALUE, m = 1, S = p.length;
              m < S;
              ++m
            ) {
              for (O = p[m], F = 0; F < O.length && d.code.isWhiteSpace(O.charCodeAt(F)); ) ++F;
              D > F && (D = F);
            }
            for (
              typeof c < "u"
                ? ((z = g), p[1][D] === "*" && (c += " "), (g = c))
                : (D & 1 && --D, (z = g)),
                m = 1,
                S = p.length;
              m < S;
              ++m
            )
              (re = fe(ne(p[m].slice(D)))), (p[m] = h ? re.join("") : re);
            return (
              (g = z),
              p.join(`
`)
            );
          }
          function Me(a, c) {
            if (a.type === "Line") {
              if (Ie(a.value)) return "//" + a.value;
              var p = "//" + a.value;
              return (
                V ||
                  (p += `
`),
                p
              );
            }
            return L.format.indent.adjustMultilineComment && /[\n\r]/.test(a.value)
              ? Pi("/*" + a.value + "*/", c)
              : "/*" + a.value + "*/";
          }
          function X(a, c) {
            var p, m, S, O, F, D, z, re, Ee, at, ot, Wt, zt, Ue;
            if (a.leadingComments && a.leadingComments.length > 0) {
              if (((O = c), V)) {
                for (
                  S = a.leadingComments[0],
                    c = [],
                    re = S.extendedRange,
                    Ee = S.range,
                    ot = I.substring(re[0], Ee[0]),
                    Ue = (ot.match(/\n/g) || []).length,
                    Ue > 0
                      ? (c.push(
                          Ze(
                            `
`,
                            Ue,
                          ),
                        ),
                        c.push(ne(Me(S))))
                      : (c.push(ot), c.push(Me(S))),
                    at = Ee,
                    p = 1,
                    m = a.leadingComments.length;
                  p < m;
                  p++
                )
                  (S = a.leadingComments[p]),
                    (Ee = S.range),
                    (Wt = I.substring(at[1], Ee[0])),
                    (Ue = (Wt.match(/\n/g) || []).length),
                    c.push(
                      Ze(
                        `
`,
                        Ue,
                      ),
                    ),
                    c.push(ne(Me(S))),
                    (at = Ee);
                (zt = I.substring(Ee[1], re[1])),
                  (Ue = (zt.match(/\n/g) || []).length),
                  c.push(
                    Ze(
                      `
`,
                      Ue,
                    ),
                  );
              } else
                for (
                  S = a.leadingComments[0],
                    c = [],
                    M &&
                      a.type === i.Program &&
                      a.body.length === 0 &&
                      c.push(`
`),
                    c.push(Me(S)),
                    Ie(fe(c).toString()) ||
                      c.push(`
`),
                    p = 1,
                    m = a.leadingComments.length;
                  p < m;
                  ++p
                )
                  (S = a.leadingComments[p]),
                    (z = [Me(S)]),
                    Ie(fe(z).toString()) ||
                      z.push(`
`),
                    c.push(ne(z));
              c.push(ne(O));
            }
            if (a.trailingComments)
              if (V)
                (S = a.trailingComments[0]),
                  (re = S.extendedRange),
                  (Ee = S.range),
                  (ot = I.substring(re[0], Ee[0])),
                  (Ue = (ot.match(/\n/g) || []).length),
                  Ue > 0
                    ? (c.push(
                        Ze(
                          `
`,
                          Ue,
                        ),
                      ),
                      c.push(ne(Me(S))))
                    : (c.push(ot), c.push(Me(S)));
              else
                for (
                  F = !Ie(fe(c).toString()),
                    D = Ze(" ", Le(fe([g, c, x]).toString())),
                    p = 0,
                    m = a.trailingComments.length;
                  p < m;
                  ++p
                )
                  (S = a.trailingComments[p]),
                    F
                      ? (p === 0 ? (c = [c, x]) : (c = [c, D]), c.push(Me(S, D)))
                      : (c = [c, ne(Me(S))]),
                    p !== m - 1 &&
                      !Ie(fe(c).toString()) &&
                      (c = [
                        c,
                        `
`,
                      ]);
            return c;
          }
          function $e(a, c, p) {
            var m,
              S = 0;
            for (m = a; m < c; m++)
              I[m] ===
                `
` && S++;
            for (m = 1; m < S; m++) p.push(N);
          }
          function ke(a, c, p) {
            return c < p ? ["(", a, ")"] : a;
          }
          function li(a) {
            var c, p, m;
            for (m = a.split(/\r\n|\n/), c = 1, p = m.length; c < p; c++) m[c] = N + g + m[c];
            return m;
          }
          function Ct(a, c) {
            var p, m, S;
            return (
              (p = a[L.verbatim]),
              typeof p == "string"
                ? (m = ke(li(p), r.Sequence, c))
                : ((m = li(p.content)),
                  (S = p.precedence != null ? p.precedence : r.Sequence),
                  (m = ke(m, S, c))),
              fe(m, a)
            );
          }
          function Ce() {}
          (Ce.prototype.maybeBlock = function (a, c) {
            var p, m;
            return (
              (m = !L.comment || !a.leadingComments),
              a.type === i.BlockStatement && m
                ? [E, this.generateStatement(a, c)]
                : a.type === i.EmptyStatement && m
                  ? ";"
                  : (pe(() => {
                      p = [N, ne(this.generateStatement(a, c))];
                    }),
                    p)
            );
          }),
            (Ce.prototype.maybeBlockSuffix = (a, c) => {
              var p = Ie(fe(c).toString());
              return a.type === i.BlockStatement && (!L.comment || !a.leadingComments) && !p
                ? [c, E]
                : p
                  ? [c, g]
                  : [c, N, g];
            });
          function Re(a) {
            return fe(a.name, a);
          }
          function Et(a, c) {
            return a.async ? "async" + (c ? Pe() : E) : "";
          }
          function nt(a) {
            var c = a.generator && !L.moz.starlessGenerator;
            return c ? "*" + E : "";
          }
          function Fe(a) {
            var c = a.value,
              p = "";
            return c.async && (p += Et(c, !a.computed)), c.generator && (p += nt(c) ? "*" : ""), p;
          }
          (Ce.prototype.generatePattern = function (a, c, p) {
            return a.type === i.Identifier ? Re(a) : this.generateExpression(a, c, p);
          }),
            (Ce.prototype.generateFunctionParams = function (a) {
              var c, p, m, S;
              if (
                ((S = !1),
                a.type === i.ArrowFunctionExpression &&
                  !a.rest &&
                  (!a.defaults || a.defaults.length === 0) &&
                  a.params.length === 1 &&
                  a.params[0].type === i.Identifier)
              )
                m = [Et(a, !0), Re(a.params[0])];
              else {
                for (
                  m = a.type === i.ArrowFunctionExpression ? [Et(a, !1)] : [],
                    m.push("("),
                    a.defaults && (S = !0),
                    c = 0,
                    p = a.params.length;
                  c < p;
                  ++c
                )
                  S && a.defaults[c]
                    ? m.push(
                        this.generateAssignment(a.params[c], a.defaults[c], "=", r.Assignment, W),
                      )
                    : m.push(this.generatePattern(a.params[c], r.Assignment, W)),
                    c + 1 < p && m.push("," + E);
                a.rest && (a.params.length && m.push("," + E), m.push("..."), m.push(Re(a.rest))),
                  m.push(")");
              }
              return m;
            }),
            (Ce.prototype.generateFunctionBody = function (a) {
              var c, p;
              return (
                (c = this.generateFunctionParams(a)),
                a.type === i.ArrowFunctionExpression && (c.push(E), c.push("=>")),
                a.expression
                  ? (c.push(E),
                    (p = this.generateExpression(a.body, r.Assignment, W)),
                    p.toString().charAt(0) === "{" && (p = ["(", p, ")"]),
                    c.push(p))
                  : c.push(this.maybeBlock(a.body, rt)),
                c
              );
            }),
            (Ce.prototype.generateIterationForStatement = function (a, c, p) {
              var m = ["for" + (c.await ? Pe() + "await" : "") + E + "("];
              return (
                pe(() => {
                  c.left.type === i.VariableDeclaration
                    ? pe(() => {
                        m.push(c.left.kind + Pe()),
                          m.push(this.generateStatement(c.left.declarations[0], Pt));
                      })
                    : m.push(this.generateExpression(c.left, r.Call, W)),
                    (m = $(m, a)),
                    (m = [$(m, this.generateExpression(c.right, r.Assignment, W)), ")"]);
                }),
                m.push(this.maybeBlock(c.body, p)),
                m
              );
            }),
            (Ce.prototype.generatePropertyKey = function (a, c) {
              var p = [];
              return (
                c && p.push("["),
                p.push(this.generateExpression(a, r.Assignment, W)),
                c && p.push("]"),
                p
              );
            }),
            (Ce.prototype.generateAssignment = function (a, c, p, m, S) {
              return (
                r.Assignment < m && (S |= J),
                ke(
                  [
                    this.generateExpression(a, r.Call, S),
                    E + p + E,
                    this.generateExpression(c, r.Assignment, S),
                  ],
                  r.Assignment,
                  m,
                )
              );
            }),
            (Ce.prototype.semicolon = (a) => (!B && a & oe ? "" : ";")),
            (Ce.Statement = {
              BlockStatement: function (a, c) {
                var p,
                  m,
                  S = ["{", N];
                return (
                  pe(() => {
                    a.body.length === 0 &&
                      V &&
                      ((p = a.range),
                      p[1] - p[0] > 2 &&
                        ((m = I.substring(p[0] + 1, p[1] - 1)),
                        m[0] ===
                          `
` && (S = ["{"]),
                        S.push(m)));
                    var F, D, z, re;
                    for (re = me, c & ve && (re |= ye), F = 0, D = a.body.length; F < D; ++F)
                      V &&
                        (F === 0 &&
                          (a.body[0].leadingComments &&
                            ((p = a.body[0].leadingComments[0].extendedRange),
                            (m = I.substring(p[0], p[1])),
                            m[0] ===
                              `
` && (S = ["{"])),
                          a.body[0].leadingComments || $e(a.range[0], a.body[0].range[0], S)),
                        F > 0 &&
                          !a.body[F - 1].trailingComments &&
                          !a.body[F].leadingComments &&
                          $e(a.body[F - 1].range[1], a.body[F].range[0], S)),
                        F === D - 1 && (re |= oe),
                        a.body[F].leadingComments && V
                          ? (z = this.generateStatement(a.body[F], re))
                          : (z = ne(this.generateStatement(a.body[F], re))),
                        S.push(z),
                        Ie(fe(z).toString()) ||
                          (V && F < D - 1 && a.body[F + 1].leadingComments) ||
                          S.push(N),
                        V &&
                          F === D - 1 &&
                          (a.body[F].trailingComments || $e(a.body[F].range[1], a.range[1], S));
                  }),
                  S.push(ne("}")),
                  S
                );
              },
              BreakStatement: function (a, c) {
                return a.label
                  ? "break " + a.label.name + this.semicolon(c)
                  : "break" + this.semicolon(c);
              },
              ContinueStatement: function (a, c) {
                return a.label
                  ? "continue " + a.label.name + this.semicolon(c)
                  : "continue" + this.semicolon(c);
              },
              ClassBody: function (a, c) {
                var p = ["{", N];
                return (
                  pe((S) => {
                    var O, F;
                    for (O = 0, F = a.body.length; O < F; ++O)
                      p.push(S),
                        p.push(this.generateExpression(a.body[O], r.Sequence, W)),
                        O + 1 < F && p.push(N);
                  }),
                  Ie(fe(p).toString()) || p.push(N),
                  p.push(g),
                  p.push("}"),
                  p
                );
              },
              ClassDeclaration: function (a, c) {
                var p, m;
                return (
                  (p = ["class"]),
                  a.id && (p = $(p, this.generateExpression(a.id, r.Sequence, W))),
                  a.superClass &&
                    ((m = $("extends", this.generateExpression(a.superClass, r.Unary, W))),
                    (p = $(p, m))),
                  p.push(E),
                  p.push(this.generateStatement(a.body, We)),
                  p
                );
              },
              DirectiveStatement: function (a, c) {
                return L.raw && a.raw
                  ? a.raw + this.semicolon(c)
                  : Lt(a.directive) + this.semicolon(c);
              },
              DoWhileStatement: function (a, c) {
                var p = $("do", this.maybeBlock(a.body, me));
                return (
                  (p = this.maybeBlockSuffix(a.body, p)),
                  $(p, [
                    "while" + E + "(",
                    this.generateExpression(a.test, r.Sequence, W),
                    ")" + this.semicolon(c),
                  ])
                );
              },
              CatchClause: function (a, c) {
                var p;
                return (
                  pe(() => {
                    var S;
                    a.param
                      ? ((p = [
                          "catch" + E + "(",
                          this.generateExpression(a.param, r.Sequence, W),
                          ")",
                        ]),
                        a.guard &&
                          ((S = this.generateExpression(a.guard, r.Sequence, W)),
                          p.splice(2, 0, " if ", S)))
                      : (p = ["catch"]);
                  }),
                  p.push(this.maybeBlock(a.body, me)),
                  p
                );
              },
              DebuggerStatement: function (a, c) {
                return "debugger" + this.semicolon(c);
              },
              EmptyStatement: (a, c) => ";",
              ExportDefaultDeclaration: function (a, c) {
                var p = ["export"],
                  m;
                return (
                  (m = c & oe ? We : me),
                  (p = $(p, "default")),
                  K(a.declaration)
                    ? (p = $(p, this.generateStatement(a.declaration, m)))
                    : (p = $(
                        p,
                        this.generateExpression(a.declaration, r.Assignment, W) + this.semicolon(c),
                      )),
                  p
                );
              },
              ExportNamedDeclaration: function (a, c) {
                var p = ["export"],
                  m;
                return (
                  (m = c & oe ? We : me),
                  a.declaration
                    ? $(p, this.generateStatement(a.declaration, m))
                    : (a.specifiers &&
                        (a.specifiers.length === 0
                          ? (p = $(p, "{" + E + "}"))
                          : a.specifiers[0].type === i.ExportBatchSpecifier
                            ? (p = $(p, this.generateExpression(a.specifiers[0], r.Sequence, W)))
                            : ((p = $(p, "{")),
                              pe((O) => {
                                var F, D;
                                for (p.push(N), F = 0, D = a.specifiers.length; F < D; ++F)
                                  p.push(O),
                                    p.push(this.generateExpression(a.specifiers[F], r.Sequence, W)),
                                    F + 1 < D && p.push("," + N);
                              }),
                              Ie(fe(p).toString()) || p.push(N),
                              p.push(g + "}")),
                        a.source
                          ? (p = $(p, [
                              "from" + E,
                              this.generateExpression(a.source, r.Sequence, W),
                              this.semicolon(c),
                            ]))
                          : p.push(this.semicolon(c))),
                      p)
                );
              },
              ExportAllDeclaration: function (a, c) {
                return [
                  "export" + E,
                  "*" + E,
                  "from" + E,
                  this.generateExpression(a.source, r.Sequence, W),
                  this.semicolon(c),
                ];
              },
              ExpressionStatement: function (a, c) {
                var p, m;
                function S(D) {
                  var z;
                  return D.slice(0, 5) !== "class"
                    ? !1
                    : ((z = D.charCodeAt(5)),
                      z === 123 || d.code.isWhiteSpace(z) || d.code.isLineTerminator(z));
                }
                function O(D) {
                  var z;
                  return D.slice(0, 8) !== "function"
                    ? !1
                    : ((z = D.charCodeAt(8)),
                      z === 40 || d.code.isWhiteSpace(z) || z === 42 || d.code.isLineTerminator(z));
                }
                function F(D) {
                  var z, re, Ee;
                  if (D.slice(0, 5) !== "async" || !d.code.isWhiteSpace(D.charCodeAt(5))) return !1;
                  for (
                    re = 6, Ee = D.length;
                    re < Ee && d.code.isWhiteSpace(D.charCodeAt(re));
                    ++re
                  );
                  return re === Ee || D.slice(re, re + 8) !== "function"
                    ? !1
                    : ((z = D.charCodeAt(re + 8)),
                      z === 40 || d.code.isWhiteSpace(z) || z === 42 || d.code.isLineTerminator(z));
                }
                return (
                  (p = [this.generateExpression(a.expression, r.Sequence, W)]),
                  (m = fe(p).toString()),
                  m.charCodeAt(0) === 123 ||
                  S(m) ||
                  O(m) ||
                  F(m) ||
                  (G &&
                    c & ye &&
                    a.expression.type === i.Literal &&
                    typeof a.expression.value == "string")
                    ? (p = ["(", p, ")" + this.semicolon(c)])
                    : p.push(this.semicolon(c)),
                  p
                );
              },
              ImportDeclaration: function (a, c) {
                var p, m;
                return a.specifiers.length === 0
                  ? [
                      "import",
                      E,
                      this.generateExpression(a.source, r.Sequence, W),
                      this.semicolon(c),
                    ]
                  : ((p = ["import"]),
                    (m = 0),
                    a.specifiers[m].type === i.ImportDefaultSpecifier &&
                      ((p = $(p, [this.generateExpression(a.specifiers[m], r.Sequence, W)])), ++m),
                    a.specifiers[m] &&
                      (m !== 0 && p.push(","),
                      a.specifiers[m].type === i.ImportNamespaceSpecifier
                        ? (p = $(p, [E, this.generateExpression(a.specifiers[m], r.Sequence, W)]))
                        : (p.push(E + "{"),
                          a.specifiers.length - m === 1
                            ? (p.push(E),
                              p.push(this.generateExpression(a.specifiers[m], r.Sequence, W)),
                              p.push(E + "}" + E))
                            : (pe((O) => {
                                var F, D;
                                for (p.push(N), F = m, D = a.specifiers.length; F < D; ++F)
                                  p.push(O),
                                    p.push(this.generateExpression(a.specifiers[F], r.Sequence, W)),
                                    F + 1 < D && p.push("," + N);
                              }),
                              Ie(fe(p).toString()) || p.push(N),
                              p.push(g + "}" + E)))),
                    (p = $(p, [
                      "from" + E,
                      this.generateExpression(a.source, r.Sequence, W),
                      this.semicolon(c),
                    ])),
                    p);
              },
              VariableDeclarator: function (a, c) {
                var p = c & J ? W : Ne;
                return a.init
                  ? [
                      this.generateExpression(a.id, r.Assignment, p),
                      E,
                      "=",
                      E,
                      this.generateExpression(a.init, r.Assignment, p),
                    ]
                  : this.generatePattern(a.id, r.Assignment, p);
              },
              VariableDeclaration: function (a, c) {
                var p,
                  m,
                  S,
                  O,
                  F,
                  D = this;
                (p = [a.kind]), (F = c & J ? me : Pt);
                function z() {
                  for (
                    O = a.declarations[0],
                      L.comment && O.leadingComments
                        ? (p.push(`
`),
                          p.push(ne(D.generateStatement(O, F))))
                        : (p.push(Pe()), p.push(D.generateStatement(O, F))),
                      m = 1,
                      S = a.declarations.length;
                    m < S;
                    ++m
                  )
                    (O = a.declarations[m]),
                      L.comment && O.leadingComments
                        ? (p.push("," + N), p.push(ne(D.generateStatement(O, F))))
                        : (p.push("," + E), p.push(D.generateStatement(O, F)));
                }
                return a.declarations.length > 1 ? pe(z) : z(), p.push(this.semicolon(c)), p;
              },
              ThrowStatement: function (a, c) {
                return [
                  $("throw", this.generateExpression(a.argument, r.Sequence, W)),
                  this.semicolon(c),
                ];
              },
              TryStatement: function (a, c) {
                var p, m, S, O;
                if (
                  ((p = ["try", this.maybeBlock(a.block, me)]),
                  (p = this.maybeBlockSuffix(a.block, p)),
                  a.handlers)
                )
                  for (m = 0, S = a.handlers.length; m < S; ++m)
                    (p = $(p, this.generateStatement(a.handlers[m], me))),
                      (a.finalizer || m + 1 !== S) &&
                        (p = this.maybeBlockSuffix(a.handlers[m].body, p));
                else {
                  for (O = a.guardedHandlers || [], m = 0, S = O.length; m < S; ++m)
                    (p = $(p, this.generateStatement(O[m], me))),
                      (a.finalizer || m + 1 !== S) && (p = this.maybeBlockSuffix(O[m].body, p));
                  if (a.handler)
                    if (Array.isArray(a.handler))
                      for (m = 0, S = a.handler.length; m < S; ++m)
                        (p = $(p, this.generateStatement(a.handler[m], me))),
                          (a.finalizer || m + 1 !== S) &&
                            (p = this.maybeBlockSuffix(a.handler[m].body, p));
                    else
                      (p = $(p, this.generateStatement(a.handler, me))),
                        a.finalizer && (p = this.maybeBlockSuffix(a.handler.body, p));
                }
                return a.finalizer && (p = $(p, ["finally", this.maybeBlock(a.finalizer, me)])), p;
              },
              SwitchStatement: function (a, c) {
                var p, m, S, O, F;
                if (
                  (pe(() => {
                    p = [
                      "switch" + E + "(",
                      this.generateExpression(a.discriminant, r.Sequence, W),
                      ")" + E + "{" + N,
                    ];
                  }),
                  a.cases)
                )
                  for (F = me, S = 0, O = a.cases.length; S < O; ++S)
                    S === O - 1 && (F |= oe),
                      (m = ne(this.generateStatement(a.cases[S], F))),
                      p.push(m),
                      Ie(fe(m).toString()) || p.push(N);
                return p.push(ne("}")), p;
              },
              SwitchCase: function (a, c) {
                var p, m, S, O, F;
                return (
                  pe(() => {
                    for (
                      a.test
                        ? (p = [$("case", this.generateExpression(a.test, r.Sequence, W)), ":"])
                        : (p = ["default:"]),
                        S = 0,
                        O = a.consequent.length,
                        O &&
                          a.consequent[0].type === i.BlockStatement &&
                          ((m = this.maybeBlock(a.consequent[0], me)), p.push(m), (S = 1)),
                        S !== O && !Ie(fe(p).toString()) && p.push(N),
                        F = me;
                      S < O;
                      ++S
                    )
                      S === O - 1 && c & oe && (F |= oe),
                        (m = ne(this.generateStatement(a.consequent[S], F))),
                        p.push(m),
                        S + 1 !== O && !Ie(fe(m).toString()) && p.push(N);
                  }),
                  p
                );
              },
              IfStatement: function (a, c) {
                var p, m, S;
                return (
                  pe(() => {
                    p = ["if" + E + "(", this.generateExpression(a.test, r.Sequence, W), ")"];
                  }),
                  (S = c & oe),
                  (m = me),
                  S && (m |= oe),
                  a.alternate
                    ? (p.push(this.maybeBlock(a.consequent, me)),
                      (p = this.maybeBlockSuffix(a.consequent, p)),
                      a.alternate.type === i.IfStatement
                        ? (p = $(p, ["else ", this.generateStatement(a.alternate, m)]))
                        : (p = $(p, $("else", this.maybeBlock(a.alternate, m)))))
                    : p.push(this.maybeBlock(a.consequent, m)),
                  p
                );
              },
              ForStatement: function (a, c) {
                var p;
                return (
                  pe(() => {
                    (p = ["for" + E + "("]),
                      a.init
                        ? a.init.type === i.VariableDeclaration
                          ? p.push(this.generateStatement(a.init, Pt))
                          : (p.push(this.generateExpression(a.init, r.Sequence, Ne)), p.push(";"))
                        : p.push(";"),
                      a.test && (p.push(E), p.push(this.generateExpression(a.test, r.Sequence, W))),
                      p.push(";"),
                      a.update &&
                        (p.push(E), p.push(this.generateExpression(a.update, r.Sequence, W))),
                      p.push(")");
                  }),
                  p.push(this.maybeBlock(a.body, c & oe ? We : me)),
                  p
                );
              },
              ForInStatement: function (a, c) {
                return this.generateIterationForStatement("in", a, c & oe ? We : me);
              },
              ForOfStatement: function (a, c) {
                return this.generateIterationForStatement("of", a, c & oe ? We : me);
              },
              LabeledStatement: function (a, c) {
                return [a.label.name + ":", this.maybeBlock(a.body, c & oe ? We : me)];
              },
              Program: function (a, c) {
                var p, m, S, O, F;
                for (
                  O = a.body.length,
                    p = [
                      M && O > 0
                        ? `
`
                        : "",
                    ],
                    F = it,
                    S = 0;
                  S < O;
                  ++S
                )
                  !M && S === O - 1 && (F |= oe),
                    V &&
                      (S === 0 &&
                        (a.body[0].leadingComments || $e(a.range[0], a.body[S].range[0], p)),
                      S > 0 &&
                        !a.body[S - 1].trailingComments &&
                        !a.body[S].leadingComments &&
                        $e(a.body[S - 1].range[1], a.body[S].range[0], p)),
                    (m = ne(this.generateStatement(a.body[S], F))),
                    p.push(m),
                    S + 1 < O &&
                      !Ie(fe(m).toString()) &&
                      ((V && a.body[S + 1].leadingComments) || p.push(N)),
                    V &&
                      S === O - 1 &&
                      (a.body[S].trailingComments || $e(a.body[S].range[1], a.range[1], p));
                return p;
              },
              FunctionDeclaration: function (a, c) {
                return [
                  Et(a, !0),
                  "function",
                  nt(a) || Pe(),
                  a.id ? Re(a.id) : "",
                  this.generateFunctionBody(a),
                ];
              },
              ReturnStatement: function (a, c) {
                return a.argument
                  ? [
                      $("return", this.generateExpression(a.argument, r.Sequence, W)),
                      this.semicolon(c),
                    ]
                  : ["return" + this.semicolon(c)];
              },
              WhileStatement: function (a, c) {
                var p;
                return (
                  pe(() => {
                    p = ["while" + E + "(", this.generateExpression(a.test, r.Sequence, W), ")"];
                  }),
                  p.push(this.maybeBlock(a.body, c & oe ? We : me)),
                  p
                );
              },
              WithStatement: function (a, c) {
                var p;
                return (
                  pe(() => {
                    p = ["with" + E + "(", this.generateExpression(a.object, r.Sequence, W), ")"];
                  }),
                  p.push(this.maybeBlock(a.body, c & oe ? We : me)),
                  p
                );
              },
            }),
            St(Ce.prototype, Ce.Statement),
            (Ce.Expression = {
              SequenceExpression: function (a, c, p) {
                var m, S, O;
                for (
                  r.Sequence < c && (p |= J), m = [], S = 0, O = a.expressions.length;
                  S < O;
                  ++S
                )
                  m.push(this.generateExpression(a.expressions[S], r.Assignment, p)),
                    S + 1 < O && m.push("," + E);
                return ke(m, r.Sequence, c);
              },
              AssignmentExpression: function (a, c, p) {
                return this.generateAssignment(a.left, a.right, a.operator, c, p);
              },
              ArrowFunctionExpression: function (a, c, p) {
                return ke(this.generateFunctionBody(a), r.ArrowFunction, c);
              },
              ConditionalExpression: function (a, c, p) {
                return (
                  r.Conditional < c && (p |= J),
                  ke(
                    [
                      this.generateExpression(a.test, r.Coalesce, p),
                      E + "?" + E,
                      this.generateExpression(a.consequent, r.Assignment, p),
                      E + ":" + E,
                      this.generateExpression(a.alternate, r.Assignment, p),
                    ],
                    r.Conditional,
                    c,
                  )
                );
              },
              LogicalExpression: function (a, c, p) {
                return a.operator === "??" && (p |= we), this.BinaryExpression(a, c, p);
              },
              BinaryExpression: function (a, c, p) {
                var m, S, O, F, D, z;
                return (
                  (F = n[a.operator]),
                  (S = a.operator === "**" ? r.Postfix : F),
                  (O = a.operator === "**" ? F : F + 1),
                  F < c && (p |= J),
                  (D = this.generateExpression(a.left, S, p)),
                  (z = D.toString()),
                  z.charCodeAt(z.length - 1) === 47 &&
                  d.code.isIdentifierPartES5(a.operator.charCodeAt(0))
                    ? (m = [D, Pe(), a.operator])
                    : (m = $(D, a.operator)),
                  (D = this.generateExpression(a.right, O, p)),
                  (a.operator === "/" && D.toString().charAt(0) === "/") ||
                  (a.operator.slice(-1) === "<" && D.toString().slice(0, 3) === "!--")
                    ? (m.push(Pe()), m.push(D))
                    : (m = $(m, D)),
                  a.operator === "in" && !(p & J)
                    ? ["(", m, ")"]
                    : (a.operator === "||" || a.operator === "&&") && p & we
                      ? ["(", m, ")"]
                      : ke(m, F, c)
                );
              },
              CallExpression: function (a, c, p) {
                var m, S, O;
                for (
                  m = [this.generateExpression(a.callee, r.Call, pt)],
                    a.optional && m.push("?."),
                    m.push("("),
                    S = 0,
                    O = a.arguments.length;
                  S < O;
                  ++S
                )
                  m.push(this.generateExpression(a.arguments[S], r.Assignment, W)),
                    S + 1 < O && m.push("," + E);
                return m.push(")"), p & he ? ke(m, r.Call, c) : ["(", m, ")"];
              },
              ChainExpression: function (a, c, p) {
                r.OptionalChaining < c && (p |= he);
                var m = this.generateExpression(a.expression, r.OptionalChaining, p);
                return ke(m, r.OptionalChaining, c);
              },
              NewExpression: function (a, c, p) {
                var m, S, O, F, D;
                if (
                  ((S = a.arguments.length),
                  (D = p & _e && !w && S === 0 ? qe : je),
                  (m = $("new", this.generateExpression(a.callee, r.New, D))),
                  !(p & _e) || w || S > 0)
                ) {
                  for (m.push("("), O = 0, F = S; O < F; ++O)
                    m.push(this.generateExpression(a.arguments[O], r.Assignment, W)),
                      O + 1 < F && m.push("," + E);
                  m.push(")");
                }
                return ke(m, r.New, c);
              },
              MemberExpression: function (a, c, p) {
                var m, S;
                return (
                  (m = [this.generateExpression(a.object, r.Call, p & he ? pt : je)]),
                  a.computed
                    ? (a.optional && m.push("?."),
                      m.push("["),
                      m.push(this.generateExpression(a.property, r.Sequence, p & he ? W : qe)),
                      m.push("]"))
                    : (!a.optional &&
                        a.object.type === i.Literal &&
                        typeof a.object.value == "number" &&
                        ((S = fe(m).toString()),
                        S.indexOf(".") < 0 &&
                          !/[eExX]/.test(S) &&
                          d.code.isDecimalDigit(S.charCodeAt(S.length - 1)) &&
                          !(S.length >= 2 && S.charCodeAt(0) === 48) &&
                          m.push(" ")),
                      m.push(a.optional ? "?." : "."),
                      m.push(Re(a.property))),
                  ke(m, r.Member, c)
                );
              },
              MetaProperty: (a, c, p) => {
                var m;
                return (
                  (m = []),
                  m.push(typeof a.meta == "string" ? a.meta : Re(a.meta)),
                  m.push("."),
                  m.push(typeof a.property == "string" ? a.property : Re(a.property)),
                  ke(m, r.Member, c)
                );
              },
              UnaryExpression: function (a, c, p) {
                var m, S, O, F, D;
                return (
                  (S = this.generateExpression(a.argument, r.Unary, W)),
                  E === ""
                    ? (m = $(a.operator, S))
                    : ((m = [a.operator]),
                      a.operator.length > 2
                        ? (m = $(m, S))
                        : ((F = fe(m).toString()),
                          (D = F.charCodeAt(F.length - 1)),
                          (O = S.toString().charCodeAt(0)),
                          (((D === 43 || D === 45) && D === O) ||
                            (d.code.isIdentifierPartES5(D) && d.code.isIdentifierPartES5(O))) &&
                            m.push(Pe()),
                          m.push(S))),
                  ke(m, r.Unary, c)
                );
              },
              YieldExpression: function (a, c, p) {
                var m;
                return (
                  a.delegate ? (m = "yield*") : (m = "yield"),
                  a.argument && (m = $(m, this.generateExpression(a.argument, r.Yield, W))),
                  ke(m, r.Yield, c)
                );
              },
              AwaitExpression: function (a, c, p) {
                var m = $(
                  a.all ? "await*" : "await",
                  this.generateExpression(a.argument, r.Await, W),
                );
                return ke(m, r.Await, c);
              },
              UpdateExpression: function (a, c, p) {
                return a.prefix
                  ? ke([a.operator, this.generateExpression(a.argument, r.Unary, W)], r.Unary, c)
                  : ke(
                      [this.generateExpression(a.argument, r.Postfix, W), a.operator],
                      r.Postfix,
                      c,
                    );
              },
              FunctionExpression: function (a, c, p) {
                var m = [Et(a, !0), "function"];
                return (
                  a.id ? (m.push(nt(a) || Pe()), m.push(Re(a.id))) : m.push(nt(a) || E),
                  m.push(this.generateFunctionBody(a)),
                  m
                );
              },
              ArrayPattern: function (a, c, p) {
                return this.ArrayExpression(a, c, p, !0);
              },
              ArrayExpression: function (a, c, p, m) {
                var S, O;
                return a.elements.length
                  ? ((O = m ? !1 : a.elements.length > 1),
                    (S = ["[", O ? N : ""]),
                    pe((D) => {
                      var z, re;
                      for (z = 0, re = a.elements.length; z < re; ++z)
                        a.elements[z]
                          ? (S.push(O ? D : ""),
                            S.push(this.generateExpression(a.elements[z], r.Assignment, W)))
                          : (O && S.push(D), z + 1 === re && S.push(",")),
                          z + 1 < re && S.push("," + (O ? N : E));
                    }),
                    O && !Ie(fe(S).toString()) && S.push(N),
                    S.push(O ? g : ""),
                    S.push("]"),
                    S)
                  : "[]";
              },
              RestElement: function (a, c, p) {
                return "..." + this.generatePattern(a.argument);
              },
              ClassExpression: function (a, c, p) {
                var m, S;
                return (
                  (m = ["class"]),
                  a.id && (m = $(m, this.generateExpression(a.id, r.Sequence, W))),
                  a.superClass &&
                    ((S = $("extends", this.generateExpression(a.superClass, r.Unary, W))),
                    (m = $(m, S))),
                  m.push(E),
                  m.push(this.generateStatement(a.body, We)),
                  m
                );
              },
              MethodDefinition: function (a, c, p) {
                var m, S;
                return (
                  a.static ? (m = ["static" + E]) : (m = []),
                  a.kind === "get" || a.kind === "set"
                    ? (S = [
                        $(a.kind, this.generatePropertyKey(a.key, a.computed)),
                        this.generateFunctionBody(a.value),
                      ])
                    : (S = [
                        Fe(a),
                        this.generatePropertyKey(a.key, a.computed),
                        this.generateFunctionBody(a.value),
                      ]),
                  $(m, S)
                );
              },
              Property: function (a, c, p) {
                return a.kind === "get" || a.kind === "set"
                  ? [
                      a.kind,
                      Pe(),
                      this.generatePropertyKey(a.key, a.computed),
                      this.generateFunctionBody(a.value),
                    ]
                  : a.shorthand
                    ? a.value.type === "AssignmentPattern"
                      ? this.AssignmentPattern(a.value, r.Sequence, W)
                      : this.generatePropertyKey(a.key, a.computed)
                    : a.method
                      ? [
                          Fe(a),
                          this.generatePropertyKey(a.key, a.computed),
                          this.generateFunctionBody(a.value),
                        ]
                      : [
                          this.generatePropertyKey(a.key, a.computed),
                          ":" + E,
                          this.generateExpression(a.value, r.Assignment, W),
                        ];
              },
              ObjectExpression: function (a, c, p) {
                var m, S, O;
                return a.properties.length
                  ? ((m = a.properties.length > 1),
                    pe(() => {
                      O = this.generateExpression(a.properties[0], r.Sequence, W);
                    }),
                    !m && !qt(fe(O).toString())
                      ? ["{", E, O, E, "}"]
                      : (pe((D) => {
                          var z, re;
                          if (((S = ["{", N, D, O]), m))
                            for (S.push("," + N), z = 1, re = a.properties.length; z < re; ++z)
                              S.push(D),
                                S.push(this.generateExpression(a.properties[z], r.Sequence, W)),
                                z + 1 < re && S.push("," + N);
                        }),
                        Ie(fe(S).toString()) || S.push(N),
                        S.push(g),
                        S.push("}"),
                        S))
                  : "{}";
              },
              AssignmentPattern: function (a, c, p) {
                return this.generateAssignment(a.left, a.right, "=", c, p);
              },
              ObjectPattern: function (a, c, p) {
                var m, S, O, F, D;
                if (!a.properties.length) return "{}";
                if (((F = !1), a.properties.length === 1))
                  (D = a.properties[0]),
                    D.type === i.Property && D.value.type !== i.Identifier && (F = !0);
                else
                  for (S = 0, O = a.properties.length; S < O; ++S)
                    if (((D = a.properties[S]), D.type === i.Property && !D.shorthand)) {
                      F = !0;
                      break;
                    }
                return (
                  (m = ["{", F ? N : ""]),
                  pe((re) => {
                    var Ee, at;
                    for (Ee = 0, at = a.properties.length; Ee < at; ++Ee)
                      m.push(F ? re : ""),
                        m.push(this.generateExpression(a.properties[Ee], r.Sequence, W)),
                        Ee + 1 < at && m.push("," + (F ? N : E));
                  }),
                  F && !Ie(fe(m).toString()) && m.push(N),
                  m.push(F ? g : ""),
                  m.push("}"),
                  m
                );
              },
              ThisExpression: (a, c, p) => "this",
              Super: (a, c, p) => "super",
              Identifier: (a, c, p) => Re(a),
              ImportDefaultSpecifier: (a, c, p) => Re(a.id || a.local),
              ImportNamespaceSpecifier: (a, c, p) => {
                var m = ["*"],
                  S = a.id || a.local;
                return S && m.push(E + "as" + Pe() + Re(S)), m;
              },
              ImportSpecifier: (a, c, p) => {
                var m = a.imported,
                  S = [m.name],
                  O = a.local;
                return O && O.name !== m.name && S.push(Pe() + "as" + Pe() + Re(O)), S;
              },
              ExportSpecifier: (a, c, p) => {
                var m = a.local,
                  S = [m.name],
                  O = a.exported;
                return O && O.name !== m.name && S.push(Pe() + "as" + Pe() + Re(O)), S;
              },
              Literal: (a, c, p) => {
                var m;
                if (Object.hasOwn(a, "raw") && y && L.raw)
                  try {
                    if (
                      ((m = y(a.raw).body[0].expression),
                      m.type === i.Literal && m.value === a.value)
                    )
                      return a.raw;
                  } catch {}
                return a.regex
                  ? "/" + a.regex.pattern + "/" + a.regex.flags
                  : typeof a.value == "bigint"
                    ? a.value.toString() + "n"
                    : a.bigint
                      ? a.bigint + "n"
                      : a.value === null
                        ? "null"
                        : typeof a.value == "string"
                          ? Gt(a.value)
                          : typeof a.value == "number"
                            ? st(a.value)
                            : typeof a.value == "boolean"
                              ? a.value
                                ? "true"
                                : "false"
                              : hi(a.value);
              },
              GeneratorExpression: function (a, c, p) {
                return this.ComprehensionExpression(a, c, p);
              },
              ComprehensionExpression: function (a, c, p) {
                var m, S, O, F;
                return (
                  (m = a.type === i.GeneratorExpression ? ["("] : ["["]),
                  L.moz.comprehensionExpressionStartsWithAssignment &&
                    ((F = this.generateExpression(a.body, r.Assignment, W)), m.push(F)),
                  a.blocks &&
                    pe(() => {
                      for (S = 0, O = a.blocks.length; S < O; ++S)
                        (F = this.generateExpression(a.blocks[S], r.Sequence, W)),
                          S > 0 || L.moz.comprehensionExpressionStartsWithAssignment
                            ? (m = $(m, F))
                            : m.push(F);
                    }),
                  a.filter &&
                    ((m = $(m, "if" + E)),
                    (F = this.generateExpression(a.filter, r.Sequence, W)),
                    (m = $(m, ["(", F, ")"]))),
                  L.moz.comprehensionExpressionStartsWithAssignment ||
                    ((F = this.generateExpression(a.body, r.Assignment, W)), (m = $(m, F))),
                  m.push(a.type === i.GeneratorExpression ? ")" : "]"),
                  m
                );
              },
              ComprehensionBlock: function (a, c, p) {
                var m;
                return (
                  a.left.type === i.VariableDeclaration
                    ? (m = [a.left.kind, Pe(), this.generateStatement(a.left.declarations[0], Pt)])
                    : (m = this.generateExpression(a.left, r.Call, W)),
                  (m = $(m, a.of ? "of" : "in")),
                  (m = $(m, this.generateExpression(a.right, r.Sequence, W))),
                  ["for" + E + "(", m, ")"]
                );
              },
              SpreadElement: function (a, c, p) {
                return ["...", this.generateExpression(a.argument, r.Assignment, W)];
              },
              TaggedTemplateExpression: function (a, c, p) {
                var m = pt;
                p & he || (m = je);
                var S = [
                  this.generateExpression(a.tag, r.Call, m),
                  this.generateExpression(a.quasi, r.Primary, dt),
                ];
                return ke(S, r.TaggedTemplate, c);
              },
              TemplateElement: (a, c, p) => a.value.raw,
              TemplateLiteral: function (a, c, p) {
                var m, S, O;
                for (m = ["`"], S = 0, O = a.quasis.length; S < O; ++S)
                  m.push(this.generateExpression(a.quasis[S], r.Primary, W)),
                    S + 1 < O &&
                      (m.push("${" + E),
                      m.push(this.generateExpression(a.expressions[S], r.Sequence, W)),
                      m.push(E + "}"));
                return m.push("`"), m;
              },
              ModuleSpecifier: function (a, c, p) {
                return this.Literal(a, c, p);
              },
              ImportExpression: function (a, c, p) {
                return ke(
                  ["import(", this.generateExpression(a.source, r.Assignment, W), ")"],
                  r.Call,
                  c,
                );
              },
            }),
            St(Ce.prototype, Ce.Expression),
            (Ce.prototype.generateExpression = function (a, c, p) {
              var m, S;
              return (
                (S = a.type || i.Property),
                L.verbatim && Object.hasOwn(a, L.verbatim)
                  ? Ct(a, c)
                  : ((m = this[S](a, c, p)), L.comment && (m = X(a, m)), fe(m, a))
              );
            }),
            (Ce.prototype.generateStatement = function (a, c) {
              var p, m;
              return (
                (p = this[a.type](a, c)),
                L.comment && (p = X(a, p)),
                (m = fe(p).toString()),
                a.type === i.Program &&
                  !M &&
                  N === "" &&
                  m.charAt(m.length - 1) ===
                    `
` &&
                  (p = h ? fe(p).replaceRight(/\s+$/, "") : m.replace(/\s+$/, "")),
                fe(p, a)
              );
            });
          function De(a) {
            var c;
            if (((c = new Ce()), K(a))) return c.generateStatement(a, me);
            if (ee(a)) return c.generateExpression(a, r.Sequence, W);
            throw new Error("Unknown node type: " + a.type);
          }
          function xe(a, c) {
            var p = Tt(),
              m,
              S;
            return (
              c != null
                ? (typeof c.indent == "string" && (p.format.indent.style = c.indent),
                  typeof c.base == "number" && (p.format.indent.base = c.base),
                  (c = _t(p, c)),
                  (x = c.format.indent.style),
                  typeof c.base == "string" ? (g = c.base) : (g = Ze(x, c.format.indent.base)))
                : ((c = p), (x = c.format.indent.style), (g = Ze(x, c.format.indent.base))),
              (_ = c.format.json),
              (C = c.format.renumber),
              (k = _ ? !1 : c.format.hexadecimal),
              (A = _ ? "double" : c.format.quotes),
              (P = c.format.escapeless),
              (N = c.format.newline),
              (E = c.format.space),
              c.format.compact && (N = E = x = g = ""),
              (w = c.format.parentheses),
              (B = c.format.semicolons),
              (M = c.format.safeConcatenation),
              (G = c.directive),
              (y = _ ? null : c.parse),
              (h = c.sourceMap),
              (I = c.sourceCode),
              (V = c.format.preserveBlankLines && I !== null),
              (L = c),
              h && (e.browser ? (o = ma.sourceMap.SourceNode) : (o = La().SourceNode)),
              (m = De(a)),
              h
                ? ((S = m.toStringWithSourceMap({ file: c.file, sourceRoot: c.sourceMapRoot })),
                  c.sourceContent && S.map.setSourceContent(c.sourceMap, c.sourceContent),
                  c.sourceMapWithCode ? S : S.map.toString())
                : ((S = { code: m.toString(), map: null }), c.sourceMapWithCode ? S : S.code)
            );
          }
          (Q = {
            indent: { style: "", base: 0 },
            renumber: !0,
            hexadecimal: !0,
            quotes: "auto",
            escapeless: !0,
            compact: !0,
            parentheses: !1,
            semicolons: !1,
          }),
            (H = Tt().format),
            (e.version = Oa.version),
            (e.generate = xe),
            (e.attachComments = f.attachComments),
            (e.Precedence = _t({}, r)),
            (e.browser = !1),
            (e.FORMAT_MINIFY = Q),
            (e.FORMAT_DEFAULTS = H);
        })();
      })(Vi)),
    Vi
  );
}
var Fa = Va(),
  Wi = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments",
  },
  zi =
    "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",
  Ba = {
    5: zi,
    "5module": zi + " export import",
    6: zi + " const class extends export import super",
  },
  Ma = /^in(stanceof)?$/,
  or =
    "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࢠ-ࢴࢶ-ࣇऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-鿼ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞿꟂ-ꟊꟵ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",
  Ds =
    "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛࣓-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿᫀᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷹᷻-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿",
  Da = new RegExp("[" + or + "]"),
  ja = new RegExp("[" + or + Ds + "]");
or = Ds = null;
var js = [
    0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37,
    11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153,
    5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1,
    65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72,
    56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 107, 20, 28, 22, 13, 52, 76, 44,
    33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2,
    0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52,
    19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 230,
    43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11,
    39, 8, 0, 22, 0, 12, 45, 20, 0, 35, 56, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22,
    0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2749, 1070, 4050,
    582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12,
    65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8952, 286, 50, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8,
    8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2,
    27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2,
    30, 2, 24, 2, 7, 2357, 44, 11, 6, 17, 0, 370, 43, 1301, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1,
    2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0,
    2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421,
    42717, 35, 4148, 12, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938,
  ],
  qa = [
    509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1,
    154, 10, 176, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2,
    49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1,
    3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9,
    9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29,
    9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2,
    6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 135, 4, 60, 6, 26, 9, 1014, 0, 2, 54,
    8, 3, 82, 0, 12, 1, 19628, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5,
    49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 419, 13, 1495,
    6, 110, 6, 6, 9, 4759, 9, 787719, 239,
  ];
function Zi(e, i) {
  for (var r = 65536, n = 0; n < i.length; n += 2) {
    if (((r += i[n]), r > e)) return !1;
    if (((r += i[n + 1]), r >= e)) return !0;
  }
}
function vt(e, i) {
  return e < 65
    ? e === 36
    : e < 91
      ? !0
      : e < 97
        ? e === 95
        : e < 123
          ? !0
          : e <= 65535
            ? e >= 170 && Da.test(String.fromCharCode(e))
            : i === !1
              ? !1
              : Zi(e, js);
}
function Ft(e, i) {
  return e < 48
    ? e === 36
    : e < 58
      ? !0
      : e < 65
        ? !1
        : e < 91
          ? !0
          : e < 97
            ? e === 95
            : e < 123
              ? !0
              : e <= 65535
                ? e >= 170 && ja.test(String.fromCharCode(e))
                : i === !1
                  ? !1
                  : Zi(e, js) || Zi(e, qa);
}
var de = function (i, r) {
  r === void 0 && (r = {}),
    (this.label = i),
    (this.keyword = r.keyword),
    (this.beforeExpr = !!r.beforeExpr),
    (this.startsExpr = !!r.startsExpr),
    (this.isLoop = !!r.isLoop),
    (this.isAssign = !!r.isAssign),
    (this.prefix = !!r.prefix),
    (this.postfix = !!r.postfix),
    (this.binop = r.binop || null),
    (this.updateContext = null);
};
function Qe(e, i) {
  return new de(e, { beforeExpr: !0, binop: i });
}
var Ke = { beforeExpr: !0 },
  Ge = { startsExpr: !0 },
  ur = {};
function ce(e, i) {
  return i === void 0 && (i = {}), (i.keyword = e), (ur[e] = new de(e, i));
}
var v = {
    num: new de("num", Ge),
    regexp: new de("regexp", Ge),
    string: new de("string", Ge),
    name: new de("name", Ge),
    eof: new de("eof"),
    bracketL: new de("[", { beforeExpr: !0, startsExpr: !0 }),
    bracketR: new de("]"),
    braceL: new de("{", { beforeExpr: !0, startsExpr: !0 }),
    braceR: new de("}"),
    parenL: new de("(", { beforeExpr: !0, startsExpr: !0 }),
    parenR: new de(")"),
    comma: new de(",", Ke),
    semi: new de(";", Ke),
    colon: new de(":", Ke),
    dot: new de("."),
    question: new de("?", Ke),
    questionDot: new de("?."),
    arrow: new de("=>", Ke),
    template: new de("template"),
    invalidTemplate: new de("invalidTemplate"),
    ellipsis: new de("...", Ke),
    backQuote: new de("`", Ge),
    dollarBraceL: new de("${", { beforeExpr: !0, startsExpr: !0 }),
    eq: new de("=", { beforeExpr: !0, isAssign: !0 }),
    assign: new de("_=", { beforeExpr: !0, isAssign: !0 }),
    incDec: new de("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
    prefix: new de("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
    logicalOR: Qe("||", 1),
    logicalAND: Qe("&&", 2),
    bitwiseOR: Qe("|", 3),
    bitwiseXOR: Qe("^", 4),
    bitwiseAND: Qe("&", 5),
    equality: Qe("==/!=/===/!==", 6),
    relational: Qe("</>/<=/>=", 7),
    bitShift: Qe("<</>>/>>>", 8),
    plusMin: new de("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
    modulo: Qe("%", 10),
    star: Qe("*", 10),
    slash: Qe("/", 10),
    starstar: new de("**", { beforeExpr: !0 }),
    coalesce: Qe("??", 1),
    _break: ce("break"),
    _case: ce("case", Ke),
    _catch: ce("catch"),
    _continue: ce("continue"),
    _debugger: ce("debugger"),
    _default: ce("default", Ke),
    _do: ce("do", { isLoop: !0, beforeExpr: !0 }),
    _else: ce("else", Ke),
    _finally: ce("finally"),
    _for: ce("for", { isLoop: !0 }),
    _function: ce("function", Ge),
    _if: ce("if"),
    _return: ce("return", Ke),
    _switch: ce("switch"),
    _throw: ce("throw", Ke),
    _try: ce("try"),
    _var: ce("var"),
    _const: ce("const"),
    _while: ce("while", { isLoop: !0 }),
    _with: ce("with"),
    _new: ce("new", { beforeExpr: !0, startsExpr: !0 }),
    _this: ce("this", Ge),
    _super: ce("super", Ge),
    _class: ce("class", Ge),
    _extends: ce("extends", Ke),
    _export: ce("export"),
    _import: ce("import", Ge),
    _null: ce("null", Ge),
    _true: ce("true", Ge),
    _false: ce("false", Ge),
    _in: ce("in", { beforeExpr: !0, binop: 7 }),
    _instanceof: ce("instanceof", { beforeExpr: !0, binop: 7 }),
    _typeof: ce("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
    _void: ce("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
    _delete: ce("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
  },
  Je = /\r\n?|\n|\u2028|\u2029/,
  $t = new RegExp(Je.source, "g");
function ni(e, i) {
  return e === 10 || e === 13 || (!i && (e === 8232 || e === 8233));
}
var qs = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
  Xe = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
  Us = Object.prototype,
  Ua = Us.hasOwnProperty,
  Ga = Us.toString;
function Si(e, i) {
  return Ua.call(e, i);
}
var us = Array.isArray || ((e) => Ga.call(e) === "[object Array]");
function wt(e) {
  return new RegExp("^(?:" + e.replace(/ /g, "|") + ")$");
}
var ei = function (i, r) {
  (this.line = i), (this.column = r);
};
ei.prototype.offset = function (i) {
  return new ei(this.line, this.column + i);
};
var _i = function (i, r, n) {
  (this.start = r), (this.end = n), i.sourceFile !== null && (this.source = i.sourceFile);
};
function Gs(e, i) {
  for (var r = 1, n = 0; ; ) {
    $t.lastIndex = n;
    var o = $t.exec(e);
    if (o && o.index < i) ++r, (n = o.index + o[0].length);
    else return new ei(r, i - n);
  }
}
var $i = {
  ecmaVersion: 10,
  sourceType: "script",
  onInsertedSemicolon: null,
  onTrailingComma: null,
  allowReserved: null,
  allowReturnOutsideFunction: !1,
  allowImportExportEverywhere: !1,
  allowAwaitOutsideFunction: !1,
  allowHashBang: !1,
  locations: !1,
  onToken: null,
  onComment: null,
  ranges: !1,
  program: null,
  sourceFile: null,
  directSourceFile: null,
  preserveParens: !1,
};
function Wa(e) {
  var i = {};
  for (var r in $i) i[r] = e && Si(e, r) ? e[r] : $i[r];
  if (
    (i.ecmaVersion >= 2015 && (i.ecmaVersion -= 2009),
    i.allowReserved == null && (i.allowReserved = i.ecmaVersion < 5),
    us(i.onToken))
  ) {
    var n = i.onToken;
    i.onToken = (o) => n.push(o);
  }
  return us(i.onComment) && (i.onComment = za(i, i.onComment)), i;
}
function za(e, i) {
  return function (r, n, o, f, d, g) {
    var x = { type: r ? "Block" : "Line", value: n, start: o, end: f };
    e.locations && (x.loc = new _i(this, d, g)), e.ranges && (x.range = [o, f]), i.push(x);
  };
}
var ti = 1,
  ai = 2,
  hr = ti | ai,
  Ws = 4,
  zs = 8,
  Hs = 16,
  Qs = 32,
  Ks = 64,
  Xs = 128;
function lr(e, i) {
  return ai | (e ? Ws : 0) | (i ? zs : 0);
}
var hs = 0,
  cr = 1,
  lt = 2,
  Js = 3,
  Ys = 4,
  Zs = 5,
  Te = function (i, r, n) {
    (this.options = i = Wa(i)),
      (this.sourceFile = i.sourceFile),
      (this.keywords = wt(Ba[i.ecmaVersion >= 6 ? 6 : i.sourceType === "module" ? "5module" : 5]));
    var o = "";
    if (i.allowReserved !== !0) {
      for (var f = i.ecmaVersion; !(o = Wi[f]); f--);
      i.sourceType === "module" && (o += " await");
    }
    this.reservedWords = wt(o);
    var d = (o ? o + " " : "") + Wi.strict;
    (this.reservedWordsStrict = wt(d)),
      (this.reservedWordsStrictBind = wt(d + " " + Wi.strictBind)),
      (this.input = String(r)),
      (this.containsEsc = !1),
      n
        ? ((this.pos = n),
          (this.lineStart =
            this.input.lastIndexOf(
              `
`,
              n - 1,
            ) + 1),
          (this.curLine = this.input.slice(0, this.lineStart).split(Je).length))
        : ((this.pos = this.lineStart = 0), (this.curLine = 1)),
      (this.type = v.eof),
      (this.value = null),
      (this.start = this.end = this.pos),
      (this.startLoc = this.endLoc = this.curPosition()),
      (this.lastTokEndLoc = this.lastTokStartLoc = null),
      (this.lastTokStart = this.lastTokEnd = this.pos),
      (this.context = this.initialContext()),
      (this.exprAllowed = !0),
      (this.inModule = i.sourceType === "module"),
      (this.strict = this.inModule || this.strictDirective(this.pos)),
      (this.potentialArrowAt = -1),
      (this.yieldPos = this.awaitPos = this.awaitIdentPos = 0),
      (this.labels = []),
      (this.undefinedExports = {}),
      this.pos === 0 &&
        i.allowHashBang &&
        this.input.slice(0, 2) === "#!" &&
        this.skipLineComment(2),
      (this.scopeStack = []),
      this.enterScope(ti),
      (this.regexpState = null);
  },
  At = {
    inFunction: { configurable: !0 },
    inGenerator: { configurable: !0 },
    inAsync: { configurable: !0 },
    allowSuper: { configurable: !0 },
    allowDirectSuper: { configurable: !0 },
    treatFunctionsAsVar: { configurable: !0 },
  };
Te.prototype.parse = function () {
  var i = this.options.program || this.startNode();
  return this.nextToken(), this.parseTopLevel(i);
};
At.inFunction.get = function () {
  return (this.currentVarScope().flags & ai) > 0;
};
At.inGenerator.get = function () {
  return (this.currentVarScope().flags & zs) > 0;
};
At.inAsync.get = function () {
  return (this.currentVarScope().flags & Ws) > 0;
};
At.allowSuper.get = function () {
  return (this.currentThisScope().flags & Ks) > 0;
};
At.allowDirectSuper.get = function () {
  return (this.currentThisScope().flags & Xs) > 0;
};
At.treatFunctionsAsVar.get = function () {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
Te.prototype.inNonArrowFunction = function () {
  return (this.currentThisScope().flags & ai) > 0;
};
Te.extend = function () {
  for (var i = [], r = arguments.length; r--; ) i[r] = arguments[r];
  for (var n = this, o = 0; o < i.length; o++) n = i[o](n);
  return n;
};
Te.parse = function (i, r) {
  return new this(r, i).parse();
};
Te.parseExpressionAt = function (i, r, n) {
  var o = new this(n, i, r);
  return o.nextToken(), o.parseExpression();
};
Te.tokenizer = function (i, r) {
  return new this(r, i);
};
Object.defineProperties(Te.prototype, At);
var Be = Te.prototype,
  Ha = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
Be.strictDirective = function (e) {
  for (;;) {
    (Xe.lastIndex = e), (e += Xe.exec(this.input)[0].length);
    var i = Ha.exec(this.input.slice(e));
    if (!i) return !1;
    if ((i[1] || i[2]) === "use strict") {
      Xe.lastIndex = e + i[0].length;
      var r = Xe.exec(this.input),
        n = r.index + r[0].length,
        o = this.input.charAt(n);
      return (
        o === ";" ||
        o === "}" ||
        (Je.test(r[0]) &&
          !(/[(`.[+\-/*%<>=,?^&]/.test(o) || (o === "!" && this.input.charAt(n + 1) === "=")))
      );
    }
    (e += i[0].length),
      (Xe.lastIndex = e),
      (e += Xe.exec(this.input)[0].length),
      this.input[e] === ";" && e++;
  }
};
Be.eat = function (e) {
  return this.type === e ? (this.next(), !0) : !1;
};
Be.isContextual = function (e) {
  return this.type === v.name && this.value === e && !this.containsEsc;
};
Be.eatContextual = function (e) {
  return this.isContextual(e) ? (this.next(), !0) : !1;
};
Be.expectContextual = function (e) {
  this.eatContextual(e) || this.unexpected();
};
Be.canInsertSemicolon = function () {
  return (
    this.type === v.eof ||
    this.type === v.braceR ||
    Je.test(this.input.slice(this.lastTokEnd, this.start))
  );
};
Be.insertSemicolon = function () {
  if (this.canInsertSemicolon())
    return (
      this.options.onInsertedSemicolon &&
        this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc),
      !0
    );
};
Be.semicolon = function () {
  !this.eat(v.semi) && !this.insertSemicolon() && this.unexpected();
};
Be.afterTrailingComma = function (e, i) {
  if (this.type === e)
    return (
      this.options.onTrailingComma &&
        this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc),
      i || this.next(),
      !0
    );
};
Be.expect = function (e) {
  this.eat(e) || this.unexpected();
};
Be.unexpected = function (e) {
  this.raise(e ?? this.start, "Unexpected token");
};
function Ci() {
  this.shorthandAssign =
    this.trailingComma =
    this.parenthesizedAssign =
    this.parenthesizedBind =
    this.doubleProto =
      -1;
}
Be.checkPatternErrors = function (e, i) {
  if (e) {
    e.trailingComma > -1 &&
      this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
    var r = i ? e.parenthesizedAssign : e.parenthesizedBind;
    r > -1 && this.raiseRecoverable(r, "Parenthesized pattern");
  }
};
Be.checkExpressionErrors = function (e, i) {
  if (!e) return !1;
  var r = e.shorthandAssign,
    n = e.doubleProto;
  if (!i) return r >= 0 || n >= 0;
  r >= 0 &&
    this.raise(r, "Shorthand property assignments are valid only in destructuring patterns"),
    n >= 0 && this.raiseRecoverable(n, "Redefinition of __proto__ property");
};
Be.checkYieldAwaitInDefaultParams = function () {
  this.yieldPos &&
    (!this.awaitPos || this.yieldPos < this.awaitPos) &&
    this.raise(this.yieldPos, "Yield expression cannot be a default value"),
    this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
};
Be.isSimpleAssignTarget = function (e) {
  return e.type === "ParenthesizedExpression"
    ? this.isSimpleAssignTarget(e.expression)
    : e.type === "Identifier" || e.type === "MemberExpression";
};
var ie = Te.prototype;
ie.parseTopLevel = function (e) {
  var i = {};
  for (e.body || (e.body = []); this.type !== v.eof; ) {
    var r = this.parseStatement(null, !0, i);
    e.body.push(r);
  }
  if (this.inModule)
    for (var n = 0, o = Object.keys(this.undefinedExports); n < o.length; n += 1) {
      var f = o[n];
      this.raiseRecoverable(this.undefinedExports[f].start, "Export '" + f + "' is not defined");
    }
  return (
    this.adaptDirectivePrologue(e.body),
    this.next(),
    (e.sourceType = this.options.sourceType),
    this.finishNode(e, "Program")
  );
};
var fr = { kind: "loop" },
  Qa = { kind: "switch" };
ie.isLet = function (e) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return !1;
  Xe.lastIndex = this.pos;
  var i = Xe.exec(this.input),
    r = this.pos + i[0].length,
    n = this.input.charCodeAt(r);
  if (n === 91) return !0;
  if (e) return !1;
  if (n === 123) return !0;
  if (vt(n, !0)) {
    for (var o = r + 1; Ft(this.input.charCodeAt(o), !0); ) ++o;
    var f = this.input.slice(r, o);
    if (!Ma.test(f)) return !0;
  }
  return !1;
};
ie.isAsyncFunction = function () {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return !1;
  Xe.lastIndex = this.pos;
  var e = Xe.exec(this.input),
    i = this.pos + e[0].length;
  return (
    !Je.test(this.input.slice(this.pos, i)) &&
    this.input.slice(i, i + 8) === "function" &&
    (i + 8 === this.input.length || !Ft(this.input.charAt(i + 8)))
  );
};
ie.parseStatement = function (e, i, r) {
  var n = this.type,
    o = this.startNode(),
    f;
  switch ((this.isLet(e) && ((n = v._var), (f = "let")), n)) {
    case v._break:
    case v._continue:
      return this.parseBreakContinueStatement(o, n.keyword);
    case v._debugger:
      return this.parseDebuggerStatement(o);
    case v._do:
      return this.parseDoStatement(o);
    case v._for:
      return this.parseForStatement(o);
    case v._function:
      return (
        e &&
          (this.strict || (e !== "if" && e !== "label")) &&
          this.options.ecmaVersion >= 6 &&
          this.unexpected(),
        this.parseFunctionStatement(o, !1, !e)
      );
    case v._class:
      return e && this.unexpected(), this.parseClass(o, !0);
    case v._if:
      return this.parseIfStatement(o);
    case v._return:
      return this.parseReturnStatement(o);
    case v._switch:
      return this.parseSwitchStatement(o);
    case v._throw:
      return this.parseThrowStatement(o);
    case v._try:
      return this.parseTryStatement(o);
    case v._const:
    case v._var:
      return (
        (f = f || this.value), e && f !== "var" && this.unexpected(), this.parseVarStatement(o, f)
      );
    case v._while:
      return this.parseWhileStatement(o);
    case v._with:
      return this.parseWithStatement(o);
    case v.braceL:
      return this.parseBlock(!0, o);
    case v.semi:
      return this.parseEmptyStatement(o);
    case v._export:
    case v._import:
      if (this.options.ecmaVersion > 10 && n === v._import) {
        Xe.lastIndex = this.pos;
        var d = Xe.exec(this.input),
          g = this.pos + d[0].length,
          x = this.input.charCodeAt(g);
        if (x === 40 || x === 46) return this.parseExpressionStatement(o, this.parseExpression());
      }
      return (
        this.options.allowImportExportEverywhere ||
          (i || this.raise(this.start, "'import' and 'export' may only appear at the top level"),
          this.inModule ||
            this.raise(
              this.start,
              "'import' and 'export' may appear only with 'sourceType: module'",
            )),
        n === v._import ? this.parseImport(o) : this.parseExport(o, r)
      );
    default: {
      if (this.isAsyncFunction())
        return e && this.unexpected(), this.next(), this.parseFunctionStatement(o, !0, !e);
      var _ = this.value,
        C = this.parseExpression();
      return n === v.name && C.type === "Identifier" && this.eat(v.colon)
        ? this.parseLabeledStatement(o, _, C, e)
        : this.parseExpressionStatement(o, C);
    }
  }
};
ie.parseBreakContinueStatement = function (e, i) {
  var r = i === "break";
  this.next(),
    this.eat(v.semi) || this.insertSemicolon()
      ? (e.label = null)
      : this.type !== v.name
        ? this.unexpected()
        : ((e.label = this.parseIdent()), this.semicolon());
  for (var n = 0; n < this.labels.length; ++n) {
    var o = this.labels[n];
    if (
      (e.label == null || o.name === e.label.name) &&
      ((o.kind != null && (r || o.kind === "loop")) || (e.label && r))
    )
      break;
  }
  return (
    n === this.labels.length && this.raise(e.start, "Unsyntactic " + i),
    this.finishNode(e, r ? "BreakStatement" : "ContinueStatement")
  );
};
ie.parseDebuggerStatement = function (e) {
  return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
};
ie.parseDoStatement = function (e) {
  return (
    this.next(),
    this.labels.push(fr),
    (e.body = this.parseStatement("do")),
    this.labels.pop(),
    this.expect(v._while),
    (e.test = this.parseParenExpression()),
    this.options.ecmaVersion >= 6 ? this.eat(v.semi) : this.semicolon(),
    this.finishNode(e, "DoWhileStatement")
  );
};
ie.parseForStatement = function (e) {
  this.next();
  var i =
    this.options.ecmaVersion >= 9 &&
    (this.inAsync || (!this.inFunction && this.options.allowAwaitOutsideFunction)) &&
    this.eatContextual("await")
      ? this.lastTokStart
      : -1;
  if ((this.labels.push(fr), this.enterScope(0), this.expect(v.parenL), this.type === v.semi))
    return i > -1 && this.unexpected(i), this.parseFor(e, null);
  var r = this.isLet();
  if (this.type === v._var || this.type === v._const || r) {
    var n = this.startNode(),
      o = r ? "let" : this.value;
    return (
      this.next(),
      this.parseVar(n, !0, o),
      this.finishNode(n, "VariableDeclaration"),
      (this.type === v._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) &&
      n.declarations.length === 1
        ? (this.options.ecmaVersion >= 9 &&
            (this.type === v._in ? i > -1 && this.unexpected(i) : (e.await = i > -1)),
          this.parseForIn(e, n))
        : (i > -1 && this.unexpected(i), this.parseFor(e, n))
    );
  }
  var f = new Ci(),
    d = this.parseExpression(!0, f);
  return this.type === v._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))
    ? (this.options.ecmaVersion >= 9 &&
        (this.type === v._in ? i > -1 && this.unexpected(i) : (e.await = i > -1)),
      this.toAssignable(d, !1, f),
      this.checkLVal(d),
      this.parseForIn(e, d))
    : (this.checkExpressionErrors(f, !0), i > -1 && this.unexpected(i), this.parseFor(e, d));
};
ie.parseFunctionStatement = function (e, i, r) {
  return this.next(), this.parseFunction(e, Yt | (r ? 0 : er), !1, i);
};
ie.parseIfStatement = function (e) {
  return (
    this.next(),
    (e.test = this.parseParenExpression()),
    (e.consequent = this.parseStatement("if")),
    (e.alternate = this.eat(v._else) ? this.parseStatement("if") : null),
    this.finishNode(e, "IfStatement")
  );
};
ie.parseReturnStatement = function (e) {
  return (
    !this.inFunction &&
      !this.options.allowReturnOutsideFunction &&
      this.raise(this.start, "'return' outside of function"),
    this.next(),
    this.eat(v.semi) || this.insertSemicolon()
      ? (e.argument = null)
      : ((e.argument = this.parseExpression()), this.semicolon()),
    this.finishNode(e, "ReturnStatement")
  );
};
ie.parseSwitchStatement = function (e) {
  this.next(),
    (e.discriminant = this.parseParenExpression()),
    (e.cases = []),
    this.expect(v.braceL),
    this.labels.push(Qa),
    this.enterScope(0);
  for (var i, r = !1; this.type !== v.braceR; )
    if (this.type === v._case || this.type === v._default) {
      var n = this.type === v._case;
      i && this.finishNode(i, "SwitchCase"),
        e.cases.push((i = this.startNode())),
        (i.consequent = []),
        this.next(),
        n
          ? (i.test = this.parseExpression())
          : (r && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"),
            (r = !0),
            (i.test = null)),
        this.expect(v.colon);
    } else i || this.unexpected(), i.consequent.push(this.parseStatement(null));
  return (
    this.exitScope(),
    i && this.finishNode(i, "SwitchCase"),
    this.next(),
    this.labels.pop(),
    this.finishNode(e, "SwitchStatement")
  );
};
ie.parseThrowStatement = function (e) {
  return (
    this.next(),
    Je.test(this.input.slice(this.lastTokEnd, this.start)) &&
      this.raise(this.lastTokEnd, "Illegal newline after throw"),
    (e.argument = this.parseExpression()),
    this.semicolon(),
    this.finishNode(e, "ThrowStatement")
  );
};
var Ka = [];
ie.parseTryStatement = function (e) {
  if ((this.next(), (e.block = this.parseBlock()), (e.handler = null), this.type === v._catch)) {
    var i = this.startNode();
    if ((this.next(), this.eat(v.parenL))) {
      i.param = this.parseBindingAtom();
      var r = i.param.type === "Identifier";
      this.enterScope(r ? Qs : 0), this.checkLVal(i.param, r ? Ys : lt), this.expect(v.parenR);
    } else this.options.ecmaVersion < 10 && this.unexpected(), (i.param = null), this.enterScope(0);
    (i.body = this.parseBlock(!1)),
      this.exitScope(),
      (e.handler = this.finishNode(i, "CatchClause"));
  }
  return (
    (e.finalizer = this.eat(v._finally) ? this.parseBlock() : null),
    !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"),
    this.finishNode(e, "TryStatement")
  );
};
ie.parseVarStatement = function (e, i) {
  return (
    this.next(),
    this.parseVar(e, !1, i),
    this.semicolon(),
    this.finishNode(e, "VariableDeclaration")
  );
};
ie.parseWhileStatement = function (e) {
  return (
    this.next(),
    (e.test = this.parseParenExpression()),
    this.labels.push(fr),
    (e.body = this.parseStatement("while")),
    this.labels.pop(),
    this.finishNode(e, "WhileStatement")
  );
};
ie.parseWithStatement = function (e) {
  return (
    this.strict && this.raise(this.start, "'with' in strict mode"),
    this.next(),
    (e.object = this.parseParenExpression()),
    (e.body = this.parseStatement("with")),
    this.finishNode(e, "WithStatement")
  );
};
ie.parseEmptyStatement = function (e) {
  return this.next(), this.finishNode(e, "EmptyStatement");
};
ie.parseLabeledStatement = function (e, i, r, n) {
  for (var o = 0, f = this.labels; o < f.length; o += 1) {
    var d = f[o];
    d.name === i && this.raise(r.start, "Label '" + i + "' is already declared");
  }
  for (
    var g = this.type.isLoop ? "loop" : this.type === v._switch ? "switch" : null,
      x = this.labels.length - 1;
    x >= 0;
    x--
  ) {
    var _ = this.labels[x];
    if (_.statementStart === e.start) (_.statementStart = this.start), (_.kind = g);
    else break;
  }
  return (
    this.labels.push({ name: i, kind: g, statementStart: this.start }),
    (e.body = this.parseStatement(n ? (n.indexOf("label") === -1 ? n + "label" : n) : "label")),
    this.labels.pop(),
    (e.label = r),
    this.finishNode(e, "LabeledStatement")
  );
};
ie.parseExpressionStatement = function (e, i) {
  return (e.expression = i), this.semicolon(), this.finishNode(e, "ExpressionStatement");
};
ie.parseBlock = function (e, i, r) {
  for (
    e === void 0 && (e = !0),
      i === void 0 && (i = this.startNode()),
      i.body = [],
      this.expect(v.braceL),
      e && this.enterScope(0);
    this.type !== v.braceR;
  ) {
    var n = this.parseStatement(null);
    i.body.push(n);
  }
  return (
    r && (this.strict = !1),
    this.next(),
    e && this.exitScope(),
    this.finishNode(i, "BlockStatement")
  );
};
ie.parseFor = function (e, i) {
  return (
    (e.init = i),
    this.expect(v.semi),
    (e.test = this.type === v.semi ? null : this.parseExpression()),
    this.expect(v.semi),
    (e.update = this.type === v.parenR ? null : this.parseExpression()),
    this.expect(v.parenR),
    (e.body = this.parseStatement("for")),
    this.exitScope(),
    this.labels.pop(),
    this.finishNode(e, "ForStatement")
  );
};
ie.parseForIn = function (e, i) {
  var r = this.type === v._in;
  return (
    this.next(),
    i.type === "VariableDeclaration" &&
    i.declarations[0].init != null &&
    (!r ||
      this.options.ecmaVersion < 8 ||
      this.strict ||
      i.kind !== "var" ||
      i.declarations[0].id.type !== "Identifier")
      ? this.raise(
          i.start,
          (r ? "for-in" : "for-of") + " loop variable declaration may not have an initializer",
        )
      : i.type === "AssignmentPattern" && this.raise(i.start, "Invalid left-hand side in for-loop"),
    (e.left = i),
    (e.right = r ? this.parseExpression() : this.parseMaybeAssign()),
    this.expect(v.parenR),
    (e.body = this.parseStatement("for")),
    this.exitScope(),
    this.labels.pop(),
    this.finishNode(e, r ? "ForInStatement" : "ForOfStatement")
  );
};
ie.parseVar = function (e, i, r) {
  for (e.declarations = [], e.kind = r; ; ) {
    var n = this.startNode();
    if (
      (this.parseVarId(n, r),
      this.eat(v.eq)
        ? (n.init = this.parseMaybeAssign(i))
        : r === "const" &&
            !(this.type === v._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))
          ? this.unexpected()
          : n.id.type !== "Identifier" && !(i && (this.type === v._in || this.isContextual("of")))
            ? this.raise(
                this.lastTokEnd,
                "Complex binding patterns require an initialization value",
              )
            : (n.init = null),
      e.declarations.push(this.finishNode(n, "VariableDeclarator")),
      !this.eat(v.comma))
    )
      break;
  }
  return e;
};
ie.parseVarId = function (e, i) {
  (e.id = this.parseBindingAtom()), this.checkLVal(e.id, i === "var" ? cr : lt, !1);
};
var Yt = 1,
  er = 2,
  $s = 4;
ie.parseFunction = function (e, i, r, n) {
  this.initFunction(e),
    (this.options.ecmaVersion >= 9 || (this.options.ecmaVersion >= 6 && !n)) &&
      (this.type === v.star && i & er && this.unexpected(), (e.generator = this.eat(v.star))),
    this.options.ecmaVersion >= 8 && (e.async = !!n),
    i & Yt &&
      ((e.id = i & $s && this.type !== v.name ? null : this.parseIdent()),
      e.id &&
        !(i & er) &&
        this.checkLVal(
          e.id,
          this.strict || e.generator || e.async ? (this.treatFunctionsAsVar ? cr : lt) : Js,
        ));
  var o = this.yieldPos,
    f = this.awaitPos,
    d = this.awaitIdentPos;
  return (
    (this.yieldPos = 0),
    (this.awaitPos = 0),
    (this.awaitIdentPos = 0),
    this.enterScope(lr(e.async, e.generator)),
    i & Yt || (e.id = this.type === v.name ? this.parseIdent() : null),
    this.parseFunctionParams(e),
    this.parseFunctionBody(e, r, !1),
    (this.yieldPos = o),
    (this.awaitPos = f),
    (this.awaitIdentPos = d),
    this.finishNode(e, i & Yt ? "FunctionDeclaration" : "FunctionExpression")
  );
};
ie.parseFunctionParams = function (e) {
  this.expect(v.parenL),
    (e.params = this.parseBindingList(v.parenR, !1, this.options.ecmaVersion >= 8)),
    this.checkYieldAwaitInDefaultParams();
};
ie.parseClass = function (e, i) {
  this.next();
  var r = this.strict;
  (this.strict = !0), this.parseClassId(e, i), this.parseClassSuper(e);
  var n = this.startNode(),
    o = !1;
  for (n.body = [], this.expect(v.braceL); this.type !== v.braceR; ) {
    var f = this.parseClassElement(e.superClass !== null);
    f &&
      (n.body.push(f),
      f.type === "MethodDefinition" &&
        f.kind === "constructor" &&
        (o && this.raise(f.start, "Duplicate constructor in the same class"), (o = !0)));
  }
  return (
    (this.strict = r),
    this.next(),
    (e.body = this.finishNode(n, "ClassBody")),
    this.finishNode(e, i ? "ClassDeclaration" : "ClassExpression")
  );
};
ie.parseClassElement = function (e) {
  if (this.eat(v.semi)) return null;
  var r = this.startNode(),
    n = (x, _) => {
      _ === void 0 && (_ = !1);
      var C = this.start,
        k = this.startLoc;
      return this.eatContextual(x)
        ? this.type !== v.parenL && (!_ || !this.canInsertSemicolon())
          ? !0
          : (r.key && this.unexpected(),
            (r.computed = !1),
            (r.key = this.startNodeAt(C, k)),
            (r.key.name = x),
            this.finishNode(r.key, "Identifier"),
            !1)
        : !1;
    };
  (r.kind = "method"), (r.static = n("static"));
  var o = this.eat(v.star),
    f = !1;
  o ||
    (this.options.ecmaVersion >= 8 && n("async", !0)
      ? ((f = !0), (o = this.options.ecmaVersion >= 9 && this.eat(v.star)))
      : n("get")
        ? (r.kind = "get")
        : n("set") && (r.kind = "set")),
    r.key || this.parsePropertyName(r);
  var d = r.key,
    g = !1;
  return (
    !r.computed &&
    !r.static &&
    ((d.type === "Identifier" && d.name === "constructor") ||
      (d.type === "Literal" && d.value === "constructor"))
      ? (r.kind !== "method" && this.raise(d.start, "Constructor can't have get/set modifier"),
        o && this.raise(d.start, "Constructor can't be a generator"),
        f && this.raise(d.start, "Constructor can't be an async method"),
        (r.kind = "constructor"),
        (g = e))
      : r.static &&
        d.type === "Identifier" &&
        d.name === "prototype" &&
        this.raise(d.start, "Classes may not have a static property named prototype"),
    this.parseClassMethod(r, o, f, g),
    r.kind === "get" &&
      r.value.params.length !== 0 &&
      this.raiseRecoverable(r.value.start, "getter should have no params"),
    r.kind === "set" &&
      r.value.params.length !== 1 &&
      this.raiseRecoverable(r.value.start, "setter should have exactly one param"),
    r.kind === "set" &&
      r.value.params[0].type === "RestElement" &&
      this.raiseRecoverable(r.value.params[0].start, "Setter cannot use rest params"),
    r
  );
};
ie.parseClassMethod = function (e, i, r, n) {
  return (e.value = this.parseMethod(i, r, n)), this.finishNode(e, "MethodDefinition");
};
ie.parseClassId = function (e, i) {
  this.type === v.name
    ? ((e.id = this.parseIdent()), i && this.checkLVal(e.id, lt, !1))
    : (i === !0 && this.unexpected(), (e.id = null));
};
ie.parseClassSuper = function (e) {
  e.superClass = this.eat(v._extends) ? this.parseExprSubscripts() : null;
};
ie.parseExport = function (e, i) {
  if ((this.next(), this.eat(v.star)))
    return (
      this.options.ecmaVersion >= 11 &&
        (this.eatContextual("as")
          ? ((e.exported = this.parseIdent(!0)),
            this.checkExport(i, e.exported.name, this.lastTokStart))
          : (e.exported = null)),
      this.expectContextual("from"),
      this.type !== v.string && this.unexpected(),
      (e.source = this.parseExprAtom()),
      this.semicolon(),
      this.finishNode(e, "ExportAllDeclaration")
    );
  if (this.eat(v._default)) {
    this.checkExport(i, "default", this.lastTokStart);
    var r;
    if (this.type === v._function || (r = this.isAsyncFunction())) {
      var n = this.startNode();
      this.next(), r && this.next(), (e.declaration = this.parseFunction(n, Yt | $s, !1, r));
    } else if (this.type === v._class) {
      var o = this.startNode();
      e.declaration = this.parseClass(o, "nullableID");
    } else (e.declaration = this.parseMaybeAssign()), this.semicolon();
    return this.finishNode(e, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement())
    (e.declaration = this.parseStatement(null)),
      e.declaration.type === "VariableDeclaration"
        ? this.checkVariableExport(i, e.declaration.declarations)
        : this.checkExport(i, e.declaration.id.name, e.declaration.id.start),
      (e.specifiers = []),
      (e.source = null);
  else {
    if (
      ((e.declaration = null),
      (e.specifiers = this.parseExportSpecifiers(i)),
      this.eatContextual("from"))
    )
      this.type !== v.string && this.unexpected(), (e.source = this.parseExprAtom());
    else {
      for (var f = 0, d = e.specifiers; f < d.length; f += 1) {
        var g = d[f];
        this.checkUnreserved(g.local), this.checkLocalExport(g.local);
      }
      e.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(e, "ExportNamedDeclaration");
};
ie.checkExport = function (e, i, r) {
  e && (Si(e, i) && this.raiseRecoverable(r, "Duplicate export '" + i + "'"), (e[i] = !0));
};
ie.checkPatternExport = function (e, i) {
  var r = i.type;
  if (r === "Identifier") this.checkExport(e, i.name, i.start);
  else if (r === "ObjectPattern")
    for (var n = 0, o = i.properties; n < o.length; n += 1) {
      var f = o[n];
      this.checkPatternExport(e, f);
    }
  else if (r === "ArrayPattern")
    for (var d = 0, g = i.elements; d < g.length; d += 1) {
      var x = g[d];
      x && this.checkPatternExport(e, x);
    }
  else
    r === "Property"
      ? this.checkPatternExport(e, i.value)
      : r === "AssignmentPattern"
        ? this.checkPatternExport(e, i.left)
        : r === "RestElement"
          ? this.checkPatternExport(e, i.argument)
          : r === "ParenthesizedExpression" && this.checkPatternExport(e, i.expression);
};
ie.checkVariableExport = function (e, i) {
  if (e)
    for (var r = 0, n = i; r < n.length; r += 1) {
      var o = n[r];
      this.checkPatternExport(e, o.id);
    }
};
ie.shouldParseExportStatement = function () {
  return (
    this.type.keyword === "var" ||
    this.type.keyword === "const" ||
    this.type.keyword === "class" ||
    this.type.keyword === "function" ||
    this.isLet() ||
    this.isAsyncFunction()
  );
};
ie.parseExportSpecifiers = function (e) {
  var i = [],
    r = !0;
  for (this.expect(v.braceL); !this.eat(v.braceR); ) {
    if (r) r = !1;
    else if ((this.expect(v.comma), this.afterTrailingComma(v.braceR))) break;
    var n = this.startNode();
    (n.local = this.parseIdent(!0)),
      (n.exported = this.eatContextual("as") ? this.parseIdent(!0) : n.local),
      this.checkExport(e, n.exported.name, n.exported.start),
      i.push(this.finishNode(n, "ExportSpecifier"));
  }
  return i;
};
ie.parseImport = function (e) {
  return (
    this.next(),
    this.type === v.string
      ? ((e.specifiers = Ka), (e.source = this.parseExprAtom()))
      : ((e.specifiers = this.parseImportSpecifiers()),
        this.expectContextual("from"),
        (e.source = this.type === v.string ? this.parseExprAtom() : this.unexpected())),
    this.semicolon(),
    this.finishNode(e, "ImportDeclaration")
  );
};
ie.parseImportSpecifiers = function () {
  var e = [],
    i = !0;
  if (this.type === v.name) {
    var r = this.startNode();
    if (
      ((r.local = this.parseIdent()),
      this.checkLVal(r.local, lt),
      e.push(this.finishNode(r, "ImportDefaultSpecifier")),
      !this.eat(v.comma))
    )
      return e;
  }
  if (this.type === v.star) {
    var n = this.startNode();
    return (
      this.next(),
      this.expectContextual("as"),
      (n.local = this.parseIdent()),
      this.checkLVal(n.local, lt),
      e.push(this.finishNode(n, "ImportNamespaceSpecifier")),
      e
    );
  }
  for (this.expect(v.braceL); !this.eat(v.braceR); ) {
    if (i) i = !1;
    else if ((this.expect(v.comma), this.afterTrailingComma(v.braceR))) break;
    var o = this.startNode();
    (o.imported = this.parseIdent(!0)),
      this.eatContextual("as")
        ? (o.local = this.parseIdent())
        : (this.checkUnreserved(o.imported), (o.local = o.imported)),
      this.checkLVal(o.local, lt),
      e.push(this.finishNode(o, "ImportSpecifier"));
  }
  return e;
};
ie.adaptDirectivePrologue = function (e) {
  for (var i = 0; i < e.length && this.isDirectiveCandidate(e[i]); ++i)
    e[i].directive = e[i].expression.raw.slice(1, -1);
};
ie.isDirectiveCandidate = function (e) {
  return (
    e.type === "ExpressionStatement" &&
    e.expression.type === "Literal" &&
    typeof e.expression.value == "string" &&
    (this.input[e.start] === '"' || this.input[e.start] === "'")
  );
};
var ct = Te.prototype;
ct.toAssignable = function (e, i, r) {
  if (this.options.ecmaVersion >= 6 && e)
    switch (e.type) {
      case "Identifier":
        this.inAsync &&
          e.name === "await" &&
          this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        (e.type = "ObjectPattern"), r && this.checkPatternErrors(r, !0);
        for (var n = 0, o = e.properties; n < o.length; n += 1) {
          var f = o[n];
          this.toAssignable(f, i),
            f.type === "RestElement" &&
              (f.argument.type === "ArrayPattern" || f.argument.type === "ObjectPattern") &&
              this.raise(f.argument.start, "Unexpected token");
        }
        break;
      case "Property":
        e.kind !== "init" &&
          this.raise(e.key.start, "Object pattern can't contain getter or setter"),
          this.toAssignable(e.value, i);
        break;
      case "ArrayExpression":
        (e.type = "ArrayPattern"),
          r && this.checkPatternErrors(r, !0),
          this.toAssignableList(e.elements, i);
        break;
      case "SpreadElement":
        (e.type = "RestElement"),
          this.toAssignable(e.argument, i),
          e.argument.type === "AssignmentPattern" &&
            this.raise(e.argument.start, "Rest elements cannot have a default value");
        break;
      case "AssignmentExpression":
        e.operator !== "=" &&
          this.raise(e.left.end, "Only '=' operator can be used for specifying default value."),
          (e.type = "AssignmentPattern"),
          delete e.operator,
          this.toAssignable(e.left, i);
      case "AssignmentPattern":
        break;
      case "ParenthesizedExpression":
        this.toAssignable(e.expression, i, r);
        break;
      case "ChainExpression":
        this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!i) break;
      default:
        this.raise(e.start, "Assigning to rvalue");
    }
  else r && this.checkPatternErrors(r, !0);
  return e;
};
ct.toAssignableList = function (e, i) {
  for (var r = e.length, n = 0; n < r; n++) {
    var o = e[n];
    o && this.toAssignable(o, i);
  }
  if (r) {
    var f = e[r - 1];
    this.options.ecmaVersion === 6 &&
      i &&
      f &&
      f.type === "RestElement" &&
      f.argument.type !== "Identifier" &&
      this.unexpected(f.argument.start);
  }
  return e;
};
ct.parseSpread = function (e) {
  var i = this.startNode();
  return (
    this.next(), (i.argument = this.parseMaybeAssign(!1, e)), this.finishNode(i, "SpreadElement")
  );
};
ct.parseRestBinding = function () {
  var e = this.startNode();
  return (
    this.next(),
    this.options.ecmaVersion === 6 && this.type !== v.name && this.unexpected(),
    (e.argument = this.parseBindingAtom()),
    this.finishNode(e, "RestElement")
  );
};
ct.parseBindingAtom = function () {
  if (this.options.ecmaVersion >= 6)
    switch (this.type) {
      case v.bracketL: {
        var e = this.startNode();
        return (
          this.next(),
          (e.elements = this.parseBindingList(v.bracketR, !0, !0)),
          this.finishNode(e, "ArrayPattern")
        );
      }
      case v.braceL:
        return this.parseObj(!0);
    }
  return this.parseIdent();
};
ct.parseBindingList = function (e, i, r) {
  for (var n = [], o = !0; !this.eat(e); )
    if ((o ? (o = !1) : this.expect(v.comma), i && this.type === v.comma)) n.push(null);
    else {
      if (r && this.afterTrailingComma(e)) break;
      if (this.type === v.ellipsis) {
        var f = this.parseRestBinding();
        this.parseBindingListItem(f),
          n.push(f),
          this.type === v.comma &&
            this.raise(this.start, "Comma is not permitted after the rest element"),
          this.expect(e);
        break;
      } else {
        var d = this.parseMaybeDefault(this.start, this.startLoc);
        this.parseBindingListItem(d), n.push(d);
      }
    }
  return n;
};
ct.parseBindingListItem = (e) => e;
ct.parseMaybeDefault = function (e, i, r) {
  if (((r = r || this.parseBindingAtom()), this.options.ecmaVersion < 6 || !this.eat(v.eq)))
    return r;
  var n = this.startNodeAt(e, i);
  return (n.left = r), (n.right = this.parseMaybeAssign()), this.finishNode(n, "AssignmentPattern");
};
ct.checkLVal = function (e, i, r) {
  switch ((i === void 0 && (i = hs), e.type)) {
    case "Identifier":
      i === lt &&
        e.name === "let" &&
        this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"),
        this.strict &&
          this.reservedWordsStrictBind.test(e.name) &&
          this.raiseRecoverable(
            e.start,
            (i ? "Binding " : "Assigning to ") + e.name + " in strict mode",
          ),
        r &&
          (Si(r, e.name) && this.raiseRecoverable(e.start, "Argument name clash"),
          (r[e.name] = !0)),
        i !== hs && i !== Zs && this.declareName(e.name, i, e.start);
      break;
    case "ChainExpression":
      this.raiseRecoverable(e.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      i && this.raiseRecoverable(e.start, "Binding member expression");
      break;
    case "ObjectPattern":
      for (var n = 0, o = e.properties; n < o.length; n += 1) {
        var f = o[n];
        this.checkLVal(f, i, r);
      }
      break;
    case "Property":
      this.checkLVal(e.value, i, r);
      break;
    case "ArrayPattern":
      for (var d = 0, g = e.elements; d < g.length; d += 1) {
        var x = g[d];
        x && this.checkLVal(x, i, r);
      }
      break;
    case "AssignmentPattern":
      this.checkLVal(e.left, i, r);
      break;
    case "RestElement":
      this.checkLVal(e.argument, i, r);
      break;
    case "ParenthesizedExpression":
      this.checkLVal(e.expression, i, r);
      break;
    default:
      this.raise(e.start, (i ? "Binding" : "Assigning to") + " rvalue");
  }
};
var ae = Te.prototype;
ae.checkPropClash = function (e, i, r) {
  if (
    !(this.options.ecmaVersion >= 9 && e.type === "SpreadElement") &&
    !(this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))
  ) {
    var n = e.key,
      o;
    switch (n.type) {
      case "Identifier":
        o = n.name;
        break;
      case "Literal":
        o = String(n.value);
        break;
      default:
        return;
    }
    var f = e.kind;
    if (this.options.ecmaVersion >= 6) {
      o === "__proto__" &&
        f === "init" &&
        (i.proto &&
          (r
            ? r.doubleProto < 0 && (r.doubleProto = n.start)
            : this.raiseRecoverable(n.start, "Redefinition of __proto__ property")),
        (i.proto = !0));
      return;
    }
    o = "$" + o;
    var d = i[o];
    if (d) {
      var g;
      f === "init" ? (g = (this.strict && d.init) || d.get || d.set) : (g = d.init || d[f]),
        g && this.raiseRecoverable(n.start, "Redefinition of property");
    } else d = i[o] = { init: !1, get: !1, set: !1 };
    d[f] = !0;
  }
};
ae.parseExpression = function (e, i) {
  var r = this.start,
    n = this.startLoc,
    o = this.parseMaybeAssign(e, i);
  if (this.type === v.comma) {
    var f = this.startNodeAt(r, n);
    for (f.expressions = [o]; this.eat(v.comma); ) f.expressions.push(this.parseMaybeAssign(e, i));
    return this.finishNode(f, "SequenceExpression");
  }
  return o;
};
ae.parseMaybeAssign = function (e, i, r) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) return this.parseYield(e);
    this.exprAllowed = !1;
  }
  var n = !1,
    o = -1,
    f = -1;
  i
    ? ((o = i.parenthesizedAssign),
      (f = i.trailingComma),
      (i.parenthesizedAssign = i.trailingComma = -1))
    : ((i = new Ci()), (n = !0));
  var d = this.start,
    g = this.startLoc;
  (this.type === v.parenL || this.type === v.name) && (this.potentialArrowAt = this.start);
  var x = this.parseMaybeConditional(e, i);
  if ((r && (x = r.call(this, x, d, g)), this.type.isAssign)) {
    var _ = this.startNodeAt(d, g);
    return (
      (_.operator = this.value),
      (_.left = this.type === v.eq ? this.toAssignable(x, !1, i) : x),
      n || (i.parenthesizedAssign = i.trailingComma = i.doubleProto = -1),
      i.shorthandAssign >= _.left.start && (i.shorthandAssign = -1),
      this.checkLVal(x),
      this.next(),
      (_.right = this.parseMaybeAssign(e)),
      this.finishNode(_, "AssignmentExpression")
    );
  } else n && this.checkExpressionErrors(i, !0);
  return o > -1 && (i.parenthesizedAssign = o), f > -1 && (i.trailingComma = f), x;
};
ae.parseMaybeConditional = function (e, i) {
  var r = this.start,
    n = this.startLoc,
    o = this.parseExprOps(e, i);
  if (this.checkExpressionErrors(i)) return o;
  if (this.eat(v.question)) {
    var f = this.startNodeAt(r, n);
    return (
      (f.test = o),
      (f.consequent = this.parseMaybeAssign()),
      this.expect(v.colon),
      (f.alternate = this.parseMaybeAssign(e)),
      this.finishNode(f, "ConditionalExpression")
    );
  }
  return o;
};
ae.parseExprOps = function (e, i) {
  var r = this.start,
    n = this.startLoc,
    o = this.parseMaybeUnary(i, !1);
  return this.checkExpressionErrors(i) || (o.start === r && o.type === "ArrowFunctionExpression")
    ? o
    : this.parseExprOp(o, r, n, -1, e);
};
ae.parseExprOp = function (e, i, r, n, o) {
  var f = this.type.binop;
  if (f != null && (!o || this.type !== v._in) && f > n) {
    var d = this.type === v.logicalOR || this.type === v.logicalAND,
      g = this.type === v.coalesce;
    g && (f = v.logicalAND.binop);
    var x = this.value;
    this.next();
    var _ = this.start,
      C = this.startLoc,
      k = this.parseExprOp(this.parseMaybeUnary(null, !1), _, C, f, o),
      A = this.buildBinary(i, r, e, k, x, d || g);
    return (
      ((d && this.type === v.coalesce) ||
        (g && (this.type === v.logicalOR || this.type === v.logicalAND))) &&
        this.raiseRecoverable(
          this.start,
          "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses",
        ),
      this.parseExprOp(A, i, r, n, o)
    );
  }
  return e;
};
ae.buildBinary = function (e, i, r, n, o, f) {
  var d = this.startNodeAt(e, i);
  return (
    (d.left = r),
    (d.operator = o),
    (d.right = n),
    this.finishNode(d, f ? "LogicalExpression" : "BinaryExpression")
  );
};
ae.parseMaybeUnary = function (e, i) {
  var r = this.start,
    n = this.startLoc,
    o;
  if (
    this.isContextual("await") &&
    (this.inAsync || (!this.inFunction && this.options.allowAwaitOutsideFunction))
  )
    (o = this.parseAwait()), (i = !0);
  else if (this.type.prefix) {
    var f = this.startNode(),
      d = this.type === v.incDec;
    (f.operator = this.value),
      (f.prefix = !0),
      this.next(),
      (f.argument = this.parseMaybeUnary(null, !0)),
      this.checkExpressionErrors(e, !0),
      d
        ? this.checkLVal(f.argument)
        : this.strict && f.operator === "delete" && f.argument.type === "Identifier"
          ? this.raiseRecoverable(f.start, "Deleting local variable in strict mode")
          : (i = !0),
      (o = this.finishNode(f, d ? "UpdateExpression" : "UnaryExpression"));
  } else {
    if (((o = this.parseExprSubscripts(e)), this.checkExpressionErrors(e))) return o;
    for (; this.type.postfix && !this.canInsertSemicolon(); ) {
      var g = this.startNodeAt(r, n);
      (g.operator = this.value),
        (g.prefix = !1),
        (g.argument = o),
        this.checkLVal(o),
        this.next(),
        (o = this.finishNode(g, "UpdateExpression"));
    }
  }
  return !i && this.eat(v.starstar)
    ? this.buildBinary(r, n, o, this.parseMaybeUnary(null, !1), "**", !1)
    : o;
};
ae.parseExprSubscripts = function (e) {
  var i = this.start,
    r = this.startLoc,
    n = this.parseExprAtom(e);
  if (
    n.type === "ArrowFunctionExpression" &&
    this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")"
  )
    return n;
  var o = this.parseSubscripts(n, i, r);
  return (
    e &&
      o.type === "MemberExpression" &&
      (e.parenthesizedAssign >= o.start && (e.parenthesizedAssign = -1),
      e.parenthesizedBind >= o.start && (e.parenthesizedBind = -1)),
    o
  );
};
ae.parseSubscripts = function (e, i, r, n) {
  for (
    var o =
        this.options.ecmaVersion >= 8 &&
        e.type === "Identifier" &&
        e.name === "async" &&
        this.lastTokEnd === e.end &&
        !this.canInsertSemicolon() &&
        e.end - e.start === 5 &&
        this.potentialArrowAt === e.start,
      f = !1;
    ;
  ) {
    var d = this.parseSubscript(e, i, r, n, o, f);
    if ((d.optional && (f = !0), d === e || d.type === "ArrowFunctionExpression")) {
      if (f) {
        var g = this.startNodeAt(i, r);
        (g.expression = d), (d = this.finishNode(g, "ChainExpression"));
      }
      return d;
    }
    e = d;
  }
};
ae.parseSubscript = function (e, i, r, n, o, f) {
  var d = this.options.ecmaVersion >= 11,
    g = d && this.eat(v.questionDot);
  n &&
    g &&
    this.raise(
      this.lastTokStart,
      "Optional chaining cannot appear in the callee of new expressions",
    );
  var x = this.eat(v.bracketL);
  if (x || (g && this.type !== v.parenL && this.type !== v.backQuote) || this.eat(v.dot)) {
    var _ = this.startNodeAt(i, r);
    (_.object = e),
      (_.property = x
        ? this.parseExpression()
        : this.parseIdent(this.options.allowReserved !== "never")),
      (_.computed = !!x),
      x && this.expect(v.bracketR),
      d && (_.optional = g),
      (e = this.finishNode(_, "MemberExpression"));
  } else if (!n && this.eat(v.parenL)) {
    var C = new Ci(),
      k = this.yieldPos,
      A = this.awaitPos,
      P = this.awaitIdentPos;
    (this.yieldPos = 0), (this.awaitPos = 0), (this.awaitIdentPos = 0);
    var N = this.parseExprList(v.parenR, this.options.ecmaVersion >= 8, !1, C);
    if (o && !g && !this.canInsertSemicolon() && this.eat(v.arrow))
      return (
        this.checkPatternErrors(C, !1),
        this.checkYieldAwaitInDefaultParams(),
        this.awaitIdentPos > 0 &&
          this.raise(
            this.awaitIdentPos,
            "Cannot use 'await' as identifier inside an async function",
          ),
        (this.yieldPos = k),
        (this.awaitPos = A),
        (this.awaitIdentPos = P),
        this.parseArrowExpression(this.startNodeAt(i, r), N, !0)
      );
    this.checkExpressionErrors(C, !0),
      (this.yieldPos = k || this.yieldPos),
      (this.awaitPos = A || this.awaitPos),
      (this.awaitIdentPos = P || this.awaitIdentPos);
    var E = this.startNodeAt(i, r);
    (E.callee = e),
      (E.arguments = N),
      d && (E.optional = g),
      (e = this.finishNode(E, "CallExpression"));
  } else if (this.type === v.backQuote) {
    (g || f) &&
      this.raise(
        this.start,
        "Optional chaining cannot appear in the tag of tagged template expressions",
      );
    var w = this.startNodeAt(i, r);
    (w.tag = e),
      (w.quasi = this.parseTemplate({ isTagged: !0 })),
      (e = this.finishNode(w, "TaggedTemplateExpression"));
  }
  return e;
};
ae.parseExprAtom = function (e) {
  this.type === v.slash && this.readRegexp();
  var i,
    r = this.potentialArrowAt === this.start;
  switch (this.type) {
    case v._super:
      return (
        this.allowSuper || this.raise(this.start, "'super' keyword outside a method"),
        (i = this.startNode()),
        this.next(),
        this.type === v.parenL &&
          !this.allowDirectSuper &&
          this.raise(i.start, "super() call outside constructor of a subclass"),
        this.type !== v.dot &&
          this.type !== v.bracketL &&
          this.type !== v.parenL &&
          this.unexpected(),
        this.finishNode(i, "Super")
      );
    case v._this:
      return (i = this.startNode()), this.next(), this.finishNode(i, "ThisExpression");
    case v.name: {
      var n = this.start,
        o = this.startLoc,
        f = this.containsEsc,
        d = this.parseIdent(!1);
      if (
        this.options.ecmaVersion >= 8 &&
        !f &&
        d.name === "async" &&
        !this.canInsertSemicolon() &&
        this.eat(v._function)
      )
        return this.parseFunction(this.startNodeAt(n, o), 0, !1, !0);
      if (r && !this.canInsertSemicolon()) {
        if (this.eat(v.arrow)) return this.parseArrowExpression(this.startNodeAt(n, o), [d], !1);
        if (this.options.ecmaVersion >= 8 && d.name === "async" && this.type === v.name && !f)
          return (
            (d = this.parseIdent(!1)),
            (this.canInsertSemicolon() || !this.eat(v.arrow)) && this.unexpected(),
            this.parseArrowExpression(this.startNodeAt(n, o), [d], !0)
          );
      }
      return d;
    }
    case v.regexp: {
      var g = this.value;
      return (
        (i = this.parseLiteral(g.value)), (i.regex = { pattern: g.pattern, flags: g.flags }), i
      );
    }
    case v.num:
    case v.string:
      return this.parseLiteral(this.value);
    case v._null:
    case v._true:
    case v._false:
      return (
        (i = this.startNode()),
        (i.value = this.type === v._null ? null : this.type === v._true),
        (i.raw = this.type.keyword),
        this.next(),
        this.finishNode(i, "Literal")
      );
    case v.parenL: {
      var x = this.start,
        _ = this.parseParenAndDistinguishExpression(r);
      return (
        e &&
          (e.parenthesizedAssign < 0 &&
            !this.isSimpleAssignTarget(_) &&
            (e.parenthesizedAssign = x),
          e.parenthesizedBind < 0 && (e.parenthesizedBind = x)),
        _
      );
    }
    case v.bracketL:
      return (
        (i = this.startNode()),
        this.next(),
        (i.elements = this.parseExprList(v.bracketR, !0, !0, e)),
        this.finishNode(i, "ArrayExpression")
      );
    case v.braceL:
      return this.parseObj(!1, e);
    case v._function:
      return (i = this.startNode()), this.next(), this.parseFunction(i, 0);
    case v._class:
      return this.parseClass(this.startNode(), !1);
    case v._new:
      return this.parseNew();
    case v.backQuote:
      return this.parseTemplate();
    case v._import:
      return this.options.ecmaVersion >= 11 ? this.parseExprImport() : this.unexpected();
    default:
      this.unexpected();
  }
};
ae.parseExprImport = function () {
  var e = this.startNode();
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  var i = this.parseIdent(!0);
  switch (this.type) {
    case v.parenL:
      return this.parseDynamicImport(e);
    case v.dot:
      return (e.meta = i), this.parseImportMeta(e);
    default:
      this.unexpected();
  }
};
ae.parseDynamicImport = function (e) {
  if ((this.next(), (e.source = this.parseMaybeAssign()), !this.eat(v.parenR))) {
    var i = this.start;
    this.eat(v.comma) && this.eat(v.parenR)
      ? this.raiseRecoverable(i, "Trailing comma is not allowed in import()")
      : this.unexpected(i);
  }
  return this.finishNode(e, "ImportExpression");
};
ae.parseImportMeta = function (e) {
  this.next();
  var i = this.containsEsc;
  return (
    (e.property = this.parseIdent(!0)),
    e.property.name !== "meta" &&
      this.raiseRecoverable(
        e.property.start,
        "The only valid meta property for import is 'import.meta'",
      ),
    i && this.raiseRecoverable(e.start, "'import.meta' must not contain escaped characters"),
    this.options.sourceType !== "module" &&
      this.raiseRecoverable(e.start, "Cannot use 'import.meta' outside a module"),
    this.finishNode(e, "MetaProperty")
  );
};
ae.parseLiteral = function (e) {
  var i = this.startNode();
  return (
    (i.value = e),
    (i.raw = this.input.slice(this.start, this.end)),
    i.raw.charCodeAt(i.raw.length - 1) === 110 && (i.bigint = i.raw.slice(0, -1).replace(/_/g, "")),
    this.next(),
    this.finishNode(i, "Literal")
  );
};
ae.parseParenExpression = function () {
  this.expect(v.parenL);
  var e = this.parseExpression();
  return this.expect(v.parenR), e;
};
ae.parseParenAndDistinguishExpression = function (e) {
  var i = this.start,
    r = this.startLoc,
    n,
    o = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var f = this.start,
      d = this.startLoc,
      g = [],
      x = !0,
      _ = !1,
      C = new Ci(),
      k = this.yieldPos,
      A = this.awaitPos,
      P;
    for (this.yieldPos = 0, this.awaitPos = 0; this.type !== v.parenR; )
      if ((x ? (x = !1) : this.expect(v.comma), o && this.afterTrailingComma(v.parenR, !0))) {
        _ = !0;
        break;
      } else if (this.type === v.ellipsis) {
        (P = this.start),
          g.push(this.parseParenItem(this.parseRestBinding())),
          this.type === v.comma &&
            this.raise(this.start, "Comma is not permitted after the rest element");
        break;
      } else g.push(this.parseMaybeAssign(!1, C, this.parseParenItem));
    var N = this.start,
      E = this.startLoc;
    if ((this.expect(v.parenR), e && !this.canInsertSemicolon() && this.eat(v.arrow)))
      return (
        this.checkPatternErrors(C, !1),
        this.checkYieldAwaitInDefaultParams(),
        (this.yieldPos = k),
        (this.awaitPos = A),
        this.parseParenArrowList(i, r, g)
      );
    (!g.length || _) && this.unexpected(this.lastTokStart),
      P && this.unexpected(P),
      this.checkExpressionErrors(C, !0),
      (this.yieldPos = k || this.yieldPos),
      (this.awaitPos = A || this.awaitPos),
      g.length > 1
        ? ((n = this.startNodeAt(f, d)),
          (n.expressions = g),
          this.finishNodeAt(n, "SequenceExpression", N, E))
        : (n = g[0]);
  } else n = this.parseParenExpression();
  if (this.options.preserveParens) {
    var w = this.startNodeAt(i, r);
    return (w.expression = n), this.finishNode(w, "ParenthesizedExpression");
  } else return n;
};
ae.parseParenItem = (e) => e;
ae.parseParenArrowList = function (e, i, r) {
  return this.parseArrowExpression(this.startNodeAt(e, i), r);
};
var Xa = [];
ae.parseNew = function () {
  this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  var e = this.startNode(),
    i = this.parseIdent(!0);
  if (this.options.ecmaVersion >= 6 && this.eat(v.dot)) {
    e.meta = i;
    var r = this.containsEsc;
    return (
      (e.property = this.parseIdent(!0)),
      e.property.name !== "target" &&
        this.raiseRecoverable(
          e.property.start,
          "The only valid meta property for new is 'new.target'",
        ),
      r && this.raiseRecoverable(e.start, "'new.target' must not contain escaped characters"),
      this.inNonArrowFunction() ||
        this.raiseRecoverable(e.start, "'new.target' can only be used in functions"),
      this.finishNode(e, "MetaProperty")
    );
  }
  var n = this.start,
    o = this.startLoc,
    f = this.type === v._import;
  return (
    (e.callee = this.parseSubscripts(this.parseExprAtom(), n, o, !0)),
    f && e.callee.type === "ImportExpression" && this.raise(n, "Cannot use new with import()"),
    this.eat(v.parenL)
      ? (e.arguments = this.parseExprList(v.parenR, this.options.ecmaVersion >= 8, !1))
      : (e.arguments = Xa),
    this.finishNode(e, "NewExpression")
  );
};
ae.parseTemplateElement = function (e) {
  var i = e.isTagged,
    r = this.startNode();
  return (
    this.type === v.invalidTemplate
      ? (i || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"),
        (r.value = { raw: this.value, cooked: null }))
      : (r.value = {
          raw: this.input.slice(this.start, this.end).replace(
            /\r\n?/g,
            `
`,
          ),
          cooked: this.value,
        }),
    this.next(),
    (r.tail = this.type === v.backQuote),
    this.finishNode(r, "TemplateElement")
  );
};
ae.parseTemplate = function (e) {
  e === void 0 && (e = {});
  var i = e.isTagged;
  i === void 0 && (i = !1);
  var r = this.startNode();
  this.next(), (r.expressions = []);
  var n = this.parseTemplateElement({ isTagged: i });
  for (r.quasis = [n]; !n.tail; )
    this.type === v.eof && this.raise(this.pos, "Unterminated template literal"),
      this.expect(v.dollarBraceL),
      r.expressions.push(this.parseExpression()),
      this.expect(v.braceR),
      r.quasis.push((n = this.parseTemplateElement({ isTagged: i })));
  return this.next(), this.finishNode(r, "TemplateLiteral");
};
ae.isAsyncProp = function (e) {
  return (
    !e.computed &&
    e.key.type === "Identifier" &&
    e.key.name === "async" &&
    (this.type === v.name ||
      this.type === v.num ||
      this.type === v.string ||
      this.type === v.bracketL ||
      this.type.keyword ||
      (this.options.ecmaVersion >= 9 && this.type === v.star)) &&
    !Je.test(this.input.slice(this.lastTokEnd, this.start))
  );
};
ae.parseObj = function (e, i) {
  var r = this.startNode(),
    n = !0,
    o = {};
  for (r.properties = [], this.next(); !this.eat(v.braceR); ) {
    if (n) n = !1;
    else if (
      (this.expect(v.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(v.braceR))
    )
      break;
    var f = this.parseProperty(e, i);
    e || this.checkPropClash(f, o, i), r.properties.push(f);
  }
  return this.finishNode(r, e ? "ObjectPattern" : "ObjectExpression");
};
ae.parseProperty = function (e, i) {
  var r = this.startNode(),
    n,
    o,
    f,
    d;
  if (this.options.ecmaVersion >= 9 && this.eat(v.ellipsis))
    return e
      ? ((r.argument = this.parseIdent(!1)),
        this.type === v.comma &&
          this.raise(this.start, "Comma is not permitted after the rest element"),
        this.finishNode(r, "RestElement"))
      : (this.type === v.parenL &&
          i &&
          (i.parenthesizedAssign < 0 && (i.parenthesizedAssign = this.start),
          i.parenthesizedBind < 0 && (i.parenthesizedBind = this.start)),
        (r.argument = this.parseMaybeAssign(!1, i)),
        this.type === v.comma && i && i.trailingComma < 0 && (i.trailingComma = this.start),
        this.finishNode(r, "SpreadElement"));
  this.options.ecmaVersion >= 6 &&
    ((r.method = !1),
    (r.shorthand = !1),
    (e || i) && ((f = this.start), (d = this.startLoc)),
    e || (n = this.eat(v.star)));
  var g = this.containsEsc;
  return (
    this.parsePropertyName(r),
    !e && !g && this.options.ecmaVersion >= 8 && !n && this.isAsyncProp(r)
      ? ((o = !0),
        (n = this.options.ecmaVersion >= 9 && this.eat(v.star)),
        this.parsePropertyName(r, i))
      : (o = !1),
    this.parsePropertyValue(r, e, n, o, f, d, i, g),
    this.finishNode(r, "Property")
  );
};
ae.parsePropertyValue = function (e, i, r, n, o, f, d, g) {
  if (((r || n) && this.type === v.colon && this.unexpected(), this.eat(v.colon)))
    (e.value = i
      ? this.parseMaybeDefault(this.start, this.startLoc)
      : this.parseMaybeAssign(!1, d)),
      (e.kind = "init");
  else if (this.options.ecmaVersion >= 6 && this.type === v.parenL)
    i && this.unexpected(), (e.kind = "init"), (e.method = !0), (e.value = this.parseMethod(r, n));
  else if (
    !i &&
    !g &&
    this.options.ecmaVersion >= 5 &&
    !e.computed &&
    e.key.type === "Identifier" &&
    (e.key.name === "get" || e.key.name === "set") &&
    this.type !== v.comma &&
    this.type !== v.braceR &&
    this.type !== v.eq
  ) {
    (r || n) && this.unexpected(),
      (e.kind = e.key.name),
      this.parsePropertyName(e),
      (e.value = this.parseMethod(!1));
    var x = e.kind === "get" ? 0 : 1;
    if (e.value.params.length !== x) {
      var _ = e.value.start;
      e.kind === "get"
        ? this.raiseRecoverable(_, "getter should have no params")
        : this.raiseRecoverable(_, "setter should have exactly one param");
    } else
      e.kind === "set" &&
        e.value.params[0].type === "RestElement" &&
        this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
  } else
    this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier"
      ? ((r || n) && this.unexpected(),
        this.checkUnreserved(e.key),
        e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = o),
        (e.kind = "init"),
        i
          ? (e.value = this.parseMaybeDefault(o, f, e.key))
          : this.type === v.eq && d
            ? (d.shorthandAssign < 0 && (d.shorthandAssign = this.start),
              (e.value = this.parseMaybeDefault(o, f, e.key)))
            : (e.value = e.key),
        (e.shorthand = !0))
      : this.unexpected();
};
ae.parsePropertyName = function (e) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(v.bracketL))
      return (e.computed = !0), (e.key = this.parseMaybeAssign()), this.expect(v.bracketR), e.key;
    e.computed = !1;
  }
  return (e.key =
    this.type === v.num || this.type === v.string
      ? this.parseExprAtom()
      : this.parseIdent(this.options.allowReserved !== "never"));
};
ae.initFunction = function (e) {
  (e.id = null),
    this.options.ecmaVersion >= 6 && (e.generator = e.expression = !1),
    this.options.ecmaVersion >= 8 && (e.async = !1);
};
ae.parseMethod = function (e, i, r) {
  var n = this.startNode(),
    o = this.yieldPos,
    f = this.awaitPos,
    d = this.awaitIdentPos;
  return (
    this.initFunction(n),
    this.options.ecmaVersion >= 6 && (n.generator = e),
    this.options.ecmaVersion >= 8 && (n.async = !!i),
    (this.yieldPos = 0),
    (this.awaitPos = 0),
    (this.awaitIdentPos = 0),
    this.enterScope(lr(i, n.generator) | Ks | (r ? Xs : 0)),
    this.expect(v.parenL),
    (n.params = this.parseBindingList(v.parenR, !1, this.options.ecmaVersion >= 8)),
    this.checkYieldAwaitInDefaultParams(),
    this.parseFunctionBody(n, !1, !0),
    (this.yieldPos = o),
    (this.awaitPos = f),
    (this.awaitIdentPos = d),
    this.finishNode(n, "FunctionExpression")
  );
};
ae.parseArrowExpression = function (e, i, r) {
  var n = this.yieldPos,
    o = this.awaitPos,
    f = this.awaitIdentPos;
  return (
    this.enterScope(lr(r, !1) | Hs),
    this.initFunction(e),
    this.options.ecmaVersion >= 8 && (e.async = !!r),
    (this.yieldPos = 0),
    (this.awaitPos = 0),
    (this.awaitIdentPos = 0),
    (e.params = this.toAssignableList(i, !0)),
    this.parseFunctionBody(e, !0, !1),
    (this.yieldPos = n),
    (this.awaitPos = o),
    (this.awaitIdentPos = f),
    this.finishNode(e, "ArrowFunctionExpression")
  );
};
ae.parseFunctionBody = function (e, i, r) {
  var n = i && this.type !== v.braceL,
    o = this.strict,
    f = !1;
  if (n) (e.body = this.parseMaybeAssign()), (e.expression = !0), this.checkParams(e, !1);
  else {
    var d = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
    (!o || d) &&
      ((f = this.strictDirective(this.end)),
      f &&
        d &&
        this.raiseRecoverable(
          e.start,
          "Illegal 'use strict' directive in function with non-simple parameter list",
        ));
    var g = this.labels;
    (this.labels = []),
      f && (this.strict = !0),
      this.checkParams(e, !o && !f && !i && !r && this.isSimpleParamList(e.params)),
      this.strict && e.id && this.checkLVal(e.id, Zs),
      (e.body = this.parseBlock(!1, void 0, f && !o)),
      (e.expression = !1),
      this.adaptDirectivePrologue(e.body.body),
      (this.labels = g);
  }
  this.exitScope();
};
ae.isSimpleParamList = (e) => {
  for (var i = 0, r = e; i < r.length; i += 1) {
    var n = r[i];
    if (n.type !== "Identifier") return !1;
  }
  return !0;
};
ae.checkParams = function (e, i) {
  for (var r = {}, n = 0, o = e.params; n < o.length; n += 1) {
    var f = o[n];
    this.checkLVal(f, cr, i ? null : r);
  }
};
ae.parseExprList = function (e, i, r, n) {
  for (var o = [], f = !0; !this.eat(e); ) {
    if (f) f = !1;
    else if ((this.expect(v.comma), i && this.afterTrailingComma(e))) break;
    var d = void 0;
    r && this.type === v.comma
      ? (d = null)
      : this.type === v.ellipsis
        ? ((d = this.parseSpread(n)),
          n && this.type === v.comma && n.trailingComma < 0 && (n.trailingComma = this.start))
        : (d = this.parseMaybeAssign(!1, n)),
      o.push(d);
  }
  return o;
};
ae.checkUnreserved = function (e) {
  var i = e.start,
    r = e.end,
    n = e.name;
  if (
    (this.inGenerator &&
      n === "yield" &&
      this.raiseRecoverable(i, "Cannot use 'yield' as identifier inside a generator"),
    this.inAsync &&
      n === "await" &&
      this.raiseRecoverable(i, "Cannot use 'await' as identifier inside an async function"),
    this.keywords.test(n) && this.raise(i, "Unexpected keyword '" + n + "'"),
    !(this.options.ecmaVersion < 6 && this.input.slice(i, r).indexOf("\\") !== -1))
  ) {
    var o = this.strict ? this.reservedWordsStrict : this.reservedWords;
    o.test(n) &&
      (!this.inAsync &&
        n === "await" &&
        this.raiseRecoverable(i, "Cannot use keyword 'await' outside an async function"),
      this.raiseRecoverable(i, "The keyword '" + n + "' is reserved"));
  }
};
ae.parseIdent = function (e, i) {
  var r = this.startNode();
  return (
    this.type === v.name
      ? (r.name = this.value)
      : this.type.keyword
        ? ((r.name = this.type.keyword),
          (r.name === "class" || r.name === "function") &&
            (this.lastTokEnd !== this.lastTokStart + 1 ||
              this.input.charCodeAt(this.lastTokStart) !== 46) &&
            this.context.pop())
        : this.unexpected(),
    this.next(!!e),
    this.finishNode(r, "Identifier"),
    e ||
      (this.checkUnreserved(r),
      r.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = r.start)),
    r
  );
};
ae.parseYield = function (e) {
  this.yieldPos || (this.yieldPos = this.start);
  var i = this.startNode();
  return (
    this.next(),
    this.type === v.semi ||
    this.canInsertSemicolon() ||
    (this.type !== v.star && !this.type.startsExpr)
      ? ((i.delegate = !1), (i.argument = null))
      : ((i.delegate = this.eat(v.star)), (i.argument = this.parseMaybeAssign(e))),
    this.finishNode(i, "YieldExpression")
  );
};
ae.parseAwait = function () {
  this.awaitPos || (this.awaitPos = this.start);
  var e = this.startNode();
  return (
    this.next(),
    (e.argument = this.parseMaybeUnary(null, !1)),
    this.finishNode(e, "AwaitExpression")
  );
};
var vi = Te.prototype;
vi.raise = function (e, i) {
  var r = Gs(this.input, e);
  i += " (" + r.line + ":" + r.column + ")";
  var n = new SyntaxError(i);
  throw ((n.pos = e), (n.loc = r), (n.raisedAt = this.pos), n);
};
vi.raiseRecoverable = vi.raise;
vi.curPosition = function () {
  if (this.options.locations) return new ei(this.curLine, this.pos - this.lineStart);
};
var bt = Te.prototype,
  Ja = function (i) {
    (this.flags = i), (this.var = []), (this.lexical = []), (this.functions = []);
  };
bt.enterScope = function (e) {
  this.scopeStack.push(new Ja(e));
};
bt.exitScope = function () {
  this.scopeStack.pop();
};
bt.treatFunctionsAsVarInScope = function (e) {
  return e.flags & ai || (!this.inModule && e.flags & ti);
};
bt.declareName = function (e, i, r) {
  var n = !1;
  if (i === lt) {
    var o = this.currentScope();
    (n = o.lexical.indexOf(e) > -1 || o.functions.indexOf(e) > -1 || o.var.indexOf(e) > -1),
      o.lexical.push(e),
      this.inModule && o.flags & ti && delete this.undefinedExports[e];
  } else if (i === Ys) {
    var f = this.currentScope();
    f.lexical.push(e);
  } else if (i === Js) {
    var d = this.currentScope();
    this.treatFunctionsAsVar
      ? (n = d.lexical.indexOf(e) > -1)
      : (n = d.lexical.indexOf(e) > -1 || d.var.indexOf(e) > -1),
      d.functions.push(e);
  } else
    for (var g = this.scopeStack.length - 1; g >= 0; --g) {
      var x = this.scopeStack[g];
      if (
        (x.lexical.indexOf(e) > -1 && !(x.flags & Qs && x.lexical[0] === e)) ||
        (!this.treatFunctionsAsVarInScope(x) && x.functions.indexOf(e) > -1)
      ) {
        n = !0;
        break;
      }
      if (
        (x.var.push(e),
        this.inModule && x.flags & ti && delete this.undefinedExports[e],
        x.flags & hr)
      )
        break;
    }
  n && this.raiseRecoverable(r, "Identifier '" + e + "' has already been declared");
};
bt.checkLocalExport = function (e) {
  this.scopeStack[0].lexical.indexOf(e.name) === -1 &&
    this.scopeStack[0].var.indexOf(e.name) === -1 &&
    (this.undefinedExports[e.name] = e);
};
bt.currentScope = function () {
  return this.scopeStack[this.scopeStack.length - 1];
};
bt.currentVarScope = function () {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var i = this.scopeStack[e];
    if (i.flags & hr) return i;
  }
};
bt.currentThisScope = function () {
  for (var e = this.scopeStack.length - 1; ; e--) {
    var i = this.scopeStack[e];
    if (i.flags & hr && !(i.flags & Hs)) return i;
  }
};
var pr = function (i, r, n) {
    (this.type = ""),
      (this.start = r),
      (this.end = 0),
      i.options.locations && (this.loc = new _i(i, n)),
      i.options.directSourceFile && (this.sourceFile = i.options.directSourceFile),
      i.options.ranges && (this.range = [r, 0]);
  },
  Ei = Te.prototype;
Ei.startNode = function () {
  return new pr(this, this.start, this.startLoc);
};
Ei.startNodeAt = function (e, i) {
  return new pr(this, e, i);
};
function en(e, i, r, n) {
  return (
    (e.type = i),
    (e.end = r),
    this.options.locations && (e.loc.end = n),
    this.options.ranges && (e.range[1] = r),
    e
  );
}
Ei.finishNode = function (e, i) {
  return en.call(this, e, i, this.lastTokEnd, this.lastTokEndLoc);
};
Ei.finishNodeAt = function (e, i, r, n) {
  return en.call(this, e, i, r, n);
};
var Ye = function (i, r, n, o, f) {
    (this.token = i),
      (this.isExpr = !!r),
      (this.preserveSpace = !!n),
      (this.override = o),
      (this.generator = !!f);
  },
  Ae = {
    b_stat: new Ye("{", !1),
    b_expr: new Ye("{", !0),
    b_tmpl: new Ye("${", !1),
    p_stat: new Ye("(", !1),
    p_expr: new Ye("(", !0),
    q_tmpl: new Ye("`", !0, !0, (e) => e.tryReadTemplateToken()),
    f_stat: new Ye("function", !1),
    f_expr: new Ye("function", !0),
    f_expr_gen: new Ye("function", !0, !1, null, !0),
    f_gen: new Ye("function", !1, !1, null, !0),
  },
  wi = Te.prototype;
wi.initialContext = () => [Ae.b_stat];
wi.braceIsBlock = function (e) {
  var i = this.curContext();
  return i === Ae.f_expr || i === Ae.f_stat
    ? !0
    : e === v.colon && (i === Ae.b_stat || i === Ae.b_expr)
      ? !i.isExpr
      : e === v._return || (e === v.name && this.exprAllowed)
        ? Je.test(this.input.slice(this.lastTokEnd, this.start))
        : e === v._else || e === v.semi || e === v.eof || e === v.parenR || e === v.arrow
          ? !0
          : e === v.braceL
            ? i === Ae.b_stat
            : e === v._var || e === v._const || e === v.name
              ? !1
              : !this.exprAllowed;
};
wi.inGeneratorContext = function () {
  for (var e = this.context.length - 1; e >= 1; e--) {
    var i = this.context[e];
    if (i.token === "function") return i.generator;
  }
  return !1;
};
wi.updateContext = function (e) {
  var i,
    r = this.type;
  r.keyword && e === v.dot
    ? (this.exprAllowed = !1)
    : (i = r.updateContext)
      ? i.call(this, e)
      : (this.exprAllowed = r.beforeExpr);
};
v.parenR.updateContext = v.braceR.updateContext = function () {
  if (this.context.length === 1) {
    this.exprAllowed = !0;
    return;
  }
  var e = this.context.pop();
  e === Ae.b_stat && this.curContext().token === "function" && (e = this.context.pop()),
    (this.exprAllowed = !e.isExpr);
};
v.braceL.updateContext = function (e) {
  this.context.push(this.braceIsBlock(e) ? Ae.b_stat : Ae.b_expr), (this.exprAllowed = !0);
};
v.dollarBraceL.updateContext = function () {
  this.context.push(Ae.b_tmpl), (this.exprAllowed = !0);
};
v.parenL.updateContext = function (e) {
  var i = e === v._if || e === v._for || e === v._with || e === v._while;
  this.context.push(i ? Ae.p_stat : Ae.p_expr), (this.exprAllowed = !0);
};
v.incDec.updateContext = () => {};
v._function.updateContext = v._class.updateContext = function (e) {
  e.beforeExpr &&
  e !== v.semi &&
  e !== v._else &&
  !(e === v._return && Je.test(this.input.slice(this.lastTokEnd, this.start))) &&
  !((e === v.colon || e === v.braceL) && this.curContext() === Ae.b_stat)
    ? this.context.push(Ae.f_expr)
    : this.context.push(Ae.f_stat),
    (this.exprAllowed = !1);
};
v.backQuote.updateContext = function () {
  this.curContext() === Ae.q_tmpl ? this.context.pop() : this.context.push(Ae.q_tmpl),
    (this.exprAllowed = !1);
};
v.star.updateContext = function (e) {
  if (e === v._function) {
    var i = this.context.length - 1;
    this.context[i] === Ae.f_expr
      ? (this.context[i] = Ae.f_expr_gen)
      : (this.context[i] = Ae.f_gen);
  }
  this.exprAllowed = !0;
};
v.name.updateContext = function (e) {
  var i = !1;
  this.options.ecmaVersion >= 6 &&
    e !== v.dot &&
    ((this.value === "of" && !this.exprAllowed) ||
      (this.value === "yield" && this.inGeneratorContext())) &&
    (i = !0),
    (this.exprAllowed = i);
};
var tn =
    "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS",
  rn = tn + " Extended_Pictographic",
  Ya = rn,
  Za = { 9: tn, 10: rn, 11: Ya },
  ls =
    "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu",
  sn =
    "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb",
  nn =
    sn +
    " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd",
  $a = nn + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho",
  eo = { 9: sn, 10: nn, 11: $a },
  an = {};
function dr(e) {
  var i = (an[e] = {
    binary: wt(Za[e] + " " + ls),
    nonBinary: { General_Category: wt(ls), Script: wt(eo[e]) },
  });
  (i.nonBinary.Script_Extensions = i.nonBinary.Script),
    (i.nonBinary.gc = i.nonBinary.General_Category),
    (i.nonBinary.sc = i.nonBinary.Script),
    (i.nonBinary.scx = i.nonBinary.Script_Extensions);
}
dr(9);
dr(10);
dr(11);
var Z = Te.prototype,
  ft = function (i) {
    (this.parser = i),
      (this.validFlags =
        "gim" + (i.options.ecmaVersion >= 6 ? "uy" : "") + (i.options.ecmaVersion >= 9 ? "s" : "")),
      (this.unicodeProperties = an[i.options.ecmaVersion >= 11 ? 11 : i.options.ecmaVersion]),
      (this.source = ""),
      (this.flags = ""),
      (this.start = 0),
      (this.switchU = !1),
      (this.switchN = !1),
      (this.pos = 0),
      (this.lastIntValue = 0),
      (this.lastStringValue = ""),
      (this.lastAssertionIsQuantifiable = !1),
      (this.numCapturingParens = 0),
      (this.maxBackReference = 0),
      (this.groupNames = []),
      (this.backReferenceNames = []);
  };
ft.prototype.reset = function (i, r, n) {
  var o = n.indexOf("u") !== -1;
  (this.start = i | 0),
    (this.source = r + ""),
    (this.flags = n),
    (this.switchU = o && this.parser.options.ecmaVersion >= 6),
    (this.switchN = o && this.parser.options.ecmaVersion >= 9);
};
ft.prototype.raise = function (i) {
  this.parser.raiseRecoverable(
    this.start,
    "Invalid regular expression: /" + this.source + "/: " + i,
  );
};
ft.prototype.at = function (i, r) {
  r === void 0 && (r = !1);
  var n = this.source,
    o = n.length;
  if (i >= o) return -1;
  var f = n.charCodeAt(i);
  if (!(r || this.switchU) || f <= 55295 || f >= 57344 || i + 1 >= o) return f;
  var d = n.charCodeAt(i + 1);
  return d >= 56320 && d <= 57343 ? (f << 10) + d - 56613888 : f;
};
ft.prototype.nextIndex = function (i, r) {
  r === void 0 && (r = !1);
  var n = this.source,
    o = n.length;
  if (i >= o) return o;
  var f = n.charCodeAt(i),
    d;
  return !(r || this.switchU) ||
    f <= 55295 ||
    f >= 57344 ||
    i + 1 >= o ||
    (d = n.charCodeAt(i + 1)) < 56320 ||
    d > 57343
    ? i + 1
    : i + 2;
};
ft.prototype.current = function (i) {
  return i === void 0 && (i = !1), this.at(this.pos, i);
};
ft.prototype.lookahead = function (i) {
  return i === void 0 && (i = !1), this.at(this.nextIndex(this.pos, i), i);
};
ft.prototype.advance = function (i) {
  i === void 0 && (i = !1), (this.pos = this.nextIndex(this.pos, i));
};
ft.prototype.eat = function (i, r) {
  return r === void 0 && (r = !1), this.current(r) === i ? (this.advance(r), !0) : !1;
};
function yi(e) {
  return e <= 65535
    ? String.fromCharCode(e)
    : ((e -= 65536), String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
Z.validateRegExpFlags = function (e) {
  for (var i = e.validFlags, r = e.flags, n = 0; n < r.length; n++) {
    var o = r.charAt(n);
    i.indexOf(o) === -1 && this.raise(e.start, "Invalid regular expression flag"),
      r.indexOf(o, n + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag");
  }
};
Z.validateRegExpPattern = function (e) {
  this.regexp_pattern(e),
    !e.switchN &&
      this.options.ecmaVersion >= 9 &&
      e.groupNames.length > 0 &&
      ((e.switchN = !0), this.regexp_pattern(e));
};
Z.regexp_pattern = function (e) {
  (e.pos = 0),
    (e.lastIntValue = 0),
    (e.lastStringValue = ""),
    (e.lastAssertionIsQuantifiable = !1),
    (e.numCapturingParens = 0),
    (e.maxBackReference = 0),
    (e.groupNames.length = 0),
    (e.backReferenceNames.length = 0),
    this.regexp_disjunction(e),
    e.pos !== e.source.length &&
      (e.eat(41) && e.raise("Unmatched ')'"),
      (e.eat(93) || e.eat(125)) && e.raise("Lone quantifier brackets")),
    e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
  for (var i = 0, r = e.backReferenceNames; i < r.length; i += 1) {
    var n = r[i];
    e.groupNames.indexOf(n) === -1 && e.raise("Invalid named capture referenced");
  }
};
Z.regexp_disjunction = function (e) {
  for (this.regexp_alternative(e); e.eat(124); ) this.regexp_alternative(e);
  this.regexp_eatQuantifier(e, !0) && e.raise("Nothing to repeat"),
    e.eat(123) && e.raise("Lone quantifier brackets");
};
Z.regexp_alternative = function (e) {
  for (; e.pos < e.source.length && this.regexp_eatTerm(e); );
};
Z.regexp_eatTerm = function (e) {
  return this.regexp_eatAssertion(e)
    ? (e.lastAssertionIsQuantifiable &&
        this.regexp_eatQuantifier(e) &&
        e.switchU &&
        e.raise("Invalid quantifier"),
      !0)
    : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e))
      ? (this.regexp_eatQuantifier(e), !0)
      : !1;
};
Z.regexp_eatAssertion = function (e) {
  var i = e.pos;
  if (((e.lastAssertionIsQuantifiable = !1), e.eat(94) || e.eat(36))) return !0;
  if (e.eat(92)) {
    if (e.eat(66) || e.eat(98)) return !0;
    e.pos = i;
  }
  if (e.eat(40) && e.eat(63)) {
    var r = !1;
    if ((this.options.ecmaVersion >= 9 && (r = e.eat(60)), e.eat(61) || e.eat(33)))
      return (
        this.regexp_disjunction(e),
        e.eat(41) || e.raise("Unterminated group"),
        (e.lastAssertionIsQuantifiable = !r),
        !0
      );
  }
  return (e.pos = i), !1;
};
Z.regexp_eatQuantifier = function (e, i) {
  return i === void 0 && (i = !1), this.regexp_eatQuantifierPrefix(e, i) ? (e.eat(63), !0) : !1;
};
Z.regexp_eatQuantifierPrefix = function (e, i) {
  return e.eat(42) || e.eat(43) || e.eat(63) || this.regexp_eatBracedQuantifier(e, i);
};
Z.regexp_eatBracedQuantifier = function (e, i) {
  var r = e.pos;
  if (e.eat(123)) {
    var n = 0,
      o = -1;
    if (
      this.regexp_eatDecimalDigits(e) &&
      ((n = e.lastIntValue),
      e.eat(44) && this.regexp_eatDecimalDigits(e) && (o = e.lastIntValue),
      e.eat(125))
    )
      return o !== -1 && o < n && !i && e.raise("numbers out of order in {} quantifier"), !0;
    e.switchU && !i && e.raise("Incomplete quantifier"), (e.pos = r);
  }
  return !1;
};
Z.regexp_eatAtom = function (e) {
  return (
    this.regexp_eatPatternCharacters(e) ||
    e.eat(46) ||
    this.regexp_eatReverseSolidusAtomEscape(e) ||
    this.regexp_eatCharacterClass(e) ||
    this.regexp_eatUncapturingGroup(e) ||
    this.regexp_eatCapturingGroup(e)
  );
};
Z.regexp_eatReverseSolidusAtomEscape = function (e) {
  var i = e.pos;
  if (e.eat(92)) {
    if (this.regexp_eatAtomEscape(e)) return !0;
    e.pos = i;
  }
  return !1;
};
Z.regexp_eatUncapturingGroup = function (e) {
  var i = e.pos;
  if (e.eat(40)) {
    if (e.eat(63) && e.eat(58)) {
      if ((this.regexp_disjunction(e), e.eat(41))) return !0;
      e.raise("Unterminated group");
    }
    e.pos = i;
  }
  return !1;
};
Z.regexp_eatCapturingGroup = function (e) {
  if (e.eat(40)) {
    if (
      (this.options.ecmaVersion >= 9
        ? this.regexp_groupSpecifier(e)
        : e.current() === 63 && e.raise("Invalid group"),
      this.regexp_disjunction(e),
      e.eat(41))
    )
      return (e.numCapturingParens += 1), !0;
    e.raise("Unterminated group");
  }
  return !1;
};
Z.regexp_eatExtendedAtom = function (e) {
  return (
    e.eat(46) ||
    this.regexp_eatReverseSolidusAtomEscape(e) ||
    this.regexp_eatCharacterClass(e) ||
    this.regexp_eatUncapturingGroup(e) ||
    this.regexp_eatCapturingGroup(e) ||
    this.regexp_eatInvalidBracedQuantifier(e) ||
    this.regexp_eatExtendedPatternCharacter(e)
  );
};
Z.regexp_eatInvalidBracedQuantifier = function (e) {
  return this.regexp_eatBracedQuantifier(e, !0) && e.raise("Nothing to repeat"), !1;
};
Z.regexp_eatSyntaxCharacter = (e) => {
  var i = e.current();
  return on(i) ? ((e.lastIntValue = i), e.advance(), !0) : !1;
};
function on(e) {
  return (
    e === 36 ||
    (e >= 40 && e <= 43) ||
    e === 46 ||
    e === 63 ||
    (e >= 91 && e <= 94) ||
    (e >= 123 && e <= 125)
  );
}
Z.regexp_eatPatternCharacters = (e) => {
  for (var i = e.pos, r = 0; (r = e.current()) !== -1 && !on(r); ) e.advance();
  return e.pos !== i;
};
Z.regexp_eatExtendedPatternCharacter = (e) => {
  var i = e.current();
  return i !== -1 &&
    i !== 36 &&
    !(i >= 40 && i <= 43) &&
    i !== 46 &&
    i !== 63 &&
    i !== 91 &&
    i !== 94 &&
    i !== 124
    ? (e.advance(), !0)
    : !1;
};
Z.regexp_groupSpecifier = function (e) {
  if (e.eat(63)) {
    if (this.regexp_eatGroupName(e)) {
      e.groupNames.indexOf(e.lastStringValue) !== -1 && e.raise("Duplicate capture group name"),
        e.groupNames.push(e.lastStringValue);
      return;
    }
    e.raise("Invalid group");
  }
};
Z.regexp_eatGroupName = function (e) {
  if (((e.lastStringValue = ""), e.eat(60))) {
    if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62)) return !0;
    e.raise("Invalid capture group name");
  }
  return !1;
};
Z.regexp_eatRegExpIdentifierName = function (e) {
  if (((e.lastStringValue = ""), this.regexp_eatRegExpIdentifierStart(e))) {
    for (e.lastStringValue += yi(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e); )
      e.lastStringValue += yi(e.lastIntValue);
    return !0;
  }
  return !1;
};
Z.regexp_eatRegExpIdentifierStart = function (e) {
  var i = e.pos,
    r = this.options.ecmaVersion >= 11,
    n = e.current(r);
  return (
    e.advance(r),
    n === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, r) && (n = e.lastIntValue),
    to(n) ? ((e.lastIntValue = n), !0) : ((e.pos = i), !1)
  );
};
function to(e) {
  return vt(e, !0) || e === 36 || e === 95;
}
Z.regexp_eatRegExpIdentifierPart = function (e) {
  var i = e.pos,
    r = this.options.ecmaVersion >= 11,
    n = e.current(r);
  return (
    e.advance(r),
    n === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e, r) && (n = e.lastIntValue),
    io(n) ? ((e.lastIntValue = n), !0) : ((e.pos = i), !1)
  );
};
function io(e) {
  return Ft(e, !0) || e === 36 || e === 95 || e === 8204 || e === 8205;
}
Z.regexp_eatAtomEscape = function (e) {
  return this.regexp_eatBackReference(e) ||
    this.regexp_eatCharacterClassEscape(e) ||
    this.regexp_eatCharacterEscape(e) ||
    (e.switchN && this.regexp_eatKGroupName(e))
    ? !0
    : (e.switchU &&
        (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")),
      !1);
};
Z.regexp_eatBackReference = function (e) {
  var i = e.pos;
  if (this.regexp_eatDecimalEscape(e)) {
    var r = e.lastIntValue;
    if (e.switchU) return r > e.maxBackReference && (e.maxBackReference = r), !0;
    if (r <= e.numCapturingParens) return !0;
    e.pos = i;
  }
  return !1;
};
Z.regexp_eatKGroupName = function (e) {
  if (e.eat(107)) {
    if (this.regexp_eatGroupName(e)) return e.backReferenceNames.push(e.lastStringValue), !0;
    e.raise("Invalid named reference");
  }
  return !1;
};
Z.regexp_eatCharacterEscape = function (e) {
  return (
    this.regexp_eatControlEscape(e) ||
    this.regexp_eatCControlLetter(e) ||
    this.regexp_eatZero(e) ||
    this.regexp_eatHexEscapeSequence(e) ||
    this.regexp_eatRegExpUnicodeEscapeSequence(e, !1) ||
    (!e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e)) ||
    this.regexp_eatIdentityEscape(e)
  );
};
Z.regexp_eatCControlLetter = function (e) {
  var i = e.pos;
  if (e.eat(99)) {
    if (this.regexp_eatControlLetter(e)) return !0;
    e.pos = i;
  }
  return !1;
};
Z.regexp_eatZero = (e) =>
  e.current() === 48 && !ki(e.lookahead()) ? ((e.lastIntValue = 0), e.advance(), !0) : !1;
Z.regexp_eatControlEscape = (e) => {
  var i = e.current();
  return i === 116
    ? ((e.lastIntValue = 9), e.advance(), !0)
    : i === 110
      ? ((e.lastIntValue = 10), e.advance(), !0)
      : i === 118
        ? ((e.lastIntValue = 11), e.advance(), !0)
        : i === 102
          ? ((e.lastIntValue = 12), e.advance(), !0)
          : i === 114
            ? ((e.lastIntValue = 13), e.advance(), !0)
            : !1;
};
Z.regexp_eatControlLetter = (e) => {
  var i = e.current();
  return un(i) ? ((e.lastIntValue = i % 32), e.advance(), !0) : !1;
};
function un(e) {
  return (e >= 65 && e <= 90) || (e >= 97 && e <= 122);
}
Z.regexp_eatRegExpUnicodeEscapeSequence = function (e, i) {
  i === void 0 && (i = !1);
  var r = e.pos,
    n = i || e.switchU;
  if (e.eat(117)) {
    if (this.regexp_eatFixedHexDigits(e, 4)) {
      var o = e.lastIntValue;
      if (n && o >= 55296 && o <= 56319) {
        var f = e.pos;
        if (e.eat(92) && e.eat(117) && this.regexp_eatFixedHexDigits(e, 4)) {
          var d = e.lastIntValue;
          if (d >= 56320 && d <= 57343)
            return (e.lastIntValue = (o - 55296) * 1024 + (d - 56320) + 65536), !0;
        }
        (e.pos = f), (e.lastIntValue = o);
      }
      return !0;
    }
    if (n && e.eat(123) && this.regexp_eatHexDigits(e) && e.eat(125) && ro(e.lastIntValue))
      return !0;
    n && e.raise("Invalid unicode escape"), (e.pos = r);
  }
  return !1;
};
function ro(e) {
  return e >= 0 && e <= 1114111;
}
Z.regexp_eatIdentityEscape = function (e) {
  if (e.switchU)
    return this.regexp_eatSyntaxCharacter(e) ? !0 : e.eat(47) ? ((e.lastIntValue = 47), !0) : !1;
  var i = e.current();
  return i !== 99 && (!e.switchN || i !== 107) ? ((e.lastIntValue = i), e.advance(), !0) : !1;
};
Z.regexp_eatDecimalEscape = (e) => {
  e.lastIntValue = 0;
  var i = e.current();
  if (i >= 49 && i <= 57) {
    do (e.lastIntValue = 10 * e.lastIntValue + (i - 48)), e.advance();
    while ((i = e.current()) >= 48 && i <= 57);
    return !0;
  }
  return !1;
};
Z.regexp_eatCharacterClassEscape = function (e) {
  var i = e.current();
  if (so(i)) return (e.lastIntValue = -1), e.advance(), !0;
  if (e.switchU && this.options.ecmaVersion >= 9 && (i === 80 || i === 112)) {
    if (
      ((e.lastIntValue = -1),
      e.advance(),
      e.eat(123) && this.regexp_eatUnicodePropertyValueExpression(e) && e.eat(125))
    )
      return !0;
    e.raise("Invalid property name");
  }
  return !1;
};
function so(e) {
  return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
}
Z.regexp_eatUnicodePropertyValueExpression = function (e) {
  var i = e.pos;
  if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
    var r = e.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(e)) {
      var n = e.lastStringValue;
      return this.regexp_validateUnicodePropertyNameAndValue(e, r, n), !0;
    }
  }
  if (((e.pos = i), this.regexp_eatLoneUnicodePropertyNameOrValue(e))) {
    var o = e.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(e, o), !0;
  }
  return !1;
};
Z.regexp_validateUnicodePropertyNameAndValue = (e, i, r) => {
  Si(e.unicodeProperties.nonBinary, i) || e.raise("Invalid property name"),
    e.unicodeProperties.nonBinary[i].test(r) || e.raise("Invalid property value");
};
Z.regexp_validateUnicodePropertyNameOrValue = (e, i) => {
  e.unicodeProperties.binary.test(i) || e.raise("Invalid property name");
};
Z.regexp_eatUnicodePropertyName = (e) => {
  var i = 0;
  for (e.lastStringValue = ""; hn((i = e.current())); ) (e.lastStringValue += yi(i)), e.advance();
  return e.lastStringValue !== "";
};
function hn(e) {
  return un(e) || e === 95;
}
Z.regexp_eatUnicodePropertyValue = (e) => {
  var i = 0;
  for (e.lastStringValue = ""; no((i = e.current())); ) (e.lastStringValue += yi(i)), e.advance();
  return e.lastStringValue !== "";
};
function no(e) {
  return hn(e) || ki(e);
}
Z.regexp_eatLoneUnicodePropertyNameOrValue = function (e) {
  return this.regexp_eatUnicodePropertyValue(e);
};
Z.regexp_eatCharacterClass = function (e) {
  if (e.eat(91)) {
    if ((e.eat(94), this.regexp_classRanges(e), e.eat(93))) return !0;
    e.raise("Unterminated character class");
  }
  return !1;
};
Z.regexp_classRanges = function (e) {
  for (; this.regexp_eatClassAtom(e); ) {
    var i = e.lastIntValue;
    if (e.eat(45) && this.regexp_eatClassAtom(e)) {
      var r = e.lastIntValue;
      e.switchU && (i === -1 || r === -1) && e.raise("Invalid character class"),
        i !== -1 && r !== -1 && i > r && e.raise("Range out of order in character class");
    }
  }
};
Z.regexp_eatClassAtom = function (e) {
  var i = e.pos;
  if (e.eat(92)) {
    if (this.regexp_eatClassEscape(e)) return !0;
    if (e.switchU) {
      var r = e.current();
      (r === 99 || fn(r)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
    }
    e.pos = i;
  }
  var n = e.current();
  return n !== 93 ? ((e.lastIntValue = n), e.advance(), !0) : !1;
};
Z.regexp_eatClassEscape = function (e) {
  var i = e.pos;
  if (e.eat(98)) return (e.lastIntValue = 8), !0;
  if (e.switchU && e.eat(45)) return (e.lastIntValue = 45), !0;
  if (!e.switchU && e.eat(99)) {
    if (this.regexp_eatClassControlLetter(e)) return !0;
    e.pos = i;
  }
  return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
};
Z.regexp_eatClassControlLetter = (e) => {
  var i = e.current();
  return ki(i) || i === 95 ? ((e.lastIntValue = i % 32), e.advance(), !0) : !1;
};
Z.regexp_eatHexEscapeSequence = function (e) {
  var i = e.pos;
  if (e.eat(120)) {
    if (this.regexp_eatFixedHexDigits(e, 2)) return !0;
    e.switchU && e.raise("Invalid escape"), (e.pos = i);
  }
  return !1;
};
Z.regexp_eatDecimalDigits = (e) => {
  var i = e.pos,
    r = 0;
  for (e.lastIntValue = 0; ki((r = e.current())); )
    (e.lastIntValue = 10 * e.lastIntValue + (r - 48)), e.advance();
  return e.pos !== i;
};
function ki(e) {
  return e >= 48 && e <= 57;
}
Z.regexp_eatHexDigits = (e) => {
  var i = e.pos,
    r = 0;
  for (e.lastIntValue = 0; ln((r = e.current())); )
    (e.lastIntValue = 16 * e.lastIntValue + cn(r)), e.advance();
  return e.pos !== i;
};
function ln(e) {
  return (e >= 48 && e <= 57) || (e >= 65 && e <= 70) || (e >= 97 && e <= 102);
}
function cn(e) {
  return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
}
Z.regexp_eatLegacyOctalEscapeSequence = function (e) {
  if (this.regexp_eatOctalDigit(e)) {
    var i = e.lastIntValue;
    if (this.regexp_eatOctalDigit(e)) {
      var r = e.lastIntValue;
      i <= 3 && this.regexp_eatOctalDigit(e)
        ? (e.lastIntValue = i * 64 + r * 8 + e.lastIntValue)
        : (e.lastIntValue = i * 8 + r);
    } else e.lastIntValue = i;
    return !0;
  }
  return !1;
};
Z.regexp_eatOctalDigit = (e) => {
  var i = e.current();
  return fn(i) ? ((e.lastIntValue = i - 48), e.advance(), !0) : ((e.lastIntValue = 0), !1);
};
function fn(e) {
  return e >= 48 && e <= 55;
}
Z.regexp_eatFixedHexDigits = (e, i) => {
  var r = e.pos;
  e.lastIntValue = 0;
  for (var n = 0; n < i; ++n) {
    var o = e.current();
    if (!ln(o)) return (e.pos = r), !1;
    (e.lastIntValue = 16 * e.lastIntValue + cn(o)), e.advance();
  }
  return !0;
};
var mr = function (i) {
    (this.type = i.type),
      (this.value = i.value),
      (this.start = i.start),
      (this.end = i.end),
      i.options.locations && (this.loc = new _i(i, i.startLoc, i.endLoc)),
      i.options.ranges && (this.range = [i.start, i.end]);
  },
  le = Te.prototype;
le.next = function (e) {
  !e &&
    this.type.keyword &&
    this.containsEsc &&
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword),
    this.options.onToken && this.options.onToken(new mr(this)),
    (this.lastTokEnd = this.end),
    (this.lastTokStart = this.start),
    (this.lastTokEndLoc = this.endLoc),
    (this.lastTokStartLoc = this.startLoc),
    this.nextToken();
};
le.getToken = function () {
  return this.next(), new mr(this);
};
typeof Symbol < "u" &&
  (le[Symbol.iterator] = function () {
    return {
      next: () => {
        var i = this.getToken();
        return { done: i.type === v.eof, value: i };
      },
    };
  });
le.curContext = function () {
  return this.context[this.context.length - 1];
};
le.nextToken = function () {
  var e = this.curContext();
  if (
    ((!e || !e.preserveSpace) && this.skipSpace(),
    (this.start = this.pos),
    this.options.locations && (this.startLoc = this.curPosition()),
    this.pos >= this.input.length)
  )
    return this.finishToken(v.eof);
  if (e.override) return e.override(this);
  this.readToken(this.fullCharCodeAtPos());
};
le.readToken = function (e) {
  return vt(e, this.options.ecmaVersion >= 6) || e === 92
    ? this.readWord()
    : this.getTokenFromCode(e);
};
le.fullCharCodeAtPos = function () {
  var e = this.input.charCodeAt(this.pos);
  if (e <= 55295 || e >= 57344) return e;
  var i = this.input.charCodeAt(this.pos + 1);
  return (e << 10) + i - 56613888;
};
le.skipBlockComment = function () {
  var e = this.options.onComment && this.curPosition(),
    i = this.pos,
    r = this.input.indexOf("*/", (this.pos += 2));
  if (
    (r === -1 && this.raise(this.pos - 2, "Unterminated comment"),
    (this.pos = r + 2),
    this.options.locations)
  ) {
    $t.lastIndex = i;
    for (var n; (n = $t.exec(this.input)) && n.index < this.pos; )
      ++this.curLine, (this.lineStart = n.index + n[0].length);
  }
  this.options.onComment &&
    this.options.onComment(!0, this.input.slice(i + 2, r), i, this.pos, e, this.curPosition());
};
le.skipLineComment = function (e) {
  for (
    var i = this.pos,
      r = this.options.onComment && this.curPosition(),
      n = this.input.charCodeAt((this.pos += e));
    this.pos < this.input.length && !ni(n);
  )
    n = this.input.charCodeAt(++this.pos);
  this.options.onComment &&
    this.options.onComment(
      !1,
      this.input.slice(i + e, this.pos),
      i,
      this.pos,
      r,
      this.curPosition(),
    );
};
le.skipSpace = function () {
  e: for (; this.pos < this.input.length; ) {
    var e = this.input.charCodeAt(this.pos);
    switch (e) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
      case 10:
      case 8232:
      case 8233:
        ++this.pos, this.options.locations && (++this.curLine, (this.lineStart = this.pos));
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break e;
        }
        break;
      default:
        if ((e > 8 && e < 14) || (e >= 5760 && qs.test(String.fromCharCode(e)))) ++this.pos;
        else break e;
    }
  }
};
le.finishToken = function (e, i) {
  (this.end = this.pos), this.options.locations && (this.endLoc = this.curPosition());
  var r = this.type;
  (this.type = e), (this.value = i), this.updateContext(r);
};
le.readToken_dot = function () {
  var e = this.input.charCodeAt(this.pos + 1);
  if (e >= 48 && e <= 57) return this.readNumber(!0);
  var i = this.input.charCodeAt(this.pos + 2);
  return this.options.ecmaVersion >= 6 && e === 46 && i === 46
    ? ((this.pos += 3), this.finishToken(v.ellipsis))
    : (++this.pos, this.finishToken(v.dot));
};
le.readToken_slash = function () {
  var e = this.input.charCodeAt(this.pos + 1);
  return this.exprAllowed
    ? (++this.pos, this.readRegexp())
    : e === 61
      ? this.finishOp(v.assign, 2)
      : this.finishOp(v.slash, 1);
};
le.readToken_mult_modulo_exp = function (e) {
  var i = this.input.charCodeAt(this.pos + 1),
    r = 1,
    n = e === 42 ? v.star : v.modulo;
  return (
    this.options.ecmaVersion >= 7 &&
      e === 42 &&
      i === 42 &&
      (++r, (n = v.starstar), (i = this.input.charCodeAt(this.pos + 2))),
    i === 61 ? this.finishOp(v.assign, r + 1) : this.finishOp(n, r)
  );
};
le.readToken_pipe_amp = function (e) {
  var i = this.input.charCodeAt(this.pos + 1);
  if (i === e) {
    if (this.options.ecmaVersion >= 12) {
      var r = this.input.charCodeAt(this.pos + 2);
      if (r === 61) return this.finishOp(v.assign, 3);
    }
    return this.finishOp(e === 124 ? v.logicalOR : v.logicalAND, 2);
  }
  return i === 61
    ? this.finishOp(v.assign, 2)
    : this.finishOp(e === 124 ? v.bitwiseOR : v.bitwiseAND, 1);
};
le.readToken_caret = function () {
  var e = this.input.charCodeAt(this.pos + 1);
  return e === 61 ? this.finishOp(v.assign, 2) : this.finishOp(v.bitwiseXOR, 1);
};
le.readToken_plus_min = function (e) {
  var i = this.input.charCodeAt(this.pos + 1);
  return i === e
    ? i === 45 &&
      !this.inModule &&
      this.input.charCodeAt(this.pos + 2) === 62 &&
      (this.lastTokEnd === 0 || Je.test(this.input.slice(this.lastTokEnd, this.pos)))
      ? (this.skipLineComment(3), this.skipSpace(), this.nextToken())
      : this.finishOp(v.incDec, 2)
    : i === 61
      ? this.finishOp(v.assign, 2)
      : this.finishOp(v.plusMin, 1);
};
le.readToken_lt_gt = function (e) {
  var i = this.input.charCodeAt(this.pos + 1),
    r = 1;
  return i === e
    ? ((r = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2),
      this.input.charCodeAt(this.pos + r) === 61
        ? this.finishOp(v.assign, r + 1)
        : this.finishOp(v.bitShift, r))
    : i === 33 &&
        e === 60 &&
        !this.inModule &&
        this.input.charCodeAt(this.pos + 2) === 45 &&
        this.input.charCodeAt(this.pos + 3) === 45
      ? (this.skipLineComment(4), this.skipSpace(), this.nextToken())
      : (i === 61 && (r = 2), this.finishOp(v.relational, r));
};
le.readToken_eq_excl = function (e) {
  var i = this.input.charCodeAt(this.pos + 1);
  return i === 61
    ? this.finishOp(v.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2)
    : e === 61 && i === 62 && this.options.ecmaVersion >= 6
      ? ((this.pos += 2), this.finishToken(v.arrow))
      : this.finishOp(e === 61 ? v.eq : v.prefix, 1);
};
le.readToken_question = function () {
  var e = this.options.ecmaVersion;
  if (e >= 11) {
    var i = this.input.charCodeAt(this.pos + 1);
    if (i === 46) {
      var r = this.input.charCodeAt(this.pos + 2);
      if (r < 48 || r > 57) return this.finishOp(v.questionDot, 2);
    }
    if (i === 63) {
      if (e >= 12) {
        var n = this.input.charCodeAt(this.pos + 2);
        if (n === 61) return this.finishOp(v.assign, 3);
      }
      return this.finishOp(v.coalesce, 2);
    }
  }
  return this.finishOp(v.question, 1);
};
le.getTokenFromCode = function (e) {
  switch (e) {
    case 46:
      return this.readToken_dot();
    case 40:
      return ++this.pos, this.finishToken(v.parenL);
    case 41:
      return ++this.pos, this.finishToken(v.parenR);
    case 59:
      return ++this.pos, this.finishToken(v.semi);
    case 44:
      return ++this.pos, this.finishToken(v.comma);
    case 91:
      return ++this.pos, this.finishToken(v.bracketL);
    case 93:
      return ++this.pos, this.finishToken(v.bracketR);
    case 123:
      return ++this.pos, this.finishToken(v.braceL);
    case 125:
      return ++this.pos, this.finishToken(v.braceR);
    case 58:
      return ++this.pos, this.finishToken(v.colon);
    case 96:
      if (this.options.ecmaVersion < 6) break;
      return ++this.pos, this.finishToken(v.backQuote);
    case 48: {
      var i = this.input.charCodeAt(this.pos + 1);
      if (i === 120 || i === 88) return this.readRadixNumber(16);
      if (this.options.ecmaVersion >= 6) {
        if (i === 111 || i === 79) return this.readRadixNumber(8);
        if (i === 98 || i === 66) return this.readRadixNumber(2);
      }
    }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(!1);
    case 34:
    case 39:
      return this.readString(e);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(e);
    case 124:
    case 38:
      return this.readToken_pipe_amp(e);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(e);
    case 60:
    case 62:
      return this.readToken_lt_gt(e);
    case 61:
    case 33:
      return this.readToken_eq_excl(e);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(v.prefix, 1);
  }
  this.raise(this.pos, "Unexpected character '" + gr(e) + "'");
};
le.finishOp = function (e, i) {
  var r = this.input.slice(this.pos, this.pos + i);
  return (this.pos += i), this.finishToken(e, r);
};
le.readRegexp = function () {
  for (var e, i, r = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(r, "Unterminated regular expression");
    var n = this.input.charAt(this.pos);
    if ((Je.test(n) && this.raise(r, "Unterminated regular expression"), e)) e = !1;
    else {
      if (n === "[") i = !0;
      else if (n === "]" && i) i = !1;
      else if (n === "/" && !i) break;
      e = n === "\\";
    }
    ++this.pos;
  }
  var o = this.input.slice(r, this.pos);
  ++this.pos;
  var f = this.pos,
    d = this.readWord1();
  this.containsEsc && this.unexpected(f);
  var g = this.regexpState || (this.regexpState = new ft(this));
  g.reset(r, o, d), this.validateRegExpFlags(g), this.validateRegExpPattern(g);
  var x = null;
  try {
    x = new RegExp(o, d);
  } catch {}
  return this.finishToken(v.regexp, { pattern: o, flags: d, value: x });
};
le.readInt = function (e, i, r) {
  for (
    var n = this.options.ecmaVersion >= 12 && i === void 0,
      o = r && this.input.charCodeAt(this.pos) === 48,
      f = this.pos,
      d = 0,
      g = 0,
      x = 0,
      _ = i ?? 1 / 0;
    x < _;
    ++x, ++this.pos
  ) {
    var C = this.input.charCodeAt(this.pos),
      k = void 0;
    if (n && C === 95) {
      o &&
        this.raiseRecoverable(
          this.pos,
          "Numeric separator is not allowed in legacy octal numeric literals",
        ),
        g === 95 &&
          this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"),
        x === 0 &&
          this.raiseRecoverable(
            this.pos,
            "Numeric separator is not allowed at the first of digits",
          ),
        (g = C);
      continue;
    }
    if (
      (C >= 97
        ? (k = C - 97 + 10)
        : C >= 65
          ? (k = C - 65 + 10)
          : C >= 48 && C <= 57
            ? (k = C - 48)
            : (k = 1 / 0),
      k >= e)
    )
      break;
    (g = C), (d = d * e + k);
  }
  return (
    n &&
      g === 95 &&
      this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"),
    this.pos === f || (i != null && this.pos - f !== i) ? null : d
  );
};
function ao(e, i) {
  return i ? parseInt(e, 8) : parseFloat(e.replace(/_/g, ""));
}
function pn(e) {
  return typeof BigInt != "function" ? null : BigInt(e.replace(/_/g, ""));
}
le.readRadixNumber = function (e) {
  var i = this.pos;
  this.pos += 2;
  var r = this.readInt(e);
  return (
    r == null && this.raise(this.start + 2, "Expected number in radix " + e),
    this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110
      ? ((r = pn(this.input.slice(i, this.pos))), ++this.pos)
      : vt(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"),
    this.finishToken(v.num, r)
  );
};
le.readNumber = function (e) {
  var i = this.pos;
  !e && this.readInt(10, void 0, !0) === null && this.raise(i, "Invalid number");
  var r = this.pos - i >= 2 && this.input.charCodeAt(i) === 48;
  r && this.strict && this.raise(i, "Invalid number");
  var n = this.input.charCodeAt(this.pos);
  if (!r && !e && this.options.ecmaVersion >= 11 && n === 110) {
    var o = pn(this.input.slice(i, this.pos));
    return (
      ++this.pos,
      vt(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"),
      this.finishToken(v.num, o)
    );
  }
  r && /[89]/.test(this.input.slice(i, this.pos)) && (r = !1),
    n === 46 && !r && (++this.pos, this.readInt(10), (n = this.input.charCodeAt(this.pos))),
    (n === 69 || n === 101) &&
      !r &&
      ((n = this.input.charCodeAt(++this.pos)),
      (n === 43 || n === 45) && ++this.pos,
      this.readInt(10) === null && this.raise(i, "Invalid number")),
    vt(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
  var f = ao(this.input.slice(i, this.pos), r);
  return this.finishToken(v.num, f);
};
le.readCodePoint = function () {
  var e = this.input.charCodeAt(this.pos),
    i;
  if (e === 123) {
    this.options.ecmaVersion < 6 && this.unexpected();
    var r = ++this.pos;
    (i = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos)),
      ++this.pos,
      i > 1114111 && this.invalidStringToken(r, "Code point out of bounds");
  } else i = this.readHexChar(4);
  return i;
};
function gr(e) {
  return e <= 65535
    ? String.fromCharCode(e)
    : ((e -= 65536), String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
}
le.readString = function (e) {
  for (var i = "", r = ++this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
    var n = this.input.charCodeAt(this.pos);
    if (n === e) break;
    n === 92
      ? ((i += this.input.slice(r, this.pos)), (i += this.readEscapedChar(!1)), (r = this.pos))
      : (ni(n, this.options.ecmaVersion >= 10) &&
          this.raise(this.start, "Unterminated string constant"),
        ++this.pos);
  }
  return (i += this.input.slice(r, this.pos++)), this.finishToken(v.string, i);
};
var dn = {};
le.tryReadTemplateToken = function () {
  this.inTemplateElement = !0;
  try {
    this.readTmplToken();
  } catch (e) {
    if (e === dn) this.readInvalidTemplateToken();
    else throw e;
  }
  this.inTemplateElement = !1;
};
le.invalidStringToken = function (e, i) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw dn;
  this.raise(e, i);
};
le.readTmplToken = function () {
  for (var e = "", i = this.pos; ; ) {
    this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
    var r = this.input.charCodeAt(this.pos);
    if (r === 96 || (r === 36 && this.input.charCodeAt(this.pos + 1) === 123))
      return this.pos === this.start &&
        (this.type === v.template || this.type === v.invalidTemplate)
        ? r === 36
          ? ((this.pos += 2), this.finishToken(v.dollarBraceL))
          : (++this.pos, this.finishToken(v.backQuote))
        : ((e += this.input.slice(i, this.pos)), this.finishToken(v.template, e));
    if (r === 92)
      (e += this.input.slice(i, this.pos)), (e += this.readEscapedChar(!0)), (i = this.pos);
    else if (ni(r)) {
      switch (((e += this.input.slice(i, this.pos)), ++this.pos, r)) {
        case 13:
          this.input.charCodeAt(this.pos) === 10 && ++this.pos;
        case 10:
          e += `
`;
          break;
        default:
          e += String.fromCharCode(r);
          break;
      }
      this.options.locations && (++this.curLine, (this.lineStart = this.pos)), (i = this.pos);
    } else ++this.pos;
  }
};
le.readInvalidTemplateToken = function () {
  for (; this.pos < this.input.length; this.pos++)
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") break;
      case "`":
        return this.finishToken(v.invalidTemplate, this.input.slice(this.start, this.pos));
    }
  this.raise(this.start, "Unterminated template");
};
le.readEscapedChar = function (e) {
  var i = this.input.charCodeAt(++this.pos);
  switch ((++this.pos, i)) {
    case 110:
      return `
`;
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return gr(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
    case 10:
      return this.options.locations && ((this.lineStart = this.pos), ++this.curLine), "";
    case 56:
    case 57:
      if (e) {
        var r = this.pos - 1;
        return this.invalidStringToken(r, "Invalid escape sequence in template string"), null;
      }
    default:
      if (i >= 48 && i <= 55) {
        var n = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0],
          o = parseInt(n, 8);
        return (
          o > 255 && ((n = n.slice(0, -1)), (o = parseInt(n, 8))),
          (this.pos += n.length - 1),
          (i = this.input.charCodeAt(this.pos)),
          (n !== "0" || i === 56 || i === 57) &&
            (this.strict || e) &&
            this.invalidStringToken(
              this.pos - 1 - n.length,
              e ? "Octal literal in template string" : "Octal literal in strict mode",
            ),
          String.fromCharCode(o)
        );
      }
      return ni(i) ? "" : String.fromCharCode(i);
  }
};
le.readHexChar = function (e) {
  var i = this.pos,
    r = this.readInt(16, e);
  return r === null && this.invalidStringToken(i, "Bad character escape sequence"), r;
};
le.readWord1 = function () {
  this.containsEsc = !1;
  for (
    var e = "", i = !0, r = this.pos, n = this.options.ecmaVersion >= 6;
    this.pos < this.input.length;
  ) {
    var o = this.fullCharCodeAtPos();
    if (Ft(o, n)) this.pos += o <= 65535 ? 1 : 2;
    else if (o === 92) {
      (this.containsEsc = !0), (e += this.input.slice(r, this.pos));
      var f = this.pos;
      this.input.charCodeAt(++this.pos) !== 117 &&
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"),
        ++this.pos;
      var d = this.readCodePoint();
      (i ? vt : Ft)(d, n) || this.invalidStringToken(f, "Invalid Unicode escape"),
        (e += gr(d)),
        (r = this.pos);
    } else break;
    i = !1;
  }
  return e + this.input.slice(r, this.pos);
};
le.readWord = function () {
  var e = this.readWord1(),
    i = v.name;
  return this.keywords.test(e) && (i = ur[e]), this.finishToken(i, e);
};
var oo = "7.4.1";
Te.acorn = {
  Parser: Te,
  version: oo,
  defaultOptions: $i,
  Position: ei,
  SourceLocation: _i,
  getLineInfo: Gs,
  Node: pr,
  TokenType: de,
  tokTypes: v,
  keywordTypes: ur,
  TokContext: Ye,
  tokContexts: Ae,
  isIdentifierChar: Ft,
  isIdentifierStart: vt,
  Token: mr,
  isNewLine: ni,
  lineBreak: Je,
  lineBreakG: $t,
  nonASCIIwhitespace: qs,
};
var Hi = { exports: {} },
  Qi,
  cs;
function uo() {
  return (
    cs ||
      ((cs = 1),
      (Qi = {
        quot: '"',
        amp: "&",
        apos: "'",
        lt: "<",
        gt: ">",
        nbsp: " ",
        iexcl: "¡",
        cent: "¢",
        pound: "£",
        curren: "¤",
        yen: "¥",
        brvbar: "¦",
        sect: "§",
        uml: "¨",
        copy: "©",
        ordf: "ª",
        laquo: "«",
        not: "¬",
        shy: "­",
        reg: "®",
        macr: "¯",
        deg: "°",
        plusmn: "±",
        sup2: "²",
        sup3: "³",
        acute: "´",
        micro: "µ",
        para: "¶",
        middot: "·",
        cedil: "¸",
        sup1: "¹",
        ordm: "º",
        raquo: "»",
        frac14: "¼",
        frac12: "½",
        frac34: "¾",
        iquest: "¿",
        Agrave: "À",
        Aacute: "Á",
        Acirc: "Â",
        Atilde: "Ã",
        Auml: "Ä",
        Aring: "Å",
        AElig: "Æ",
        Ccedil: "Ç",
        Egrave: "È",
        Eacute: "É",
        Ecirc: "Ê",
        Euml: "Ë",
        Igrave: "Ì",
        Iacute: "Í",
        Icirc: "Î",
        Iuml: "Ï",
        ETH: "Ð",
        Ntilde: "Ñ",
        Ograve: "Ò",
        Oacute: "Ó",
        Ocirc: "Ô",
        Otilde: "Õ",
        Ouml: "Ö",
        times: "×",
        Oslash: "Ø",
        Ugrave: "Ù",
        Uacute: "Ú",
        Ucirc: "Û",
        Uuml: "Ü",
        Yacute: "Ý",
        THORN: "Þ",
        szlig: "ß",
        agrave: "à",
        aacute: "á",
        acirc: "â",
        atilde: "ã",
        auml: "ä",
        aring: "å",
        aelig: "æ",
        ccedil: "ç",
        egrave: "è",
        eacute: "é",
        ecirc: "ê",
        euml: "ë",
        igrave: "ì",
        iacute: "í",
        icirc: "î",
        iuml: "ï",
        eth: "ð",
        ntilde: "ñ",
        ograve: "ò",
        oacute: "ó",
        ocirc: "ô",
        otilde: "õ",
        ouml: "ö",
        divide: "÷",
        oslash: "ø",
        ugrave: "ù",
        uacute: "ú",
        ucirc: "û",
        uuml: "ü",
        yacute: "ý",
        thorn: "þ",
        yuml: "ÿ",
        OElig: "Œ",
        oelig: "œ",
        Scaron: "Š",
        scaron: "š",
        Yuml: "Ÿ",
        fnof: "ƒ",
        circ: "ˆ",
        tilde: "˜",
        Alpha: "Α",
        Beta: "Β",
        Gamma: "Γ",
        Delta: "Δ",
        Epsilon: "Ε",
        Zeta: "Ζ",
        Eta: "Η",
        Theta: "Θ",
        Iota: "Ι",
        Kappa: "Κ",
        Lambda: "Λ",
        Mu: "Μ",
        Nu: "Ν",
        Xi: "Ξ",
        Omicron: "Ο",
        Pi: "Π",
        Rho: "Ρ",
        Sigma: "Σ",
        Tau: "Τ",
        Upsilon: "Υ",
        Phi: "Φ",
        Chi: "Χ",
        Psi: "Ψ",
        Omega: "Ω",
        alpha: "α",
        beta: "β",
        gamma: "γ",
        delta: "δ",
        epsilon: "ε",
        zeta: "ζ",
        eta: "η",
        theta: "θ",
        iota: "ι",
        kappa: "κ",
        lambda: "λ",
        mu: "μ",
        nu: "ν",
        xi: "ξ",
        omicron: "ο",
        pi: "π",
        rho: "ρ",
        sigmaf: "ς",
        sigma: "σ",
        tau: "τ",
        upsilon: "υ",
        phi: "φ",
        chi: "χ",
        psi: "ψ",
        omega: "ω",
        thetasym: "ϑ",
        upsih: "ϒ",
        piv: "ϖ",
        ensp: " ",
        emsp: " ",
        thinsp: " ",
        zwnj: "‌",
        zwj: "‍",
        lrm: "‎",
        rlm: "‏",
        ndash: "–",
        mdash: "—",
        lsquo: "‘",
        rsquo: "’",
        sbquo: "‚",
        ldquo: "“",
        rdquo: "”",
        bdquo: "„",
        dagger: "†",
        Dagger: "‡",
        bull: "•",
        hellip: "…",
        permil: "‰",
        prime: "′",
        Prime: "″",
        lsaquo: "‹",
        rsaquo: "›",
        oline: "‾",
        frasl: "⁄",
        euro: "€",
        image: "ℑ",
        weierp: "℘",
        real: "ℜ",
        trade: "™",
        alefsym: "ℵ",
        larr: "←",
        uarr: "↑",
        rarr: "→",
        darr: "↓",
        harr: "↔",
        crarr: "↵",
        lArr: "⇐",
        uArr: "⇑",
        rArr: "⇒",
        dArr: "⇓",
        hArr: "⇔",
        forall: "∀",
        part: "∂",
        exist: "∃",
        empty: "∅",
        nabla: "∇",
        isin: "∈",
        notin: "∉",
        ni: "∋",
        prod: "∏",
        sum: "∑",
        minus: "−",
        lowast: "∗",
        radic: "√",
        prop: "∝",
        infin: "∞",
        ang: "∠",
        and: "∧",
        or: "∨",
        cap: "∩",
        cup: "∪",
        int: "∫",
        there4: "∴",
        sim: "∼",
        cong: "≅",
        asymp: "≈",
        ne: "≠",
        equiv: "≡",
        le: "≤",
        ge: "≥",
        sub: "⊂",
        sup: "⊃",
        nsub: "⊄",
        sube: "⊆",
        supe: "⊇",
        oplus: "⊕",
        otimes: "⊗",
        perp: "⊥",
        sdot: "⋅",
        lceil: "⌈",
        rceil: "⌉",
        lfloor: "⌊",
        rfloor: "⌋",
        lang: "〈",
        rang: "〉",
        loz: "◊",
        spades: "♠",
        clubs: "♣",
        hearts: "♥",
        diams: "♦",
      })),
    Qi
  );
}
var Xt = { exports: {} },
  ho = Xt.exports,
  fs;
function ps() {
  return (
    fs ||
      ((fs = 1),
      ((e, i) => {
        ((r, n) => {
          n(i);
        })(ho, (r) => {
          var n = [
              509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9,
              9, 7, 9, 32, 4, 318, 1, 78, 5, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46,
              10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11,
              7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4,
              68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214,
              6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71,
              5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10,
              10, 47, 15, 199, 7, 137, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2,
              6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 55, 9, 266, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14,
              10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2,
              54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6,
              31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3,
              6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 233, 0,
              3, 0, 8, 1, 6, 0, 475, 6, 110, 6, 6, 9, 4759, 9, 787719, 239,
            ],
            o = [
              0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14,
              29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2,
              14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41,
              2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11,
              25, 7, 25, 39, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28,
              53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41,
              7, 1, 17, 5, 57, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14,
              44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2,
              24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2,
              4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21,
              2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6,
              186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2,
              0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0,
              50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 24, 43, 261, 18, 16, 0,
              2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994,
              6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433,
              44, 212, 63, 33, 24, 3, 24, 45, 74, 6, 0, 67, 12, 65, 1, 2, 0, 15, 4, 10, 7381, 42,
              31, 98, 114, 8702, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309,
              106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2,
              64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2,
              24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44,
              11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 208, 30, 2, 2, 2, 1, 2, 6, 3,
              4, 10, 1, 225, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0,
              3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2,
              0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2,
              16, 4421, 42719, 33, 4381, 3, 5773, 3, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 8489,
            ],
            f =
              "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･",
            d =
              "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",
            g = {
              3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
              5: "class enum extends super const export import",
              6: "enum",
              strict: "implements interface let package private protected public static yield",
              strictBind: "eval arguments",
            },
            x =
              "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this",
            _ = {
              5: x,
              "5module": x + " export import",
              6: x + " const class extends export import super",
            },
            C = /^in(stanceof)?$/,
            k = new RegExp("[" + d + "]"),
            A = new RegExp("[" + d + f + "]");
          function P(t, s) {
            for (var u = 65536, l = 0; l < s.length; l += 2) {
              if (((u += s[l]), u > t)) return !1;
              if (((u += s[l + 1]), u >= t)) return !0;
            }
            return !1;
          }
          function N(t, s) {
            return t < 65
              ? t === 36
              : t < 91
                ? !0
                : t < 97
                  ? t === 95
                  : t < 123
                    ? !0
                    : t <= 65535
                      ? t >= 170 && k.test(String.fromCharCode(t))
                      : s === !1
                        ? !1
                        : P(t, o);
          }
          function E(t, s) {
            return t < 48
              ? t === 36
              : t < 58
                ? !0
                : t < 65
                  ? !1
                  : t < 91
                    ? !0
                    : t < 97
                      ? t === 95
                      : t < 123
                        ? !0
                        : t <= 65535
                          ? t >= 170 && A.test(String.fromCharCode(t))
                          : s === !1
                            ? !1
                            : P(t, o) || P(t, n);
          }
          var w = function (s, u) {
            u === void 0 && (u = {}),
              (this.label = s),
              (this.keyword = u.keyword),
              (this.beforeExpr = !!u.beforeExpr),
              (this.startsExpr = !!u.startsExpr),
              (this.isLoop = !!u.isLoop),
              (this.isAssign = !!u.isAssign),
              (this.prefix = !!u.prefix),
              (this.postfix = !!u.postfix),
              (this.binop = u.binop || null),
              (this.updateContext = null);
          };
          function B(t, s) {
            return new w(t, { beforeExpr: !0, binop: s });
          }
          var M = { beforeExpr: !0 },
            G = { startsExpr: !0 },
            L = {};
          function y(t, s) {
            return s === void 0 && (s = {}), (s.keyword = t), (L[t] = new w(t, s));
          }
          var h = {
              num: new w("num", G),
              regexp: new w("regexp", G),
              string: new w("string", G),
              name: new w("name", G),
              privateId: new w("privateId", G),
              eof: new w("eof"),
              bracketL: new w("[", { beforeExpr: !0, startsExpr: !0 }),
              bracketR: new w("]"),
              braceL: new w("{", { beforeExpr: !0, startsExpr: !0 }),
              braceR: new w("}"),
              parenL: new w("(", { beforeExpr: !0, startsExpr: !0 }),
              parenR: new w(")"),
              comma: new w(",", M),
              semi: new w(";", M),
              colon: new w(":", M),
              dot: new w("."),
              question: new w("?", M),
              questionDot: new w("?."),
              arrow: new w("=>", M),
              template: new w("template"),
              invalidTemplate: new w("invalidTemplate"),
              ellipsis: new w("...", M),
              backQuote: new w("`", G),
              dollarBraceL: new w("${", { beforeExpr: !0, startsExpr: !0 }),
              eq: new w("=", { beforeExpr: !0, isAssign: !0 }),
              assign: new w("_=", { beforeExpr: !0, isAssign: !0 }),
              incDec: new w("++/--", { prefix: !0, postfix: !0, startsExpr: !0 }),
              prefix: new w("!/~", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
              logicalOR: B("||", 1),
              logicalAND: B("&&", 2),
              bitwiseOR: B("|", 3),
              bitwiseXOR: B("^", 4),
              bitwiseAND: B("&", 5),
              equality: B("==/!=/===/!==", 6),
              relational: B("</>/<=/>=", 7),
              bitShift: B("<</>>/>>>", 8),
              plusMin: new w("+/-", { beforeExpr: !0, binop: 9, prefix: !0, startsExpr: !0 }),
              modulo: B("%", 10),
              star: B("*", 10),
              slash: B("/", 10),
              starstar: new w("**", { beforeExpr: !0 }),
              coalesce: B("??", 1),
              _break: y("break"),
              _case: y("case", M),
              _catch: y("catch"),
              _continue: y("continue"),
              _debugger: y("debugger"),
              _default: y("default", M),
              _do: y("do", { isLoop: !0, beforeExpr: !0 }),
              _else: y("else", M),
              _finally: y("finally"),
              _for: y("for", { isLoop: !0 }),
              _function: y("function", G),
              _if: y("if"),
              _return: y("return", M),
              _switch: y("switch"),
              _throw: y("throw", M),
              _try: y("try"),
              _var: y("var"),
              _const: y("const"),
              _while: y("while", { isLoop: !0 }),
              _with: y("with"),
              _new: y("new", { beforeExpr: !0, startsExpr: !0 }),
              _this: y("this", G),
              _super: y("super", G),
              _class: y("class", G),
              _extends: y("extends", M),
              _export: y("export"),
              _import: y("import", G),
              _null: y("null", G),
              _true: y("true", G),
              _false: y("false", G),
              _in: y("in", { beforeExpr: !0, binop: 7 }),
              _instanceof: y("instanceof", { beforeExpr: !0, binop: 7 }),
              _typeof: y("typeof", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
              _void: y("void", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
              _delete: y("delete", { beforeExpr: !0, prefix: !0, startsExpr: !0 }),
            },
            I = /\r\n?|\n|\u2028|\u2029/,
            V = new RegExp(I.source, "g");
          function Q(t) {
            return t === 10 || t === 13 || t === 8232 || t === 8233;
          }
          function H(t, s, u) {
            u === void 0 && (u = t.length);
            for (var l = s; l < u; l++) {
              var b = t.charCodeAt(l);
              if (Q(b)) return l < u - 1 && b === 13 && t.charCodeAt(l + 1) === 10 ? l + 2 : l + 1;
            }
            return -1;
          }
          var ee = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
            K = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
            J = Object.prototype,
            he = J.hasOwnProperty,
            _e = J.toString,
            ve = Object.hasOwn || ((t, s) => he.call(t, s)),
            ye = Array.isArray || ((t) => _e.call(t) === "[object Array]"),
            oe = Object.create(null);
          function we(t) {
            return oe[t] || (oe[t] = new RegExp("^(?:" + t.replace(/ /g, "|") + ")$"));
          }
          function Ne(t) {
            return t <= 65535
              ? String.fromCharCode(t)
              : ((t -= 65536), String.fromCharCode((t >> 10) + 55296, (t & 1023) + 56320));
          }
          var pt = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,
            W = function (s, u) {
              (this.line = s), (this.column = u);
            };
          W.prototype.offset = function (s) {
            return new W(this.line, this.column + s);
          };
          var je = function (s, u, l) {
            (this.start = u), (this.end = l), s.sourceFile !== null && (this.source = s.sourceFile);
          };
          function dt(t, s) {
            for (var u = 1, l = 0; ; ) {
              var b = H(t, l, s);
              if (b < 0) return new W(u, s - l);
              ++u, (l = b);
            }
          }
          var qe = {
              ecmaVersion: null,
              sourceType: "script",
              onInsertedSemicolon: null,
              onTrailingComma: null,
              allowReserved: null,
              allowReturnOutsideFunction: !1,
              allowImportExportEverywhere: !1,
              allowAwaitOutsideFunction: null,
              allowSuperOutsideMethod: null,
              allowHashBang: !1,
              checkPrivateFields: !0,
              locations: !1,
              onToken: null,
              onComment: null,
              ranges: !1,
              program: null,
              sourceFile: null,
              directSourceFile: null,
              preserveParens: !1,
            },
            me = !1;
          function We(t) {
            var s = {};
            for (var u in qe) s[u] = t && ve(t, u) ? t[u] : qe[u];
            if (
              (s.ecmaVersion === "latest"
                ? (s.ecmaVersion = 1e8)
                : s.ecmaVersion == null
                  ? (!me &&
                      typeof console == "object" &&
                      console.warn &&
                      ((me = !0),
                      console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)),
                    (s.ecmaVersion = 11))
                  : s.ecmaVersion >= 2015 && (s.ecmaVersion -= 2009),
              s.allowReserved == null && (s.allowReserved = s.ecmaVersion < 5),
              (!t || t.allowHashBang == null) && (s.allowHashBang = s.ecmaVersion >= 14),
              ye(s.onToken))
            ) {
              var l = s.onToken;
              s.onToken = (b) => l.push(b);
            }
            if (
              (ye(s.onComment) && (s.onComment = Pt(s, s.onComment)),
              s.sourceType === "commonjs" && s.allowAwaitOutsideFunction)
            )
              throw new Error("Cannot use allowAwaitOutsideFunction with sourceType: commonjs");
            return s;
          }
          function Pt(t, s) {
            return function (u, l, b, T, R, j) {
              var q = { type: u ? "Block" : "Line", value: l, start: b, end: T };
              t.locations && (q.loc = new je(this, R, j)),
                t.ranges && (q.range = [b, T]),
                s.push(q);
            };
          }
          var it = 1,
            rt = 2,
            Tt = 4,
            Ze = 8,
            qt = 16,
            Ie = 32,
            St = 64,
            _t = 128,
            st = 256,
            mt = 512,
            hi = 1024,
            Nt = it | rt | st;
          function Ut(t, s) {
            return rt | (t ? Tt : 0) | (s ? Ze : 0);
          }
          var Lt = 0,
            Gt = 1,
            ze = 2,
            fe = 3,
            Pe = 4,
            $ = 5,
            ne = function (s, u, l) {
              (this.options = s = We(s)),
                (this.sourceFile = s.sourceFile),
                (this.keywords = we(
                  _[s.ecmaVersion >= 6 ? 6 : s.sourceType === "module" ? "5module" : 5],
                ));
              var b = "";
              s.allowReserved !== !0 &&
                ((b = g[s.ecmaVersion >= 6 ? 6 : s.ecmaVersion === 5 ? 5 : 3]),
                s.sourceType === "module" && (b += " await")),
                (this.reservedWords = we(b));
              var T = (b ? b + " " : "") + g.strict;
              (this.reservedWordsStrict = we(T)),
                (this.reservedWordsStrictBind = we(T + " " + g.strictBind)),
                (this.input = String(u)),
                (this.containsEsc = !1),
                l
                  ? ((this.pos = l),
                    (this.lineStart =
                      this.input.lastIndexOf(
                        `
`,
                        l - 1,
                      ) + 1),
                    (this.curLine = this.input.slice(0, this.lineStart).split(I).length))
                  : ((this.pos = this.lineStart = 0), (this.curLine = 1)),
                (this.type = h.eof),
                (this.value = null),
                (this.start = this.end = this.pos),
                (this.startLoc = this.endLoc = this.curPosition()),
                (this.lastTokEndLoc = this.lastTokStartLoc = null),
                (this.lastTokStart = this.lastTokEnd = this.pos),
                (this.context = this.initialContext()),
                (this.exprAllowed = !0),
                (this.inModule = s.sourceType === "module"),
                (this.strict = this.inModule || this.strictDirective(this.pos)),
                (this.potentialArrowAt = -1),
                (this.potentialArrowInForAwait = !1),
                (this.yieldPos = this.awaitPos = this.awaitIdentPos = 0),
                (this.labels = []),
                (this.undefinedExports = Object.create(null)),
                this.pos === 0 &&
                  s.allowHashBang &&
                  this.input.slice(0, 2) === "#!" &&
                  this.skipLineComment(2),
                (this.scopeStack = []),
                this.enterScope(this.options.sourceType === "commonjs" ? rt : it),
                (this.regexpState = null),
                (this.privateNameStack = []);
            },
            pe = {
              inFunction: { configurable: !0 },
              inGenerator: { configurable: !0 },
              inAsync: { configurable: !0 },
              canAwait: { configurable: !0 },
              allowReturn: { configurable: !0 },
              allowSuper: { configurable: !0 },
              allowDirectSuper: { configurable: !0 },
              treatFunctionsAsVar: { configurable: !0 },
              allowNewDotTarget: { configurable: !0 },
              allowUsing: { configurable: !0 },
              inClassStaticBlock: { configurable: !0 },
            };
          (ne.prototype.parse = function () {
            var s = this.options.program || this.startNode();
            return this.nextToken(), this.parseTopLevel(s);
          }),
            (pe.inFunction.get = function () {
              return (this.currentVarScope().flags & rt) > 0;
            }),
            (pe.inGenerator.get = function () {
              return (this.currentVarScope().flags & Ze) > 0;
            }),
            (pe.inAsync.get = function () {
              return (this.currentVarScope().flags & Tt) > 0;
            }),
            (pe.canAwait.get = function () {
              for (var t = this.scopeStack.length - 1; t >= 0; t--) {
                var s = this.scopeStack[t],
                  u = s.flags;
                if (u & (st | mt)) return !1;
                if (u & rt) return (u & Tt) > 0;
              }
              return (
                (this.inModule && this.options.ecmaVersion >= 13) ||
                this.options.allowAwaitOutsideFunction
              );
            }),
            (pe.allowReturn.get = function () {
              return !!(
                this.inFunction ||
                (this.options.allowReturnOutsideFunction && this.currentVarScope().flags & it)
              );
            }),
            (pe.allowSuper.get = function () {
              var t = this.currentThisScope(),
                s = t.flags;
              return (s & St) > 0 || this.options.allowSuperOutsideMethod;
            }),
            (pe.allowDirectSuper.get = function () {
              return (this.currentThisScope().flags & _t) > 0;
            }),
            (pe.treatFunctionsAsVar.get = function () {
              return this.treatFunctionsAsVarInScope(this.currentScope());
            }),
            (pe.allowNewDotTarget.get = function () {
              for (var t = this.scopeStack.length - 1; t >= 0; t--) {
                var s = this.scopeStack[t],
                  u = s.flags;
                if (u & (st | mt) || (u & rt && !(u & qt))) return !0;
              }
              return !1;
            }),
            (pe.allowUsing.get = function () {
              var t = this.currentScope(),
                s = t.flags;
              return !(s & hi || (!this.inModule && s & it));
            }),
            (pe.inClassStaticBlock.get = function () {
              return (this.currentVarScope().flags & st) > 0;
            }),
            (ne.extend = function () {
              for (var s = [], u = arguments.length; u--; ) s[u] = arguments[u];
              for (var l = this, b = 0; b < s.length; b++) l = s[b](l);
              return l;
            }),
            (ne.parse = function (s, u) {
              return new this(u, s).parse();
            }),
            (ne.parseExpressionAt = function (s, u, l) {
              var b = new this(l, s, u);
              return b.nextToken(), b.parseExpression();
            }),
            (ne.tokenizer = function (s, u) {
              return new this(u, s);
            }),
            Object.defineProperties(ne.prototype, pe);
          var Le = ne.prototype,
            Pi = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
          (Le.strictDirective = function (t) {
            if (this.options.ecmaVersion < 5) return !1;
            for (;;) {
              (K.lastIndex = t), (t += K.exec(this.input)[0].length);
              var s = Pi.exec(this.input.slice(t));
              if (!s) return !1;
              if ((s[1] || s[2]) === "use strict") {
                K.lastIndex = t + s[0].length;
                var u = K.exec(this.input),
                  l = u.index + u[0].length,
                  b = this.input.charAt(l);
                return (
                  b === ";" ||
                  b === "}" ||
                  (I.test(u[0]) &&
                    !(
                      /[(`.[+\-/*%<>=,?^&]/.test(b) ||
                      (b === "!" && this.input.charAt(l + 1) === "=")
                    ))
                );
              }
              (t += s[0].length),
                (K.lastIndex = t),
                (t += K.exec(this.input)[0].length),
                this.input[t] === ";" && t++;
            }
          }),
            (Le.eat = function (t) {
              return this.type === t ? (this.next(), !0) : !1;
            }),
            (Le.isContextual = function (t) {
              return this.type === h.name && this.value === t && !this.containsEsc;
            }),
            (Le.eatContextual = function (t) {
              return this.isContextual(t) ? (this.next(), !0) : !1;
            }),
            (Le.expectContextual = function (t) {
              this.eatContextual(t) || this.unexpected();
            }),
            (Le.canInsertSemicolon = function () {
              return (
                this.type === h.eof ||
                this.type === h.braceR ||
                I.test(this.input.slice(this.lastTokEnd, this.start))
              );
            }),
            (Le.insertSemicolon = function () {
              if (this.canInsertSemicolon())
                return (
                  this.options.onInsertedSemicolon &&
                    this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc),
                  !0
                );
            }),
            (Le.semicolon = function () {
              !this.eat(h.semi) && !this.insertSemicolon() && this.unexpected();
            }),
            (Le.afterTrailingComma = function (t, s) {
              if (this.type === t)
                return (
                  this.options.onTrailingComma &&
                    this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc),
                  s || this.next(),
                  !0
                );
            }),
            (Le.expect = function (t) {
              this.eat(t) || this.unexpected();
            }),
            (Le.unexpected = function (t) {
              this.raise(t ?? this.start, "Unexpected token");
            });
          var Me = function () {
            this.shorthandAssign =
              this.trailingComma =
              this.parenthesizedAssign =
              this.parenthesizedBind =
              this.doubleProto =
                -1;
          };
          (Le.checkPatternErrors = function (t, s) {
            if (t) {
              t.trailingComma > -1 &&
                this.raiseRecoverable(
                  t.trailingComma,
                  "Comma is not permitted after the rest element",
                );
              var u = s ? t.parenthesizedAssign : t.parenthesizedBind;
              u > -1 &&
                this.raiseRecoverable(u, s ? "Assigning to rvalue" : "Parenthesized pattern");
            }
          }),
            (Le.checkExpressionErrors = function (t, s) {
              if (!t) return !1;
              var u = t.shorthandAssign,
                l = t.doubleProto;
              if (!s) return u >= 0 || l >= 0;
              u >= 0 &&
                this.raise(
                  u,
                  "Shorthand property assignments are valid only in destructuring patterns",
                ),
                l >= 0 && this.raiseRecoverable(l, "Redefinition of __proto__ property");
            }),
            (Le.checkYieldAwaitInDefaultParams = function () {
              this.yieldPos &&
                (!this.awaitPos || this.yieldPos < this.awaitPos) &&
                this.raise(this.yieldPos, "Yield expression cannot be a default value"),
                this.awaitPos &&
                  this.raise(this.awaitPos, "Await expression cannot be a default value");
            }),
            (Le.isSimpleAssignTarget = function (t) {
              return t.type === "ParenthesizedExpression"
                ? this.isSimpleAssignTarget(t.expression)
                : t.type === "Identifier" || t.type === "MemberExpression";
            });
          var X = ne.prototype;
          X.parseTopLevel = function (t) {
            var s = Object.create(null);
            for (t.body || (t.body = []); this.type !== h.eof; ) {
              var u = this.parseStatement(null, !0, s);
              t.body.push(u);
            }
            if (this.inModule)
              for (var l = 0, b = Object.keys(this.undefinedExports); l < b.length; l += 1) {
                var T = b[l];
                this.raiseRecoverable(
                  this.undefinedExports[T].start,
                  "Export '" + T + "' is not defined",
                );
              }
            return (
              this.adaptDirectivePrologue(t.body),
              this.next(),
              (t.sourceType =
                this.options.sourceType === "commonjs" ? "script" : this.options.sourceType),
              this.finishNode(t, "Program")
            );
          };
          var $e = { kind: "loop" },
            ke = { kind: "switch" };
          (X.isLet = function (t) {
            if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return !1;
            K.lastIndex = this.pos;
            var s = K.exec(this.input),
              u = this.pos + s[0].length,
              l = this.fullCharCodeAt(u);
            if (l === 91 || l === 92) return !0;
            if (t) return !1;
            if (l === 123) return !0;
            if (N(l)) {
              var b = u;
              do u += l <= 65535 ? 1 : 2;
              while (E((l = this.fullCharCodeAt(u))));
              if (l === 92) return !0;
              var T = this.input.slice(b, u);
              if (!C.test(T)) return !0;
            }
            return !1;
          }),
            (X.isAsyncFunction = function () {
              if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return !1;
              K.lastIndex = this.pos;
              var t = K.exec(this.input),
                s = this.pos + t[0].length,
                u;
              return (
                !I.test(this.input.slice(this.pos, s)) &&
                this.input.slice(s, s + 8) === "function" &&
                (s + 8 === this.input.length || !(E((u = this.fullCharCodeAt(s + 8))) || u === 92))
              );
            }),
            (X.isUsingKeyword = function (t, s) {
              if (this.options.ecmaVersion < 17 || !this.isContextual(t ? "await" : "using"))
                return !1;
              K.lastIndex = this.pos;
              var u = K.exec(this.input),
                l = this.pos + u[0].length;
              if (I.test(this.input.slice(this.pos, l))) return !1;
              if (t) {
                var b = l + 5,
                  T;
                if (
                  this.input.slice(l, b) !== "using" ||
                  b === this.input.length ||
                  E((T = this.fullCharCodeAt(b))) ||
                  T === 92
                )
                  return !1;
                K.lastIndex = b;
                var R = K.exec(this.input);
                if (((l = b + R[0].length), R && I.test(this.input.slice(b, l)))) return !1;
              }
              var j = this.fullCharCodeAt(l);
              if (!N(j) && j !== 92) return !1;
              var q = l;
              do l += j <= 65535 ? 1 : 2;
              while (E((j = this.fullCharCodeAt(l))));
              if (j === 92) return !0;
              var te = this.input.slice(q, l);
              return !(C.test(te) || (s && te === "of"));
            }),
            (X.isAwaitUsing = function (t) {
              return this.isUsingKeyword(!0, t);
            }),
            (X.isUsing = function (t) {
              return this.isUsingKeyword(!1, t);
            }),
            (X.parseStatement = function (t, s, u) {
              var l = this.type,
                b = this.startNode(),
                T;
              switch ((this.isLet(t) && ((l = h._var), (T = "let")), l)) {
                case h._break:
                case h._continue:
                  return this.parseBreakContinueStatement(b, l.keyword);
                case h._debugger:
                  return this.parseDebuggerStatement(b);
                case h._do:
                  return this.parseDoStatement(b);
                case h._for:
                  return this.parseForStatement(b);
                case h._function:
                  return (
                    t &&
                      (this.strict || (t !== "if" && t !== "label")) &&
                      this.options.ecmaVersion >= 6 &&
                      this.unexpected(),
                    this.parseFunctionStatement(b, !1, !t)
                  );
                case h._class:
                  return t && this.unexpected(), this.parseClass(b, !0);
                case h._if:
                  return this.parseIfStatement(b);
                case h._return:
                  return this.parseReturnStatement(b);
                case h._switch:
                  return this.parseSwitchStatement(b);
                case h._throw:
                  return this.parseThrowStatement(b);
                case h._try:
                  return this.parseTryStatement(b);
                case h._const:
                case h._var:
                  return (
                    (T = T || this.value),
                    t && T !== "var" && this.unexpected(),
                    this.parseVarStatement(b, T)
                  );
                case h._while:
                  return this.parseWhileStatement(b);
                case h._with:
                  return this.parseWithStatement(b);
                case h.braceL:
                  return this.parseBlock(!0, b);
                case h.semi:
                  return this.parseEmptyStatement(b);
                case h._export:
                case h._import:
                  if (this.options.ecmaVersion > 10 && l === h._import) {
                    K.lastIndex = this.pos;
                    var R = K.exec(this.input),
                      j = this.pos + R[0].length,
                      q = this.input.charCodeAt(j);
                    if (q === 40 || q === 46)
                      return this.parseExpressionStatement(b, this.parseExpression());
                  }
                  return (
                    this.options.allowImportExportEverywhere ||
                      (s ||
                        this.raise(
                          this.start,
                          "'import' and 'export' may only appear at the top level",
                        ),
                      this.inModule ||
                        this.raise(
                          this.start,
                          "'import' and 'export' may appear only with 'sourceType: module'",
                        )),
                    l === h._import ? this.parseImport(b) : this.parseExport(b, u)
                  );
                default: {
                  if (this.isAsyncFunction())
                    return (
                      t && this.unexpected(), this.next(), this.parseFunctionStatement(b, !0, !t)
                    );
                  var te = this.isAwaitUsing(!1)
                    ? "await using"
                    : this.isUsing(!1)
                      ? "using"
                      : null;
                  if (te)
                    return (
                      this.allowUsing ||
                        this.raise(
                          this.start,
                          "Using declaration cannot appear in the top level when source type is `script` or in the bare case statement",
                        ),
                      te === "await using" &&
                        (this.canAwait ||
                          this.raise(
                            this.start,
                            "Await using cannot appear outside of async function",
                          ),
                        this.next()),
                      this.next(),
                      this.parseVar(b, !1, te),
                      this.semicolon(),
                      this.finishNode(b, "VariableDeclaration")
                    );
                  var se = this.value,
                    Se = this.parseExpression();
                  return l === h.name && Se.type === "Identifier" && this.eat(h.colon)
                    ? this.parseLabeledStatement(b, se, Se, t)
                    : this.parseExpressionStatement(b, Se);
                }
              }
            }),
            (X.parseBreakContinueStatement = function (t, s) {
              var u = s === "break";
              this.next(),
                this.eat(h.semi) || this.insertSemicolon()
                  ? (t.label = null)
                  : this.type !== h.name
                    ? this.unexpected()
                    : ((t.label = this.parseIdent()), this.semicolon());
              for (var l = 0; l < this.labels.length; ++l) {
                var b = this.labels[l];
                if (
                  (t.label == null || b.name === t.label.name) &&
                  ((b.kind != null && (u || b.kind === "loop")) || (t.label && u))
                )
                  break;
              }
              return (
                l === this.labels.length && this.raise(t.start, "Unsyntactic " + s),
                this.finishNode(t, u ? "BreakStatement" : "ContinueStatement")
              );
            }),
            (X.parseDebuggerStatement = function (t) {
              return this.next(), this.semicolon(), this.finishNode(t, "DebuggerStatement");
            }),
            (X.parseDoStatement = function (t) {
              return (
                this.next(),
                this.labels.push($e),
                (t.body = this.parseStatement("do")),
                this.labels.pop(),
                this.expect(h._while),
                (t.test = this.parseParenExpression()),
                this.options.ecmaVersion >= 6 ? this.eat(h.semi) : this.semicolon(),
                this.finishNode(t, "DoWhileStatement")
              );
            }),
            (X.parseForStatement = function (t) {
              this.next();
              var s =
                this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await")
                  ? this.lastTokStart
                  : -1;
              if (
                (this.labels.push($e),
                this.enterScope(0),
                this.expect(h.parenL),
                this.type === h.semi)
              )
                return s > -1 && this.unexpected(s), this.parseFor(t, null);
              var u = this.isLet();
              if (this.type === h._var || this.type === h._const || u) {
                var l = this.startNode(),
                  b = u ? "let" : this.value;
                return (
                  this.next(),
                  this.parseVar(l, !0, b),
                  this.finishNode(l, "VariableDeclaration"),
                  this.parseForAfterInit(t, l, s)
                );
              }
              var T = this.isContextual("let"),
                R = !1,
                j = this.isUsing(!0) ? "using" : this.isAwaitUsing(!0) ? "await using" : null;
              if (j) {
                var q = this.startNode();
                return (
                  this.next(),
                  j === "await using" &&
                    (this.canAwait ||
                      this.raise(this.start, "Await using cannot appear outside of async function"),
                    this.next()),
                  this.parseVar(q, !0, j),
                  this.finishNode(q, "VariableDeclaration"),
                  this.parseForAfterInit(t, q, s)
                );
              }
              var te = this.containsEsc,
                se = new Me(),
                Se = this.start,
                Oe = s > -1 ? this.parseExprSubscripts(se, "await") : this.parseExpression(!0, se);
              return this.type === h._in ||
                (R = this.options.ecmaVersion >= 6 && this.isContextual("of"))
                ? (s > -1
                    ? (this.type === h._in && this.unexpected(s), (t.await = !0))
                    : R &&
                      this.options.ecmaVersion >= 8 &&
                      (Oe.start === Se && !te && Oe.type === "Identifier" && Oe.name === "async"
                        ? this.unexpected()
                        : this.options.ecmaVersion >= 9 && (t.await = !1)),
                  T &&
                    R &&
                    this.raise(
                      Oe.start,
                      "The left-hand side of a for-of loop may not start with 'let'.",
                    ),
                  this.toAssignable(Oe, !1, se),
                  this.checkLValPattern(Oe),
                  this.parseForIn(t, Oe))
                : (this.checkExpressionErrors(se, !0),
                  s > -1 && this.unexpected(s),
                  this.parseFor(t, Oe));
            }),
            (X.parseForAfterInit = function (t, s, u) {
              return (this.type === h._in ||
                (this.options.ecmaVersion >= 6 && this.isContextual("of"))) &&
                s.declarations.length === 1
                ? (this.options.ecmaVersion >= 9 &&
                    (this.type === h._in ? u > -1 && this.unexpected(u) : (t.await = u > -1)),
                  this.parseForIn(t, s))
                : (u > -1 && this.unexpected(u), this.parseFor(t, s));
            }),
            (X.parseFunctionStatement = function (t, s, u) {
              return this.next(), this.parseFunction(t, Ct | (u ? 0 : Ce), !1, s);
            }),
            (X.parseIfStatement = function (t) {
              return (
                this.next(),
                (t.test = this.parseParenExpression()),
                (t.consequent = this.parseStatement("if")),
                (t.alternate = this.eat(h._else) ? this.parseStatement("if") : null),
                this.finishNode(t, "IfStatement")
              );
            }),
            (X.parseReturnStatement = function (t) {
              return (
                this.allowReturn || this.raise(this.start, "'return' outside of function"),
                this.next(),
                this.eat(h.semi) || this.insertSemicolon()
                  ? (t.argument = null)
                  : ((t.argument = this.parseExpression()), this.semicolon()),
                this.finishNode(t, "ReturnStatement")
              );
            }),
            (X.parseSwitchStatement = function (t) {
              this.next(),
                (t.discriminant = this.parseParenExpression()),
                (t.cases = []),
                this.expect(h.braceL),
                this.labels.push(ke),
                this.enterScope(hi);
              for (var s, u = !1; this.type !== h.braceR; )
                if (this.type === h._case || this.type === h._default) {
                  var l = this.type === h._case;
                  s && this.finishNode(s, "SwitchCase"),
                    t.cases.push((s = this.startNode())),
                    (s.consequent = []),
                    this.next(),
                    l
                      ? (s.test = this.parseExpression())
                      : (u && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"),
                        (u = !0),
                        (s.test = null)),
                    this.expect(h.colon);
                } else s || this.unexpected(), s.consequent.push(this.parseStatement(null));
              return (
                this.exitScope(),
                s && this.finishNode(s, "SwitchCase"),
                this.next(),
                this.labels.pop(),
                this.finishNode(t, "SwitchStatement")
              );
            }),
            (X.parseThrowStatement = function (t) {
              return (
                this.next(),
                I.test(this.input.slice(this.lastTokEnd, this.start)) &&
                  this.raise(this.lastTokEnd, "Illegal newline after throw"),
                (t.argument = this.parseExpression()),
                this.semicolon(),
                this.finishNode(t, "ThrowStatement")
              );
            });
          var li = [];
          (X.parseCatchClauseParam = function () {
            var t = this.parseBindingAtom(),
              s = t.type === "Identifier";
            return (
              this.enterScope(s ? Ie : 0),
              this.checkLValPattern(t, s ? Pe : ze),
              this.expect(h.parenR),
              t
            );
          }),
            (X.parseTryStatement = function (t) {
              if (
                (this.next(),
                (t.block = this.parseBlock()),
                (t.handler = null),
                this.type === h._catch)
              ) {
                var s = this.startNode();
                this.next(),
                  this.eat(h.parenL)
                    ? (s.param = this.parseCatchClauseParam())
                    : (this.options.ecmaVersion < 10 && this.unexpected(),
                      (s.param = null),
                      this.enterScope(0)),
                  (s.body = this.parseBlock(!1)),
                  this.exitScope(),
                  (t.handler = this.finishNode(s, "CatchClause"));
              }
              return (
                (t.finalizer = this.eat(h._finally) ? this.parseBlock() : null),
                !t.handler &&
                  !t.finalizer &&
                  this.raise(t.start, "Missing catch or finally clause"),
                this.finishNode(t, "TryStatement")
              );
            }),
            (X.parseVarStatement = function (t, s, u) {
              return (
                this.next(),
                this.parseVar(t, !1, s, u),
                this.semicolon(),
                this.finishNode(t, "VariableDeclaration")
              );
            }),
            (X.parseWhileStatement = function (t) {
              return (
                this.next(),
                (t.test = this.parseParenExpression()),
                this.labels.push($e),
                (t.body = this.parseStatement("while")),
                this.labels.pop(),
                this.finishNode(t, "WhileStatement")
              );
            }),
            (X.parseWithStatement = function (t) {
              return (
                this.strict && this.raise(this.start, "'with' in strict mode"),
                this.next(),
                (t.object = this.parseParenExpression()),
                (t.body = this.parseStatement("with")),
                this.finishNode(t, "WithStatement")
              );
            }),
            (X.parseEmptyStatement = function (t) {
              return this.next(), this.finishNode(t, "EmptyStatement");
            }),
            (X.parseLabeledStatement = function (t, s, u, l) {
              for (var b = 0, T = this.labels; b < T.length; b += 1) {
                var R = T[b];
                R.name === s && this.raise(u.start, "Label '" + s + "' is already declared");
              }
              for (
                var j = this.type.isLoop ? "loop" : this.type === h._switch ? "switch" : null,
                  q = this.labels.length - 1;
                q >= 0;
                q--
              ) {
                var te = this.labels[q];
                if (te.statementStart === t.start) (te.statementStart = this.start), (te.kind = j);
                else break;
              }
              return (
                this.labels.push({ name: s, kind: j, statementStart: this.start }),
                (t.body = this.parseStatement(
                  l ? (l.indexOf("label") === -1 ? l + "label" : l) : "label",
                )),
                this.labels.pop(),
                (t.label = u),
                this.finishNode(t, "LabeledStatement")
              );
            }),
            (X.parseExpressionStatement = function (t, s) {
              return (
                (t.expression = s), this.semicolon(), this.finishNode(t, "ExpressionStatement")
              );
            }),
            (X.parseBlock = function (t, s, u) {
              for (
                t === void 0 && (t = !0),
                  s === void 0 && (s = this.startNode()),
                  s.body = [],
                  this.expect(h.braceL),
                  t && this.enterScope(0);
                this.type !== h.braceR;
              ) {
                var l = this.parseStatement(null);
                s.body.push(l);
              }
              return (
                u && (this.strict = !1),
                this.next(),
                t && this.exitScope(),
                this.finishNode(s, "BlockStatement")
              );
            }),
            (X.parseFor = function (t, s) {
              return (
                (t.init = s),
                this.expect(h.semi),
                (t.test = this.type === h.semi ? null : this.parseExpression()),
                this.expect(h.semi),
                (t.update = this.type === h.parenR ? null : this.parseExpression()),
                this.expect(h.parenR),
                (t.body = this.parseStatement("for")),
                this.exitScope(),
                this.labels.pop(),
                this.finishNode(t, "ForStatement")
              );
            }),
            (X.parseForIn = function (t, s) {
              var u = this.type === h._in;
              return (
                this.next(),
                s.type === "VariableDeclaration" &&
                  s.declarations[0].init != null &&
                  (!u ||
                    this.options.ecmaVersion < 8 ||
                    this.strict ||
                    s.kind !== "var" ||
                    s.declarations[0].id.type !== "Identifier") &&
                  this.raise(
                    s.start,
                    (u ? "for-in" : "for-of") +
                      " loop variable declaration may not have an initializer",
                  ),
                (t.left = s),
                (t.right = u ? this.parseExpression() : this.parseMaybeAssign()),
                this.expect(h.parenR),
                (t.body = this.parseStatement("for")),
                this.exitScope(),
                this.labels.pop(),
                this.finishNode(t, u ? "ForInStatement" : "ForOfStatement")
              );
            }),
            (X.parseVar = function (t, s, u, l) {
              for (t.declarations = [], t.kind = u; ; ) {
                var b = this.startNode();
                if (
                  (this.parseVarId(b, u),
                  this.eat(h.eq)
                    ? (b.init = this.parseMaybeAssign(s))
                    : !l &&
                        u === "const" &&
                        !(
                          this.type === h._in ||
                          (this.options.ecmaVersion >= 6 && this.isContextual("of"))
                        )
                      ? this.unexpected()
                      : !l &&
                          (u === "using" || u === "await using") &&
                          this.options.ecmaVersion >= 17 &&
                          this.type !== h._in &&
                          !this.isContextual("of")
                        ? this.raise(
                            this.lastTokEnd,
                            "Missing initializer in " + u + " declaration",
                          )
                        : !l &&
                            b.id.type !== "Identifier" &&
                            !(s && (this.type === h._in || this.isContextual("of")))
                          ? this.raise(
                              this.lastTokEnd,
                              "Complex binding patterns require an initialization value",
                            )
                          : (b.init = null),
                  t.declarations.push(this.finishNode(b, "VariableDeclarator")),
                  !this.eat(h.comma))
                )
                  break;
              }
              return t;
            }),
            (X.parseVarId = function (t, s) {
              (t.id =
                s === "using" || s === "await using" ? this.parseIdent() : this.parseBindingAtom()),
                this.checkLValPattern(t.id, s === "var" ? Gt : ze, !1);
            });
          var Ct = 1,
            Ce = 2,
            Re = 4;
          (X.parseFunction = function (t, s, u, l, b) {
            this.initFunction(t),
              (this.options.ecmaVersion >= 9 || (this.options.ecmaVersion >= 6 && !l)) &&
                (this.type === h.star && s & Ce && this.unexpected(),
                (t.generator = this.eat(h.star))),
              this.options.ecmaVersion >= 8 && (t.async = !!l),
              s & Ct &&
                ((t.id = s & Re && this.type !== h.name ? null : this.parseIdent()),
                t.id &&
                  !(s & Ce) &&
                  this.checkLValSimple(
                    t.id,
                    this.strict || t.generator || t.async
                      ? this.treatFunctionsAsVar
                        ? Gt
                        : ze
                      : fe,
                  ));
            var T = this.yieldPos,
              R = this.awaitPos,
              j = this.awaitIdentPos;
            return (
              (this.yieldPos = 0),
              (this.awaitPos = 0),
              (this.awaitIdentPos = 0),
              this.enterScope(Ut(t.async, t.generator)),
              s & Ct || (t.id = this.type === h.name ? this.parseIdent() : null),
              this.parseFunctionParams(t),
              this.parseFunctionBody(t, u, !1, b),
              (this.yieldPos = T),
              (this.awaitPos = R),
              (this.awaitIdentPos = j),
              this.finishNode(t, s & Ct ? "FunctionDeclaration" : "FunctionExpression")
            );
          }),
            (X.parseFunctionParams = function (t) {
              this.expect(h.parenL),
                (t.params = this.parseBindingList(h.parenR, !1, this.options.ecmaVersion >= 8)),
                this.checkYieldAwaitInDefaultParams();
            }),
            (X.parseClass = function (t, s) {
              this.next();
              var u = this.strict;
              (this.strict = !0), this.parseClassId(t, s), this.parseClassSuper(t);
              var l = this.enterClassBody(),
                b = this.startNode(),
                T = !1;
              for (b.body = [], this.expect(h.braceL); this.type !== h.braceR; ) {
                var R = this.parseClassElement(t.superClass !== null);
                R &&
                  (b.body.push(R),
                  R.type === "MethodDefinition" && R.kind === "constructor"
                    ? (T &&
                        this.raiseRecoverable(R.start, "Duplicate constructor in the same class"),
                      (T = !0))
                    : R.key &&
                      R.key.type === "PrivateIdentifier" &&
                      Et(l, R) &&
                      this.raiseRecoverable(
                        R.key.start,
                        "Identifier '#" + R.key.name + "' has already been declared",
                      ));
              }
              return (
                (this.strict = u),
                this.next(),
                (t.body = this.finishNode(b, "ClassBody")),
                this.exitClassBody(),
                this.finishNode(t, s ? "ClassDeclaration" : "ClassExpression")
              );
            }),
            (X.parseClassElement = function (t) {
              if (this.eat(h.semi)) return null;
              var s = this.options.ecmaVersion,
                u = this.startNode(),
                l = "",
                b = !1,
                T = !1,
                R = "method",
                j = !1;
              if (this.eatContextual("static")) {
                if (s >= 13 && this.eat(h.braceL)) return this.parseClassStaticBlock(u), u;
                this.isClassElementNameStart() || this.type === h.star ? (j = !0) : (l = "static");
              }
              if (
                ((u.static = j),
                !l &&
                  s >= 8 &&
                  this.eatContextual("async") &&
                  ((this.isClassElementNameStart() || this.type === h.star) &&
                  !this.canInsertSemicolon()
                    ? (T = !0)
                    : (l = "async")),
                !l && (s >= 9 || !T) && this.eat(h.star) && (b = !0),
                !l && !T && !b)
              ) {
                var q = this.value;
                (this.eatContextual("get") || this.eatContextual("set")) &&
                  (this.isClassElementNameStart() ? (R = q) : (l = q));
              }
              if (
                (l
                  ? ((u.computed = !1),
                    (u.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc)),
                    (u.key.name = l),
                    this.finishNode(u.key, "Identifier"))
                  : this.parseClassElementName(u),
                s < 13 || this.type === h.parenL || R !== "method" || b || T)
              ) {
                var te = !u.static && nt(u, "constructor"),
                  se = te && t;
                te &&
                  R !== "method" &&
                  this.raise(u.key.start, "Constructor can't have get/set modifier"),
                  (u.kind = te ? "constructor" : R),
                  this.parseClassMethod(u, b, T, se);
              } else this.parseClassField(u);
              return u;
            }),
            (X.isClassElementNameStart = function () {
              return (
                this.type === h.name ||
                this.type === h.privateId ||
                this.type === h.num ||
                this.type === h.string ||
                this.type === h.bracketL ||
                this.type.keyword
              );
            }),
            (X.parseClassElementName = function (t) {
              this.type === h.privateId
                ? (this.value === "constructor" &&
                    this.raise(this.start, "Classes can't have an element named '#constructor'"),
                  (t.computed = !1),
                  (t.key = this.parsePrivateIdent()))
                : this.parsePropertyName(t);
            }),
            (X.parseClassMethod = function (t, s, u, l) {
              var b = t.key;
              t.kind === "constructor"
                ? (s && this.raise(b.start, "Constructor can't be a generator"),
                  u && this.raise(b.start, "Constructor can't be an async method"))
                : t.static &&
                  nt(t, "prototype") &&
                  this.raise(b.start, "Classes may not have a static property named prototype");
              var T = (t.value = this.parseMethod(s, u, l));
              return (
                t.kind === "get" &&
                  T.params.length !== 0 &&
                  this.raiseRecoverable(T.start, "getter should have no params"),
                t.kind === "set" &&
                  T.params.length !== 1 &&
                  this.raiseRecoverable(T.start, "setter should have exactly one param"),
                t.kind === "set" &&
                  T.params[0].type === "RestElement" &&
                  this.raiseRecoverable(T.params[0].start, "Setter cannot use rest params"),
                this.finishNode(t, "MethodDefinition")
              );
            }),
            (X.parseClassField = function (t) {
              return (
                nt(t, "constructor")
                  ? this.raise(t.key.start, "Classes can't have a field named 'constructor'")
                  : t.static &&
                    nt(t, "prototype") &&
                    this.raise(t.key.start, "Classes can't have a static field named 'prototype'"),
                this.eat(h.eq)
                  ? (this.enterScope(mt | St),
                    (t.value = this.parseMaybeAssign()),
                    this.exitScope())
                  : (t.value = null),
                this.semicolon(),
                this.finishNode(t, "PropertyDefinition")
              );
            }),
            (X.parseClassStaticBlock = function (t) {
              t.body = [];
              var s = this.labels;
              for (this.labels = [], this.enterScope(st | St); this.type !== h.braceR; ) {
                var u = this.parseStatement(null);
                t.body.push(u);
              }
              return (
                this.next(), this.exitScope(), (this.labels = s), this.finishNode(t, "StaticBlock")
              );
            }),
            (X.parseClassId = function (t, s) {
              this.type === h.name
                ? ((t.id = this.parseIdent()), s && this.checkLValSimple(t.id, ze, !1))
                : (s === !0 && this.unexpected(), (t.id = null));
            }),
            (X.parseClassSuper = function (t) {
              t.superClass = this.eat(h._extends) ? this.parseExprSubscripts(null, !1) : null;
            }),
            (X.enterClassBody = function () {
              var t = { declared: Object.create(null), used: [] };
              return this.privateNameStack.push(t), t.declared;
            }),
            (X.exitClassBody = function () {
              var t = this.privateNameStack.pop(),
                s = t.declared,
                u = t.used;
              if (this.options.checkPrivateFields)
                for (
                  var l = this.privateNameStack.length,
                    b = l === 0 ? null : this.privateNameStack[l - 1],
                    T = 0;
                  T < u.length;
                  ++T
                ) {
                  var R = u[T];
                  ve(s, R.name) ||
                    (b
                      ? b.used.push(R)
                      : this.raiseRecoverable(
                          R.start,
                          "Private field '#" + R.name + "' must be declared in an enclosing class",
                        ));
                }
            });
          function Et(t, s) {
            var u = s.key.name,
              l = t[u],
              b = "true";
            return (
              s.type === "MethodDefinition" &&
                (s.kind === "get" || s.kind === "set") &&
                (b = (s.static ? "s" : "i") + s.kind),
              (l === "iget" && b === "iset") ||
              (l === "iset" && b === "iget") ||
              (l === "sget" && b === "sset") ||
              (l === "sset" && b === "sget")
                ? ((t[u] = "true"), !1)
                : l
                  ? !0
                  : ((t[u] = b), !1)
            );
          }
          function nt(t, s) {
            var u = t.computed,
              l = t.key;
            return (
              !u &&
              ((l.type === "Identifier" && l.name === s) || (l.type === "Literal" && l.value === s))
            );
          }
          (X.parseExportAllDeclaration = function (t, s) {
            return (
              this.options.ecmaVersion >= 11 &&
                (this.eatContextual("as")
                  ? ((t.exported = this.parseModuleExportName()),
                    this.checkExport(s, t.exported, this.lastTokStart))
                  : (t.exported = null)),
              this.expectContextual("from"),
              this.type !== h.string && this.unexpected(),
              (t.source = this.parseExprAtom()),
              this.options.ecmaVersion >= 16 && (t.attributes = this.parseWithClause()),
              this.semicolon(),
              this.finishNode(t, "ExportAllDeclaration")
            );
          }),
            (X.parseExport = function (t, s) {
              if ((this.next(), this.eat(h.star))) return this.parseExportAllDeclaration(t, s);
              if (this.eat(h._default))
                return (
                  this.checkExport(s, "default", this.lastTokStart),
                  (t.declaration = this.parseExportDefaultDeclaration()),
                  this.finishNode(t, "ExportDefaultDeclaration")
                );
              if (this.shouldParseExportStatement())
                (t.declaration = this.parseExportDeclaration(t)),
                  t.declaration.type === "VariableDeclaration"
                    ? this.checkVariableExport(s, t.declaration.declarations)
                    : this.checkExport(s, t.declaration.id, t.declaration.id.start),
                  (t.specifiers = []),
                  (t.source = null),
                  this.options.ecmaVersion >= 16 && (t.attributes = []);
              else {
                if (
                  ((t.declaration = null),
                  (t.specifiers = this.parseExportSpecifiers(s)),
                  this.eatContextual("from"))
                )
                  this.type !== h.string && this.unexpected(),
                    (t.source = this.parseExprAtom()),
                    this.options.ecmaVersion >= 16 && (t.attributes = this.parseWithClause());
                else {
                  for (var u = 0, l = t.specifiers; u < l.length; u += 1) {
                    var b = l[u];
                    this.checkUnreserved(b.local),
                      this.checkLocalExport(b.local),
                      b.local.type === "Literal" &&
                        this.raise(
                          b.local.start,
                          "A string literal cannot be used as an exported binding without `from`.",
                        );
                  }
                  (t.source = null), this.options.ecmaVersion >= 16 && (t.attributes = []);
                }
                this.semicolon();
              }
              return this.finishNode(t, "ExportNamedDeclaration");
            }),
            (X.parseExportDeclaration = function (t) {
              return this.parseStatement(null);
            }),
            (X.parseExportDefaultDeclaration = function () {
              var t;
              if (this.type === h._function || (t = this.isAsyncFunction())) {
                var s = this.startNode();
                return this.next(), t && this.next(), this.parseFunction(s, Ct | Re, !1, t);
              } else if (this.type === h._class) {
                var u = this.startNode();
                return this.parseClass(u, "nullableID");
              } else {
                var l = this.parseMaybeAssign();
                return this.semicolon(), l;
              }
            }),
            (X.checkExport = function (t, s, u) {
              t &&
                (typeof s != "string" && (s = s.type === "Identifier" ? s.name : s.value),
                ve(t, s) && this.raiseRecoverable(u, "Duplicate export '" + s + "'"),
                (t[s] = !0));
            }),
            (X.checkPatternExport = function (t, s) {
              var u = s.type;
              if (u === "Identifier") this.checkExport(t, s, s.start);
              else if (u === "ObjectPattern")
                for (var l = 0, b = s.properties; l < b.length; l += 1) {
                  var T = b[l];
                  this.checkPatternExport(t, T);
                }
              else if (u === "ArrayPattern")
                for (var R = 0, j = s.elements; R < j.length; R += 1) {
                  var q = j[R];
                  q && this.checkPatternExport(t, q);
                }
              else
                u === "Property"
                  ? this.checkPatternExport(t, s.value)
                  : u === "AssignmentPattern"
                    ? this.checkPatternExport(t, s.left)
                    : u === "RestElement" && this.checkPatternExport(t, s.argument);
            }),
            (X.checkVariableExport = function (t, s) {
              if (t)
                for (var u = 0, l = s; u < l.length; u += 1) {
                  var b = l[u];
                  this.checkPatternExport(t, b.id);
                }
            }),
            (X.shouldParseExportStatement = function () {
              return (
                this.type.keyword === "var" ||
                this.type.keyword === "const" ||
                this.type.keyword === "class" ||
                this.type.keyword === "function" ||
                this.isLet() ||
                this.isAsyncFunction()
              );
            }),
            (X.parseExportSpecifier = function (t) {
              var s = this.startNode();
              return (
                (s.local = this.parseModuleExportName()),
                (s.exported = this.eatContextual("as") ? this.parseModuleExportName() : s.local),
                this.checkExport(t, s.exported, s.exported.start),
                this.finishNode(s, "ExportSpecifier")
              );
            }),
            (X.parseExportSpecifiers = function (t) {
              var s = [],
                u = !0;
              for (this.expect(h.braceL); !this.eat(h.braceR); ) {
                if (u) u = !1;
                else if ((this.expect(h.comma), this.afterTrailingComma(h.braceR))) break;
                s.push(this.parseExportSpecifier(t));
              }
              return s;
            }),
            (X.parseImport = function (t) {
              return (
                this.next(),
                this.type === h.string
                  ? ((t.specifiers = li), (t.source = this.parseExprAtom()))
                  : ((t.specifiers = this.parseImportSpecifiers()),
                    this.expectContextual("from"),
                    (t.source = this.type === h.string ? this.parseExprAtom() : this.unexpected())),
                this.options.ecmaVersion >= 16 && (t.attributes = this.parseWithClause()),
                this.semicolon(),
                this.finishNode(t, "ImportDeclaration")
              );
            }),
            (X.parseImportSpecifier = function () {
              var t = this.startNode();
              return (
                (t.imported = this.parseModuleExportName()),
                this.eatContextual("as")
                  ? (t.local = this.parseIdent())
                  : (this.checkUnreserved(t.imported), (t.local = t.imported)),
                this.checkLValSimple(t.local, ze),
                this.finishNode(t, "ImportSpecifier")
              );
            }),
            (X.parseImportDefaultSpecifier = function () {
              var t = this.startNode();
              return (
                (t.local = this.parseIdent()),
                this.checkLValSimple(t.local, ze),
                this.finishNode(t, "ImportDefaultSpecifier")
              );
            }),
            (X.parseImportNamespaceSpecifier = function () {
              var t = this.startNode();
              return (
                this.next(),
                this.expectContextual("as"),
                (t.local = this.parseIdent()),
                this.checkLValSimple(t.local, ze),
                this.finishNode(t, "ImportNamespaceSpecifier")
              );
            }),
            (X.parseImportSpecifiers = function () {
              var t = [],
                s = !0;
              if (
                this.type === h.name &&
                (t.push(this.parseImportDefaultSpecifier()), !this.eat(h.comma))
              )
                return t;
              if (this.type === h.star) return t.push(this.parseImportNamespaceSpecifier()), t;
              for (this.expect(h.braceL); !this.eat(h.braceR); ) {
                if (s) s = !1;
                else if ((this.expect(h.comma), this.afterTrailingComma(h.braceR))) break;
                t.push(this.parseImportSpecifier());
              }
              return t;
            }),
            (X.parseWithClause = function () {
              var t = [];
              if (!this.eat(h._with)) return t;
              this.expect(h.braceL);
              for (var s = {}, u = !0; !this.eat(h.braceR); ) {
                if (u) u = !1;
                else if ((this.expect(h.comma), this.afterTrailingComma(h.braceR))) break;
                var l = this.parseImportAttribute(),
                  b = l.key.type === "Identifier" ? l.key.name : l.key.value;
                ve(s, b) &&
                  this.raiseRecoverable(l.key.start, "Duplicate attribute key '" + b + "'"),
                  (s[b] = !0),
                  t.push(l);
              }
              return t;
            }),
            (X.parseImportAttribute = function () {
              var t = this.startNode();
              return (
                (t.key =
                  this.type === h.string
                    ? this.parseExprAtom()
                    : this.parseIdent(this.options.allowReserved !== "never")),
                this.expect(h.colon),
                this.type !== h.string && this.unexpected(),
                (t.value = this.parseExprAtom()),
                this.finishNode(t, "ImportAttribute")
              );
            }),
            (X.parseModuleExportName = function () {
              if (this.options.ecmaVersion >= 13 && this.type === h.string) {
                var t = this.parseLiteral(this.value);
                return (
                  pt.test(t.value) &&
                    this.raise(t.start, "An export name cannot include a lone surrogate."),
                  t
                );
              }
              return this.parseIdent(!0);
            }),
            (X.adaptDirectivePrologue = function (t) {
              for (var s = 0; s < t.length && this.isDirectiveCandidate(t[s]); ++s)
                t[s].directive = t[s].expression.raw.slice(1, -1);
            }),
            (X.isDirectiveCandidate = function (t) {
              return (
                this.options.ecmaVersion >= 5 &&
                t.type === "ExpressionStatement" &&
                t.expression.type === "Literal" &&
                typeof t.expression.value == "string" &&
                (this.input[t.start] === '"' || this.input[t.start] === "'")
              );
            });
          var Fe = ne.prototype;
          (Fe.toAssignable = function (t, s, u) {
            if (this.options.ecmaVersion >= 6 && t)
              switch (t.type) {
                case "Identifier":
                  this.inAsync &&
                    t.name === "await" &&
                    this.raise(
                      t.start,
                      "Cannot use 'await' as identifier inside an async function",
                    );
                  break;
                case "ObjectPattern":
                case "ArrayPattern":
                case "AssignmentPattern":
                case "RestElement":
                  break;
                case "ObjectExpression":
                  (t.type = "ObjectPattern"), u && this.checkPatternErrors(u, !0);
                  for (var l = 0, b = t.properties; l < b.length; l += 1) {
                    var T = b[l];
                    this.toAssignable(T, s),
                      T.type === "RestElement" &&
                        (T.argument.type === "ArrayPattern" ||
                          T.argument.type === "ObjectPattern") &&
                        this.raise(T.argument.start, "Unexpected token");
                  }
                  break;
                case "Property":
                  t.kind !== "init" &&
                    this.raise(t.key.start, "Object pattern can't contain getter or setter"),
                    this.toAssignable(t.value, s);
                  break;
                case "ArrayExpression":
                  (t.type = "ArrayPattern"),
                    u && this.checkPatternErrors(u, !0),
                    this.toAssignableList(t.elements, s);
                  break;
                case "SpreadElement":
                  (t.type = "RestElement"),
                    this.toAssignable(t.argument, s),
                    t.argument.type === "AssignmentPattern" &&
                      this.raise(t.argument.start, "Rest elements cannot have a default value");
                  break;
                case "AssignmentExpression":
                  t.operator !== "=" &&
                    this.raise(
                      t.left.end,
                      "Only '=' operator can be used for specifying default value.",
                    ),
                    (t.type = "AssignmentPattern"),
                    delete t.operator,
                    this.toAssignable(t.left, s);
                  break;
                case "ParenthesizedExpression":
                  this.toAssignable(t.expression, s, u);
                  break;
                case "ChainExpression":
                  this.raiseRecoverable(
                    t.start,
                    "Optional chaining cannot appear in left-hand side",
                  );
                  break;
                case "MemberExpression":
                  if (!s) break;
                default:
                  this.raise(t.start, "Assigning to rvalue");
              }
            else u && this.checkPatternErrors(u, !0);
            return t;
          }),
            (Fe.toAssignableList = function (t, s) {
              for (var u = t.length, l = 0; l < u; l++) {
                var b = t[l];
                b && this.toAssignable(b, s);
              }
              if (u) {
                var T = t[u - 1];
                this.options.ecmaVersion === 6 &&
                  s &&
                  T &&
                  T.type === "RestElement" &&
                  T.argument.type !== "Identifier" &&
                  this.unexpected(T.argument.start);
              }
              return t;
            }),
            (Fe.parseSpread = function (t) {
              var s = this.startNode();
              return (
                this.next(),
                (s.argument = this.parseMaybeAssign(!1, t)),
                this.finishNode(s, "SpreadElement")
              );
            }),
            (Fe.parseRestBinding = function () {
              var t = this.startNode();
              return (
                this.next(),
                this.options.ecmaVersion === 6 && this.type !== h.name && this.unexpected(),
                (t.argument = this.parseBindingAtom()),
                this.finishNode(t, "RestElement")
              );
            }),
            (Fe.parseBindingAtom = function () {
              if (this.options.ecmaVersion >= 6)
                switch (this.type) {
                  case h.bracketL: {
                    var t = this.startNode();
                    return (
                      this.next(),
                      (t.elements = this.parseBindingList(h.bracketR, !0, !0)),
                      this.finishNode(t, "ArrayPattern")
                    );
                  }
                  case h.braceL:
                    return this.parseObj(!0);
                }
              return this.parseIdent();
            }),
            (Fe.parseBindingList = function (t, s, u, l) {
              for (var b = [], T = !0; !this.eat(t); )
                if ((T ? (T = !1) : this.expect(h.comma), s && this.type === h.comma)) b.push(null);
                else {
                  if (u && this.afterTrailingComma(t)) break;
                  if (this.type === h.ellipsis) {
                    var R = this.parseRestBinding();
                    this.parseBindingListItem(R),
                      b.push(R),
                      this.type === h.comma &&
                        this.raiseRecoverable(
                          this.start,
                          "Comma is not permitted after the rest element",
                        ),
                      this.expect(t);
                    break;
                  } else b.push(this.parseAssignableListItem(l));
                }
              return b;
            }),
            (Fe.parseAssignableListItem = function (t) {
              var s = this.parseMaybeDefault(this.start, this.startLoc);
              return this.parseBindingListItem(s), s;
            }),
            (Fe.parseBindingListItem = (t) => t),
            (Fe.parseMaybeDefault = function (t, s, u) {
              if (
                ((u = u || this.parseBindingAtom()),
                this.options.ecmaVersion < 6 || !this.eat(h.eq))
              )
                return u;
              var l = this.startNodeAt(t, s);
              return (
                (l.left = u),
                (l.right = this.parseMaybeAssign()),
                this.finishNode(l, "AssignmentPattern")
              );
            }),
            (Fe.checkLValSimple = function (t, s, u) {
              s === void 0 && (s = Lt);
              var l = s !== Lt;
              switch (t.type) {
                case "Identifier":
                  this.strict &&
                    this.reservedWordsStrictBind.test(t.name) &&
                    this.raiseRecoverable(
                      t.start,
                      (l ? "Binding " : "Assigning to ") + t.name + " in strict mode",
                    ),
                    l &&
                      (s === ze &&
                        t.name === "let" &&
                        this.raiseRecoverable(
                          t.start,
                          "let is disallowed as a lexically bound name",
                        ),
                      u &&
                        (ve(u, t.name) && this.raiseRecoverable(t.start, "Argument name clash"),
                        (u[t.name] = !0)),
                      s !== $ && this.declareName(t.name, s, t.start));
                  break;
                case "ChainExpression":
                  this.raiseRecoverable(
                    t.start,
                    "Optional chaining cannot appear in left-hand side",
                  );
                  break;
                case "MemberExpression":
                  l && this.raiseRecoverable(t.start, "Binding member expression");
                  break;
                case "ParenthesizedExpression":
                  return (
                    l && this.raiseRecoverable(t.start, "Binding parenthesized expression"),
                    this.checkLValSimple(t.expression, s, u)
                  );
                default:
                  this.raise(t.start, (l ? "Binding" : "Assigning to") + " rvalue");
              }
            }),
            (Fe.checkLValPattern = function (t, s, u) {
              switch ((s === void 0 && (s = Lt), t.type)) {
                case "ObjectPattern":
                  for (var l = 0, b = t.properties; l < b.length; l += 1) {
                    var T = b[l];
                    this.checkLValInnerPattern(T, s, u);
                  }
                  break;
                case "ArrayPattern":
                  for (var R = 0, j = t.elements; R < j.length; R += 1) {
                    var q = j[R];
                    q && this.checkLValInnerPattern(q, s, u);
                  }
                  break;
                default:
                  this.checkLValSimple(t, s, u);
              }
            }),
            (Fe.checkLValInnerPattern = function (t, s, u) {
              switch ((s === void 0 && (s = Lt), t.type)) {
                case "Property":
                  this.checkLValInnerPattern(t.value, s, u);
                  break;
                case "AssignmentPattern":
                  this.checkLValPattern(t.left, s, u);
                  break;
                case "RestElement":
                  this.checkLValPattern(t.argument, s, u);
                  break;
                default:
                  this.checkLValPattern(t, s, u);
              }
            });
          var De = function (s, u, l, b, T) {
              (this.token = s),
                (this.isExpr = !!u),
                (this.preserveSpace = !!l),
                (this.override = b),
                (this.generator = !!T);
            },
            xe = {
              b_stat: new De("{", !1),
              b_expr: new De("{", !0),
              b_tmpl: new De("${", !1),
              p_stat: new De("(", !1),
              p_expr: new De("(", !0),
              q_tmpl: new De("`", !0, !0, (t) => t.tryReadTemplateToken()),
              f_stat: new De("function", !1),
              f_expr: new De("function", !0),
              f_expr_gen: new De("function", !0, !1, null, !0),
              f_gen: new De("function", !1, !1, null, !0),
            },
            a = ne.prototype;
          (a.initialContext = () => [xe.b_stat]),
            (a.curContext = function () {
              return this.context[this.context.length - 1];
            }),
            (a.braceIsBlock = function (t) {
              var s = this.curContext();
              return s === xe.f_expr || s === xe.f_stat
                ? !0
                : t === h.colon && (s === xe.b_stat || s === xe.b_expr)
                  ? !s.isExpr
                  : t === h._return || (t === h.name && this.exprAllowed)
                    ? I.test(this.input.slice(this.lastTokEnd, this.start))
                    : t === h._else ||
                        t === h.semi ||
                        t === h.eof ||
                        t === h.parenR ||
                        t === h.arrow
                      ? !0
                      : t === h.braceL
                        ? s === xe.b_stat
                        : t === h._var || t === h._const || t === h.name
                          ? !1
                          : !this.exprAllowed;
            }),
            (a.inGeneratorContext = function () {
              for (var t = this.context.length - 1; t >= 1; t--) {
                var s = this.context[t];
                if (s.token === "function") return s.generator;
              }
              return !1;
            }),
            (a.updateContext = function (t) {
              var s,
                u = this.type;
              u.keyword && t === h.dot
                ? (this.exprAllowed = !1)
                : (s = u.updateContext)
                  ? s.call(this, t)
                  : (this.exprAllowed = u.beforeExpr);
            }),
            (a.overrideContext = function (t) {
              this.curContext() !== t && (this.context[this.context.length - 1] = t);
            }),
            (h.parenR.updateContext = h.braceR.updateContext =
              function () {
                if (this.context.length === 1) {
                  this.exprAllowed = !0;
                  return;
                }
                var t = this.context.pop();
                t === xe.b_stat &&
                  this.curContext().token === "function" &&
                  (t = this.context.pop()),
                  (this.exprAllowed = !t.isExpr);
              }),
            (h.braceL.updateContext = function (t) {
              this.context.push(this.braceIsBlock(t) ? xe.b_stat : xe.b_expr),
                (this.exprAllowed = !0);
            }),
            (h.dollarBraceL.updateContext = function () {
              this.context.push(xe.b_tmpl), (this.exprAllowed = !0);
            }),
            (h.parenL.updateContext = function (t) {
              var s = t === h._if || t === h._for || t === h._with || t === h._while;
              this.context.push(s ? xe.p_stat : xe.p_expr), (this.exprAllowed = !0);
            }),
            (h.incDec.updateContext = () => {}),
            (h._function.updateContext = h._class.updateContext =
              function (t) {
                t.beforeExpr &&
                t !== h._else &&
                !(t === h.semi && this.curContext() !== xe.p_stat) &&
                !(t === h._return && I.test(this.input.slice(this.lastTokEnd, this.start))) &&
                !((t === h.colon || t === h.braceL) && this.curContext() === xe.b_stat)
                  ? this.context.push(xe.f_expr)
                  : this.context.push(xe.f_stat),
                  (this.exprAllowed = !1);
              }),
            (h.colon.updateContext = function () {
              this.curContext().token === "function" && this.context.pop(), (this.exprAllowed = !0);
            }),
            (h.backQuote.updateContext = function () {
              this.curContext() === xe.q_tmpl ? this.context.pop() : this.context.push(xe.q_tmpl),
                (this.exprAllowed = !1);
            }),
            (h.star.updateContext = function (t) {
              if (t === h._function) {
                var s = this.context.length - 1;
                this.context[s] === xe.f_expr
                  ? (this.context[s] = xe.f_expr_gen)
                  : (this.context[s] = xe.f_gen);
              }
              this.exprAllowed = !0;
            }),
            (h.name.updateContext = function (t) {
              var s = !1;
              this.options.ecmaVersion >= 6 &&
                t !== h.dot &&
                ((this.value === "of" && !this.exprAllowed) ||
                  (this.value === "yield" && this.inGeneratorContext())) &&
                (s = !0),
                (this.exprAllowed = s);
            });
          var c = ne.prototype;
          (c.checkPropClash = function (t, s, u) {
            if (
              !(this.options.ecmaVersion >= 9 && t.type === "SpreadElement") &&
              !(this.options.ecmaVersion >= 6 && (t.computed || t.method || t.shorthand))
            ) {
              var l = t.key,
                b;
              switch (l.type) {
                case "Identifier":
                  b = l.name;
                  break;
                case "Literal":
                  b = String(l.value);
                  break;
                default:
                  return;
              }
              var T = t.kind;
              if (this.options.ecmaVersion >= 6) {
                b === "__proto__" &&
                  T === "init" &&
                  (s.proto &&
                    (u
                      ? u.doubleProto < 0 && (u.doubleProto = l.start)
                      : this.raiseRecoverable(l.start, "Redefinition of __proto__ property")),
                  (s.proto = !0));
                return;
              }
              b = "$" + b;
              var R = s[b];
              if (R) {
                var j;
                T === "init"
                  ? (j = (this.strict && R.init) || R.get || R.set)
                  : (j = R.init || R[T]),
                  j && this.raiseRecoverable(l.start, "Redefinition of property");
              } else R = s[b] = { init: !1, get: !1, set: !1 };
              R[T] = !0;
            }
          }),
            (c.parseExpression = function (t, s) {
              var u = this.start,
                l = this.startLoc,
                b = this.parseMaybeAssign(t, s);
              if (this.type === h.comma) {
                var T = this.startNodeAt(u, l);
                for (T.expressions = [b]; this.eat(h.comma); )
                  T.expressions.push(this.parseMaybeAssign(t, s));
                return this.finishNode(T, "SequenceExpression");
              }
              return b;
            }),
            (c.parseMaybeAssign = function (t, s, u) {
              if (this.isContextual("yield")) {
                if (this.inGenerator) return this.parseYield(t);
                this.exprAllowed = !1;
              }
              var l = !1,
                b = -1,
                T = -1,
                R = -1;
              s
                ? ((b = s.parenthesizedAssign),
                  (T = s.trailingComma),
                  (R = s.doubleProto),
                  (s.parenthesizedAssign = s.trailingComma = -1))
                : ((s = new Me()), (l = !0));
              var j = this.start,
                q = this.startLoc;
              (this.type === h.parenL || this.type === h.name) &&
                ((this.potentialArrowAt = this.start),
                (this.potentialArrowInForAwait = t === "await"));
              var te = this.parseMaybeConditional(t, s);
              if ((u && (te = u.call(this, te, j, q)), this.type.isAssign)) {
                var se = this.startNodeAt(j, q);
                return (
                  (se.operator = this.value),
                  this.type === h.eq && (te = this.toAssignable(te, !1, s)),
                  l || (s.parenthesizedAssign = s.trailingComma = s.doubleProto = -1),
                  s.shorthandAssign >= te.start && (s.shorthandAssign = -1),
                  this.type === h.eq ? this.checkLValPattern(te) : this.checkLValSimple(te),
                  (se.left = te),
                  this.next(),
                  (se.right = this.parseMaybeAssign(t)),
                  R > -1 && (s.doubleProto = R),
                  this.finishNode(se, "AssignmentExpression")
                );
              } else l && this.checkExpressionErrors(s, !0);
              return b > -1 && (s.parenthesizedAssign = b), T > -1 && (s.trailingComma = T), te;
            }),
            (c.parseMaybeConditional = function (t, s) {
              var u = this.start,
                l = this.startLoc,
                b = this.parseExprOps(t, s);
              if (this.checkExpressionErrors(s)) return b;
              if (this.eat(h.question)) {
                var T = this.startNodeAt(u, l);
                return (
                  (T.test = b),
                  (T.consequent = this.parseMaybeAssign()),
                  this.expect(h.colon),
                  (T.alternate = this.parseMaybeAssign(t)),
                  this.finishNode(T, "ConditionalExpression")
                );
              }
              return b;
            }),
            (c.parseExprOps = function (t, s) {
              var u = this.start,
                l = this.startLoc,
                b = this.parseMaybeUnary(s, !1, !1, t);
              return this.checkExpressionErrors(s) ||
                (b.start === u && b.type === "ArrowFunctionExpression")
                ? b
                : this.parseExprOp(b, u, l, -1, t);
            }),
            (c.parseExprOp = function (t, s, u, l, b) {
              var T = this.type.binop;
              if (T != null && (!b || this.type !== h._in) && T > l) {
                var R = this.type === h.logicalOR || this.type === h.logicalAND,
                  j = this.type === h.coalesce;
                j && (T = h.logicalAND.binop);
                var q = this.value;
                this.next();
                var te = this.start,
                  se = this.startLoc,
                  Se = this.parseExprOp(this.parseMaybeUnary(null, !1, !1, b), te, se, T, b),
                  Oe = this.buildBinary(s, u, t, Se, q, R || j);
                return (
                  ((R && this.type === h.coalesce) ||
                    (j && (this.type === h.logicalOR || this.type === h.logicalAND))) &&
                    this.raiseRecoverable(
                      this.start,
                      "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses",
                    ),
                  this.parseExprOp(Oe, s, u, l, b)
                );
              }
              return t;
            }),
            (c.buildBinary = function (t, s, u, l, b, T) {
              l.type === "PrivateIdentifier" &&
                this.raise(
                  l.start,
                  "Private identifier can only be left side of binary expression",
                );
              var R = this.startNodeAt(t, s);
              return (
                (R.left = u),
                (R.operator = b),
                (R.right = l),
                this.finishNode(R, T ? "LogicalExpression" : "BinaryExpression")
              );
            }),
            (c.parseMaybeUnary = function (t, s, u, l) {
              var b = this.start,
                T = this.startLoc,
                R;
              if (this.isContextual("await") && this.canAwait) (R = this.parseAwait(l)), (s = !0);
              else if (this.type.prefix) {
                var j = this.startNode(),
                  q = this.type === h.incDec;
                (j.operator = this.value),
                  (j.prefix = !0),
                  this.next(),
                  (j.argument = this.parseMaybeUnary(null, !0, q, l)),
                  this.checkExpressionErrors(t, !0),
                  q
                    ? this.checkLValSimple(j.argument)
                    : this.strict && j.operator === "delete" && p(j.argument)
                      ? this.raiseRecoverable(j.start, "Deleting local variable in strict mode")
                      : j.operator === "delete" && m(j.argument)
                        ? this.raiseRecoverable(j.start, "Private fields can not be deleted")
                        : (s = !0),
                  (R = this.finishNode(j, q ? "UpdateExpression" : "UnaryExpression"));
              } else if (!s && this.type === h.privateId)
                (l || this.privateNameStack.length === 0) &&
                  this.options.checkPrivateFields &&
                  this.unexpected(),
                  (R = this.parsePrivateIdent()),
                  this.type !== h._in && this.unexpected();
              else {
                if (((R = this.parseExprSubscripts(t, l)), this.checkExpressionErrors(t))) return R;
                for (; this.type.postfix && !this.canInsertSemicolon(); ) {
                  var te = this.startNodeAt(b, T);
                  (te.operator = this.value),
                    (te.prefix = !1),
                    (te.argument = R),
                    this.checkLValSimple(R),
                    this.next(),
                    (R = this.finishNode(te, "UpdateExpression"));
                }
              }
              if (!u && this.eat(h.starstar))
                if (s) this.unexpected(this.lastTokStart);
                else
                  return this.buildBinary(b, T, R, this.parseMaybeUnary(null, !1, !1, l), "**", !1);
              else return R;
            });
          function p(t) {
            return (
              t.type === "Identifier" || (t.type === "ParenthesizedExpression" && p(t.expression))
            );
          }
          function m(t) {
            return (
              (t.type === "MemberExpression" && t.property.type === "PrivateIdentifier") ||
              (t.type === "ChainExpression" && m(t.expression)) ||
              (t.type === "ParenthesizedExpression" && m(t.expression))
            );
          }
          (c.parseExprSubscripts = function (t, s) {
            var u = this.start,
              l = this.startLoc,
              b = this.parseExprAtom(t, s);
            if (
              b.type === "ArrowFunctionExpression" &&
              this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")"
            )
              return b;
            var T = this.parseSubscripts(b, u, l, !1, s);
            return (
              t &&
                T.type === "MemberExpression" &&
                (t.parenthesizedAssign >= T.start && (t.parenthesizedAssign = -1),
                t.parenthesizedBind >= T.start && (t.parenthesizedBind = -1),
                t.trailingComma >= T.start && (t.trailingComma = -1)),
              T
            );
          }),
            (c.parseSubscripts = function (t, s, u, l, b) {
              for (
                var T =
                    this.options.ecmaVersion >= 8 &&
                    t.type === "Identifier" &&
                    t.name === "async" &&
                    this.lastTokEnd === t.end &&
                    !this.canInsertSemicolon() &&
                    t.end - t.start === 5 &&
                    this.potentialArrowAt === t.start,
                  R = !1;
                ;
              ) {
                var j = this.parseSubscript(t, s, u, l, T, R, b);
                if ((j.optional && (R = !0), j === t || j.type === "ArrowFunctionExpression")) {
                  if (R) {
                    var q = this.startNodeAt(s, u);
                    (q.expression = j), (j = this.finishNode(q, "ChainExpression"));
                  }
                  return j;
                }
                t = j;
              }
            }),
            (c.shouldParseAsyncArrow = function () {
              return !this.canInsertSemicolon() && this.eat(h.arrow);
            }),
            (c.parseSubscriptAsyncArrow = function (t, s, u, l) {
              return this.parseArrowExpression(this.startNodeAt(t, s), u, !0, l);
            }),
            (c.parseSubscript = function (t, s, u, l, b, T, R) {
              var j = this.options.ecmaVersion >= 11,
                q = j && this.eat(h.questionDot);
              l &&
                q &&
                this.raise(
                  this.lastTokStart,
                  "Optional chaining cannot appear in the callee of new expressions",
                );
              var te = this.eat(h.bracketL);
              if (
                te ||
                (q && this.type !== h.parenL && this.type !== h.backQuote) ||
                this.eat(h.dot)
              ) {
                var se = this.startNodeAt(s, u);
                (se.object = t),
                  te
                    ? ((se.property = this.parseExpression()), this.expect(h.bracketR))
                    : this.type === h.privateId && t.type !== "Super"
                      ? (se.property = this.parsePrivateIdent())
                      : (se.property = this.parseIdent(this.options.allowReserved !== "never")),
                  (se.computed = !!te),
                  j && (se.optional = q),
                  (t = this.finishNode(se, "MemberExpression"));
              } else if (!l && this.eat(h.parenL)) {
                var Se = new Me(),
                  Oe = this.yieldPos,
                  Ht = this.awaitPos,
                  Rt = this.awaitIdentPos;
                (this.yieldPos = 0), (this.awaitPos = 0), (this.awaitIdentPos = 0);
                var di = this.parseExprList(h.parenR, this.options.ecmaVersion >= 8, !1, Se);
                if (b && !q && this.shouldParseAsyncArrow())
                  return (
                    this.checkPatternErrors(Se, !1),
                    this.checkYieldAwaitInDefaultParams(),
                    this.awaitIdentPos > 0 &&
                      this.raise(
                        this.awaitIdentPos,
                        "Cannot use 'await' as identifier inside an async function",
                      ),
                    (this.yieldPos = Oe),
                    (this.awaitPos = Ht),
                    (this.awaitIdentPos = Rt),
                    this.parseSubscriptAsyncArrow(s, u, di, R)
                  );
                this.checkExpressionErrors(Se, !0),
                  (this.yieldPos = Oe || this.yieldPos),
                  (this.awaitPos = Ht || this.awaitPos),
                  (this.awaitIdentPos = Rt || this.awaitIdentPos);
                var Ot = this.startNodeAt(s, u);
                (Ot.callee = t),
                  (Ot.arguments = di),
                  j && (Ot.optional = q),
                  (t = this.finishNode(Ot, "CallExpression"));
              } else if (this.type === h.backQuote) {
                (q || T) &&
                  this.raise(
                    this.start,
                    "Optional chaining cannot appear in the tag of tagged template expressions",
                  );
                var Vt = this.startNodeAt(s, u);
                (Vt.tag = t),
                  (Vt.quasi = this.parseTemplate({ isTagged: !0 })),
                  (t = this.finishNode(Vt, "TaggedTemplateExpression"));
              }
              return t;
            }),
            (c.parseExprAtom = function (t, s, u) {
              this.type === h.slash && this.readRegexp();
              var l,
                b = this.potentialArrowAt === this.start;
              switch (this.type) {
                case h._super:
                  return (
                    this.allowSuper || this.raise(this.start, "'super' keyword outside a method"),
                    (l = this.startNode()),
                    this.next(),
                    this.type === h.parenL &&
                      !this.allowDirectSuper &&
                      this.raise(l.start, "super() call outside constructor of a subclass"),
                    this.type !== h.dot &&
                      this.type !== h.bracketL &&
                      this.type !== h.parenL &&
                      this.unexpected(),
                    this.finishNode(l, "Super")
                  );
                case h._this:
                  return (l = this.startNode()), this.next(), this.finishNode(l, "ThisExpression");
                case h.name: {
                  var T = this.start,
                    R = this.startLoc,
                    j = this.containsEsc,
                    q = this.parseIdent(!1);
                  if (
                    this.options.ecmaVersion >= 8 &&
                    !j &&
                    q.name === "async" &&
                    !this.canInsertSemicolon() &&
                    this.eat(h._function)
                  )
                    return (
                      this.overrideContext(xe.f_expr),
                      this.parseFunction(this.startNodeAt(T, R), 0, !1, !0, s)
                    );
                  if (b && !this.canInsertSemicolon()) {
                    if (this.eat(h.arrow))
                      return this.parseArrowExpression(this.startNodeAt(T, R), [q], !1, s);
                    if (
                      this.options.ecmaVersion >= 8 &&
                      q.name === "async" &&
                      this.type === h.name &&
                      !j &&
                      (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)
                    )
                      return (
                        (q = this.parseIdent(!1)),
                        (this.canInsertSemicolon() || !this.eat(h.arrow)) && this.unexpected(),
                        this.parseArrowExpression(this.startNodeAt(T, R), [q], !0, s)
                      );
                  }
                  return q;
                }
                case h.regexp: {
                  var te = this.value;
                  return (
                    (l = this.parseLiteral(te.value)),
                    (l.regex = { pattern: te.pattern, flags: te.flags }),
                    l
                  );
                }
                case h.num:
                case h.string:
                  return this.parseLiteral(this.value);
                case h._null:
                case h._true:
                case h._false:
                  return (
                    (l = this.startNode()),
                    (l.value = this.type === h._null ? null : this.type === h._true),
                    (l.raw = this.type.keyword),
                    this.next(),
                    this.finishNode(l, "Literal")
                  );
                case h.parenL: {
                  var se = this.start,
                    Se = this.parseParenAndDistinguishExpression(b, s);
                  return (
                    t &&
                      (t.parenthesizedAssign < 0 &&
                        !this.isSimpleAssignTarget(Se) &&
                        (t.parenthesizedAssign = se),
                      t.parenthesizedBind < 0 && (t.parenthesizedBind = se)),
                    Se
                  );
                }
                case h.bracketL:
                  return (
                    (l = this.startNode()),
                    this.next(),
                    (l.elements = this.parseExprList(h.bracketR, !0, !0, t)),
                    this.finishNode(l, "ArrayExpression")
                  );
                case h.braceL:
                  return this.overrideContext(xe.b_expr), this.parseObj(!1, t);
                case h._function:
                  return (l = this.startNode()), this.next(), this.parseFunction(l, 0);
                case h._class:
                  return this.parseClass(this.startNode(), !1);
                case h._new:
                  return this.parseNew();
                case h.backQuote:
                  return this.parseTemplate();
                case h._import:
                  return this.options.ecmaVersion >= 11
                    ? this.parseExprImport(u)
                    : this.unexpected();
                default:
                  return this.parseExprAtomDefault();
              }
            }),
            (c.parseExprAtomDefault = function () {
              this.unexpected();
            }),
            (c.parseExprImport = function (t) {
              var s = this.startNode();
              if (
                (this.containsEsc &&
                  this.raiseRecoverable(this.start, "Escape sequence in keyword import"),
                this.next(),
                this.type === h.parenL && !t)
              )
                return this.parseDynamicImport(s);
              if (this.type === h.dot) {
                var u = this.startNodeAt(s.start, s.loc && s.loc.start);
                return (
                  (u.name = "import"),
                  (s.meta = this.finishNode(u, "Identifier")),
                  this.parseImportMeta(s)
                );
              } else this.unexpected();
            }),
            (c.parseDynamicImport = function (t) {
              if (
                (this.next(), (t.source = this.parseMaybeAssign()), this.options.ecmaVersion >= 16)
              )
                this.eat(h.parenR)
                  ? (t.options = null)
                  : (this.expect(h.comma),
                    this.afterTrailingComma(h.parenR)
                      ? (t.options = null)
                      : ((t.options = this.parseMaybeAssign()),
                        this.eat(h.parenR) ||
                          (this.expect(h.comma),
                          this.afterTrailingComma(h.parenR) || this.unexpected())));
              else if (!this.eat(h.parenR)) {
                var s = this.start;
                this.eat(h.comma) && this.eat(h.parenR)
                  ? this.raiseRecoverable(s, "Trailing comma is not allowed in import()")
                  : this.unexpected(s);
              }
              return this.finishNode(t, "ImportExpression");
            }),
            (c.parseImportMeta = function (t) {
              this.next();
              var s = this.containsEsc;
              return (
                (t.property = this.parseIdent(!0)),
                t.property.name !== "meta" &&
                  this.raiseRecoverable(
                    t.property.start,
                    "The only valid meta property for import is 'import.meta'",
                  ),
                s &&
                  this.raiseRecoverable(
                    t.start,
                    "'import.meta' must not contain escaped characters",
                  ),
                this.options.sourceType !== "module" &&
                  !this.options.allowImportExportEverywhere &&
                  this.raiseRecoverable(t.start, "Cannot use 'import.meta' outside a module"),
                this.finishNode(t, "MetaProperty")
              );
            }),
            (c.parseLiteral = function (t) {
              var s = this.startNode();
              return (
                (s.value = t),
                (s.raw = this.input.slice(this.start, this.end)),
                s.raw.charCodeAt(s.raw.length - 1) === 110 &&
                  (s.bigint =
                    s.value != null ? s.value.toString() : s.raw.slice(0, -1).replace(/_/g, "")),
                this.next(),
                this.finishNode(s, "Literal")
              );
            }),
            (c.parseParenExpression = function () {
              this.expect(h.parenL);
              var t = this.parseExpression();
              return this.expect(h.parenR), t;
            }),
            (c.shouldParseArrow = function (t) {
              return !this.canInsertSemicolon();
            }),
            (c.parseParenAndDistinguishExpression = function (t, s) {
              var u = this.start,
                l = this.startLoc,
                b,
                T = this.options.ecmaVersion >= 8;
              if (this.options.ecmaVersion >= 6) {
                this.next();
                var R = this.start,
                  j = this.startLoc,
                  q = [],
                  te = !0,
                  se = !1,
                  Se = new Me(),
                  Oe = this.yieldPos,
                  Ht = this.awaitPos,
                  Rt;
                for (this.yieldPos = 0, this.awaitPos = 0; this.type !== h.parenR; )
                  if (
                    (te ? (te = !1) : this.expect(h.comma),
                    T && this.afterTrailingComma(h.parenR, !0))
                  ) {
                    se = !0;
                    break;
                  } else if (this.type === h.ellipsis) {
                    (Rt = this.start),
                      q.push(this.parseParenItem(this.parseRestBinding())),
                      this.type === h.comma &&
                        this.raiseRecoverable(
                          this.start,
                          "Comma is not permitted after the rest element",
                        );
                    break;
                  } else q.push(this.parseMaybeAssign(!1, Se, this.parseParenItem));
                var di = this.lastTokEnd,
                  Ot = this.lastTokEndLoc;
                if ((this.expect(h.parenR), t && this.shouldParseArrow(q) && this.eat(h.arrow)))
                  return (
                    this.checkPatternErrors(Se, !1),
                    this.checkYieldAwaitInDefaultParams(),
                    (this.yieldPos = Oe),
                    (this.awaitPos = Ht),
                    this.parseParenArrowList(u, l, q, s)
                  );
                (!q.length || se) && this.unexpected(this.lastTokStart),
                  Rt && this.unexpected(Rt),
                  this.checkExpressionErrors(Se, !0),
                  (this.yieldPos = Oe || this.yieldPos),
                  (this.awaitPos = Ht || this.awaitPos),
                  q.length > 1
                    ? ((b = this.startNodeAt(R, j)),
                      (b.expressions = q),
                      this.finishNodeAt(b, "SequenceExpression", di, Ot))
                    : (b = q[0]);
              } else b = this.parseParenExpression();
              if (this.options.preserveParens) {
                var Vt = this.startNodeAt(u, l);
                return (Vt.expression = b), this.finishNode(Vt, "ParenthesizedExpression");
              } else return b;
            }),
            (c.parseParenItem = (t) => t),
            (c.parseParenArrowList = function (t, s, u, l) {
              return this.parseArrowExpression(this.startNodeAt(t, s), u, !1, l);
            });
          var S = [];
          (c.parseNew = function () {
            this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
            var t = this.startNode();
            if ((this.next(), this.options.ecmaVersion >= 6 && this.type === h.dot)) {
              var s = this.startNodeAt(t.start, t.loc && t.loc.start);
              (s.name = "new"), (t.meta = this.finishNode(s, "Identifier")), this.next();
              var u = this.containsEsc;
              return (
                (t.property = this.parseIdent(!0)),
                t.property.name !== "target" &&
                  this.raiseRecoverable(
                    t.property.start,
                    "The only valid meta property for new is 'new.target'",
                  ),
                u &&
                  this.raiseRecoverable(
                    t.start,
                    "'new.target' must not contain escaped characters",
                  ),
                this.allowNewDotTarget ||
                  this.raiseRecoverable(
                    t.start,
                    "'new.target' can only be used in functions and class static block",
                  ),
                this.finishNode(t, "MetaProperty")
              );
            }
            var l = this.start,
              b = this.startLoc;
            return (
              (t.callee = this.parseSubscripts(this.parseExprAtom(null, !1, !0), l, b, !0, !1)),
              this.eat(h.parenL)
                ? (t.arguments = this.parseExprList(h.parenR, this.options.ecmaVersion >= 8, !1))
                : (t.arguments = S),
              this.finishNode(t, "NewExpression")
            );
          }),
            (c.parseTemplateElement = function (t) {
              var s = t.isTagged,
                u = this.startNode();
              return (
                this.type === h.invalidTemplate
                  ? (s ||
                      this.raiseRecoverable(
                        this.start,
                        "Bad escape sequence in untagged template literal",
                      ),
                    (u.value = {
                      raw: this.value.replace(
                        /\r\n?/g,
                        `
`,
                      ),
                      cooked: null,
                    }))
                  : (u.value = {
                      raw: this.input.slice(this.start, this.end).replace(
                        /\r\n?/g,
                        `
`,
                      ),
                      cooked: this.value,
                    }),
                this.next(),
                (u.tail = this.type === h.backQuote),
                this.finishNode(u, "TemplateElement")
              );
            }),
            (c.parseTemplate = function (t) {
              t === void 0 && (t = {});
              var s = t.isTagged;
              s === void 0 && (s = !1);
              var u = this.startNode();
              this.next(), (u.expressions = []);
              var l = this.parseTemplateElement({ isTagged: s });
              for (u.quasis = [l]; !l.tail; )
                this.type === h.eof && this.raise(this.pos, "Unterminated template literal"),
                  this.expect(h.dollarBraceL),
                  u.expressions.push(this.parseExpression()),
                  this.expect(h.braceR),
                  u.quasis.push((l = this.parseTemplateElement({ isTagged: s })));
              return this.next(), this.finishNode(u, "TemplateLiteral");
            }),
            (c.isAsyncProp = function (t) {
              return (
                !t.computed &&
                t.key.type === "Identifier" &&
                t.key.name === "async" &&
                (this.type === h.name ||
                  this.type === h.num ||
                  this.type === h.string ||
                  this.type === h.bracketL ||
                  this.type.keyword ||
                  (this.options.ecmaVersion >= 9 && this.type === h.star)) &&
                !I.test(this.input.slice(this.lastTokEnd, this.start))
              );
            }),
            (c.parseObj = function (t, s) {
              var u = this.startNode(),
                l = !0,
                b = {};
              for (u.properties = [], this.next(); !this.eat(h.braceR); ) {
                if (l) l = !1;
                else if (
                  (this.expect(h.comma),
                  this.options.ecmaVersion >= 5 && this.afterTrailingComma(h.braceR))
                )
                  break;
                var T = this.parseProperty(t, s);
                t || this.checkPropClash(T, b, s), u.properties.push(T);
              }
              return this.finishNode(u, t ? "ObjectPattern" : "ObjectExpression");
            }),
            (c.parseProperty = function (t, s) {
              var u = this.startNode(),
                l,
                b,
                T,
                R;
              if (this.options.ecmaVersion >= 9 && this.eat(h.ellipsis))
                return t
                  ? ((u.argument = this.parseIdent(!1)),
                    this.type === h.comma &&
                      this.raiseRecoverable(
                        this.start,
                        "Comma is not permitted after the rest element",
                      ),
                    this.finishNode(u, "RestElement"))
                  : ((u.argument = this.parseMaybeAssign(!1, s)),
                    this.type === h.comma &&
                      s &&
                      s.trailingComma < 0 &&
                      (s.trailingComma = this.start),
                    this.finishNode(u, "SpreadElement"));
              this.options.ecmaVersion >= 6 &&
                ((u.method = !1),
                (u.shorthand = !1),
                (t || s) && ((T = this.start), (R = this.startLoc)),
                t || (l = this.eat(h.star)));
              var j = this.containsEsc;
              return (
                this.parsePropertyName(u),
                !t && !j && this.options.ecmaVersion >= 8 && !l && this.isAsyncProp(u)
                  ? ((b = !0),
                    (l = this.options.ecmaVersion >= 9 && this.eat(h.star)),
                    this.parsePropertyName(u))
                  : (b = !1),
                this.parsePropertyValue(u, t, l, b, T, R, s, j),
                this.finishNode(u, "Property")
              );
            }),
            (c.parseGetterSetter = function (t) {
              var s = t.key.name;
              this.parsePropertyName(t), (t.value = this.parseMethod(!1)), (t.kind = s);
              var u = t.kind === "get" ? 0 : 1;
              if (t.value.params.length !== u) {
                var l = t.value.start;
                t.kind === "get"
                  ? this.raiseRecoverable(l, "getter should have no params")
                  : this.raiseRecoverable(l, "setter should have exactly one param");
              } else
                t.kind === "set" &&
                  t.value.params[0].type === "RestElement" &&
                  this.raiseRecoverable(t.value.params[0].start, "Setter cannot use rest params");
            }),
            (c.parsePropertyValue = function (t, s, u, l, b, T, R, j) {
              (u || l) && this.type === h.colon && this.unexpected(),
                this.eat(h.colon)
                  ? ((t.value = s
                      ? this.parseMaybeDefault(this.start, this.startLoc)
                      : this.parseMaybeAssign(!1, R)),
                    (t.kind = "init"))
                  : this.options.ecmaVersion >= 6 && this.type === h.parenL
                    ? (s && this.unexpected(),
                      (t.method = !0),
                      (t.value = this.parseMethod(u, l)),
                      (t.kind = "init"))
                    : !s &&
                        !j &&
                        this.options.ecmaVersion >= 5 &&
                        !t.computed &&
                        t.key.type === "Identifier" &&
                        (t.key.name === "get" || t.key.name === "set") &&
                        this.type !== h.comma &&
                        this.type !== h.braceR &&
                        this.type !== h.eq
                      ? ((u || l) && this.unexpected(), this.parseGetterSetter(t))
                      : this.options.ecmaVersion >= 6 && !t.computed && t.key.type === "Identifier"
                        ? ((u || l) && this.unexpected(),
                          this.checkUnreserved(t.key),
                          t.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = b),
                          s
                            ? (t.value = this.parseMaybeDefault(b, T, this.copyNode(t.key)))
                            : this.type === h.eq && R
                              ? (R.shorthandAssign < 0 && (R.shorthandAssign = this.start),
                                (t.value = this.parseMaybeDefault(b, T, this.copyNode(t.key))))
                              : (t.value = this.copyNode(t.key)),
                          (t.kind = "init"),
                          (t.shorthand = !0))
                        : this.unexpected();
            }),
            (c.parsePropertyName = function (t) {
              if (this.options.ecmaVersion >= 6) {
                if (this.eat(h.bracketL))
                  return (
                    (t.computed = !0),
                    (t.key = this.parseMaybeAssign()),
                    this.expect(h.bracketR),
                    t.key
                  );
                t.computed = !1;
              }
              return (t.key =
                this.type === h.num || this.type === h.string
                  ? this.parseExprAtom()
                  : this.parseIdent(this.options.allowReserved !== "never"));
            }),
            (c.initFunction = function (t) {
              (t.id = null),
                this.options.ecmaVersion >= 6 && (t.generator = t.expression = !1),
                this.options.ecmaVersion >= 8 && (t.async = !1);
            }),
            (c.parseMethod = function (t, s, u) {
              var l = this.startNode(),
                b = this.yieldPos,
                T = this.awaitPos,
                R = this.awaitIdentPos;
              return (
                this.initFunction(l),
                this.options.ecmaVersion >= 6 && (l.generator = t),
                this.options.ecmaVersion >= 8 && (l.async = !!s),
                (this.yieldPos = 0),
                (this.awaitPos = 0),
                (this.awaitIdentPos = 0),
                this.enterScope(Ut(s, l.generator) | St | (u ? _t : 0)),
                this.expect(h.parenL),
                (l.params = this.parseBindingList(h.parenR, !1, this.options.ecmaVersion >= 8)),
                this.checkYieldAwaitInDefaultParams(),
                this.parseFunctionBody(l, !1, !0, !1),
                (this.yieldPos = b),
                (this.awaitPos = T),
                (this.awaitIdentPos = R),
                this.finishNode(l, "FunctionExpression")
              );
            }),
            (c.parseArrowExpression = function (t, s, u, l) {
              var b = this.yieldPos,
                T = this.awaitPos,
                R = this.awaitIdentPos;
              return (
                this.enterScope(Ut(u, !1) | qt),
                this.initFunction(t),
                this.options.ecmaVersion >= 8 && (t.async = !!u),
                (this.yieldPos = 0),
                (this.awaitPos = 0),
                (this.awaitIdentPos = 0),
                (t.params = this.toAssignableList(s, !0)),
                this.parseFunctionBody(t, !0, !1, l),
                (this.yieldPos = b),
                (this.awaitPos = T),
                (this.awaitIdentPos = R),
                this.finishNode(t, "ArrowFunctionExpression")
              );
            }),
            (c.parseFunctionBody = function (t, s, u, l) {
              var b = s && this.type !== h.braceL,
                T = this.strict,
                R = !1;
              if (b)
                (t.body = this.parseMaybeAssign(l)), (t.expression = !0), this.checkParams(t, !1);
              else {
                var j = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(t.params);
                (!T || j) &&
                  ((R = this.strictDirective(this.end)),
                  R &&
                    j &&
                    this.raiseRecoverable(
                      t.start,
                      "Illegal 'use strict' directive in function with non-simple parameter list",
                    ));
                var q = this.labels;
                (this.labels = []),
                  R && (this.strict = !0),
                  this.checkParams(t, !T && !R && !s && !u && this.isSimpleParamList(t.params)),
                  this.strict && t.id && this.checkLValSimple(t.id, $),
                  (t.body = this.parseBlock(!1, void 0, R && !T)),
                  (t.expression = !1),
                  this.adaptDirectivePrologue(t.body.body),
                  (this.labels = q);
              }
              this.exitScope();
            }),
            (c.isSimpleParamList = (t) => {
              for (var s = 0, u = t; s < u.length; s += 1) {
                var l = u[s];
                if (l.type !== "Identifier") return !1;
              }
              return !0;
            }),
            (c.checkParams = function (t, s) {
              for (var u = Object.create(null), l = 0, b = t.params; l < b.length; l += 1) {
                var T = b[l];
                this.checkLValInnerPattern(T, Gt, s ? null : u);
              }
            }),
            (c.parseExprList = function (t, s, u, l) {
              for (var b = [], T = !0; !this.eat(t); ) {
                if (T) T = !1;
                else if ((this.expect(h.comma), s && this.afterTrailingComma(t))) break;
                var R = void 0;
                u && this.type === h.comma
                  ? (R = null)
                  : this.type === h.ellipsis
                    ? ((R = this.parseSpread(l)),
                      l &&
                        this.type === h.comma &&
                        l.trailingComma < 0 &&
                        (l.trailingComma = this.start))
                    : (R = this.parseMaybeAssign(!1, l)),
                  b.push(R);
              }
              return b;
            }),
            (c.checkUnreserved = function (t) {
              var s = t.start,
                u = t.end,
                l = t.name;
              if (
                (this.inGenerator &&
                  l === "yield" &&
                  this.raiseRecoverable(s, "Cannot use 'yield' as identifier inside a generator"),
                this.inAsync &&
                  l === "await" &&
                  this.raiseRecoverable(
                    s,
                    "Cannot use 'await' as identifier inside an async function",
                  ),
                !(this.currentThisScope().flags & Nt) &&
                  l === "arguments" &&
                  this.raiseRecoverable(s, "Cannot use 'arguments' in class field initializer"),
                this.inClassStaticBlock &&
                  (l === "arguments" || l === "await") &&
                  this.raise(s, "Cannot use " + l + " in class static initialization block"),
                this.keywords.test(l) && this.raise(s, "Unexpected keyword '" + l + "'"),
                !(this.options.ecmaVersion < 6 && this.input.slice(s, u).indexOf("\\") !== -1))
              ) {
                var b = this.strict ? this.reservedWordsStrict : this.reservedWords;
                b.test(l) &&
                  (!this.inAsync &&
                    l === "await" &&
                    this.raiseRecoverable(
                      s,
                      "Cannot use keyword 'await' outside an async function",
                    ),
                  this.raiseRecoverable(s, "The keyword '" + l + "' is reserved"));
              }
            }),
            (c.parseIdent = function (t) {
              var s = this.parseIdentNode();
              return (
                this.next(!!t),
                this.finishNode(s, "Identifier"),
                t ||
                  (this.checkUnreserved(s),
                  s.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = s.start)),
                s
              );
            }),
            (c.parseIdentNode = function () {
              var t = this.startNode();
              return (
                this.type === h.name
                  ? (t.name = this.value)
                  : this.type.keyword
                    ? ((t.name = this.type.keyword),
                      (t.name === "class" || t.name === "function") &&
                        (this.lastTokEnd !== this.lastTokStart + 1 ||
                          this.input.charCodeAt(this.lastTokStart) !== 46) &&
                        this.context.pop(),
                      (this.type = h.name))
                    : this.unexpected(),
                t
              );
            }),
            (c.parsePrivateIdent = function () {
              var t = this.startNode();
              return (
                this.type === h.privateId ? (t.name = this.value) : this.unexpected(),
                this.next(),
                this.finishNode(t, "PrivateIdentifier"),
                this.options.checkPrivateFields &&
                  (this.privateNameStack.length === 0
                    ? this.raise(
                        t.start,
                        "Private field '#" + t.name + "' must be declared in an enclosing class",
                      )
                    : this.privateNameStack[this.privateNameStack.length - 1].used.push(t)),
                t
              );
            }),
            (c.parseYield = function (t) {
              this.yieldPos || (this.yieldPos = this.start);
              var s = this.startNode();
              return (
                this.next(),
                this.type === h.semi ||
                this.canInsertSemicolon() ||
                (this.type !== h.star && !this.type.startsExpr)
                  ? ((s.delegate = !1), (s.argument = null))
                  : ((s.delegate = this.eat(h.star)), (s.argument = this.parseMaybeAssign(t))),
                this.finishNode(s, "YieldExpression")
              );
            }),
            (c.parseAwait = function (t) {
              this.awaitPos || (this.awaitPos = this.start);
              var s = this.startNode();
              return (
                this.next(),
                (s.argument = this.parseMaybeUnary(null, !0, !1, t)),
                this.finishNode(s, "AwaitExpression")
              );
            });
          var O = ne.prototype;
          (O.raise = function (t, s) {
            var u = dt(this.input, t);
            (s += " (" + u.line + ":" + u.column + ")"),
              this.sourceFile && (s += " in " + this.sourceFile);
            var l = new SyntaxError(s);
            throw ((l.pos = t), (l.loc = u), (l.raisedAt = this.pos), l);
          }),
            (O.raiseRecoverable = O.raise),
            (O.curPosition = function () {
              if (this.options.locations) return new W(this.curLine, this.pos - this.lineStart);
            });
          var F = ne.prototype,
            D = function (s) {
              (this.flags = s), (this.var = []), (this.lexical = []), (this.functions = []);
            };
          (F.enterScope = function (t) {
            this.scopeStack.push(new D(t));
          }),
            (F.exitScope = function () {
              this.scopeStack.pop();
            }),
            (F.treatFunctionsAsVarInScope = function (t) {
              return t.flags & rt || (!this.inModule && t.flags & it);
            }),
            (F.declareName = function (t, s, u) {
              var l = !1;
              if (s === ze) {
                var b = this.currentScope();
                (l =
                  b.lexical.indexOf(t) > -1 ||
                  b.functions.indexOf(t) > -1 ||
                  b.var.indexOf(t) > -1),
                  b.lexical.push(t),
                  this.inModule && b.flags & it && delete this.undefinedExports[t];
              } else if (s === Pe) {
                var T = this.currentScope();
                T.lexical.push(t);
              } else if (s === fe) {
                var R = this.currentScope();
                this.treatFunctionsAsVar
                  ? (l = R.lexical.indexOf(t) > -1)
                  : (l = R.lexical.indexOf(t) > -1 || R.var.indexOf(t) > -1),
                  R.functions.push(t);
              } else
                for (var j = this.scopeStack.length - 1; j >= 0; --j) {
                  var q = this.scopeStack[j];
                  if (
                    (q.lexical.indexOf(t) > -1 && !(q.flags & Ie && q.lexical[0] === t)) ||
                    (!this.treatFunctionsAsVarInScope(q) && q.functions.indexOf(t) > -1)
                  ) {
                    l = !0;
                    break;
                  }
                  if (
                    (q.var.push(t),
                    this.inModule && q.flags & it && delete this.undefinedExports[t],
                    q.flags & Nt)
                  )
                    break;
                }
              l && this.raiseRecoverable(u, "Identifier '" + t + "' has already been declared");
            }),
            (F.checkLocalExport = function (t) {
              this.scopeStack[0].lexical.indexOf(t.name) === -1 &&
                this.scopeStack[0].var.indexOf(t.name) === -1 &&
                (this.undefinedExports[t.name] = t);
            }),
            (F.currentScope = function () {
              return this.scopeStack[this.scopeStack.length - 1];
            }),
            (F.currentVarScope = function () {
              for (var t = this.scopeStack.length - 1; ; t--) {
                var s = this.scopeStack[t];
                if (s.flags & (Nt | mt | st)) return s;
              }
            }),
            (F.currentThisScope = function () {
              for (var t = this.scopeStack.length - 1; ; t--) {
                var s = this.scopeStack[t];
                if (s.flags & (Nt | mt | st) && !(s.flags & qt)) return s;
              }
            });
          var z = function (s, u, l) {
              (this.type = ""),
                (this.start = u),
                (this.end = 0),
                s.options.locations && (this.loc = new je(s, l)),
                s.options.directSourceFile && (this.sourceFile = s.options.directSourceFile),
                s.options.ranges && (this.range = [u, 0]);
            },
            re = ne.prototype;
          (re.startNode = function () {
            return new z(this, this.start, this.startLoc);
          }),
            (re.startNodeAt = function (t, s) {
              return new z(this, t, s);
            });
          function Ee(t, s, u, l) {
            return (
              (t.type = s),
              (t.end = u),
              this.options.locations && (t.loc.end = l),
              this.options.ranges && (t.range[1] = u),
              t
            );
          }
          (re.finishNode = function (t, s) {
            return Ee.call(this, t, s, this.lastTokEnd, this.lastTokEndLoc);
          }),
            (re.finishNodeAt = function (t, s, u, l) {
              return Ee.call(this, t, s, u, l);
            }),
            (re.copyNode = function (t) {
              var s = new z(this, t.start, this.startLoc);
              for (var u in t) s[u] = t[u];
              return s;
            });
          var at =
              "Berf Beria_Erfe Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sidetic Sidt Sunu Sunuwar Tai_Yo Tayo Todhri Todr Tolong_Siki Tols Tulu_Tigalari Tutg Unknown Zzzz",
            ot =
              "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS",
            Wt = ot + " Extended_Pictographic",
            zt = Wt,
            Ue = zt + " EBase EComp EMod EPres ExtPict",
            Cr = Ue,
            Fn = Cr,
            Bn = { 9: ot, 10: Wt, 11: zt, 12: Ue, 13: Cr, 14: Fn },
            Mn =
              "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji",
            Dn = { 9: "", 10: "", 11: "", 12: "", 13: "", 14: Mn },
            Er =
              "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu",
            wr =
              "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb",
            kr =
              wr +
              " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd",
            Ar = kr + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho",
            Ir = Ar + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi",
            Pr = Ir + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith",
            jn = Pr + " " + at,
            qn = { 9: wr, 10: kr, 11: Ar, 12: Ir, 13: Pr, 14: jn },
            Tr = {};
          function Un(t) {
            var s = (Tr[t] = {
              binary: we(Bn[t] + " " + Er),
              binaryOfStrings: we(Dn[t]),
              nonBinary: { General_Category: we(Er), Script: we(qn[t]) },
            });
            (s.nonBinary.Script_Extensions = s.nonBinary.Script),
              (s.nonBinary.gc = s.nonBinary.General_Category),
              (s.nonBinary.sc = s.nonBinary.Script),
              (s.nonBinary.scx = s.nonBinary.Script_Extensions);
          }
          for (var Ti = 0, Nr = [9, 10, 11, 12, 13, 14]; Ti < Nr.length; Ti += 1) {
            var Gn = Nr[Ti];
            Un(Gn);
          }
          var Y = ne.prototype,
            ci = function (s, u) {
              (this.parent = s), (this.base = u || this);
            };
          (ci.prototype.separatedFrom = function (s) {
            for (var u = this; u; u = u.parent)
              for (var l = s; l; l = l.parent) if (u.base === l.base && u !== l) return !0;
            return !1;
          }),
            (ci.prototype.sibling = function () {
              return new ci(this.parent, this.base);
            });
          var et = function (s) {
            (this.parser = s),
              (this.validFlags =
                "gim" +
                (s.options.ecmaVersion >= 6 ? "uy" : "") +
                (s.options.ecmaVersion >= 9 ? "s" : "") +
                (s.options.ecmaVersion >= 13 ? "d" : "") +
                (s.options.ecmaVersion >= 15 ? "v" : "")),
              (this.unicodeProperties =
                Tr[s.options.ecmaVersion >= 14 ? 14 : s.options.ecmaVersion]),
              (this.source = ""),
              (this.flags = ""),
              (this.start = 0),
              (this.switchU = !1),
              (this.switchV = !1),
              (this.switchN = !1),
              (this.pos = 0),
              (this.lastIntValue = 0),
              (this.lastStringValue = ""),
              (this.lastAssertionIsQuantifiable = !1),
              (this.numCapturingParens = 0),
              (this.maxBackReference = 0),
              (this.groupNames = Object.create(null)),
              (this.backReferenceNames = []),
              (this.branchID = null);
          };
          (et.prototype.reset = function (s, u, l) {
            var b = l.indexOf("v") !== -1,
              T = l.indexOf("u") !== -1;
            (this.start = s | 0),
              (this.source = u + ""),
              (this.flags = l),
              b && this.parser.options.ecmaVersion >= 15
                ? ((this.switchU = !0), (this.switchV = !0), (this.switchN = !0))
                : ((this.switchU = T && this.parser.options.ecmaVersion >= 6),
                  (this.switchV = !1),
                  (this.switchN = T && this.parser.options.ecmaVersion >= 9));
          }),
            (et.prototype.raise = function (s) {
              this.parser.raiseRecoverable(
                this.start,
                "Invalid regular expression: /" + this.source + "/: " + s,
              );
            }),
            (et.prototype.at = function (s, u) {
              u === void 0 && (u = !1);
              var l = this.source,
                b = l.length;
              if (s >= b) return -1;
              var T = l.charCodeAt(s);
              if (!(u || this.switchU) || T <= 55295 || T >= 57344 || s + 1 >= b) return T;
              var R = l.charCodeAt(s + 1);
              return R >= 56320 && R <= 57343 ? (T << 10) + R - 56613888 : T;
            }),
            (et.prototype.nextIndex = function (s, u) {
              u === void 0 && (u = !1);
              var l = this.source,
                b = l.length;
              if (s >= b) return b;
              var T = l.charCodeAt(s),
                R;
              return !(u || this.switchU) ||
                T <= 55295 ||
                T >= 57344 ||
                s + 1 >= b ||
                (R = l.charCodeAt(s + 1)) < 56320 ||
                R > 57343
                ? s + 1
                : s + 2;
            }),
            (et.prototype.current = function (s) {
              return s === void 0 && (s = !1), this.at(this.pos, s);
            }),
            (et.prototype.lookahead = function (s) {
              return s === void 0 && (s = !1), this.at(this.nextIndex(this.pos, s), s);
            }),
            (et.prototype.advance = function (s) {
              s === void 0 && (s = !1), (this.pos = this.nextIndex(this.pos, s));
            }),
            (et.prototype.eat = function (s, u) {
              return u === void 0 && (u = !1), this.current(u) === s ? (this.advance(u), !0) : !1;
            }),
            (et.prototype.eatChars = function (s, u) {
              u === void 0 && (u = !1);
              for (var l = this.pos, b = 0, T = s; b < T.length; b += 1) {
                var R = T[b],
                  j = this.at(l, u);
                if (j === -1 || j !== R) return !1;
                l = this.nextIndex(l, u);
              }
              return (this.pos = l), !0;
            }),
            (Y.validateRegExpFlags = function (t) {
              for (var s = t.validFlags, u = t.flags, l = !1, b = !1, T = 0; T < u.length; T++) {
                var R = u.charAt(T);
                s.indexOf(R) === -1 && this.raise(t.start, "Invalid regular expression flag"),
                  u.indexOf(R, T + 1) > -1 &&
                    this.raise(t.start, "Duplicate regular expression flag"),
                  R === "u" && (l = !0),
                  R === "v" && (b = !0);
              }
              this.options.ecmaVersion >= 15 &&
                l &&
                b &&
                this.raise(t.start, "Invalid regular expression flag");
            });
          function Wn(t) {
            for (var s in t) return !0;
            return !1;
          }
          (Y.validateRegExpPattern = function (t) {
            this.regexp_pattern(t),
              !t.switchN &&
                this.options.ecmaVersion >= 9 &&
                Wn(t.groupNames) &&
                ((t.switchN = !0), this.regexp_pattern(t));
          }),
            (Y.regexp_pattern = function (t) {
              (t.pos = 0),
                (t.lastIntValue = 0),
                (t.lastStringValue = ""),
                (t.lastAssertionIsQuantifiable = !1),
                (t.numCapturingParens = 0),
                (t.maxBackReference = 0),
                (t.groupNames = Object.create(null)),
                (t.backReferenceNames.length = 0),
                (t.branchID = null),
                this.regexp_disjunction(t),
                t.pos !== t.source.length &&
                  (t.eat(41) && t.raise("Unmatched ')'"),
                  (t.eat(93) || t.eat(125)) && t.raise("Lone quantifier brackets")),
                t.maxBackReference > t.numCapturingParens && t.raise("Invalid escape");
              for (var s = 0, u = t.backReferenceNames; s < u.length; s += 1) {
                var l = u[s];
                t.groupNames[l] || t.raise("Invalid named capture referenced");
              }
            }),
            (Y.regexp_disjunction = function (t) {
              var s = this.options.ecmaVersion >= 16;
              for (
                s && (t.branchID = new ci(t.branchID, null)), this.regexp_alternative(t);
                t.eat(124);
              )
                s && (t.branchID = t.branchID.sibling()), this.regexp_alternative(t);
              s && (t.branchID = t.branchID.parent),
                this.regexp_eatQuantifier(t, !0) && t.raise("Nothing to repeat"),
                t.eat(123) && t.raise("Lone quantifier brackets");
            }),
            (Y.regexp_alternative = function (t) {
              for (; t.pos < t.source.length && this.regexp_eatTerm(t); );
            }),
            (Y.regexp_eatTerm = function (t) {
              return this.regexp_eatAssertion(t)
                ? (t.lastAssertionIsQuantifiable &&
                    this.regexp_eatQuantifier(t) &&
                    t.switchU &&
                    t.raise("Invalid quantifier"),
                  !0)
                : (t.switchU ? this.regexp_eatAtom(t) : this.regexp_eatExtendedAtom(t))
                  ? (this.regexp_eatQuantifier(t), !0)
                  : !1;
            }),
            (Y.regexp_eatAssertion = function (t) {
              var s = t.pos;
              if (((t.lastAssertionIsQuantifiable = !1), t.eat(94) || t.eat(36))) return !0;
              if (t.eat(92)) {
                if (t.eat(66) || t.eat(98)) return !0;
                t.pos = s;
              }
              if (t.eat(40) && t.eat(63)) {
                var u = !1;
                if ((this.options.ecmaVersion >= 9 && (u = t.eat(60)), t.eat(61) || t.eat(33)))
                  return (
                    this.regexp_disjunction(t),
                    t.eat(41) || t.raise("Unterminated group"),
                    (t.lastAssertionIsQuantifiable = !u),
                    !0
                  );
              }
              return (t.pos = s), !1;
            }),
            (Y.regexp_eatQuantifier = function (t, s) {
              return (
                s === void 0 && (s = !1),
                this.regexp_eatQuantifierPrefix(t, s) ? (t.eat(63), !0) : !1
              );
            }),
            (Y.regexp_eatQuantifierPrefix = function (t, s) {
              return t.eat(42) || t.eat(43) || t.eat(63) || this.regexp_eatBracedQuantifier(t, s);
            }),
            (Y.regexp_eatBracedQuantifier = function (t, s) {
              var u = t.pos;
              if (t.eat(123)) {
                var l = 0,
                  b = -1;
                if (
                  this.regexp_eatDecimalDigits(t) &&
                  ((l = t.lastIntValue),
                  t.eat(44) && this.regexp_eatDecimalDigits(t) && (b = t.lastIntValue),
                  t.eat(125))
                )
                  return (
                    b !== -1 && b < l && !s && t.raise("numbers out of order in {} quantifier"), !0
                  );
                t.switchU && !s && t.raise("Incomplete quantifier"), (t.pos = u);
              }
              return !1;
            }),
            (Y.regexp_eatAtom = function (t) {
              return (
                this.regexp_eatPatternCharacters(t) ||
                t.eat(46) ||
                this.regexp_eatReverseSolidusAtomEscape(t) ||
                this.regexp_eatCharacterClass(t) ||
                this.regexp_eatUncapturingGroup(t) ||
                this.regexp_eatCapturingGroup(t)
              );
            }),
            (Y.regexp_eatReverseSolidusAtomEscape = function (t) {
              var s = t.pos;
              if (t.eat(92)) {
                if (this.regexp_eatAtomEscape(t)) return !0;
                t.pos = s;
              }
              return !1;
            }),
            (Y.regexp_eatUncapturingGroup = function (t) {
              var s = t.pos;
              if (t.eat(40)) {
                if (t.eat(63)) {
                  if (this.options.ecmaVersion >= 16) {
                    var u = this.regexp_eatModifiers(t),
                      l = t.eat(45);
                    if (u || l) {
                      for (var b = 0; b < u.length; b++) {
                        var T = u.charAt(b);
                        u.indexOf(T, b + 1) > -1 &&
                          t.raise("Duplicate regular expression modifiers");
                      }
                      if (l) {
                        var R = this.regexp_eatModifiers(t);
                        !u &&
                          !R &&
                          t.current() === 58 &&
                          t.raise("Invalid regular expression modifiers");
                        for (var j = 0; j < R.length; j++) {
                          var q = R.charAt(j);
                          (R.indexOf(q, j + 1) > -1 || u.indexOf(q) > -1) &&
                            t.raise("Duplicate regular expression modifiers");
                        }
                      }
                    }
                  }
                  if (t.eat(58)) {
                    if ((this.regexp_disjunction(t), t.eat(41))) return !0;
                    t.raise("Unterminated group");
                  }
                }
                t.pos = s;
              }
              return !1;
            }),
            (Y.regexp_eatCapturingGroup = function (t) {
              if (t.eat(40)) {
                if (
                  (this.options.ecmaVersion >= 9
                    ? this.regexp_groupSpecifier(t)
                    : t.current() === 63 && t.raise("Invalid group"),
                  this.regexp_disjunction(t),
                  t.eat(41))
                )
                  return (t.numCapturingParens += 1), !0;
                t.raise("Unterminated group");
              }
              return !1;
            }),
            (Y.regexp_eatModifiers = (t) => {
              for (var s = "", u = 0; (u = t.current()) !== -1 && zn(u); )
                (s += Ne(u)), t.advance();
              return s;
            });
          function zn(t) {
            return t === 105 || t === 109 || t === 115;
          }
          (Y.regexp_eatExtendedAtom = function (t) {
            return (
              t.eat(46) ||
              this.regexp_eatReverseSolidusAtomEscape(t) ||
              this.regexp_eatCharacterClass(t) ||
              this.regexp_eatUncapturingGroup(t) ||
              this.regexp_eatCapturingGroup(t) ||
              this.regexp_eatInvalidBracedQuantifier(t) ||
              this.regexp_eatExtendedPatternCharacter(t)
            );
          }),
            (Y.regexp_eatInvalidBracedQuantifier = function (t) {
              return this.regexp_eatBracedQuantifier(t, !0) && t.raise("Nothing to repeat"), !1;
            }),
            (Y.regexp_eatSyntaxCharacter = (t) => {
              var s = t.current();
              return Lr(s) ? ((t.lastIntValue = s), t.advance(), !0) : !1;
            });
          function Lr(t) {
            return (
              t === 36 ||
              (t >= 40 && t <= 43) ||
              t === 46 ||
              t === 63 ||
              (t >= 91 && t <= 94) ||
              (t >= 123 && t <= 125)
            );
          }
          (Y.regexp_eatPatternCharacters = (t) => {
            for (var s = t.pos, u = 0; (u = t.current()) !== -1 && !Lr(u); ) t.advance();
            return t.pos !== s;
          }),
            (Y.regexp_eatExtendedPatternCharacter = (t) => {
              var s = t.current();
              return s !== -1 &&
                s !== 36 &&
                !(s >= 40 && s <= 43) &&
                s !== 46 &&
                s !== 63 &&
                s !== 91 &&
                s !== 94 &&
                s !== 124
                ? (t.advance(), !0)
                : !1;
            }),
            (Y.regexp_groupSpecifier = function (t) {
              if (t.eat(63)) {
                this.regexp_eatGroupName(t) || t.raise("Invalid group");
                var s = this.options.ecmaVersion >= 16,
                  u = t.groupNames[t.lastStringValue];
                if (u)
                  if (s)
                    for (var l = 0, b = u; l < b.length; l += 1) {
                      var T = b[l];
                      T.separatedFrom(t.branchID) || t.raise("Duplicate capture group name");
                    }
                  else t.raise("Duplicate capture group name");
                s
                  ? (u || (t.groupNames[t.lastStringValue] = [])).push(t.branchID)
                  : (t.groupNames[t.lastStringValue] = !0);
              }
            }),
            (Y.regexp_eatGroupName = function (t) {
              if (((t.lastStringValue = ""), t.eat(60))) {
                if (this.regexp_eatRegExpIdentifierName(t) && t.eat(62)) return !0;
                t.raise("Invalid capture group name");
              }
              return !1;
            }),
            (Y.regexp_eatRegExpIdentifierName = function (t) {
              if (((t.lastStringValue = ""), this.regexp_eatRegExpIdentifierStart(t))) {
                for (
                  t.lastStringValue += Ne(t.lastIntValue);
                  this.regexp_eatRegExpIdentifierPart(t);
                )
                  t.lastStringValue += Ne(t.lastIntValue);
                return !0;
              }
              return !1;
            }),
            (Y.regexp_eatRegExpIdentifierStart = function (t) {
              var s = t.pos,
                u = this.options.ecmaVersion >= 11,
                l = t.current(u);
              return (
                t.advance(u),
                l === 92 &&
                  this.regexp_eatRegExpUnicodeEscapeSequence(t, u) &&
                  (l = t.lastIntValue),
                Hn(l) ? ((t.lastIntValue = l), !0) : ((t.pos = s), !1)
              );
            });
          function Hn(t) {
            return N(t, !0) || t === 36 || t === 95;
          }
          Y.regexp_eatRegExpIdentifierPart = function (t) {
            var s = t.pos,
              u = this.options.ecmaVersion >= 11,
              l = t.current(u);
            return (
              t.advance(u),
              l === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(t, u) && (l = t.lastIntValue),
              Qn(l) ? ((t.lastIntValue = l), !0) : ((t.pos = s), !1)
            );
          };
          function Qn(t) {
            return E(t, !0) || t === 36 || t === 95 || t === 8204 || t === 8205;
          }
          (Y.regexp_eatAtomEscape = function (t) {
            return this.regexp_eatBackReference(t) ||
              this.regexp_eatCharacterClassEscape(t) ||
              this.regexp_eatCharacterEscape(t) ||
              (t.switchN && this.regexp_eatKGroupName(t))
              ? !0
              : (t.switchU &&
                  (t.current() === 99 && t.raise("Invalid unicode escape"),
                  t.raise("Invalid escape")),
                !1);
          }),
            (Y.regexp_eatBackReference = function (t) {
              var s = t.pos;
              if (this.regexp_eatDecimalEscape(t)) {
                var u = t.lastIntValue;
                if (t.switchU) return u > t.maxBackReference && (t.maxBackReference = u), !0;
                if (u <= t.numCapturingParens) return !0;
                t.pos = s;
              }
              return !1;
            }),
            (Y.regexp_eatKGroupName = function (t) {
              if (t.eat(107)) {
                if (this.regexp_eatGroupName(t))
                  return t.backReferenceNames.push(t.lastStringValue), !0;
                t.raise("Invalid named reference");
              }
              return !1;
            }),
            (Y.regexp_eatCharacterEscape = function (t) {
              return (
                this.regexp_eatControlEscape(t) ||
                this.regexp_eatCControlLetter(t) ||
                this.regexp_eatZero(t) ||
                this.regexp_eatHexEscapeSequence(t) ||
                this.regexp_eatRegExpUnicodeEscapeSequence(t, !1) ||
                (!t.switchU && this.regexp_eatLegacyOctalEscapeSequence(t)) ||
                this.regexp_eatIdentityEscape(t)
              );
            }),
            (Y.regexp_eatCControlLetter = function (t) {
              var s = t.pos;
              if (t.eat(99)) {
                if (this.regexp_eatControlLetter(t)) return !0;
                t.pos = s;
              }
              return !1;
            }),
            (Y.regexp_eatZero = (t) =>
              t.current() === 48 && !fi(t.lookahead())
                ? ((t.lastIntValue = 0), t.advance(), !0)
                : !1),
            (Y.regexp_eatControlEscape = (t) => {
              var s = t.current();
              return s === 116
                ? ((t.lastIntValue = 9), t.advance(), !0)
                : s === 110
                  ? ((t.lastIntValue = 10), t.advance(), !0)
                  : s === 118
                    ? ((t.lastIntValue = 11), t.advance(), !0)
                    : s === 102
                      ? ((t.lastIntValue = 12), t.advance(), !0)
                      : s === 114
                        ? ((t.lastIntValue = 13), t.advance(), !0)
                        : !1;
            }),
            (Y.regexp_eatControlLetter = (t) => {
              var s = t.current();
              return Rr(s) ? ((t.lastIntValue = s % 32), t.advance(), !0) : !1;
            });
          function Rr(t) {
            return (t >= 65 && t <= 90) || (t >= 97 && t <= 122);
          }
          Y.regexp_eatRegExpUnicodeEscapeSequence = function (t, s) {
            s === void 0 && (s = !1);
            var u = t.pos,
              l = s || t.switchU;
            if (t.eat(117)) {
              if (this.regexp_eatFixedHexDigits(t, 4)) {
                var b = t.lastIntValue;
                if (l && b >= 55296 && b <= 56319) {
                  var T = t.pos;
                  if (t.eat(92) && t.eat(117) && this.regexp_eatFixedHexDigits(t, 4)) {
                    var R = t.lastIntValue;
                    if (R >= 56320 && R <= 57343)
                      return (t.lastIntValue = (b - 55296) * 1024 + (R - 56320) + 65536), !0;
                  }
                  (t.pos = T), (t.lastIntValue = b);
                }
                return !0;
              }
              if (
                l &&
                t.eat(123) &&
                this.regexp_eatHexDigits(t) &&
                t.eat(125) &&
                Kn(t.lastIntValue)
              )
                return !0;
              l && t.raise("Invalid unicode escape"), (t.pos = u);
            }
            return !1;
          };
          function Kn(t) {
            return t >= 0 && t <= 1114111;
          }
          (Y.regexp_eatIdentityEscape = function (t) {
            if (t.switchU)
              return this.regexp_eatSyntaxCharacter(t)
                ? !0
                : t.eat(47)
                  ? ((t.lastIntValue = 47), !0)
                  : !1;
            var s = t.current();
            return s !== 99 && (!t.switchN || s !== 107)
              ? ((t.lastIntValue = s), t.advance(), !0)
              : !1;
          }),
            (Y.regexp_eatDecimalEscape = (t) => {
              t.lastIntValue = 0;
              var s = t.current();
              if (s >= 49 && s <= 57) {
                do (t.lastIntValue = 10 * t.lastIntValue + (s - 48)), t.advance();
                while ((s = t.current()) >= 48 && s <= 57);
                return !0;
              }
              return !1;
            });
          var Or = 0,
            ut = 1,
            He = 2;
          Y.regexp_eatCharacterClassEscape = function (t) {
            var s = t.current();
            if (Xn(s)) return (t.lastIntValue = -1), t.advance(), ut;
            var u = !1;
            if (t.switchU && this.options.ecmaVersion >= 9 && ((u = s === 80) || s === 112)) {
              (t.lastIntValue = -1), t.advance();
              var l;
              if (
                t.eat(123) &&
                (l = this.regexp_eatUnicodePropertyValueExpression(t)) &&
                t.eat(125)
              )
                return u && l === He && t.raise("Invalid property name"), l;
              t.raise("Invalid property name");
            }
            return Or;
          };
          function Xn(t) {
            return t === 100 || t === 68 || t === 115 || t === 83 || t === 119 || t === 87;
          }
          (Y.regexp_eatUnicodePropertyValueExpression = function (t) {
            var s = t.pos;
            if (this.regexp_eatUnicodePropertyName(t) && t.eat(61)) {
              var u = t.lastStringValue;
              if (this.regexp_eatUnicodePropertyValue(t)) {
                var l = t.lastStringValue;
                return this.regexp_validateUnicodePropertyNameAndValue(t, u, l), ut;
              }
            }
            if (((t.pos = s), this.regexp_eatLoneUnicodePropertyNameOrValue(t))) {
              var b = t.lastStringValue;
              return this.regexp_validateUnicodePropertyNameOrValue(t, b);
            }
            return Or;
          }),
            (Y.regexp_validateUnicodePropertyNameAndValue = (t, s, u) => {
              ve(t.unicodeProperties.nonBinary, s) || t.raise("Invalid property name"),
                t.unicodeProperties.nonBinary[s].test(u) || t.raise("Invalid property value");
            }),
            (Y.regexp_validateUnicodePropertyNameOrValue = (t, s) => {
              if (t.unicodeProperties.binary.test(s)) return ut;
              if (t.switchV && t.unicodeProperties.binaryOfStrings.test(s)) return He;
              t.raise("Invalid property name");
            }),
            (Y.regexp_eatUnicodePropertyName = (t) => {
              var s = 0;
              for (t.lastStringValue = ""; Vr((s = t.current())); )
                (t.lastStringValue += Ne(s)), t.advance();
              return t.lastStringValue !== "";
            });
          function Vr(t) {
            return Rr(t) || t === 95;
          }
          Y.regexp_eatUnicodePropertyValue = (t) => {
            var s = 0;
            for (t.lastStringValue = ""; Jn((s = t.current())); )
              (t.lastStringValue += Ne(s)), t.advance();
            return t.lastStringValue !== "";
          };
          function Jn(t) {
            return Vr(t) || fi(t);
          }
          (Y.regexp_eatLoneUnicodePropertyNameOrValue = function (t) {
            return this.regexp_eatUnicodePropertyValue(t);
          }),
            (Y.regexp_eatCharacterClass = function (t) {
              if (t.eat(91)) {
                var s = t.eat(94),
                  u = this.regexp_classContents(t);
                return (
                  t.eat(93) || t.raise("Unterminated character class"),
                  s && u === He && t.raise("Negated character class may contain strings"),
                  !0
                );
              }
              return !1;
            }),
            (Y.regexp_classContents = function (t) {
              return t.current() === 93
                ? ut
                : t.switchV
                  ? this.regexp_classSetExpression(t)
                  : (this.regexp_nonEmptyClassRanges(t), ut);
            }),
            (Y.regexp_nonEmptyClassRanges = function (t) {
              for (; this.regexp_eatClassAtom(t); ) {
                var s = t.lastIntValue;
                if (t.eat(45) && this.regexp_eatClassAtom(t)) {
                  var u = t.lastIntValue;
                  t.switchU && (s === -1 || u === -1) && t.raise("Invalid character class"),
                    s !== -1 &&
                      u !== -1 &&
                      s > u &&
                      t.raise("Range out of order in character class");
                }
              }
            }),
            (Y.regexp_eatClassAtom = function (t) {
              var s = t.pos;
              if (t.eat(92)) {
                if (this.regexp_eatClassEscape(t)) return !0;
                if (t.switchU) {
                  var u = t.current();
                  (u === 99 || Mr(u)) && t.raise("Invalid class escape"), t.raise("Invalid escape");
                }
                t.pos = s;
              }
              var l = t.current();
              return l !== 93 ? ((t.lastIntValue = l), t.advance(), !0) : !1;
            }),
            (Y.regexp_eatClassEscape = function (t) {
              var s = t.pos;
              if (t.eat(98)) return (t.lastIntValue = 8), !0;
              if (t.switchU && t.eat(45)) return (t.lastIntValue = 45), !0;
              if (!t.switchU && t.eat(99)) {
                if (this.regexp_eatClassControlLetter(t)) return !0;
                t.pos = s;
              }
              return this.regexp_eatCharacterClassEscape(t) || this.regexp_eatCharacterEscape(t);
            }),
            (Y.regexp_classSetExpression = function (t) {
              var s = ut,
                u;
              if (!this.regexp_eatClassSetRange(t))
                if ((u = this.regexp_eatClassSetOperand(t))) {
                  u === He && (s = He);
                  for (var l = t.pos; t.eatChars([38, 38]); ) {
                    if (t.current() !== 38 && (u = this.regexp_eatClassSetOperand(t))) {
                      u !== He && (s = ut);
                      continue;
                    }
                    t.raise("Invalid character in character class");
                  }
                  if (l !== t.pos) return s;
                  for (; t.eatChars([45, 45]); )
                    this.regexp_eatClassSetOperand(t) ||
                      t.raise("Invalid character in character class");
                  if (l !== t.pos) return s;
                } else t.raise("Invalid character in character class");
              for (;;)
                if (!this.regexp_eatClassSetRange(t)) {
                  if (((u = this.regexp_eatClassSetOperand(t)), !u)) return s;
                  u === He && (s = He);
                }
            }),
            (Y.regexp_eatClassSetRange = function (t) {
              var s = t.pos;
              if (this.regexp_eatClassSetCharacter(t)) {
                var u = t.lastIntValue;
                if (t.eat(45) && this.regexp_eatClassSetCharacter(t)) {
                  var l = t.lastIntValue;
                  return (
                    u !== -1 &&
                      l !== -1 &&
                      u > l &&
                      t.raise("Range out of order in character class"),
                    !0
                  );
                }
                t.pos = s;
              }
              return !1;
            }),
            (Y.regexp_eatClassSetOperand = function (t) {
              return this.regexp_eatClassSetCharacter(t)
                ? ut
                : this.regexp_eatClassStringDisjunction(t) || this.regexp_eatNestedClass(t);
            }),
            (Y.regexp_eatNestedClass = function (t) {
              var s = t.pos;
              if (t.eat(91)) {
                var u = t.eat(94),
                  l = this.regexp_classContents(t);
                if (t.eat(93))
                  return u && l === He && t.raise("Negated character class may contain strings"), l;
                t.pos = s;
              }
              if (t.eat(92)) {
                var b = this.regexp_eatCharacterClassEscape(t);
                if (b) return b;
                t.pos = s;
              }
              return null;
            }),
            (Y.regexp_eatClassStringDisjunction = function (t) {
              var s = t.pos;
              if (t.eatChars([92, 113])) {
                if (t.eat(123)) {
                  var u = this.regexp_classStringDisjunctionContents(t);
                  if (t.eat(125)) return u;
                } else t.raise("Invalid escape");
                t.pos = s;
              }
              return null;
            }),
            (Y.regexp_classStringDisjunctionContents = function (t) {
              for (var s = this.regexp_classString(t); t.eat(124); )
                this.regexp_classString(t) === He && (s = He);
              return s;
            }),
            (Y.regexp_classString = function (t) {
              for (var s = 0; this.regexp_eatClassSetCharacter(t); ) s++;
              return s === 1 ? ut : He;
            }),
            (Y.regexp_eatClassSetCharacter = function (t) {
              var s = t.pos;
              if (t.eat(92))
                return this.regexp_eatCharacterEscape(t) ||
                  this.regexp_eatClassSetReservedPunctuator(t)
                  ? !0
                  : t.eat(98)
                    ? ((t.lastIntValue = 8), !0)
                    : ((t.pos = s), !1);
              var u = t.current();
              return u < 0 || (u === t.lookahead() && Yn(u)) || Zn(u)
                ? !1
                : (t.advance(), (t.lastIntValue = u), !0);
            });
          function Yn(t) {
            return (
              t === 33 ||
              (t >= 35 && t <= 38) ||
              (t >= 42 && t <= 44) ||
              t === 46 ||
              (t >= 58 && t <= 64) ||
              t === 94 ||
              t === 96 ||
              t === 126
            );
          }
          function Zn(t) {
            return (
              t === 40 ||
              t === 41 ||
              t === 45 ||
              t === 47 ||
              (t >= 91 && t <= 93) ||
              (t >= 123 && t <= 125)
            );
          }
          Y.regexp_eatClassSetReservedPunctuator = (t) => {
            var s = t.current();
            return $n(s) ? ((t.lastIntValue = s), t.advance(), !0) : !1;
          };
          function $n(t) {
            return (
              t === 33 ||
              t === 35 ||
              t === 37 ||
              t === 38 ||
              t === 44 ||
              t === 45 ||
              (t >= 58 && t <= 62) ||
              t === 64 ||
              t === 96 ||
              t === 126
            );
          }
          (Y.regexp_eatClassControlLetter = (t) => {
            var s = t.current();
            return fi(s) || s === 95 ? ((t.lastIntValue = s % 32), t.advance(), !0) : !1;
          }),
            (Y.regexp_eatHexEscapeSequence = function (t) {
              var s = t.pos;
              if (t.eat(120)) {
                if (this.regexp_eatFixedHexDigits(t, 2)) return !0;
                t.switchU && t.raise("Invalid escape"), (t.pos = s);
              }
              return !1;
            }),
            (Y.regexp_eatDecimalDigits = (t) => {
              var s = t.pos,
                u = 0;
              for (t.lastIntValue = 0; fi((u = t.current())); )
                (t.lastIntValue = 10 * t.lastIntValue + (u - 48)), t.advance();
              return t.pos !== s;
            });
          function fi(t) {
            return t >= 48 && t <= 57;
          }
          Y.regexp_eatHexDigits = (t) => {
            var s = t.pos,
              u = 0;
            for (t.lastIntValue = 0; Fr((u = t.current())); )
              (t.lastIntValue = 16 * t.lastIntValue + Br(u)), t.advance();
            return t.pos !== s;
          };
          function Fr(t) {
            return (t >= 48 && t <= 57) || (t >= 65 && t <= 70) || (t >= 97 && t <= 102);
          }
          function Br(t) {
            return t >= 65 && t <= 70
              ? 10 + (t - 65)
              : t >= 97 && t <= 102
                ? 10 + (t - 97)
                : t - 48;
          }
          (Y.regexp_eatLegacyOctalEscapeSequence = function (t) {
            if (this.regexp_eatOctalDigit(t)) {
              var s = t.lastIntValue;
              if (this.regexp_eatOctalDigit(t)) {
                var u = t.lastIntValue;
                s <= 3 && this.regexp_eatOctalDigit(t)
                  ? (t.lastIntValue = s * 64 + u * 8 + t.lastIntValue)
                  : (t.lastIntValue = s * 8 + u);
              } else t.lastIntValue = s;
              return !0;
            }
            return !1;
          }),
            (Y.regexp_eatOctalDigit = (t) => {
              var s = t.current();
              return Mr(s)
                ? ((t.lastIntValue = s - 48), t.advance(), !0)
                : ((t.lastIntValue = 0), !1);
            });
          function Mr(t) {
            return t >= 48 && t <= 55;
          }
          Y.regexp_eatFixedHexDigits = (t, s) => {
            var u = t.pos;
            t.lastIntValue = 0;
            for (var l = 0; l < s; ++l) {
              var b = t.current();
              if (!Fr(b)) return (t.pos = u), !1;
              (t.lastIntValue = 16 * t.lastIntValue + Br(b)), t.advance();
            }
            return !0;
          };
          var pi = function (s) {
              (this.type = s.type),
                (this.value = s.value),
                (this.start = s.start),
                (this.end = s.end),
                s.options.locations && (this.loc = new je(s, s.startLoc, s.endLoc)),
                s.options.ranges && (this.range = [s.start, s.end]);
            },
            ue = ne.prototype;
          (ue.next = function (t) {
            !t &&
              this.type.keyword &&
              this.containsEsc &&
              this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword),
              this.options.onToken && this.options.onToken(new pi(this)),
              (this.lastTokEnd = this.end),
              (this.lastTokStart = this.start),
              (this.lastTokEndLoc = this.endLoc),
              (this.lastTokStartLoc = this.startLoc),
              this.nextToken();
          }),
            (ue.getToken = function () {
              return this.next(), new pi(this);
            }),
            typeof Symbol < "u" &&
              (ue[Symbol.iterator] = function () {
                return {
                  next: () => {
                    var s = this.getToken();
                    return { done: s.type === h.eof, value: s };
                  },
                };
              }),
            (ue.nextToken = function () {
              var t = this.curContext();
              if (
                ((!t || !t.preserveSpace) && this.skipSpace(),
                (this.start = this.pos),
                this.options.locations && (this.startLoc = this.curPosition()),
                this.pos >= this.input.length)
              )
                return this.finishToken(h.eof);
              if (t.override) return t.override(this);
              this.readToken(this.fullCharCodeAtPos());
            }),
            (ue.readToken = function (t) {
              return N(t, this.options.ecmaVersion >= 6) || t === 92
                ? this.readWord()
                : this.getTokenFromCode(t);
            }),
            (ue.fullCharCodeAt = function (t) {
              var s = this.input.charCodeAt(t);
              if (s <= 55295 || s >= 56320) return s;
              var u = this.input.charCodeAt(t + 1);
              return u <= 56319 || u >= 57344 ? s : (s << 10) + u - 56613888;
            }),
            (ue.fullCharCodeAtPos = function () {
              return this.fullCharCodeAt(this.pos);
            }),
            (ue.skipBlockComment = function () {
              var t = this.options.onComment && this.curPosition(),
                s = this.pos,
                u = this.input.indexOf("*/", (this.pos += 2));
              if (
                (u === -1 && this.raise(this.pos - 2, "Unterminated comment"),
                (this.pos = u + 2),
                this.options.locations)
              )
                for (var l = void 0, b = s; (l = H(this.input, b, this.pos)) > -1; )
                  ++this.curLine, (b = this.lineStart = l);
              this.options.onComment &&
                this.options.onComment(
                  !0,
                  this.input.slice(s + 2, u),
                  s,
                  this.pos,
                  t,
                  this.curPosition(),
                );
            }),
            (ue.skipLineComment = function (t) {
              for (
                var s = this.pos,
                  u = this.options.onComment && this.curPosition(),
                  l = this.input.charCodeAt((this.pos += t));
                this.pos < this.input.length && !Q(l);
              )
                l = this.input.charCodeAt(++this.pos);
              this.options.onComment &&
                this.options.onComment(
                  !1,
                  this.input.slice(s + t, this.pos),
                  s,
                  this.pos,
                  u,
                  this.curPosition(),
                );
            }),
            (ue.skipSpace = function () {
              e: for (; this.pos < this.input.length; ) {
                var t = this.input.charCodeAt(this.pos);
                switch (t) {
                  case 32:
                  case 160:
                    ++this.pos;
                    break;
                  case 13:
                    this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
                  case 10:
                  case 8232:
                  case 8233:
                    ++this.pos,
                      this.options.locations && (++this.curLine, (this.lineStart = this.pos));
                    break;
                  case 47:
                    switch (this.input.charCodeAt(this.pos + 1)) {
                      case 42:
                        this.skipBlockComment();
                        break;
                      case 47:
                        this.skipLineComment(2);
                        break;
                      default:
                        break e;
                    }
                    break;
                  default:
                    if ((t > 8 && t < 14) || (t >= 5760 && ee.test(String.fromCharCode(t))))
                      ++this.pos;
                    else break e;
                }
              }
            }),
            (ue.finishToken = function (t, s) {
              (this.end = this.pos), this.options.locations && (this.endLoc = this.curPosition());
              var u = this.type;
              (this.type = t), (this.value = s), this.updateContext(u);
            }),
            (ue.readToken_dot = function () {
              var t = this.input.charCodeAt(this.pos + 1);
              if (t >= 48 && t <= 57) return this.readNumber(!0);
              var s = this.input.charCodeAt(this.pos + 2);
              return this.options.ecmaVersion >= 6 && t === 46 && s === 46
                ? ((this.pos += 3), this.finishToken(h.ellipsis))
                : (++this.pos, this.finishToken(h.dot));
            }),
            (ue.readToken_slash = function () {
              var t = this.input.charCodeAt(this.pos + 1);
              return this.exprAllowed
                ? (++this.pos, this.readRegexp())
                : t === 61
                  ? this.finishOp(h.assign, 2)
                  : this.finishOp(h.slash, 1);
            }),
            (ue.readToken_mult_modulo_exp = function (t) {
              var s = this.input.charCodeAt(this.pos + 1),
                u = 1,
                l = t === 42 ? h.star : h.modulo;
              return (
                this.options.ecmaVersion >= 7 &&
                  t === 42 &&
                  s === 42 &&
                  (++u, (l = h.starstar), (s = this.input.charCodeAt(this.pos + 2))),
                s === 61 ? this.finishOp(h.assign, u + 1) : this.finishOp(l, u)
              );
            }),
            (ue.readToken_pipe_amp = function (t) {
              var s = this.input.charCodeAt(this.pos + 1);
              if (s === t) {
                if (this.options.ecmaVersion >= 12) {
                  var u = this.input.charCodeAt(this.pos + 2);
                  if (u === 61) return this.finishOp(h.assign, 3);
                }
                return this.finishOp(t === 124 ? h.logicalOR : h.logicalAND, 2);
              }
              return s === 61
                ? this.finishOp(h.assign, 2)
                : this.finishOp(t === 124 ? h.bitwiseOR : h.bitwiseAND, 1);
            }),
            (ue.readToken_caret = function () {
              var t = this.input.charCodeAt(this.pos + 1);
              return t === 61 ? this.finishOp(h.assign, 2) : this.finishOp(h.bitwiseXOR, 1);
            }),
            (ue.readToken_plus_min = function (t) {
              var s = this.input.charCodeAt(this.pos + 1);
              return s === t
                ? s === 45 &&
                  !this.inModule &&
                  this.input.charCodeAt(this.pos + 2) === 62 &&
                  (this.lastTokEnd === 0 || I.test(this.input.slice(this.lastTokEnd, this.pos)))
                  ? (this.skipLineComment(3), this.skipSpace(), this.nextToken())
                  : this.finishOp(h.incDec, 2)
                : s === 61
                  ? this.finishOp(h.assign, 2)
                  : this.finishOp(h.plusMin, 1);
            }),
            (ue.readToken_lt_gt = function (t) {
              var s = this.input.charCodeAt(this.pos + 1),
                u = 1;
              return s === t
                ? ((u = t === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2),
                  this.input.charCodeAt(this.pos + u) === 61
                    ? this.finishOp(h.assign, u + 1)
                    : this.finishOp(h.bitShift, u))
                : s === 33 &&
                    t === 60 &&
                    !this.inModule &&
                    this.input.charCodeAt(this.pos + 2) === 45 &&
                    this.input.charCodeAt(this.pos + 3) === 45
                  ? (this.skipLineComment(4), this.skipSpace(), this.nextToken())
                  : (s === 61 && (u = 2), this.finishOp(h.relational, u));
            }),
            (ue.readToken_eq_excl = function (t) {
              var s = this.input.charCodeAt(this.pos + 1);
              return s === 61
                ? this.finishOp(h.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2)
                : t === 61 && s === 62 && this.options.ecmaVersion >= 6
                  ? ((this.pos += 2), this.finishToken(h.arrow))
                  : this.finishOp(t === 61 ? h.eq : h.prefix, 1);
            }),
            (ue.readToken_question = function () {
              var t = this.options.ecmaVersion;
              if (t >= 11) {
                var s = this.input.charCodeAt(this.pos + 1);
                if (s === 46) {
                  var u = this.input.charCodeAt(this.pos + 2);
                  if (u < 48 || u > 57) return this.finishOp(h.questionDot, 2);
                }
                if (s === 63) {
                  if (t >= 12) {
                    var l = this.input.charCodeAt(this.pos + 2);
                    if (l === 61) return this.finishOp(h.assign, 3);
                  }
                  return this.finishOp(h.coalesce, 2);
                }
              }
              return this.finishOp(h.question, 1);
            }),
            (ue.readToken_numberSign = function () {
              var t = this.options.ecmaVersion,
                s = 35;
              if (t >= 13 && (++this.pos, (s = this.fullCharCodeAtPos()), N(s, !0) || s === 92))
                return this.finishToken(h.privateId, this.readWord1());
              this.raise(this.pos, "Unexpected character '" + Ne(s) + "'");
            }),
            (ue.getTokenFromCode = function (t) {
              switch (t) {
                case 46:
                  return this.readToken_dot();
                case 40:
                  return ++this.pos, this.finishToken(h.parenL);
                case 41:
                  return ++this.pos, this.finishToken(h.parenR);
                case 59:
                  return ++this.pos, this.finishToken(h.semi);
                case 44:
                  return ++this.pos, this.finishToken(h.comma);
                case 91:
                  return ++this.pos, this.finishToken(h.bracketL);
                case 93:
                  return ++this.pos, this.finishToken(h.bracketR);
                case 123:
                  return ++this.pos, this.finishToken(h.braceL);
                case 125:
                  return ++this.pos, this.finishToken(h.braceR);
                case 58:
                  return ++this.pos, this.finishToken(h.colon);
                case 96:
                  if (this.options.ecmaVersion < 6) break;
                  return ++this.pos, this.finishToken(h.backQuote);
                case 48: {
                  var s = this.input.charCodeAt(this.pos + 1);
                  if (s === 120 || s === 88) return this.readRadixNumber(16);
                  if (this.options.ecmaVersion >= 6) {
                    if (s === 111 || s === 79) return this.readRadixNumber(8);
                    if (s === 98 || s === 66) return this.readRadixNumber(2);
                  }
                }
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                  return this.readNumber(!1);
                case 34:
                case 39:
                  return this.readString(t);
                case 47:
                  return this.readToken_slash();
                case 37:
                case 42:
                  return this.readToken_mult_modulo_exp(t);
                case 124:
                case 38:
                  return this.readToken_pipe_amp(t);
                case 94:
                  return this.readToken_caret();
                case 43:
                case 45:
                  return this.readToken_plus_min(t);
                case 60:
                case 62:
                  return this.readToken_lt_gt(t);
                case 61:
                case 33:
                  return this.readToken_eq_excl(t);
                case 63:
                  return this.readToken_question();
                case 126:
                  return this.finishOp(h.prefix, 1);
                case 35:
                  return this.readToken_numberSign();
              }
              this.raise(this.pos, "Unexpected character '" + Ne(t) + "'");
            }),
            (ue.finishOp = function (t, s) {
              var u = this.input.slice(this.pos, this.pos + s);
              return (this.pos += s), this.finishToken(t, u);
            }),
            (ue.readRegexp = function () {
              for (var t, s, u = this.pos; ; ) {
                this.pos >= this.input.length && this.raise(u, "Unterminated regular expression");
                var l = this.input.charAt(this.pos);
                if ((I.test(l) && this.raise(u, "Unterminated regular expression"), t)) t = !1;
                else {
                  if (l === "[") s = !0;
                  else if (l === "]" && s) s = !1;
                  else if (l === "/" && !s) break;
                  t = l === "\\";
                }
                ++this.pos;
              }
              var b = this.input.slice(u, this.pos);
              ++this.pos;
              var T = this.pos,
                R = this.readWord1();
              this.containsEsc && this.unexpected(T);
              var j = this.regexpState || (this.regexpState = new et(this));
              j.reset(u, b, R), this.validateRegExpFlags(j), this.validateRegExpPattern(j);
              var q = null;
              try {
                q = new RegExp(b, R);
              } catch {}
              return this.finishToken(h.regexp, { pattern: b, flags: R, value: q });
            }),
            (ue.readInt = function (t, s, u) {
              for (
                var l = this.options.ecmaVersion >= 12 && s === void 0,
                  b = u && this.input.charCodeAt(this.pos) === 48,
                  T = this.pos,
                  R = 0,
                  j = 0,
                  q = 0,
                  te = s ?? 1 / 0;
                q < te;
                ++q, ++this.pos
              ) {
                var se = this.input.charCodeAt(this.pos),
                  Se = void 0;
                if (l && se === 95) {
                  b &&
                    this.raiseRecoverable(
                      this.pos,
                      "Numeric separator is not allowed in legacy octal numeric literals",
                    ),
                    j === 95 &&
                      this.raiseRecoverable(
                        this.pos,
                        "Numeric separator must be exactly one underscore",
                      ),
                    q === 0 &&
                      this.raiseRecoverable(
                        this.pos,
                        "Numeric separator is not allowed at the first of digits",
                      ),
                    (j = se);
                  continue;
                }
                if (
                  (se >= 97
                    ? (Se = se - 97 + 10)
                    : se >= 65
                      ? (Se = se - 65 + 10)
                      : se >= 48 && se <= 57
                        ? (Se = se - 48)
                        : (Se = 1 / 0),
                  Se >= t)
                )
                  break;
                (j = se), (R = R * t + Se);
              }
              return (
                l &&
                  j === 95 &&
                  this.raiseRecoverable(
                    this.pos - 1,
                    "Numeric separator is not allowed at the last of digits",
                  ),
                this.pos === T || (s != null && this.pos - T !== s) ? null : R
              );
            });
          function ea(t, s) {
            return s ? parseInt(t, 8) : parseFloat(t.replace(/_/g, ""));
          }
          function Dr(t) {
            return typeof BigInt != "function" ? null : BigInt(t.replace(/_/g, ""));
          }
          (ue.readRadixNumber = function (t) {
            var s = this.pos;
            this.pos += 2;
            var u = this.readInt(t);
            return (
              u == null && this.raise(this.start + 2, "Expected number in radix " + t),
              this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110
                ? ((u = Dr(this.input.slice(s, this.pos))), ++this.pos)
                : N(this.fullCharCodeAtPos()) &&
                  this.raise(this.pos, "Identifier directly after number"),
              this.finishToken(h.num, u)
            );
          }),
            (ue.readNumber = function (t) {
              var s = this.pos;
              !t && this.readInt(10, void 0, !0) === null && this.raise(s, "Invalid number");
              var u = this.pos - s >= 2 && this.input.charCodeAt(s) === 48;
              u && this.strict && this.raise(s, "Invalid number");
              var l = this.input.charCodeAt(this.pos);
              if (!u && !t && this.options.ecmaVersion >= 11 && l === 110) {
                var b = Dr(this.input.slice(s, this.pos));
                return (
                  ++this.pos,
                  N(this.fullCharCodeAtPos()) &&
                    this.raise(this.pos, "Identifier directly after number"),
                  this.finishToken(h.num, b)
                );
              }
              u && /[89]/.test(this.input.slice(s, this.pos)) && (u = !1),
                l === 46 &&
                  !u &&
                  (++this.pos, this.readInt(10), (l = this.input.charCodeAt(this.pos))),
                (l === 69 || l === 101) &&
                  !u &&
                  ((l = this.input.charCodeAt(++this.pos)),
                  (l === 43 || l === 45) && ++this.pos,
                  this.readInt(10) === null && this.raise(s, "Invalid number")),
                N(this.fullCharCodeAtPos()) &&
                  this.raise(this.pos, "Identifier directly after number");
              var T = ea(this.input.slice(s, this.pos), u);
              return this.finishToken(h.num, T);
            }),
            (ue.readCodePoint = function () {
              var t = this.input.charCodeAt(this.pos),
                s;
              if (t === 123) {
                this.options.ecmaVersion < 6 && this.unexpected();
                var u = ++this.pos;
                (s = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos)),
                  ++this.pos,
                  s > 1114111 && this.invalidStringToken(u, "Code point out of bounds");
              } else s = this.readHexChar(4);
              return s;
            }),
            (ue.readString = function (t) {
              for (var s = "", u = ++this.pos; ; ) {
                this.pos >= this.input.length &&
                  this.raise(this.start, "Unterminated string constant");
                var l = this.input.charCodeAt(this.pos);
                if (l === t) break;
                l === 92
                  ? ((s += this.input.slice(u, this.pos)),
                    (s += this.readEscapedChar(!1)),
                    (u = this.pos))
                  : l === 8232 || l === 8233
                    ? (this.options.ecmaVersion < 10 &&
                        this.raise(this.start, "Unterminated string constant"),
                      ++this.pos,
                      this.options.locations && (this.curLine++, (this.lineStart = this.pos)))
                    : (Q(l) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
              }
              return (s += this.input.slice(u, this.pos++)), this.finishToken(h.string, s);
            });
          var jr = {};
          (ue.tryReadTemplateToken = function () {
            this.inTemplateElement = !0;
            try {
              this.readTmplToken();
            } catch (t) {
              if (t === jr) this.readInvalidTemplateToken();
              else throw t;
            }
            this.inTemplateElement = !1;
          }),
            (ue.invalidStringToken = function (t, s) {
              if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw jr;
              this.raise(t, s);
            }),
            (ue.readTmplToken = function () {
              for (var t = "", s = this.pos; ; ) {
                this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
                var u = this.input.charCodeAt(this.pos);
                if (u === 96 || (u === 36 && this.input.charCodeAt(this.pos + 1) === 123))
                  return this.pos === this.start &&
                    (this.type === h.template || this.type === h.invalidTemplate)
                    ? u === 36
                      ? ((this.pos += 2), this.finishToken(h.dollarBraceL))
                      : (++this.pos, this.finishToken(h.backQuote))
                    : ((t += this.input.slice(s, this.pos)), this.finishToken(h.template, t));
                if (u === 92)
                  (t += this.input.slice(s, this.pos)),
                    (t += this.readEscapedChar(!0)),
                    (s = this.pos);
                else if (Q(u)) {
                  switch (((t += this.input.slice(s, this.pos)), ++this.pos, u)) {
                    case 13:
                      this.input.charCodeAt(this.pos) === 10 && ++this.pos;
                    case 10:
                      t += `
`;
                      break;
                    default:
                      t += String.fromCharCode(u);
                      break;
                  }
                  this.options.locations && (++this.curLine, (this.lineStart = this.pos)),
                    (s = this.pos);
                } else ++this.pos;
              }
            }),
            (ue.readInvalidTemplateToken = function () {
              for (; this.pos < this.input.length; this.pos++)
                switch (this.input[this.pos]) {
                  case "\\":
                    ++this.pos;
                    break;
                  case "$":
                    if (this.input[this.pos + 1] !== "{") break;
                  case "`":
                    return this.finishToken(
                      h.invalidTemplate,
                      this.input.slice(this.start, this.pos),
                    );
                  case "\r":
                    this.input[this.pos + 1] ===
                      `
` && ++this.pos;
                  case `
`:
                  case "\u2028":
                  case "\u2029":
                    ++this.curLine, (this.lineStart = this.pos + 1);
                    break;
                }
              this.raise(this.start, "Unterminated template");
            }),
            (ue.readEscapedChar = function (t) {
              var s = this.input.charCodeAt(++this.pos);
              switch ((++this.pos, s)) {
                case 110:
                  return `
`;
                case 114:
                  return "\r";
                case 120:
                  return String.fromCharCode(this.readHexChar(2));
                case 117:
                  return Ne(this.readCodePoint());
                case 116:
                  return "	";
                case 98:
                  return "\b";
                case 118:
                  return "\v";
                case 102:
                  return "\f";
                case 13:
                  this.input.charCodeAt(this.pos) === 10 && ++this.pos;
                case 10:
                  return (
                    this.options.locations && ((this.lineStart = this.pos), ++this.curLine), ""
                  );
                case 56:
                case 57:
                  if (
                    (this.strict &&
                      this.invalidStringToken(this.pos - 1, "Invalid escape sequence"),
                    t)
                  ) {
                    var u = this.pos - 1;
                    this.invalidStringToken(u, "Invalid escape sequence in template string");
                  }
                default:
                  if (s >= 48 && s <= 55) {
                    var l = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0],
                      b = parseInt(l, 8);
                    return (
                      b > 255 && ((l = l.slice(0, -1)), (b = parseInt(l, 8))),
                      (this.pos += l.length - 1),
                      (s = this.input.charCodeAt(this.pos)),
                      (l !== "0" || s === 56 || s === 57) &&
                        (this.strict || t) &&
                        this.invalidStringToken(
                          this.pos - 1 - l.length,
                          t ? "Octal literal in template string" : "Octal literal in strict mode",
                        ),
                      String.fromCharCode(b)
                    );
                  }
                  return Q(s)
                    ? (this.options.locations && ((this.lineStart = this.pos), ++this.curLine), "")
                    : String.fromCharCode(s);
              }
            }),
            (ue.readHexChar = function (t) {
              var s = this.pos,
                u = this.readInt(16, t);
              return u === null && this.invalidStringToken(s, "Bad character escape sequence"), u;
            }),
            (ue.readWord1 = function () {
              this.containsEsc = !1;
              for (
                var t = "", s = !0, u = this.pos, l = this.options.ecmaVersion >= 6;
                this.pos < this.input.length;
              ) {
                var b = this.fullCharCodeAtPos();
                if (E(b, l)) this.pos += b <= 65535 ? 1 : 2;
                else if (b === 92) {
                  (this.containsEsc = !0), (t += this.input.slice(u, this.pos));
                  var T = this.pos;
                  this.input.charCodeAt(++this.pos) !== 117 &&
                    this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"),
                    ++this.pos;
                  var R = this.readCodePoint();
                  (s ? N : E)(R, l) || this.invalidStringToken(T, "Invalid Unicode escape"),
                    (t += Ne(R)),
                    (u = this.pos);
                } else break;
                s = !1;
              }
              return t + this.input.slice(u, this.pos);
            }),
            (ue.readWord = function () {
              var t = this.readWord1(),
                s = h.name;
              return this.keywords.test(t) && (s = L[t]), this.finishToken(s, t);
            });
          var qr = "8.16.0";
          ne.acorn = {
            Parser: ne,
            version: qr,
            defaultOptions: qe,
            Position: W,
            SourceLocation: je,
            getLineInfo: dt,
            Node: z,
            TokenType: w,
            tokTypes: h,
            keywordTypes: L,
            TokContext: De,
            tokContexts: xe,
            isIdentifierChar: E,
            isIdentifierStart: N,
            Token: pi,
            isNewLine: Q,
            lineBreak: I,
            lineBreakG: V,
            nonASCIIwhitespace: ee,
          };
          function ta(t, s) {
            return ne.parse(t, s);
          }
          function ia(t, s, u) {
            return ne.parseExpressionAt(t, s, u);
          }
          function ra(t, s) {
            return ne.tokenizer(t, s);
          }
          (r.Node = z),
            (r.Parser = ne),
            (r.Position = W),
            (r.SourceLocation = je),
            (r.TokContext = De),
            (r.Token = pi),
            (r.TokenType = w),
            (r.defaultOptions = qe),
            (r.getLineInfo = dt),
            (r.isIdentifierChar = E),
            (r.isIdentifierStart = N),
            (r.isNewLine = Q),
            (r.keywordTypes = L),
            (r.lineBreak = I),
            (r.lineBreakG = V),
            (r.nonASCIIwhitespace = ee),
            (r.parse = ta),
            (r.parseExpressionAt = ia),
            (r.tokContexts = xe),
            (r.tokTypes = h),
            (r.tokenizer = ra),
            (r.version = qr);
        });
      })(Xt, Xt.exports)),
    Xt.exports
  );
}
var ds;
function lo() {
  return (
    ds ||
      ((ds = 1),
      ((e) => {
        const i = uo(),
          r = /^[\da-fA-F]+$/,
          n = /^\d+$/,
          o = new WeakMap();
        function f(x) {
          x = x.Parser.acorn || x;
          let _ = o.get(x);
          if (!_) {
            const C = x.tokTypes,
              k = x.TokContext,
              A = x.TokenType,
              P = new k("<tag", !1),
              N = new k("</tag", !1),
              E = new k("<tag>...</tag>", !0, !0),
              w = { tc_oTag: P, tc_cTag: N, tc_expr: E },
              B = {
                jsxName: new A("jsxName"),
                jsxText: new A("jsxText", { beforeExpr: !0 }),
                jsxTagStart: new A("jsxTagStart", { startsExpr: !0 }),
                jsxTagEnd: new A("jsxTagEnd"),
              };
            (B.jsxTagStart.updateContext = function () {
              this.context.push(E), this.context.push(P), (this.exprAllowed = !1);
            }),
              (B.jsxTagEnd.updateContext = function (M) {
                const G = this.context.pop();
                (G === P && M === C.slash) || G === N
                  ? (this.context.pop(), (this.exprAllowed = this.curContext() === E))
                  : (this.exprAllowed = !0);
              }),
              (_ = { tokContexts: w, tokTypes: B }),
              o.set(x, _);
          }
          return _;
        }
        function d(x) {
          if (!x) return x;
          if (x.type === "JSXIdentifier") return x.name;
          if (x.type === "JSXNamespacedName") return x.namespace.name + ":" + x.name.name;
          if (x.type === "JSXMemberExpression") return d(x.object) + "." + d(x.property);
        }
        (e.exports = (x) => (
          (x = x || {}),
          (_) =>
            g(
              {
                allowNamespaces: x.allowNamespaces !== !1,
                allowNamespacedObjects: !!x.allowNamespacedObjects,
              },
              _,
            )
        )),
          Object.defineProperty(e.exports, "tokTypes", {
            get: () => f(ps()).tokTypes,
            configurable: !0,
            enumerable: !0,
          });
        function g(x, _) {
          const C = _.acorn || ps(),
            k = f(C),
            A = C.tokTypes,
            P = k.tokTypes,
            N = C.tokContexts,
            E = k.tokContexts.tc_oTag,
            w = k.tokContexts.tc_cTag,
            B = k.tokContexts.tc_expr,
            M = C.isNewLine,
            G = C.isIdentifierStart,
            L = C.isIdentifierChar;
          return class extends _ {
            static get acornJsx() {
              return k;
            }
            jsx_readToken() {
              let y = "",
                h = this.pos;
              for (;;) {
                this.pos >= this.input.length &&
                  this.raise(this.start, "Unterminated JSX contents");
                const I = this.input.charCodeAt(this.pos);
                switch (I) {
                  case 60:
                  case 123:
                    return this.pos === this.start
                      ? I === 60 && this.exprAllowed
                        ? (++this.pos, this.finishToken(P.jsxTagStart))
                        : this.getTokenFromCode(I)
                      : ((y += this.input.slice(h, this.pos)), this.finishToken(P.jsxText, y));
                  case 38:
                    (y += this.input.slice(h, this.pos)),
                      (y += this.jsx_readEntity()),
                      (h = this.pos);
                    break;
                  case 62:
                  case 125:
                    this.raise(
                      this.pos,
                      "Unexpected token `" +
                        this.input[this.pos] +
                        "`. Did you mean `" +
                        (I === 62 ? "&gt;" : "&rbrace;") +
                        '` or `{"' +
                        this.input[this.pos] +
                        '"}`?',
                    );
                  default:
                    M(I)
                      ? ((y += this.input.slice(h, this.pos)),
                        (y += this.jsx_readNewLine(!0)),
                        (h = this.pos))
                      : ++this.pos;
                }
              }
            }
            jsx_readNewLine(y) {
              let h = this.input.charCodeAt(this.pos),
                I;
              return (
                ++this.pos,
                h === 13 && this.input.charCodeAt(this.pos) === 10
                  ? (++this.pos,
                    (I = y
                      ? `
`
                      : `\r
`))
                  : (I = String.fromCharCode(h)),
                this.options.locations && (++this.curLine, (this.lineStart = this.pos)),
                I
              );
            }
            jsx_readString(y) {
              let h = "",
                I = ++this.pos;
              for (;;) {
                this.pos >= this.input.length &&
                  this.raise(this.start, "Unterminated string constant");
                const V = this.input.charCodeAt(this.pos);
                if (V === y) break;
                V === 38
                  ? ((h += this.input.slice(I, this.pos)),
                    (h += this.jsx_readEntity()),
                    (I = this.pos))
                  : M(V)
                    ? ((h += this.input.slice(I, this.pos)),
                      (h += this.jsx_readNewLine(!1)),
                      (I = this.pos))
                    : ++this.pos;
              }
              return (h += this.input.slice(I, this.pos++)), this.finishToken(A.string, h);
            }
            jsx_readEntity() {
              let y = "",
                h = 0,
                I,
                V = this.input[this.pos];
              V !== "&" && this.raise(this.pos, "Entity must start with an ampersand");
              const Q = ++this.pos;
              for (; this.pos < this.input.length && h++ < 10; ) {
                if (((V = this.input[this.pos++]), V === ";")) {
                  y[0] === "#"
                    ? y[1] === "x"
                      ? ((y = y.substr(2)), r.test(y) && (I = String.fromCharCode(parseInt(y, 16))))
                      : ((y = y.substr(1)), n.test(y) && (I = String.fromCharCode(parseInt(y, 10))))
                    : (I = i[y]);
                  break;
                }
                y += V;
              }
              return I || ((this.pos = Q), "&");
            }
            jsx_readWord() {
              let y,
                h = this.pos;
              do y = this.input.charCodeAt(++this.pos);
              while (L(y) || y === 45);
              return this.finishToken(P.jsxName, this.input.slice(h, this.pos));
            }
            jsx_parseIdentifier() {
              const y = this.startNode();
              return (
                this.type === P.jsxName
                  ? (y.name = this.value)
                  : this.type.keyword
                    ? (y.name = this.type.keyword)
                    : this.unexpected(),
                this.next(),
                this.finishNode(y, "JSXIdentifier")
              );
            }
            jsx_parseNamespacedName() {
              const y = this.start,
                h = this.startLoc,
                I = this.jsx_parseIdentifier();
              if (!x.allowNamespaces || !this.eat(A.colon)) return I;
              var V = this.startNodeAt(y, h);
              return (
                (V.namespace = I),
                (V.name = this.jsx_parseIdentifier()),
                this.finishNode(V, "JSXNamespacedName")
              );
            }
            jsx_parseElementName() {
              if (this.type === P.jsxTagEnd) return "";
              let y = this.start,
                h = this.startLoc,
                I = this.jsx_parseNamespacedName();
              for (
                this.type === A.dot &&
                I.type === "JSXNamespacedName" &&
                !x.allowNamespacedObjects &&
                this.unexpected();
                this.eat(A.dot);
              ) {
                const V = this.startNodeAt(y, h);
                (V.object = I),
                  (V.property = this.jsx_parseIdentifier()),
                  (I = this.finishNode(V, "JSXMemberExpression"));
              }
              return I;
            }
            jsx_parseAttributeValue() {
              switch (this.type) {
                case A.braceL: {
                  const y = this.jsx_parseExpressionContainer();
                  return (
                    y.expression.type === "JSXEmptyExpression" &&
                      this.raise(
                        y.start,
                        "JSX attributes must only be assigned a non-empty expression",
                      ),
                    y
                  );
                }
                case P.jsxTagStart:
                case A.string:
                  return this.parseExprAtom();
                default:
                  this.raise(
                    this.start,
                    "JSX value should be either an expression or a quoted JSX text",
                  );
              }
            }
            jsx_parseEmptyExpression() {
              const y = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
              return this.finishNodeAt(y, "JSXEmptyExpression", this.start, this.startLoc);
            }
            jsx_parseExpressionContainer() {
              const y = this.startNode();
              return (
                this.next(),
                (y.expression =
                  this.type === A.braceR
                    ? this.jsx_parseEmptyExpression()
                    : this.parseExpression()),
                this.expect(A.braceR),
                this.finishNode(y, "JSXExpressionContainer")
              );
            }
            jsx_parseAttribute() {
              const y = this.startNode();
              return this.eat(A.braceL)
                ? (this.expect(A.ellipsis),
                  (y.argument = this.parseMaybeAssign()),
                  this.expect(A.braceR),
                  this.finishNode(y, "JSXSpreadAttribute"))
                : ((y.name = this.jsx_parseNamespacedName()),
                  (y.value = this.eat(A.eq) ? this.jsx_parseAttributeValue() : null),
                  this.finishNode(y, "JSXAttribute"));
            }
            jsx_parseOpeningElementAt(y, h) {
              const I = this.startNodeAt(y, h);
              I.attributes = [];
              const V = this.jsx_parseElementName();
              for (V && (I.name = V); this.type !== A.slash && this.type !== P.jsxTagEnd; )
                I.attributes.push(this.jsx_parseAttribute());
              return (
                (I.selfClosing = this.eat(A.slash)),
                this.expect(P.jsxTagEnd),
                this.finishNode(I, V ? "JSXOpeningElement" : "JSXOpeningFragment")
              );
            }
            jsx_parseClosingElementAt(y, h) {
              const I = this.startNodeAt(y, h),
                V = this.jsx_parseElementName();
              return (
                V && (I.name = V),
                this.expect(P.jsxTagEnd),
                this.finishNode(I, V ? "JSXClosingElement" : "JSXClosingFragment")
              );
            }
            jsx_parseElementAt(y, h) {
              let I = this.startNodeAt(y, h),
                V = [],
                Q = this.jsx_parseOpeningElementAt(y, h),
                H = null;
              if (!Q.selfClosing) {
                e: for (;;)
                  switch (this.type) {
                    case P.jsxTagStart:
                      if (((y = this.start), (h = this.startLoc), this.next(), this.eat(A.slash))) {
                        H = this.jsx_parseClosingElementAt(y, h);
                        break e;
                      }
                      V.push(this.jsx_parseElementAt(y, h));
                      break;
                    case P.jsxText:
                      V.push(this.parseExprAtom());
                      break;
                    case A.braceL:
                      V.push(this.jsx_parseExpressionContainer());
                      break;
                    default:
                      this.unexpected();
                  }
                d(H.name) !== d(Q.name) &&
                  this.raise(
                    H.start,
                    "Expected corresponding JSX closing tag for <" + d(Q.name) + ">",
                  );
              }
              const ee = Q.name ? "Element" : "Fragment";
              return (
                (I["opening" + ee] = Q),
                (I["closing" + ee] = H),
                (I.children = V),
                this.type === A.relational &&
                  this.value === "<" &&
                  this.raise(
                    this.start,
                    "Adjacent JSX elements must be wrapped in an enclosing tag",
                  ),
                this.finishNode(I, "JSX" + ee)
              );
            }
            jsx_parseText() {
              const y = this.parseLiteral(this.value);
              return (y.type = "JSXText"), y;
            }
            jsx_parseElement() {
              const y = this.start,
                h = this.startLoc;
              return this.next(), this.jsx_parseElementAt(y, h);
            }
            parseExprAtom(y) {
              return this.type === P.jsxText
                ? this.jsx_parseText()
                : this.type === P.jsxTagStart
                  ? this.jsx_parseElement()
                  : super.parseExprAtom(y);
            }
            readToken(y) {
              const h = this.curContext();
              if (h === B) return this.jsx_readToken();
              if (h === E || h === w) {
                if (G(y)) return this.jsx_readWord();
                if (y == 62) return ++this.pos, this.finishToken(P.jsxTagEnd);
                if ((y === 34 || y === 39) && h == E) return this.jsx_readString(y);
              }
              return y === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33
                ? (++this.pos, this.finishToken(P.jsxTagStart))
                : super.readToken(y);
            }
            updateContext(y) {
              if (this.type == A.braceL) {
                var h = this.curContext();
                h == E
                  ? this.context.push(N.b_expr)
                  : h == B
                    ? this.context.push(N.b_tmpl)
                    : super.updateContext(y),
                  (this.exprAllowed = !0);
              } else if (this.type === A.slash && y === P.jsxTagStart)
                (this.context.length -= 2), this.context.push(w), (this.exprAllowed = !1);
              else return super.updateContext(y);
            }
          };
        }
      })(Hi)),
    Hi.exports
  );
}
var co = lo();
const fo = Dt(co);
function mn(e, i, r, n, o) {
  r || (r = U),
    (function f(d, g, x) {
      var _ = x || d.type,
        C = i[_];
      r[_](d, g, f), C && C(d, g);
    })(e, n, o);
}
function po(e, i, r, n, o) {
  var f = [];
  r || (r = U),
    (function d(g, x, _) {
      var C = _ || g.type,
        k = i[C],
        A = g !== f[f.length - 1];
      A && f.push(g), r[C](g, x, d), k && k(g, x || f, f), A && f.pop();
    })(e, n, o);
}
function xr(e, i, r) {
  r(e, i);
}
function It(e, i, r) {}
var U = {};
U.Program = U.BlockStatement = (e, i, r) => {
  for (var n = 0, o = e.body; n < o.length; n += 1) {
    var f = o[n];
    r(f, i, "Statement");
  }
};
U.Statement = xr;
U.EmptyStatement = It;
U.ExpressionStatement =
  U.ParenthesizedExpression =
  U.ChainExpression =
    (e, i, r) => r(e.expression, i, "Expression");
U.IfStatement = (e, i, r) => {
  r(e.test, i, "Expression"),
    r(e.consequent, i, "Statement"),
    e.alternate && r(e.alternate, i, "Statement");
};
U.LabeledStatement = (e, i, r) => r(e.body, i, "Statement");
U.BreakStatement = U.ContinueStatement = It;
U.WithStatement = (e, i, r) => {
  r(e.object, i, "Expression"), r(e.body, i, "Statement");
};
U.SwitchStatement = (e, i, r) => {
  r(e.discriminant, i, "Expression");
  for (var n = 0, o = e.cases; n < o.length; n += 1) {
    var f = o[n];
    f.test && r(f.test, i, "Expression");
    for (var d = 0, g = f.consequent; d < g.length; d += 1) {
      var x = g[d];
      r(x, i, "Statement");
    }
  }
};
U.SwitchCase = (e, i, r) => {
  e.test && r(e.test, i, "Expression");
  for (var n = 0, o = e.consequent; n < o.length; n += 1) {
    var f = o[n];
    r(f, i, "Statement");
  }
};
U.ReturnStatement =
  U.YieldExpression =
  U.AwaitExpression =
    (e, i, r) => {
      e.argument && r(e.argument, i, "Expression");
    };
U.ThrowStatement = U.SpreadElement = (e, i, r) => r(e.argument, i, "Expression");
U.TryStatement = (e, i, r) => {
  r(e.block, i, "Statement"),
    e.handler && r(e.handler, i),
    e.finalizer && r(e.finalizer, i, "Statement");
};
U.CatchClause = (e, i, r) => {
  e.param && r(e.param, i, "Pattern"), r(e.body, i, "Statement");
};
U.WhileStatement = U.DoWhileStatement = (e, i, r) => {
  r(e.test, i, "Expression"), r(e.body, i, "Statement");
};
U.ForStatement = (e, i, r) => {
  e.init && r(e.init, i, "ForInit"),
    e.test && r(e.test, i, "Expression"),
    e.update && r(e.update, i, "Expression"),
    r(e.body, i, "Statement");
};
U.ForInStatement = U.ForOfStatement = (e, i, r) => {
  r(e.left, i, "ForInit"), r(e.right, i, "Expression"), r(e.body, i, "Statement");
};
U.ForInit = (e, i, r) => {
  e.type === "VariableDeclaration" ? r(e, i) : r(e, i, "Expression");
};
U.DebuggerStatement = It;
U.FunctionDeclaration = (e, i, r) => r(e, i, "Function");
U.VariableDeclaration = (e, i, r) => {
  for (var n = 0, o = e.declarations; n < o.length; n += 1) {
    var f = o[n];
    r(f, i);
  }
};
U.VariableDeclarator = (e, i, r) => {
  r(e.id, i, "Pattern"), e.init && r(e.init, i, "Expression");
};
U.Function = (e, i, r) => {
  e.id && r(e.id, i, "Pattern");
  for (var n = 0, o = e.params; n < o.length; n += 1) {
    var f = o[n];
    r(f, i, "Pattern");
  }
  r(e.body, i, e.expression ? "Expression" : "Statement");
};
U.Pattern = (e, i, r) => {
  e.type === "Identifier"
    ? r(e, i, "VariablePattern")
    : e.type === "MemberExpression"
      ? r(e, i, "MemberPattern")
      : r(e, i);
};
U.VariablePattern = It;
U.MemberPattern = xr;
U.RestElement = (e, i, r) => r(e.argument, i, "Pattern");
U.ArrayPattern = (e, i, r) => {
  for (var n = 0, o = e.elements; n < o.length; n += 1) {
    var f = o[n];
    f && r(f, i, "Pattern");
  }
};
U.ObjectPattern = (e, i, r) => {
  for (var n = 0, o = e.properties; n < o.length; n += 1) {
    var f = o[n];
    f.type === "Property"
      ? (f.computed && r(f.key, i, "Expression"), r(f.value, i, "Pattern"))
      : f.type === "RestElement" && r(f.argument, i, "Pattern");
  }
};
U.Expression = xr;
U.ThisExpression = U.Super = U.MetaProperty = It;
U.ArrayExpression = (e, i, r) => {
  for (var n = 0, o = e.elements; n < o.length; n += 1) {
    var f = o[n];
    f && r(f, i, "Expression");
  }
};
U.ObjectExpression = (e, i, r) => {
  for (var n = 0, o = e.properties; n < o.length; n += 1) {
    var f = o[n];
    r(f, i);
  }
};
U.FunctionExpression = U.ArrowFunctionExpression = U.FunctionDeclaration;
U.SequenceExpression = (e, i, r) => {
  for (var n = 0, o = e.expressions; n < o.length; n += 1) {
    var f = o[n];
    r(f, i, "Expression");
  }
};
U.TemplateLiteral = (e, i, r) => {
  for (var n = 0, o = e.quasis; n < o.length; n += 1) {
    var f = o[n];
    r(f, i);
  }
  for (var d = 0, g = e.expressions; d < g.length; d += 1) {
    var x = g[d];
    r(x, i, "Expression");
  }
};
U.TemplateElement = It;
U.UnaryExpression = U.UpdateExpression = (e, i, r) => {
  r(e.argument, i, "Expression");
};
U.BinaryExpression = U.LogicalExpression = (e, i, r) => {
  r(e.left, i, "Expression"), r(e.right, i, "Expression");
};
U.AssignmentExpression = U.AssignmentPattern = (e, i, r) => {
  r(e.left, i, "Pattern"), r(e.right, i, "Expression");
};
U.ConditionalExpression = (e, i, r) => {
  r(e.test, i, "Expression"), r(e.consequent, i, "Expression"), r(e.alternate, i, "Expression");
};
U.NewExpression = U.CallExpression = (e, i, r) => {
  if ((r(e.callee, i, "Expression"), e.arguments))
    for (var n = 0, o = e.arguments; n < o.length; n += 1) {
      var f = o[n];
      r(f, i, "Expression");
    }
};
U.MemberExpression = (e, i, r) => {
  r(e.object, i, "Expression"), e.computed && r(e.property, i, "Expression");
};
U.ExportNamedDeclaration = U.ExportDefaultDeclaration = (e, i, r) => {
  e.declaration &&
    r(
      e.declaration,
      i,
      e.type === "ExportNamedDeclaration" || e.declaration.id ? "Statement" : "Expression",
    ),
    e.source && r(e.source, i, "Expression");
};
U.ExportAllDeclaration = (e, i, r) => {
  e.exported && r(e.exported, i), r(e.source, i, "Expression");
};
U.ImportDeclaration = (e, i, r) => {
  for (var n = 0, o = e.specifiers; n < o.length; n += 1) {
    var f = o[n];
    r(f, i);
  }
  r(e.source, i, "Expression");
};
U.ImportExpression = (e, i, r) => {
  r(e.source, i, "Expression");
};
U.ImportSpecifier =
  U.ImportDefaultSpecifier =
  U.ImportNamespaceSpecifier =
  U.Identifier =
  U.Literal =
    It;
U.TaggedTemplateExpression = (e, i, r) => {
  r(e.tag, i, "Expression"), r(e.quasi, i, "Expression");
};
U.ClassDeclaration = U.ClassExpression = (e, i, r) => r(e, i, "Class");
U.Class = (e, i, r) => {
  e.id && r(e.id, i, "Pattern"), e.superClass && r(e.superClass, i, "Expression"), r(e.body, i);
};
U.ClassBody = (e, i, r) => {
  for (var n = 0, o = e.body; n < o.length; n += 1) {
    var f = o[n];
    r(f, i);
  }
};
U.MethodDefinition = U.Property = (e, i, r) => {
  e.computed && r(e.key, i, "Expression"), r(e.value, i, "Expression");
};
var Ki, ms;
function mo() {
  if (ms) return Ki;
  ms = 1;
  var e = Os(),
    i = na(),
    r = Vs(),
    n = "[object Object]",
    o = Function.prototype,
    f = Object.prototype,
    d = o.toString,
    g = f.hasOwnProperty,
    x = d.call(Object);
  function _(C) {
    if (!r(C) || e(C) != n) return !1;
    var k = i(C);
    if (k === null) return !0;
    var A = g.call(k, "constructor") && k.constructor;
    return typeof A == "function" && A instanceof A && d.call(A) == x;
  }
  return (Ki = _), Ki;
}
var go = mo();
const xo = Dt(go);
var vo = aa();
const gs = Dt(vo);
var Xi, xs;
function yo() {
  if (xs) return Xi;
  xs = 1;
  var e = Os(),
    i = oa(),
    r = Vs(),
    n = "[object String]";
  function o(f) {
    return typeof f == "string" || (!i(f) && r(f) && e(f) == n);
  }
  return (Xi = o), Xi;
}
var bo = yo();
const So = Dt(bo);
function vs(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function _o(e) {
  var i, r;
  return vs(e) === !1
    ? !1
    : ((i = e.constructor),
      i === void 0
        ? !0
        : ((r = i.prototype), !(vs(r) === !1 || Object.hasOwn(r, "isPrototypeOf") === !1)));
}
var gt = {},
  ys;
function Co() {
  if (ys) return gt;
  ys = 1;
  var e =
      (gt && gt.__assign) ||
      function () {
        return (
          (e =
            Object.assign ||
            function (g) {
              for (var x, _ = 1, C = arguments.length; _ < C; _++) {
                x = arguments[_];
                for (var k in x) Object.hasOwn(x, k) && (g[k] = x[k]);
              }
              return g;
            }),
          e.apply(this, arguments)
        );
      },
    i =
      (gt && gt.__spreadArrays) ||
      function () {
        for (var g = 0, x = 0, _ = arguments.length; x < _; x++) g += arguments[x].length;
        for (var C = Array(g), k = 0, x = 0; x < _; x++)
          for (var A = arguments[x], P = 0, N = A.length; P < N; P++, k++) C[k] = A[P];
        return C;
      };
  Object.defineProperty(gt, "__esModule", { value: !0 });
  var r = [];
  function n(g) {
    var x = typeof g;
    return g !== null && (x === "object" || x === "function");
  }
  function o(g) {
    return Object.prototype.toString.call(g) === "[object RegExp]";
  }
  function f(g) {
    return Object.getOwnPropertySymbols(g).filter((x) =>
      Object.prototype.propertyIsEnumerable.call(g, x),
    );
  }
  function d(g, x, _) {
    _ === void 0 && (_ = "");
    var C = { indent: "	", singleQuotes: !0 },
      k = e(e({}, C), x),
      A;
    k.inlineCharacterLimit === void 0
      ? (A = {
          newLine: `
`,
          newLineOrSpace: `
`,
          pad: _,
          indent: _ + k.indent,
        })
      : (A = {
          newLine: "@@__PRETTY_PRINT_NEW_LINE__@@",
          newLineOrSpace: "@@__PRETTY_PRINT_NEW_LINE_OR_SPACE__@@",
          pad: "@@__PRETTY_PRINT_PAD__@@",
          indent: "@@__PRETTY_PRINT_INDENT__@@",
        });
    var P = (w) => {
      if (k.inlineCharacterLimit === void 0) return w;
      var B = w
        .replace(new RegExp(A.newLine, "g"), "")
        .replace(new RegExp(A.newLineOrSpace, "g"), " ")
        .replace(new RegExp(A.pad + "|" + A.indent, "g"), "");
      return B.length <= k.inlineCharacterLimit
        ? B
        : w
            .replace(
              new RegExp(A.newLine + "|" + A.newLineOrSpace, "g"),
              `
`,
            )
            .replace(new RegExp(A.pad, "g"), _)
            .replace(new RegExp(A.indent, "g"), _ + k.indent);
    };
    if (r.indexOf(g) !== -1) return '"[Circular]"';
    if (
      g == null ||
      typeof g == "number" ||
      typeof g == "boolean" ||
      typeof g == "function" ||
      typeof g == "symbol" ||
      o(g)
    )
      return String(g);
    if (g instanceof Date) return "new Date('" + g.toISOString() + "')";
    if (Array.isArray(g)) {
      if (g.length === 0) return "[]";
      r.push(g);
      var N =
        "[" +
        A.newLine +
        g
          .map((w, B) => {
            var M = g.length - 1 === B ? A.newLine : "," + A.newLineOrSpace,
              G = d(w, k, _ + k.indent);
            return k.transform && (G = k.transform(g, B, G)), A.indent + G + M;
          })
          .join("") +
        A.pad +
        "]";
      return r.pop(), P(N);
    }
    if (n(g)) {
      var E = i(Object.keys(g), f(g));
      if ((k.filter && (E = E.filter((B) => k.filter && k.filter(g, B))), E.length === 0))
        return "{}";
      r.push(g);
      var N =
        "{" +
        A.newLine +
        E.map((B, M) => {
          var G = E.length - 1 === M ? A.newLine : "," + A.newLineOrSpace,
            L = typeof B == "symbol",
            y = !L && /^[a-z$_][a-z$_0-9]*$/i.test(B.toString()),
            h = L || y ? B : d(B, k),
            I = d(g[B], k, _ + k.indent);
          return k.transform && (I = k.transform(g, B, I)), A.indent + String(h) + ": " + I + G;
        }).join("") +
        A.pad +
        "}";
      return r.pop(), P(N);
    }
    return (
      (g = String(g).replace(/[\r\n]/g, (w) =>
        w ===
        `
`
          ? "\\n"
          : "\\r",
      )),
      k.singleQuotes
        ? ((g = g.replace(/\\?'/g, "\\'")), "'" + g + "'")
        : ((g = g.replace(/"/g, '\\"')), '"' + g + '"')
    );
  }
  return (gt.prettyPrint = d), gt;
}
var Eo = Co(),
  Ji = { exports: {} },
  ge = {};
var bs;
function wo() {
  if (bs) return ge;
  bs = 1;
  var e = Symbol.for("react.element"),
    i = Symbol.for("react.portal"),
    r = Symbol.for("react.fragment"),
    n = Symbol.for("react.strict_mode"),
    o = Symbol.for("react.profiler"),
    f = Symbol.for("react.provider"),
    d = Symbol.for("react.context"),
    g = Symbol.for("react.server_context"),
    x = Symbol.for("react.forward_ref"),
    _ = Symbol.for("react.suspense"),
    C = Symbol.for("react.suspense_list"),
    k = Symbol.for("react.memo"),
    A = Symbol.for("react.lazy"),
    P = Symbol.for("react.offscreen"),
    N;
  N = Symbol.for("react.module.reference");
  function E(w) {
    if (typeof w == "object" && w !== null) {
      var B = w.$$typeof;
      switch (B) {
        case e:
          switch (((w = w.type), w)) {
            case r:
            case o:
            case n:
            case _:
            case C:
              return w;
            default:
              switch (((w = w && w.$$typeof), w)) {
                case g:
                case d:
                case x:
                case A:
                case k:
                case f:
                  return w;
                default:
                  return B;
              }
          }
        case i:
          return B;
      }
    }
  }
  return (
    (ge.ContextConsumer = d),
    (ge.ContextProvider = f),
    (ge.Element = e),
    (ge.ForwardRef = x),
    (ge.Fragment = r),
    (ge.Lazy = A),
    (ge.Memo = k),
    (ge.Portal = i),
    (ge.Profiler = o),
    (ge.StrictMode = n),
    (ge.Suspense = _),
    (ge.SuspenseList = C),
    (ge.isAsyncMode = () => !1),
    (ge.isConcurrentMode = () => !1),
    (ge.isContextConsumer = (w) => E(w) === d),
    (ge.isContextProvider = (w) => E(w) === f),
    (ge.isElement = (w) => typeof w == "object" && w !== null && w.$$typeof === e),
    (ge.isForwardRef = (w) => E(w) === x),
    (ge.isFragment = (w) => E(w) === r),
    (ge.isLazy = (w) => E(w) === A),
    (ge.isMemo = (w) => E(w) === k),
    (ge.isPortal = (w) => E(w) === i),
    (ge.isProfiler = (w) => E(w) === o),
    (ge.isStrictMode = (w) => E(w) === n),
    (ge.isSuspense = (w) => E(w) === _),
    (ge.isSuspenseList = (w) => E(w) === C),
    (ge.isValidElementType = (w) =>
      typeof w == "string" ||
      typeof w == "function" ||
      w === r ||
      w === o ||
      w === n ||
      w === _ ||
      w === C ||
      w === P ||
      (typeof w == "object" &&
        w !== null &&
        (w.$$typeof === A ||
          w.$$typeof === k ||
          w.$$typeof === f ||
          w.$$typeof === d ||
          w.$$typeof === x ||
          w.$$typeof === N ||
          w.getModuleId !== void 0))),
    (ge.typeOf = E),
    ge
  );
}
var Ss;
function ko() {
  return Ss || ((Ss = 1), (Ji.exports = wo())), Ji.exports;
}
var tt = ko(),
  ht = (e, i) => (e === 0 ? "" : new Array(e * i).fill(" ").join(""));
function ii(e) {
  "@babel/helpers - typeof";
  return (
    (ii =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? (i) => typeof i
        : (i) =>
            i && typeof Symbol == "function" && i.constructor === Symbol && i !== Symbol.prototype
              ? "symbol"
              : typeof i),
    ii(e)
  );
}
function _s(e) {
  return Ao(e) || Io(e) || Po(e) || To();
}
function Ao(e) {
  if (Array.isArray(e)) return tr(e);
}
function Io(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function Po(e, i) {
  if (e) {
    if (typeof e == "string") return tr(e, i);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return tr(e, i);
  }
}
function tr(e, i) {
  (i == null || i > e.length) && (i = e.length);
  for (var r = 0, n = new Array(i); r < i; r++) n[r] = e[r];
  return n;
}
function To() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ir(e, i) {
  return e === null ||
    ii(e) !== "object" ||
    e instanceof Date ||
    e instanceof RegExp ||
    kt.isValidElement(e)
    ? e
    : (i.add(e),
      Array.isArray(e)
        ? e.map((r) => ir(r, i))
        : Object.keys(e)
            .sort()
            .reduce(
              (r, n) => (
                n === "_owner" ||
                  (n === "current" || i.has(e[n]) ? (r[n] = "[Circular]") : (r[n] = ir(e[n], i))),
                r
              ),
              {},
            ));
}
function No(e) {
  return ir(e, new WeakSet());
}
var gn = (i) => ({ type: "string", value: i }),
  Lo = (i) => ({ type: "number", value: i }),
  Ro = (i, r, n, o) => ({
    type: "ReactElement",
    displayName: i,
    props: r,
    defaultProps: n,
    childrens: o,
  }),
  Oo = (i, r) => ({ type: "ReactFragment", key: i, childrens: r }),
  Vo = !!kt.Fragment,
  xn = (i) => (!i.name || i.name === "_default" ? "No Display Name" : i.name),
  Fo = function e(i) {
    switch (!0) {
      case !!i.displayName:
        return i.displayName;
      case i.$$typeof === tt.Memo:
        return e(i.type);
      case i.$$typeof === tt.ForwardRef:
        return e(i.render);
      default:
        return xn(i);
    }
  },
  Bo = (i) => {
    switch (!0) {
      case typeof i.type == "string":
        return i.type;
      case typeof i.type == "function":
        return i.type.displayName ? i.type.displayName : xn(i.type);
      case tt.isForwardRef(i):
      case tt.isMemo(i):
        return Fo(i.type);
      case tt.isContextConsumer(i):
        return "".concat(i.type._context.displayName || "Context", ".Consumer");
      case tt.isContextProvider(i):
        return "".concat(i.type._context.displayName || "Context", ".Provider");
      case tt.isLazy(i):
        return "Lazy";
      case tt.isProfiler(i):
        return "Profiler";
      case tt.isStrictMode(i):
        return "StrictMode";
      case tt.isSuspense(i):
        return "Suspense";
      default:
        return "UnknownElementType";
    }
  },
  Cs = (i, r) => r !== "children",
  Mo = (i) => i !== !0 && i !== !1 && i !== null && i !== "",
  Es = (i, r) => {
    var n = {};
    return (
      Object.keys(i)
        .filter((o) => r(i[o], o))
        .forEach((o) => (n[o] = i[o])),
      n
    );
  },
  vr = function e(i, r) {
    var n = r.displayName,
      o = n === void 0 ? Bo : n;
    if (typeof i == "string") return gn(i);
    if (typeof i == "number") return Lo(i);
    if (!Jt.isValidElement(i))
      throw new Error(
        "react-element-to-jsx-string: Expected a React.Element, got `".concat(ii(i), "`"),
      );
    var f = o(i),
      d = Es(i.props, Cs);
    i.ref !== null && (d.ref = i.ref);
    var g = i.key;
    typeof g == "string" && g.search(/^\./) && (d.key = g);
    var x = Es(i.type.defaultProps || {}, Cs),
      _ = Jt.Children.toArray(i.props.children)
        .filter(Mo)
        .map((C) => e(C, r));
    return Vo && i.type === kt.Fragment ? Oo(g, _) : Ro(f, d, x, _);
  };
function Do() {}
var jo = (i) =>
    i
      .toString()
      .split(`
`)
      .map((r) => r.trim())
      .join(""),
  ws = jo,
  vn = (e, i) => {
    var r = i.functionValue,
      n = r === void 0 ? ws : r,
      o = i.showFunctions;
    return n(!o && n === ws ? Do : e);
  },
  qo = (e, i, r, n) => {
    var o = No(e),
      f = Eo.prettyPrint(o, {
        transform: (g, x, _) => {
          var C = g[x];
          return C && kt.isValidElement(C)
            ? Ai(vr(C, n), !0, r, n)
            : typeof C == "function"
              ? vn(C, n)
              : _;
        },
      });
    return i
      ? f
          .replace(/\s+/g, " ")
          .replace(/{ /g, "{")
          .replace(/ }/g, "}")
          .replace(/\[ /g, "[")
          .replace(/ ]/g, "]")
      : f.replace(/\t/g, ht(1, n.tabStop)).replace(
          /\n([^$])/g,
          `
`.concat(ht(r + 1, n.tabStop), "$1"),
        );
  },
  Uo = (i) => i.replace(/"/g, "&quot;"),
  Go = (i, r, n, o) => {
    if (typeof i == "number") return "{".concat(String(i), "}");
    if (typeof i == "string") return '"'.concat(Uo(i), '"');
    if (ii(i) === "symbol") {
      var f = i
        .valueOf()
        .toString()
        .replace(/Symbol\((.*)\)/, "$1");
      return f ? "{Symbol('".concat(f, "')}") : "{Symbol()}";
    }
    return typeof i == "function"
      ? "{".concat(vn(i, o), "}")
      : kt.isValidElement(i)
        ? "{".concat(Ai(vr(i, o), !0, n, o), "}")
        : i instanceof Date
          ? isNaN(i.valueOf())
            ? "{new Date(NaN)}"
            : '{new Date("'.concat(i.toISOString(), '")}')
          : _o(i) || Array.isArray(i)
            ? "{".concat(qo(i, r, n, o), "}")
            : "{".concat(String(i), "}");
  },
  Wo = (e, i, r, n, o, f, d, g) => {
    if (!i && !n)
      throw new Error(
        'The prop "'.concat(e, '" has no value and no default: could not be formatted'),
      );
    var x = i ? r : o,
      _ = g.useBooleanShorthandSyntax,
      C = g.tabStop,
      k = Go(x, f, d, g),
      A = " ",
      P = `
`.concat(ht(d + 1, C)),
      N = k.includes(`
`);
    return (
      _ && k === "{false}" && !n
        ? ((A = ""), (P = ""))
        : _ && k === "{true}"
          ? ((A += "".concat(e)), (P += "".concat(e)))
          : ((A += "".concat(e, "=").concat(k)), (P += "".concat(e, "=").concat(k))),
      { attributeFormattedInline: A, attributeFormattedMultiline: P, isMultilineAttribute: N }
    );
  },
  zo = (e, i) => {
    var r = e.slice(0, e.length > 0 ? e.length - 1 : 0),
      n = e[e.length - 1];
    return (
      n &&
      (i.type === "string" || i.type === "number") &&
      (n.type === "string" || n.type === "number")
        ? r.push(gn(String(n.value) + String(i.value)))
        : (n && r.push(n), r.push(i)),
      r
    );
  },
  Ho = (i) => ["key", "ref"].includes(i),
  Qo = (e) => (i) => {
    var r = i.includes("key"),
      n = i.includes("ref"),
      o = i.filter((d) => !Ho(d)),
      f = _s(e ? o.sort() : o);
    return n && f.unshift("ref"), r && f.unshift("key"), f;
  };
function Ko(e, i) {
  return Array.isArray(i) ? (r) => i.indexOf(r) === -1 : (r) => i(e[r], r);
}
var Xo = (i, r, n, o, f) => {
    var d = f.tabStop;
    return i.type === "string"
      ? r
          .split(`
`)
          .map((g, x) => (x === 0 ? g : "".concat(ht(o, d)).concat(g)))
          .join(`
`)
      : r;
  },
  Jo = (i, r, n) => (o) => Xo(o, Ai(o, i, r, n), i, r, n),
  Yo = (i, r) => (n) => {
    var o = Object.keys(i).includes(n);
    return !o || (o && i[n] !== r[n]);
  },
  yn = (i, r, n, o, f) => (f ? ht(n, o).length + r.length > f : i.length > 1),
  Zo = (i, r, n, o, f, d, g) => (yn(i, r, f, d, g) || n) && !o,
  bn = (e, i, r, n) => {
    var o = e.type,
      f = e.displayName,
      d = f === void 0 ? "" : f,
      g = e.childrens,
      x = e.props,
      _ = x === void 0 ? {} : x,
      C = e.defaultProps,
      k = C === void 0 ? {} : C;
    if (o !== "ReactElement")
      throw new Error(
        'The "formatReactElementNode" function could only format node of type "ReactElement". Given:  '.concat(
          o,
        ),
      );
    var A = n.filterProps,
      P = n.maxInlineAttributesLineLength,
      N = n.showDefaultProps,
      E = n.sortProps,
      w = n.tabStop,
      B = "<".concat(d),
      M = B,
      G = B,
      L = !1,
      y = [],
      h = Ko(_, A);
    Object.keys(_)
      .filter(h)
      .filter(Yo(k, _))
      .forEach((Q) => y.push(Q)),
      Object.keys(k)
        .filter(h)
        .filter(() => N)
        .filter((Q) => !y.includes(Q))
        .forEach((Q) => y.push(Q));
    var I = Qo(E)(y);
    if (
      (I.forEach((Q) => {
        var H = Wo(Q, Object.keys(_).includes(Q), _[Q], Object.keys(k).includes(Q), k[Q], i, r, n),
          ee = H.attributeFormattedInline,
          K = H.attributeFormattedMultiline,
          J = H.isMultilineAttribute;
        J && (L = !0), (M += ee), (G += K);
      }),
      (G += `
`.concat(ht(r, w))),
      Zo(I, M, L, i, r, w, P) ? (B = G) : (B = M),
      g && g.length > 0)
    ) {
      var V = r + 1;
      (B += ">"),
        i ||
          ((B += `
`),
          (B += ht(V, w))),
        (B += g
          .reduce(zo, [])
          .map(Jo(i, V, n))
          .join(
            i
              ? ""
              : `
`.concat(ht(V, w)),
          )),
        i ||
          ((B += `
`),
          (B += ht(V - 1, w))),
        (B += "</".concat(d, ">"));
    } else yn(I, M, r, w, P) || (B += " "), (B += "/>");
    return B;
  },
  $o = "",
  ks = "React.Fragment",
  eu = (i, r, n) => {
    var o = {};
    return (
      r && (o = { key: r }),
      { type: "ReactElement", displayName: i, props: o, defaultProps: {}, childrens: n }
    );
  },
  tu = (i) => {
    var r = i.key;
    return !!r;
  },
  iu = (i) => {
    var r = i.childrens;
    return r.length === 0;
  },
  ru = (e, i, r, n) => {
    var o = e.type,
      f = e.key,
      d = e.childrens;
    if (o !== "ReactFragment")
      throw new Error(
        'The "formatReactFragmentNode" function could only format node of type "ReactFragment". Given: '.concat(
          o,
        ),
      );
    var g = n.useFragmentShortSyntax,
      x;
    return g ? (iu(e) || tu(e) ? (x = ks) : (x = $o)) : (x = ks), bn(eu(x, f, d), i, r, n);
  },
  su = ["<", ">", "{", "}"],
  nu = (i) => su.some((r) => i.includes(r)),
  au = (i) => (nu(i) ? "{`".concat(i, "`}") : i),
  ou = (i) => {
    var r = i;
    return (
      r.endsWith(" ") && (r = r.replace(/^(.*?)(\s+)$/, "$1{'$2'}")),
      r.startsWith(" ") && (r = r.replace(/^(\s+)(.*)$/, "{'$1'}$2")),
      r
    );
  },
  Ai = (e, i, r, n) => {
    if (e.type === "number") return String(e.value);
    if (e.type === "string") return e.value ? "".concat(ou(au(String(e.value)))) : "";
    if (e.type === "ReactElement") return bn(e, i, r, n);
    if (e.type === "ReactFragment") return ru(e, i, r, n);
    throw new TypeError('Unknow format type "'.concat(e.type, '"'));
  },
  uu = (e, i) => Ai(e, !1, 0, i),
  Zt = function (i) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = r.filterProps,
      o = n === void 0 ? [] : n,
      f = r.showDefaultProps,
      d = f === void 0 ? !0 : f,
      g = r.showFunctions,
      x = g === void 0 ? !1 : g,
      _ = r.functionValue,
      C = r.tabStop,
      k = C === void 0 ? 2 : C,
      A = r.useBooleanShorthandSyntax,
      P = A === void 0 ? !0 : A,
      N = r.useFragmentShortSyntax,
      E = N === void 0 ? !0 : N,
      w = r.sortProps,
      B = w === void 0 ? !0 : w,
      M = r.maxInlineAttributesLineLength,
      G = r.displayName;
    if (!i) throw new Error("react-element-to-jsx-string: Expected a ReactElement");
    var L = {
      filterProps: o,
      showDefaultProps: d,
      showFunctions: x,
      functionValue: _,
      tabStop: k,
      useBooleanShorthandSyntax: P,
      useFragmentShortSyntax: E,
      sortProps: B,
      maxInlineAttributesLineLength: M,
      displayName: G,
    };
    return uu(vr(i, L), L);
  };
const { defaultDecorateStory: hu, addons: lu, useEffect: cu } = __STORYBOOK_MODULE_PREVIEW_API__,
  { logger: xi } = __STORYBOOK_MODULE_CLIENT_LOGGER__;
function fu(e, i) {
  const r = e != null,
    n = i != null;
  if (!r && !n) return "";
  const o = [];
  if (r) {
    const f = e.map((d) => {
      const g = d.getPrettyName(),
        x = d.getTypeName();
      return x != null ? `${g}: ${x}` : g;
    });
    o.push(`(${f.join(", ")})`);
  } else o.push("()");
  return n && o.push(`=> ${i.getTypeName()}`), o.join(" ");
}
function pu(e, i) {
  const r = e != null,
    n = i != null;
  if (!r && !n) return "";
  const o = [];
  return r ? o.push("( ... )") : o.push("()"), n && o.push(`=> ${i.getTypeName()}`), o.join(" ");
}
function du(e) {
  return e.replace(
    /,/g,
    `,\r
`,
  );
}
var rr = "custom",
  oi = "object",
  yr = "array",
  mu = "class",
  Bt = "func",
  jt = "element";
function br(e) {
  return Ea.includes(e.toLowerCase());
}
var Sn = { format: { indent: { style: "  " }, semicolons: !1 } },
  gu = { ...Sn, format: { newline: "" } },
  xu = { ...Sn };
function xt(e, i = !1) {
  return Fa.generate(e, i ? gu : xu);
}
function sr(e, i = !1) {
  return i ? vu(e) : xt(e);
}
function vu(e) {
  let i = xt(e, !0);
  return i.endsWith(" }") || (i = `${i.slice(0, -1)} }`), i;
}
function As(e, i = !1) {
  return i ? bu(e) : yu(e);
}
function yu(e) {
  let i = xt(e);
  return i.endsWith("  }]") && (i = ga(i)), i;
}
function bu(e) {
  let i = xt(e, !0);
  return i.startsWith("[    ") && (i = i.replace("[    ", "[")), i;
}
var _n = (e) => e.$$typeof === Symbol.for("react.memo"),
  Su = (e) => e.$$typeof === Symbol.for("react.forward_ref"),
  Sr = { ...U, JSXElement: () => {} },
  _u = Te.extend(fo());
function ui(e) {
  return e != null ? e.name : null;
}
function Is(e) {
  return e.filter((i) => i.type === "ObjectExpression" || i.type === "ArrayExpression");
}
function Cn(e) {
  const i = [];
  return (
    po(
      e,
      {
        ObjectExpression(r, n) {
          i.push(Is(n).length);
        },
        ArrayExpression(r, n) {
          i.push(Is(n).length);
        },
      },
      Sr,
    ),
    Math.max(...i)
  );
}
function Cu(e) {
  return { inferredType: { type: "Identifier", identifier: ui(e) }, ast: e };
}
function Eu(e) {
  return { inferredType: { type: "Literal" }, ast: e };
}
function wu(e) {
  let i;
  mn(
    e.body,
    {
      JSXElement(o) {
        i = o;
      },
    },
    Sr,
  );
  const r = {
      type: i != null ? "Element" : "Function",
      params: e.params,
      hasParams: e.params.length !== 0,
    },
    n = ui(e.id);
  return n != null && (r.identifier = n), { inferredType: r, ast: e };
}
function ku(e) {
  let i;
  return (
    mn(
      e.body,
      {
        JSXElement(r) {
          i = r;
        },
      },
      Sr,
    ),
    { inferredType: { type: i != null ? "Element" : "Class", identifier: ui(e.id) }, ast: e }
  );
}
function Au(e) {
  const i = { type: "Element" },
    r = ui(e.openingElement.name);
  return r != null && (i.identifier = r), { inferredType: i, ast: e };
}
function Iu(e) {
  const i = e.callee.type === "MemberExpression" ? e.callee.property : e.callee;
  return ui(i) === "shape" ? En(e.arguments[0]) : null;
}
function En(e) {
  return { inferredType: { type: "Object", depth: Cn(e) }, ast: e };
}
function Pu(e) {
  return { inferredType: { type: "Array", depth: Cn(e) }, ast: e };
}
function Tu(e) {
  switch (e.type) {
    case "Identifier":
      return Cu(e);
    case "Literal":
      return Eu(e);
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      return wu(e);
    case "ClassExpression":
      return ku(e);
    case "JSXElement":
      return Au(e);
    case "CallExpression":
      return Iu(e);
    case "ObjectExpression":
      return En(e);
    case "ArrayExpression":
      return Pu(e);
    default:
      return null;
  }
}
function Nu(e) {
  let i = _u.parse(`(${e})`, { ecmaVersion: 2020 }),
    r = { inferredType: { type: "Unknown" }, ast: i };
  if (i.body[0] != null) {
    const n = i.body[0];
    if (n.type === "ExpressionStatement") {
      const o = Tu(n.expression);
      o != null && (r = o);
    }
  }
  return r;
}
function yt(e) {
  try {
    return { ...Nu(e) };
  } catch {}
  return { inferredType: { type: "Unknown" } };
}
var Lu = 150;
function Ve({ name: e, short: i, compact: r, full: n, inferredType: o }) {
  return { name: e, short: i, compact: r, full: n ?? i, inferredType: o };
}
function wn(e) {
  return e.replace(/PropTypes./g, "").replace(/.isRequired/g, "");
}
function Ps(e) {
  return e.split(/\r?\n/);
}
function bi(e, i = !1) {
  return wn(sr(e, i));
}
function Ts(e, i = !1) {
  return wn(xt(e, i));
}
function Ru(e) {
  switch (e) {
    case "Object":
      return oi;
    case "Array":
      return yr;
    case "Class":
      return mu;
    case "Function":
      return Bt;
    case "Element":
      return jt;
    default:
      return rr;
  }
}
function kn(e, i) {
  let { inferredType: r, ast: n } = yt(e),
    { type: o } = r,
    f,
    d,
    g;
  switch (o) {
    case "Identifier":
    case "Literal":
      (f = e), (d = e);
      break;
    case "Object": {
      const { depth: x } = r;
      (f = oi), (d = x === 1 ? bi(n, !0) : null), (g = bi(n));
      break;
    }
    case "Element": {
      const { identifier: x } = r;
      (f = x != null && !br(x) ? x : jt), (d = Ps(e).length === 1 ? e : null), (g = e);
      break;
    }
    case "Array": {
      const { depth: x } = r;
      (f = yr), (d = x <= 2 ? Ts(n, !0) : null), (g = Ts(n));
      break;
    }
    default:
      (f = Ru(o)), (d = Ps(e).length === 1 ? e : null), (g = e);
      break;
  }
  return Ve({ name: i, short: f, compact: d, full: g, inferredType: o });
}
function Ou({ raw: e }) {
  return e != null ? kn(e, "custom") : Ve({ name: "custom", short: rr, compact: rr });
}
function Vu(e) {
  const { jsDocTags: i } = e;
  return i != null && (i.params != null || i.returns != null)
    ? Ve({
        name: "func",
        short: pu(i.params, i.returns),
        compact: null,
        full: fu(i.params, i.returns),
      })
    : Ve({ name: "func", short: Bt, compact: Bt });
}
function Fu(e, i) {
  const r = Object.keys(e.value)
      .map((d) => `${d}: ${Mt(e.value[d], i).full}`)
      .join(", "),
    { inferredType: n, ast: o } = yt(`{ ${r} }`),
    { depth: f } = n;
  return Ve({
    name: "shape",
    short: oi,
    compact: f === 1 && o ? bi(o, !0) : null,
    full: o ? bi(o) : null,
  });
}
function Yi(e) {
  return `objectOf(${e})`;
}
function Bu(e, i) {
  const { short: r, compact: n, full: o } = Mt(e.value, i);
  return Ve({
    name: "objectOf",
    short: Yi(r),
    compact: n != null ? Yi(n) : null,
    full: o && Yi(o),
  });
}
function Mu(e, i) {
  if (Array.isArray(e.value)) {
    const r = e.value.reduce(
      (n, o) => {
        const { short: f, compact: d, full: g } = Mt(o, i);
        return n.short.push(f), n.compact.push(d), n.full.push(g), n;
      },
      { short: [], compact: [], full: [] },
    );
    return Ve({
      name: "union",
      short: r.short.join(" | "),
      compact: r.compact.every((n) => n != null) ? r.compact.join(" | ") : null,
      full: r.full.join(" | "),
    });
  }
  return Ve({ name: "union", short: e.value, compact: null });
}
function Du({ value: e, computed: i }) {
  return i ? kn(e, "enumvalue") : Ve({ name: "enumvalue", short: e, compact: e });
}
function ju(e) {
  if (Array.isArray(e.value)) {
    const i = e.value.reduce(
      (r, n) => {
        const { short: o, compact: f, full: d } = Du(n);
        return r.short.push(o), r.compact.push(f), r.full.push(d), r;
      },
      { short: [], compact: [], full: [] },
    );
    return Ve({
      name: "enum",
      short: i.short.join(" | "),
      compact: i.compact.every((r) => r != null) ? i.compact.join(" | ") : null,
      full: i.full.join(" | "),
    });
  }
  return Ve({ name: "enum", short: e.value, compact: e.value });
}
function nr(e) {
  return `${e}[]`;
}
function Ns(e) {
  return `[${e}]`;
}
function Ls(e, i, r) {
  return Ve({ name: "arrayOf", short: nr(e), compact: i != null ? Ns(i) : null, full: r && Ns(r) });
}
function qu(e, i) {
  const { name: r, short: n, compact: o, full: f, inferredType: d } = Mt(e.value, i);
  if (r === "custom") {
    if (d === "Object") return Ls(n, o, f);
  } else if (r === "shape") return Ls(n, o, f);
  return Ve({ name: "arrayOf", short: nr(n), compact: nr(n) });
}
function Mt(e, i) {
  try {
    switch (e.name) {
      case "custom":
        return Ou(e);
      case "func":
        return Vu(i);
      case "shape":
        return Fu(e, i);
      case "instanceOf":
        return Ve({ name: "instanceOf", short: e.value, compact: e.value });
      case "objectOf":
        return Bu(e, i);
      case "union":
        return Mu(e, i);
      case "enum":
        return ju(e);
      case "arrayOf":
        return qu(e, i);
      default:
        return Ve({ name: e.name, short: e.name, compact: e.name });
    }
  } catch (r) {
    console.error(r);
  }
  return Ve({ name: "unknown", short: "unknown", compact: "unknown" });
}
function Uu(e) {
  const { type: i } = e.docgenInfo;
  if (i == null) return null;
  try {
    switch (i.name) {
      case "custom":
      case "shape":
      case "instanceOf":
      case "objectOf":
      case "union":
      case "enum":
      case "arrayOf": {
        const { short: r, compact: n, full: o } = Mt(i, e);
        return n != null && !pa(n) ? be(n) : o ? be(r, o) : be(r);
      }
      case "func": {
        let { short: r, full: n } = Mt(i, e),
          o = r,
          f;
        return n && n.length < Lu ? (o = n) : n && (f = du(n)), be(o, f);
      }
      default:
        return null;
    }
  } catch (r) {
    console.error(r);
  }
  return null;
}
function An({ inferredType: e, ast: i }) {
  const { depth: r } = e;
  if (r === 1) {
    const n = sr(i, !0);
    if (!ri(n)) return be(n);
  }
  return be(oi, sr(i));
}
function In({ inferredType: e, ast: i }) {
  const { depth: r } = e;
  if (r <= 2) {
    const n = As(i, !0);
    if (!ri(n)) return be(n);
  }
  return be(yr, As(i));
}
function _r(e, i) {
  return i ? `${e}( ... )` : `${e}()`;
}
function Ii(e) {
  return `<${e} />`;
}
function Pn(e) {
  const { type: i, identifier: r } = e;
  switch (i) {
    case "Function":
      return _r(r, e.hasParams);
    case "Element":
      return Ii(r);
    default:
      return r;
  }
}
function Gu({ inferredType: e, ast: i }) {
  const { identifier: r } = e;
  if (r != null) return be(Pn(e), xt(i));
  const n = xt(i, !0);
  return ri(n) ? be(Bt, xt(i)) : be(n);
}
function Wu(e, i) {
  const { inferredType: r } = i,
    { identifier: n } = r;
  if (n != null && !br(n)) {
    const o = Pn(r);
    return be(o, e);
  }
  return ri(e) ? be(jt, e) : be(e);
}
function Tn(e) {
  try {
    const i = yt(e);
    switch (i.inferredType.type) {
      case "Object":
        return An(i);
      case "Function":
        return Gu(i);
      case "Element":
        return Wu(e, i);
      case "Array":
        return In(i);
      default:
        return null;
    }
  } catch (i) {
    console.error(i);
  }
  return null;
}
function Nn(e) {
  return e.$$typeof != null;
}
function Ln(e, i) {
  const { name: r } = e;
  return r !== "" && r !== "anonymous" && r !== i ? r : null;
}
var zu = (e) => be(JSON.stringify(e));
function Hu(e) {
  const { type: i } = e,
    { displayName: r } = i,
    n = Zt(e, {});
  if (r != null) {
    const o = Ii(r);
    return be(o, n);
  }
  if (So(i) && br(i)) {
    const o = Zt(e, { tabStop: 0 }).replace(/\r?\n|\r/g, "");
    if (!ri(o)) return be(o);
  }
  return be(jt, n);
}
var Qu = (e) => {
    if (Nn(e) && e.type != null) return Hu(e);
    if (xo(e)) {
      const i = yt(JSON.stringify(e));
      return An(i);
    }
    if (Array.isArray(e)) {
      const i = yt(JSON.stringify(e));
      return In(i);
    }
    return be(oi);
  },
  Ku = (e, i) => {
    let r = !1,
      n;
    if (gs(e.render)) r = !0;
    else if (e.prototype != null && gs(e.prototype.render)) r = !0;
    else {
      let f;
      try {
        n = yt(e.toString());
        const { hasParams: d, params: g } = n.inferredType;
        d ? g.length === 1 && g[0].type === "ObjectPattern" && (f = e({})) : (f = e()),
          f != null && Nn(f) && (r = !0);
      } catch {}
    }
    const o = Ln(e, i.name);
    if (o != null) {
      if (r) return be(Ii(o));
      n != null && (n = yt(e.toString()));
      const { hasParams: f } = n.inferredType;
      return be(_r(o, f));
    }
    return be(r ? jt : Bt);
  },
  Xu = (e) => be(e.toString()),
  Rn = { string: zu, object: Qu, function: Ku, default: Xu };
function Ju(e = {}) {
  return { ...Rn, ...e };
}
function Yu(e, i, r = Rn) {
  try {
    switch (typeof e) {
      case "string":
        return r.string(e, i);
      case "object":
        return r.object(e, i);
      case "function":
        return r.function(e, i);
      default:
        return r.default(e, i);
    }
  } catch (n) {
    console.error(n);
  }
  return null;
}
function Zu(e, i) {
  const { propTypes: r } = i;
  return r != null
    ? Object.keys(r)
        .map((n) => e.find((o) => o.name === n))
        .filter(Boolean)
    : e;
}
var $u = (e, { name: i, type: r }) => {
    const n = r?.summary === "element" || r?.summary === "elementType",
      o = Ln(e, i);
    if (o != null) {
      if (n) return be(Ii(o));
      const { hasParams: f } = yt(e.toString()).inferredType;
      return be(_r(o, f));
    }
    return be(n ? jt : Bt);
  },
  eh = Ju({ function: $u });
function th(e, i) {
  const { propDef: r } = e,
    n = Uu(e);
  n != null && (r.type = n);
  const { defaultValue: o } = e.docgenInfo;
  if (o != null && o.value != null) {
    const f = Tn(o.value);
    f != null && (r.defaultValue = f);
  } else if (i != null) {
    const f = Yu(i, r, eh);
    f != null && (r.defaultValue = f);
  }
  return r;
}
function ih(e, i) {
  const r = i.defaultProps != null ? i.defaultProps : {},
    n = e.map((o) => th(o, r[o.propDef.name]));
  return Zu(n, i);
}
function rh(e, i) {
  const { propDef: r } = e,
    { defaultValue: n } = e.docgenInfo;
  if (n != null && n.value != null) {
    const o = Tn(n.value);
    o != null && (r.defaultValue = o);
  }
  return r;
}
function sh(e) {
  return e.map((i) => rh(i));
}
var Rs = new Map();
Object.keys(Qr).forEach((e) => {
  const i = Qr[e];
  Rs.set(i, e), Rs.set(i.isRequired, e);
});
function nh(e, i) {
  let r = e;
  !ca(e) && !e.propTypes && _n(e) && (r = e.type);
  const n = fa(r, i);
  if (n.length === 0) return [];
  switch (n[0].typeSystem) {
    case Gr.JAVASCRIPT:
      return ih(n, e);
    case Gr.TYPESCRIPT:
      return sh(n);
    default:
      return n.map((o) => o.propDef);
  }
}
var ah = (e) => ({ rows: nh(e, "props") }),
  oh = (e) => {
    if (e) {
      const { rows: i } = ah(e);
      if (i)
        return i.reduce((r, n) => {
          const {
            name: o,
            description: f,
            type: d,
            sbType: g,
            defaultValue: x,
            jsDocTags: _,
            required: C,
          } = n;
          return (
            (r[o] = {
              name: o,
              description: f,
              type: { required: C, ...g },
              table: { type: d, jsDocTags: _, defaultValue: x },
            }),
            r
          );
        }, {});
    }
    return null;
  },
  uh = (e) => e.charAt(0).toUpperCase() + e.slice(1),
  hh = (e) =>
    e
      .toString()
      .replace(/^Symbol\((.*)\)$/, "$1")
      .split(".")
      .map((i) => i.split("_").map(uh).join(""))
      .join(".");
function ar(e) {
  if (kt.isValidElement(e)) {
    const i = Object.keys(e.props).reduce((r, n) => ((r[n] = ar(e.props[n])), r), {});
    return { ...e, props: i, _owner: null };
  }
  return Array.isArray(e) ? e.map(ar) : e;
}
var lh = (e, i) => {
    if (typeof e > "u") return xi.warn("Too many skip or undefined component"), null;
    let r = e,
      n = r.type;
    for (let d = 0; d < i?.skip; d += 1) {
      if (typeof r > "u") return xi.warn("Cannot skip undefined element"), null;
      if (Jt.Children.count(r) > 1) return xi.warn("Trying to skip an array of elements"), null;
      typeof r.props.children > "u"
        ? (xi.warn("Not enough children to skip elements."),
          typeof r.type == "function" &&
            r.type.name === "" &&
            (r = Jt.createElement(n, { ...r.props })))
        : typeof r.props.children == "function"
          ? (r = r.props.children())
          : (r = r.props.children);
    }
    let o;
    typeof i?.displayName == "string"
      ? (o = { showFunctions: !0, displayName: () => i.displayName })
      : (o = {
          displayName: (d) =>
            d.type.displayName || typeof d.type == "symbol"
              ? hh(d.type)
              : da(d.type, "displayName") ||
                (d.type.name !== "_default" ? d.type.name : null) ||
                (typeof d.type == "function" ? "No Display Name" : null) ||
                (Su(d.type) ? d.type.render.name : null) ||
                (_n(d.type) ? d.type.type.name : null) ||
                d.type,
        });
    const f = { ...o, filterProps: (d, g) => d !== void 0, ...i };
    return Jt.Children.map(e, (d) => {
      let g = typeof d == "number" ? d.toString() : d,
        x = (typeof Zt == "function" ? Zt : Zt.default)(ar(g), f);
      if (x.indexOf("&quot;") > -1) {
        const _ = x.match(/\S+=\\"([^"]*)\\"/g);
        _ &&
          _.forEach((C) => {
            x = x.replace(C, C.replace(/&quot;/g, "'"));
          });
      }
      return x;
    })
      .join(`
`)
      .replace(/function\s+noRefCheck\(\)\s*\{\}/g, "() => {}");
  },
  ch = { skip: 0, showFunctions: !1, enableBeautify: !0, showDefaultProps: !1 },
  fh = (e) => {
    const i = e?.parameters.docs?.source,
      r = e?.parameters.__isArgsStory;
    return i?.type === Ur.DYNAMIC ? !1 : !r || i?.code || i?.type === Ur.CODE;
  },
  ph = (e) => e.type?.displayName === "MDXCreateElement" && !!e.props?.mdxType,
  On = (e) => {
    if (!ph(e)) return e;
    let { mdxType: i, originalType: r, children: n, ...o } = e.props,
      f = [];
    return n && (f = (Array.isArray(n) ? n : [n]).map(On)), kt.createElement(r, o, ...f);
  },
  Vn = (e, i) => {
    let r = lu.getChannel(),
      n = fh(i),
      o = "";
    cu(() => {
      if (!n) {
        const { id: C, unmappedArgs: k } = i;
        r.emit(la, { id: C, source: o, args: k });
      }
    });
    const f = e();
    if (n) return f;
    const d = { ...ch, ...(i?.parameters.jsx || {}) },
      g = i?.parameters.docs?.source?.excludeDecorators ? i.originalStoryFn(i.args, i) : f,
      x = On(g),
      _ = lh(x, d);
    return _ && (o = _), f;
  },
  xh = (e, i) => {
    const r = i.findIndex((o) => o.originalFn === Vn),
      n = r === -1 ? i : [...i.splice(r, 1), ...i];
    return hu(e, n);
  },
  vh = { docs: { story: { inline: !0 }, extractArgTypes: oh, extractComponentDescription: ha } },
  yh = [Vn],
  bh = [ua];
export { xh as applyDecorators, bh as argTypesEnhancers, yh as decorators, vh as parameters };
