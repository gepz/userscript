// ==UserScript==
// @name Flow Youtube Chat
// @description Youtubeのチャットをニコニコ風に画面上へ流す(再アップ) Make youtube chats move in danmaku-style.
// @version 1.16.1
// @match https://www.youtube.com/*
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @grant GM.setClipboard
// @license AGPL-3.0-or-later
// @namespace FlowYoutubeChatScript
// @noframes
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11.7.3/dist/sweetalert2.all.min.js#sha384-/Wx1NuqlgALfa1Do1U6Mer7quEDHOo8REf/0izoIrV8Y3Z/gtEHQc01STCEMM1LZ
// @require https://unpkg.com/loglevel@1.8.1/dist/loglevel.min.js#sha384-Xv9RQU8lNizXGKl6BAyZjpzyUqh9/tgSO1XVnCQMy11vKJ/eBu6aCEf88WqGwElT
// @require https://unpkg.com/rxjs@7.8.0/dist/bundles/rxjs.umd.min.js#sha384-jmg+DzMpc702jevWhETvz7gFleL89oF07xs35HZcjTuKhYi8znKw4fKQOi5EUQo9
// @require https://unpkg.com/mithril@2.2.2/mithril.min.js#sha384-60kek02kUAH+DNSgj7HCtrpcirTroG3uWnDpsdvoAl2Z9Xe3GdpXDSy4ouNMHoBZ
// @require https://cdn.jsdelivr.net/npm/deep-diff@1.0.2/index.min.js#sha384-Q/uiWfFlwn9XjOpL49VpFKn01EkScmaC3hh1prAn7S++WoZgXRrrjQvZ7cI7C7Zn
// @require https://cdn.jsdelivr.net/npm/astring@1.8.4/dist/astring.min.js#sha384-WfNZenKd6kEjcIYQ2WtJNczMVjVwKo5RAxGNdUnNHQjqLKMcDl1pAZT5Jqsp9raN
// @require https://cdn.jsdelivr.net/npm/jsep@1.3.8/dist/iife/jsep.iife.min.js#sha384-+qoPWZXQFfQjGhA9c2VU3zim4HqVm3e0uUJfnGXUp4sw3jolc2fsQ1bqEo1yOics
// @require https://cdn.jsdelivr.net/npm/hash-it@6.0.0/dist/min/index.js#sha384-kqUFMXizyaodUGfm0UszFxndXukhSB/yEpOt+q9w/RgjyOK0wz9gXoEYb2FW1/ex
// @require https://cdn.jsdelivr.net/npm/micro-memoize@4.0.14/dist/micro-memoize.min.js#sha384-W1hqD6GTNQ97ZqDR18GhfU1G9qcDLs4sL7BPYND2ncvGNNiLUmUp37Ph+hzm+OPt
// @require https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js#sha384-0d+Gr7vM4Drod8E3hXKgciWJSWbjD/opKLLygI9ktiWbuvlDwQLzU46wJ9s5gsp7
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/411442/Flow%20Youtube%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/411442/Flow%20Youtube%20Chat.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

;(() => {
	var __webpack_modules__ = {
			204: module => {
				"use strict"
				module.exports = function equal(a, b) {
					if (a === b) return !0
					if (a && b && "object" == typeof a && "object" == typeof b) {
						if (a.constructor !== b.constructor) return !1
						var length, i, keys
						if (Array.isArray(a)) {
							if ((length = a.length) != b.length) return !1
							for (i = length; 0 != i--; ) if (!equal(a[i], b[i])) return !1
							return !0
						}
						if (a.constructor === RegExp)
							return a.source === b.source && a.flags === b.flags
						if (a.valueOf !== Object.prototype.valueOf)
							return a.valueOf() === b.valueOf()
						if (a.toString !== Object.prototype.toString)
							return a.toString() === b.toString()
						if (
							(length = (keys = Object.keys(a)).length) !==
							Object.keys(b).length
						)
							return !1
						for (i = length; 0 != i--; )
							if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return !1
						for (i = length; 0 != i--; ) {
							var key = keys[i]
							if (!equal(a[key], b[key])) return !1
						}
						return !0
					}
					return a != a && b != b
				}
			},
			52: (__unused_webpack_module, exports) => {
				"use strict"
				exports.Xd = exports.hu = exports.tE = void 0
				const expectedToBe = type => `expected to be ${type}`
				exports.tE = (condition, message) => {
					if (!condition) throw new TypeError(message)
				}
				let baseAssert = exports.tE
				exports.hu = (condition, message) => baseAssert(condition, message)
				exports.Xd = function (
					input,
					message = expectedToBe("neither null nor undefined")
				) {
					;(0, exports.hu)(null != input, message)
				}
			},
			694: module => {
				module.exports = (function (e) {
					var r = {}
					function t(n) {
						if (r[n]) return r[n].exports
						var a = (r[n] = { i: n, l: !1, exports: {} })
						return e[n].call(a.exports, a, a.exports, t), (a.l = !0), a.exports
					}
					return (
						(t.m = e),
						(t.c = r),
						(t.d = function (e, r, n) {
							t.o(e, r) ||
								Object.defineProperty(e, r, { enumerable: !0, get: n })
						}),
						(t.r = function (e) {
							"undefined" != typeof Symbol &&
								Symbol.toStringTag &&
								Object.defineProperty(e, Symbol.toStringTag, {
									value: "Module",
								}),
								Object.defineProperty(e, "__esModule", { value: !0 })
						}),
						(t.t = function (e, r) {
							if ((1 & r && (e = t(e)), 8 & r)) return e
							if (4 & r && "object" == typeof e && e && e.__esModule) return e
							var n = Object.create(null)
							if (
								(t.r(n),
								Object.defineProperty(n, "default", {
									enumerable: !0,
									value: e,
								}),
								2 & r && "string" != typeof e)
							)
								for (var a in e)
									t.d(
										n,
										a,
										function (r) {
											return e[r]
										}.bind(null, a)
									)
							return n
						}),
						(t.n = function (e) {
							var r =
								e && e.__esModule
									? function () {
											return e.default
									  }
									: function () {
											return e
									  }
							return t.d(r, "a", r), r
						}),
						(t.o = function (e, r) {
							return Object.prototype.hasOwnProperty.call(e, r)
						}),
						(t.p = ""),
						t((t.s = 0))
					)
				})([
					function (e, r, t) {
						"use strict"
						t.r(r),
							t.d(r, "validateHTMLColorName", function () {
								return l
							}),
							t.d(r, "validateHTMLColorSpecialName", function () {
								return i
							}),
							t.d(r, "validateHTMLColorHex", function () {
								return u
							}),
							t.d(r, "validateHTMLColorRgb", function () {
								return g
							}),
							t.d(r, "validateHTMLColorHsl", function () {
								return y
							}),
							t.d(r, "validateHTMLColorHwb", function () {
								return L
							}),
							t.d(r, "validateHTMLColorLab", function () {
								return S
							}),
							t.d(r, "validateHTMLColorLch", function () {
								return m
							}),
							t.d(r, "validateHTMLColor", function () {
								return G
							})
						const n = e => e && "string" == typeof e,
							a = [
								"AliceBlue",
								"AntiqueWhite",
								"Aqua",
								"Aquamarine",
								"Azure",
								"Beige",
								"Bisque",
								"Black",
								"BlanchedAlmond",
								"Blue",
								"BlueViolet",
								"Brown",
								"BurlyWood",
								"CadetBlue",
								"Chartreuse",
								"Chocolate",
								"Coral",
								"CornflowerBlue",
								"Cornsilk",
								"Crimson",
								"Cyan",
								"DarkBlue",
								"DarkCyan",
								"DarkGoldenrod",
								"DarkGray",
								"DarkGrey",
								"DarkGreen",
								"DarkKhaki",
								"DarkMagenta",
								"DarkOliveGreen",
								"DarkOrange",
								"DarkOrchid",
								"DarkRed",
								"DarkSalmon",
								"DarkSeaGreen",
								"DarkSlateBlue",
								"DarkSlateGray",
								"DarkSlateGrey",
								"DarkTurquoise",
								"DarkViolet",
								"DeepPink",
								"DeepSkyBlue",
								"DimGray",
								"DimGrey",
								"DodgerBlue",
								"FireBrick",
								"FloralWhite",
								"ForestGreen",
								"Fuchsia",
								"Gainsboro",
								"GhostWhite",
								"Gold",
								"Goldenrod",
								"Gray",
								"Grey",
								"Green",
								"GreenYellow",
								"HoneyDew",
								"HotPink",
								"IndianRed",
								"Indigo",
								"Ivory",
								"Khaki",
								"Lavender",
								"LavenderBlush",
								"LawnGreen",
								"LemonChiffon",
								"LightBlue",
								"LightCoral",
								"LightCyan",
								"LightGoldenrodYellow",
								"LightGray",
								"LightGrey",
								"LightGreen",
								"LightPink",
								"LightSalmon",
								"LightSalmon",
								"LightSeaGreen",
								"LightSkyBlue",
								"LightSlateGray",
								"LightSlateGrey",
								"LightSteelBlue",
								"LightYellow",
								"Lime",
								"LimeGreen",
								"Linen",
								"Magenta",
								"Maroon",
								"MediumAquamarine",
								"MediumBlue",
								"MediumOrchid",
								"MediumPurple",
								"MediumSeaGreen",
								"MediumSlateBlue",
								"MediumSlateBlue",
								"MediumSpringGreen",
								"MediumTurquoise",
								"MediumVioletRed",
								"MidnightBlue",
								"MintCream",
								"MistyRose",
								"Moccasin",
								"NavajoWhite",
								"Navy",
								"OldLace",
								"Olive",
								"OliveDrab",
								"Orange",
								"OrangeRed",
								"Orchid",
								"PaleGoldenrod",
								"PaleGreen",
								"PaleTurquoise",
								"PaleVioletRed",
								"PapayaWhip",
								"PeachPuff",
								"Peru",
								"Pink",
								"Plum",
								"PowderBlue",
								"Purple",
								"RebeccaPurple",
								"Red",
								"RosyBrown",
								"RoyalBlue",
								"SaddleBrown",
								"Salmon",
								"SandyBrown",
								"SeaGreen",
								"SeaShell",
								"Sienna",
								"Silver",
								"SkyBlue",
								"SlateBlue",
								"SlateGray",
								"SlateGrey",
								"Snow",
								"SpringGreen",
								"SteelBlue",
								"Tan",
								"Teal",
								"Thistle",
								"Tomato",
								"Turquoise",
								"Violet",
								"Wheat",
								"White",
								"WhiteSmoke",
								"Yellow",
								"YellowGreen",
							],
							o = ["currentColor", "inherit", "transparent"],
							l = e => {
								let r = !1
								return (
									n(e) &&
										a.map(
											t => (
												e.toLowerCase() === t.toLowerCase() && (r = !0), null
											)
										),
									r
								)
							},
							i = e => {
								let r = !1
								return (
									n(e) &&
										o.map(
											t => (
												e.toLowerCase() === t.toLowerCase() && (r = !0), null
											)
										),
									r
								)
							},
							u = e =>
								!!n(e) &&
								e &&
								/^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i.test(e),
							d = "(([\\d]{0,5})((\\.([\\d]{1,5}))?))",
							s = `(${d}%)`,
							c = "(([0-9]|[1-9][0-9]|100)%)",
							f = `(${c}|(0?((\\.([\\d]{1,5}))?))|1)`,
							h = `([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?)([\\s]{1,5})(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?([\\s]{0,5})\\)`,
							$ =
								"(-?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360)(deg)?)",
							g = e => {
								if (n(e)) {
									const r = "([\\s]{0,5})([\\d]{1,5})%?([\\s]{0,5}),?",
										t = "((([\\s]{0,5}),?([\\s]{0,5}))|(([\\s]{1,5})))",
										n = new RegExp(
											`^(rgb)a?\\(${r}${t}${r}${t}${r}${t}((\\/?([\\s]{0,5})(0?\\.?([\\d]{1,5})%?([\\s]{0,5}))?|1|0))?\\)$`
										)
									return e && n.test(e)
								}
								return !1
							},
							y = e => {
								if (n(e)) {
									const r = new RegExp(
										`^(hsl)a?\\((([\\s]{0,5})(${$}|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)grad)|((([0-5])?\\.([\\d]{1,5})|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)|((0?((\\.([\\d]{1,5}))?)|1)turn))((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?|,?)([\\s]{0,5})(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?\\)$`
									)
									return e && r.test(e)
								}
								return !1
							},
							L = e => {
								if (n(e)) {
									const r = new RegExp(
										`^(hwb\\(([\\s]{0,5})${$}([\\s]{1,5}))((0|${c})([\\s]{1,5}))((0|${c})${h}$`
									)
									return e && r.test(e)
								}
								return !1
							},
							S = e => {
								if (n(e)) {
									const r =
											"(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])((\\.([\\d]{1,5}))?)?|160))",
										t = new RegExp(
											`^(lab\\(([\\s]{0,5})${s}([\\s]{1,5})${r}([\\s]{1,5})${r}${h}$`
										)
									return e && t.test(e)
								}
								return !1
							},
							m = e => {
								if (n(e)) {
									const o = new RegExp(
										`^lch\\((([\\s]{0,5})((([0-9]|[1-9][0-9])?((\\.([\\d]{1,5}))?)|100)(%)?)([\\s]{1,5})${
											"" + d
										}([\\s]{1,5})((${$})|(0|${f})|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360))([\\s]{0,5})((\\/([\\s]{0,5})${f}))?)\\)$`
									)
									return e && o.test(e)
								}
								return !1
							},
							G = e => !!((e && u(e)) || g(e) || y(e) || L(e) || S(e) || m(e))
						r.default = e =>
							!!(
								(e && u(e)) ||
								l(e) ||
								i(e) ||
								g(e) ||
								y(e) ||
								L(e) ||
								S(e) ||
								m(e)
							)
					},
				])
			},
		},
		__webpack_module_cache__ = {}
	function __webpack_require__(moduleId) {
		var cachedModule = __webpack_module_cache__[moduleId]
		if (void 0 !== cachedModule) return cachedModule.exports
		var module = (__webpack_module_cache__[moduleId] = { exports: {} })
		__webpack_modules__[moduleId](module, module.exports, __webpack_require__)
		return module.exports
	}
	__webpack_require__.n = module => {
		var getter =
			module && module.__esModule ? () => module.default : () => module
		__webpack_require__.d(getter, { a: getter })
		return getter
	}
	__webpack_require__.d = (exports, definition) => {
		for (var key in definition)
			__webpack_require__.o(definition, key) &&
				!__webpack_require__.o(exports, key) &&
				Object.defineProperty(exports, key, {
					enumerable: !0,
					get: definition[key],
				})
	}
	__webpack_require__.o = (obj, prop) =>
		Object.prototype.hasOwnProperty.call(obj, prop)
	;(() => {
		"use strict"
		const Function_dual = (arity, body) => {
				const isDataFirst =
					"number" == typeof arity ? args => args.length >= arity : arity
				return function () {
					return isDataFirst(arguments)
						? body.apply(this, arguments)
						: self => body(self, ...arguments)
				}
			},
			apply = a => self => self(a),
			Function_identity = a => a,
			constant = value => () => value,
			Function_constTrue = constant(!0),
			Function_constFalse = constant(!1),
			Function_constUndefined = constant(void 0),
			Function_constVoid = Function_constUndefined,
			flip =
				f =>
				(...b) =>
				(...a) =>
					f(...a)(...b)
		function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
			switch (arguments.length) {
				case 1:
					return ab
				case 2:
					return function () {
						return bc(ab.apply(this, arguments))
					}
				case 3:
					return function () {
						return cd(bc(ab.apply(this, arguments)))
					}
				case 4:
					return function () {
						return de(cd(bc(ab.apply(this, arguments))))
					}
				case 5:
					return function () {
						return ef(de(cd(bc(ab.apply(this, arguments)))))
					}
				case 6:
					return function () {
						return fg(ef(de(cd(bc(ab.apply(this, arguments))))))
					}
				case 7:
					return function () {
						return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))
					}
				case 8:
					return function () {
						return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))))
					}
				case 9:
					return function () {
						return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))))
					}
			}
		}
		function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
			switch (arguments.length) {
				case 1:
					return a
				case 2:
					return ab(a)
				case 3:
					return bc(ab(a))
				case 4:
					return cd(bc(ab(a)))
				case 5:
					return de(cd(bc(ab(a))))
				case 6:
					return ef(de(cd(bc(ab(a)))))
				case 7:
					return fg(ef(de(cd(bc(ab(a))))))
				case 8:
					return gh(fg(ef(de(cd(bc(ab(a)))))))
				case 9:
					return hi(gh(fg(ef(de(cd(bc(ab(a))))))))
				default: {
					let ret = arguments[0]
					for (let i = 1; i < arguments.length; i++) ret = arguments[i](ret)
					return ret
				}
			}
		}
		const imap = map => Function_dual(3, (self, to, _) => map(self, to)),
			let_ = F =>
				Function_dual(3, (self, name, f) =>
					F.map(self, a => Object.assign({}, a, { [name]: f(a) }))
				),
			letDiscard = F =>
				Function_dual(3, (self, name, b) =>
					F.map(self, a => Object.assign({}, a, { [name]: b }))
				),
			globalStoreId = Symbol.for("@effect/data/Global/globalStoreId")
		globalStoreId in globalThis || (globalThis[globalStoreId] = new Map())
		const globalStore = globalThis[globalStoreId],
			globalValue = (id, compute) => {
				globalStore.has(id) || globalStore.set(id, compute())
				return globalStore.get(id)
			}
		function isNothing(value) {
			return null == value
		}
		class PCGRandom {
			constructor(seedHi, seedLo, incHi, incLo) {
				if (isNothing(seedLo) && isNothing(seedHi)) {
					seedLo = (4294967295 * Math.random()) >>> 0
					seedHi = 0
				} else if (isNothing(seedLo)) {
					seedLo = seedHi
					seedHi = 0
				}
				if (isNothing(incLo) && isNothing(incHi)) {
					incLo = this._state ? this._state[3] : 4150755663
					incHi = this._state ? this._state[2] : 335903614
				} else if (isNothing(incLo)) {
					incLo = incHi
					incHi = 0
				}
				this._state = new Int32Array([
					0,
					0,
					incHi >>> 0,
					(1 | (incLo || 0)) >>> 0,
				])
				this._next()
				add64(
					this._state,
					this._state[0],
					this._state[1],
					seedHi >>> 0,
					seedLo >>> 0
				)
				this._next()
				return this
			}
			getState() {
				return [this._state[0], this._state[1], this._state[2], this._state[3]]
			}
			setState(state) {
				this._state[0] = state[0]
				this._state[1] = state[1]
				this._state[2] = state[2]
				this._state[3] = 1 | state[3]
			}
			integer(max) {
				if (!max) return this._next()
				if (0 == ((max >>>= 0) & (max - 1))) return this._next() & (max - 1)
				let num = 0
				const skew = (-max >>> 0) % max >>> 0
				for (num = this._next(); num < skew; num = this._next());
				return num % max
			}
			number() {
				return (
					(1 * (67108863 & this._next()) * 134217728 +
						1 * (134217727 & this._next())) /
					9007199254740992
				)
			}
			_next() {
				const oldHi = this._state[0] >>> 0,
					oldLo = this._state[1] >>> 0
				!(function (out, aHi, aLo, bHi, bLo) {
					let c1 = (32557 * (aLo >>> 16)) >>> 0,
						c0 = (19605 * (65535 & aLo)) >>> 0,
						lo = (32557 * (65535 & aLo)) >>> 0,
						hi = (19605 * (aLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16))) >>> 0
					c0 = (c0 << 16) >>> 0
					lo = (lo + c0) >>> 0
					lo >>> 0 < c0 >>> 0 && (hi = (hi + 1) >>> 0)
					c1 = (c1 << 16) >>> 0
					lo = (lo + c1) >>> 0
					lo >>> 0 < c1 >>> 0 && (hi = (hi + 1) >>> 0)
					hi = (hi + Math.imul(aLo, 1481765933)) >>> 0
					hi = (hi + Math.imul(aHi, bLo)) >>> 0
					out[0] = hi
					out[1] = lo
				})(this._state, oldHi, oldLo, 0, 1284865837)
				add64(
					this._state,
					this._state[0],
					this._state[1],
					this._state[2],
					this._state[3]
				)
				let xsHi = oldHi >>> 18,
					xsLo = ((oldLo >>> 18) | (oldHi << 14)) >>> 0
				xsHi = (xsHi ^ oldHi) >>> 0
				xsLo = (xsLo ^ oldLo) >>> 0
				const xorshifted = ((xsLo >>> 27) | (xsHi << 5)) >>> 0,
					rot = oldHi >>> 27
				return (
					((xorshifted >>> rot) |
						(xorshifted << (((-rot >>> 0) & 31) >>> 0))) >>>
					0
				)
			}
		}
		function add64(out, aHi, aLo, bHi, bLo) {
			let hi = (aHi + bHi) >>> 0
			const lo = (aLo + bLo) >>> 0
			lo >>> 0 < aLo >>> 0 && (hi = (hi + 1) | 0)
			out[0] = hi
			out[1] = lo
		}
		const randomHashCache = globalValue(
				Symbol.for("@effect/data/Hash/randomHashCache"),
				() => new WeakMap()
			),
			pcgr = globalValue(
				Symbol.for("@effect/data/Hash/pcgr"),
				() => new PCGRandom()
			),
			symbol = Symbol.for("@effect/data/Hash"),
			Hash_hash = self => {
				switch (typeof self) {
					case "number":
						return number(self)
					case "bigint":
						return string(self.toString(10))
					case "boolean":
					case "symbol":
						return string(String(self))
					case "string":
						return string(self)
					case "undefined":
						return string("undefined")
					case "function":
					case "object":
						return null === self
							? string("null")
							: isHash(self)
							? self[symbol]()
							: random(self)
					default:
						throw new Error("Bug in Equal.hashGeneric")
				}
			},
			random = self => {
				randomHashCache.has(self) ||
					randomHashCache.set(
						self,
						number(pcgr.integer(Number.MAX_SAFE_INTEGER))
					)
				return randomHashCache.get(self)
			},
			combine = b => self => (53 * self) ^ b,
			optimize = n => (3221225471 & n) | ((n >>> 1) & 1073741824),
			isHash = u => "object" == typeof u && null !== u && symbol in u,
			number = n => {
				if (n != n || n === 1 / 0) return 0
				let h = 0 | n
				h !== n && (h ^= 4294967295 * n)
				for (; n > 4294967295; ) h ^= n /= 4294967295
				return optimize(n)
			},
			string = str => {
				let h = 5381,
					i = str.length
				for (; i; ) h = (33 * h) ^ str.charCodeAt(--i)
				return optimize(h)
			},
			array = arr => {
				let h = 6151
				for (let i = 0; i < arr.length; i++) h = combine(Hash_hash(arr[i]))(h)
				return optimize(h)
			},
			Equal_symbol = Symbol.for("@effect/data/Equal")
		function equals() {
			return 1 === arguments.length
				? self => compareBoth(self, arguments[0])
				: compareBoth(arguments[0], arguments[1])
		}
		function compareBoth(self, that) {
			if (self === that) return !0
			const selfType = typeof self
			return (
				selfType === typeof that &&
				!(
					("object" !== selfType && "function" !== selfType) ||
					null === self ||
					null === that ||
					!isEqual(self) ||
					!isEqual(that)
				) &&
				Hash_hash(self) === Hash_hash(that) &&
				self[Equal_symbol](that)
			)
		}
		const isEqual = u =>
				"object" == typeof u && null !== u && Equal_symbol in u,
			Equal_equivalence = () => (self, that) =>
				Hash_hash(self) === Hash_hash(that) && equals(self, that)
		var _a
		const runtimeDebug = globalValue(
				Symbol.for("@effect/data/Debug/runtimeDebug"),
				() => ({
					reportUnhandled: !0,
					minumumLogLevel: "Info",
					traceStackLimit: 5,
					tracingEnabled: !0,
					parseStack: error => {
						const stack = error.stack
						if (stack) {
							const lines = stack.split("\n")
							let starts = 0
							for (let i = 0; i < lines.length; i++)
								lines[i].startsWith("Error") && (starts = i)
							const frames = []
							for (let i = starts + 1; i < lines.length; i++)
								if (lines[i].includes("at")) {
									const blocks = lines[i]
											.split(" ")
											.filter(i => i.length > 0 && "at" !== i),
										name =
											2 !== blocks.length || blocks[0].includes("<anonymous>")
												? void 0
												: blocks[0],
										file = 2 === blocks.length ? blocks[1] : blocks[0],
										matchFrame = file?.match(/\(?(.*):(\d+):(\d+)/)
									matchFrame
										? frames.push({
												name,
												fileName: matchFrame[1],
												line: Number.parseInt(matchFrame[2]),
												column: Number.parseInt(matchFrame[3]),
										  })
										: frames.push(void 0)
								} else frames.push(void 0)
							return frames
						}
						return []
					},
					filterStackFrame: _ =>
						null != _ && !_.fileName.match(/\/internal_effect_untraced/),
				})
			),
			sourceLocationProto = Object.setPrototypeOf(
				{
					toFrame() {
						if ("parsed" in this) return this.parsed
						const stack = runtimeDebug.parseStack(this)
						stack && stack.length >= 2 && stack[0] && stack[1]
							? (this.parsed = {
									...stack[this.depth - 1],
									name: stack[this.depth - 2]?.name,
							  })
							: (this.parsed = void 0)
						return this.parsed
					},
				},
				Error.prototype
			),
			sourceLocation = error => {
				error.depth = Error.stackTraceLimit
				Object.setPrototypeOf(error, sourceLocationProto)
				return error
			},
			bodyWithTrace = body => {
				if (!runtimeDebug.tracingEnabled) return body(void 0, restoreOff)
				runtimeDebug.tracingEnabled = !1
				try {
					const limit = Error.stackTraceLimit
					Error.stackTraceLimit = 3
					const source = sourceLocation(new Error())
					Error.stackTraceLimit = limit
					return body(source, restoreOn)
				} finally {
					runtimeDebug.tracingEnabled = !0
				}
			},
			methodWithTrace = body =>
				function () {
					if (!runtimeDebug.tracingEnabled)
						return body(void 0, restoreOff).apply(this, arguments)
					runtimeDebug.tracingEnabled = !1
					try {
						const limit = Error.stackTraceLimit
						Error.stackTraceLimit = 2
						const error = sourceLocation(new Error())
						Error.stackTraceLimit = limit
						return body(error, restoreOn).apply(this, arguments)
					} finally {
						runtimeDebug.tracingEnabled = !0
					}
				},
			dualWithTrace = (dfLen, body) => {
				const isDataFirst =
					"number" == typeof dfLen ? args => args.length === dfLen : dfLen
				return function () {
					if (!runtimeDebug.tracingEnabled) {
						const f = body(void 0, restoreOff)
						return isDataFirst(arguments)
							? untraced(() => f.apply(this, arguments))
							: self => untraced(() => f(self, ...arguments))
					}
					runtimeDebug.tracingEnabled = !1
					try {
						const limit = Error.stackTraceLimit
						Error.stackTraceLimit = 2
						const source = sourceLocation(new Error())
						Error.stackTraceLimit = limit
						const f = body(source, restoreOn)
						return isDataFirst(arguments)
							? untraced(() => f.apply(this, arguments))
							: self => untraced(() => f(self, ...arguments))
					} finally {
						runtimeDebug.tracingEnabled = !0
					}
				}
			},
			untraced = body => {
				if (!runtimeDebug.tracingEnabled) return body(restoreOff)
				runtimeDebug.tracingEnabled = !1
				try {
					return body(restoreOn)
				} finally {
					runtimeDebug.tracingEnabled = !0
				}
			},
			untracedDual = (dfLen, body) =>
				function () {
					if (!runtimeDebug.tracingEnabled) {
						const f = body(restoreOff)
						return arguments.length === dfLen
							? untraced(() => f.apply(this, arguments))
							: self => untraced(() => f(self, ...arguments))
					}
					runtimeDebug.tracingEnabled = !1
					try {
						const f = body(restoreOn)
						return arguments.length === dfLen
							? untraced(() => f.apply(this, arguments))
							: self => untraced(() => f(self, ...arguments))
					} finally {
						runtimeDebug.tracingEnabled = !0
					}
				},
			untracedMethod = body =>
				function () {
					if (!runtimeDebug.tracingEnabled)
						return untraced(() => body(restoreOff).apply(this, arguments))
					runtimeDebug.tracingEnabled = !1
					try {
						return untraced(() => body(restoreOn).apply(this, arguments))
					} finally {
						runtimeDebug.tracingEnabled = !0
					}
				},
			restoreOn = body =>
				function () {
					if (runtimeDebug.tracingEnabled) return body.apply(this, arguments)
					runtimeDebug.tracingEnabled = !0
					try {
						return body.apply(this, arguments)
					} finally {
						runtimeDebug.tracingEnabled = !1
					}
				},
			restoreOff = body =>
				function () {
					if (!runtimeDebug.tracingEnabled) return body.apply(this, arguments)
					runtimeDebug.tracingEnabled = !1
					try {
						return body.apply(this, arguments)
					} finally {
						runtimeDebug.tracingEnabled = !0
					}
				},
			EffectTypeId = Symbol.for("@effect/io/Effect")
		class TracedPrimitive {
			[((_a = EffectTypeId), Equal_symbol)](that) {
				return this === that
			}
			[symbol]() {
				return random(this)
			}
			constructor(i0, trace) {
				this.i0 = i0
				this.trace = trace
				this._tag = "Traced"
				this.i1 = void 0
				this.i2 = void 0
				this[_a] = effectVariance
			}
			traced(trace) {
				return trace ? new TracedPrimitive(this, trace) : this
			}
		}
		const effectVariance = { _R: _ => _, _E: _ => _, _A: _ => _ },
			makeTraced = (self, source) => new TracedPrimitive(self, source)
		var Option_a, _b
		const Option_effectVariance = { _R: _ => _, _E: _ => _, _A: _ => _ },
			Option_EffectTypeId = Symbol.for("@effect/io/Effect"),
			OptionTypeId = Symbol.for("@effect/io/Option")
		class Some {
			[((Option_a = Option_EffectTypeId), Equal_symbol)](that) {
				return isOption(that) && isSome(that) && equals(that.i0, this.i0)
			}
			[symbol]() {
				return Hash_hash(this.i0)
			}
			toString() {
				return `some(${String(this.i0)})`
			}
			toJSON() {
				return { _tag: this._tag, value: this.i0 }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
			get [OptionTypeId]() {
				return { _A: _ => _ }
			}
			get value() {
				return this.i0
			}
			constructor(i0) {
				this.i0 = i0
				this._tag = "Some"
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[Option_a] = Option_effectVariance
			}
			traced(trace) {
				return trace ? makeTraced(this, trace) : this
			}
		}
		class None {
			constructor() {
				this._tag = "None"
				this.i0 = void 0
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[_b] = Option_effectVariance
			}
			[((_b = Option_EffectTypeId), Equal_symbol)](that) {
				return isOption(that) && isNone(that)
			}
			[symbol]() {
				return Hash_hash(this._tag)
			}
			toString() {
				return "none()"
			}
			toJSON() {
				return { _tag: this._tag }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
			get [OptionTypeId]() {
				return { _A: _ => _ }
			}
			traced(trace) {
				return trace ? makeTraced(this, trace) : this
			}
		}
		const isOption = input =>
				"object" == typeof input &&
				null != input &&
				"_tag" in input &&
				("None" === input._tag || "Some" === input._tag) &&
				isEqual(input),
			isNone = fa => "None" === fa._tag,
			isSome = fa => "Some" === fa._tag,
			none = new None(),
			some = a => new Some(a)
		var Either_a, Either_b
		const Either_effectVariance = { _R: _ => _, _E: _ => _, _A: _ => _ },
			Either_EffectTypeId = Symbol.for("@effect/io/Effect"),
			EitherTypeId = Symbol.for("@effect/data/Either")
		class Right {
			[((Either_a = Either_EffectTypeId), Equal_symbol)](that) {
				return isEither(that) && isRight(that) && equals(that.i0, this.i0)
			}
			[symbol]() {
				return Hash_hash(this.i0)
			}
			get right() {
				return this.i0
			}
			constructor(i0) {
				this.i0 = i0
				this._tag = "Right"
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[Either_a] = Either_effectVariance
			}
			get [EitherTypeId]() {
				return { _E: _ => _, _A: _ => _ }
			}
			toString() {
				return `right(${String(this.i0)})`
			}
			toJSON() {
				return { _tag: this._tag, right: this.i0 }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
			traced(trace) {
				return trace ? makeTraced(this, trace) : this
			}
		}
		class Left {
			[((Either_b = Either_EffectTypeId), Equal_symbol)](that) {
				return isEither(that) && isLeft(that) && equals(that.i0, this.i0)
			}
			[symbol]() {
				return Hash_hash(this.i0)
			}
			get [EitherTypeId]() {
				return { _E: _ => _, _A: _ => _ }
			}
			get left() {
				return this.i0
			}
			constructor(i0) {
				this.i0 = i0
				this._tag = "Left"
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[Either_b] = Either_effectVariance
			}
			toString() {
				return `left(${String(this.i0)})`
			}
			toJSON() {
				return { _tag: this._tag, left: this.i0 }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
			traced(trace) {
				return trace ? makeTraced(this, trace) : this
			}
		}
		const isEither = input =>
				"object" == typeof input &&
				null != input &&
				"_tag" in input &&
				("Left" === input._tag || "Right" === input._tag) &&
				isEqual(input),
			isLeft = ma => "Left" === ma._tag,
			isRight = ma => "Right" === ma._tag,
			not = self => a => !self(a),
			make = compare => ({
				compare: (self, that) => (self === that ? 0 : compare(self, that)),
			}),
			Order_number = make((self, that) => (self < that ? -1 : 1)),
			Order_contramap = Function_dual(2, (self, f) =>
				make((b1, b2) => self.compare(f(b1), f(b2)))
			),
			greaterThanOrEqualTo = O =>
				Function_dual(2, (self, that) => -1 !== O.compare(self, that)),
			Equivalence_make =
				(Order_number.compare,
				isEquivalent => (self, that) =>
					self === that || isEquivalent(self, that)),
			isStrictEquivalent = (x, y) => x === y,
			strict = () => isStrictEquivalent,
			Equivalence_string = strict(),
			Semigroup_make = (
				combine,
				combineMany = (self, collection) => {
					return ((b = self),
					(f = combine),
					function (iterable) {
						if (Array.isArray(iterable)) return iterable.reduce(f, b)
						let result = b
						for (const n of iterable) result = f(result, n)
						return result
					})(collection)
					var b, f
				}
			) => ({ combine, combineMany }),
			Semigroup_string = Semigroup_make((self, that) => self + that),
			numberSum = Semigroup_make((self, that) => self + that),
			numberMultiply = Semigroup_make(
				(self, that) => self * that,
				(self, collection) => {
					if (0 === self) return 0
					let out = self
					for (const n of collection) {
						if (0 === n) return 0
						out *= n
					}
					return out
				}
			),
			booleanEvery = Semigroup_make(
				(self, that) => self && that,
				(self, collection) => {
					if (!1 === self) return !1
					for (const b of collection) if (!1 === b) return !1
					return !0
				}
			),
			booleanSome = Semigroup_make(
				(self, that) => self || that,
				(self, collection) => {
					if (!0 === self) return !0
					for (const b of collection) if (!0 === b) return !0
					return !1
				}
			),
			intercalate = Function_dual(2, (S, separator) =>
				Semigroup_make((self, that) => S.combineMany(self, [separator, that]))
			),
			fromSemigroup = (S, empty) => ({
				combine: S.combine,
				combineMany: S.combineMany,
				empty,
				combineAll: collection => S.combineMany(empty, collection),
			}),
			Monoid_string = fromSemigroup(Semigroup_string, ""),
			Monoid_numberSum = fromSemigroup(numberSum, 0),
			Monoid_numberMultiply = fromSemigroup(numberMultiply, 1),
			Monoid_booleanEvery = fromSemigroup(booleanEvery, !0),
			Monoid_booleanSome = fromSemigroup(booleanSome, !1),
			Order = (numberSum.combine, numberMultiply.combine, Order_number),
			MonoidMultiply = Monoid_numberMultiply,
			filter =
				(Monoid_numberSum.combineAll,
				MonoidMultiply.combineAll,
				Filterable =>
					Function_dual(2, (self, predicate) =>
						Filterable.filterMap(self, b => (predicate(b) ? some(b) : none))
					)),
			Option_none = () => none,
			Option_some = some,
			Option_isNone = isNone,
			Option_isSome = isSome,
			match = Function_dual(3, (self, onNone, onSome) =>
				Option_isNone(self) ? onNone() : onSome(self.value)
			),
			getOrElse = Function_dual(2, (self, onNone) =>
				Option_isNone(self) ? onNone() : self.value
			),
			orElse = Function_dual(2, (self, that) =>
				Option_isNone(self) ? that() : self
			),
			fromNullable = nullableValue =>
				null == nullableValue ? Option_none() : Option_some(nullableValue),
			getOrUndefined = getOrElse(Function_constUndefined),
			getOrThrow = Function_dual(2, (self, onNone) => {
				if (Option_isSome(self)) return self.value
				throw onNone()
			})(() => new Error("getOrThrow called on a None")),
			Option_map = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : Option_some(f(self.value))
			),
			flatMap = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : f(self.value)
			),
			flatMapNullable = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : fromNullable(f(self.value))
			),
			Option_filter = filter({
				partitionMap: Function_dual(2, (self, f) => {
					if (Option_isNone(self)) return [Option_none(), Option_none()]
					const e = f(self.value)
					return isLeft(e)
						? [Option_some(e.left), Option_none()]
						: [Option_none(), Option_some(e.right)]
				}),
				filterMap: Function_dual(2, (self, f) =>
					Option_isNone(self) ? Option_none() : f(self.value)
				),
			}),
			liftPredicate = predicate => b =>
				predicate(b) ? Option_some(b) : Option_none(),
			contains = isEquivalent =>
				Function_dual(
					2,
					(self, a) => !Option_isNone(self) && isEquivalent(self.value, a)
				),
			exists = Function_dual(
				2,
				(self, predicate) => !Option_isNone(self) && predicate(self.value)
			),
			Either_right = a => new Right(a),
			Either_left = e => new Left(e),
			Either_isLeft = isLeft,
			Either_isRight = isRight,
			merge = Function_dual(3, (self, onLeft, onRight) =>
				Either_isLeft(self) ? onLeft(self.left) : onRight(self.right)
			)(Function_identity, Function_identity),
			isNonEmptyArray = self => self.length > 0,
			String_Equivalence = Equivalence_string,
			Semigroup = Semigroup_string,
			Monoid = Monoid_string,
			slice =
				(Semigroup.combine,
				Function_dual(3, (self, start, end) => self.slice(start, end))),
			isEmpty = self => 0 === self.length,
			split = Function_dual(2, (self, separator) => {
				const out = self.split(separator)
				return isNonEmptyArray(out) ? out : [self]
			}),
			includes = Function_dual(2, (self, searchString) =>
				self.includes(searchString)
			)
		class LinesIterator {
			constructor(s, stripped = !1) {
				this.s = s
				this.stripped = stripped
				this.index = 0
				this.length = s.length
			}
			next() {
				if (this.done) return { done: !0, value: void 0 }
				const start = this.index
				for (; !this.done && !isLineBreak(this.s[this.index]); )
					this.index = this.index + 1
				let end = this.index
				if (!this.done) {
					const char = this.s[this.index]
					this.index = this.index + 1
					!this.done &&
						isLineBreak2(char, this.s[this.index]) &&
						(this.index = this.index + 1)
					this.stripped || (end = this.index)
				}
				return { done: !1, value: this.s.substring(start, end) }
			}
			[Symbol.iterator]() {
				return new LinesIterator(this.s, this.stripped)
			}
			get done() {
				return this.index >= this.length
			}
		}
		const isLineBreak = char => {
				const code = char.charCodeAt(0)
				return 13 === code || 10 === code
			},
			isLineBreak2 = (char0, char1) =>
				13 === char0.charCodeAt(0) && 10 === char1.charCodeAt(0),
			Invariant_bindTo = F =>
				Function_dual(2, (self, name) =>
					F.imap(
						self,
						a => ({ [name]: a }),
						({ [name]: a }) => a
					)
				),
			makeBy = (n, f) => {
				const max = Math.max(1, Math.floor(n)),
					out = [f(0)]
				for (let i = 1; i < max; i++) out.push(f(i))
				return out
			},
			mjs_ReadonlyArray_fromIterable = collection =>
				Array.isArray(collection) ? collection : Array.from(collection),
			matchRight = Function_dual(3, (self, onEmpty, onNonEmpty) =>
				isNonEmptyReadonlyArray(self)
					? onNonEmpty(initNonEmpty(self), lastNonEmpty(self))
					: onEmpty()
			),
			prepend = Function_dual(2, (self, head) => [head, ...self]),
			append = Function_dual(2, (self, last) => [...self, last]),
			isEmptyReadonlyArray = self => 0 === self.length,
			isNonEmptyReadonlyArray = isNonEmptyArray,
			isOutOfBound = (i, as) => i < 0 || i >= as.length,
			ReadonlyArray_get = Function_dual(2, (self, index) => {
				const i = Math.floor(index)
				return isOutOfBound(i, self) ? Option_none() : Option_some(self[i])
			}),
			unsafeGet = Function_dual(2, (self, index) => {
				const i = Math.floor(index)
				if (isOutOfBound(i, self)) throw new Error(`Index ${i} out of bounds`)
				return self[i]
			}),
			headNonEmpty = unsafeGet(0),
			lastNonEmpty = self => self[self.length - 1],
			tailNonEmpty = self => self.slice(1),
			initNonEmpty = self => self.slice(0, -1),
			take = Function_dual(2, (self, n) => {
				const input = mjs_ReadonlyArray_fromIterable(self)
				return input.slice(
					0,
					((i, as) => Math.floor(Math.min(Math.max(0, i), as.length)))(n, input)
				)
			}),
			findFirstIndex = Function_dual(2, (self, predicate) => {
				let i = 0
				for (const a of self) {
					if (predicate(a)) return Option_some(i)
					i++
				}
				return Option_none()
			}),
			findFirst = Function_dual(2, (self, predicate) => {
				const input = mjs_ReadonlyArray_fromIterable(self)
				for (let i = 0; i < input.length; i++)
					if (predicate(input[i])) return Option_some(input[i])
				return Option_none()
			}),
			findLast = Function_dual(2, (self, predicate) => {
				const input = mjs_ReadonlyArray_fromIterable(self)
				for (let i = input.length - 1; i >= 0; i--)
					if (predicate(input[i])) return Option_some(input[i])
				return Option_none()
			}),
			ReadonlyArray_remove = Function_dual(2, (self, i) => {
				const out = Array.from(self)
				if (isOutOfBound(i, out)) return out
				out.splice(i, 1)
				return out
			}),
			ReadonlyArray_reverse = self => Array.from(self).reverse(),
			sort = Function_dual(2, (self, O) => {
				const out = Array.from(self)
				out.sort(O.compare)
				return out
			}),
			zip = Function_dual(2, (self, that) =>
				ReadonlyArray_zipWith(self, that, (a, b) => [a, b])
			),
			ReadonlyArray_zipWith = Function_dual(3, (self, that, f) => {
				const as = mjs_ReadonlyArray_fromIterable(self),
					bs = mjs_ReadonlyArray_fromIterable(that)
				return isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)
					? zipNonEmptyWith(bs, f)(as)
					: []
			}),
			zipNonEmptyWith = Function_dual(3, (self, that, f) => {
				const cs = [f(headNonEmpty(self), headNonEmpty(that))],
					len = Math.min(self.length, that.length)
				for (let i = 1; i < len; i++) cs[i] = f(self[i], that[i])
				return cs
			}),
			ReadonlyArray_contains = isEquivalent =>
				Function_dual(2, (self, a) => {
					for (const i of self) if (isEquivalent(a, i)) return !0
					return !1
				}),
			uniq = Function_dual(2, (self, isEquivalent) => {
				const input = mjs_ReadonlyArray_fromIterable(self)
				return isNonEmptyReadonlyArray(input)
					? uniqNonEmpty(isEquivalent)(input)
					: []
			}),
			uniqNonEmpty = Function_dual(2, (self, isEquivalent) => {
				const out = [headNonEmpty(self)],
					rest = tailNonEmpty(self)
				for (const a of rest) out.every(o => !isEquivalent(a, o)) && out.push(a)
				return out
			}),
			ReadonlyArray_of = a => [a],
			ReadonlyArray_map = Function_dual(2, (self, f) => self.map(f)),
			mapNonEmpty = ReadonlyArray_map,
			ReadonlyArray_Invariant = { imap: imap(ReadonlyArray_map) },
			ReadonlyArray_flatMap = Function_dual(2, (self, f) => {
				if (isEmptyReadonlyArray(self)) return []
				const out = []
				for (let i = 0; i < self.length; i++) out.push(...f(self[i], i))
				return out
			}),
			ReadonlyArray_filterMap = Function_dual(2, (self, f) => {
				const as = mjs_ReadonlyArray_fromIterable(self),
					out = []
				for (let i = 0; i < as.length; i++) {
					const o = f(as[i], i)
					Option_isSome(o) && out.push(o.value)
				}
				return out
			}),
			ReadonlyArray_compact = ReadonlyArray_filterMap(Function_identity),
			ReadonlyArray_filter = Function_dual(2, (self, predicate) => {
				const as = mjs_ReadonlyArray_fromIterable(self),
					out = []
				for (let i = 0; i < as.length; i++)
					predicate(as[i], i) && out.push(as[i])
				return out
			}),
			ReadonlyArray_reduce = Function_dual(3, (self, b, f) =>
				mjs_ReadonlyArray_fromIterable(self).reduce((b, a, i) => f(b, a, i), b)
			),
			ReadonlyArray_some = predicate => self => self.some(predicate),
			ReadonlyArray_intercalate = M =>
				Function_dual(2, (self, middle) => {
					const as = mjs_ReadonlyArray_fromIterable(self)
					return isNonEmptyReadonlyArray(as)
						? intercalateNonEmpty(M)(as, middle)
						: M.empty
				}),
			intercalateNonEmpty = S =>
				Function_dual(2, (self, middle) =>
					intercalate(S, middle).combineMany(
						headNonEmpty(self),
						tailNonEmpty(self)
					)
				),
			join = ReadonlyArray_intercalate(Monoid),
			ReadonlyArray_bindTo = Invariant_bindTo(ReadonlyArray_Invariant),
			TypeId = Symbol.for("@effect/data/Chunk"),
			emptyArray = []
		class ChunkImpl {
			constructor(backing) {
				this.backing = backing
				this._id = TypeId
				switch (backing._tag) {
					case "IEmpty":
						this.length = 0
						this.depth = 0
						this.left = this
						this.right = this
						break
					case "IConcat":
						this.length = backing.left.length + backing.right.length
						this.depth = 1 + Math.max(backing.left.depth, backing.right.depth)
						this.left = backing.left
						this.right = backing.right
						break
					case "IArray":
						this.length = backing.array.length
						this.depth = 0
						this.left = _empty
						this.right = _empty
						break
					case "ISingleton":
						this.length = 1
						this.depth = 0
						this.left = _empty
						this.right = _empty
						break
					case "ISlice":
						this.length = backing.length
						this.depth = backing.chunk.depth + 1
						this.left = _empty
						this.right = _empty
				}
			}
			toString() {
				return `Chunk(${toReadonlyArray(this).map(String).join(", ")})`
			}
			toJSON() {
				return { _tag: "Chunk", values: toReadonlyArray(this) }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
			[Equal_symbol](that) {
				return (
					!(!isChunk(that) || this.length !== that.length) &&
					toReadonlyArray(this).every((value, i) =>
						equals(value, Chunk_unsafeGet(that, i))
					)
				)
			}
			[symbol]() {
				return array(toReadonlyArray(this))
			}
			[Symbol.iterator]() {
				switch (this.backing._tag) {
					case "IArray":
						return this.backing.array[Symbol.iterator]()
					case "IEmpty":
						return emptyArray[Symbol.iterator]()
					default:
						return toReadonlyArray(this)[Symbol.iterator]()
				}
			}
		}
		const copyToArray = (self, array, initial) => {
				switch (self.backing._tag) {
					case "IArray":
						!(function (src, srcPos, dest, destPos, len) {
							for (let i = 0; i < Math.min(src.length, 0 + len); i++)
								dest[destPos + i - 0] = src[i]
						})(self.backing.array, 0, array, initial, self.length)
						break
					case "IConcat":
						copyToArray(self.left, array, initial)
						copyToArray(self.right, array, initial + self.left.length)
						break
					case "ISingleton":
						array[initial] = self.backing.a
						break
					case "ISlice": {
						let i = 0,
							j = initial
						for (; i < self.length; ) {
							array[j] = Chunk_unsafeGet(self, i)
							i += 1
							j += 1
						}
						break
					}
				}
			},
			isChunk = u =>
				"object" == typeof u && null != u && "_id" in u && u._id === TypeId,
			_empty = new ChunkImpl({ _tag: "IEmpty" }),
			Chunk_empty = () => _empty,
			Chunk_fromIterable = self =>
				isChunk(self)
					? self
					: new ChunkImpl({ _tag: "IArray", array: Array.from(self) }),
			toReadonlyArray = self => {
				switch (self.backing._tag) {
					case "IEmpty":
						return emptyArray
					case "IArray":
						return self.backing.array
					default: {
						const arr = new Array(self.length)
						copyToArray(self, arr, 0)
						self.backing = { _tag: "IArray", array: arr }
						self.left = _empty
						self.right = _empty
						self.depth = 0
						return arr
					}
				}
			},
			Chunk_get = Function_dual(2, (self, index) =>
				index < 0 || index >= self.length
					? Option_none()
					: Option_some(Chunk_unsafeGet(self, index))
			),
			unsafeFromArray = self => new ChunkImpl({ _tag: "IArray", array: self }),
			Chunk_unsafeGet = Function_dual(2, (self, index) => {
				switch (self.backing._tag) {
					case "IEmpty":
						throw new Error("Index out of bounds")
					case "ISingleton":
						if (0 !== index) throw new Error("Index out of bounds")
						return self.backing.a
					case "IArray":
						if (index >= self.length || index < 0)
							throw new Error("Index out of bounds")
						return self.backing.array[index]
					case "IConcat":
						return index < self.left.length
							? Chunk_unsafeGet(self.left, index)
							: Chunk_unsafeGet(self.right, index - self.left.length)
					case "ISlice":
						return Chunk_unsafeGet(
							self.backing.chunk,
							index + self.backing.offset
						)
				}
			}),
			Chunk_append = Function_dual(2, (self, a) =>
				Chunk_concat(self, Chunk_of(a))
			),
			Chunk_prepend = Function_dual(2, (self, a) =>
				Chunk_concat(Chunk_of(a), self)
			),
			Chunk_take = Function_dual(2, (self, n) => {
				if (n <= 0) return _empty
				if (n >= self.length) return self
				switch (self.backing._tag) {
					case "ISlice":
						return new ChunkImpl({
							_tag: "ISlice",
							chunk: self.backing.chunk,
							length: n,
							offset: self.backing.offset,
						})
					case "IConcat":
						return n > self.left.length
							? new ChunkImpl({
									_tag: "IConcat",
									left: self.left,
									right: Chunk_take(self.right, n - self.left.length),
							  })
							: Chunk_take(self.left, n)
					default:
						return new ChunkImpl({
							_tag: "ISlice",
							chunk: self,
							offset: 0,
							length: n,
						})
				}
			}),
			Chunk_drop = Function_dual(2, (self, n) => {
				if (n <= 0) return self
				if (n >= self.length) return _empty
				switch (self.backing._tag) {
					case "ISlice":
						return new ChunkImpl({
							_tag: "ISlice",
							chunk: self.backing.chunk,
							offset: self.backing.offset + n,
							length: self.backing.length - n,
						})
					case "IConcat":
						return n > self.left.length
							? Chunk_drop(self.right, n - self.left.length)
							: new ChunkImpl({
									_tag: "IConcat",
									left: Chunk_drop(self.left, n),
									right: self.right,
							  })
					default:
						return new ChunkImpl({
							_tag: "ISlice",
							chunk: self,
							offset: n,
							length: self.length - n,
						})
				}
			}),
			Chunk_concat = Function_dual(2, (self, that) => {
				if ("IEmpty" === self.backing._tag) return that
				if ("IEmpty" === that.backing._tag) return self
				const diff = that.depth - self.depth
				if (Math.abs(diff) <= 1)
					return new ChunkImpl({ _tag: "IConcat", left: self, right: that })
				if (diff < -1) {
					if (self.left.depth >= self.right.depth) {
						const nr = Chunk_concat(self.right, that)
						return new ChunkImpl({
							_tag: "IConcat",
							left: self.left,
							right: nr,
						})
					}
					{
						const nrr = Chunk_concat(self.right.right, that)
						if (nrr.depth === self.depth - 3) {
							const nr = new ChunkImpl({
								_tag: "IConcat",
								left: self.right.left,
								right: nrr,
							})
							return new ChunkImpl({
								_tag: "IConcat",
								left: self.left,
								right: nr,
							})
						}
						{
							const nl = new ChunkImpl({
								_tag: "IConcat",
								left: self.left,
								right: self.right.left,
							})
							return new ChunkImpl({ _tag: "IConcat", left: nl, right: nrr })
						}
					}
				}
				if (that.right.depth >= that.left.depth) {
					const nl = Chunk_concat(self, that.left)
					return new ChunkImpl({ _tag: "IConcat", left: nl, right: that.right })
				}
				{
					const nll = Chunk_concat(self, that.left.left)
					if (nll.depth === that.depth - 3) {
						const nl = new ChunkImpl({
							_tag: "IConcat",
							left: nll,
							right: that.left.right,
						})
						return new ChunkImpl({
							_tag: "IConcat",
							left: nl,
							right: that.right,
						})
					}
					{
						const nr = new ChunkImpl({
							_tag: "IConcat",
							left: that.left.right,
							right: that.right,
						})
						return new ChunkImpl({ _tag: "IConcat", left: nll, right: nr })
					}
				}
			}),
			dedupeAdjacent = self => {
				const builder = []
				let lastA = Option_none()
				for (const a of self)
					if (Option_isNone(lastA) || !equals(a, lastA.value)) {
						builder.push(a)
						lastA = Option_some(a)
					}
				return unsafeFromArray(builder)
			},
			Chunk_flatten = Function_dual(2, (self, f) => {
				if ("ISingleton" === self.backing._tag) return f(self.backing.a)
				let r = _empty
				for (const k of self) r = Chunk_concat(r, f(k))
				return r
			})(Function_identity),
			Chunk_head = Chunk_get(0),
			Chunk_isEmpty = self => 0 === self.length,
			Chunk_isNonEmpty = self => self.length > 0,
			Chunk_reduce = Function_dual(3, (self, b, f) =>
				ReadonlyArray_reduce(b, f)(toReadonlyArray(self))
			),
			Chunk_join = Function_dual(2, (self, sep) =>
				Chunk_reduce(self, "", (s, a) => (s.length > 0 ? `${s}${sep}${a}` : a))
			),
			Chunk_of = a => new ChunkImpl({ _tag: "ISingleton", a }),
			Chunk_makeBy = Function_dual(2, (n, f) =>
				((...as) => unsafeFromArray(as))(...makeBy(n, f))
			),
			Chunk_map = Function_dual(2, (self, f) =>
				"ISingleton" === self.backing._tag
					? Chunk_of(f(self.backing.a))
					: unsafeFromArray(ReadonlyArray_map(toReadonlyArray(self), f))
			),
			mapWithIndex = Function_dual(2, (self, f) =>
				"ISingleton" === self.backing._tag
					? Chunk_of(f(self.backing.a, 0))
					: unsafeFromArray(ReadonlyArray_map(f)(toReadonlyArray(self)))
			),
			Chunk_reverse = self =>
				unsafeFromArray(ReadonlyArray_reverse(toReadonlyArray(self))),
			Chunk_sort = Function_dual(2, (self, O) =>
				unsafeFromArray(sort(O)(toReadonlyArray(self)))
			),
			Chunk_splitAt = Function_dual(2, (self, n) => [
				Chunk_take(self, n),
				Chunk_drop(self, n),
			]),
			splitWhere = Function_dual(2, (self, f) => {
				let i = 0
				for (const a of toReadonlyArray(self)) {
					if (f(a)) break
					i++
				}
				return Chunk_splitAt(self, i)
			}),
			Chunk_unfold = (s, f) => {
				const builder = []
				let cont = !0,
					s1 = s
				for (; cont; ) {
					const x = f(s1)
					if (Option_isSome(x)) {
						s1 = x.value[1]
						builder.push(x.value[0])
					} else cont = !1
				}
				return unsafeFromArray(builder)
			},
			uniq_ = uniq(Equal_equivalence()),
			unsafeHead = self => Chunk_unsafeGet(self, 0),
			unsafeLast = self => Chunk_unsafeGet(self, self.length - 1),
			Chunk_zip = Function_dual(2, (self, that) =>
				Chunk_zipWith(self, that, (a, b) => [a, b])
			),
			Chunk_zipWith = Function_dual(3, (self, that, f) => {
				const selfA = toReadonlyArray(self),
					thatA = toReadonlyArray(that)
				return unsafeFromArray(ReadonlyArray_zipWith(thatA, f)(selfA))
			}),
			Chunk_headNonEmpty = unsafeHead,
			Chunk_tailNonEmpty = self => Chunk_drop(self, 1)
		var Context_a
		const TagTypeId = Symbol.for("@effect/data/Context/Tag"),
			Context_effectVariance = { _R: _ => _, _E: _ => _, _A: _ => _ },
			Context_EffectTypeId = Symbol.for("@effect/io/Effect")
		class TagImpl {
			[((Context_a = Context_EffectTypeId), Equal_symbol)](that) {
				return this === that
			}
			[symbol]() {
				return random(this)
			}
			get [TagTypeId]() {
				return { _S: _ => _, _I: _ => _ }
			}
			constructor(id) {
				this._tag = "Tag"
				this.i0 = void 0
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[Context_a] = Context_effectVariance
				if (void 0 !== id) return globalValue(id, () => this)
			}
			traced(trace) {
				return trace ? makeTraced(this, trace) : this
			}
			of(self) {
				return self
			}
			context(self) {
				return Context_make(this, self)
			}
		}
		const ContextTypeId = Symbol.for("@effect/data/Context")
		class ContextImpl {
			[Equal_symbol](that) {
				if (isContext(that) && this.unsafeMap.size === that.unsafeMap.size) {
					for (const k of this.unsafeMap.keys())
						if (
							!that.unsafeMap.has(k) ||
							!equals(this.unsafeMap.get(k), that.unsafeMap.get(k))
						)
							return !1
					return !0
				}
				return !1
			}
			[symbol]() {
				return number(this.unsafeMap.size)
			}
			constructor(unsafeMap) {
				this.unsafeMap = unsafeMap
				this._id = ContextTypeId
				this._S = _ => _
			}
		}
		const isContext = u =>
				"object" == typeof u &&
				null !== u &&
				"_id" in u &&
				u._id === ContextTypeId,
			Context_make = (tag, service) =>
				new ContextImpl(new Map([[tag, service]])),
			add = Function_dual(3, (self, tag, service) => {
				const map = new Map(self.unsafeMap)
				map.set(tag, service)
				return new ContextImpl(map)
			}),
			Context_get = Function_dual(2, (self, tag) => {
				if (!self.unsafeMap.has(tag)) throw new Error("Service not found")
				return self.unsafeMap.get(tag)
			}),
			Context_unsafeGet = Function_dual(2, (self, tag) => {
				if (!self.unsafeMap.has(tag)) throw new Error("Service not found")
				return self.unsafeMap.get(tag)
			}),
			Context_merge = Function_dual(2, (self, that) => {
				const map = new Map(self.unsafeMap)
				for (const [tag, s] of that.unsafeMap) map.set(tag, s)
				return new ContextImpl(map)
			}),
			Tag = key => new TagImpl(key),
			mjs_Context_empty = () => new ContextImpl(new Map()),
			mjs_Context_make = Context_make,
			Context_add = add,
			mjs_Context_get = Context_get,
			mjs_Context_unsafeGet = Context_unsafeGet,
			mjs_Context_merge = Context_merge,
			ContextPatchTypeId = Symbol.for("@effect/data/Differ/ContextPatch")
		function ContextPatch_variance(a) {
			return a
		}
		class ContextPatch_Empty {
			constructor() {
				this._tag = "Empty"
				this._Input = ContextPatch_variance
				this._Output = ContextPatch_variance
				this._id = ContextPatchTypeId
			}
			[symbol]() {
				return string("ContextPatch(Empty)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id
				)
			}
		}
		class ContextPatch_AndThen {
			constructor(first, second) {
				this.first = first
				this.second = second
				this._tag = "AndThen"
				this._id = ContextPatchTypeId
				this._Input = ContextPatch_variance
				this._Output = ContextPatch_variance
			}
			[symbol]() {
				return string("ContextPatch(AndThen)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.first, that.first) &&
					equals(this.second, that.second)
				)
			}
		}
		class AddService {
			constructor(tag, service) {
				this.tag = tag
				this.service = service
				this._tag = "AddService"
				this._id = ContextPatchTypeId
				this._Input = ContextPatch_variance
				this._Output = ContextPatch_variance
			}
			[symbol]() {
				return string("ContextPatch(AddService)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.tag, that.tag) &&
					equals(this.service, that.service)
				)
			}
		}
		class RemoveService {
			constructor(tag) {
				this.tag = tag
				this._tag = "RemoveService"
				this._id = ContextPatchTypeId
				this._Input = ContextPatch_variance
				this._Output = ContextPatch_variance
			}
			[symbol]() {
				return string("ContextPatch(RemoveService)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.tag, that.tag)
				)
			}
		}
		class UpdateService {
			constructor(tag, update) {
				this.tag = tag
				this.update = update
				this._tag = "UpdateService"
				this._id = ContextPatchTypeId
				this._Input = ContextPatch_variance
				this._Output = ContextPatch_variance
			}
			[symbol]() {
				return string("ContextPatch(AndThen)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.tag, that.tag) &&
					equals(this.update, that.update)
				)
			}
		}
		const ContextPatch_empty = () => new ContextPatch_Empty(),
			ContextPatch_combine = Function_dual(
				2,
				(self, that) => new ContextPatch_AndThen(self, that)
			),
			ContextPatch_patch = Function_dual(2, (self, context) => {
				let wasServiceUpdated = !1,
					patches = Chunk_of(self)
				const updatedContext = new Map(context.unsafeMap)
				for (; Chunk_isNonEmpty(patches); ) {
					const head = Chunk_headNonEmpty(patches),
						tail = Chunk_tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "AddService":
							updatedContext.set(head.tag, head.service)
							patches = tail
							break
						case "AndThen":
							patches = Chunk_prepend(
								Chunk_prepend(tail, head.second),
								head.first
							)
							break
						case "RemoveService":
							updatedContext.delete(head.tag)
							patches = tail
							break
						case "UpdateService":
							updatedContext.set(
								head.tag,
								head.update(updatedContext.get(head.tag))
							)
							wasServiceUpdated = !0
							patches = tail
					}
				}
				if (!wasServiceUpdated) return new ContextImpl(updatedContext)
				const map = new Map()
				for (const [tag] of context.unsafeMap)
					if (updatedContext.has(tag)) {
						map.set(tag, updatedContext.get(tag))
						updatedContext.delete(tag)
					}
				for (const [tag, s] of updatedContext) map.set(tag, s)
				return new ContextImpl(map)
			}),
			Differ_ContextPatch_empty = ContextPatch_empty,
			Differ_ContextPatch_combine = ContextPatch_combine,
			Differ_ContextPatch_patch = ContextPatch_patch,
			SIZE = 5,
			BUCKET_SIZE = Math.pow(2, SIZE),
			MASK = BUCKET_SIZE - 1,
			MAX_INDEX_NODE = BUCKET_SIZE / 2,
			MIN_ARRAY_NODE = BUCKET_SIZE / 4
		function hashFragment(shift, h) {
			return (h >>> shift) & MASK
		}
		function toBitmap(x) {
			return 1 << x
		}
		function fromBitmap(bitmap, bit) {
			return (function (x) {
				x =
					((x =
						(858993459 & (x -= (x >> 1) & 1431655765)) +
						((x >> 2) & 858993459)) +
						(x >> 4)) &
					252645135
				return 127 & ((x += x >> 8) + (x >> 16))
			})(bitmap & (bit - 1))
		}
		function arrayUpdate(mutate, at, v, arr) {
			let out = arr
			if (!mutate) {
				const len = arr.length
				out = new Array(len)
				for (let i = 0; i < len; ++i) out[i] = arr[i]
			}
			out[at] = v
			return out
		}
		function arraySpliceOut(mutate, at, arr) {
			const newLen = arr.length - 1
			let i = 0,
				g = 0,
				out = arr
			if (mutate) i = g = at
			else {
				out = new Array(newLen)
				for (; i < at; ) out[g++] = arr[i++]
			}
			++i
			for (; i <= newLen; ) out[g++] = arr[i++]
			mutate && (out.length = newLen)
			return out
		}
		class Stack {
			constructor(value, previous) {
				this.value = value
				this.previous = previous
			}
		}
		class EmptyNode {
			constructor() {
				this._tag = "EmptyNode"
			}
			modify(edit, _shift, f, hash, key, size) {
				const v = f(Option_none())
				if (Option_isNone(v)) return new EmptyNode()
				++size.value
				return new LeafNode(edit, hash, key, v)
			}
		}
		function isEmptyNode(a) {
			return a instanceof EmptyNode
		}
		function canEditNode(node, edit) {
			return !isEmptyNode(node) && edit === node.edit
		}
		class LeafNode {
			constructor(edit, hash, key, value) {
				this.edit = edit
				this.hash = hash
				this.key = key
				this.value = value
				this._tag = "LeafNode"
			}
			modify(edit, shift, f, hash, key, size) {
				if (equals(key, this.key)) {
					const v = f(this.value)
					if (v === this.value) return this
					if (Option_isNone(v)) {
						--size.value
						return new EmptyNode()
					}
					if (canEditNode(this, edit)) {
						this.value = v
						return this
					}
					return new LeafNode(edit, hash, key, v)
				}
				const v = f(Option_none())
				if (Option_isNone(v)) return this
				++size.value
				return mergeLeaves(
					edit,
					shift,
					this.hash,
					this,
					hash,
					new LeafNode(edit, hash, key, v)
				)
			}
		}
		class CollisionNode {
			constructor(edit, hash, children) {
				this.edit = edit
				this.hash = hash
				this.children = children
				this._tag = "CollisionNode"
			}
			modify(edit, shift, f, hash, key, size) {
				if (hash === this.hash) {
					const canEdit = canEditNode(this, edit),
						list = this.updateCollisionList(
							canEdit,
							edit,
							this.hash,
							this.children,
							f,
							key,
							size
						)
					return list === this.children
						? this
						: list.length > 1
						? new CollisionNode(edit, this.hash, list)
						: list[0]
				}
				const v = f(Option_none())
				if (Option_isNone(v)) return this
				++size.value
				return mergeLeaves(
					edit,
					shift,
					this.hash,
					this,
					hash,
					new LeafNode(edit, hash, key, v)
				)
			}
			updateCollisionList(mutate, edit, hash, list, f, key, size) {
				const len = list.length
				for (let i = 0; i < len; ++i) {
					const child = list[i]
					if ("key" in child && equals(key, child.key)) {
						const value = child.value,
							newValue = f(value)
						if (newValue === value) return list
						if (Option_isNone(newValue)) {
							--size.value
							return arraySpliceOut(mutate, i, list)
						}
						return arrayUpdate(
							mutate,
							i,
							new LeafNode(edit, hash, key, newValue),
							list
						)
					}
				}
				const newValue = f(Option_none())
				if (Option_isNone(newValue)) return list
				++size.value
				return arrayUpdate(
					mutate,
					len,
					new LeafNode(edit, hash, key, newValue),
					list
				)
			}
		}
		class IndexedNode {
			constructor(edit, mask, children) {
				this.edit = edit
				this.mask = mask
				this.children = children
				this._tag = "IndexedNode"
			}
			modify(edit, shift, f, hash, key, size) {
				const mask = this.mask,
					children = this.children,
					frag = hashFragment(shift, hash),
					bit = toBitmap(frag),
					indx = fromBitmap(mask, bit),
					exists = mask & bit,
					canEdit = canEditNode(this, edit)
				if (!exists) {
					const _newChild = new EmptyNode().modify(
						edit,
						shift + SIZE,
						f,
						hash,
						key,
						size
					)
					return _newChild
						? children.length >= MAX_INDEX_NODE
							? (function (edit, frag, child, bitmap, subNodes) {
									const arr = []
									let bit = bitmap,
										count = 0
									for (let i = 0; bit; ++i) {
										1 & bit && (arr[i] = subNodes[count++])
										bit >>>= 1
									}
									arr[frag] = child
									return new ArrayNode(edit, count + 1, arr)
							  })(edit, frag, _newChild, mask, children)
							: new IndexedNode(
									edit,
									mask | bit,
									(function (mutate, at, v, arr) {
										const len = arr.length
										if (mutate) {
											let i = len
											for (; i >= at; ) arr[i--] = arr[i]
											arr[at] = v
											return arr
										}
										let i = 0,
											g = 0
										const out = new Array(len + 1)
										for (; i < at; ) out[g++] = arr[i++]
										out[at] = v
										for (; i < len; ) out[++g] = arr[i++]
										return out
									})(canEdit, indx, _newChild, children)
							  )
						: this
				}
				const current = children[indx],
					child = current.modify(edit, shift + SIZE, f, hash, key, size)
				if (current === child) return this
				let newChildren,
					bitmap = mask
				if (isEmptyNode(child)) {
					bitmap &= ~bit
					if (!bitmap) return new EmptyNode()
					if (
						children.length <= 2 &&
						(isEmptyNode((node = children[1 ^ indx])) ||
							"LeafNode" === node._tag ||
							"CollisionNode" === node._tag)
					)
						return children[1 ^ indx]
					newChildren = arraySpliceOut(canEdit, indx, children)
				} else newChildren = arrayUpdate(canEdit, indx, child, children)
				var node
				if (canEdit) {
					this.mask = bitmap
					this.children = newChildren
					return this
				}
				return new IndexedNode(edit, bitmap, newChildren)
			}
		}
		class ArrayNode {
			constructor(edit, size, children) {
				this.edit = edit
				this.size = size
				this.children = children
				this._tag = "ArrayNode"
			}
			modify(edit, shift, f, hash, key, size) {
				let count = this.size
				const children = this.children,
					frag = hashFragment(shift, hash),
					child = children[frag],
					newChild = (child || new EmptyNode()).modify(
						edit,
						shift + SIZE,
						f,
						hash,
						key,
						size
					)
				if (child === newChild) return this
				const canEdit = canEditNode(this, edit)
				let newChildren
				if (isEmptyNode(child) && !isEmptyNode(newChild)) {
					++count
					newChildren = arrayUpdate(canEdit, frag, newChild, children)
				} else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
					--count
					if (count <= MIN_ARRAY_NODE)
						return (function (edit, count, removed, elements) {
							const children = new Array(count - 1)
							let g = 0,
								bitmap = 0
							for (let i = 0, len = elements.length; i < len; ++i)
								if (i !== removed) {
									const elem = elements[i]
									if (elem && !isEmptyNode(elem)) {
										children[g++] = elem
										bitmap |= 1 << i
									}
								}
							return new IndexedNode(edit, bitmap, children)
						})(edit, count, frag, children)
					newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children)
				} else newChildren = arrayUpdate(canEdit, frag, newChild, children)
				if (canEdit) {
					this.size = count
					this.children = newChildren
					return this
				}
				return new ArrayNode(edit, count, newChildren)
			}
		}
		function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
			if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1])
			const subH1 = hashFragment(shift, h1),
				subH2 = hashFragment(shift, h2)
			if (subH1 === subH2)
				return child =>
					new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child])
			{
				const children = subH1 < subH2 ? [n1, n2] : [n2, n1]
				return new IndexedNode(
					edit,
					toBitmap(subH1) | toBitmap(subH2),
					children
				)
			}
		}
		function mergeLeaves(edit, shift, h1, n1, h2, n2) {
			let stack,
				currentShift = shift
			for (;;) {
				const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2)
				if ("function" != typeof res) {
					let final = res
					for (; null != stack; ) {
						final = stack.value(final)
						stack = stack.previous
					}
					return final
				}
				stack = new Stack(res, stack)
				currentShift += SIZE
			}
		}
		const HashMapTypeId = Symbol.for("@effect/data/HashMap")
		class HashMapImpl {
			constructor(_editable, _edit, _root, _size) {
				this._editable = _editable
				this._edit = _edit
				this._root = _root
				this._size = _size
				this._id = HashMapTypeId
			}
			[Symbol.iterator]() {
				return new HashMapIterator(this, (k, v) => [k, v])
			}
			[symbol]() {
				let hash = Hash_hash("HashMap")
				for (const item of this)
					hash ^= combine(Hash_hash(item[0]))(Hash_hash(item[1]))
				return hash
			}
			[Equal_symbol](that) {
				if (isHashMap(that)) {
					if (that._size !== this._size) return !1
					for (const item of this) {
						const elem = getHash(item[0], Hash_hash(item[0]))(that)
						if (Option_isNone(elem)) return !1
						if (!equals(item[1], elem.value)) return !1
					}
					return !0
				}
				return !1
			}
			toString() {
				return `HashMap(${Array.from(this)
					.map(([k, v]) => `[${String(k)}, ${String(v)}]`)
					.join(", ")})`
			}
			toJSON() {
				return { _tag: "HashMap", values: Array.from(this) }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
		}
		class HashMapIterator {
			constructor(map, f) {
				this.map = map
				this.f = f
				this.v = visitLazy(this.map._root, this.f, void 0)
			}
			next() {
				if (Option_isNone(this.v)) return { done: !0, value: void 0 }
				const v0 = this.v.value
				this.v = applyCont(v0.cont)
				return { done: !1, value: v0.value }
			}
			[Symbol.iterator]() {
				return new HashMapIterator(this.map, this.f)
			}
		}
		const applyCont = cont =>
				cont
					? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4])
					: Option_none(),
			visitLazy = (node, f, cont = undefined) => {
				switch (node._tag) {
					case "LeafNode":
						return Option_isSome(node.value)
							? Option_some({ value: f(node.key, node.value.value), cont })
							: applyCont(cont)
					case "CollisionNode":
					case "ArrayNode":
					case "IndexedNode": {
						const children = node.children
						return visitLazyChildren(children.length, children, 0, f, cont)
					}
					default:
						return applyCont(cont)
				}
			},
			visitLazyChildren = (len, children, i, f, cont) => {
				for (; i < len; ) {
					const child = children[i++]
					if (child && !isEmptyNode(child))
						return visitLazy(child, f, [len, children, i, f, cont])
				}
				return applyCont(cont)
			},
			HashMap_empty = () => new HashMapImpl(!1, 0, new EmptyNode(), 0),
			isHashMap = u =>
				"object" == typeof u &&
				null != u &&
				"_id" in u &&
				u._id === HashMapTypeId,
			HashMap_get = Function_dual(2, (self, key) =>
				getHash(self, key, Hash_hash(key))
			),
			getHash = Function_dual(3, (self, key, hash) => {
				let node = self._root,
					shift = 0
				for (;;)
					switch (node._tag) {
						case "LeafNode":
							return equals(key, node.key) ? node.value : Option_none()
						case "CollisionNode":
							if (hash === node.hash) {
								const children = node.children
								for (let i = 0, len = children.length; i < len; ++i) {
									const child = children[i]
									if ("key" in child && equals(key, child.key))
										return child.value
								}
							}
							return Option_none()
						case "IndexedNode": {
							const bit = toBitmap(hashFragment(shift, hash))
							if (node.mask & bit) {
								node = node.children[fromBitmap(node.mask, bit)]
								shift += SIZE
								break
							}
							return Option_none()
						}
						case "ArrayNode":
							node = node.children[hashFragment(shift, hash)]
							if (node) {
								shift += SIZE
								break
							}
							return Option_none()
						default:
							return Option_none()
					}
			}),
			HashMap_has = Function_dual(2, (self, key) =>
				Option_isSome(getHash(self, key, Hash_hash(key)))
			),
			set = Function_dual(3, (self, key, value) =>
				modifyAt(self, key, () => Option_some(value))
			),
			setTree = Function_dual(3, (self, newRoot, newSize) => {
				if (self._editable) {
					self._root = newRoot
					self._size = newSize
					return self
				}
				return newRoot === self._root
					? self
					: new HashMapImpl(self._editable, self._edit, newRoot, newSize)
			}),
			HashMap_size = self => self._size,
			beginMutation = self =>
				new HashMapImpl(!0, self._edit + 1, self._root, self._size),
			endMutation = self => {
				self._editable = !1
				return self
			},
			modifyAt = Function_dual(3, (self, key, f) =>
				modifyHash(self, key, Hash_hash(key), f)
			),
			modifyHash = Function_dual(4, (self, key, hash, f) => {
				const size = { value: self._size },
					newRoot = self._root.modify(
						self._editable ? self._edit : NaN,
						0,
						f,
						hash,
						key,
						size
					)
				return setTree(newRoot, size.value)(self)
			}),
			HashMap_remove = Function_dual(2, (self, key) =>
				modifyAt(self, key, Option_none)
			),
			forEachWithIndex = Function_dual(2, (self, f) =>
				HashMap_reduceWithIndex(self, void 0, (_, value, key) => f(value, key))
			),
			HashMap_reduceWithIndex = Function_dual(3, (self, zero, f) => {
				const root = self._root
				if ("LeafNode" === root._tag)
					return Option_isSome(root.value)
						? f(zero, root.value.value, root.key)
						: zero
				if ("EmptyNode" === root._tag) return zero
				const toVisit = [root.children]
				let children
				for (; (children = toVisit.pop()); )
					for (let i = 0, len = children.length; i < len; ) {
						const child = children[i++]
						child &&
							!isEmptyNode(child) &&
							("LeafNode" === child._tag
								? Option_isSome(child.value) &&
								  (zero = f(zero, child.value.value, child.key))
								: toVisit.push(child.children))
					}
				return zero
			}),
			HashSetTypeId = Symbol.for("@effect/data/HashSet")
		class HashSetImpl {
			constructor(_keyMap) {
				this._keyMap = _keyMap
				this._id = HashSetTypeId
			}
			[Symbol.iterator]() {
				return (self => new HashMapIterator(self, key => key))(this._keyMap)
			}
			[symbol]() {
				return combine(Hash_hash(this._keyMap))(Hash_hash("HashSet"))
			}
			[Equal_symbol](that) {
				return (
					!!isHashSet(that) &&
					HashMap_size(this._keyMap) === HashMap_size(that._keyMap) &&
					equals(this._keyMap, that._keyMap)
				)
			}
			toString() {
				return `HashSet(${Array.from(this).map(String).join(", ")})`
			}
			toJSON() {
				return { _tag: "HashSet", values: Array.from(this) }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
		}
		const isHashSet = u =>
				"object" == typeof u &&
				null != u &&
				"_id" in u &&
				u._id === HashSetTypeId,
			HashSet_empty = () => new HashSetImpl(HashMap_empty()),
			HashSet_has = Function_dual(2, (self, value) =>
				HashMap_has(self._keyMap, value)
			),
			HashSet_beginMutation = self =>
				new HashSetImpl(beginMutation(self._keyMap)),
			HashSet_endMutation = self => {
				self._keyMap._editable = !1
				return self
			},
			HashSet_mutate = Function_dual(2, (self, f) => {
				const transient = HashSet_beginMutation(self)
				f(transient)
				return HashSet_endMutation(transient)
			}),
			HashSet_add = Function_dual(2, (self, value) =>
				self._keyMap._editable
					? (set(value, !0)(self._keyMap), self)
					: new HashSetImpl(set(value, !0)(self._keyMap))
			),
			HashSet_remove = Function_dual(2, (self, value) =>
				self._keyMap._editable
					? (HashMap_remove(value)(self._keyMap), self)
					: new HashSetImpl(HashMap_remove(value)(self._keyMap))
			),
			HashSet_difference = Function_dual(2, (self, that) =>
				HashSet_mutate(self, set => {
					for (const value of that) HashSet_remove(set, value)
				})
			),
			HashSet_union = Function_dual(2, (self, that) =>
				HashSet_mutate(HashSet_empty(), set => {
					HashSet_forEach(self, value => HashSet_add(set, value))
					for (const value of that) HashSet_add(set, value)
				})
			),
			HashSet_forEach = Function_dual(2, (self, f) =>
				forEachWithIndex(self._keyMap, (_, k) => f(k))
			),
			HashSet_reduce = Function_dual(3, (self, zero, f) =>
				HashMap_reduceWithIndex(self._keyMap, zero, (z, _, a) => f(z, a))
			),
			mjs_HashMap_empty = HashMap_empty,
			mjs_HashMap_fromIterable = entries => {
				const map = beginMutation(HashMap_empty())
				for (const entry of entries) set(entry[0], entry[1])(map)
				return endMutation(map)
			},
			mjs_HashMap_get = HashMap_get,
			HashMap_set = set,
			mjs_HashMap_size = HashMap_size,
			mjs_HashSet_empty = HashSet_empty,
			mjs_HashSet_fromIterable = elements => {
				const set = HashSet_beginMutation(HashSet_empty())
				for (const value of elements) HashSet_add(set, value)
				return HashSet_endMutation(set)
			},
			mjs_HashSet_make = (...elements) => {
				const set = HashSet_beginMutation(HashSet_empty())
				for (const value of elements) HashSet_add(set, value)
				return HashSet_endMutation(set)
			},
			mjs_HashSet_has = HashSet_has,
			mjs_HashSet_size = self => HashMap_size(self._keyMap),
			mjs_HashSet_add = HashSet_add,
			mjs_HashSet_remove = HashSet_remove,
			mjs_HashSet_difference = HashSet_difference,
			mjs_HashSet_union = HashSet_union,
			mjs_HashSet_forEach = HashSet_forEach,
			mjs_HashSet_reduce = HashSet_reduce,
			HashSetPatchTypeId = Symbol.for("@effect/data/Differ/HashSetPatch")
		function HashSetPatch_variance(a) {
			return a
		}
		class HashSetPatch_Empty {
			constructor() {
				this._tag = "Empty"
				this._Value = HashSetPatch_variance
				this._id = HashSetPatchTypeId
			}
			[symbol]() {
				return string("HashSetPatch(Empty)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id
				)
			}
		}
		class HashSetPatch_AndThen {
			constructor(first, second) {
				this.first = first
				this.second = second
				this._tag = "AndThen"
				this._Value = HashSetPatch_variance
				this._id = HashSetPatchTypeId
			}
			[symbol]() {
				return string("HashSetPatch(AndThen)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.first, that.first) &&
					equals(this.second, that.second)
				)
			}
		}
		class HashSetPatch_Add {
			constructor(value) {
				this.value = value
				this._tag = "Add"
				this._Value = HashSetPatch_variance
				this._id = HashSetPatchTypeId
			}
			[symbol]() {
				return string("HashSetPatch(Add)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.value, that.value)
				)
			}
		}
		class HashSetPatch_Remove {
			constructor(value) {
				this.value = value
				this._tag = "Remove"
				this._Value = HashSetPatch_variance
				this._id = HashSetPatchTypeId
			}
			[symbol]() {
				return string("HashSetPatch(Remove)")
			}
			[Equal_symbol](that) {
				return (
					"object" == typeof that &&
					null !== that &&
					"_id" in that &&
					that._id === this._id &&
					"_tag" in that &&
					that._tag === this._id &&
					equals(this.value, that.value)
				)
			}
		}
		const HashSetPatch_empty = () => new HashSetPatch_Empty(),
			HashSetPatch_combine = Function_dual(
				2,
				(self, that) => new HashSetPatch_AndThen(self, that)
			),
			HashSetPatch_patch = Function_dual(2, (self, oldValue) => {
				let set = oldValue,
					patches = Chunk_of(self)
				for (; Chunk_isNonEmpty(patches); ) {
					const head = Chunk_headNonEmpty(patches),
						tail = Chunk_tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "AndThen":
							patches = Chunk_prepend(head.first)(
								Chunk_prepend(head.second)(tail)
							)
							break
						case "Add":
							set = mjs_HashSet_add(head.value)(set)
							patches = tail
							break
						case "Remove":
							set = mjs_HashSet_remove(head.value)(set)
							patches = tail
					}
				}
				return set
			}),
			Differ_HashSetPatch_empty = HashSetPatch_empty,
			Differ_HashSetPatch_combine = HashSetPatch_combine,
			Differ_HashSetPatch_patch = HashSetPatch_patch,
			DifferTypeId = Symbol.for("@effect/data/Differ")
		class DifferImpl {
			constructor(params) {
				this._id = DifferTypeId
				this._P = Function_identity
				this._V = Function_identity
				this.empty = params.empty
				this.diff = params.diff
				this.combine = params.combine
				this.patch = params.patch
			}
		}
		const Differ_make = params => new DifferImpl(params),
			Differ_diff = Function_dual(3, (self, oldValue, newValue) =>
				self.diff(oldValue, newValue)
			),
			Differ_combine = Function_dual(3, (self, first, second) =>
				self.combine(first, second)
			),
			Differ_patch = Function_dual(3, (self, patch, oldValue) =>
				self.patch(patch, oldValue)
			),
			mjs_Differ_make = Differ_make,
			Differ_environment = () =>
				Differ_make({
					empty: Differ_ContextPatch_empty(),
					combine: (first, second) =>
						Differ_ContextPatch_combine(second)(first),
					diff: (oldValue, newValue) =>
						((oldValue, newValue) => {
							const missingServices = new Map(oldValue.unsafeMap)
							let patch = ContextPatch_empty()
							for (const [tag, newService] of newValue.unsafeMap.entries())
								if (missingServices.has(tag)) {
									const old = missingServices.get(tag)
									missingServices.delete(tag)
									equals(old, newService) ||
										(patch = ContextPatch_combine(
											new UpdateService(tag, () => newService)
										)(patch))
								} else {
									missingServices.delete(tag)
									patch = ContextPatch_combine(new AddService(tag, newService))(
										patch
									)
								}
							for (const [tag] of missingServices.entries())
								patch = ContextPatch_combine(new RemoveService(tag))(patch)
							return patch
						})(oldValue, newValue),
					patch: (patch, oldValue) =>
						Differ_ContextPatch_patch(oldValue)(patch),
				}),
			Differ_hashSet = () =>
				Differ_make({
					empty: Differ_HashSetPatch_empty(),
					combine: (first, second) =>
						Differ_HashSetPatch_combine(second)(first),
					diff: (oldValue, newValue) =>
						((oldValue, newValue) => {
							const [removed, patch] = mjs_HashSet_reduce(
								[oldValue, HashSetPatch_empty()],
								([set, patch], value) =>
									mjs_HashSet_has(value)(set)
										? [mjs_HashSet_remove(value)(set), patch]
										: [
												set,
												HashSetPatch_combine(new HashSetPatch_Add(value))(
													patch
												),
										  ]
							)(newValue)
							return mjs_HashSet_reduce(patch, (patch, value) =>
								HashSetPatch_combine(new HashSetPatch_Remove(value))(patch)
							)(removed)
						})(oldValue, newValue),
					patch: (patch, oldValue) =>
						Differ_HashSetPatch_patch(oldValue)(patch),
				}),
			Differ_update = () => {
				return (
					(f = (_, a) => a),
					Differ_make({
						empty: Function_identity,
						combine: (first, second) =>
							first === Function_identity
								? second
								: second === Function_identity
								? first
								: a => second(first(a)),
						diff: (oldValue, newValue) =>
							equals(oldValue, newValue)
								? Function_identity
								: constant(newValue),
						patch: (patch, oldValue) => f(oldValue, patch(oldValue)),
					})
				)
				var f
			},
			MutableRef_TypeId = Symbol.for("@effect/data/MutableRef")
		class MutableRefImpl {
			constructor(current) {
				this.current = current
				this._T = _ => _
				this._id = MutableRef_TypeId
			}
			toString() {
				return `MutableRef(${String(this.current)})`
			}
			toJSON() {
				return { _tag: "MutableRef", current: this.current }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
		}
		const MutableRef_make = value => new MutableRefImpl(value),
			MutableRef_get = self => self.current,
			getAndSet = Function_dual(2, (self, value) => {
				const ret = self.current
				self.current = value
				return ret
			}),
			getAndUpdate = Function_dual(2, (self, f) =>
				getAndSet(self, f(MutableRef_get(self)))
			),
			MutableRef_set = Function_dual(2, (self, value) => {
				self.current = value
				return self
			}),
			MutableRef_update = Function_dual(2, (self, f) =>
				MutableRef_set(self, f(MutableRef_get(self)))
			)
		var fiberId_a, fiberId_b
		const FiberIdTypeId = Symbol.for("@effect/io/Fiber/Id")
		class fiberId_None {
			constructor() {
				this[fiberId_a] = FiberIdTypeId
				this._tag = "None"
			}
			[((fiberId_a = FiberIdTypeId), symbol)]() {
				return combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Id"))
			}
			[Equal_symbol](that) {
				return isFiberId(that) && "None" === that._tag
			}
		}
		class Runtime {
			constructor(id, startTimeMillis) {
				this.id = id
				this.startTimeMillis = startTimeMillis
				this[fiberId_b] = FiberIdTypeId
				this._tag = "Runtime"
			}
			[((fiberId_b = FiberIdTypeId), symbol)]() {
				return combine(Hash_hash(this.startTimeMillis))(
					combine(Hash_hash(this.id))(
						combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Id"))
					)
				)
			}
			[Equal_symbol](that) {
				return (
					isFiberId(that) &&
					"Runtime" === that._tag &&
					this.id === that.id &&
					this.startTimeMillis === that.startTimeMillis
				)
			}
		}
		const fiberId_none = new fiberId_None(),
			isFiberId = self =>
				"object" == typeof self && null != self && FiberIdTypeId in self,
			ids = self => {
				switch (self._tag) {
					case "None":
						return mjs_HashSet_empty()
					case "Runtime":
						return mjs_HashSet_make(self.id)
					case "Composite":
						return mjs_HashSet_union(ids(self.right))(ids(self.left))
				}
			},
			_fiberCounter = globalValue(
				Symbol.for("@effect/io/Fiber/Id/_fiberCounter"),
				() => MutableRef_make(0)
			),
			threadName = self =>
				Array.from(ids(self))
					.map(n => `#${n}`)
					.join(","),
			Id_none = fiberId_none,
			Id_unsafeMake = () => {
				const id = MutableRef_get(_fiberCounter)
				MutableRef_set(id + 1)(_fiberCounter)
				return new Runtime(id, new Date().getTime())
			},
			active = patch => 255 & patch,
			enabled = patch => (patch >> 8) & 255,
			runtimeFlagsPatch_make = (active, enabled) =>
				(255 & active) + ((enabled & active & 255) << 8),
			runtimeFlagsPatch_empty = runtimeFlagsPatch_make(0, 0),
			exclude = Function_dual(2, (self, flag) =>
				runtimeFlagsPatch_make(active(self) & ~flag, enabled(self))
			),
			andThen = Function_dual(2, (self, that) => self | that),
			cooperativeYielding = self => runtimeFlags_isEnabled(self, 32),
			runtimeFlags_enable = Function_dual(2, (self, flag) => self | flag),
			interruptible = self => interruption(self) && !windDown(self),
			interruption = self => runtimeFlags_isEnabled(self, 1),
			runtimeFlags_isEnabled = Function_dual(
				2,
				(self, flag) => 0 != (self & flag)
			),
			runtimeFlags_make = (...flags) => flags.reduce((a, b) => a | b, 0),
			runtimeFlags_none = runtimeFlags_make(0),
			opSupervision = self => runtimeFlags_isEnabled(self, 2),
			runtimeMetrics = self => runtimeFlags_isEnabled(self, 4),
			windDown = self => runtimeFlags_isEnabled(self, 16),
			runtimeFlags_diff = Function_dual(2, (self, that) =>
				runtimeFlagsPatch_make(self ^ that, that)
			),
			runtimeFlags_patch = Function_dual(
				2,
				(self, patch) =>
					(self & (((~active(patch) >>> 0) & 255) | enabled(patch))) |
					(active(patch) & enabled(patch))
			),
			Patch_empty = runtimeFlagsPatch_empty,
			Patch_disable = flag => runtimeFlagsPatch_make(flag, 0),
			Patch_exclude = exclude
		var cause_a
		const CauseTypeId = Symbol.for("@effect/io/Cause"),
			proto = {
				[CauseTypeId]: { _E: _ => _ },
				[symbol]() {
					return combine(Hash_hash(flattenCause(this)))(
						Hash_hash("@effect/io/Cause")
					)
				},
				[Equal_symbol](that) {
					return isCause(that) && causeEquals(this, that)
				},
			},
			cause_empty = (() => {
				const o = Object.create(proto)
				o._tag = "Empty"
				return o
			})(),
			fail = error => {
				const o = Object.create(proto)
				o._tag = "Fail"
				o.error = error
				return o
			},
			die = defect => {
				const o = Object.create(proto)
				o._tag = "Die"
				o.defect = defect
				return o
			},
			interrupt = fiberId => {
				const o = Object.create(proto)
				o._tag = "Interrupt"
				o.fiberId = fiberId
				return o
			},
			annotated = (cause, annotation) => {
				const o = Object.create(proto)
				o._tag = "Annotated"
				o.cause = cause
				o.annotation = annotation
				return o
			},
			parallel = (left, right) => {
				const o = Object.create(proto)
				o._tag = "Parallel"
				o.left = left
				o.right = right
				return o
			},
			sequential = (left, right) => {
				const o = Object.create(proto)
				o._tag = "Sequential"
				o.left = left
				o.right = right
				return o
			},
			isCause = u => "object" == typeof u && null != u && CauseTypeId in u,
			isEmptyType = self => "Empty" === self._tag,
			isInterruptedOnly = self =>
				reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self),
			cause_defects = self =>
				Chunk_reverse(
					cause_reduce(self, Chunk_empty(), (list, cause) =>
						"Die" === cause._tag
							? Option_some(Chunk_prepend(cause.defect)(list))
							: Option_none()
					)
				),
			failureOrCause = self => {
				const option = (self =>
					find(self, cause =>
						"Fail" === cause._tag ? Option_some(cause.error) : Option_none()
					))(self)
				switch (option._tag) {
					case "None":
						return Either_right(self)
					case "Some":
						return Either_left(option.value)
				}
			},
			stripFailures = self =>
				cause_match(
					self,
					cause_empty,
					() => cause_empty,
					defect => die(defect),
					fiberId => interrupt(fiberId),
					(cause, annotation) =>
						isEmptyType(cause) ? cause : annotated(cause, annotation),
					(left, right) => sequential(left, right),
					(left, right) => parallel(left, right)
				),
			causeEquals = (left, right) => {
				let leftStack = Chunk_of(left),
					rightStack = Chunk_of(right)
				for (; Chunk_isNonEmpty(leftStack) && Chunk_isNonEmpty(rightStack); ) {
					const [leftParallel, leftSequential] = cause_reduce(
							[mjs_HashSet_empty(), Chunk_empty()],
							([parallel, sequential], cause) => {
								const [par, seq] = evaluateCause(cause)
								return Option_some([
									mjs_HashSet_union(par)(parallel),
									Chunk_concat(seq)(sequential),
								])
							}
						)(Chunk_headNonEmpty(leftStack)),
						[rightParallel, rightSequential] = cause_reduce(
							[mjs_HashSet_empty(), Chunk_empty()],
							([parallel, sequential], cause) => {
								const [par, seq] = evaluateCause(cause)
								return Option_some([
									mjs_HashSet_union(par)(parallel),
									Chunk_concat(seq)(sequential),
								])
							}
						)(Chunk_headNonEmpty(rightStack))
					if (!equals(leftParallel, rightParallel)) return !1
					leftStack = leftSequential
					rightStack = rightSequential
				}
				return !0
			},
			flattenCause = cause => flattenCauseLoop(Chunk_of(cause), Chunk_empty()),
			flattenCauseLoop = (causes, flattened) => {
				for (;;) {
					const [parallel, sequential] = Chunk_reduce(
							[mjs_HashSet_empty(), Chunk_empty()],
							([parallel, sequential], cause) => {
								const [par, seq] = evaluateCause(cause)
								return [
									mjs_HashSet_union(par)(parallel),
									Chunk_concat(seq)(sequential),
								]
							}
						)(causes),
						updated =
							mjs_HashSet_size(parallel) > 0
								? Chunk_prepend(parallel)(flattened)
								: flattened
					if (Chunk_isEmpty(sequential)) return Chunk_reverse(updated)
					causes = sequential
					flattened = updated
				}
				throw new Error(
					"BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
				)
			},
			find = Function_dual(2, (self, pf) => {
				const stack = [self]
				for (; stack.length > 0; ) {
					const item = stack.pop(),
						option = pf(item)
					switch (option._tag) {
						case "None":
							switch (item._tag) {
								case "Sequential":
								case "Parallel":
									stack.push(item.right)
									stack.push(item.left)
									break
								case "Annotated":
									stack.push(item.cause)
							}
							break
						case "Some":
							return option
					}
				}
				return Option_none()
			}),
			evaluateCause = self => {
				let cause = self
				const stack = []
				let _parallel = mjs_HashSet_empty(),
					_sequential = Chunk_empty()
				for (; void 0 !== cause; )
					switch (cause._tag) {
						case "Empty":
							if (0 === stack.length) return [_parallel, _sequential]
							cause = stack.pop()
							break
						case "Fail":
							if (0 === stack.length)
								return [mjs_HashSet_add(cause.error)(_parallel), _sequential]
							_parallel = mjs_HashSet_add(cause.error)(_parallel)
							cause = stack.pop()
							break
						case "Die":
							if (0 === stack.length)
								return [mjs_HashSet_add(cause.defect)(_parallel), _sequential]
							_parallel = mjs_HashSet_add(cause.defect)(_parallel)
							cause = stack.pop()
							break
						case "Interrupt":
							if (0 === stack.length)
								return [mjs_HashSet_add(cause.fiberId)(_parallel), _sequential]
							_parallel = mjs_HashSet_add(cause.fiberId)(_parallel)
							cause = stack.pop()
							break
						case "Annotated":
							cause = cause.cause
							break
						case "Sequential":
							switch (cause.left._tag) {
								case "Empty":
									cause = cause.right
									break
								case "Sequential":
									cause = sequential(
										cause.left.left,
										sequential(cause.left.right, cause.right)
									)
									break
								case "Parallel":
									cause = parallel(
										sequential(cause.left.left, cause.right),
										sequential(cause.left.right, cause.right)
									)
									break
								case "Annotated":
									cause = sequential(cause.left.cause, cause.right)
									break
								default:
									_sequential = Chunk_prepend(cause.right)(_sequential)
									cause = cause.left
							}
							break
						case "Parallel":
							stack.push(cause.right)
							cause = cause.left
					}
				throw new Error(
					"BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues"
				)
			},
			IsInterruptedOnlyCauseReducer = {
				emptyCase: Function_constTrue,
				failCase: Function_constFalse,
				dieCase: Function_constFalse,
				interruptCase: Function_constTrue,
				annotatedCase: (_, value) => value,
				sequentialCase: (_, left, right) => left && right,
				parallelCase: (_, left, right) => left && right,
			},
			cause_match = Function_dual(
				8,
				(
					self,
					emptyCase,
					failCase,
					dieCase,
					interruptCase,
					annotatedCase,
					sequentialCase,
					parallelCase
				) =>
					reduceWithContext(self, void 0, {
						emptyCase: () => emptyCase,
						failCase: (_, error) => failCase(error),
						dieCase: (_, defect) => dieCase(defect),
						interruptCase: (_, fiberId) => interruptCase(fiberId),
						annotatedCase: (_, value, annotation) =>
							annotatedCase(value, annotation),
						sequentialCase: (_, left, right) => sequentialCase(left, right),
						parallelCase: (_, left, right) => parallelCase(left, right),
					})
			),
			cause_reduce = Function_dual(3, (self, zero, pf) => {
				let accumulator = zero,
					cause = self
				const causes = []
				for (; void 0 !== cause; ) {
					const option = pf(accumulator, cause)
					accumulator = Option_isSome(option) ? option.value : accumulator
					switch (cause._tag) {
						case "Sequential":
						case "Parallel":
							causes.push(cause.right)
							cause = cause.left
							break
						case "Annotated":
							cause = cause.cause
							break
						default:
							cause = void 0
					}
					void 0 === cause && causes.length > 0 && (cause = causes.pop())
				}
				return accumulator
			}),
			reduceWithContext = Function_dual(3, (self, context, reducer) => {
				const input = [self],
					output = []
				for (; input.length > 0; ) {
					const cause = input.pop()
					switch (cause._tag) {
						case "Empty":
							output.push(Either_right(reducer.emptyCase(context)))
							break
						case "Fail":
							output.push(Either_right(reducer.failCase(context, cause.error)))
							break
						case "Die":
							output.push(Either_right(reducer.dieCase(context, cause.defect)))
							break
						case "Interrupt":
							output.push(
								Either_right(reducer.interruptCase(context, cause.fiberId))
							)
							break
						case "Annotated":
							input.push(cause.cause)
							output.push(
								Either_left({
									_tag: "AnnotatedCase",
									annotation: cause.annotation,
								})
							)
							break
						case "Sequential":
							input.push(cause.right)
							input.push(cause.left)
							output.push(Either_left({ _tag: "SequentialCase" }))
							break
						case "Parallel":
							input.push(cause.right)
							input.push(cause.left)
							output.push(Either_left({ _tag: "ParallelCase" }))
					}
				}
				const accumulator = []
				for (; output.length > 0; ) {
					const either = output.pop()
					switch (either._tag) {
						case "Left":
							switch (either.left._tag) {
								case "SequentialCase": {
									const left = accumulator.pop(),
										right = accumulator.pop(),
										value = reducer.sequentialCase(context, left, right)
									accumulator.push(value)
									break
								}
								case "ParallelCase": {
									const left = accumulator.pop(),
										right = accumulator.pop(),
										value = reducer.parallelCase(context, left, right)
									accumulator.push(value)
									break
								}
								case "AnnotatedCase": {
									const cause = accumulator.pop(),
										value = reducer.annotatedCase(
											context,
											cause,
											either.left.annotation
										)
									accumulator.push(value)
									break
								}
							}
							break
						case "Right":
							accumulator.push(either.right)
					}
				}
				if (0 === accumulator.length)
					throw new Error(
						"BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues"
					)
				return accumulator.pop()
			}),
			makeException = (proto, tag) => {
				const _tag = { value: tag, enumerable: !0 },
					protoWithToString = {
						...proto,
						toString() {
							return `${this._tag}: ${this.message}`
						},
					}
				return message =>
					Object.create(protoWithToString, {
						_tag,
						message: { value: message, enumerable: !0 },
					})
			},
			InterruptedExceptionTypeId = Symbol.for(
				"@effect/io/Cause/errors/InterruptedException"
			),
			isInterruptedException = u =>
				"object" == typeof u && null != u && InterruptedExceptionTypeId in u,
			NoSuchElementExceptionTypeId = Symbol.for(
				"@effect/io/Cause/errors/NoSuchElement"
			),
			NoSuchElementException = makeException(
				{ [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId },
				"NoSuchElementException"
			),
			StackAnnotationTypeId = Symbol.for("@effect/io/Cause/StackAnnotation")
		class StackAnnotation {
			constructor(stack, seq) {
				this.stack = stack
				this.seq = seq
				this[cause_a] = StackAnnotationTypeId
			}
		}
		cause_a = StackAnnotationTypeId
		const globalErrorSeq = MutableRef_make(0),
			isStackAnnotation = u =>
				"object" == typeof u && null != u && StackAnnotationTypeId in u,
			DeferredTypeId = Symbol.for("@effect/io/Deferred"),
			deferredVariance = { _E: _ => _, _A: _ => _ },
			pending = joiners => ({ _tag: "Pending", joiners }),
			done = effect => ({ _tag: "Done", effect })
		class DefaultScheduler {
			constructor() {
				this.running = !1
				this.tasks = []
			}
			starveInternal(depth) {
				const toRun = this.tasks
				this.tasks = []
				for (let i = 0; i < toRun.length; i++) toRun[i]()
				0 === this.tasks.length ? (this.running = !1) : this.starve(depth)
			}
			starve(depth = 0) {
				depth >= 2048
					? setTimeout(() => this.starveInternal(0), 0)
					: Promise.resolve(void 0).then(() => this.starveInternal(depth + 1))
			}
			scheduleTask(task) {
				this.tasks.push(task)
				if (!this.running) {
					this.running = !0
					this.starve()
				}
			}
		}
		const defaultScheduler = globalValue(
			Symbol.for("@effect/io/Scheduler/defaultScheduler"),
			() => new DefaultScheduler()
		)
		var core_a, core_b, core_c
		const EffectErrorTypeId = Symbol.for("@effect/io/Effect/Error"),
			isEffectError = u =>
				"object" == typeof u && null != u && EffectErrorTypeId in u,
			core_EffectTypeId = Symbol.for("@effect/io/Effect")
		class RevertFlags {
			constructor(patch) {
				this.patch = patch
				this._tag = "RevertFlags"
			}
		}
		class EffectPrimitive {
			constructor(_tag) {
				this._tag = _tag
				this.i0 = void 0
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[core_a] = core_effectVariance
			}
			[((core_a = core_EffectTypeId), Equal_symbol)](that) {
				return this === that
			}
			[symbol]() {
				return random(this)
			}
			traced(trace) {
				if (trace) {
					const effect = new EffectPrimitive("Traced")
					effect.i0 = this
					effect.trace = trace
					return effect
				}
				return this
			}
		}
		class EffectPrimitiveFailure {
			constructor(_tag) {
				this._tag = _tag
				this.i0 = void 0
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[core_b] = core_effectVariance
			}
			[((core_b = core_EffectTypeId), Equal_symbol)](that) {
				return this === that
			}
			[symbol]() {
				return random(this)
			}
			get cause() {
				return this.i0
			}
			traced(trace) {
				if (trace) {
					const effect = new EffectPrimitive("Traced")
					effect.i0 = this
					effect.trace = trace
					return effect
				}
				return this
			}
		}
		class EffectPrimitiveSuccess {
			constructor(_tag) {
				this._tag = _tag
				this.i0 = void 0
				this.i1 = void 0
				this.i2 = void 0
				this.trace = void 0
				this[core_c] = core_effectVariance
			}
			[((core_c = core_EffectTypeId), Equal_symbol)](that) {
				return this === that
			}
			[symbol]() {
				return random(this)
			}
			get value() {
				return this.i0
			}
			traced(trace) {
				if (trace) {
					const effect = new EffectPrimitive("Traced")
					effect.i0 = this
					effect.trace = trace
					return effect
				}
				return this
			}
		}
		const core_effectVariance = { _R: _ => _, _E: _ => _, _A: _ => _ },
			isEffect = u =>
				"object" == typeof u && null != u && core_EffectTypeId in u,
			acquireUseRelease = dualWithTrace(
				3,
				(trace, restoreTracing) => (acquire, use, release) =>
					uninterruptibleMask(restore =>
						core_flatMap(a =>
							core_flatMap(exit =>
								matchCauseEffect(
									cause => {
										switch (exit._tag) {
											case "Failure":
												return failCause(parallel(exit.i0, cause))
											case "Success":
												return failCause(cause)
										}
									},
									() => exit
								)(suspend(() => restoreTracing(release)(a, exit)))
							)(core_exit(suspend(() => restore(restoreTracing(use)(a)))))
						)(acquire)
					).traced(trace)
			),
			core_as = dualWithTrace(
				2,
				trace => (self, value) =>
					core_flatMap(() => succeed(value))(self).traced(trace)
			),
			core_asUnit = methodWithTrace(
				trace => self => core_as(void 0)(self).traced(trace)
			),
			core_async = methodWithTrace(
				trace =>
					(register, blockingOn = Id_none) => {
						const effect = new EffectPrimitive("Async")
						effect.i0 = register
						effect.i1 = blockingOn
						return trace ? effect.traced(trace) : effect
					}
			),
			asyncInterruptEither = methodWithTrace(
				(trace, restore) =>
					(register, blockingOn = Id_none) =>
						suspend(() => {
							let cancelerRef = core_unit()
							return onInterrupt(() => cancelerRef)(
								core_async(resume => {
									const result = restore(register)(resume)
									Either_isRight(result)
										? resume(result.right)
										: (cancelerRef = result.left)
								}, blockingOn)
							)
						}).traced(trace)
			),
			asyncInterrupt = methodWithTrace(
				(trace, restore) =>
					(register, blockingOn = Id_none) =>
						suspend(() => {
							let cancelerRef = core_unit()
							return onInterrupt(() => cancelerRef)(
								core_async(resume => {
									cancelerRef = restore(register)(resume)
								}, blockingOn)
							)
						}).traced(trace)
			),
			catchAll = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					matchEffect(restore(f), succeed)(self).traced(trace)
			),
			core_die = methodWithTrace(
				trace => defect => failCause(die(defect)).traced(trace)
			),
			core_either = methodWithTrace(
				trace => self =>
					matchEffect(
						e => succeed(Either_left(e)),
						a => succeed(Either_right(a))
					)(self).traced(trace)
			),
			context = methodWithTrace(
				trace => () => suspend(() => fiberRefGet(currentContext)).traced(trace)
			),
			contextWithEffect = methodWithTrace(
				(trace, restore) => f =>
					core_flatMap(restore(f))(context()).traced(trace)
			),
			core_exit = methodWithTrace(
				trace => self =>
					matchCause(
						cause => exitFailCause(cause),
						a => exitSucceed(a)
					)(self).traced(trace)
			),
			core_fail = methodWithTrace(
				trace => error => failCause(fail(error)).traced(trace)
			),
			failSync = methodWithTrace(
				(trace, restore) => evaluate =>
					failCauseSync(() => fail(restore(evaluate)())).traced(trace)
			),
			failCause = methodWithTrace(trace => cause => {
				const effect = new EffectPrimitiveFailure("Failure")
				effect.i0 = cause
				return trace ? effect.traced(trace) : effect
			}),
			failCauseSync = methodWithTrace(
				(trace, restore) => evaluate =>
					core_flatMap(sync(restore(evaluate)), failCause).traced(trace)
			),
			fiberId = methodWithTrace(
				trace => () =>
					withFiberRuntime(state => succeed(state.id())).traced(trace)
			),
			core_flatMap = dualWithTrace(2, (trace, restore) => (self, f) => {
				const effect = new EffectPrimitive("OnSuccess")
				effect.i0 = self
				effect.i1 = restore(f)
				return trace ? effect.traced(trace) : effect
			}),
			core_flatten = methodWithTrace(
				trace => self => core_flatMap(self, Function_identity).traced(trace)
			),
			matchCause = dualWithTrace(
				3,
				(trace, restore) => (self, onFailure, onSuccess) =>
					matchCauseEffect(
						cause => succeed(restore(onFailure)(cause)),
						a => succeed(restore(onSuccess)(a))
					)(self).traced(trace)
			),
			matchCauseEffect = dualWithTrace(
				3,
				(trace, restore) => (self, onFailure, onSuccess) => {
					const effect = new EffectPrimitive("OnSuccessAndFailure")
					effect.i0 = self
					effect.i1 = restore(onFailure)
					effect.i2 = restore(onSuccess)
					return trace ? effect.traced(trace) : effect
				}
			),
			matchEffect = dualWithTrace(
				3,
				(trace, restore) => (self, onFailure, onSuccess) =>
					matchCauseEffect(
						self,
						cause => {
							const failures = (self =>
								Chunk_reverse(
									cause_reduce(self, Chunk_empty(), (list, cause) =>
										"Fail" === cause._tag
											? Option_some(Chunk_prepend(cause.error)(list))
											: Option_none()
									)
								))(cause)
							return cause_defects(cause).length > 0
								? failCause(
										(self =>
											cause_match(
												self,
												cause_empty,
												failure => die(failure),
												defect => die(defect),
												fiberId => interrupt(fiberId),
												(cause, annotation) =>
													isEmptyType(cause)
														? cause
														: annotated(cause, annotation),
												(left, right) => sequential(left, right),
												(left, right) => parallel(left, right)
											))(cause)
								  )
								: failures.length > 0
								? restore(onFailure)(unsafeHead(failures))
								: failCause(cause)
						},
						onSuccess
					).traced(trace)
			),
			core_forEach = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					suspend(() => {
						const arr = Array.from(self),
							ret = new Array(arr.length)
						let i = 0
						return core_as(unsafeFromArray(ret))(
							whileLoop(
								() => i < arr.length,
								() => restore(f)(arr[i]),
								b => {
									ret[i++] = b
								}
							)
						)
					}).traced(trace)
			),
			forEachDiscard = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					suspend(() => {
						const arr = Array.from(self)
						let i = 0
						return whileLoop(
							() => i < arr.length,
							() => restore(f)(arr[i++]),
							() => {}
						)
					}).traced(trace)
			),
			core_fromOption = methodWithTrace(trace => option => {
				switch (option._tag) {
					case "None":
						return core_fail(Option_none()).traced(trace)
					case "Some":
						return succeed(option.value).traced(trace)
				}
			}),
			core_fromEither = methodWithTrace(trace => either => {
				switch (either._tag) {
					case "Left":
						return core_fail(either.left).traced(trace)
					case "Right":
						return succeed(either.right).traced(trace)
				}
			}),
			core_interruptible = methodWithTrace(trace => self => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.i0 = runtimeFlagsPatch_make((flag = 1), flag)
				var flag
				effect.i1 = () => self
				return trace ? effect.traced(trace) : effect
			}),
			core_map = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					core_flatMap(a => sync(() => restore(f)(a)))(self).traced(trace)
			),
			mapBoth = dualWithTrace(
				3,
				(trace, restore) => (self, f, g) =>
					matchEffect(
						self,
						e => failSync(() => restore(f)(e)),
						a => sync(() => restore(g)(a))
					).traced(trace)
			),
			mapError = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					matchCauseEffect(
						self,
						cause => {
							const either = failureOrCause(cause)
							switch (either._tag) {
								case "Left":
									return failSync(() => restore(f)(either.left))
								case "Right":
									return failCause(either.right)
							}
						},
						succeed
					).traced(trace)
			),
			onExit = dualWithTrace(
				2,
				(trace, restoreTrace) => (self, cleanup) =>
					uninterruptibleMask(restore =>
						matchCauseEffect(
							restore(self),
							cause1 => {
								const result = exitFailCause(cause1)
								return matchCauseEffect(
									cause2 => exitFailCause(sequential(cause1, cause2)),
									() => result
								)(restoreTrace(cleanup)(result))
							},
							success => {
								const result = exitSucceed(success)
								return core_zipRight(result)(restoreTrace(cleanup)(result))
							}
						)
					).traced(trace)
			),
			onInterrupt = dualWithTrace(
				2,
				(trace, restore) => (self, cleanup) =>
					onExit(
						self,
						exitMatch(
							cause =>
								isInterruptedOnly(cause)
									? core_asUnit(
											restore(cleanup)(
												(self =>
													cause_reduce(
														self,
														mjs_HashSet_empty(),
														(set, cause) =>
															"Interrupt" === cause._tag
																? Option_some(
																		mjs_HashSet_add(cause.fiberId)(set)
																  )
																: Option_none()
													))(cause)
											)
									  )
									: core_unit(),
							() => core_unit()
						)
					).traced(trace)
			),
			core_orElse = dualWithTrace(
				2,
				(trace, restore) => (self, that) =>
					attemptOrElse(restore(that), succeed)(self).traced(trace)
			),
			orDie = methodWithTrace(
				trace => self => orDieWith(self, Function_identity).traced(trace)
			),
			orDieWith = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					matchEffect(e => core_die(restore(f)(e)), succeed)(self).traced(trace)
			),
			provideContext = dualWithTrace(
				2,
				trace => (self, context) =>
					fiberRefLocally(currentContext, context)(self).traced(trace)
			),
			contramapContext = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					contextWithEffect(context =>
						provideContext(restore(f)(context))(self)
					).traced(trace)
			),
			succeed = methodWithTrace(trace => value => {
				const effect = new EffectPrimitiveSuccess("Success")
				effect.i0 = value
				return trace ? effect.traced(trace) : effect
			}),
			suspend = methodWithTrace(
				(trace, restore) => effect =>
					core_flatMap(Function_identity)(sync(restore(effect))).traced(trace)
			),
			sync = methodWithTrace((trace, restore) => evaluate => {
				const effect = new EffectPrimitive("Sync")
				effect.i0 = restore(evaluate)
				return trace ? effect.traced(trace) : effect
			}),
			core_tap = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					core_flatMap(a => core_as(a)(restore(f)(a)))(self).traced(trace)
			),
			transplant = methodWithTrace(
				(trace, restore) => f =>
					withFiberRuntime(state => {
						const scopeOverride = state.getFiberRef(forkScopeOverride),
							scope = getOrElse(() => state.scope())(scopeOverride)
						return restore(f)(
							fiberRefLocally(forkScopeOverride, Option_some(scope))
						)
					}).traced(trace)
			),
			attemptOrElse = dualWithTrace(
				3,
				(trace, restore) => (self, that, onSuccess) =>
					matchCauseEffect(
						self,
						cause =>
							cause_defects(cause).length > 0
								? failCause(
										getOrThrow(
											(self =>
												cause_match(
													self,
													Option_none(),
													failure => Option_some(die(failure)),
													defect => Option_some(die(defect)),
													() => Option_none(),
													(option, annotation) =>
														Option_map(cause => annotated(cause, annotation))(
															option
														),
													(left, right) =>
														Option_isSome(left) && Option_isSome(right)
															? Option_some(sequential(left.value, right.value))
															: Option_isSome(left) && Option_isNone(right)
															? Option_some(left.value)
															: Option_isNone(left) && Option_isSome(right)
															? Option_some(right.value)
															: Option_none(),
													(left, right) =>
														Option_isSome(left) && Option_isSome(right)
															? Option_some(parallel(left.value, right.value))
															: Option_isSome(left) && Option_isNone(right)
															? Option_some(left.value)
															: Option_isNone(left) && Option_isSome(right)
															? Option_some(right.value)
															: Option_none()
												))(cause)
										)
								  )
								: restore(that)(),
						restore(onSuccess)
					).traced(trace)
			),
			uninterruptible = methodWithTrace(trace => self => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.i0 = Patch_disable(1)
				effect.i1 = () => self
				return trace ? effect.traced(trace) : effect
			}),
			uninterruptibleMask = methodWithTrace((trace, restore) => f => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.i0 = Patch_disable(1)
				effect.i1 = oldFlags =>
					interruption(oldFlags)
						? restore(f)(core_interruptible)
						: restore(f)(uninterruptible)
				return trace ? effect.traced(trace) : effect
			}),
			core_unit = methodWithTrace(trace => _ => succeed(void 0).traced(trace)),
			updateRuntimeFlags = methodWithTrace(trace => patch => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.i0 = patch
				effect.i1 = void 0
				return trace ? effect.traced(trace) : effect
			}),
			whenEffect = dualWithTrace(
				2,
				trace => (self, predicate) =>
					core_flatMap(b =>
						b ? core_map(Option_some)(self) : succeed(Option_none())
					)(predicate).traced(trace)
			),
			whileLoop = methodWithTrace(
				(trace, restore) => (check, body, process) => {
					const effect = new EffectPrimitive("While")
					effect.i0 = restore(check)
					effect.i1 = restore(body)
					effect.i2 = restore(process)
					return trace ? effect.traced(trace) : effect
				}
			),
			withFiberRuntime = methodWithTrace((trace, restore) => withRuntime => {
				const effect = new EffectPrimitive("WithRuntime")
				effect.i0 = restore(withRuntime)
				return trace ? effect.traced(trace) : effect
			}),
			withParallelism = dualWithTrace(
				2,
				trace => (self, parallelism) =>
					suspend(() =>
						fiberRefLocally(currentParallelism, Option_some(parallelism))(self)
					).traced(trace)
			),
			withParallelismUnbounded = methodWithTrace(
				trace => self =>
					suspend(() =>
						fiberRefLocally(currentParallelism, Option_none())(self)
					).traced(trace)
			),
			yieldNow = methodWithTrace(trace => () => {
				const effect = new EffectPrimitive("Yield")
				return trace ? effect.traced(trace) : effect
			}),
			core_zip = dualWithTrace(
				2,
				trace => (self, that) =>
					core_flatMap(self, a => core_map(that, b => [a, b])).traced(trace)
			),
			core_zipLeft = dualWithTrace(
				2,
				trace => (self, that) =>
					core_flatMap(self, a => core_as(that, a)).traced(trace)
			),
			core_zipRight = dualWithTrace(
				2,
				trace => (self, that) => core_flatMap(self, () => that).traced(trace)
			),
			core_zipWith = dualWithTrace(
				3,
				(trace, restore) => (self, that, f) =>
					core_flatMap(self, a => core_map(that, b => restore(f)(a, b))).traced(
						trace
					)
			),
			interruptFiber = methodWithTrace(
				trace => self =>
					core_flatMap(fiberId => interruptAsFiber(fiberId)(self))(
						fiberId()
					).traced(trace)
			),
			interruptAsFiber = dualWithTrace(
				2,
				trace => (self, fiberId) =>
					core_flatMap(() => self.await())(
						self.interruptAsFork(fiberId)
					).traced(trace)
			),
			logLevelAll = {
				_tag: "All",
				syslog: 0,
				label: "ALL",
				ordinal: Number.MIN_SAFE_INTEGER,
			},
			logLevelInfo = { _tag: "Info", syslog: 6, label: "INFO", ordinal: 2e4 },
			logLevelDebug = {
				_tag: "Debug",
				syslog: 7,
				label: "DEBUG",
				ordinal: 1e4,
			},
			logLevelNone = {
				_tag: "None",
				syslog: 7,
				label: "OFF",
				ordinal: Number.MAX_SAFE_INTEGER,
			},
			FiberRefTypeId = Symbol.for("@effect/io/FiberRef"),
			fiberRefVariance = { _A: _ => _ },
			fiberRefGet = methodWithTrace(
				trace => self => fiberRefModify(self, a => [a, a]).traced(trace)
			),
			fiberRefGetWith = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					core_flatMap(fiberRefGet(self), restore(f)).traced(trace)
			),
			fiberRefSet = dualWithTrace(
				2,
				trace => (self, value) =>
					fiberRefModify(self, () => [void 0, value]).traced(trace)
			),
			fiberRefModify = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					withFiberRuntime(state => {
						const [b, a] = restore(f)(state.getFiberRef(self))
						state.setFiberRef(self, a)
						return succeed(b)
					}).traced(trace)
			),
			fiberRefLocally = dualWithTrace(
				3,
				trace => (use, self, value) =>
					acquireUseRelease(
						core_zipLeft(fiberRefGet(self), fiberRefSet(self, value)),
						() => use,
						oldValue => fiberRefSet(self, oldValue)
					).traced(trace)
			),
			fiberRefUnsafeMake = (
				initial,
				fork = Function_identity,
				join = (_, a) => a
			) => fiberRefUnsafeMakePatch(initial, Differ_update(), fork, join),
			fiberRefUnsafeMakeHashSet = initial =>
				fiberRefUnsafeMakePatch(
					initial,
					Differ_hashSet(),
					Differ_HashSetPatch_empty()
				),
			fiberRefUnsafeMakeContext = initial =>
				fiberRefUnsafeMakePatch(
					initial,
					Differ_environment(),
					Differ_ContextPatch_empty()
				),
			fiberRefUnsafeMakePatch = (
				initial,
				differ,
				fork,
				join = (_, n) => n
			) => ({
				[FiberRefTypeId]: fiberRefVariance,
				initial,
				diff: (oldValue, newValue) => Differ_diff(oldValue, newValue)(differ),
				combine: (first, second) => Differ_combine(first, second)(differ),
				patch: patch => oldValue => Differ_patch(patch, oldValue)(differ),
				fork,
				join,
			}),
			fiberRefUnsafeMakeRuntimeFlags = initial =>
				fiberRefUnsafeMakePatch(
					initial,
					mjs_Differ_make({
						empty: runtimeFlagsPatch_empty,
						diff: (oldValue, newValue) => runtimeFlags_diff(oldValue, newValue),
						combine: (first, second) => andThen(second)(first),
						patch: (_patch, oldValue) => runtimeFlags_patch(oldValue, _patch),
					}),
					Patch_empty
				),
			currentContext = fiberRefUnsafeMakeContext(mjs_Context_empty()),
			currentLogAnnotations = fiberRefUnsafeMake(mjs_HashMap_empty()),
			currentLogLevel = fiberRefUnsafeMake(logLevelInfo),
			currentLogSpan = fiberRefUnsafeMake(Chunk_empty()),
			currentScheduler = fiberRefUnsafeMake(defaultScheduler),
			currentParallelism = fiberRefUnsafeMake(Option_none()),
			unhandledErrorLogLevel = fiberRefUnsafeMake(
				Option_some(logLevelDebug),
				_ => _,
				(_, x) => x
			),
			currentTags = fiberRefUnsafeMakeHashSet(mjs_HashSet_empty()),
			forkScopeOverride = fiberRefUnsafeMake(
				Option_none(),
				() => Option_none(),
				(parent, _) => parent
			),
			interruptedCause = fiberRefUnsafeMake(
				cause_empty,
				() => cause_empty,
				(parent, _) => parent
			),
			ScopeTypeId = Symbol.for("@effect/io/Scope"),
			CloseableScopeTypeId = Symbol.for("@effect/io/CloseableScope"),
			scopeAddFinalizerExit = methodWithTrace(
				(trace, restore) => (self, finalizer) =>
					self.addFinalizer(restore(finalizer)).traced(trace)
			),
			scopeClose = methodWithTrace(
				trace => (self, exit) => self.close(exit).traced(trace)
			),
			releaseMapAdd = dualWithTrace(
				2,
				(trace, restore) => (self, finalizer) =>
					core_map(
						match(
							() => () => core_unit(),
							key => exit => releaseMapRelease(key, exit)(self)
						)
					)(releaseMapAddIfOpen(restore(finalizer))(self)).traced(trace)
			),
			releaseMapRelease = dualWithTrace(
				3,
				trace => (self, key, exit) =>
					suspend(() => {
						switch (self.state._tag) {
							case "Exited":
								return core_unit()
							case "Running": {
								const finalizer = self.state.finalizers.get(key)
								self.state.finalizers.delete(key)
								return null != finalizer
									? self.state.update(finalizer)(exit)
									: core_unit()
							}
						}
					}).traced(trace)
			),
			releaseMapAddIfOpen = dualWithTrace(
				2,
				(trace, restore) => (self, finalizer) =>
					suspend(() => {
						switch (self.state._tag) {
							case "Exited":
								self.state.nextKey += 1
								return core_as(Option_none())(
									restore(finalizer)(self.state.exit)
								)
							case "Running": {
								const key = self.state.nextKey
								self.state.finalizers.set(key, finalizer)
								self.state.nextKey += 1
								return succeed(Option_some(key))
							}
						}
					}).traced(trace)
			),
			releaseMapMake = methodWithTrace(
				trace => () =>
					sync(() => ({
						state: {
							_tag: "Running",
							nextKey: 0,
							finalizers: new Map(),
							update: Function_identity,
						},
					})).traced(trace)
			),
			exitAs = Function_dual(2, (self, value) => {
				switch (self._tag) {
					case "Failure":
						return exitFailCause(self.i0)
					case "Success":
						return exitSucceed(value)
				}
			}),
			exitAsUnit = self => exitAs(self, void 0),
			exitCollectAllPar = exits => exitCollectAllInternal(exits, parallel),
			exitFail = error => exitFailCause(fail(error)),
			exitFailCause = cause => {
				const effect = new EffectPrimitiveFailure("Failure")
				effect.i0 = cause
				return effect
			},
			exitMap = Function_dual(2, (self, f) => {
				switch (self._tag) {
					case "Failure":
						return exitFailCause(self.i0)
					case "Success":
						return exitSucceed(f(self.i0))
				}
			}),
			exitMatch = Function_dual(3, (self, onFailure, onSuccess) => {
				switch (self._tag) {
					case "Failure":
						return onFailure(self.i0)
					case "Success":
						return onSuccess(self.i0)
				}
			}),
			exitMatchEffect = Function_dual(3, (self, onFailure, onSuccess) => {
				switch (self._tag) {
					case "Failure":
						return onFailure(self.i0)
					case "Success":
						return onSuccess(self.i0)
				}
			}),
			exitSucceed = value => {
				const effect = new EffectPrimitiveSuccess("Success")
				effect.i0 = value
				return effect
			},
			exitUnit = () => exitSucceed(void 0),
			exitZipWith = Function_dual(4, (self, that, f, g) => {
				switch (self._tag) {
					case "Failure":
						switch (that._tag) {
							case "Success":
								return exitFailCause(self.i0)
							case "Failure":
								return exitFailCause(g(self.i0, that.i0))
						}
					case "Success":
						switch (that._tag) {
							case "Success":
								return exitSucceed(f(self.i0, that.i0))
							case "Failure":
								return exitFailCause(that.i0)
						}
				}
			}),
			exitCollectAllInternal = (exits, combineCauses) => {
				const list = Chunk_fromIterable(exits)
				return Chunk_isNonEmpty(list)
					? Option_some(
							exitMap(Chunk_reverse)(
								Chunk_reduce(
									exitMap(Chunk_of)(Chunk_headNonEmpty(list)),
									(accumulator, current) =>
										exitZipWith(
											current,
											(list, value) => Chunk_prepend(value)(list),
											combineCauses
										)(accumulator)
								)(Chunk_tailNonEmpty(list))
							)
					  )
					: Option_none()
			},
			deferredUnsafeMake = fiberId => ({
				[DeferredTypeId]: deferredVariance,
				state: MutableRef_make(pending([])),
				blockingOn: fiberId,
			}),
			deferredMake = methodWithTrace(
				trace => () =>
					core_flatMap(id => deferredMakeAs(id))(fiberId()).traced(trace)
			),
			deferredMakeAs = methodWithTrace(
				trace => fiberId =>
					sync(() => deferredUnsafeMake(fiberId)).traced(trace)
			),
			deferredAwait = methodWithTrace(
				trace => self =>
					asyncInterruptEither(k => {
						const state = MutableRef_get(self.state)
						switch (state._tag) {
							case "Done":
								return Either_right(state.effect)
							case "Pending":
								MutableRef_set(pending([k, ...state.joiners]))(self.state)
								return Either_left(deferredInterruptJoiner(self, k))
						}
					}, self.blockingOn).traced(trace)
			),
			deferredCompleteWith = dualWithTrace(
				2,
				trace => (self, effect) =>
					sync(() => {
						const state = MutableRef_get(self.state)
						switch (state._tag) {
							case "Done":
								return !1
							case "Pending":
								MutableRef_set(done(effect))(self.state)
								for (let i = 0; i < state.joiners.length; i++)
									state.joiners[i](effect)
								return !0
						}
					}).traced(trace)
			),
			deferredFail = dualWithTrace(
				2,
				trace => (self, error) =>
					deferredCompleteWith(self, core_fail(error)).traced(trace)
			),
			deferredFailCause = dualWithTrace(
				2,
				trace => (self, cause) =>
					deferredCompleteWith(self, failCause(cause)).traced(trace)
			),
			deferredSucceed = dualWithTrace(
				2,
				trace => (self, value) =>
					deferredCompleteWith(self, succeed(value)).traced(trace)
			),
			deferredUnsafeDone = (self, effect) => {
				const state = MutableRef_get(self.state)
				if ("Pending" === state._tag) {
					MutableRef_set(done(effect))(self.state)
					for (let i = state.joiners.length - 1; i >= 0; i--)
						state.joiners[i](effect)
				}
			},
			deferredInterruptJoiner = (self, joiner) =>
				sync(() => {
					const state = MutableRef_get(self.state)
					"Pending" === state._tag &&
						MutableRef_set(pending(state.joiners.filter(j => j !== joiner)))(
							self.state
						)
				})
		var clock_a
		const ClockTypeId = Symbol.for("@effect/io/Clock"),
			clockTag = Tag(ClockTypeId),
			globalClockScheduler = {
				unsafeSchedule(task, duration) {
					if (duration.millis > 2147483647) return Function_constFalse
					let completed = !1
					const handle = setTimeout(() => {
						completed = !0
						task()
					}, duration.millis)
					return () => {
						clearTimeout(handle)
						return !completed
					}
				},
			}
		class ClockImpl {
			constructor() {
				this[clock_a] = ClockTypeId
			}
			unsafeCurrentTimeMillis() {
				return new Date().getTime()
			}
			currentTimeMillis() {
				return bodyWithTrace(trace =>
					sync(() => this.unsafeCurrentTimeMillis()).traced(trace)
				)
			}
			scheduler() {
				return bodyWithTrace(trace =>
					succeed(globalClockScheduler).traced(trace)
				)
			}
			sleep(duration) {
				return bodyWithTrace(trace =>
					asyncInterruptEither(cb => {
						const canceler = globalClockScheduler.unsafeSchedule(
							() => cb(core_unit()),
							duration
						)
						return Either_left(core_asUnit(sync(canceler)))
					}).traced(trace)
				)
			}
		}
		clock_a = ClockTypeId
		const ConfigErrorTypeId = Symbol.for("@effect/io/Config/Error"),
			configError_proto = { [ConfigErrorTypeId]: ConfigErrorTypeId },
			And = (self, that) => {
				const error = Object.create(configError_proto)
				error._tag = "And"
				error.left = self
				error.right = that
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `${this.left} and ${this.right}`
					},
				})
				return error
			},
			Or = (self, that) => {
				const error = Object.create(configError_proto)
				error._tag = "Or"
				error.left = self
				error.right = that
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `${this.left} or ${this.right}`
					},
				})
				return error
			},
			InvalidData = (path, message) => {
				const error = Object.create(configError_proto)
				error._tag = "InvalidData"
				error.path = path
				error.message = message
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Invalid data at ${Chunk_join(".")(this.path)}: "${
							this.message
						}")`
					},
				})
				return error
			},
			MissingData = (path, message) => {
				const error = Object.create(configError_proto)
				error._tag = "MissingData"
				error.path = path
				error.message = message
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Missing data at ${Chunk_join(".")(this.path)}: "${
							this.message
						}")`
					},
				})
				return error
			},
			SourceUnavailable = (path, message, cause) => {
				const error = Object.create(configError_proto)
				error._tag = "SourceUnavailable"
				error.path = path
				error.message = message
				error.cause = cause
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Source unavailable at ${Chunk_join(".")(this.path)}: "${
							this.message
						}")`
					},
				})
				return error
			},
			Unsupported = (path, message) => {
				const error = Object.create(configError_proto)
				error._tag = "Unsupported"
				error.path = path
				error.message = message
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Unsupported operation at ${Chunk_join(".")(this.path)}: "${
							this.message
						}")`
					},
				})
				return error
			},
			prefixed = Function_dual(2, (self, prefix) => {
				switch (self._tag) {
					case "And":
						return And(
							prefixed(prefix)(self.left),
							prefixed(prefix)(self.right)
						)
					case "Or":
						return Or(prefixed(prefix)(self.left), prefixed(prefix)(self.right))
					case "InvalidData":
						return InvalidData(Chunk_concat(self.path)(prefix), self.message)
					case "MissingData":
						return MissingData(Chunk_concat(self.path)(prefix), self.message)
					case "SourceUnavailable":
						return SourceUnavailable(
							Chunk_concat(self.path)(prefix),
							self.message,
							self.cause
						)
					case "Unsupported":
						return Unsupported(Chunk_concat(self.path)(prefix), self.message)
				}
			})
		var List_a, List_b
		const ListTypeId = Symbol.for("@effect/data/List"),
			listVariance = { _A: _ => _ }
		class ConsImpl {
			constructor(head, tail) {
				this.head = head
				this.tail = tail
				this._tag = "Cons"
				this[List_a] = listVariance
			}
			toString() {
				return `List.Cons(${List_toReadonlyArray(this).map(String).join(", ")})`
			}
			toJSON() {
				return { _tag: "List.Cons", values: List_toReadonlyArray(this) }
			}
			[((List_a = ListTypeId), Symbol.for("nodejs.util.inspect.custom"))]() {
				return this.toJSON()
			}
			[Equal_symbol](that) {
				return (
					isList(that) &&
					this._tag === that._tag &&
					equalsWith(this, that, equals)
				)
			}
			[symbol]() {
				return string("@effect/data/List")
			}
			[Symbol.iterator]() {
				let done = !1,
					self = this
				return {
					next() {
						if (done) return this.return()
						if ("Nil" === self._tag) {
							done = !0
							return this.return()
						}
						const value = self.head
						self = self.tail
						return { done, value }
					},
					return(value) {
						done || (done = !0)
						return { done: !0, value }
					},
				}
			}
		}
		class NilImpl {
			constructor() {
				this._tag = "Nil"
				this[List_b] = listVariance
			}
			toString() {
				return "List.Nil"
			}
			toJSON() {
				return { _tag: "List.Nil" }
			}
			[((List_b = ListTypeId), Symbol.for("nodejs.util.inspect.custom"))]() {
				return this.toJSON()
			}
			[symbol]() {
				return array(Array.from(this))
			}
			[Equal_symbol](that) {
				return isList(that) && this._tag === that._tag
			}
			[Symbol.iterator]() {
				return { next: () => ({ done: !0, value: void 0 }) }
			}
		}
		const isList = u => "object" == typeof u && null != u && ListTypeId in u,
			isNil = self => "Nil" === self._tag,
			isCons = self => "Cons" === self._tag,
			List_length = self => {
				let these = self,
					len = 0
				for (; !isNil(these); ) {
					len += 1
					these = these.tail
				}
				return len
			},
			equalsWith = Function_dual(3, (self, that, f) => {
				if (self === that) return !0
				if (List_length(self) !== List_length(that)) return !1
				const selfIterator = self[Symbol.iterator](),
					thatIterator = that[Symbol.iterator]()
				let nextSelf, nextThat
				for (
					;
					!(nextSelf = selfIterator.next()).done &&
					!(nextThat = thatIterator.next()).done;

				)
					if (!f(nextSelf.value, nextThat.value)) return !1
				return !0
			}),
			_Nil = new NilImpl(),
			cons = (head, tail) => new ConsImpl(head, tail),
			List_toReadonlyArray = self => Array.from(self),
			pathPatch_empty = { _tag: "Empty" },
			pathPatch_patch = Function_dual(2, (path, patch) => {
				let input = new ConsImpl(patch, _Nil),
					output = path
				for (; isCons(input); ) {
					const patch = input.head
					switch (patch._tag) {
						case "Empty":
							input = input.tail
							break
						case "AndThen":
							input = cons(patch.first, cons(patch.second, input.tail))
							break
						case "MapName":
							output = Chunk_map(output, patch.f)
							input = input.tail
							break
						case "Nested":
							output = Chunk_prepend(output, patch.name)
							input = input.tail
							break
						case "Unnested":
							if (!contains(String_Equivalence)(patch.name)(Chunk_head(output)))
								return Either_left(
									MissingData(
										output,
										`Expected ${patch.name} to be in path in ConfigProvider#unnested`
									)
								)
							output = Chunk_tailNonEmpty(output)
							input = input.tail
					}
				}
				return Either_right(output)
			}),
			ConfigProviderTypeId = Symbol.for("@effect/io/Config/Provider"),
			configProviderTag = Tag(ConfigProviderTypeId),
			FlatConfigProviderTypeId = Symbol.for("@effect/io/Config/Provider/Flat"),
			configProvider_make = untracedMethod(restore => (load, flattened) => ({
				[ConfigProviderTypeId]: ConfigProviderTypeId,
				load: methodWithTrace(
					trace => config => restore(load)(config).traced(trace)
				),
				flattened,
			})),
			makeFlat = untracedMethod(
				restore => (load, enumerateChildren, patch) => ({
					[FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
					patch,
					load: methodWithTrace(
						trace =>
							(path, config, split = !0) =>
								restore(load)(path, config, split).traced(trace)
					),
					enumerateChildren: methodWithTrace(
						trace => path => restore(enumerateChildren)(path).traced(trace)
					),
				})
			),
			fromFlat = untracedMethod(
				() => flat =>
					configProvider_make(
						config =>
							core_flatMap(
								fromFlatLoop(flat, Chunk_empty(), config, !1),
								chunk =>
									match(
										() =>
											core_fail(
												MissingData(
													Chunk_empty(),
													`Expected a single value having structure: ${config}`
												)
											),
										succeed
									)(Chunk_head(chunk))
							),
						flat
					)
			),
			fromEnv = untracedMethod(() => (config = {}) => {
				const { pathDelim, seqDelim } = Object.assign(
						{},
						{ pathDelim: "_", seqDelim: "," },
						config
					),
					getEnv = () =>
						"undefined" != typeof process &&
						"env" in process &&
						"object" == typeof process.env
							? process.env
							: {}
				return fromFlat(
					makeFlat(
						(path, primitive, split = !0) => {
							const pathString = (path => Chunk_join(pathDelim)(path))(path),
								current = getEnv(),
								valueOpt =
									pathString in current
										? Option_some(current[pathString])
										: Option_none()
							return core_flatMap(value =>
								parsePrimitive(value, path, primitive, seqDelim, split)
							)(
								mapError(() =>
									MissingData(
										path,
										`Expected ${pathString} to exist in the process context`
									)
								)(core_fromOption(valueOpt))
							)
						},
						path =>
							sync(() => {
								const current = getEnv(),
									keys = Object.keys(current),
									filteredKeyPaths = Array.from(keys)
										.map(value => value.toUpperCase().split(pathDelim))
										.filter(keyPath => {
											for (let i = 0; i < path.length; i++) {
												const pathComponent = Chunk_unsafeGet(i)(path),
													currentElement = keyPath[i]
												if (
													void 0 === currentElement ||
													pathComponent !== currentElement
												)
													return !1
											}
											return !0
										})
										.flatMap(keyPath =>
											keyPath.slice(path.length, path.length + 1)
										)
								return mjs_HashSet_fromIterable(filteredKeyPaths)
							}),
						pathPatch_empty
					)
				)
			}),
			fromFlatLoop = (flat, prefix, config, split) => {
				const op = config
				switch (op._tag) {
					case "Constant":
						return succeed(Chunk_of(op.value))
					case "Described":
						return suspend(() => fromFlatLoop(flat, prefix, op.config, split))
					case "Fail":
						return core_fail(MissingData(prefix, op.message))
					case "Fallback":
						return catchAll(error1 =>
							op.condition(error1)
								? catchAll(error2 => core_fail(Or(error1, error2)))(
										fromFlatLoop(flat, prefix, op.second, split)
								  )
								: core_fail(error1)
						)(suspend(() => fromFlatLoop(flat, prefix, op.first, split)))
					case "Lazy":
						return suspend(() => fromFlatLoop(flat, prefix, op.config(), split))
					case "MapOrFail":
						return suspend(() =>
							core_flatMap(
								core_forEach(a =>
									mapError(prefixed(prefix))(core_fromEither(op.mapOrFail(a)))
								)
							)(fromFlatLoop(flat, prefix, op.original, split))
						)
					case "Nested":
						return suspend(() =>
							fromFlatLoop(
								flat,
								Chunk_concat(prefix, Chunk_of(op.name)),
								op.config,
								split
							)
						)
					case "Primitive":
						return core_flatMap(prefix =>
							core_flatMap(values => {
								if (Chunk_isEmpty(values)) {
									const name = getOrElse(() => "<n/a>")(
										(self => Chunk_get(self, self.length - 1))(prefix)
									)
									return core_fail(
										(
											name => self =>
												MissingData(
													Chunk_empty(),
													`Expected ${self.description} with name ${name}`
												)
										)(name)
									)
								}
								return succeed(values)
							})(flat.load(prefix, op, split))
						)(core_fromEither(pathPatch_patch(prefix, flat.patch)))
					case "Sequence":
						return core_flatMap(patchedPrefix =>
							core_flatMap(indices =>
								Chunk_isEmpty(indices)
									? suspend(() =>
											core_map(
												fromFlatLoop(flat, patchedPrefix, op.config, !0),
												Chunk_of
											)
									  )
									: core_map(chunkChunk => {
											const flattened = Chunk_flatten(chunkChunk)
											return Chunk_isEmpty(flattened)
												? Chunk_of(Chunk_empty())
												: Chunk_of(flattened)
									  })(
											core_forEach(indices, index =>
												fromFlatLoop(
													flat,
													Chunk_append(prefix, `[${index}]`),
													op.config,
													!0
												)
											)
									  )
							)(
								core_flatMap(indicesFrom)(flat.enumerateChildren(patchedPrefix))
							)
						)(pathPatch_patch(prefix, flat.patch))
					case "Table":
						return suspend(() =>
							core_flatMap(prefix =>
								core_flatMap(keys =>
									core_map(values => {
										if (0 === values.length)
											return Chunk_of(mjs_HashMap_empty())
										const matrix = toReadonlyArray(values).map(toReadonlyArray)
										return Chunk_map(values =>
											mjs_HashMap_fromIterable(
												Chunk_zip(Chunk_fromIterable(keys), values)
											)
										)(unsafeFromArray(transpose(matrix).map(unsafeFromArray)))
									})(
										core_forEach(key =>
											fromFlatLoop(
												flat,
												Chunk_concat(Chunk_of(key))(prefix),
												op.valueConfig,
												split
											)
										)(keys)
									)
								)(flat.enumerateChildren(prefix))
							)(core_fromEither(pathPatch_patch(prefix, flat.patch)))
						)
					case "ZipWith":
						return suspend(() =>
							core_flatMap(left =>
								core_flatMap(right => {
									if (Either_isLeft(left) && Either_isLeft(right))
										return core_fail(And(left.left, right.left))
									if (Either_isLeft(left) && Either_isRight(right))
										return core_fail(left.left)
									if (Either_isRight(left) && Either_isLeft(right))
										return core_fail(right.left)
									if (Either_isRight(left) && Either_isRight(right)) {
										const path = Chunk_join(".")(prefix),
											fail = fromFlatLoopFail(prefix, path),
											[lefts, rights] = ((leftDef, rightDef, left, right) => {
												const leftPad = Chunk_unfold(left.length, index =>
														index >= right.length
															? Option_none()
															: Option_some([leftDef(index), index + 1])
													),
													rightPad = Chunk_unfold(right.length, index =>
														index >= left.length
															? Option_none()
															: Option_some([rightDef(index), index + 1])
													)
												return [
													Chunk_concat(leftPad)(left),
													Chunk_concat(rightPad)(right),
												]
											})(
												fail,
												fail,
												Chunk_map(Either_right)(left.right),
												Chunk_map(Either_right)(right.right)
											)
										return core_forEach(([left, right]) =>
											core_map(([left, right]) => op.zip(left, right))(
												core_zip(core_fromEither(right))(core_fromEither(left))
											)
										)(Chunk_zip(rights)(lefts))
									}
									throw new Error(
										"BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/io/issues"
									)
								})(core_either(fromFlatLoop(flat, prefix, op.right, split)))
							)(core_either(fromFlatLoop(flat, prefix, op.left, split)))
						)
				}
			},
			fromFlatLoopFail = (prefix, path) => index =>
				Either_left(
					MissingData(
						prefix,
						`The element at index ${index} in a sequence at path "${path}" was missing`
					)
				),
			parsePrimitive = (text, path, primitive, delimiter, split) =>
				split
					? mapError(prefixed(path))(
							core_forEach(char =>
								core_fromEither(primitive.parse(char.trim()))
							)(
								((text, delim) => {
									const split = text.split(
										new RegExp(`\\s*${escapeRegex(delim)}\\s*`)
									)
									return unsafeFromArray(split)
								})(text, delimiter)
							)
					  )
					: mapError(prefixed(path))(
							core_map(Chunk_of)(core_fromEither(primitive.parse(text)))
					  ),
			transpose = array =>
				Object.keys(array[0]).map(column => array.map(row => row[column])),
			escapeRegex = string => string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&"),
			indicesFrom = quotedIndices =>
				core_map(merge)(
					core_either(
						mapBoth(
							() => Chunk_empty(),
							Chunk_sort(Order)
						)(core_forEach(quotedIndices, parseQuotedIndex))
					)
				),
			QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/,
			parseQuotedIndex = str => {
				const match = str.match(QUOTED_INDEX_REGEX)
				if (null !== match) {
					const matchedIndex = match[2]
					return flatMap(parseInteger)(
						void 0 !== matchedIndex && matchedIndex.length > 0
							? Option_some(matchedIndex)
							: Option_none()
					)
				}
				return Option_none()
			},
			parseInteger = str => {
				const parsedIndex = Number.parseInt(str)
				return Number.isNaN(parsedIndex)
					? Option_none()
					: Option_some(parsedIndex)
			}
		var random_a
		const RandomTypeId = Symbol.for("@effect/io/Random"),
			randomTag = Tag(RandomTypeId)
		random_a = RandomTypeId
		const shuffleWith = (elements, nextIntBounded) =>
				suspend(() =>
					core_flatMap(buffer => {
						const numbers = []
						for (let i = buffer.length; i >= 2; i -= 1) numbers.push(i)
						return core_as(Chunk_fromIterable(buffer))(
							forEachDiscard(n =>
								core_map(k => swap(buffer, n - 1, k))(nextIntBounded(n))
							)(numbers)
						)
					})(sync(() => Array.from(elements)))
				),
			swap = (buffer, index1, index2) => {
				const tmp = buffer[index1]
				buffer[index1] = buffer[index2]
				buffer[index2] = tmp
				return buffer
			}
		var seed
		const currentServices = fiberRefUnsafeMakeContext(
				Context_add(
					configProviderTag,
					fromEnv()
				)(
					Context_add(
						randomTag,
						((seed = (4294967296 * Math.random()) >>> 0),
						new (class {
							constructor(seed) {
								this.seed = seed
								this[random_a] = RandomTypeId
								this.PRNG = new PCGRandom(seed)
							}
							next() {
								return bodyWithTrace(trace =>
									sync(() => this.PRNG.number()).traced(trace)
								)
							}
							nextBoolean() {
								return bodyWithTrace(trace =>
									core_map(this.next(), n => n > 0.5).traced(trace)
								)
							}
							nextInt() {
								return bodyWithTrace(trace =>
									sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER)).traced(
										trace
									)
								)
							}
							nextRange(min, max) {
								return bodyWithTrace(trace =>
									core_map(this.next(), n => (max - min) * n + min).traced(
										trace
									)
								)
							}
							nextIntBetween(min, max) {
								return bodyWithTrace(trace =>
									sync(() => this.PRNG.integer(1 + max - min) + min).traced(
										trace
									)
								)
							}
							shuffle(elements) {
								return bodyWithTrace(trace =>
									shuffleWith(elements, n => this.nextIntBetween(0, n)).traced(
										trace
									)
								)
							}
						})(seed))
					)(Context_add(clockTag, new ClockImpl())(mjs_Context_empty()))
				)
			),
			currentTimeMillis = methodWithTrace(
				trace => () =>
					clockWith(clock => clock.currentTimeMillis()).traced(trace)
			),
			sleep = methodWithTrace(
				trace => duration =>
					clockWith(clock => clock.sleep(duration)).traced(trace)
			),
			clockWith = methodWithTrace(
				(trace, restore) => f =>
					fiberRefGetWith(currentServices, services =>
						restore(f)(mjs_Context_get(clockTag)(services))
					).traced(trace)
			),
			Duration_TypeId = Symbol.for("@effect/data/Duration")
		class DurationImpl {
			constructor(millis) {
				this.millis = millis
				this._id = Duration_TypeId
			}
			[symbol]() {
				return Hash_hash(this.millis)
			}
			[Equal_symbol](that) {
				return isDuration(that) && this.millis === that.millis
			}
		}
		const isDuration = u =>
				"object" == typeof u &&
				null != u &&
				"_id" in u &&
				u._id === Duration_TypeId,
			zero = new DurationImpl(0),
			millis = millis => new DurationImpl(millis),
			seconds = seconds => new DurationImpl(1e3 * seconds),
			Clock_sleep =
				(fromSemigroup(
					Semigroup_make(
						Function_dual(
							2,
							(self, that) => new DurationImpl(self.millis + that.millis)
						)
					),
					zero
				).combineAll,
				sleep),
			Clock_currentTimeMillis = currentTimeMillis
		var fiberRefs_a
		const FiberRefsSym = Symbol.for("@effect/io/FiberRefs")
		class FiberRefsImpl {
			constructor(locals) {
				this.locals = locals
				this[fiberRefs_a] = FiberRefsSym
			}
		}
		fiberRefs_a = FiberRefsSym
		const findAncestor = (
				_ref,
				_parentStack,
				_childStack,
				_childModified = !1
			) => {
				const ref = _ref
				let ret,
					parentStack = _parentStack,
					childStack = _childStack,
					childModified = _childModified
				for (; void 0 === ret; )
					if (
						isNonEmptyReadonlyArray(parentStack) &&
						isNonEmptyReadonlyArray(childStack)
					) {
						const parentFiberId = headNonEmpty(parentStack)[0],
							parentAncestors = tailNonEmpty(parentStack),
							childFiberId = headNonEmpty(childStack)[0],
							childRefValue = headNonEmpty(childStack)[1],
							childAncestors = tailNonEmpty(childStack)
						if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
							childStack = childAncestors
							childModified = !0
						} else if (
							parentFiberId.startTimeMillis > childFiberId.startTimeMillis
						)
							parentStack = parentAncestors
						else if (parentFiberId.id < childFiberId.id) {
							childStack = childAncestors
							childModified = !0
						} else
							parentFiberId.id > childFiberId.id
								? (parentStack = parentAncestors)
								: (ret = [childRefValue, childModified])
					} else ret = [ref.initial, !0]
				return ret
			},
			joinAs = Function_dual(3, (self, fiberId, that) => {
				const parentFiberRefs = new Map(self.locals)
				for (const [fiberRef, childStack] of that.locals) {
					const childValue = headNonEmpty(childStack)[1]
					if (!equals(headNonEmpty(childStack)[0], fiberId)) {
						if (!parentFiberRefs.has(fiberRef)) {
							if (equals(childValue, fiberRef.initial)) continue
							parentFiberRefs.set(fiberRef, [
								[fiberId, fiberRef.join(fiberRef.initial, childValue)],
							])
							continue
						}
						const parentStack = parentFiberRefs.get(fiberRef),
							[ancestor, wasModified] = findAncestor(
								fiberRef,
								parentStack,
								childStack
							)
						if (wasModified) {
							const patch = fiberRef.diff(ancestor, childValue),
								oldValue = headNonEmpty(parentStack)[1],
								newValue = fiberRef.join(
									oldValue,
									fiberRef.patch(patch)(oldValue)
								)
							if (!equals(oldValue, newValue)) {
								let newStack
								const parentFiberId = headNonEmpty(parentStack)[0]
								newStack = equals(parentFiberId, fiberId)
									? prepend([parentFiberId, newValue])(
											tailNonEmpty(parentStack)
									  )
									: prepend([fiberId, newValue])(parentStack)
								parentFiberRefs.set(fiberRef, newStack)
							}
						}
					}
				}
				return new FiberRefsImpl(new Map(parentFiberRefs))
			}),
			forkAs = Function_dual(2, (self, childId) => {
				const map = new Map()
				for (const [fiberRef, stack] of self.locals.entries()) {
					const oldValue = headNonEmpty(stack)[1],
						newValue = fiberRef.patch(fiberRef.fork)(oldValue)
					equals(oldValue, newValue)
						? map.set(fiberRef, stack)
						: map.set(fiberRef, prepend([childId, newValue])(stack))
				}
				return new FiberRefsImpl(map)
			}),
			delete_ = Function_dual(2, (self, fiberRef) => {
				const locals = new Map(self.locals)
				locals.delete(fiberRef)
				return new FiberRefsImpl(locals)
			}),
			fiberRefs_get = Function_dual(2, (self, fiberRef) =>
				self.locals.has(fiberRef)
					? Option_some(headNonEmpty(self.locals.get(fiberRef))[1])
					: Option_none()
			),
			getOrDefault = Function_dual(2, (self, fiberRef) =>
				getOrElse(() => fiberRef.initial)(fiberRefs_get(self, fiberRef))
			),
			updatedAs = Function_dual(4, (self, fiberId, fiberRef, value) => {
				const oldStack = self.locals.has(fiberRef)
					? self.locals.get(fiberRef)
					: []
				let newStack
				if (isEmptyReadonlyArray(oldStack))
					newStack = ReadonlyArray_of([fiberId, value])
				else {
					const [currentId, currentValue] = headNonEmpty(oldStack)
					if (equals(currentId, fiberId)) {
						if (equals(currentValue, value)) return self
						newStack = prepend([fiberId, value])(tailNonEmpty(oldStack))
					} else newStack = prepend([fiberId, value])(oldStack)
				}
				const locals = new Map(self.locals)
				return new FiberRefsImpl(locals.set(fiberRef, newStack))
			}),
			FiberRefs_forkAs = forkAs,
			FiberRefs_getOrDefault = getOrDefault,
			FiberRefs_updatedAs = updatedAs,
			FiberRefs_unsafeMake = function (fiberRefLocals) {
				return new FiberRefsImpl(fiberRefLocals)
			},
			patch_diff = (oldValue, newValue) => {
				const missingLocals = new Map(oldValue.locals)
				let patch = { _tag: "Empty" }
				for (const [fiberRef, pairs] of newValue.locals.entries()) {
					const newValue = headNonEmpty(pairs)[1],
						old = missingLocals.get(fiberRef)
					if (void 0 !== old) {
						const oldValue = headNonEmpty(old)[1]
						equals(oldValue, newValue) ||
							(patch = patch_combine({
								_tag: "Update",
								fiberRef,
								patch: fiberRef.diff(oldValue, newValue),
							})(patch))
					} else
						patch = patch_combine({ _tag: "Add", fiberRef, value: newValue })(
							patch
						)
					missingLocals.delete(fiberRef)
				}
				for (const [fiberRef] of missingLocals.entries())
					patch = patch_combine({ _tag: "Remove", fiberRef })(patch)
				return patch
			},
			patch_combine = Function_dual(2, (self, that) => ({
				_tag: "AndThen",
				first: self,
				second: that,
			})),
			patch_patch = Function_dual(3, (self, fiberId, oldValue) => {
				let fiberRefs = oldValue,
					patches = ReadonlyArray_of(self)
				for (; isNonEmptyReadonlyArray(patches); ) {
					const head = headNonEmpty(patches),
						tail = tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "Add":
							fiberRefs = updatedAs(
								fiberRefs,
								fiberId,
								head.fiberRef,
								head.value
							)
							patches = tail
							break
						case "Remove":
							fiberRefs = delete_(fiberRefs, head.fiberRef)
							patches = tail
							break
						case "Update": {
							const value = getOrDefault(fiberRefs, head.fiberRef)
							fiberRefs = updatedAs(
								fiberRefs,
								fiberId,
								head.fiberRef,
								head.fiberRef.patch(head.patch)(value)
							)
							patches = tail
							break
						}
						case "AndThen":
							patches = prepend(head.first)(prepend(head.second)(tail))
					}
				}
				return fiberRefs
			})
		class SingleShotGen {
			constructor(self) {
				this.self = self
				this.called = !1
			}
			next(a) {
				return this.called
					? { value: a, done: !0 }
					: ((this.called = !0), { value: this.self, done: !1 })
			}
			return(a) {
				return { value: a, done: !0 }
			}
			throw(e) {
				throw e
			}
			[Symbol.iterator]() {
				return new SingleShotGen(this.self)
			}
		}
		const All = logLevelAll,
			Fatal = { _tag: "Fatal", syslog: 2, label: "FATAL", ordinal: 5e4 },
			Level_Error = { _tag: "Error", syslog: 3, label: "ERROR", ordinal: 4e4 },
			Warning = { _tag: "Warning", syslog: 4, label: "WARN", ordinal: 3e4 },
			Info = logLevelInfo,
			Level_Debug = logLevelDebug,
			Trace = { _tag: "Trace", syslog: 7, label: "TRACE", ordinal: 0 },
			Level_None = logLevelNone,
			locally = dualWithTrace(
				2,
				trace => (use, self) =>
					fiberRefLocally(use, currentLogLevel, self).traced(trace)
			),
			greaterThanEqual = greaterThanOrEqualTo(
				Order_contramap(level => level.ordinal)(Order)
			),
			fromLiteral = _ => {
				switch (_) {
					case "All":
						return All
					case "Debug":
						return Level_Debug
					case "Error":
						return Level_Error
					case "Fatal":
						return Fatal
					case "Info":
						return Info
					case "Trace":
						return Trace
					case "None":
						return Level_None
					case "Warning":
						return Warning
				}
			},
			Span_render = now => self =>
				`${self.label.replace(/[\s="]/g, "_")}=${now - self.startTime}ms`
		var ref_a
		const RefTypeId = Symbol.for("@effect/io/Ref"),
			refVariance = { _A: _ => _ }
		class RefImpl {
			constructor(ref) {
				this.ref = ref
				this[ref_a] = refVariance
			}
			modify(f) {
				return bodyWithTrace((trace, restore) =>
					sync(() => {
						const current = MutableRef_get(this.ref),
							[b, a] = restore(f)(current)
						current !== a && MutableRef_set(a)(this.ref)
						return b
					}).traced(trace)
				)
			}
		}
		ref_a = RefTypeId
		const ref_unsafeMake = value => new RefImpl(MutableRef_make(value)),
			ref_make = methodWithTrace(
				trace => value => sync(() => ref_unsafeMake(value)).traced(trace)
			),
			ref_get = methodWithTrace(
				trace => self => self.modify(a => [a, a]).traced(trace)
			),
			ref_set = dualWithTrace(
				2,
				trace => (self, value) =>
					self.modify(() => [void 0, value]).traced(trace)
			),
			ref_modify = dualWithTrace(
				2,
				(trace, restore) => (self, f) => self.modify(restore(f)).traced(trace)
			),
			ref_update = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					self.modify(a => [void 0, restore(f)(a)]).traced(trace)
			),
			Ref_make = ref_make,
			Ref_get = ref_get,
			Ref_set = ref_set,
			effect_collectAll = methodWithTrace(
				trace => effects =>
					core_forEach(effects, Function_identity).traced(trace)
			),
			delay = dualWithTrace(
				2,
				trace => (self, duration) =>
					core_zipRight(Clock_sleep(duration), self).traced(trace)
			),
			diffFiberRefs = methodWithTrace(
				trace => self =>
					summarized(getFiberRefs(), patch_diff)(self).traced(trace)
			),
			effect_Do = methodWithTrace(trace => () => succeed({}).traced(trace)),
			effect_bind = dualWithTrace(
				3,
				(trace, restore) => (self, tag, f) =>
					core_flatMap(self, k =>
						core_map(restore(f)(k), a => ({ ...k, [tag]: a }))
					).traced(trace)
			),
			effect_bindDiscard = dualWithTrace(
				3,
				trace => (self, tag, f) =>
					core_flatMap(self, k =>
						core_map(f, a => ({ ...k, [tag]: a }))
					).traced(trace)
			),
			bindValue = dualWithTrace(
				3,
				(trace, restore) => (self, tag, f) =>
					core_map(self, k => ({ ...k, [tag]: restore(f)(k) })).traced(trace)
			),
			bindValueDiscard = dualWithTrace(
				3,
				trace => (self, tag, f) =>
					core_map(self, k => ({ ...k, [tag]: f })).traced(trace)
			),
			filterOrElse = dualWithTrace(
				3,
				(trace, restore) => (self, f, orElse) =>
					filterOrElseWith(self, restore(f), orElse).traced(trace)
			),
			filterOrElseWith = dualWithTrace(
				3,
				(trace, restore) => (self, f, orElse) =>
					core_flatMap(self, a =>
						restore(f)(a) ? succeed(a) : restore(orElse)(a)
					).traced(trace)
			),
			filterOrFail = dualWithTrace(
				3,
				(trace, restore) => (self, f, error) =>
					filterOrElse(self, restore(f), () => failSync(restore(error))).traced(
						trace
					)
			),
			effect_match = dualWithTrace(
				3,
				(trace, restore) => (self, onFailure, onSuccess) =>
					matchEffect(
						self,
						e => succeed(restore(onFailure)(e)),
						a => succeed(restore(onSuccess)(a))
					).traced(trace)
			)
		class EffectGen {
			constructor(value) {
				this.value = value
			}
			[Symbol.iterator]() {
				return new SingleShotGen(this)
			}
		}
		const getFiberRefs = methodWithTrace(
				trace => () =>
					withFiberRuntime(state => succeed(state.unsafeGetFiberRefs())).traced(
						trace
					)
			),
			ignore = methodWithTrace(
				trace => self =>
					effect_match(self, Function_constVoid, Function_constVoid).traced(
						trace
					)
			),
			effect_isSuccess = methodWithTrace(
				trace => self =>
					effect_match(self, Function_constFalse, Function_constTrue).traced(
						trace
					)
			),
			someError = Option_some(Level_Error),
			someWarning = Option_some(Warning),
			someInfo = Option_some(Info),
			someDebug = Option_some(Level_Debug),
			log = methodWithTrace(
				trace => message =>
					withFiberRuntime(fiberState => {
						fiberState.log(message, cause_empty, Option_none())
						return core_unit()
					}).traced(trace)
			),
			logDebug = methodWithTrace(
				trace => message =>
					withFiberRuntime(fiberState => {
						fiberState.log(message, cause_empty, someDebug)
						return core_unit()
					}).traced(trace)
			),
			logError = methodWithTrace(
				trace => message =>
					withFiberRuntime(fiberState => {
						fiberState.log(message, cause_empty, someError)
						return core_unit()
					}).traced(trace)
			),
			logInfo = methodWithTrace(
				trace => message =>
					withFiberRuntime(fiberState => {
						fiberState.log(message, cause_empty, someInfo)
						return core_unit()
					}).traced(trace)
			),
			logWarning = methodWithTrace(
				trace => message =>
					withFiberRuntime(fiberState => {
						fiberState.log(message, cause_empty, someWarning)
						return core_unit()
					}).traced(trace)
			),
			logAnnotate = dualWithTrace(
				3,
				trace => (effect, key, value) =>
					core_flatMap(fiberRefGet(currentLogAnnotations), annotations =>
						suspend(() =>
							fiberRefLocally(
								currentLogAnnotations,
								HashMap_set(key, value)(annotations)
							)(effect)
						)
					).traced(trace)
			),
			orElseSucceed = dualWithTrace(
				2,
				(trace, restore) => (self, evaluate) =>
					core_orElse(self, () => sync(restore(evaluate))).traced(trace)
			),
			patchFiberRefs = methodWithTrace(
				trace => patch =>
					updateFiberRefs((fiberId, fiberRefs) =>
						patch_patch(fiberId, fiberRefs)(patch)
					).traced(trace)
			),
			promise = methodWithTrace(
				(trace, restore) => evaluate =>
					core_async(resolve => {
						restore(evaluate)()
							.then(a => resolve(exitSucceed(a)))
							.catch(e => resolve(exitFailCause(die(e))))
					}).traced(trace)
			),
			effect_sleep = Clock_sleep,
			summarized = dualWithTrace(
				3,
				(trace, restore) => (self, summary, f) =>
					core_flatMap(summary, start =>
						core_flatMap(self, value =>
							core_map(summary, end =>
								((...args) => args)(restore(f)(start, end), value)
							)
						)
					).traced(trace)
			),
			tapErrorCause = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					matchCauseEffect(
						self,
						cause => core_zipRight(restore(f)(cause), failCause(cause)),
						succeed
					).traced(trace)
			),
			effect_all = methodWithTrace(
				trace =>
					function () {
						return 1 === arguments.length
							? isEffect(arguments[0])
								? core_map(arguments[0], x => [x])
								: Array.isArray(arguments[0])
								? core_map(
										effect_collectAll(arguments[0]),
										toReadonlyArray
								  ).traced(trace)
								: core_map(values => {
										const res = {}
										for (const [k, v] of values) res[k] = v
										return res
								  })(
										core_forEach(Object.entries(arguments[0]), ([_, e]) =>
											core_map(e, a => [_, a])
										)
								  ).traced(trace)
							: core_map(effect_collectAll(arguments), toReadonlyArray).traced(
									trace
							  )
					}
			),
			updateFiberRefs = methodWithTrace(
				(trace, restore) => f =>
					withFiberRuntime(state => {
						state.setFiberRefs(
							restore(f)(state.id(), state.unsafeGetFiberRefs())
						)
						return core_unit()
					}).traced(trace)
			),
			MutableHashMap_TypeId = Symbol.for("@effect/data/MutableHashMap")
		class MutableHashMapImpl {
			constructor() {
				this._id = MutableHashMap_TypeId
				this.backingMap = MutableRef_make(mjs_HashMap_empty())
			}
			[Symbol.iterator]() {
				return this.backingMap.current[Symbol.iterator]()
			}
			toString() {
				return `MutableHashMap(${Array.from(this)
					.map(([k, v]) => `[${String(k)}, ${String(v)}]`)
					.join(", ")})`
			}
			toJSON() {
				return { _tag: "MutableHashMap", values: Array.from(this) }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
		}
		const MutableHashMap_get = Function_dual(2, (self, key) =>
				mjs_HashMap_get(self.backingMap.current, key)
			),
			MutableHashMap_has = Function_dual(2, (self, key) =>
				Option_isSome(MutableHashMap_get(self, key))
			),
			MutableHashMap_set = Function_dual(3, (self, key, value) => {
				MutableRef_update(self.backingMap, HashMap_set(key, value))
				return self
			}),
			ExecutionStrategy_sequential = { _tag: "Sequential" }
		var fiberStatus_a, fiberStatus_b, fiberStatus_c
		const FiberStatusTypeId = Symbol.for("@effect/io/Fiber/Status")
		class Done {
			constructor() {
				this[fiberStatus_a] = FiberStatusTypeId
				this._tag = "Done"
			}
			[((fiberStatus_a = FiberStatusTypeId), symbol)]() {
				return combine(Hash_hash(this._tag))(
					Hash_hash("@effect/io/Fiber/Status")
				)
			}
			[Equal_symbol](that) {
				return isFiberStatus(that) && "Done" === that._tag
			}
		}
		class Running {
			constructor(runtimeFlags) {
				this.runtimeFlags = runtimeFlags
				this[fiberStatus_b] = FiberStatusTypeId
				this._tag = "Running"
			}
			[((fiberStatus_b = FiberStatusTypeId), symbol)]() {
				return combine(Hash_hash(this.runtimeFlags))(
					combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Status"))
				)
			}
			[Equal_symbol](that) {
				return (
					isFiberStatus(that) &&
					"Running" === that._tag &&
					this.runtimeFlags === that.runtimeFlags
				)
			}
		}
		class Suspended {
			constructor(runtimeFlags, blockingOn) {
				this.runtimeFlags = runtimeFlags
				this.blockingOn = blockingOn
				this[fiberStatus_c] = FiberStatusTypeId
				this._tag = "Suspended"
			}
			[((fiberStatus_c = FiberStatusTypeId), symbol)]() {
				return combine(Hash_hash(this.blockingOn))(
					combine(Hash_hash(this.runtimeFlags))(
						combine(Hash_hash(this._tag))(Hash_hash("@effect/io/Fiber/Status"))
					)
				)
			}
			[Equal_symbol](that) {
				return (
					isFiberStatus(that) &&
					"Suspended" === that._tag &&
					this.runtimeFlags === that.runtimeFlags &&
					equals(this.blockingOn, that.blockingOn)
				)
			}
		}
		const isFiberStatus = u =>
				"object" == typeof u && null != u && FiberStatusTypeId in u,
			Status_done = new Done(),
			Status_running = runtimeFlags => new Running(runtimeFlags),
			interruptSignal = cause => ({ _tag: "InterruptSignal", cause }),
			stateful = onFiber => ({ _tag: "Stateful", onFiber }),
			resume = effect => ({ _tag: "Resume", effect })
		var fiberScope_a, fiberScope_b
		const FiberScopeTypeId = Symbol.for("@effect/io/Fiber/Scope")
		class Global {
			constructor() {
				this[fiberScope_a] = FiberScopeTypeId
				this.fiberId = Id_none
				this.roots = new Set()
			}
			add(_runtimeFlags, child) {
				this.roots.add(child)
				child.unsafeAddObserver(() => {
					this.roots.delete(child)
				})
			}
		}
		fiberScope_a = FiberScopeTypeId
		class Local {
			constructor(fiberId, parent) {
				this.fiberId = fiberId
				this.parent = parent
				this[fiberScope_b] = FiberScopeTypeId
			}
			add(_runtimeFlags, child) {
				this.parent.tell(
					stateful(parentFiber => {
						parentFiber.addChild(child)
						child.unsafeAddObserver(() => {
							parentFiber.removeChild(child)
						})
					})
				)
			}
		}
		fiberScope_b = FiberScopeTypeId
		const globalScope = globalValue(
				Symbol.for("@effect/io/FiberScope/Global"),
				() => new Global()
			),
			FiberTypeId = Symbol.for("@effect/io/Fiber"),
			fiberVariance = { _E: _ => _, _A: _ => _ },
			RuntimeFiberTypeId = Symbol.for("@effect/io/Fiber"),
			_await = methodWithTrace(trace => self => self.await().traced(trace)),
			fiber_join = methodWithTrace(
				trace => self =>
					core_zipLeft(core_flatten(self.await()), self.inheritAll()).traced(
						trace
					)
			),
			currentFiberURI = "@effect/io/Fiber/Current",
			MutableList_TypeId = Symbol.for("@effect/data/MutableList")
		class MutableListImpl {
			constructor() {
				this._id = MutableList_TypeId
				this.head = void 0
				this.tail = void 0
				this._length = 0
			}
			[Symbol.iterator]() {
				let done = !1,
					head = this.head
				return {
					next() {
						if (done) return this.return()
						if (null == head) {
							done = !0
							return this.return()
						}
						const value = head.value
						head = head.next
						return { done, value }
					},
					return(value) {
						done || (done = !0)
						return { done: !0, value }
					},
				}
			}
			toString() {
				return `MutableList(${Array.from(this).map(String).join(", ")})`
			}
			toJSON() {
				return { _tag: "MutableList", values: Array.from(this) }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
		}
		class LinkedListNode {
			constructor(value) {
				this.value = value
				this.removed = !1
				this.prev = void 0
				this.next = void 0
			}
		}
		const MutableList_isEmpty = self => 0 === MutableList_length(self),
			MutableList_length = self => self._length,
			MutableList_append = Function_dual(2, (self, value) => {
				const node = new LinkedListNode(value)
				void 0 === self.head && (self.head = node)
				if (void 0 === self.tail) self.tail = node
				else {
					self.tail.next = node
					node.prev = self.tail
					self.tail = node
				}
				self._length += 1
				return self
			}),
			MutableQueue_TypeId = Symbol.for("@effect/data/MutableQueue")
		class MutableQueueImpl {
			constructor(capacity = undefined) {
				this.capacity = capacity
				this._tag = "Bounded"
				this._id = MutableQueue_TypeId
				this.queue = new MutableListImpl()
			}
			[Symbol.iterator]() {
				return Array.from(this.queue)[Symbol.iterator]()
			}
			toString() {
				return `MutableQueue(${Array.from(this).map(String).join(", ")})`
			}
			toJSON() {
				return { _tag: "MutableQueue", values: Array.from(this) }
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toJSON()
			}
		}
		const MutableQueue_isEmpty = self => MutableList_isEmpty(self.queue),
			offer = Function_dual(2, (self, value) => {
				const queueLength = MutableList_length(self.queue)
				if (void 0 !== self.capacity && queueLength === self.capacity) return !1
				MutableList_append(value)(self.queue)
				return !0
			}),
			MutableQueue_poll = Function_dual(2, (self, def) =>
				MutableList_isEmpty(self.queue)
					? def
					: (self => {
							const head = self.head
							if (void 0 !== head) {
								;((self, node) => {
									if (!node.removed) {
										node.removed = !0
										if (void 0 !== node.prev && void 0 !== node.next) {
											node.prev.next = node.next
											node.next.prev = node.prev
										} else if (void 0 !== node.prev) {
											self.tail = node.prev
											node.prev.next = void 0
										} else if (void 0 !== node.next) {
											self.head = node.next
											node.next.prev = void 0
										} else {
											self.tail = void 0
											self.head = void 0
										}
										self._length > 0 && (self._length -= 1)
									}
								})(self, head)
								return head.value
							}
					  })(self.queue)
			),
			renderToString = u => {
				if (
					"object" == typeof u &&
					null != u &&
					"toString" in u &&
					"function" == typeof u.toString &&
					u.toString !== Object.prototype.toString
				)
					return u.toString()
				if ("string" == typeof u) return `Error: ${u}`
				if (
					"object" == typeof u &&
					null !== u &&
					"message" in u &&
					"string" == typeof u.message
				) {
					const raw = JSON.parse(JSON.stringify(u)),
						keys = new Set(Object.keys(raw))
					keys.delete("name")
					keys.delete("message")
					keys.delete("_tag")
					if (0 === keys.size)
						return `${
							"name" in u && "string" == typeof u.name ? u.name : "Error"
						}${
							"_tag" in u && "string" == typeof u._tag ? `(${u._tag})` : ""
						}: ${u.message}`
				}
				return `Error: ${JSON.stringify(u)}`
			},
			renderStack = span =>
				Option_isNone(span)
					? []
					: span.value.stack.length > 0
					? (chunk => {
							const ret = []
							for (const s of chunk) {
								const r = s?.toFrame()
								r &&
									runtimeDebug.filterStackFrame(r) &&
									ret.push(renderFrame(r))
							}
							return ret
					  })(span.value.stack)
					: [],
			defaultErrorToLines = error =>
				error instanceof Error
					? (error => {
							if (error.stack) {
								const stack = runtimeDebug.parseStack(error),
									traces = []
								for (const frame of stack)
									if (frame) {
										if (!runtimeDebug.filterStackFrame(frame)) break
										traces.push(renderFrame(frame))
									}
								return [renderToString(error), traces.join("\r\n")]
							}
							return [String(error), void 0]
					  })(error)
					: [renderToString(error), void 0]
		class RenderError {
			constructor(seq, message, stack) {
				this.seq = seq
				this.message = message
				this.stack = stack
			}
		}
		const cause_pretty_pretty = cause => {
				if (isInterruptedOnly(cause))
					return "All fibers interrupted without errors."
				const errors = prettyErrors(cause),
					final = Array.from(errors)
						.sort((a, b) => (a.seq === b.seq ? 0 : a.seq > b.seq ? 1 : -1))
						.map(e => {
							let message = e.message
							e.stack && e.stack.length > 0 && (message += `\r\n${e.stack}`)
							return message
						})
						.join("\r\n\r\n")
				return final.includes("\r\n") ? `\r\n${final}\r\n` : final
			},
			prettyErrors = cause =>
				reduceWithContext(cause, void 0, {
					emptyCase: () => [],
					dieCase: (_, err) => {
						const rendered = defaultErrorToLines(err)
						return [
							{
								message: rendered[0],
								errorSack: rendered[1],
								fiberStack: Option_none(),
							},
						]
					},
					failCase: (_, err) => {
						const rendered = defaultErrorToLines(err)
						return [
							{
								message: rendered[0],
								errorSack: rendered[1],
								fiberStack: Option_none(),
							},
						]
					},
					interruptCase: () => [],
					parallelCase: (_, l, r) => [...l, ...r],
					sequentialCase: (_, l, r) => [...l, ...r],
					annotatedCase: (_, v, parent) =>
						isStackAnnotation(parent)
							? v.map(r => ({
									message: r.message,
									errorSack: r.errorSack,
									fiberStack: orElse(() => Option_some(parent))(
										Option_map(
											r.fiberStack,
											annotation =>
												new StackAnnotation(
													annotation.stack.length <
														runtimeDebug.traceStackLimit &&
													parent.stack.length > 0 &&
													((annotation.stack.length > 0 &&
														unsafeLast(parent.stack) !==
															unsafeLast(annotation.stack)) ||
														0 === annotation.stack.length)
														? Chunk_take(runtimeDebug.traceStackLimit)(
																dedupeAdjacent(
																	Chunk_concat(parent.stack)(annotation.stack)
																)
														  )
														: annotation.stack,
													annotation.seq
												)
										)
									),
							  }))
							: v,
				}).flatMap(r =>
					((error, errorStack, stack) => [
						new RenderError(
							"Some" === stack._tag ? stack.value.seq : 0,
							error,
							errorStack
								? errorStack + "\r\n" + renderStack(stack).join("\r\n")
								: renderStack(stack).join("\r\n")
						),
					])(r.message, r.errorSack, r.fiberStack)
				)
		function renderFrame(r) {
			return r
				? r.name
					? `    at ${r.name} (${r.fileName}:${r.line}:${r.column})`
					: `    at ${r.fileName}:${r.line}:${r.column}`
				: "    at <unknown>"
		}
		const LoggerTypeId = Symbol.for("@effect/io/Logger"),
			loggerVariance = { _Message: _ => _, _Output: _ => _ },
			makeLogger = log => ({ [LoggerTypeId]: loggerVariance, log }),
			stringLogger = makeLogger(
				(fiberId, logLevel, message, cause, _context, spans, annotations) => {
					const now = new Date(),
						nowMillis = now.getTime()
					let output = [
						`timestamp=${now.toISOString()}`,
						`level=${logLevel.label}`,
						`fiber=${threadName(fiberId)}`,
					].join(" ")
					if (message.length > 0) {
						output += " message="
						output = appendQuoted(message, output)
					}
					if (null != cause && cause != cause_empty) {
						output += " cause="
						output = appendQuoted(cause_pretty_pretty(cause), output)
					}
					if (Chunk_isNonEmpty(spans)) {
						output += " "
						let first = !0
						for (const span of spans) {
							first ? (first = !1) : (output += " ")
							output += Span_render(nowMillis)(span)
						}
					}
					if (mjs_HashMap_size(annotations) > 0) {
						output += " "
						let first = !0
						for (const [key, value] of annotations) {
							first ? (first = !1) : (output += " ")
							output += filterKeyName(key)
							output += "="
							output = appendQuoted(value, output)
						}
					}
					return output
				}
			),
			textOnly = /^[^\s"=]+$/,
			appendQuoted = (label, output) =>
				output +
				(label.match(textOnly)
					? label
					: `"${label.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`),
			filterKeyName = key => key.replace(/[\s="]/g, "_"),
			logger_zip = Function_dual(2, (self, that) =>
				makeLogger(
					(fiberId, logLevel, message, cause, context, spans, annotations) => [
						self.log(
							fiberId,
							logLevel,
							message,
							cause,
							context,
							spans,
							annotations
						),
						that.log(
							fiberId,
							logLevel,
							message,
							cause,
							context,
							spans,
							annotations
						),
					]
				)
			)
		var keyType_a, keyType_b, _g, _h
		const MetricKeyTypeTypeId = Symbol.for("@effect/io/Metric/KeyType"),
			CounterKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Counter"),
			FrequencyKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Frequency"),
			GaugeKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Gauge"),
			HistogramKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Histogram"),
			SummaryKeyTypeTypeId = Symbol.for("effect/io/Metric/KeyType/Summary"),
			metricKeyTypeVariance = { _In: _ => _, _Out: _ => _ }
		class CounterKeyType {
			constructor() {
				this[keyType_a] = metricKeyTypeVariance
				this[keyType_b] = CounterKeyTypeTypeId
			}
			[((keyType_a = MetricKeyTypeTypeId),
			(keyType_b = CounterKeyTypeTypeId),
			symbol)]() {
				return Hash_hash("effect/io/Metric/KeyType/Counter")
			}
			[Equal_symbol](that) {
				return isCounterKey(that)
			}
		}
		class HistogramKeyType {
			constructor(boundaries) {
				this.boundaries = boundaries
				this[_g] = metricKeyTypeVariance
				this[_h] = HistogramKeyTypeTypeId
			}
			[((_g = MetricKeyTypeTypeId), (_h = HistogramKeyTypeTypeId), symbol)]() {
				return combine(Hash_hash(this.boundaries))(
					Hash_hash("effect/io/Metric/KeyType/Histogram")
				)
			}
			[Equal_symbol](that) {
				return isHistogramKey(that) && equals(this.boundaries, that.boundaries)
			}
		}
		const counter = new CounterKeyType(),
			isCounterKey = u =>
				"object" == typeof u && null != u && CounterKeyTypeTypeId in u,
			isFrequencyKey = u =>
				"object" == typeof u && null != u && FrequencyKeyTypeTypeId in u,
			isGaugeKey = u =>
				"object" == typeof u && null != u && GaugeKeyTypeTypeId in u,
			isHistogramKey = u =>
				"object" == typeof u && null != u && HistogramKeyTypeTypeId in u,
			isSummaryKey = u =>
				"object" == typeof u && null != u && SummaryKeyTypeTypeId in u
		var key_a
		const MetricKeyTypeId = Symbol.for("@effect/io/Metric/Key"),
			metricKeyVariance = { _Type: _ => _ }
		class MetricKeyImpl {
			constructor(name, keyType, tags = mjs_HashSet_empty()) {
				this.name = name
				this.keyType = keyType
				this.tags = tags
				this[key_a] = metricKeyVariance
			}
			[((key_a = MetricKeyTypeId), symbol)]() {
				return combine(Hash_hash(this.tags))(
					combine(Hash_hash(this.keyType))(Hash_hash(this.name))
				)
			}
			[Equal_symbol](u) {
				return (
					isMetricKey(u) &&
					this.name === u.name &&
					equals(this.keyType, u.keyType) &&
					equals(this.tags, u.tags)
				)
			}
		}
		const isMetricKey = u =>
				"object" == typeof u && null != u && MetricKeyTypeId in u,
			key_taggedWithLabelSet = Function_dual(2, (self, extraTags) =>
				0 === mjs_HashSet_size(extraTags)
					? self
					: new MetricKeyImpl(
							self.name,
							self.keyType,
							mjs_HashSet_union(extraTags)(self.tags)
					  )
			)
		var state_a,
			state_b,
			state_c,
			state_d,
			state_e,
			state_f,
			state_g,
			state_h,
			state_j,
			state_k
		const MetricStateTypeId = Symbol.for("@effect/io/Metric/State"),
			CounterStateTypeId = Symbol.for("effect/io/Metric/State/Counter"),
			FrequencyStateTypeId = Symbol.for("effect/io/Metric/State/Frequency"),
			GaugeStateTypeId = Symbol.for("effect/io/Metric/State/Gauge"),
			HistogramStateTypeId = Symbol.for("effect/io/Metric/State/Histogram"),
			SummaryStateTypeId = Symbol.for("effect/io/Metric/State/Summary"),
			metricStateVariance = { _A: _ => _ }
		class CounterState {
			constructor(count) {
				this.count = count
				this[state_a] = metricStateVariance
				this[state_b] = CounterStateTypeId
			}
			[((state_a = MetricStateTypeId),
			(state_b = CounterStateTypeId),
			symbol)]() {
				return combine(Hash_hash(this.count))(
					Hash_hash("effect/io/Metric/State/Counter")
				)
			}
			[Equal_symbol](that) {
				return isCounterState(that) && this.count === that.count
			}
		}
		class FrequencyState {
			constructor(occurrences) {
				this.occurrences = occurrences
				this[state_c] = metricStateVariance
				this[state_d] = FrequencyStateTypeId
			}
			[((state_c = MetricStateTypeId),
			(state_d = FrequencyStateTypeId),
			symbol)]() {
				return combine(Hash_hash(this.occurrences))(
					Hash_hash("effect/io/Metric/State/Frequency")
				)
			}
			[Equal_symbol](that) {
				return (
					isFrequencyState(that) && equals(this.occurrences, that.occurrences)
				)
			}
		}
		class GaugeState {
			constructor(value) {
				this.value = value
				this[state_e] = metricStateVariance
				this[state_f] = GaugeStateTypeId
			}
			[((state_e = MetricStateTypeId),
			(state_f = GaugeStateTypeId),
			symbol)]() {
				return combine(Hash_hash(this.value))(
					Hash_hash("effect/io/Metric/State/Gauge")
				)
			}
			[Equal_symbol](u) {
				return isGaugeState(u) && this.value === u.value
			}
		}
		class HistogramState {
			constructor(buckets, count, min, max, sum) {
				this.buckets = buckets
				this.count = count
				this.min = min
				this.max = max
				this.sum = sum
				this[state_g] = metricStateVariance
				this[state_h] = HistogramStateTypeId
			}
			[((state_g = MetricStateTypeId),
			(state_h = HistogramStateTypeId),
			symbol)]() {
				return combine(Hash_hash(this.sum))(
					combine(Hash_hash(this.max))(
						combine(Hash_hash(this.min))(
							combine(Hash_hash(this.count))(
								combine(Hash_hash(this.buckets))(
									Hash_hash("effect/io/Metric/State/Histogram")
								)
							)
						)
					)
				)
			}
			[Equal_symbol](that) {
				return (
					isHistogramState(that) &&
					equals(this.buckets, that.buckets) &&
					this.count === that.count &&
					this.min === that.min &&
					this.max === that.max &&
					this.sum === that.sum
				)
			}
		}
		class SummaryState {
			constructor(error, quantiles, count, min, max, sum) {
				this.error = error
				this.quantiles = quantiles
				this.count = count
				this.min = min
				this.max = max
				this.sum = sum
				this[state_j] = metricStateVariance
				this[state_k] = SummaryStateTypeId
			}
			[((state_j = MetricStateTypeId),
			(state_k = SummaryStateTypeId),
			symbol)]() {
				return combine(Hash_hash(this.sum))(
					combine(Hash_hash(this.max))(
						combine(Hash_hash(this.min))(
							combine(Hash_hash(this.count))(
								combine(Hash_hash(this.quantiles))(
									combine(Hash_hash(this.error))(
										Hash_hash("effect/io/Metric/State/Summary")
									)
								)
							)
						)
					)
				)
			}
			[Equal_symbol](that) {
				return (
					isSummaryState(that) &&
					this.error === that.error &&
					equals(this.quantiles, that.quantiles) &&
					this.count === that.count &&
					this.min === that.min &&
					this.max === that.max &&
					this.sum === that.sum
				)
			}
		}
		const isCounterState = u =>
				"object" == typeof u && null != u && CounterStateTypeId in u,
			isFrequencyState = u =>
				"object" == typeof u && null != u && FrequencyStateTypeId in u,
			isGaugeState = u =>
				"object" == typeof u && null != u && GaugeStateTypeId in u,
			isHistogramState = u =>
				"object" == typeof u && null != u && HistogramStateTypeId in u,
			isSummaryState = u =>
				"object" == typeof u && null != u && SummaryStateTypeId in u,
			MetricHookTypeId = Symbol.for("@effect/io/Metric/Hook"),
			metricHookVariance = { _In: _ => _, _Out: _ => _ },
			hook_make = (get, update) => ({
				[MetricHookTypeId]: metricHookVariance,
				update,
				get,
			}),
			calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
				const sampleCount = sortedSamples.length
				if (Chunk_isEmpty(sortedQuantiles)) return Chunk_empty()
				const head = unsafeHead(sortedQuantiles),
					tail = Chunk_drop(1)(sortedQuantiles),
					resolved = Chunk_reduce(
						Chunk_of(
							resolveQuantile(
								error,
								sampleCount,
								Option_none(),
								0,
								head,
								sortedSamples
							)
						),
						(accumulator, quantile) => {
							const h = unsafeHead(accumulator)
							return Chunk_append(
								resolveQuantile(
									error,
									sampleCount,
									h.value,
									h.consumed,
									quantile,
									h.rest
								)
							)(accumulator)
						}
					)(tail)
				return Chunk_map(rq => [rq.quantile, rq.value])(resolved)
			},
			resolveQuantile = (
				error,
				sampleCount,
				current,
				consumed,
				quantile,
				rest
			) => {
				let error_1 = error,
					sampleCount_1 = sampleCount,
					current_1 = current,
					consumed_1 = consumed,
					quantile_1 = quantile,
					rest_1 = rest,
					error_2 = error,
					sampleCount_2 = sampleCount,
					current_2 = current,
					consumed_2 = consumed,
					quantile_2 = quantile,
					rest_2 = rest
				for (;;) {
					if (Chunk_isEmpty(rest_1))
						return {
							quantile: quantile_1,
							value: Option_none(),
							consumed: consumed_1,
							rest: Chunk_empty(),
						}
					if (1 === quantile_1)
						return {
							quantile: quantile_1,
							value: Option_some(unsafeLast(rest_1)),
							consumed: consumed_1 + rest_1.length,
							rest: Chunk_empty(),
						}
					const sameHead = splitWhere(n => n > unsafeHead(rest_1))(rest_1),
						desired = quantile_1 * sampleCount_1,
						allowedError = (error_1 / 2) * desired,
						candConsumed = consumed_1 + sameHead[0].length,
						candError = Math.abs(candConsumed - desired)
					if (candConsumed < desired - allowedError) {
						error_2 = error_1
						sampleCount_2 = sampleCount_1
						current_2 = Chunk_head(rest_1)
						consumed_2 = candConsumed
						quantile_2 = quantile_1
						rest_2 = sameHead[1]
						error_1 = error_2
						sampleCount_1 = sampleCount_2
						current_1 = current_2
						consumed_1 = consumed_2
						quantile_1 = quantile_2
						rest_1 = rest_2
					} else {
						if (candConsumed > desired + allowedError)
							return {
								quantile: quantile_1,
								value: current_1,
								consumed: consumed_1,
								rest: rest_1,
							}
						switch (current_1._tag) {
							case "None":
								error_2 = error_1
								sampleCount_2 = sampleCount_1
								current_2 = Chunk_head(rest_1)
								consumed_2 = candConsumed
								quantile_2 = quantile_1
								rest_2 = sameHead[1]
								error_1 = error_2
								sampleCount_1 = sampleCount_2
								current_1 = current_2
								consumed_1 = consumed_2
								quantile_1 = quantile_2
								rest_1 = rest_2
								continue
							case "Some":
								if (candError < Math.abs(desired - current_1.value)) {
									error_2 = error_1
									sampleCount_2 = sampleCount_1
									current_2 = Chunk_head(rest_1)
									consumed_2 = candConsumed
									quantile_2 = quantile_1
									rest_2 = sameHead[1]
									error_1 = error_2
									sampleCount_1 = sampleCount_2
									current_1 = current_2
									consumed_1 = consumed_2
									quantile_1 = quantile_2
									rest_1 = rest_2
									continue
								}
								return {
									quantile: quantile_1,
									value: Option_some(current_1.value),
									consumed: consumed_1,
									rest: rest_1,
								}
						}
					}
				}
				throw new Error(
					"BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/io/issues"
				)
			},
			MetricPairTypeId = Symbol.for("@effect/io/Metric/Pair"),
			metricPairVariance = { _Type: _ => _ }
		var registry_a
		const MetricRegistryTypeId = Symbol.for("@effect/io/Metric/Registry")
		class MetricRegistryImpl {
			constructor() {
				this[registry_a] = MetricRegistryTypeId
				this.map = new MutableHashMapImpl()
			}
			snapshot() {
				const result = []
				for (const [key, hook] of this.map)
					result.push(
						((metricKey = key),
						(metricState = hook.get()),
						{ [MetricPairTypeId]: metricPairVariance, metricKey, metricState })
					)
				var metricKey, metricState
				return mjs_HashSet_fromIterable(result)
			}
			get(key) {
				const hook = getOrUndefined(MutableHashMap_get(key)(this.map))
				if (null == hook) {
					if (isCounterKey(key.keyType)) return this.getCounter(key)
					if (isGaugeKey(key.keyType)) return this.getGauge(key)
					if (isFrequencyKey(key.keyType)) return this.getFrequency(key)
					if (isHistogramKey(key.keyType)) return this.getHistogram(key)
					if (isSummaryKey(key.keyType)) return this.getSummary(key)
					throw new Error(
						"BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/io/issues"
					)
				}
				return hook
			}
			getCounter(key) {
				let value = getOrUndefined(MutableHashMap_get(key)(this.map))
				if (null == value) {
					const counter = (_key => {
						let sum = 0
						return hook_make(
							() => new CounterState(sum),
							value => {
								sum += value
							}
						)
					})()
					MutableHashMap_has(key)(this.map) ||
						MutableHashMap_set(key, counter)(this.map)
					value = counter
				}
				return value
			}
			getFrequency(key) {
				let value = getOrUndefined(MutableHashMap_get(key)(this.map))
				if (null == value) {
					const frequency = (_key => {
						let count = 0
						const values = new Map()
						return hook_make(
							() => {
								return (
									(occurrences = mjs_HashMap_fromIterable(
										Array.from(values.entries()).map(([k, v]) => [k, v])
									)),
									new FrequencyState(occurrences)
								)
								var occurrences
							},
							word => {
								count += 1
								const slotCount = values.get(word) ?? 0
								values.set(word, slotCount + 1)
							}
						)
					})()
					MutableHashMap_has(key)(this.map) ||
						MutableHashMap_set(key, frequency)(this.map)
					value = frequency
				}
				return value
			}
			getGauge(key) {
				let value = getOrUndefined(MutableHashMap_get(key)(this.map))
				if (null == value) {
					const gauge = ((_key, startAt) => {
						let value = startAt
						return hook_make(
							() => (value => new GaugeState(value))(value),
							v => {
								value = v
							}
						)
					})(0, 0)
					MutableHashMap_has(key)(this.map) ||
						MutableHashMap_set(key, gauge)(this.map)
					value = gauge
				}
				return value
			}
			getHistogram(key) {
				let value = getOrUndefined(MutableHashMap_get(key)(this.map))
				if (null == value) {
					const histogram = (key => {
						const bounds = key.keyType.boundaries.values,
							size = bounds.length,
							values = Array(size + 1),
							boundaries = Array(size)
						let count = 0,
							sum = 0,
							min = Number.MAX_VALUE,
							max = Number.MIN_VALUE
						mapWithIndex((i, n) => {
							boundaries[i] = n
						})(Chunk_sort(Order)(bounds))
						return hook_make(
							() =>
								((buckets, count, min, max, sum) =>
									new HistogramState(buckets, count, min, max, sum))(
									(() => {
										const builder = []
										let i = 0,
											cumulated = 0
										for (; i != size; ) {
											const boundary = boundaries[i]
											cumulated += values[i]
											builder.push([boundary, cumulated])
											i += 1
										}
										return Chunk_fromIterable(builder)
									})(),
									count,
									min,
									max,
									sum
								),
							value => {
								let from = 0,
									to = size
								for (; from !== to; ) {
									const mid = Math.floor(from + (to - from) / 2)
									value <= boundaries[mid] ? (to = mid) : (from = mid)
									to === from + 1 &&
										(value <= boundaries[from] ? (to = from) : (from = to))
								}
								values[from] = values[from] + 1
								count += 1
								sum += value
								value < min && (min = value)
								value > max && (max = value)
							}
						)
					})(key)
					MutableHashMap_has(key)(this.map) ||
						MutableHashMap_set(key, histogram)(this.map)
					value = histogram
				}
				return value
			}
			getSummary(key) {
				let value = getOrUndefined(MutableHashMap_get(key)(this.map))
				if (null == value) {
					const summary = (key => {
						const { error, maxAge, maxSize, quantiles } = key.keyType,
							sortedQuantiles = Chunk_sort(Order)(quantiles),
							values = Array(maxSize)
						let head = 0,
							count = 0,
							sum = 0,
							min = Number.MAX_VALUE,
							max = Number.MIN_VALUE
						return hook_make(
							() =>
								((error, quantiles, count, min, max, sum) =>
									new SummaryState(error, quantiles, count, min, max, sum))(
									error,
									(now => {
										const builder = []
										let i = 0
										for (; i !== maxSize - 1; ) {
											const item = values[i]
											if (null != item) {
												const [t, v] = item,
													age = millis(now - t)
												age.millis >= 0 && age <= maxAge && builder.push(v)
											}
											i += 1
										}
										return calculateQuantiles(
											error,
											sortedQuantiles,
											Chunk_sort(Order)(Chunk_fromIterable(builder))
										)
									})(Date.now()),
									count,
									min,
									max,
									sum
								),
							([value, timestamp]) =>
								((value, timestamp) => {
									if (maxSize > 0) {
										head += 1
										values[head % maxSize] = [timestamp, value]
									}
									count += 1
									sum += value
									value < min && (min = value)
									value > max && (max = value)
								})(value, timestamp)
						)
					})(key)
					MutableHashMap_has(key)(this.map) ||
						MutableHashMap_set(key, summary)(this.map)
					value = summary
				}
				return value
			}
		}
		registry_a = MetricRegistryTypeId
		const MetricTypeId = Symbol.for("@effect/io/Metric"),
			metricVariance = { _Type: _ => _, _In: _ => _, _Out: _ => _ },
			globalMetricRegistry = globalValue(
				Symbol.for("@effect/io/Metric/globalMetricRegistry"),
				() => new MetricRegistryImpl()
			),
			metric_counter = name =>
				fromMetricKey((name => new MetricKeyImpl(name, counter))(name)),
			fromMetricKey = key => {
				const hook = extraTags => {
					const fullKey = key_taggedWithLabelSet(extraTags)(key)
					return globalMetricRegistry.get(fullKey)
				}
				return (function (keyType, unsafeUpdate, unsafeValue) {
					const metric = Object.assign(
						methodWithTrace(
							(trace, restore) => effect =>
								core_tap(effect, a =>
									sync(() => restore(unsafeUpdate)(a, mjs_HashSet_empty()))
								).traced(trace)
						),
						{
							[MetricTypeId]: metricVariance,
							keyType,
							unsafeUpdate,
							unsafeValue,
						}
					)
					return metric
				})(
					key.keyType,
					(input, extraTags) => hook(extraTags).update(input),
					extraTags => hook(extraTags).get()
				)
			},
			metric_histogram = (name, boundaries) =>
				fromMetricKey(
					((name, boundaries) =>
						new MetricKeyImpl(
							name,
							(boundaries => new HistogramKeyType(boundaries))(boundaries)
						))(name, boundaries)
				)
		var boundaries_a
		const MetricBoundariesTypeId = Symbol.for("@effect/io/Metric/Boundaries")
		class MetricBoundariesImpl {
			constructor(values) {
				this.values = values
				this[boundaries_a] = MetricBoundariesTypeId
			}
			[((boundaries_a = MetricBoundariesTypeId), symbol)]() {
				return combine(Hash_hash(this.values))(
					Hash_hash("@effect/io/Metric/Boundaries")
				)
			}
			[Equal_symbol](u) {
				return isMetricBoundaries(u) && equals(this.values, u.values)
			}
		}
		const isMetricBoundaries = u =>
				"object" == typeof u && null != u && MetricBoundariesTypeId in u,
			exponential = (start, factor, count) => {
				return (chunk => {
					const values = (self =>
						unsafeFromArray(uniq_(toReadonlyArray(self))))(
						Chunk_concat(Chunk_of(Number.POSITIVE_INFINITY))(chunk)
					)
					return new MetricBoundariesImpl(values)
				})(
					Chunk_map(i => start * Math.pow(factor, i))(
						0 <= (end = count - 1)
							? Chunk_makeBy(end - 0 + 1, i => 0 + i)
							: Chunk_of(0)
					)
				)
				var end
			}
		var supervisor_a, supervisor_b, supervisor_d
		const SupervisorTypeId = Symbol.for("@effect/io/Supervisor"),
			supervisorVariance = { _T: _ => _ }
		class ProxySupervisor {
			constructor(underlying, value0) {
				this.underlying = underlying
				this.value0 = value0
				this[supervisor_a] = supervisorVariance
			}
			value() {
				return bodyWithTrace(trace => this.value0().traced(trace))
			}
			onStart(context, effect, parent, fiber) {
				this.underlying.onStart(context, effect, parent, fiber)
			}
			onEnd(value, fiber) {
				this.underlying.onEnd(value, fiber)
			}
			onEffect(fiber, effect) {
				this.underlying.onEffect(fiber, effect)
			}
			onSuspend(fiber) {
				this.underlying.onSuspend(fiber)
			}
			onResume(fiber) {
				this.underlying.onResume(fiber)
			}
			map(f) {
				return new ProxySupervisor(this, () => core_map(f)(this.value()))
			}
			zip(right) {
				return new Zip(this, right)
			}
		}
		supervisor_a = SupervisorTypeId
		class Zip {
			constructor(left, right) {
				this.left = left
				this.right = right
				this[supervisor_b] = supervisorVariance
			}
			value() {
				return bodyWithTrace(trace =>
					core_zip(this.left.value(), this.right.value()).traced(trace)
				)
			}
			onStart(context, effect, parent, fiber) {
				this.left.onStart(context, effect, parent, fiber)
				this.right.onStart(context, effect, parent, fiber)
			}
			onEnd(value, fiber) {
				this.left.onEnd(value, fiber)
				this.right.onEnd(value, fiber)
			}
			onEffect(fiber, effect) {
				this.left.onEffect(fiber, effect)
				this.right.onEffect(fiber, effect)
			}
			onSuspend(fiber) {
				this.left.onSuspend(fiber)
				this.right.onSuspend(fiber)
			}
			onResume(fiber) {
				this.left.onResume(fiber)
				this.right.onResume(fiber)
			}
			map(f) {
				return new ProxySupervisor(this, () => core_map(f)(this.value()))
			}
			zip(right) {
				return new Zip(this, right)
			}
		}
		supervisor_b = SupervisorTypeId
		class Const {
			constructor(effect) {
				this.effect = effect
				this[supervisor_d] = supervisorVariance
			}
			value() {
				return bodyWithTrace(trace => this.effect.traced(trace))
			}
			onStart(_context, _effect, _parent, _fiber) {}
			onEnd(_value, _fiber) {}
			onEffect(_fiber, _effect) {}
			onSuspend(_fiber) {}
			onResume(_fiber) {}
			map(f) {
				return new ProxySupervisor(this, () => core_map(f)(this.value()))
			}
			zip(right) {
				return new Zip(this, right)
			}
		}
		supervisor_d = SupervisorTypeId
		const supervisor_none = (effect => new Const(effect))(core_unit()),
			supervisor_patch_empty = { _tag: "Empty" },
			supervisor_patch_combine = (self, that) => ({
				_tag: "AndThen",
				first: self,
				second: that,
			}),
			removeSupervisor = (self, that) =>
				equals(self, that)
					? supervisor_none
					: self instanceof Zip
					? removeSupervisor(self.left, that).zip(
							removeSupervisor(self.right, that)
					  )
					: self,
			patch_toSet = self =>
				equals(self, supervisor_none)
					? mjs_HashSet_empty()
					: self instanceof Zip
					? mjs_HashSet_union(patch_toSet(self.right))(patch_toSet(self.left))
					: mjs_HashSet_make(self),
			patch_differ = mjs_Differ_make({
				empty: supervisor_patch_empty,
				patch: (self, supervisor) =>
					((_supervisor, _patches) => {
						let supervisor = _supervisor,
							patches = _patches
						for (; Chunk_isNonEmpty(patches); ) {
							const head = Chunk_headNonEmpty(patches)
							switch (head._tag) {
								case "Empty":
									patches = Chunk_tailNonEmpty(patches)
									break
								case "AddSupervisor":
									supervisor = supervisor.zip(head.supervisor)
									patches = Chunk_tailNonEmpty(patches)
									break
								case "RemoveSupervisor":
									supervisor = removeSupervisor(supervisor, head.supervisor)
									patches = Chunk_tailNonEmpty(patches)
									break
								case "AndThen":
									patches = Chunk_prepend(head.first)(
										Chunk_prepend(head.second)(Chunk_tailNonEmpty(patches))
									)
							}
						}
						return supervisor
					})(supervisor, Chunk_of(self)),
				combine: supervisor_patch_combine,
				diff: (oldValue, newValue) => {
					if (equals(oldValue, newValue)) return supervisor_patch_empty
					const oldSupervisors = patch_toSet(oldValue),
						newSupervisors = patch_toSet(newValue),
						added = mjs_HashSet_reduce(
							supervisor_patch_empty,
							(patch, supervisor) =>
								supervisor_patch_combine(patch, {
									_tag: "AddSupervisor",
									supervisor,
								})
						)(mjs_HashSet_difference(oldSupervisors)(newSupervisors)),
						removed = mjs_HashSet_reduce(
							supervisor_patch_empty,
							(patch, supervisor) =>
								supervisor_patch_combine(patch, {
									_tag: "RemoveSupervisor",
									supervisor,
								})
						)(mjs_HashSet_difference(newSupervisors)(oldSupervisors))
					return supervisor_patch_combine(added, removed)
				},
			})
		var fiberRuntime_a, fiberRuntime_b
		const fibersStarted = metric_counter("effect_fiber_started"),
			fiberSuccesses = metric_counter("effect_fiber_successes"),
			fiberFailures = metric_counter("effect_fiber_failures"),
			fiberLifetimes = metric_histogram(
				"effect_fiber_lifetimes",
				exponential(1, 2, 100)
			),
			runtimeFiberVariance = { _E: _ => _, _A: _ => _ },
			fiberRuntime_absurd = _ => {
				throw new Error(
					`BUG: FiberRuntime - ${JSON.stringify(
						_
					)} - please report an issue at https://github.com/Effect-TS/io/issues`
				)
			},
			contOpSuccess = {
				OnSuccess: (_, cont, value) => cont.i1(value),
				OnSuccessAndFailure: (_, cont, value) => cont.i2(value),
				RevertFlags: (self, cont, value) => {
					self.patchRuntimeFlags(self._runtimeFlags, cont.patch)
					return interruptible(self._runtimeFlags) && self.isInterrupted()
						? exitFailCause(self.getInterruptedCause())
						: exitSucceed(value)
				},
				While: (self, cont, value) => {
					cont.i2(value)
					if (cont.i0()) {
						self.pushStack(cont)
						return cont.i1()
					}
					return core_unit()
				},
			},
			drainQueueWhileRunningTable = {
				InterruptSignal: (self, runtimeFlags, cur, message) => {
					self.processNewInterruptSignal(message.cause)
					return interruptible(runtimeFlags)
						? exitFailCause(message.cause)
						: cur
				},
				Resume: (_self, _runtimeFlags, _cur, _message) => {
					throw new Error(
						"It is illegal to have multiple concurrent run loops in a single fiber"
					)
				},
				Stateful: (self, runtimeFlags, cur, message) => {
					message.onFiber(self, Status_running(runtimeFlags))
					return cur
				},
				YieldNow: (_self, _runtimeFlags, cur, _message) =>
					core_flatMap(() => cur)(yieldNow()),
			}
		class FiberRuntime {
			constructor(fiberId, fiberRefs0, runtimeFlags0) {
				this[fiberRuntime_a] = fiberVariance
				this[fiberRuntime_b] = runtimeFiberVariance
				this._queue = new MutableQueueImpl()
				this._children = null
				this._observers = new Array()
				this._running = !1
				this._stack = []
				this._asyncInterruptor = null
				this._asyncBlockingOn = null
				this._exitValue = null
				this._traceStack = []
				this.run = () => {
					this.drainQueueOnCurrentThread()
				}
				this._runtimeFlags = runtimeFlags0
				this._fiberId = fiberId
				this._fiberRefs = fiberRefs0
				if (runtimeMetrics(runtimeFlags0)) {
					const tags = this.getFiberRef(currentTags)
					fibersStarted.unsafeUpdate(1, tags)
				}
			}
			id() {
				return this._fiberId
			}
			resume(effect) {
				this.tell(resume(effect))
			}
			status() {
				return this.ask((_, status) => status)
			}
			runtimeFlags() {
				return this.ask((state, status) =>
					(self => "Done" === self._tag)(status)
						? state._runtimeFlags
						: status.runtimeFlags
				)
			}
			scope() {
				return new Local((fiber = this).id(), fiber)
				var fiber
			}
			children() {
				return this.ask(fiber => Chunk_fromIterable(fiber.getChildren()))
			}
			getChildren() {
				null === this._children && (this._children = new Set())
				return this._children
			}
			getSupervisor() {
				return this.getFiberRef(currentSupervisor)
			}
			getInterruptedCause() {
				return this.getFiberRef(interruptedCause)
			}
			fiberRefs() {
				return this.ask(fiber => fiber.unsafeGetFiberRefs())
			}
			ask(f) {
				return untraced(() =>
					suspend(() => {
						const deferred = deferredUnsafeMake(this._fiberId)
						this.tell(
							stateful((fiber, status) => {
								deferredUnsafeDone(
									deferred,
									sync(() => f(fiber, status))
								)
							})
						)
						return deferredAwait(deferred)
					})
				)
			}
			tell(message) {
				offer(message)(this._queue)
				if (!this._running) {
					this._running = !0
					this.drainQueueLaterOnExecutor()
				}
			}
			await() {
				return untraced(() =>
					asyncInterrupt(resume => {
						const cb = exit => resume(succeed(exit))
						this.tell(
							stateful((fiber, _) => {
								null !== fiber._exitValue
									? cb(this._exitValue)
									: fiber.unsafeAddObserver(cb)
							})
						)
						return sync(() =>
							this.tell(
								stateful((fiber, _) => {
									fiber.unsafeRemoveObserver(cb)
								})
							)
						)
					}, this.id())
				)
			}
			inheritAll() {
				return untraced(() =>
					withFiberRuntime((parentFiber, parentStatus) => {
						const parentFiberId = parentFiber.id(),
							parentFiberRefs = parentFiber.unsafeGetFiberRefs(),
							parentRuntimeFlags = parentStatus.runtimeFlags,
							childFiberRefs = this.unsafeGetFiberRefs(),
							updatedFiberRefs = joinAs(
								parentFiberRefs,
								parentFiberId,
								childFiberRefs
							)
						parentFiber.setFiberRefs(updatedFiberRefs)
						const updatedRuntimeFlags =
								parentFiber.getFiberRef(currentRuntimeFlags),
							patch = Patch_exclude(16)(
								Patch_exclude(1)(
									runtimeFlags_diff(parentRuntimeFlags, updatedRuntimeFlags)
								)
							)
						return updateRuntimeFlags(patch)
					})
				)
			}
			poll() {
				return untraced(() => sync(() => fromNullable(this._exitValue)))
			}
			unsafePoll() {
				return this._exitValue
			}
			interruptAsFork(fiberId) {
				return untraced(() =>
					sync(() => this.tell(interruptSignal(interrupt(fiberId))))
				)
			}
			unsafeAddObserver(observer) {
				null !== this._exitValue
					? observer(this._exitValue)
					: this._observers.push(observer)
			}
			unsafeRemoveObserver(observer) {
				this._observers = this._observers.filter(o => o !== observer)
			}
			unsafeGetFiberRefs() {
				this.setFiberRef(currentRuntimeFlags, this._runtimeFlags)
				return this._fiberRefs
			}
			unsafeDeleteFiberRef(fiberRef) {
				this._fiberRefs = delete_(this._fiberRefs, fiberRef)
			}
			getFiberRef(fiberRef) {
				return getOrDefault(this._fiberRefs, fiberRef)
			}
			setFiberRef(fiberRef, value) {
				this._fiberRefs = updatedAs(
					this._fiberRefs,
					this._fiberId,
					fiberRef,
					value
				)
			}
			setFiberRefs(fiberRefs) {
				this._fiberRefs = fiberRefs
			}
			addChild(child) {
				this.getChildren().add(child)
			}
			removeChild(child) {
				this.getChildren().delete(child)
			}
			drainQueueOnCurrentThread() {
				let recurse = !0
				for (; recurse; ) {
					let evaluationSignal = "Continue"
					const prev = globalThis[currentFiberURI]
					globalThis[currentFiberURI] = this
					try {
						for (; "Continue" === evaluationSignal; )
							evaluationSignal = MutableQueue_isEmpty(this._queue)
								? "Done"
								: this.evaluateMessageWhileSuspended(
										MutableQueue_poll(null)(this._queue)
								  )
					} finally {
						this._running = !1
						globalThis[currentFiberURI] = prev
					}
					if (MutableQueue_isEmpty(this._queue) || this._running) recurse = !1
					else {
						this._running = !0
						if ("Yield" === evaluationSignal) {
							this.drainQueueLaterOnExecutor()
							recurse = !1
						} else recurse = !0
					}
				}
			}
			drainQueueLaterOnExecutor() {
				this.getFiberRef(currentScheduler).scheduleTask(this.run)
			}
			drainQueueWhileRunning(runtimeFlags, cur0) {
				let cur = cur0
				for (; !MutableQueue_isEmpty(this._queue); ) {
					const message = MutableQueue_poll(void 0)(this._queue)
					cur = drainQueueWhileRunningTable[message._tag](
						this,
						runtimeFlags,
						cur,
						message
					)
				}
				return cur
			}
			isInterrupted() {
				return !(self =>
					"Empty" === self._tag ||
					cause_reduce(self, !0, (acc, cause) => {
						switch (cause._tag) {
							case "Empty":
								return Option_some(acc)
							case "Die":
							case "Fail":
							case "Interrupt":
								return Option_some(!1)
							default:
								return Option_none()
						}
					}))(this.getFiberRef(interruptedCause))
			}
			addInterruptedCause(cause) {
				const oldSC = this.getFiberRef(interruptedCause)
				this.setFiberRef(interruptedCause, sequential(oldSC, cause))
			}
			processNewInterruptSignal(cause) {
				this.addInterruptedCause(cause)
				this.sendInterruptSignalToAllChildren()
			}
			sendInterruptSignalToAllChildren() {
				if (null === this._children || 0 === this._children.size) return !1
				let told = !1
				for (const child of this._children) {
					child.tell(interruptSignal(interrupt(this.id())))
					told = !0
				}
				return told
			}
			interruptAllChildren() {
				if (this.sendInterruptSignalToAllChildren()) {
					const it = this._children.values()
					this._children = null
					let isDone = !1
					const body = () => {
						const next = it.next()
						return next.done
							? sync(() => {
									isDone = !0
							  })
							: core_asUnit(next.value.await())
					}
					return whileLoop(
						() => !isDone,
						() => body(),
						() => {}
					)
				}
				return null
			}
			reportExitValue(exit) {
				if (runtimeMetrics(this._runtimeFlags)) {
					const tags = this.getFiberRef(currentTags)
					switch (exit._tag) {
						case "Success":
							fiberSuccesses.unsafeUpdate(1, tags)
							break
						case "Failure":
							fiberFailures.unsafeUpdate(1, tags)
					}
				}
				if ("Failure" === exit._tag) {
					const level = this.getFiberRef(unhandledErrorLogLevel)
					isInterruptedOnly(exit.cause) ||
						"Some" !== level._tag ||
						this.log(
							"Fiber terminated with a non handled error",
							exit.cause,
							level
						)
				}
			}
			setExitValue(exit) {
				this._exitValue = exit
				if (runtimeMetrics(this._runtimeFlags)) {
					const tags = this.getFiberRef(currentTags),
						startTimeMillis = this.id().startTimeMillis,
						endTimeMillis = new Date().getTime()
					fiberLifetimes.unsafeUpdate(
						(endTimeMillis - startTimeMillis) / 1e3,
						tags
					)
				}
				this.reportExitValue(exit)
				for (let i = this._observers.length - 1; i >= 0; i--)
					this._observers[i](exit)
			}
			getLoggers() {
				return this.getFiberRef(currentLoggers)
			}
			log(message, cause, overrideLogLevel) {
				const logLevel = Option_isSome(overrideLogLevel)
						? overrideLogLevel.value
						: this.getFiberRef(currentLogLevel),
					spans = this.getFiberRef(currentLogSpan),
					annotations = this.getFiberRef(currentLogAnnotations),
					loggers = this.getLoggers(),
					contextMap = this.unsafeGetFiberRefs()
				mjs_HashSet_forEach(logger => {
					logger.log(
						this.id(),
						logLevel,
						message,
						cause,
						contextMap,
						spans,
						annotations
					)
				})(loggers)
			}
			evaluateMessageWhileSuspended(message) {
				switch (message._tag) {
					case "YieldNow":
						return "Yield"
					case "InterruptSignal":
						this.processNewInterruptSignal(message.cause)
						if (null !== this._asyncInterruptor) {
							this._asyncInterruptor(exitFailCause(message.cause))
							this._asyncInterruptor = null
						}
						return "Continue"
					case "Resume":
						this._asyncInterruptor = null
						this._asyncBlockingOn = null
						this.evaluateEffect(message.effect)
						return "Continue"
					case "Stateful":
						message.onFiber(
							this,
							null !== this._exitValue
								? Status_done
								: ((runtimeFlags = this._runtimeFlags),
								  (blockingOn = this._asyncBlockingOn),
								  new Suspended(runtimeFlags, blockingOn))
						)
						return "Continue"
					default:
						return fiberRuntime_absurd(message)
				}
				var runtimeFlags, blockingOn
			}
			evaluateEffect(effect0) {
				this.getSupervisor().onResume(this)
				try {
					let effect =
						interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(this.getInterruptedCause())
							: effect0
					for (; null !== effect; )
						try {
							const exit = this.runLoop(effect)
							this._runtimeFlags = runtimeFlags_enable(16)(this._runtimeFlags)
							const interruption = this.interruptAllChildren()
							if (null !== interruption)
								effect = untraced(() => core_flatMap(interruption, () => exit))
							else {
								MutableQueue_isEmpty(this._queue)
									? this.setExitValue(exit)
									: this.tell(resume(exit))
								effect = null
							}
						} catch (e) {
							if (!isEffect(e)) throw e
							if ("Yield" === e._tag)
								if (cooperativeYielding(this._runtimeFlags)) {
									this.tell({ _tag: "YieldNow" })
									this.tell(resume(exitUnit()))
									effect = null
								} else effect = exitUnit()
							else "Async" === e._tag && (effect = null)
						}
				} finally {
					this.getSupervisor().onSuspend(this)
				}
			}
			start(effect) {
				if (this._running) this.tell(resume(effect))
				else {
					this._running = !0
					const prev = globalThis[currentFiberURI]
					globalThis[currentFiberURI] = this
					try {
						this.evaluateEffect(effect)
					} finally {
						this._running = !1
						globalThis[currentFiberURI] = prev
						MutableQueue_isEmpty(this._queue) ||
							this.drainQueueLaterOnExecutor()
					}
				}
			}
			startFork(effect) {
				this.tell(resume(effect))
			}
			patchRuntimeFlags(oldRuntimeFlags, patch) {
				const newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, patch)
				globalThis[currentFiberURI] = this
				this._runtimeFlags = newRuntimeFlags
				return newRuntimeFlags
			}
			initiateAsync(runtimeFlags, asyncRegister) {
				let alreadyCalled = !1
				const callback = effect => {
					if (!alreadyCalled) {
						alreadyCalled = !0
						this.tell(resume(effect))
					}
				}
				interruptible(runtimeFlags) && (this._asyncInterruptor = callback)
				try {
					asyncRegister(callback)
				} catch (e) {
					callback(failCause(die(e)))
				}
			}
			pushStack(cont) {
				this._stack.push(cont)
				"trace" in cont && cont.trace && this._traceStack.push(cont.trace)
			}
			popStack() {
				const item = this._stack.pop()
				if (item) {
					"trace" in item && item.trace && this._traceStack.pop()
					return item
				}
			}
			getNextSuccessCont() {
				let frame = this.popStack()
				for (; frame; ) {
					if ("OnFailure" !== frame._tag && "Traced" !== frame._tag)
						return frame
					frame = this.popStack()
				}
			}
			getNextFailCont() {
				let frame = this.popStack()
				for (; frame; ) {
					if (
						"OnSuccess" !== frame._tag &&
						"While" !== frame._tag &&
						"Traced" !== frame._tag
					)
						return frame
					frame = this.popStack()
				}
			}
			[((fiberRuntime_a = FiberTypeId),
			(fiberRuntime_b = RuntimeFiberTypeId),
			"Tag")](op) {
				return core_map(fiberRefGet(currentContext), context =>
					mjs_Context_unsafeGet(context, op)
				)
			}
			Left(op) {
				return exitFail(op.i0)
			}
			None(_) {
				return exitFail(NoSuchElementException())
			}
			Right(op) {
				return exitSucceed(op.i0)
			}
			Some(op) {
				return exitSucceed(op.i0)
			}
			Sync(op) {
				const value = op.i0(),
					cont = this.getNextSuccessCont()
				if (void 0 !== cont) {
					cont._tag in contOpSuccess || fiberRuntime_absurd(cont)
					return contOpSuccess[cont._tag](this, cont, value)
				}
				throw exitSucceed(value)
			}
			Success(op) {
				const oldCur = op,
					cont = this.getNextSuccessCont()
				if (void 0 !== cont) {
					cont._tag in contOpSuccess || fiberRuntime_absurd(cont)
					return contOpSuccess[cont._tag](this, cont, oldCur.i0)
				}
				throw oldCur
			}
			Failure(op) {
				let cause = op.i0
				if (
					(self => "Annotated" === self._tag)(cause) &&
					isStackAnnotation(cause.annotation)
				) {
					const stack = cause.annotation.stack,
						currentStack = this.stackToLines()
					cause = annotated(
						cause.cause,
						new StackAnnotation(
							Chunk_take(runtimeDebug.traceStackLimit)(
								dedupeAdjacent(
									0 === stack.length
										? currentStack
										: 0 === currentStack.length ||
										  unsafeLast(stack) === unsafeLast(currentStack)
										? stack
										: Chunk_concat(currentStack)(stack)
								)
							),
							cause.annotation.seq
						)
					)
				} else
					cause = annotated(
						op.i0,
						new StackAnnotation(
							this.stackToLines(),
							(self => getAndUpdate(self, n => n + 1))(globalErrorSeq)
						)
					)
				const cont = this.getNextFailCont()
				if (void 0 === cont) throw exitFailCause(cause)
				switch (cont._tag) {
					case "OnFailure":
					case "OnSuccessAndFailure":
						return interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(stripFailures(cause))
							: cont.i1(cause)
					case "RevertFlags":
						this.patchRuntimeFlags(this._runtimeFlags, cont.patch)
						return interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(sequential(cause, this.getInterruptedCause()))
							: exitFailCause(cause)
					default:
						fiberRuntime_absurd(cont)
				}
			}
			WithRuntime(op) {
				return op.i0(this, Status_running(this._runtimeFlags))
			}
			UpdateRuntimeFlags(op) {
				if (void 0 === op.i1) {
					this.patchRuntimeFlags(this._runtimeFlags, op.i0)
					return exitUnit()
				}
				{
					const updateFlags = op.i0,
						oldRuntimeFlags = this._runtimeFlags,
						newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, updateFlags)
					if (newRuntimeFlags === oldRuntimeFlags) return op.i1(oldRuntimeFlags)
					if (interruptible(newRuntimeFlags) && this.isInterrupted())
						return exitFailCause(this.getInterruptedCause())
					{
						this.patchRuntimeFlags(this._runtimeFlags, updateFlags)
						const revertFlags = runtimeFlags_diff(
							newRuntimeFlags,
							oldRuntimeFlags
						)
						this.pushStack(new RevertFlags(revertFlags))
						return op.i1(oldRuntimeFlags)
					}
				}
			}
			OnSuccess(op) {
				this.pushStack(op)
				return op.i0
			}
			Traced(op) {
				this.pushStack(op)
				return op.i0
			}
			OnFailure(op) {
				this.pushStack(op)
				return op.i0
			}
			OnSuccessAndFailure(op) {
				this.pushStack(op)
				return op.i0
			}
			Async(op) {
				this._asyncBlockingOn = op.i1
				this.initiateAsync(this._runtimeFlags, op.i0)
				throw op
			}
			Yield(op) {
				throw op
			}
			While(op) {
				const check = op.i0,
					body = op.i1
				if (check()) {
					this.pushStack(op)
					return body()
				}
				return exitUnit()
			}
			Commit(op) {
				return op.commit()
			}
			runLoop(effect0) {
				let cur = effect0,
					ops = 0
				for (;;) {
					opSupervision(this._runtimeFlags) &&
						this.getSupervisor().onEffect(this, cur)
					cur = this.drainQueueWhileRunning(this._runtimeFlags, cur)
					ops += 1
					if (ops >= 2048) {
						ops = 0
						const oldCur = cur
						cur = core_flatMap(() => oldCur)(yieldNow())
					}
					try {
						cur._tag in this || fiberRuntime_absurd(cur)
						cur = this[cur._tag](cur)
					} catch (e) {
						if (isEffect(e)) {
							if ("Yield" === e._tag || "Async" === e._tag) throw e
							if ("Success" === e._tag || "Failure" === e._tag) return e
						} else
							cur = isEffectError(e)
								? exitFailCause(e.cause)
								: isInterruptedException(e)
								? exitFailCause(sequential(die(e), interrupt(Id_none)))
								: exitFailCause(die(e))
					}
				}
			}
			stackToLines() {
				if (0 === this._traceStack.length) return Chunk_empty()
				const lines = []
				let current = this._traceStack.length - 1
				for (; current >= 0 && lines.length < runtimeDebug.traceStackLimit; ) {
					const value = this._traceStack[current]
					lines.push(value)
					current -= 1
				}
				return unsafeFromArray(lines)
			}
		}
		const currentMinimumLogLevel = fiberRefUnsafeMake(
				fromLiteral(runtimeDebug.minumumLogLevel)
			),
			defaultLogger = makeLogger(
				(fiberId, logLevel, message, cause, context, spans, annotations) => {
					const formatted = stringLogger.log(
							fiberId,
							logLevel,
							message,
							cause,
							context,
							spans,
							annotations
						),
						filter = getOrDefault(context, currentMinimumLogLevel)
					greaterThanEqual(filter)(logLevel) &&
						globalThis.console.log(formatted)
				}
			),
			currentLoggers = fiberRefUnsafeMakeHashSet(
				mjs_HashSet_make(defaultLogger)
			),
			acquireRelease = dualWithTrace(
				2,
				(trace, restore) => (acquire, release) =>
					uninterruptible(
						core_tap(acquire, a =>
							addFinalizer(exit => restore(release)(a, exit))
						)
					).traced(trace)
			),
			addFinalizer = methodWithTrace(
				(trace, restore) => finalizer =>
					core_flatMap(context(), context =>
						core_flatMap(scope(), scope =>
							scopeAddFinalizerExit(scope, exit =>
								core_asUnit(provideContext(context)(restore(finalizer)(exit)))
							)
						)
					).traced(trace)
			),
			forEachPar = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					fiberRefGetWith(currentParallelism, o =>
						"None" === o._tag
							? forEachParUnbounded(self, restore(f))
							: forEachParN(self, o.value, f)
					).traced(trace)
			),
			forEachParUnbounded = (self, f) =>
				suspend(() => {
					const as = Array.from(self).map((v, i) => [v, i]),
						array = new Array(as.length)
					return core_zipRight(
						forEachParUnboundedDiscard(as, ([a, i]) =>
							core_flatMap(f(a), b => sync(() => (array[i] = b)))
						),
						succeed(unsafeFromArray(array))
					)
				}),
			forEachParUnboundedDiscard = (self, f) =>
				suspend(() => {
					const as = Array.from(self),
						size = as.length
					return 0 === size
						? core_unit()
						: 1 === size
						? core_asUnit(f(as[0]))
						: uninterruptibleMask(restore => {
								const deferred = deferredUnsafeMake(Id_none)
								let ref = 0
								const process = transplant(graft =>
									core_forEach(as, a =>
										forkDaemon(
											graft(
												matchCauseEffect(
													cause =>
														core_zipRight(
															deferredFail(deferred, void 0),
															failCause(cause)
														),
													() => {
														ref + 1 === size
															? deferredUnsafeDone(deferred, core_unit())
															: (ref += 1)
														return core_unit()
													}
												)(restore(suspend(() => f(a))))
											)
										)
									)
								)
								return core_flatMap(process, fibers =>
									matchCauseEffect(
										restore(deferredAwait(deferred)),
										cause =>
											core_flatMap(
												forEachParUnbounded(fibers, interruptFiber),
												exits => {
													const exit = exitCollectAllPar(exits)
													return "Some" === exit._tag &&
														(self => "Failure" === self._tag)(exit.value)
														? failCause(
																parallel(stripFailures(cause), exit.value.i0)
														  )
														: failCause(stripFailures(cause))
												}
											),
										() => forEachDiscard(fibers, f => f.inheritAll())
									)
								)
						  })
				}),
			forEachParN = (self, n, f) =>
				suspend(() => {
					const as = Array.from(self).map((v, i) => [v, i]),
						array = new Array(as.length)
					return core_zipRight(
						forEachParNDiscard(as, n, ([a, i]) =>
							core_map(f(a), b => (array[i] = b))
						),
						succeed(unsafeFromArray(array))
					)
				}),
			forEachParNDiscard = (self, n, f) =>
				suspend(() => {
					const iterator = self[Symbol.iterator](),
						worker = core_flatMap(
							sync(() => iterator.next()),
							next =>
								next.done
									? core_unit()
									: core_flatMap(core_asUnit(f(next.value)), () => worker)
						),
						effects = []
					for (let i = 0; i < n; i++) effects.push(worker)
					return forEachParUnboundedDiscard(effects, Function_identity)
				}),
			forkDaemon = methodWithTrace(
				trace => self => forkWithScopeOverride(self, globalScope).traced(trace)
			),
			unsafeMakeChildFiber = (
				effect,
				parentFiber,
				parentRuntimeFlags,
				overrideScope = null
			) => {
				const childId = Id_unsafeMake(),
					parentFiberRefs = parentFiber.unsafeGetFiberRefs(),
					childFiberRefs = forkAs(parentFiberRefs, childId),
					childFiber = new FiberRuntime(
						childId,
						childFiberRefs,
						parentRuntimeFlags
					),
					childContext = getOrDefault(childFiberRefs, currentContext),
					supervisor = childFiber.getSupervisor()
				supervisor.onStart(
					childContext,
					effect,
					Option_some(parentFiber),
					childFiber
				)
				childFiber.unsafeAddObserver(exit => supervisor.onEnd(exit, childFiber))
				;(null !== overrideScope
					? overrideScope
					: getOrElse(() => parentFiber.scope())(
							parentFiber.getFiberRef(forkScopeOverride)
					  )
				).add(parentRuntimeFlags, childFiber)
				return childFiber
			},
			forkWithScopeOverride = (self, scopeOverride) =>
				withFiberRuntime((parentFiber, parentStatus) =>
					succeed(
						((
							effect,
							parentFiber,
							parentRuntimeFlags,
							overrideScope = null
						) => {
							const childFiber = unsafeMakeChildFiber(
								effect,
								parentFiber,
								parentRuntimeFlags,
								overrideScope
							)
							childFiber.resume(effect)
							return childFiber
						})(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)
					)
				),
			scope = methodWithTrace(trace => () => scopeTag.traced(trace)),
			scopeWith = methodWithTrace(
				(trace, restore) => f =>
					core_flatMap(scopeTag, restore(f)).traced(trace)
			),
			fiberRuntime_some = methodWithTrace(
				trace => self =>
					matchEffect(
						self,
						e => core_fail(Option_some(e)),
						option => {
							switch (option._tag) {
								case "None":
									return core_fail(Option_none())
								case "Some":
									return succeed(option.value)
							}
						}
					).traced(trace)
			),
			scopeTag = Tag(),
			scopeMake = methodWithTrace(
				trace =>
					(strategy = ExecutionStrategy_sequential) =>
						core_map(releaseMapMake(), rm => ({
							[ScopeTypeId]: ScopeTypeId,
							[CloseableScopeTypeId]: CloseableScopeTypeId,
							fork: strategy =>
								bodyWithTrace(trace =>
									uninterruptible(
										core_flatMap(scope =>
											core_as(scope)(
												core_tap(fin => scopeAddFinalizerExit(scope, fin))(
													releaseMapAdd(exit => scopeClose(scope, exit))(rm)
												)
											)
										)(scopeMake(strategy))
									).traced(trace)
								),
							close: exit =>
								bodyWithTrace(trace =>
									core_asUnit(
										(
											(strategy, exit) => self =>
												suspend(() => {
													switch (self.state._tag) {
														case "Exited":
															return core_unit()
														case "Running": {
															const finalizersMap = self.state.finalizers,
																update = self.state.update,
																finalizers = Array.from(finalizersMap.keys())
																	.sort((a, b) => b - a)
																	.map(key => finalizersMap.get(key))
															self.state = {
																_tag: "Exited",
																nextKey: self.state.nextKey,
																exit,
																update,
															}
															return (self => "Sequential" === self._tag)(
																strategy
															)
																? core_flatMap(results =>
																		getOrElse(() => exitUnit())(
																			Option_map(exitAsUnit)(
																				exitCollectAllInternal(
																					results,
																					sequential
																				)
																			)
																		)
																  )(
																		core_forEach(fin =>
																			core_exit(update(fin)(exit))
																		)(finalizers)
																  )
																: (self => "Parallel" === self._tag)(strategy)
																? core_flatMap(results =>
																		getOrElse(() => exitUnit())(
																			Option_map(exitAsUnit)(
																				exitCollectAllPar(results)
																			)
																		)
																  )(
																		forEachPar(fin =>
																			core_exit(update(fin)(exit))
																		)(finalizers)
																  )
																: withParallelism(strategy.parallelism)(
																		core_flatMap(results =>
																			getOrElse(() => exitUnit())(
																				Option_map(exitAsUnit)(
																					exitCollectAllPar(results)
																				)
																			)
																		)(
																			forEachPar(fin =>
																				core_exit(update(fin)(exit))
																			)(finalizers)
																		)
																  )
														}
													}
												})
										)(
											strategy,
											exit
										)(rm)
									).traced(trace)
								),
							addFinalizer: fin =>
								bodyWithTrace(trace =>
									core_asUnit(releaseMapAdd(fin)(rm)).traced(trace)
								),
						})).traced(trace)
			),
			scopeExtend = dualWithTrace(
				2,
				trace => (effect, scope) =>
					contramapContext(
						effect,
						mjs_Context_merge(mjs_Context_make(scopeTag, scope))
					).traced(trace)
			),
			fiberRefUnsafeMakeSupervisor = initial =>
				fiberRefUnsafeMakePatch(initial, patch_differ, supervisor_patch_empty),
			fiberRefLocallyScoped = dualWithTrace(
				2,
				trace => (self, value) =>
					core_asUnit(
						acquireRelease(
							core_flatMap(oldValue =>
								core_as(oldValue)(fiberRefSet(self, value))
							)(fiberRefGet(self)),
							oldValue => fiberRefSet(self, oldValue)
						)
					).traced(trace)
			),
			fiberRefLocallyScopedWith = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					fiberRefGetWith(self, a =>
						fiberRefLocallyScoped(self, restore(f)(a))
					).traced(trace)
			),
			currentRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags(runtimeFlags_none),
			currentSupervisor = fiberRefUnsafeMakeSupervisor(supervisor_none),
			fiberInterruptFork = methodWithTrace(
				trace => self =>
					core_asUnit(forkDaemon(interruptFiber(self))).traced(trace)
			),
			IntervalTypeId = Symbol.for("@effect/io/Schedule/Interval"),
			interval_empty = {
				[IntervalTypeId]: IntervalTypeId,
				startMillis: 0,
				endMillis: 0,
			},
			Interval_empty = interval_empty,
			Interval_after = startMilliseconds => {
				return (
					(startMillis = startMilliseconds),
					(endMillis = Number.POSITIVE_INFINITY),
					startMillis > endMillis
						? interval_empty
						: { [IntervalTypeId]: IntervalTypeId, startMillis, endMillis }
				)
				var startMillis, endMillis
			},
			IntervalsTypeId = Symbol.for("@effect/io/Schedule/Intervals"),
			Intervals_make = intervals => ({
				[IntervalsTypeId]: IntervalsTypeId,
				intervals,
			}),
			Intervals_start = self =>
				getOrElse(() => Interval_empty)(Chunk_head(self.intervals)).startMillis,
			Decision_continueWith = interval => ({
				_tag: "Continue",
				intervals: Intervals_make(Chunk_of(interval)),
			})
		var schedule_a, schedule_b
		const ScheduleTypeId = Symbol.for("@effect/io/Schedule"),
			ScheduleDriverTypeId = Symbol.for("@effect/io/Schedule/Driver"),
			scheduleVariance = { _Env: _ => _, _In: _ => _, _Out: _ => _ },
			scheduleDriverVariance = { _Env: _ => _, _In: _ => _, _Out: _ => _ }
		class ScheduleImpl {
			constructor(initial, step) {
				this.initial = initial
				this.step = step
				this[schedule_a] = scheduleVariance
			}
		}
		schedule_a = ScheduleTypeId
		class ScheduleDriverImpl {
			constructor(schedule, ref) {
				this.schedule = schedule
				this.ref = ref
				this[schedule_b] = scheduleDriverVariance
			}
			state() {
				return bodyWithTrace(trace =>
					core_map(Ref_get(this.ref), tuple => tuple[1]).traced(trace)
				)
			}
			last() {
				return bodyWithTrace(trace =>
					core_flatMap(Ref_get(this.ref), ([element, _]) => {
						switch (element._tag) {
							case "None":
								return failSync(() => NoSuchElementException())
							case "Some":
								return succeed(element.value)
						}
					}).traced(trace)
				)
			}
			reset() {
				return bodyWithTrace(trace =>
					Ref_set(this.ref, [Option_none(), this.schedule.initial]).traced(
						trace
					)
				)
			}
			next(input) {
				return bodyWithTrace((trace, restore) =>
					core_flatMap(state =>
						core_flatMap(now =>
							core_flatMap(([state, out, decision]) =>
								(self => "Done" === self._tag)(decision)
									? core_zipRight(core_fail(Option_none()))(
											Ref_set(this.ref, [Option_some(out), state])
									  )
									: core_as(out)(
											core_zipRight(
												effect_sleep(
													millis(Intervals_start(decision.intervals) - now)
												)
											)(Ref_set(this.ref, [Option_some(out), state]))
									  )
							)(suspend(restore(() => this.schedule.step(now, input, state))))
						)(Clock_currentTimeMillis())
					)(core_map(Ref_get(this.ref), tuple => tuple[1])).traced(trace)
				)
			}
		}
		schedule_b = ScheduleDriverTypeId
		const makeWithState = untracedMethod(
				restore => (initial, step) => new ScheduleImpl(initial, restore(step))
			),
			driver = methodWithTrace(
				trace => self =>
					core_map(ref => new ScheduleDriverImpl(self, ref))(
						Ref_make([Option_none(), self.initial])
					).traced(trace)
			),
			fixed = untracedMethod(
				() => interval =>
					makeWithState([Option_none(), 0], (now, _, [option, n]) =>
						sync(() => {
							const intervalMillis = interval.millis
							switch (option._tag) {
								case "None":
									return [
										[Option_some([now, now + intervalMillis]), n + 1],
										n,
										Decision_continueWith(Interval_after(now + intervalMillis)),
									]
								case "Some": {
									const [startMillis, lastRun] = option.value,
										runningBehind = now > lastRun + intervalMillis,
										boundary = equals(interval, zero)
											? interval
											: millis(
													intervalMillis -
														((now - startMillis) % intervalMillis)
											  ),
										sleepTime = equals(boundary, zero) ? interval : boundary,
										nextRun = runningBehind ? now : now + sleepTime.millis
									return [
										[Option_some([startMillis, nextRun]), n + 1],
										n,
										Decision_continueWith(Interval_after(nextRun)),
									]
								}
							}
						})
					)
			),
			repeat_Effect = dualWithTrace(
				2,
				trace => (self, schedule) =>
					repeatOrElse_Effect(self, schedule, (e, _) => core_fail(e)).traced(
						trace
					)
			),
			repeatOrElse_Effect = dualWithTrace(
				3,
				(trace, restore) => (self, schedule, orElse) =>
					core_map(
						repeatOrElseEither_Effect(self, schedule, restore(orElse)),
						merge
					).traced(trace)
			),
			repeatOrElseEither_Effect = dualWithTrace(
				3,
				(trace, restore) => (self, schedule, orElse) =>
					core_flatMap(driver(schedule), driver =>
						matchEffect(
							self,
							error =>
								core_map(Either_left)(restore(orElse)(error, Option_none())),
							value =>
								repeatOrElseEitherEffectLoop(
									self,
									driver,
									restore(orElse),
									value
								)
						)
					).traced(trace)
			),
			repeatOrElseEitherEffectLoop = (self, driver, orElse, value) =>
				matchEffect(
					() => core_map(Either_right)(orDie(driver.last())),
					b =>
						matchEffect(
							error => core_map(Either_left)(orElse(error, Option_some(b))),
							value => repeatOrElseEitherEffectLoop(self, driver, orElse, value)
						)(self)
				)(driver.next(value))
		var circular_b, circular_c
		class Semaphore {
			constructor(permits) {
				this.permits = permits
				this.waiters = new Array()
				this.taken = 0
				this.take = n =>
					bodyWithTrace(trace =>
						asyncInterruptEither(resume => {
							if (this.free < n) {
								const observer = () => {
									if (this.free >= n) {
										const observerIndex = this.waiters.findIndex(
											cb => cb === observer
										)
										;-1 !== observerIndex &&
											this.waiters.splice(observerIndex, 1)
										this.taken += n
										resume(succeed(n))
									}
								}
								this.waiters.push(observer)
								return Either_left(
									sync(() => {
										const observerIndex = this.waiters.findIndex(
											cb => cb === observer
										)
										;-1 !== observerIndex &&
											this.waiters.splice(observerIndex, 1)
									})
								)
							}
							this.taken += n
							return Either_right(succeed(n))
						}).traced(trace)
					)
				this.release = n =>
					bodyWithTrace(trace =>
						withFiberRuntime(fiber => {
							this.taken -= n
							fiber.getFiberRef(currentScheduler).scheduleTask(() => {
								this.waiters.forEach(wake => wake())
							})
							return core_unit()
						}).traced(trace)
					)
				this.withPermits = n =>
					bodyWithTrace(
						trace => self =>
							untraced(() =>
								uninterruptibleMask(restore =>
									core_flatMap(restore(this.take(n)), permits =>
										circular_ensuring(restore(self), this.release(permits))
									)
								)
							).traced(trace)
					)
			}
			get free() {
				return this.permits - this.taken
			}
		}
		const circular_ensuring = dualWithTrace(
			2,
			trace => (self, finalizer) =>
				uninterruptibleMask(restore =>
					matchCauseEffect(
						restore(self),
						cause1 =>
							matchCauseEffect(
								finalizer,
								cause2 => failCause(sequential(cause1, cause2)),
								() => failCause(cause1)
							),
						a => core_as(finalizer, a)
					)
				).traced(trace)
		)
		const zipWithPar = dualWithTrace(
				3,
				(trace, restoreTrace) => (self, that, f) =>
					uninterruptibleMask(restore =>
						transplant(graft => {
							const deferred = deferredUnsafeMake(Id_none),
								ref = MutableRef_make(!1)
							return core_flatMap(([left, right]) =>
								matchCauseEffect(
									cause =>
										core_zipRight(
											core_flatMap(([left, right]) =>
												exitMatch(
													causes =>
														failCause(parallel(stripFailures(cause), causes)),
													() => failCause(stripFailures(cause))
												)(exitZipWith(right, f, parallel)(left))
											)(core_zip(_await(right))(_await(left)))
										)(
											core_zipRight(fiberInterruptFork(right))(
												fiberInterruptFork(left)
											)
										),
									() =>
										core_zipWith(
											fiber_join(left),
											fiber_join(right),
											restoreTrace(f)
										)
								)(restore(deferredAwait(deferred)))
							)(
								core_zip(forkZipWithPar(that, graft, restore, deferred, ref))(
									forkZipWithPar(self, graft, restore, deferred, ref)
								)
							)
						})
					).traced(trace)
			),
			forkZipWithPar = (self, graft, restore, deferred, ref) =>
				forkDaemon(
					matchCauseEffect(
						graft(restore(self)),
						cause =>
							core_zipRight(deferredFail(deferred, void 0), failCause(cause)),
						value => {
							if (MutableRef_get(ref)) {
								deferredUnsafeDone(deferred, core_unit())
								return succeed(value)
							}
							MutableRef_set(!0)(ref)
							return succeed(value)
						}
					)
				),
			SynchronizedTypeId = Symbol.for("@effect/io/Ref/Synchronized"),
			synchronizedVariance = { _A: _ => _ }
		class SynchronizedImpl {
			constructor(ref, withLock) {
				this.ref = ref
				this.withLock = withLock
				this[circular_b] = synchronizedVariance
				this[circular_c] = refVariance
			}
			modify(f) {
				return bodyWithTrace((trace, restore) =>
					this.modifyEffect(a => succeed(restore(f)(a))).traced(trace)
				)
			}
			modifyEffect(f) {
				return bodyWithTrace((trace, restore) =>
					this.withLock(
						core_flatMap(([b, a]) => core_as(ref_set(this.ref, a), b))(
							core_flatMap(ref_get(this.ref), restore(f))
						)
					).traced(trace)
				)
			}
		}
		;(circular_b = SynchronizedTypeId), (circular_c = RefTypeId)
		const makeSynchronized = methodWithTrace(
				trace => value =>
					sync(() => unsafeMakeSynchronized(value)).traced(trace)
			),
			unsafeMakeSynchronized = value => {
				const ref = ref_unsafeMake(value),
					sem = new Semaphore(1)
				return new SynchronizedImpl(ref, sem.withPermits(1))
			},
			Cause_fail = fail,
			Cause_failureOrCause = failureOrCause,
			Cause_pretty = cause_pretty_pretty,
			modifyEffect = dualWithTrace(
				2,
				(trace, restore) => (self, f) =>
					self.modifyEffect(restore(f)).traced(trace)
			),
			layer_proto = {
				[Symbol.for("@effect/io/Layer")]: {
					_RIn: _ => _,
					_E: _ => _,
					_ROut: _ => _,
				},
			},
			isFresh = self => "Fresh" === self._tag
		class MemoMap {
			constructor(ref) {
				this.ref = ref
			}
			getOrElseMemoize(layer, scope) {
				return core_flatten(
					modifyEffect(this.ref, map => {
						const inMap = map.get(layer)
						if (void 0 !== inMap) {
							const [acquire, release] = inMap,
								cached = onExit(
									exitMatch(
										() => core_unit(),
										() => scopeAddFinalizerExit(scope, release)
									)
								)(
									core_flatMap(([patch, b]) =>
										core_as(b)(patchFiberRefs(patch))
									)(acquire)
								)
							return succeed([cached, map])
						}
						return core_flatMap(observers =>
							core_flatMap(deferred =>
								core_map(finalizerRef => {
									const resource = uninterruptibleMask(restore =>
											core_flatMap(innerScope =>
												core_flatMap(exit => {
													switch (exit._tag) {
														case "Failure":
															return core_zipRight(failCause(exit.i0))(
																core_zipRight(scopeClose(innerScope, exit))(
																	deferredFailCause(deferred, exit.i0)
																)
															)
														case "Success":
															return core_as(exit.i0[1])(
																core_zipRight(
																	deferredSucceed(deferred, exit.i0)
																)(
																	core_zipRight(
																		scopeAddFinalizerExit(scope, exit =>
																			core_flatMap(finalizer =>
																				finalizer(exit)
																			)(ref_get(finalizerRef))
																		)
																	)(
																		core_zipRight(
																			ref_update(observers, n => n + 1)
																		)(
																			ref_set(finalizerRef, exit =>
																				core_asUnit(
																					whenEffect(
																						ref_modify(observers, n => [
																							1 === n,
																							n - 1,
																						])
																					)(scopeClose(innerScope, exit))
																				)
																			)
																		)
																	)
																)
															)
													}
												})(
													core_exit(
														restore(
															core_flatMap(withScope(layer, innerScope), f =>
																diffFiberRefs(f(this))
															)
														)
													)
												)
											)(scopeMake())
										),
										memoized = [
											onExit(
												exitMatchEffect(
													() => core_unit(),
													() => ref_update(observers, n => n + 1)
												)
											)(deferredAwait(deferred)),
											exit =>
												core_flatMap(finalizer => finalizer(exit))(
													ref_get(finalizerRef)
												),
										]
									return [
										resource,
										isFresh(layer) ? map : map.set(layer, memoized),
									]
								})(ref_make(() => core_unit()))
							)(deferredMake())
						)(ref_make(0))
					})
				)
			}
		}
		const buildWithScope = dualWithTrace(
				2,
				trace => (self, scope) =>
					core_flatMap(
						core_map(ref => new MemoMap(ref))(makeSynchronized(new Map())),
						memoMap => core_flatMap(withScope(self, scope), run => run(memoMap))
					).traced(trace)
			),
			withScope = (self, scope) => {
				const op = self
				switch (op._tag) {
					case "ExtendScope":
						return sync(
							() => memoMap =>
								scopeWith(scope => memoMap.getOrElseMemoize(op.layer, scope))
						)
					case "Fold":
						return sync(
							() => memoMap =>
								matchCauseEffect(
									cause => memoMap.getOrElseMemoize(op.failureK(cause), scope),
									value => memoMap.getOrElseMemoize(op.successK(value), scope)
								)(memoMap.getOrElseMemoize(op.layer, scope))
						)
					case "Fresh":
						return sync(() => _ => buildWithScope(scope)(op.layer))
					case "FromEffect":
						return sync(() => _ => op.effect)
					case "ProvideTo":
						return sync(
							() => memoMap =>
								core_flatMap(env =>
									provideContext(env)(
										memoMap.getOrElseMemoize(op.second, scope)
									)
								)(memoMap.getOrElseMemoize(op.first, scope))
						)
					case "Scoped":
						return sync(() => _ => scopeExtend(op.effect, scope))
					case "Suspend":
						return sync(
							() => memoMap => memoMap.getOrElseMemoize(op.evaluate(), scope)
						)
					case "ZipWith":
						return sync(
							() => memoMap =>
								core_zipWith(
									memoMap.getOrElseMemoize(op.second, scope),
									op.zipK
								)(memoMap.getOrElseMemoize(op.first, scope))
						)
					case "ZipWithPar":
						return sync(
							() => memoMap =>
								zipWithPar(
									memoMap.getOrElseMemoize(op.second, scope),
									op.zipK
								)(memoMap.getOrElseMemoize(op.first, scope))
						)
				}
			},
			layer_fail = error => layer_failCause(Cause_fail(error)),
			layer_failCause = cause => fromEffectContext(failCause(cause)),
			layer_flatMap = untracedDual(
				2,
				restore => (self, f) => matchLayer(self, layer_fail, restore(f))
			)
		function fromEffectContext(effect) {
			const fromEffect = Object.create(layer_proto)
			fromEffect._tag = "FromEffect"
			fromEffect.effect = effect
			return fromEffect
		}
		const matchCauseLayer = untracedDual(
				3,
				restore => (self, onFailure, onSuccess) => {
					const fold = Object.create(layer_proto)
					fold._tag = "Fold"
					fold.layer = self
					fold.failureK = restore(onFailure)
					fold.successK = restore(onSuccess)
					return fold
				}
			),
			matchLayer = untracedDual(
				3,
				restore => (self, onFailure, onSuccess) =>
					matchCauseLayer(
						self,
						cause => {
							const failureOrCause = Cause_failureOrCause(cause)
							switch (failureOrCause._tag) {
								case "Left":
									return restore(onFailure)(failureOrCause.left)
								case "Right":
									return layer_failCause(failureOrCause.right)
							}
						},
						restore(onSuccess)
					)
			),
			layer_merge = Function_dual(2, (self, that) =>
				layer_zipWithPar(self, that, (a, b) => mjs_Context_merge(b)(a))
			),
			scopedDiscard = effect =>
				scopedContext(core_as(mjs_Context_empty())(effect)),
			scopedContext = effect => {
				const scoped = Object.create(layer_proto)
				scoped._tag = "Scoped"
				scoped.effect = effect
				return scoped
			},
			layer_zipWithPar = untracedDual(
				3,
				restore => (self, that, f) =>
					(evaluate => {
						const suspend = Object.create(layer_proto)
						suspend._tag = "Suspend"
						suspend.evaluate = evaluate
						return suspend
					})(() => {
						const zipWithPar = Object.create(layer_proto)
						zipWithPar._tag = "ZipWithPar"
						zipWithPar.first = self
						zipWithPar.second = that
						zipWithPar.zipK = restore(f)
						return zipWithPar
					})
			),
			provideLayer = dualWithTrace(
				2,
				trace => (self, layer) =>
					acquireUseRelease(
						scopeMake(),
						scope =>
							core_flatMap(buildWithScope(layer, scope), context =>
								provideContext(self, context)
							),
						(scope, exit) => scopeClose(scope, exit)
					).traced(trace)
			),
			provideSomeLayer = dualWithTrace(
				2,
				trace => (self, layer) =>
					provideLayer(
						self,
						layer_merge(layer)(fromEffectContext(context()))
					).traced(trace)
			),
			withMinimumLogLevel = dualWithTrace(
				2,
				trace => (self, level) =>
					fiberRefLocally(currentMinimumLogLevel, level)(self).traced(trace)
			),
			addLogger = methodWithTrace(
				trace => logger =>
					scopedDiscard(
						fiberRefLocallyScopedWith(
							currentLoggers,
							mjs_HashSet_add(logger)
						).traced(trace)
					)
			),
			removeLogger = untracedMethod(
				() => logger =>
					scopedDiscard(
						fiberRefLocallyScopedWith(
							currentLoggers,
							mjs_HashSet_remove(logger)
						)
					)
			),
			replaceLogger = Function_dual(2, (self, that) =>
				layer_flatMap(removeLogger(self), () => addLogger(that))
			)
		class AsyncFiber {
			constructor(fiber) {
				this.fiber = fiber
				this._tag = "AsyncFiber"
			}
			toString() {
				return `Fiber #${this.fiber.id().id} has suspended work asyncroniously`
			}
			[Symbol.for("nodejs.util.inspect.custom")]() {
				return this.toString()
			}
		}
		const FiberFailureId = Symbol.for("@effect/io/Runtime/FiberFailure"),
			FiberFailureCauseId = Symbol.for("@effect/io/Runtime/FiberFailure/Cause"),
			NodePrint = Symbol.for("nodejs.util.inspect.custom"),
			unsafeRunPromise = runtime =>
				methodWithTrace(
					trace => effect =>
						new Promise((resolve, reject) => {
							;(runtime =>
								methodWithTrace(trace => (self, options) => {
									const fiberId = Id_unsafeMake(),
										effect = self.traced(trace)
									let fiberRefs = FiberRefs_updatedAs(
										runtime.fiberRefs,
										fiberId,
										currentContext,
										runtime.context
									)
									options?.scheduler &&
										(fiberRefs = FiberRefs_updatedAs(
											fiberRefs,
											fiberId,
											currentScheduler,
											options.scheduler
										))
									options?.updateRefs &&
										(fiberRefs = options.updateRefs(fiberRefs, fiberId))
									const fiberRuntime = new FiberRuntime(
											fiberId,
											FiberRefs_forkAs(fiberRefs, fiberId),
											runtime.runtimeFlags
										),
										supervisor = fiberRuntime.getSupervisor()
									if (supervisor !== supervisor_none) {
										supervisor.onStart(
											runtime.context,
											effect,
											Option_none(),
											fiberRuntime
										)
										fiberRuntime.unsafeAddObserver(exit =>
											supervisor.onEnd(exit, fiberRuntime)
										)
									}
									globalScope.add(runtime.runtimeFlags, fiberRuntime)
									fiberRuntime.start(effect)
									return fiberRuntime
								}))(runtime)(effect.traced(trace)).unsafeAddObserver(result => {
								switch (result._tag) {
									case "Success":
										resolve(result.i0)
										break
									case "Failure":
										reject(
											(cause => {
												const limit = Error.stackTraceLimit
												Error.stackTraceLimit = 0
												const error = new Error()
												Error.stackTraceLimit = limit
												const pretty = prettyErrors(cause)
												if (pretty.length > 0) {
													error.name = pretty[0].message.split(":")[0]
													error.message = pretty[0].message.substring(
														error.name.length + 2
													)
													error.stack = `${error.name}: ${error.message}\n${pretty[0].stack}`
												}
												error[FiberFailureId] = FiberFailureId
												error[FiberFailureCauseId] = cause
												error.toString = () => cause_pretty_pretty(cause)
												error[NodePrint] = () => error.toString()
												return error
											})(result.i0)
										)
								}
							})
						})
				)
		class RuntimeImpl {
			constructor(context, runtimeFlags, fiberRefs) {
				this.context = context
				this.runtimeFlags = runtimeFlags
				this.fiberRefs = fiberRefs
			}
		}
		const runtime_make = (context, runtimeFlags, fiberRefs) =>
				new RuntimeImpl(context, runtimeFlags, fiberRefs),
			defaultRuntimeFlags = runtimeFlags_make(1, 32),
			Effect_asUnit = core_asUnit,
			Effect_delay = delay,
			Effect_bind = effect_bind,
			Effect_bindDiscard = effect_bindDiscard,
			bindValue_ = bindValue,
			Effect_letDiscard = bindValueDiscard,
			Effect_Do = effect_Do,
			Effect_fail = core_fail,
			Effect_filterOrElse = filterOrElse,
			Effect_filterOrFail = filterOrFail,
			Effect_flatMap = core_flatMap,
			Effect_forEach = core_forEach,
			Effect_forkDaemon = forkDaemon,
			Effect_ignore = ignore,
			Effect_isSuccess = effect_isSuccess,
			Effect_log = log,
			Effect_logDebug = logDebug,
			Effect_logError = logError,
			Effect_logInfo = logInfo,
			Effect_logWarning = logWarning,
			Effect_logAnnotate = logAnnotate,
			Effect_map = core_map,
			Effect_matchEffect = matchEffect,
			Effect_orElseSucceed = orElseSucceed,
			Effect_promise = promise,
			Effect_provideSomeLayer = provideSomeLayer,
			Effect_repeat = repeat_Effect,
			Effect_some = fiberRuntime_some,
			Effect_succeed = succeed,
			Effect_sync = sync,
			Effect_tap = core_tap,
			Effect_tapErrorCause = tapErrorCause,
			Effect_all = effect_all,
			Effect_unit = core_unit,
			runPromise = unsafeRunPromise(
				runtime_make(
					mjs_Context_empty(),
					defaultRuntimeFlags,
					FiberRefs_unsafeMake(new Map())
				)
			),
			Effect_withParallelismUnbounded = withParallelismUnbounded,
			Effect_zipLeft = core_zipLeft,
			Effect_zipRight = core_zipRight,
			external_rxjs_namespaceObject = rxjs,
			Schedule_fixed = fixed,
			lib = observer => value => {
				observer.next(value)
			}
		Promise.resolve(!1)
		Promise.resolve(!0)
		var PROMISE_RESOLVED_VOID = Promise.resolve()
		function util_sleep(time, resolveWith) {
			time || (time = 0)
			return new Promise(function (res) {
				return setTimeout(function () {
					return res(resolveWith)
				}, time)
			})
		}
		function randomToken() {
			return Math.random().toString(36).substring(2)
		}
		var lastMs = 0,
			additional = 0
		function microSeconds() {
			var ms = new Date().getTime()
			if (ms === lastMs) return 1e3 * ms + ++additional
			lastMs = ms
			additional = 0
			return 1e3 * ms
		}
		var NativeMethod = {
				create: function (channelName) {
					var state = {
						messagesCallback: null,
						bc: new BroadcastChannel(channelName),
						subFns: [],
					}
					state.bc.onmessage = function (msg) {
						state.messagesCallback && state.messagesCallback(msg.data)
					}
					return state
				},
				close: function (channelState) {
					channelState.bc.close()
					channelState.subFns = []
				},
				onMessage: function (channelState, fn) {
					channelState.messagesCallback = fn
				},
				postMessage: function (channelState, messageJson) {
					try {
						channelState.bc.postMessage(messageJson, !1)
						return PROMISE_RESOLVED_VOID
					} catch (err) {
						return Promise.reject(err)
					}
				},
				canBeUsed: function () {
					if ("undefined" == typeof window) return !1
					if ("function" == typeof BroadcastChannel) {
						if (BroadcastChannel._pubkey)
							throw new Error(
								"BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill"
							)
						return !0
					}
					return !1
				},
				type: "native",
				averageResponseTime: function () {
					return 150
				},
				microSeconds,
			},
			ObliviousSet = (function () {
				function ObliviousSet(ttl) {
					this.ttl = ttl
					this.map = new Map()
					this._to = !1
				}
				ObliviousSet.prototype.has = function (value) {
					return this.map.has(value)
				}
				ObliviousSet.prototype.add = function (value) {
					var _this = this
					this.map.set(value, now())
					if (!this._to) {
						this._to = !0
						setTimeout(function () {
							_this._to = !1
							!(function (obliviousSet) {
								for (
									var olderThen = now() - obliviousSet.ttl,
										iterator = obliviousSet.map[Symbol.iterator]();
									;

								) {
									var next = iterator.next().value
									if (!next) return
									var value = next[0]
									if (!(next[1] < olderThen)) return
									obliviousSet.map.delete(value)
								}
							})(_this)
						}, 0)
					}
				}
				ObliviousSet.prototype.clear = function () {
					this.map.clear()
				}
				return ObliviousSet
			})()
		function now() {
			return new Date().getTime()
		}
		function options_fillOptionsWithDefaults() {
			var originalOptions =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
				options = JSON.parse(JSON.stringify(originalOptions))
			void 0 === options.webWorkerSupport && (options.webWorkerSupport = !0)
			options.idb || (options.idb = {})
			options.idb.ttl || (options.idb.ttl = 45e3)
			options.idb.fallbackInterval || (options.idb.fallbackInterval = 150)
			originalOptions.idb &&
				"function" == typeof originalOptions.idb.onclose &&
				(options.idb.onclose = originalOptions.idb.onclose)
			options.localstorage || (options.localstorage = {})
			options.localstorage.removeTimeout ||
				(options.localstorage.removeTimeout = 6e4)
			originalOptions.methods && (options.methods = originalOptions.methods)
			options.node || (options.node = {})
			options.node.ttl || (options.node.ttl = 12e4)
			options.node.maxParallelWrites || (options.node.maxParallelWrites = 2048)
			void 0 === options.node.useFastPath && (options.node.useFastPath = !0)
			return options
		}
		var OBJECT_STORE_ID = "messages",
			TRANSACTION_SETTINGS = { durability: "relaxed" }
		function getIdb() {
			if ("undefined" != typeof indexedDB) return indexedDB
			if ("undefined" != typeof window) {
				if (void 0 !== window.mozIndexedDB) return window.mozIndexedDB
				if (void 0 !== window.webkitIndexedDB) return window.webkitIndexedDB
				if (void 0 !== window.msIndexedDB) return window.msIndexedDB
			}
			return !1
		}
		function commitIndexedDBTransaction(tx) {
			tx.commit && tx.commit()
		}
		function _readLoop(state) {
			state.closed ||
				readNewMessages(state)
					.then(function () {
						return util_sleep(state.options.idb.fallbackInterval)
					})
					.then(function () {
						return _readLoop(state)
					})
		}
		function readNewMessages(state) {
			return state.closed
				? PROMISE_RESOLVED_VOID
				: state.messagesCallback
				? (function (db, lastCursorId) {
						var tx = db.transaction(
								OBJECT_STORE_ID,
								"readonly",
								TRANSACTION_SETTINGS
							),
							objectStore = tx.objectStore(OBJECT_STORE_ID),
							ret = [],
							keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, 1 / 0)
						if (objectStore.getAll) {
							var getAllRequest = objectStore.getAll(keyRangeValue)
							return new Promise(function (res, rej) {
								getAllRequest.onerror = function (err) {
									return rej(err)
								}
								getAllRequest.onsuccess = function (e) {
									res(e.target.result)
								}
							})
						}
						return new Promise(function (res, rej) {
							var openCursorRequest = (function () {
								try {
									keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, 1 / 0)
									return objectStore.openCursor(keyRangeValue)
								} catch (e) {
									return objectStore.openCursor()
								}
							})()
							openCursorRequest.onerror = function (err) {
								return rej(err)
							}
							openCursorRequest.onsuccess = function (ev) {
								var cursor = ev.target.result
								if (cursor)
									if (cursor.value.id < lastCursorId + 1)
										cursor.continue(lastCursorId + 1)
									else {
										ret.push(cursor.value)
										cursor.continue()
									}
								else {
									commitIndexedDBTransaction(tx)
									res(ret)
								}
							}
						})
				  })(state.db, state.lastCursorId).then(function (newerMessages) {
						var useMessages = newerMessages
							.filter(function (msgObj) {
								return !!msgObj
							})
							.map(function (msgObj) {
								msgObj.id > state.lastCursorId &&
									(state.lastCursorId = msgObj.id)
								return msgObj
							})
							.filter(function (msgObj) {
								return (function (msgObj, state) {
									return !(
										msgObj.uuid === state.uuid ||
										state.eMIs.has(msgObj.id) ||
										msgObj.data.time < state.messagesCallbackTime
									)
								})(msgObj, state)
							})
							.sort(function (msgObjA, msgObjB) {
								return msgObjA.time - msgObjB.time
							})
						useMessages.forEach(function (msgObj) {
							if (state.messagesCallback) {
								state.eMIs.add(msgObj.id)
								state.messagesCallback(msgObj.data)
							}
						})
						return PROMISE_RESOLVED_VOID
				  })
				: PROMISE_RESOLVED_VOID
		}
		var IndexedDBMethod = {
			create: function (channelName, options) {
				options = options_fillOptionsWithDefaults(options)
				return (function (channelName) {
					var dbName = "pubkey.broadcast-channel-0-" + channelName,
						openRequest = getIdb().open(dbName)
					openRequest.onupgradeneeded = function (ev) {
						ev.target.result.createObjectStore(OBJECT_STORE_ID, {
							keyPath: "id",
							autoIncrement: !0,
						})
					}
					return new Promise(function (res, rej) {
						openRequest.onerror = function (ev) {
							return rej(ev)
						}
						openRequest.onsuccess = function () {
							res(openRequest.result)
						}
					})
				})(channelName).then(function (db) {
					var state = {
						closed: !1,
						lastCursorId: 0,
						channelName,
						options,
						uuid: randomToken(),
						eMIs: new ObliviousSet(2 * options.idb.ttl),
						writeBlockPromise: PROMISE_RESOLVED_VOID,
						messagesCallback: null,
						readQueuePromises: [],
						db,
					}
					db.onclose = function () {
						state.closed = !0
						options.idb.onclose && options.idb.onclose()
					}
					_readLoop(state)
					return state
				})
			},
			close: function (channelState) {
				channelState.closed = !0
				channelState.db.close()
			},
			onMessage: function (channelState, fn, time) {
				channelState.messagesCallbackTime = time
				channelState.messagesCallback = fn
				readNewMessages(channelState)
			},
			postMessage: function (channelState, messageJson) {
				channelState.writeBlockPromise = channelState.writeBlockPromise
					.then(function () {
						return (function (db, readerUuid, messageJson) {
							var writeObject = {
									uuid: readerUuid,
									time: new Date().getTime(),
									data: messageJson,
								},
								tx = db.transaction(
									[OBJECT_STORE_ID],
									"readwrite",
									TRANSACTION_SETTINGS
								)
							return new Promise(function (res, rej) {
								tx.oncomplete = function () {
									return res()
								}
								tx.onerror = function (ev) {
									return rej(ev)
								}
								tx.objectStore(OBJECT_STORE_ID).add(writeObject)
								commitIndexedDBTransaction(tx)
							})
						})(channelState.db, channelState.uuid, messageJson)
					})
					.then(function () {
						0 === Math.floor(11 * Math.random() + 0) &&
							(function (channelState) {
								return ((db = channelState.db),
								(ttl = channelState.options.idb.ttl),
								(olderThen = new Date().getTime() - ttl),
								(tx = db.transaction(
									OBJECT_STORE_ID,
									"readonly",
									TRANSACTION_SETTINGS
								)),
								(objectStore = tx.objectStore(OBJECT_STORE_ID)),
								(ret = []),
								new Promise(function (res) {
									objectStore.openCursor().onsuccess = function (ev) {
										var cursor = ev.target.result
										if (cursor) {
											var msgObk = cursor.value
											if (msgObk.time < olderThen) {
												ret.push(msgObk)
												cursor.continue()
											} else {
												commitIndexedDBTransaction(tx)
												res(ret)
											}
										} else res(ret)
									}
								})).then(function (tooOld) {
									return (function (channelState, ids) {
										if (channelState.closed) return Promise.resolve([])
										var objectStore = channelState.db
											.transaction(
												OBJECT_STORE_ID,
												"readwrite",
												TRANSACTION_SETTINGS
											)
											.objectStore(OBJECT_STORE_ID)
										return Promise.all(
											ids.map(function (id) {
												var deleteRequest = objectStore.delete(id)
												return new Promise(function (res) {
													deleteRequest.onsuccess = function () {
														return res()
													}
												})
											})
										)
									})(
										channelState,
										tooOld.map(function (msg) {
											return msg.id
										})
									)
								})
								var db, ttl, olderThen, tx, objectStore, ret
							})(channelState)
					})
				return channelState.writeBlockPromise
			},
			canBeUsed: function () {
				return !!getIdb()
			},
			type: "idb",
			averageResponseTime: function (options) {
				return 2 * options.idb.fallbackInterval
			},
			microSeconds,
		}
		function getLocalStorage() {
			var localStorage
			if ("undefined" == typeof window) return null
			try {
				localStorage = window.localStorage
				localStorage =
					window["ie8-eventlistener/storage"] || window.localStorage
			} catch (e) {}
			return localStorage
		}
		function storageKey(channelName) {
			return "pubkey.broadcastChannel-" + channelName
		}
		function localstorage_canBeUsed() {
			var ls = getLocalStorage()
			if (!ls) return !1
			try {
				var key = "__broadcastchannel_check"
				ls.setItem(key, "works")
				ls.removeItem(key)
			} catch (e) {
				return !1
			}
			return !0
		}
		var LocalstorageMethod = {
				create: function (channelName, options) {
					options = options_fillOptionsWithDefaults(options)
					if (!localstorage_canBeUsed())
						throw new Error("BroadcastChannel: localstorage cannot be used")
					var uuid = randomToken(),
						eMIs = new ObliviousSet(options.localstorage.removeTimeout),
						state = { channelName, uuid, eMIs }
					state.listener = (function (channelName, fn) {
						var key = storageKey(channelName),
							listener = function (ev) {
								ev.key === key &&
									(function (msgObj) {
										if (
											state.messagesCallback &&
											msgObj.uuid !== uuid &&
											msgObj.token &&
											!eMIs.has(msgObj.token) &&
											!(
												msgObj.data.time &&
												msgObj.data.time < state.messagesCallbackTime
											)
										) {
											eMIs.add(msgObj.token)
											state.messagesCallback(msgObj.data)
										}
									})(JSON.parse(ev.newValue))
							}
						window.addEventListener("storage", listener)
						return listener
					})(channelName)
					return state
				},
				close: function (channelState) {
					;(listener = channelState.listener),
						window.removeEventListener("storage", listener)
					var listener
				},
				onMessage: function (channelState, fn, time) {
					channelState.messagesCallbackTime = time
					channelState.messagesCallback = fn
				},
				postMessage: function (channelState, messageJson) {
					return new Promise(function (res) {
						util_sleep().then(function () {
							var key = storageKey(channelState.channelName),
								writeObj = {
									token: randomToken(),
									time: new Date().getTime(),
									data: messageJson,
									uuid: channelState.uuid,
								},
								value = JSON.stringify(writeObj)
							getLocalStorage().setItem(key, value)
							var ev = document.createEvent("Event")
							ev.initEvent("storage", !0, !0)
							ev.key = key
							ev.newValue = value
							window.dispatchEvent(ev)
							res()
						})
					})
				},
				canBeUsed: localstorage_canBeUsed,
				type: "localstorage",
				averageResponseTime: function () {
					var userAgent = navigator.userAgent.toLowerCase()
					return userAgent.includes("safari") && !userAgent.includes("chrome")
						? 240
						: 120
				},
				microSeconds,
			},
			simulate_microSeconds = microSeconds,
			SIMULATE_CHANNELS = new Set(),
			SimulateMethod = {
				create: function (channelName) {
					var state = { name: channelName, messagesCallback: null }
					SIMULATE_CHANNELS.add(state)
					return state
				},
				close: function (channelState) {
					SIMULATE_CHANNELS.delete(channelState)
				},
				onMessage: function (channelState, fn) {
					channelState.messagesCallback = fn
				},
				postMessage: function (channelState, messageJson) {
					return new Promise(function (res) {
						return setTimeout(function () {
							Array.from(SIMULATE_CHANNELS)
								.filter(function (channel) {
									return channel.name === channelState.name
								})
								.filter(function (channel) {
									return channel !== channelState
								})
								.filter(function (channel) {
									return !!channel.messagesCallback
								})
								.forEach(function (channel) {
									return channel.messagesCallback(messageJson)
								})
							res()
						}, 5)
					})
				},
				canBeUsed: function () {
					return !0
				},
				type: "simulate",
				averageResponseTime: function () {
					return 5
				},
				microSeconds: simulate_microSeconds,
			},
			METHODS = [NativeMethod, IndexedDBMethod, LocalstorageMethod],
			OPEN_BROADCAST_CHANNELS = new Set(),
			lastId = 0,
			broadcast_channel_BroadcastChannel = function (name, options) {
				this.id = lastId++
				OPEN_BROADCAST_CHANNELS.add(this)
				this.name = name
				this.options = options_fillOptionsWithDefaults(options)
				this.method = (function (options) {
					var chooseMethods = []
						.concat(options.methods, METHODS)
						.filter(Boolean)
					if (options.type) {
						if ("simulate" === options.type) return SimulateMethod
						var ret = chooseMethods.find(function (m) {
							return m.type === options.type
						})
						if (ret) return ret
						throw new Error("method-type " + options.type + " not found")
					}
					options.webWorkerSupport ||
						(chooseMethods = chooseMethods.filter(function (m) {
							return "idb" !== m.type
						}))
					var useMethod = chooseMethods.find(function (method) {
						return method.canBeUsed()
					})
					if (useMethod) return useMethod
					throw new Error(
						"No usable method found in " +
							JSON.stringify(
								METHODS.map(function (m) {
									return m.type
								})
							)
					)
				})(this.options)
				this._iL = !1
				this._onML = null
				this._addEL = { message: [], internal: [] }
				this._uMP = new Set()
				this._befC = []
				this._prepP = null
				!(function (channel) {
					var obj,
						maybePromise = channel.method.create(channel.name, channel.options)
					if ((obj = maybePromise) && "function" == typeof obj.then) {
						channel._prepP = maybePromise
						maybePromise.then(function (s) {
							channel._state = s
						})
					} else channel._state = maybePromise
				})(this)
			}
		broadcast_channel_BroadcastChannel._pubkey = !0
		broadcast_channel_BroadcastChannel.prototype = {
			postMessage: function (msg) {
				if (this.closed)
					throw new Error(
						"BroadcastChannel.postMessage(): Cannot post message after channel has closed " +
							JSON.stringify(msg)
					)
				return _post(this, "message", msg)
			},
			postInternal: function (msg) {
				return _post(this, "internal", msg)
			},
			set onmessage(fn) {
				var listenObj = { time: this.method.microSeconds(), fn }
				_removeListenerObject(this, "message", this._onML)
				if (fn && "function" == typeof fn) {
					this._onML = listenObj
					_addListenerObject(this, "message", listenObj)
				} else this._onML = null
			},
			addEventListener: function (type, fn) {
				_addListenerObject(this, type, { time: this.method.microSeconds(), fn })
			},
			removeEventListener: function (type, fn) {
				_removeListenerObject(
					this,
					type,
					this._addEL[type].find(function (obj) {
						return obj.fn === fn
					})
				)
			},
			close: function () {
				var _this = this
				if (!this.closed) {
					OPEN_BROADCAST_CHANNELS.delete(this)
					this.closed = !0
					var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID
					this._onML = null
					this._addEL.message = []
					return awaitPrepare
						.then(function () {
							return Promise.all(Array.from(_this._uMP))
						})
						.then(function () {
							return Promise.all(
								_this._befC.map(function (fn) {
									return fn()
								})
							)
						})
						.then(function () {
							return _this.method.close(_this._state)
						})
				}
			},
			get type() {
				return this.method.type
			},
			get isClosed() {
				return this.closed
			},
		}
		function _post(broadcastChannel, type, msg) {
			var msgObj = {
				time: broadcastChannel.method.microSeconds(),
				type,
				data: msg,
			}
			return (
				broadcastChannel._prepP
					? broadcastChannel._prepP
					: PROMISE_RESOLVED_VOID
			).then(function () {
				var sendPromise = broadcastChannel.method.postMessage(
					broadcastChannel._state,
					msgObj
				)
				broadcastChannel._uMP.add(sendPromise)
				sendPromise.catch().then(function () {
					return broadcastChannel._uMP.delete(sendPromise)
				})
				return sendPromise
			})
		}
		function _hasMessageListeners(channel) {
			return (
				channel._addEL.message.length > 0 || channel._addEL.internal.length > 0
			)
		}
		function _addListenerObject(channel, type, obj) {
			channel._addEL[type].push(obj)
			!(function (channel) {
				if (!channel._iL && _hasMessageListeners(channel)) {
					var listenerFn = function (msgObj) {
							channel._addEL[msgObj.type].forEach(function (listenerObject) {
								var minMessageTime = listenerObject.time - 1e5
								msgObj.time >= minMessageTime && listenerObject.fn(msgObj.data)
							})
						},
						time = channel.method.microSeconds()
					if (channel._prepP)
						channel._prepP.then(function () {
							channel._iL = !0
							channel.method.onMessage(channel._state, listenerFn, time)
						})
					else {
						channel._iL = !0
						channel.method.onMessage(channel._state, listenerFn, time)
					}
				}
			})(channel)
		}
		function _removeListenerObject(channel, type, obj) {
			channel._addEL[type] = channel._addEL[type].filter(function (o) {
				return o !== obj
			})
			!(function (channel) {
				if (channel._iL && !_hasMessageListeners(channel)) {
					channel._iL = !1
					var time = channel.method.microSeconds()
					channel.method.onMessage(channel._state, null, time)
				}
			})(channel)
		}
		Object.prototype.toString.call("undefined" != typeof process ? process : 0),
			new Set()
		const external_DeepDiff_namespaceObject = DeepDiff
		var fast_deep_equal = __webpack_require__(204),
			fast_deep_equal_default = __webpack_require__.n(fast_deep_equal)
		const mapObject = f => o =>
				pipe(Object.entries(o), ReadonlyArray_map(f), Object.fromEntries),
			makePageState = mapObject(([k, v]) => [
				k,
				{ ele: Option_none(), read: v },
			]),
			removeOldChats = mainState => maxChatCount =>
				pipe(
					Effect_sync(() =>
						mainState.flowChats.sort((a, b) =>
							a.animationEnded === b.animationEnded
								? 0
								: a.animationEnded
								? -1
								: 1
						)
					),
					Effect_zipRight(
						Effect_sync(() =>
							mainState.flowChats.splice(
								0,
								Math.max(0, mainState.flowChats.length - maxChatCount)
							)
						)
					),
					Effect_flatMap(
						Effect_forEach(x =>
							pipe(
								Effect_logDebug("RemoveChat"),
								Effect_zipRight(
									Effect_sync(() => {
										x.element.remove()
									})
								)
							)
						)
					)
				),
			external_m_namespaceObject = m
		var external_m_default = __webpack_require__.n(external_m_namespaceObject)
		const getChatFontSize = mainState =>
				Math.round(
					((Math.max(mainState.config.fontSize - 0.2, 0.01) *
						mainState.playerRect.height) /
						mainState.config.laneCount) *
						(mainState.config.flowY2 - mainState.config.flowY1) *
						100
				) / 100,
			textShadow = shadowColor =>
				flow(
					x => `${x}px`,
					x => (a, b) => `${a}${x} ${b}${x} ${shadowColor}99`,
					x => join(", ")([x("-", "-"), x("", "-"), x("-", ""), x("", "")])
				),
			textStyle = { fontFamily: "inherit" },
			renderChat = chat => mainState =>
				Effect_sync(() =>
					external_m_default().render(
						chat.element,
						((chat, mainState) =>
							pipe(
								mainState.config,
								config => ({ data: chat.getData(config), config }),
								({ data, config }) =>
									external_m_default()(
										"span",
										{
											style: {
												fontSize: `${getChatFontSize(mainState)}px`,
												visibility: config.displayChats ? "visible" : "hidden",
												color:
													"owner" === data.authorType
														? config.ownerColor
														: "moderator" === data.authorType
														? config.moderatorColor
														: "member" === data.authorType
														? config.memberColor
														: config.color,
												fontWeight: config.fontWeight.toString(),
												fontFamily: config.font,
												opacity: config.chatOpacity.toString(),
												textShadow: textShadow(config.shadowColor)(
													config.shadowFontWeight
												),
											},
										},
										pipe(
											[
												pipe(
													data.authorName,
													Option_filter(x => x.visible),
													Option_map(x =>
														external_m_default()(
															"span",
															{
																style: {
																	color: getOrUndefined(data.textColor),
																	fontSize: "0.84em",
																	...textStyle,
																},
															},
															`${x.content}: `
														)
													)
												),
												pipe(
													data.messageElement,
													Option_map(x =>
														((message, config) => {
															const eleWin =
																	message.ownerDocument.defaultView ?? window,
																{ maxChatLength } = config
															return pipe(
																Array.from(message.childNodes),
																ReadonlyArray_reduce(
																	{ vnodes: [], length: 0 },
																	({ vnodes, length }, node) =>
																		length >= maxChatLength
																			? { vnodes, length }
																			: !config.textOnly &&
																			  node instanceof eleWin.HTMLImageElement
																			? {
																					vnodes: [
																						...vnodes,
																						external_m_default()("img", {
																							style: {
																								height: "1em",
																								width: "1em",
																								verticalAlign: "text-top",
																							},
																							src: node.src.replace(
																								/=w\d+-h\d+-c-k-nd$/,
																								""
																							),
																							alt: node.alt,
																						}),
																					],
																					length: length + 1,
																			  }
																			: pipe(
																					node.textContent ?? "",
																					slice(0, maxChatLength),
																					x =>
																						node instanceof
																						eleWin.HTMLAnchorElement
																							? {
																									vnodes: [
																										...vnodes,
																										external_m_default()(
																											"span",
																											{
																												style: {
																													fontSize: "0.84em",
																													textDecoration:
																														"underline",
																													...textStyle,
																												},
																											},
																											x
																										),
																									],
																									length: length + x.length,
																							  }
																							: {
																									vnodes: [
																										...vnodes,
																										external_m_default().fragment(
																											{},
																											x
																										),
																									],
																									length: length + x.length,
																							  }
																			  )
																)
															)
														})(x, config)
													),
													Option_map(x =>
														external_m_default()(
															"span",
															{
																style: {
																	color: getOrUndefined(data.textColor),
																	...textStyle,
																},
															},
															x.vnodes
														)
													)
												),
												pipe(
													data.paymentInfo,
													Option_filter(x => x.visible),
													Option_map(x =>
														external_m_default()(
															"span",
															{
																style: {
																	color: getOrUndefined(data.paidColor),
																	fontSize: "0.84em",
																	...textStyle,
																},
															},
															external_m_default()(
																"strong",
																{ style: textStyle },
																x.content
															)
														)
													)
												),
											],
											ReadonlyArray_compact
										)
									)
							))(chat, mainState)
					)
				),
			Bicovariant_mapLeft = F =>
				Function_dual(2, (self, f) => F.bimap(self, f, Function_identity)),
			Bicovariant_map = F =>
				Function_dual(2, (self, f) => F.bimap(self, Function_identity, f)),
			getFirst = self => self[0],
			getSecond = self => self[1],
			Tuple_bimap = Function_dual(3, (self, f, g) => [f(self[0]), g(self[1])]),
			Tuple_Bicovariant = { bimap: Tuple_bimap },
			mapFirst = Bicovariant_mapLeft(Tuple_Bicovariant),
			mapSecond = Bicovariant_map(Tuple_Bicovariant),
			external_window_hash_it_namespaceObject = window["hash-it"]
		var external_window_hash_it_default = __webpack_require__.n(
			external_window_hash_it_namespaceObject
		)
		const external_window_micro_memoize_namespaceObject =
			window["micro-memoize"]
		var external_window_micro_memoize_default = __webpack_require__.n(
			external_window_micro_memoize_namespaceObject
		)
		const getFlowChatProgress = chat =>
				pipe(
					chat.animation,
					flatMapNullable(x => x.currentTime),
					getOrElse(() => 0),
					x =>
						("number" == typeof x ? x : x.to("ms").value) /
						chat.animationDuration
				),
			getFlowChatRect = (chat, mainState) =>
				pipe(
					mainState.config,
					x =>
						mainState.playerRect.width * x.flowX2 -
						(chat.width + mainState.playerRect.width * (x.flowX2 - x.flowX1)) *
							getFlowChatProgress(chat),
					x => new DOMRect(x, chat.y, chat.width, chat.height)
				),
			getChatLane = (flowChat, progress) => mainState => {
				const flowWidth =
						mainState.playerRect.width *
						(mainState.config.flowX2 - mainState.config.flowX1),
					chatRect = getFlowChatRect(flowChat, mainState),
					chatWidth = chatRect.width,
					chatHeight = chatRect.height,
					chatX = chatRect.x,
					{ flowChats } = mainState,
					chatIndex = flowChats.indexOf(flowChat),
					movingChats = pipe(
						flowChats,
						take(chatIndex >= 0 ? chatIndex : flowChats.length),
						ReadonlyArray_filter(
							chat => !chat.animationEnded && chat.width > 0
						),
						sort(Order_contramap(x => x.lane)(Order))
					),
					tooCloseTo = external_window_micro_memoize_default()(
						x => {
							const otherRect = getFlowChatRect(x, mainState),
								otherWidth = otherRect.width,
								otherX = otherRect.x,
								gap =
									(chatHeight * otherWidth * chatWidth) ** 0.333 *
									mainState.config.minSpacing
							return (
								(flowWidth - otherX) / (flowWidth + otherWidth) - progress <
									(chatWidth + gap) / (flowWidth + chatWidth) ||
								otherX + otherWidth + gap > chatX
							)
						},
						{ maxSize: 1e3 }
					),
					occupyInfo = pipe(
						movingChats,
						ReadonlyArray_map(x => ({
							tooClose: () => tooCloseTo(x),
							lane: x.lane,
						})),
						append({ tooClose: () => !0, lane: mainState.config.laneCount })
					),
					index = occupyInfo.findIndex(x => x.lane >= flowChat.lane),
					bottomFreeLane = pipe(
						occupyInfo.slice(index),
						findFirst(x => x.tooClose()),
						Option_map(x => x.lane),
						getOrElse(() => mainState.config.laneCount)
					),
					topFreeLane = pipe(
						occupyInfo.slice(0, index),
						findLast(x => x.tooClose()),
						Option_map(x => x.lane),
						getOrElse(() => -1)
					),
					formerLaneInterval = Math.min(
						flowChat.lane - topFreeLane,
						bottomFreeLane - flowChat.lane,
						1
					)
				return pipe(
					occupyInfo,
					ReadonlyArray_reduce(
						{ maxInterval: 0, maxIntervalLane: 0, lastLane: -1 },
						({ maxInterval, maxIntervalLane, lastLane }, info) =>
							maxInterval > 0.999 || !info.tooClose()
								? { maxInterval, maxIntervalLane, lastLane }
								: (() => {
										const nextLane = info.lane,
											interLane = Math.min(
												Math.max((lastLane + nextLane) / 2, 0),
												mainState.config.laneCount - 1
											),
											newInterval = Math.min(
												interLane - lastLane,
												nextLane - interLane,
												1
											)
										return newInterval - maxInterval > 0.001
											? {
													maxInterval: newInterval,
													maxIntervalLane: Math.max(lastLane + newInterval, 0),
													lastLane: nextLane,
											  }
											: { maxInterval, maxIntervalLane, lastLane: nextLane }
								  })()
					),
					x => ({
						lane:
							Math.abs(formerLaneInterval - x.maxInterval) < 0.001
								? flowChat.lane
								: x.maxIntervalLane,
						interval: x.maxInterval,
					})
				)
			},
			getLaneY = (lane, mainState) =>
				mainState.playerRect.height *
				((lane / mainState.config.laneCount + 0.005) *
					(mainState.config.flowY2 - mainState.config.flowY1) +
					mainState.config.flowY1),
			intervalTooSmall = interval => config =>
				config.noOverlap && interval < 0.999,
			setChatPlayState = chat => mainState =>
				pipe(
					chat,
					liftPredicate(x => !x.animationEnded),
					Effect_map(x => x.animation),
					Effect_flatMap(Function_identity),
					Effect_tap(x =>
						Effect_sync(
							mainState.chatPlaying ? () => x.play() : () => x.pause()
						)
					),
					Effect_flatMap(x =>
						Effect_sync(() => {
							x.playbackRate = mainState.config.flowSpeed / 15
						})
					),
					Effect_ignore
				),
			getWidth = external_window_micro_memoize_default()(
				ele => ele?.getBoundingClientRect().width ?? 0,
				{
					maxSize: 2e3,
					transformKey: ReadonlyArray_map(external_window_hash_it_default()),
				}
			),
			setChatAnimation = chat => mainState =>
				pipe(
					{ fontSize: getChatFontSize(mainState) },
					Effect_succeed,
					Effect_tap(x =>
						Effect_sync(() => {
							chat.element.style.transform = `translate(${
								mainState.playerRect.width *
								(mainState.config.flowX2 - mainState.config.flowX1)
							}px, -${2 * x.fontSize}px)`
						})
					),
					Effect_filterOrFail(() => !chat.animationEnded, Option_none),
					Effect_tap(x =>
						Effect_sync(() => {
							chat.animationDuration = 6400
							chat.width = getWidth(chat.element.firstElementChild)
							chat.height = x.fontSize
						})
					),
					Effect_map(() => getFlowChatProgress(chat)),
					Effect_map(progress => ({
						progress,
						...getChatLane(chat, progress)(mainState),
					})),
					Effect_filterOrElse(
						x => !intervalTooSmall(x.interval)(mainState.config),
						() =>
							pipe(
								chat.animation,
								Effect_flatMap(x =>
									Effect_sync(() => {
										x.finish()
										chat.animation = Option_none()
									})
								),
								Effect_zipRight(Effect_fail(Option_none()))
							)
					),
					Effect_tap(x =>
						Effect_sync(() => {
							chat.lane = x.lane
						})
					),
					Effect_map(x => ({ ...x, laneY: getLaneY(chat.lane, mainState) })),
					Effect_tap(ctx =>
						pipe(
							[
								pipe(
									chat.animation,
									Effect_flatMap(x => Effect_sync(() => x.cancel())),
									Effect_ignore
								),
								pipe(
									[
										[
											mainState.playerRect.width *
												(mainState.config.flowX2 - mainState.config.flowX1),
											ctx.laneY,
										],
										[-chat.width, ctx.laneY],
									],
									ReadonlyArray_map(
										pipe(
											x => `${x}px`,
											x => Tuple_bimap(x, x)
										)
									),
									ReadonlyArray_map(([x, y]) => `translate(${x}, ${y})`),
									ReadonlyArray_bindTo("transform"),
									x =>
										Effect_sync(() =>
											chat.element.animate(x, {
												duration: 6400,
												easing: mainState.config.timingFunction,
											})
										),
									Effect_tap(x =>
										Effect_sync(() => {
											x.onfinish = () => {
												chat.animationEnded = !0
											}
											chat.y = ctx.laneY
											const newTime = 6400 * ctx.progress
											x.currentTime = newTime
										})
									),
									Effect_flatMap(x =>
										Effect_sync(() => {
											chat.animation = Option_some(x)
										})
									),
									Effect_zipRight(setChatPlayState(chat)(mainState))
								),
							],
							x => Effect_all(x)
						)
					),
					Effect_isSuccess
				),
			tapEffect = f =>
				(0, external_rxjs_namespaceObject.concatMap)(x =>
					(0, external_rxjs_namespaceObject.from)(runPromise(f(x))).pipe(
						(0, external_rxjs_namespaceObject.map)(() => x)
					)
				),
			configStream = (provideLog, mainState, co, chatScreen, live) =>
				(0, external_rxjs_namespaceObject.defer)(() =>
					(0, external_rxjs_namespaceObject.merge)(
						(0, external_rxjs_namespaceObject.merge)(
							co.bannedWordRegexes,
							co.bannedWords,
							co.bannedUsers
						),
						pipe(
							co.fieldScale,
							(0, external_rxjs_namespaceObject.startWith)(
								mainState.config.fieldScale
							),
							(0, external_rxjs_namespaceObject.map)(
								(
									live => scale =>
										pipe(
											live.chatField.ele,
											Effect_flatMap(field =>
												pipe(
													[
														pipe(
															fromNullable(field.parentElement),
															Option_map(x =>
																Effect_sync(() =>
																	Object.assign(x.style, {
																		transformOrigin:
																			(scale >= 1 ? "top" : "bottom") + " left",
																		transform: `scale(${scale})`,
																		width: 100 / scale + "%",
																		height: 100 / scale + "%",
																	})
																)
															)
														),
														pipe(
															live.chatScroller.ele,
															Option_map(scroller =>
																Effect_sync(() => {
																	scroller.scrollTop = scroller.scrollHeight
																})
															)
														),
													],
													ReadonlyArray_compact,
													x => Effect_all(x)
												)
											),
											Effect_ignore
										)
								)(live)
							),
							tapEffect(provideLog)
						),
						pipe(
							(0, external_rxjs_namespaceObject.merge)(
								pipe(
									(0, external_rxjs_namespaceObject.merge)(
										co.font,
										co.fontSize,
										co.fontWeight,
										co.laneCount,
										co.minSpacing,
										co.flowY1,
										co.flowY2,
										pipe(
											co.flowX1,
											(0, external_rxjs_namespaceObject.startWith)(
												mainState.config.flowX1
											),
											tapEffect(x =>
												provideLog(
													Effect_sync(() =>
														Object.assign(chatScreen.style, {
															left: 100 * x + "%",
															width: 100 * (mainState.config.flowX2 - x) + "%",
														})
													)
												)
											)
										),
										pipe(
											co.flowX2,
											tapEffect(x =>
												provideLog(
													Effect_sync(() =>
														Object.assign(chatScreen.style, {
															left: 100 * mainState.config.flowX1 + "%",
															width: 100 * (x - mainState.config.flowX1) + "%",
														})
													)
												)
											)
										),
										co.textOnly
									),
									(0, external_rxjs_namespaceObject.map)(() => ({
										render: !0,
										setAnimation: !0,
									}))
								),
								pipe(
									(0, external_rxjs_namespaceObject.merge)(
										co.color,
										co.ownerColor,
										co.moderatorColor,
										co.memberColor,
										co.shadowColor,
										co.chatOpacity,
										co.shadowFontWeight,
										co.displayChats
									),
									(0, external_rxjs_namespaceObject.map)(() => ({ render: !0 }))
								),
								pipe(
									co.flowSpeed,
									(0, external_rxjs_namespaceObject.map)(() => ({
										setPlayState: !0,
									}))
								),
								pipe(
									(0, external_rxjs_namespaceObject.merge)(
										pipe(
											co.maxChatCount,
											(0, external_rxjs_namespaceObject.map)(
												removeOldChats(mainState)
											),
											tapEffect(provideLog)
										),
										co.noOverlap,
										co.timingFunction
									),
									(0, external_rxjs_namespaceObject.map)(() => ({
										setAnimation: !0,
									}))
								)
							),
							(0, external_rxjs_namespaceObject.throttleTime)(180, void 0, {
								leading: !0,
								trailing: !0,
							}),
							(0, external_rxjs_namespaceObject.map)(x => ({
								render: !1,
								setAnimation: !1,
								setPlayState: !1,
								...x,
							})),
							tapEffect(c =>
								provideLog(
									pipe(
										mainState.flowChats,
										ReadonlyArray_filter(x => !x.animationEnded),
										ReadonlyArray_map(chat =>
											pipe(
												[
													pipe(
														renderChat(chat),
														liftPredicate(() => c.render)
													),
													c.setAnimation
														? Option_some(setChatAnimation(chat))
														: c.setPlayState
														? Option_some(setChatPlayState(chat))
														: Option_none(),
												],
												ReadonlyArray_compact,
												ReadonlyArray_map(apply(mainState)),
												x => Effect_all(x)
											)
										),
										x => Effect_all(x),
										Effect_asUnit
									)
								)
							)
						),
						co.lang,
						co.maxChatLength,
						co.simplifyChatField,
						co.createBanButton,
						co.createChats,
						co.displayModName,
						co.displaySuperChatAuthor,
						co.fieldScale
					)
				),
			external_jsep_namespaceObject = jsep
		var external_jsep_default = __webpack_require__.n(
				external_jsep_namespaceObject
			),
			u = {
				"||": function (r, e) {
					return r || e
				},
				"&&": function (r, e) {
					return r && e
				},
				"|": function (r, e) {
					return r | e
				},
				"^": function (r, e) {
					return r ^ e
				},
				"&": function (r, e) {
					return r & e
				},
				"==": function (r, e) {
					return r == e
				},
				"!=": function (r, e) {
					return r != e
				},
				"===": function (r, e) {
					return r === e
				},
				"!==": function (r, e) {
					return r !== e
				},
				"<": function (r, e) {
					return r < e
				},
				">": function (r, e) {
					return r > e
				},
				"<=": function (r, e) {
					return r <= e
				},
				">=": function (r, e) {
					return r >= e
				},
				"<<": function (r, e) {
					return r << e
				},
				">>": function (r, e) {
					return r >> e
				},
				">>>": function (r, e) {
					return r >>> e
				},
				"+": function (r, e) {
					return r + e
				},
				"-": function (r, e) {
					return r - e
				},
				"*": function (r, e) {
					return r * e
				},
				"/": function (r, e) {
					return r / e
				},
				"%": function (r, e) {
					return r % e
				},
			},
			i = {
				"-": function (r) {
					return -r
				},
				"+": function (r) {
					return +r
				},
				"~": function (r) {
					return ~r
				},
				"!": function (r) {
					return !r
				},
			}
		function s(r, e) {
			return r.map(function (r) {
				return a(r, e)
			})
		}
		function c(r, e) {
			var n,
				t = a(r.object, e)
			if (
				((n = r.computed ? a(r.property, e) : r.property.name),
				/^__proto__|prototype|constructor$/.test(n))
			)
				throw Error('Access to member "' + n + '" disallowed.')
			return [t, t[n]]
		}
		function a(r, e) {
			var n = r
			switch (n.type) {
				case "ArrayExpression":
					return s(n.elements, e)
				case "BinaryExpression":
					return u[n.operator](a(n.left, e), a(n.right, e))
				case "CallExpression":
					var t, o, l
					if (
						("MemberExpression" === n.callee.type
							? ((t = (l = c(n.callee, e))[0]), (o = l[1]))
							: (o = a(n.callee, e)),
						"function" != typeof o)
					)
						return
					return o.apply(t, s(n.arguments, e))
				case "ConditionalExpression":
					return a(n.test, e) ? a(n.consequent, e) : a(n.alternate, e)
				case "Identifier":
					return e[n.name]
				case "Literal":
					return n.value
				case "LogicalExpression":
					return "||" === n.operator
						? a(n.left, e) || a(n.right, e)
						: "&&" === n.operator
						? a(n.left, e) && a(n.right, e)
						: u[n.operator](a(n.left, e), a(n.right, e))
				case "MemberExpression":
					return c(n, e)[1]
				case "ThisExpression":
					return e
				case "UnaryExpression":
					return i[n.operator](a(n.argument, e))
				default:
					return
			}
		}
		const defaultFilter = config =>
				external_jsep_default()(
					`\nor([\nRA.some(\n  flip(flow([inText, RA.some]))(${JSON.stringify(
						config.bannedWords
					)})\n)(RA.compact([\n  messageText,\n  paymentInfo\n])),\nRA.some(\n  flip(flow([matchedByText, RA.some]))(${JSON.stringify(
						config.bannedWordRegexes
					)})\n)(RA.compact([\n  messageText,\n  paymentInfo\n])),\nO.exists(\n  flip(flow([eqText, RA.some]))(${JSON.stringify(
						config.bannedUsers
					)})\n)(authorID)\n])\n`
				),
			Chainable_bind = F =>
				Function_dual(3, (self, name, f) =>
					F.flatMap(self, a =>
						F.map(f(a), b => Object.assign({}, a, { [name]: b }))
					)
				),
			Identity_map = Function_dual(2, (self, f) => f(self)),
			Identity_imap = imap(Identity_map),
			Identity_Covariant = { imap: Identity_imap, map: Identity_map },
			Identity_Invariant = { imap: Identity_imap },
			Identity_Chainable = {
				imap: Identity_imap,
				map: Identity_map,
				flatMap: Function_dual(2, (self, f) => f(self)),
			},
			Identity_bindTo = Invariant_bindTo(Identity_Invariant),
			Identity_let_ = let_(Identity_Covariant),
			Identity_bind = Chainable_bind(Identity_Chainable),
			Identity_letDiscard = letDiscard(Identity_Chainable),
			external_astring_namespaceObject = astring,
			fycKey = key => `FYC_${key}`,
			languages = ["FYC_EN", "FYC_JA"],
			stringsArgs = [
				[],
				flow(split(/\r\n|\n/), ReadonlyArray_filter(not(isEmpty))),
				join("\n"),
			],
			sc = (k, d) => {
				return (
					(key = fycKey(k)),
					(defaultValue = d),
					{
						gmKey: key,
						getValue: Effect_promise(
							async () => await GM.getValue(key, defaultValue)
						),
						defaultValue,
						toGm: Function_identity,
					}
				)
				var key, defaultValue
			},
			ic = (k, d, c, g) => {
				return (
					(key = fycKey(k)),
					(toConfig = c),
					pipe(
						{ gmKey: key, defaultValue: (defaultValue = d), toGm: g },
						Identity_letDiscard(
							"getValue",
							pipe(
								Effect_promise(() => GM.getValue(key)),
								Effect_map(x => (void 0 !== x ? toConfig(x) : defaultValue))
							)
						)
					)
				)
				var key, defaultValue, toConfig
			},
			src_defaultGMConfig = pipe(
				{
					lang: ic(
						"LANG",
						"FYC_EN",
						x => (languages.includes(x) ? x : "FYC_EN"),
						x => x
					),
					font: sc("FONT", "MS PGothic"),
					chatOpacity: sc("OPACITY", 0.8),
					color: sc("COLOR", "#ffffff"),
					ownerColor: sc("COLOR_OWNER", "#ffd600"),
					moderatorColor: sc("COLOR_MODERATOR", "#c564ff"),
					memberColor: sc("COLOR_MEMBER", "#9fffff"),
					fontSize: sc("SIZE", 1),
					fontWeight: sc("WEIGHT", 730),
					shadowFontWeight: sc("WEIGHT_SHADOW", 1),
					maxChatCount: sc("LIMIT", 40),
					flowSpeed: sc("SPEED", 18),
					maxChatLength: sc("MAX", 100),
					laneCount: sc("LANE_DIV", 12),
					bannedWords: ic("NG_WORDS", ...stringsArgs),
					bannedWordRegexes: ic("NG_REG_WORDS", ...stringsArgs),
					bannedUsers: ic("NG_USERS", ...stringsArgs),
					createChats: sc("TOGGLE_CREATE_COMMENTS", !0),
					noOverlap: sc("NO_OVERLAP", !0),
					createBanButton: sc("NG_BUTTON", !0),
					simplifyChatField: sc("SIMPLE_CHAT_FIELD", !1),
					displayModName: sc("DISPLAY_MODERATOR_NAME", !0),
					displaySuperChatAuthor: sc("DISPLAY_SUPER_CHAT_AUTHOR", !0),
					textOnly: sc("TEXT_ONLY", !1),
					timingFunction: sc("TIMING_FUNCTION", "linear"),
					displayChats: sc("DISPLAY_COMMENTS", !0),
					minSpacing: sc("MIN_SPACING", 0.5),
					fieldScale: sc("FIELD_SCALE", 1),
					flowY1: sc("flowY1", 0),
					flowY2: sc("flowY2", 1),
					flowX1: sc("flowX1", 0),
					flowX2: sc("flowX2", 1),
					shadowColor: sc("shadowColor", "#000000"),
					logEvents: sc("logEvents", !0),
				},
				Identity_bind("filterExp", x =>
					ic(
						"filterExp",
						external_jsep_default()(
							`\n  or([\n  RA.some(\n    flip(flow([inText, RA.some]))(${JSON.stringify(
								x.bannedWords.defaultValue
							)})\n  )(RA.compact([\n    messageText,\n    paymentInfo\n  ])),\n  RA.some(\n    flip(flow([matchedByText, RA.some]))(${JSON.stringify(
								x.bannedWordRegexes.defaultValue
							)})\n  )(RA.compact([\n    messageText,\n    paymentInfo\n  ])),\n  O.exists(\n    flip(flow([eqText, RA.some]))(${JSON.stringify(
								x.bannedUsers.defaultValue
							)})\n  )(authorID)\n  ])\n        `
						),
						external_jsep_default(),
						external_astring_namespaceObject.generate
					)
				)
			),
			src_listeningBroadcastConfigKeys = [
				"lang",
				"bannedWords",
				"bannedWordRegexes",
				"bannedUsers",
				"filterExp",
				"simplifyChatField",
				"createBanButton",
				"fieldScale",
			],
			chatApp = pipe(
				Effect_sync(() => document.querySelector("#chatframe")),
				Effect_flatMap(
					flow(
						fromNullable,
						Option_filter(
							flow(
								x => x.contentDocument?.readyState,
								x => "loading" === x || "complete" === x
							)
						),
						flatMapNullable(x => x.contentDocument),
						orElse(() => Option_some(document)),
						flatMapNullable(x => x.querySelector("yt-live-chat-app"))
					)
				)
			),
			livePageYt = {
				toggleChatBtnParent: pipe(
					Effect_sync(() => document.querySelector(".ytp-right-controls")),
					Effect_flatMap(fromNullable)
				),
				settingsToggleNextElement: pipe(
					Effect_sync(() => document.querySelector("#menu-container")),
					Effect_flatMap(
						flow(
							fromNullable,
							Option_filter(x => null !== x.offsetParent),
							flatMapNullable(x =>
								x.querySelector(".dropdown-trigger.ytd-menu-renderer")
							),
							orElse(() =>
								fromNullable(
									document.querySelector(
										"#top-row .dropdown-trigger.ytd-menu-renderer"
									)
								)
							)
						)
					)
				),
				settingsContainer: pipe(
					Effect_sync(() => document.body),
					Effect_flatMap(fromNullable)
				),
				player: pipe(
					Effect_sync(() => document.querySelector("#movie_player")),
					Effect_flatMap(fromNullable)
				),
				video: pipe(
					Effect_sync(() =>
						document.querySelector("video.video-stream.html5-main-video")
					),
					Effect_flatMap(fromNullable)
				),
				chatField: pipe(
					chatApp,
					Effect_flatMap(
						flow(
							x => x.querySelector("#items.yt-live-chat-item-list-renderer"),
							fromNullable
						)
					)
				),
				chatTicker: pipe(
					chatApp,
					Effect_flatMap(
						flow(
							x => x.querySelector("#items.yt-live-chat-ticker-renderer"),
							fromNullable
						)
					)
				),
				chatScroller: pipe(
					chatApp,
					Effect_flatMap(
						flow(
							x =>
								x.querySelector(
									"#item-scroller.yt-live-chat-item-list-renderer"
								),
							fromNullable
						)
					)
				),
				offlineSlate: pipe(
					Effect_sync(() => document.querySelector(".ytp-offline-slate")),
					Effect_flatMap(fromNullable)
				),
			},
			FiberRef_locally = fiberRefLocally,
			logMeta = fiberRefUnsafeMake(Option_none()),
			logWithMeta = level => message => data =>
				pipe(
					Effect_log(message),
					FiberRef_locally(logMeta, Option_some(data)),
					x => locally(level)(x)
				),
			mainCss = pipe(
				Effect_sync(() => document.createElement("style")),
				Effect_tap(x =>
					Effect_sync(() => {
						x.innerHTML =
							".fyc_chat {\n  line-height: 1;\n  z-index: 30;\n  position: absolute;\n  user-select: none;\n  white-space: nowrap;\n  will-change: transform;\n}\n.fyc_button {\n  display: inline-block;\n  border-style: none;\n  z-index: 4;\n  font-weight: 500;\n  color: var(--yt-spec-text-secondary);\n}"
					})
				)
			),
			makeChatScreen = pipe(
				Effect_sync(() => document.createElement("div")),
				Effect_tap(x =>
					Effect_sync(() =>
						Object.assign(x.style, {
							pointerEvents: "none",
							zIndex: "30",
							position: "absolute",
							overflow: "hidden",
							height: "100%",
							width: "100%",
						})
					)
				)
			),
			observePair = con =>
				pipe(
					Effect_Do(),
					Effect_bindDiscard(
						"subject",
						Effect_sync(() => new external_rxjs_namespaceObject.Subject())
					),
					Effect_bind("observer", x =>
						Effect_sync(() => new con(lib(x.subject)))
					)
				),
			emptyElement = document.createElement("span"),
			appendChatMessage = flip(chat =>
				Effect_flatMap(x =>
					Effect_sync(() => chat.querySelector("#content #message")?.append(x))
				)
			),
			external_Swal_namespaceObject = Swal
		var external_Swal_default = __webpack_require__.n(
			external_Swal_namespaceObject
		)
		const defaultToast = external_Swal_default().mixin({
				toast: !0,
				position: "bottom-left",
				timer: 2500,
				timerProgressBar: !0,
				showConfirmButton: !1,
				didOpen: toast => {
					toast.addEventListener(
						"pointerenter",
						external_Swal_default().stopTimer
					)
					toast.addEventListener(
						"pointerleave",
						external_Swal_default().resumeTimer
					)
				},
			}),
			template = runPromise(
				pipe(
					document.createElement("button"),
					Effect_succeed,
					Effect_tap(x =>
						Effect_sync(() =>
							x.classList.add("style-scope", "yt-icon-button", "fyc_button")
						)
					),
					Effect_tap(x =>
						Effect_sync(() =>
							Object.assign(x.style, {
								padding: "0px",
								width: "20px",
								height: "20px",
								fill: "#fff",
							})
						)
					),
					Effect_tap(x =>
						Effect_sync(() =>
							x.setAttribute("aria-label", "NGに入れる(Ban this user)")
						)
					),
					Effect_tap(x =>
						Effect_sync(() => {
							x.innerHTML =
								'<svg class="style-scope yt-icon" style="width: 100%; height: 75%; fill: var(--yt-spec-text-secondary);" viewBox="0 0 512 512"><path d="M440 78A256 256 0 1 0 73 435 256 256 0 0 0 440 78zm-99 35L113 341C37 179 212 44 341 113zM177 405l228-228c76 162-99 297-228 228z" fill-rule="evenodd"/></svg>'
						})
					)
				)
			),
			filter_filterOperators = {
				flip,
				flow: fns => flow(...fns),
				and: Monoid_booleanEvery.combineAll,
				or: Monoid_booleanSome.combineAll,
				RA: { some: ReadonlyArray_some, compact: ReadonlyArray_compact },
				O: { exists },
				inText: text => x => includes(x)(text.content),
				eqText: text => x => text.content === x,
				matchedByText: text => x => Boolean(text.content.match(RegExp(x, "u"))),
				isVisible: x => x.visible,
			}
		var typed_assert_build = __webpack_require__(52)
		const tapNonNull = (x, message) => {
				typed_assert_build.Xd(x, message)
				return x
			},
			parseChat = chat => {
				const chatType = chat.querySelector(
						".yt-live-chat-ticker-paid-message-item-renderer"
					)
						? "ticker"
						: chat.querySelector(".yt-live-chat-membership-item-renderer")
						? "membership"
						: chat.querySelector(
								".yt-live-chat-viewer-engagement-message-renderer"
						  )
						? "engagement"
						: "normal",
					isPaid =
						"ticker" === chatType || Boolean(chat.querySelector("#card")),
					paymentInfo = pipe(
						fromNullable(
							isPaid
								? chat.querySelector(
										join(", ")([
											"#purchase-amount",
											"#purchase-amount-chip",
											"#content>#text",
										])
								  )?.textContent
								: void 0
						),
						Option_map(x => ({ visible: !0, content: x }))
					),
					authorType = chat.querySelector(".owner")
						? "owner"
						: chat.querySelector(".moderator")
						? "moderator"
						: chat.querySelector(".member")
						? "member"
						: "normal",
					messageElement = fromNullable(chat.querySelector("#message")),
					isPaidNormal =
						!!Option_isSome(paymentInfo) &&
						Boolean(chat.querySelector(".yt-live-chat-paid-message-renderer")),
					isPaidSticker =
						!(!Option_isSome(paymentInfo) || isPaidNormal) &&
						Boolean(chat.querySelector(".yt-live-chat-paid-sticker-renderer")),
					textColor = fromNullable(
						isPaidNormal
							? window
									.getComputedStyle(tapNonNull(chat.querySelector("#header")))
									.getPropertyValue("background-color")
							: isPaidSticker
							? window
									.getComputedStyle(chat)
									.getPropertyValue(
										"--yt-live-chat-paid-sticker-chip-background-color"
									)
							: void 0
					),
					paidColor = fromNullable(
						isPaidNormal
							? window
									.getComputedStyle(tapNonNull(chat.querySelector("#content")))
									.getPropertyValue("background-color")
							: isPaidSticker
							? window
									.getComputedStyle(chat)
									.getPropertyValue(
										"--yt-live-chat-paid-sticker-background-color"
									)
							: void 0
					),
					authorPhotoMatches = chat
						.querySelector(join(" ")(["#author-photo", "img"]))
						?.src.match(/ggpht\.com\/(ytc\/)?(.*)=/),
					authorID = fromNullable(authorPhotoMatches?.at(-1)),
					authorName = fromNullable(
						chat.querySelector("#author-name")?.textContent
					),
					message = pipe(
						messageElement,
						Option_map(x => ({ visible: !0, content: x.innerHTML }))
					),
					messageText = pipe(
						messageElement,
						Option_map(x => ({ visible: !0, content: x.textContent ?? "" }))
					)
				return config => ({
					chatType,
					authorType,
					authorID,
					authorName: pipe(
						authorName,
						Option_map(x => ({
							visible:
								("moderator" === authorType && config.displayModName) ||
								(Option_isSome(paymentInfo) && config.displaySuperChatAuthor),
							content: x,
						}))
					),
					messageElement,
					message,
					messageText,
					paymentInfo,
					textColor,
					paidColor,
				})
			},
			onChatFieldMutate = (chatScrn, mainState, getConfig, setConfig) =>
				flow(
					ReadonlyArray_flatMap(e => Array.from(e.addedNodes)),
					ReadonlyArray_filter(x => x.children.length > 0),
					ReadonlyArray_reverse,
					ReadonlyArray_map(chat =>
						pipe(
							{ getData: parseChat(chat), config: mainState.config },
							Identity_let_("data", x => x.getData(x.config)),
							Effect_succeed,
							Effect_zipLeft(Effect_logDebug("Chat detected")),
							Effect_bind("banned", x => {
								return pipe(
									((data = x.data),
									(config = x.config),
									pipe(
										data,
										liftPredicate(() =>
											pipe(config.filterExp, x =>
												a(
													x,
													(data => ({
														...filter_filterOperators,
														authorName: data.authorName,
														message: data.message,
														messageText: data.messageText,
														paymentInfo: data.paymentInfo,
														authorID: pipe(
															data.authorID,
															Option_map(x => ({ visible: !1, content: x }))
														),
													}))(data)
												)
											)
										),
										Option_map(x => [
											pipe(
												x.message,
												Option_map(m => m.content)
											),
											pipe(
												x.paymentInfo,
												Option_map(p => p.content)
											),
										]),
										Option_map(ReadonlyArray_map(getOrElse(() => ""))),
										Option_map(JSON.stringify),
										Effect_flatMap(x => Effect_logDebug(`Filtered: ${x}`)),
										Effect_isSuccess
									))
								)
								var data, config
							}),
							Effect_flatMap(ctx =>
								ctx.banned
									? Effect_sync(() => {
											chat.style.display = "none"
									  })
									: Effect_all([
											pipe(
												ctx.config.createChats &&
													"normal" === ctx.data.chatType,
												liftPredicate(Function_identity),
												Effect_flatMap(() =>
													((getData, chatScrn, mainState) =>
														pipe(
															{
																getData,
																element: emptyElement,
																lane: -1,
																animation: Option_none(),
																animationDuration: 0,
																animationEnded: !1,
																width: 2,
																height: getChatFontSize(mainState),
																y: 0,
															},
															x => getChatLane(x, 0)(mainState).interval,
															intervalTooSmall,
															x => x(mainState.config)
														)
															? Effect_unit()
															: pipe(
																	mainState.flowChats,
																	findFirstIndex(
																		chat =>
																			chat.animationEnded ||
																			mainState.flowChats.length >=
																				mainState.config.maxChatCount
																	),
																	offScreenIndex =>
																		pipe(
																			offScreenIndex,
																			Option_map(index =>
																				pipe(
																					mainState.flowChats,
																					unsafeGet(index),
																					x => x.element
																				)
																			),
																			getOrElse(() =>
																				document.createElement("span")
																			),
																			Effect_succeed,
																			Effect_tap(element =>
																				pipe(
																					offScreenIndex,
																					match(
																						() =>
																							pipe(
																								Effect_sync(() =>
																									chatScrn.append(element)
																								),
																								Effect_zipLeft(
																									Effect_logDebug(
																										"Flow chat added"
																									)
																								)
																							),
																						i =>
																							pipe(
																								Effect_sync(
																									() =>
																										mainState.flowChats.splice(
																											i,
																											1
																										)?.[0]?.animation ??
																										Option_none()
																								),
																								Effect_some,
																								Effect_flatMap(oldAnimation =>
																									Effect_sync(() =>
																										oldAnimation.cancel()
																									)
																								),
																								Effect_ignore
																							)
																					)
																				)
																			)
																		),
																	Effect_flatMap(element =>
																		pipe(
																			{
																				getData,
																				element,
																				lane: -1,
																				animation: Option_none(),
																				animationDuration: 0,
																				animationEnded: !1,
																				width: 2,
																				height: getChatFontSize(mainState),
																				y: 0,
																			},
																			Effect_succeed,
																			Effect_zipLeft(
																				Effect_sync(() =>
																					element.classList.add("fyc_chat")
																				)
																			)
																		)
																	),
																	Effect_flatMap(flowChat =>
																		pipe(
																			mainState,
																			Effect_succeed,
																			Effect_tap(renderChat(flowChat)),
																			Effect_flatMap(
																				setChatAnimation(flowChat)
																			),
																			Effect_flatMap(x =>
																				x
																					? Effect_sync(() =>
																							mainState.flowChats.push(flowChat)
																					  )
																					: pipe(
																							Effect_sync(() =>
																								flowChat.element.remove()
																							),
																							Effect_zipLeft(
																								Effect_logDebug(
																									"Flow chat removed"
																								)
																							)
																					  )
																			)
																		)
																	)
															  ))(ctx.getData, chatScrn, mainState)
												),
												Effect_ignore
											),
											pipe(
												ctx.data.authorID,
												Option_filter(() => ctx.config.createBanButton),
												Option_filter(() => !chat.children.namedItem("card")),
												Effect_flatMap(x => {
													return appendChatMessage(
														((id = x),
														getConfig => setConfig => chat =>
															pipe(
																getConfig.bannedUsers,
																Effect_filterOrFail(
																	x => !x.includes(id),
																	Option_none
																),
																Effect_map(
																	flow(uniq(String_Equivalence), append(id))
																),
																Effect_flatMap(x =>
																	pipe(
																		setConfig.bannedUsers(x),
																		Effect_zipRight(
																			Effect_sync(() =>
																				defaultToast.fire({
																					title: `Added Banned User: ${id}`,
																					icon: "success",
																				})
																			)
																		)
																	)
																),
																Effect_ignore,
																Effect_zipRight(
																	Effect_sync(() => {
																		chat.style.display = "none"
																	})
																),
																onclick =>
																	pipe(
																		Effect_promise(() => template),
																		Effect_map(x => x.cloneNode(!0)),
																		Effect_tap(x =>
																			Effect_sync(() => {
																				x.onclick = () => runPromise(onclick)
																			})
																		)
																	)
															))(getConfig)(setConfig)(chat)
													)(chat)
													var id
												}),
												Effect_zipLeft(Effect_logDebug("Ban button added")),
												Effect_ignore
											),
											pipe(
												ctx.config.simplifyChatField,
												liftPredicate(Function_identity),
												Effect_flatMap(() =>
													(chat =>
														chat.querySelector(
															".style-scope.yt-live-chat-paid-message-renderer"
														)
															? Effect_unit()
															: pipe(
																	[
																		"#author-photo",
																		"yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer",
																	],
																	ReadonlyArray_map(x =>
																		fromNullable(chat.querySelector(x))
																	),
																	ReadonlyArray_compact,
																	ReadonlyArray_map(x =>
																		Effect_sync(() => {
																			x.style.display = "none"
																		})
																	),
																	append(
																		Effect_sync(() => {
																			chat.style.borderBottom =
																				"1px solid var(--yt-spec-text-secondary)"
																		})
																	),
																	x => Effect_all(x)
															  ))(chat)
												),
												Effect_zipLeft(Effect_logDebug("Chat simplified")),
												Effect_ignore
											),
									  ])
							)
						)
					),
					x => Effect_all(x)
				),
			Editable_of = x => [x, Option_none()],
			fromValueText = v => t => [v, Option_some([t, Option_none()])],
			Editable_value = getFirst,
			Editable_text = flow(getSecond, Option_map(getFirst)),
			error = flow(getSecond, flatMap(getSecond)),
			setValue = flow(constant, x => mapFirst(x)),
			setText = x =>
				mapSecond(
					flow(
						Option_map(mapFirst(constant(x))),
						orElse(constant(Option_some([x, Option_none()])))
					)
				),
			hasError = flow(error, Option_isSome),
			exceptions = ["timingFunction", "lang"],
			isEditable = k => v =>
				("number" == typeof v ||
					"string" == typeof v ||
					(Array.isArray(v) && ("string" == typeof v[0] || 0 === v.length))) &&
				!ReadonlyArray_some(x => x === k)(exceptions),
			RefinedConstructorsTypeId = Symbol.for("@effect/data/Brand/Refined"),
			nominal = () =>
				Object.assign(args => args, {
					[RefinedConstructorsTypeId]: RefinedConstructorsTypeId,
					option: args => Option_some(args),
					either: args => Either_right(args),
					refine: _args => !0,
				}),
			external_LZString_namespaceObject = LZString,
			makeCompressedLogBlock = nominal(),
			makeLog = nominal(),
			decompressBlock = x =>
				pipe(
					(0, external_LZString_namespaceObject.decompressFromUTF16)(x),
					JSON.parse
				),
			importLog = s =>
				makeLog(
					pipe(
						"<" === s[0] ? s.slice(5, -6) : s,
						x => JSON.parse(x),
						x => ({
							nextId: x.nextId,
							...pipe(
								x.blocks,
								mapNonEmpty(
									external_LZString_namespaceObject.decompressFromEncodedURIComponent
								),
								matchRight(
									() => ({ compressedBlocks: [], lastBlock: [] }),
									(init, last) => ({
										compressedBlocks: ReadonlyArray_map(
											init,
											flow(
												external_LZString_namespaceObject.compressToUTF16,
												makeCompressedLogBlock
											)
										),
										lastBlock: JSON.parse(last),
									})
								)
							),
						})
					)
				),
			settingStateInit = config =>
				pipe(
					config,
					mapObject(([k, v]) => [
						k,
						isEditable(k)(v) ? Editable_of(v) : "filterExp" === k ? void 0 : v,
					]),
					x => ({
						...x,
						showPanel: !1,
						mainTab: 0,
						logTab: 0,
						timingStepCount: Editable_of(
							parseInt(
								config.timingFunction.match(/^steps\((\d+),.+/)?.[1] ?? "150",
								10
							)
						),
						eventLog: makeLog({
							nextId: 0,
							compressedBlocks: [],
							lastBlock: [],
						}),
						panelRect: new DOMRectReadOnly(0, 0, 660, 395),
					})
				)
		var EMPTY_OBJ = {},
			EMPTY_ARR = [],
			hyperapp_id = a => a,
			hyperapp_map = EMPTY_ARR.map,
			isArray = Array.isArray,
			enqueue =
				"undefined" != typeof requestAnimationFrame
					? requestAnimationFrame
					: setTimeout,
			createClass = obj => {
				var out = ""
				if ("string" == typeof obj) return obj
				if (isArray(obj))
					for (var tmp, k = 0; k < obj.length; k++)
						(tmp = createClass(obj[k])) && (out += (out && " ") + tmp)
				else for (var k in obj) obj[k] && (out += (out && " ") + k)
				return out
			},
			shouldRestart = (a, b) => {
				for (var k in { ...a, ...b })
					if ("function" == typeof (isArray(a[k]) ? a[k][0] : a[k])) b[k] = a[k]
					else if (a[k] !== b[k]) return !0
			},
			getKey = vdom => (null == vdom ? vdom : vdom.key),
			patchProperty = (node, key, oldValue, newValue, listener, isSvg) => {
				if ("style" === key)
					for (var k in { ...oldValue, ...newValue }) {
						oldValue =
							null == newValue || null == newValue[k] ? "" : newValue[k]
						"-" === k[0]
							? node[key].setProperty(k, oldValue)
							: (node[key][k] = oldValue)
					}
				else
					"o" === key[0] && "n" === key[1]
						? ((node.events || (node.events = {}))[(key = key.slice(2))] =
								newValue)
							? oldValue || node.addEventListener(key, listener)
							: node.removeEventListener(key, listener)
						: !isSvg && "list" !== key && "form" !== key && key in node
						? (node[key] = newValue ?? "")
						: null == newValue || !1 === newValue
						? node.removeAttribute(key)
						: node.setAttribute(key, newValue)
			},
			createNode = (vdom, listener, isSvg) => {
				var props = vdom.props,
					node =
						3 === vdom.type
							? document.createTextNode(vdom.tag)
							: (isSvg = isSvg || "svg" === vdom.tag)
							? document.createElementNS(
									"http://www.w3.org/2000/svg",
									vdom.tag,
									props.is && props
							  )
							: document.createElement(vdom.tag, props.is && props)
				for (var k in props)
					patchProperty(node, k, null, props[k], listener, isSvg)
				for (var i = 0; i < vdom.children.length; i++)
					node.appendChild(
						createNode(
							(vdom.children[i] = maybeVNode(vdom.children[i])),
							listener,
							isSvg
						)
					)
				return (vdom.node = node)
			},
			hyperapp_patch = (parent, node, oldVNode, newVNode, listener, isSvg) => {
				if (oldVNode === newVNode);
				else if (null != oldVNode && 3 === oldVNode.type && 3 === newVNode.type)
					oldVNode.tag !== newVNode.tag && (node.nodeValue = newVNode.tag)
				else if (null == oldVNode || oldVNode.tag !== newVNode.tag) {
					node = parent.insertBefore(
						createNode((newVNode = maybeVNode(newVNode)), listener, isSvg),
						node
					)
					null != oldVNode && parent.removeChild(oldVNode.node)
				} else {
					var tmpVKid,
						oldVKid,
						oldKey,
						newKey,
						oldProps = oldVNode.props,
						newProps = newVNode.props,
						oldVKids = oldVNode.children,
						newVKids = newVNode.children,
						oldHead = 0,
						newHead = 0,
						oldTail = oldVKids.length - 1,
						newTail = newVKids.length - 1
					isSvg = isSvg || "svg" === newVNode.tag
					for (var i in { ...oldProps, ...newProps })
						("value" === i || "selected" === i || "checked" === i
							? node[i]
							: oldProps[i]) !== newProps[i] &&
							patchProperty(node, i, oldProps[i], newProps[i], listener, isSvg)
					for (
						;
						newHead <= newTail &&
						oldHead <= oldTail &&
						null != (oldKey = getKey(oldVKids[oldHead])) &&
						oldKey === getKey(newVKids[newHead]);

					)
						hyperapp_patch(
							node,
							oldVKids[oldHead].node,
							oldVKids[oldHead],
							(newVKids[newHead] = maybeVNode(
								newVKids[newHead++],
								oldVKids[oldHead++]
							)),
							listener,
							isSvg
						)
					for (
						;
						newHead <= newTail &&
						oldHead <= oldTail &&
						null != (oldKey = getKey(oldVKids[oldTail])) &&
						oldKey === getKey(newVKids[newTail]);

					)
						hyperapp_patch(
							node,
							oldVKids[oldTail].node,
							oldVKids[oldTail],
							(newVKids[newTail] = maybeVNode(
								newVKids[newTail--],
								oldVKids[oldTail--]
							)),
							listener,
							isSvg
						)
					if (oldHead > oldTail)
						for (; newHead <= newTail; )
							node.insertBefore(
								createNode(
									(newVKids[newHead] = maybeVNode(newVKids[newHead++])),
									listener,
									isSvg
								),
								(oldVKid = oldVKids[oldHead]) && oldVKid.node
							)
					else if (newHead > newTail)
						for (; oldHead <= oldTail; )
							node.removeChild(oldVKids[oldHead++].node)
					else {
						var keyed = {},
							newKeyed = {}
						for (i = oldHead; i <= oldTail; i++)
							null != (oldKey = oldVKids[i].key) &&
								(keyed[oldKey] = oldVKids[i])
						for (; newHead <= newTail; ) {
							oldKey = getKey((oldVKid = oldVKids[oldHead]))
							newKey = getKey(
								(newVKids[newHead] = maybeVNode(newVKids[newHead], oldVKid))
							)
							if (
								newKeyed[oldKey] ||
								(null != newKey && newKey === getKey(oldVKids[oldHead + 1]))
							) {
								null == oldKey && node.removeChild(oldVKid.node)
								oldHead++
							} else if (null == newKey || 1 === oldVNode.type) {
								if (null == oldKey) {
									hyperapp_patch(
										node,
										oldVKid && oldVKid.node,
										oldVKid,
										newVKids[newHead],
										listener,
										isSvg
									)
									newHead++
								}
								oldHead++
							} else {
								if (oldKey === newKey) {
									hyperapp_patch(
										node,
										oldVKid.node,
										oldVKid,
										newVKids[newHead],
										listener,
										isSvg
									)
									newKeyed[newKey] = !0
									oldHead++
								} else if (null != (tmpVKid = keyed[newKey])) {
									hyperapp_patch(
										node,
										node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
										tmpVKid,
										newVKids[newHead],
										listener,
										isSvg
									)
									newKeyed[newKey] = !0
								} else
									hyperapp_patch(
										node,
										oldVKid && oldVKid.node,
										null,
										newVKids[newHead],
										listener,
										isSvg
									)
								newHead++
							}
						}
						for (; oldHead <= oldTail; )
							null == getKey((oldVKid = oldVKids[oldHead++])) &&
								node.removeChild(oldVKid.node)
						for (var i in keyed)
							null == newKeyed[i] && node.removeChild(keyed[i].node)
					}
				}
				return (newVNode.node = node)
			},
			maybeVNode = (newVNode, oldVNode) =>
				!0 !== newVNode && !1 !== newVNode && newVNode
					? "function" == typeof newVNode.tag
						? ((!oldVNode ||
								null == oldVNode.memo ||
								((a, b) => {
									for (var k in a) if (a[k] !== b[k]) return !0
									for (var k in b) if (a[k] !== b[k]) return !0
								})(oldVNode.memo, newVNode.memo)) &&
								((oldVNode = newVNode.tag(newVNode.memo)).memo = newVNode.memo),
						  oldVNode)
						: newVNode
					: hyperapp_text(""),
			recycleNode = node =>
				3 === node.nodeType
					? hyperapp_text(node.nodeValue, node)
					: createVNode(
							node.nodeName.toLowerCase(),
							EMPTY_OBJ,
							hyperapp_map.call(node.childNodes, recycleNode),
							1,
							node
					  ),
			createVNode = (tag, { key, ...props }, children, type, node) => ({
				tag,
				props,
				key,
				children,
				type,
				node,
			}),
			hyperapp_text = (value, node) =>
				createVNode(value, EMPTY_OBJ, EMPTY_ARR, 3, node),
			h = (tag, { class: c, ...props }, children = EMPTY_ARR) =>
				createVNode(
					tag,
					{ ...props, ...(c ? { class: createClass(c) } : EMPTY_OBJ) },
					isArray(children) ? children : [children]
				),
			app = ({
				node,
				view,
				subscriptions,
				dispatch = hyperapp_id,
				init = EMPTY_OBJ,
			}) => {
				var state,
					busy,
					vdom = node && recycleNode(node),
					subs = [],
					update = newState => {
						if (state !== newState) {
							null == (state = newState) &&
								(dispatch = subscriptions = render = hyperapp_id)
							subscriptions &&
								(subs = ((oldSubs, newSubs = EMPTY_ARR, dispatch) => {
									for (
										var oldSub, newSub, subs = [], i = 0;
										i < oldSubs.length || i < newSubs.length;
										i++
									) {
										oldSub = oldSubs[i]
										newSub = newSubs[i]
										subs.push(
											newSub && !0 !== newSub
												? !oldSub ||
												  newSub[0] !== oldSub[0] ||
												  shouldRestart(newSub[1], oldSub[1])
													? [
															newSub[0],
															newSub[1],
															(oldSub && oldSub[2](),
															newSub[0](dispatch, newSub[1])),
													  ]
													: oldSub
												: oldSub && oldSub[2]()
										)
									}
									return subs
								})(subs, subscriptions(state), dispatch))
							view && !busy && enqueue(render, (busy = !0))
						}
					},
					render = () =>
						(node = hyperapp_patch(
							node.parentNode,
							node,
							vdom,
							(vdom = view(state)),
							listener,
							(busy = !1)
						)),
					listener = function (event) {
						dispatch(this.events[event.type], event)
					}
				return (
					(dispatch = dispatch((action, props) =>
						"function" == typeof action
							? dispatch(action(state, props))
							: isArray(action)
							? "function" == typeof action[0]
								? dispatch(action[0], action[1])
								: action
										.slice(1)
										.map(
											fx => fx && !0 !== fx && (fx[0] || fx)(dispatch, fx[1]),
											update(action[0])
										)
							: update(action)
					))(init),
					dispatch
				)
			}
		const makeComponent = x => tag => ({ tag, view: x(tag) }),
			node_option = (value, label, selected) =>
				h("option", { value, selected }, hyperapp_text(label)),
			tabContainer = style => ontabSelect => labels => tabs => mainTab =>
				h("div", { style: style.container }, [
					h(
						"div",
						{},
						pipe(
							labels,
							ReadonlyArray_map((x, i) =>
								h(
									"span",
									{
										style: {
											...style.label,
											...(mainTab === i ? style.labelFocus : {}),
											display: "inline-block",
										},
										onpointerdown: [ontabSelect, i],
									},
									hyperapp_text(x)
								)
							)
						)
					),
					h(
						"div",
						{
							style: {
								...style.tab,
								overflow: "auto",
								boxSizing: "border-box",
							},
						},
						pipe(
							tabs,
							ReadonlyArray_get(mainTab),
							match(
								() => {},
								x => x()
							)
						)
					),
				]),
			defaultText = {
				setting: ["Settings", "設定"],
				font: ["Font", "フォント"],
				color: ["Color(Normal)", "色(通常)"],
				ownerColor: ["Color(Owner)", "色(オーナー)"],
				moderatorColor: ["Color(Moderator)", "色(モデレーター)"],
				memberColor: ["Color(Member)", "色(メンバー)"],
				feedback: ["Feedback", "バグ報告と要望"],
				eventLog: ["Event log", "イベントログ"],
				giveFeedback: [
					"Give your feedbacks here(Please attach the event log for bug reports)",
					"バグ報告、要望はこちら(バグの場合は、イベントログを添付してください)",
				],
				chatOpacity: ["Opacity", "不透明度"],
				fontSize: ["Size", "サイズ"],
				fontWeight: ["Weight", "太さ"],
				shadowFontWeight: ["Weight(Shadow)", "太さ(影)"],
				flowSpeed: ["Speed", "速度"],
				maxChatCount: ["Max number of chats", "最大表示数"],
				maxChatLength: ["Max number of characters", "最大文字数"],
				laneCount: ["Number of rows", "行数"],
				bannedWords: ["Banned Words", "NGワード"],
				bannedWordRegexes: ["Banned Words(Regex)", "NGワード(正規表現)"],
				bannedUsers: ["Banned Users", "NGユーザー"],
				simplifyChatField: ["Simplify", "簡略化する"],
				createBanButton: ["Show ban button", "NGボタンを表示する"],
				displayModName: [
					"Show moderator's name",
					"モデレーターの名前を表示する",
				],
				displaySuperChatAuthor: [
					"Show super chat author",
					"スパチャの作成者を表示する",
				],
				createChats: ["Create flowing chats", "チャットを流す"],
				textOnly: ["Text only(ignore emojis)", "文字のみ(絵文字を無視する)"],
				error: ["Error", "エラー"],
				video: ["Video", "画面"],
				chatField: ["Chat Window", "チャット欄"],
				useStepTiming: ["Move chat in steps", "チャットを段階的に動かす"],
				timingStepCount: ["└Step Count", "└段階数"],
				chatFilter: ["Chat Filter", "チャットフィルター"],
				flowChat: ["Flow Chat", "チャット流れ"],
				clearFlowChats: ["Clear Flowing Chats", "流れるチャットをクリアする"],
				flowNewChatIf: [
					"A new chat will appear if all of the followings are met:",
					"新しいチャットは以下のすべてを満たす場合に流れます：",
				],
				noOverlap: ["└Chats won't overlap", "└他のチャットと重ならない"],
				minSpacing: ["Min spacing between chats", "チャットの最小間隔"],
				fieldScale: ["Scale", "拡大率"],
				copy: ["Copy", "コピーする"],
				showChats: ["Show chats", "チャットを表示する"],
				hideChats: ["Hide chats", "チャットを非表示にする"],
				flowY1: ["Flow area top edge", "流れ範囲の上端"],
				flowY2: ["Flow area bottom edge", "流れ範囲の下端"],
				flowX1: ["Flow area left edge", "流れ範囲の左端"],
				flowX2: ["Flow area right edge", "流れ範囲の右端"],
				shadowColor: ["Color(Shadow)", "色(影)"],
				invalidColor: ["Invalid color", "無効な色"],
				inputNonNumberic: ["Input isn't a number", "入力値が数字でない"],
				invalidSetting: ["Invalid setting", "無効な設定値"],
				logEvents: ["Enable event logging", "イベントログを有効にする"],
				importLog: ["Import event log", "イベントログを取り込む"],
			},
			getText = key => language =>
				defaultText[key]["FYC_EN" === language ? 0 : 1],
			languageLabels = ["English", "日本語"],
			panelBoxStyle = width => ({
				flex: `0 0 ${width}px`,
				width: `${width}px`,
				margin: "2px",
			}),
			computed = {
				useStepTiming: s => Boolean(s.timingFunction.match(/^steps\(.+/)),
			},
			getState = k => (k in computed ? computed[k] : s => s[k])
		var util, objectUtil
		!(function (util) {
			util.assertEqual = val => val
			util.assertIs = function (_arg) {}
			util.assertNever = function (_x) {
				throw new Error()
			}
			util.arrayToEnum = items => {
				const obj = {}
				for (const item of items) obj[item] = item
				return obj
			}
			util.getValidEnumValues = obj => {
				const validKeys = util
						.objectKeys(obj)
						.filter(k => "number" != typeof obj[obj[k]]),
					filtered = {}
				for (const k of validKeys) filtered[k] = obj[k]
				return util.objectValues(filtered)
			}
			util.objectValues = obj =>
				util.objectKeys(obj).map(function (e) {
					return obj[e]
				})
			util.objectKeys =
				"function" == typeof Object.keys
					? obj => Object.keys(obj)
					: object => {
							const keys = []
							for (const key in object)
								Object.prototype.hasOwnProperty.call(object, key) &&
									keys.push(key)
							return keys
					  }
			util.find = (arr, checker) => {
				for (const item of arr) if (checker(item)) return item
			}
			util.isInteger =
				"function" == typeof Number.isInteger
					? val => Number.isInteger(val)
					: val =>
							"number" == typeof val && isFinite(val) && Math.floor(val) === val
			util.joinValues = function (array, separator = " | ") {
				return array
					.map(val => ("string" == typeof val ? `'${val}'` : val))
					.join(separator)
			}
			util.jsonStringifyReplacer = (_, value) =>
				"bigint" == typeof value ? value.toString() : value
		})(util || (util = {}))
		!(function (objectUtil) {
			objectUtil.mergeShapes = (first, second) => ({ ...first, ...second })
		})(objectUtil || (objectUtil = {}))
		const ZodParsedType = util.arrayToEnum([
				"string",
				"nan",
				"number",
				"integer",
				"float",
				"boolean",
				"date",
				"bigint",
				"symbol",
				"function",
				"undefined",
				"null",
				"array",
				"object",
				"unknown",
				"promise",
				"void",
				"never",
				"map",
				"set",
			]),
			getParsedType = data => {
				switch (typeof data) {
					case "undefined":
						return ZodParsedType.undefined
					case "string":
						return ZodParsedType.string
					case "number":
						return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number
					case "boolean":
						return ZodParsedType.boolean
					case "function":
						return ZodParsedType.function
					case "bigint":
						return ZodParsedType.bigint
					case "symbol":
						return ZodParsedType.symbol
					case "object":
						return Array.isArray(data)
							? ZodParsedType.array
							: null === data
							? ZodParsedType.null
							: data.then &&
							  "function" == typeof data.then &&
							  data.catch &&
							  "function" == typeof data.catch
							? ZodParsedType.promise
							: "undefined" != typeof Map && data instanceof Map
							? ZodParsedType.map
							: "undefined" != typeof Set && data instanceof Set
							? ZodParsedType.set
							: "undefined" != typeof Date && data instanceof Date
							? ZodParsedType.date
							: ZodParsedType.object
					default:
						return ZodParsedType.unknown
				}
			},
			ZodIssueCode = util.arrayToEnum([
				"invalid_type",
				"invalid_literal",
				"custom",
				"invalid_union",
				"invalid_union_discriminator",
				"invalid_enum_value",
				"unrecognized_keys",
				"invalid_arguments",
				"invalid_return_type",
				"invalid_date",
				"invalid_string",
				"too_small",
				"too_big",
				"invalid_intersection_types",
				"not_multiple_of",
				"not_finite",
			])
		class ZodError extends Error {
			constructor(issues) {
				super()
				this.issues = []
				this.addIssue = sub => {
					this.issues = [...this.issues, sub]
				}
				this.addIssues = (subs = []) => {
					this.issues = [...this.issues, ...subs]
				}
				const actualProto = new.target.prototype
				Object.setPrototypeOf
					? Object.setPrototypeOf(this, actualProto)
					: (this.__proto__ = actualProto)
				this.name = "ZodError"
				this.issues = issues
			}
			get errors() {
				return this.issues
			}
			format(_mapper) {
				const mapper =
						_mapper ||
						function (issue) {
							return issue.message
						},
					fieldErrors = { _errors: [] },
					processError = error => {
						for (const issue of error.issues)
							if ("invalid_union" === issue.code)
								issue.unionErrors.map(processError)
							else if ("invalid_return_type" === issue.code)
								processError(issue.returnTypeError)
							else if ("invalid_arguments" === issue.code)
								processError(issue.argumentsError)
							else if (0 === issue.path.length)
								fieldErrors._errors.push(mapper(issue))
							else {
								let curr = fieldErrors,
									i = 0
								for (; i < issue.path.length; ) {
									const el = issue.path[i]
									if (i === issue.path.length - 1) {
										curr[el] = curr[el] || { _errors: [] }
										curr[el]._errors.push(mapper(issue))
									} else curr[el] = curr[el] || { _errors: [] }
									curr = curr[el]
									i++
								}
							}
					}
				processError(this)
				return fieldErrors
			}
			toString() {
				return this.message
			}
			get message() {
				return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2)
			}
			get isEmpty() {
				return 0 === this.issues.length
			}
			flatten(mapper = issue => issue.message) {
				const fieldErrors = {},
					formErrors = []
				for (const sub of this.issues)
					if (sub.path.length > 0) {
						fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || []
						fieldErrors[sub.path[0]].push(mapper(sub))
					} else formErrors.push(mapper(sub))
				return { formErrors, fieldErrors }
			}
			get formErrors() {
				return this.flatten()
			}
		}
		ZodError.create = issues => new ZodError(issues)
		const errorMap = (issue, _ctx) => {
			let message
			switch (issue.code) {
				case ZodIssueCode.invalid_type:
					message =
						issue.received === ZodParsedType.undefined
							? "Required"
							: `Expected ${issue.expected}, received ${issue.received}`
					break
				case ZodIssueCode.invalid_literal:
					message = `Invalid literal value, expected ${JSON.stringify(
						issue.expected,
						util.jsonStringifyReplacer
					)}`
					break
				case ZodIssueCode.unrecognized_keys:
					message = `Unrecognized key(s) in object: ${util.joinValues(
						issue.keys,
						", "
					)}`
					break
				case ZodIssueCode.invalid_union:
					message = "Invalid input"
					break
				case ZodIssueCode.invalid_union_discriminator:
					message = `Invalid discriminator value. Expected ${util.joinValues(
						issue.options
					)}`
					break
				case ZodIssueCode.invalid_enum_value:
					message = `Invalid enum value. Expected ${util.joinValues(
						issue.options
					)}, received '${issue.received}'`
					break
				case ZodIssueCode.invalid_arguments:
					message = "Invalid function arguments"
					break
				case ZodIssueCode.invalid_return_type:
					message = "Invalid function return type"
					break
				case ZodIssueCode.invalid_date:
					message = "Invalid date"
					break
				case ZodIssueCode.invalid_string:
					if ("object" == typeof issue.validation)
						if ("includes" in issue.validation) {
							message = `Invalid input: must include "${issue.validation.includes}"`
							"number" == typeof issue.validation.position &&
								(message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`)
						} else
							"startsWith" in issue.validation
								? (message = `Invalid input: must start with "${issue.validation.startsWith}"`)
								: "endsWith" in issue.validation
								? (message = `Invalid input: must end with "${issue.validation.endsWith}"`)
								: util.assertNever(issue.validation)
					else
						message =
							"regex" !== issue.validation
								? `Invalid ${issue.validation}`
								: "Invalid"
					break
				case ZodIssueCode.too_small:
					message =
						"array" === issue.type
							? `Array must contain ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "at least"
										: "more than"
							  } ${issue.minimum} element(s)`
							: "string" === issue.type
							? `String must contain ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "at least"
										: "over"
							  } ${issue.minimum} character(s)`
							: "number" === issue.type
							? `Number must be ${
									issue.exact
										? "exactly equal to "
										: issue.inclusive
										? "greater than or equal to "
										: "greater than "
							  }${issue.minimum}`
							: "date" === issue.type
							? `Date must be ${
									issue.exact
										? "exactly equal to "
										: issue.inclusive
										? "greater than or equal to "
										: "greater than "
							  }${new Date(Number(issue.minimum))}`
							: "Invalid input"
					break
				case ZodIssueCode.too_big:
					message =
						"array" === issue.type
							? `Array must contain ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "at most"
										: "less than"
							  } ${issue.maximum} element(s)`
							: "string" === issue.type
							? `String must contain ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "at most"
										: "under"
							  } ${issue.maximum} character(s)`
							: "number" === issue.type
							? `Number must be ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "less than or equal to"
										: "less than"
							  } ${issue.maximum}`
							: "bigint" === issue.type
							? `BigInt must be ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "less than or equal to"
										: "less than"
							  } ${issue.maximum}`
							: "date" === issue.type
							? `Date must be ${
									issue.exact
										? "exactly"
										: issue.inclusive
										? "smaller than or equal to"
										: "smaller than"
							  } ${new Date(Number(issue.maximum))}`
							: "Invalid input"
					break
				case ZodIssueCode.custom:
					message = "Invalid input"
					break
				case ZodIssueCode.invalid_intersection_types:
					message = "Intersection results could not be merged"
					break
				case ZodIssueCode.not_multiple_of:
					message = `Number must be a multiple of ${issue.multipleOf}`
					break
				case ZodIssueCode.not_finite:
					message = "Number must be finite"
					break
				default:
					message = _ctx.defaultError
					util.assertNever(issue)
			}
			return { message }
		}
		let overrideErrorMap = errorMap
		function getErrorMap() {
			return overrideErrorMap
		}
		const makeIssue = params => {
			const { data, path, errorMaps, issueData } = params,
				fullPath = [...path, ...(issueData.path || [])],
				fullIssue = { ...issueData, path: fullPath }
			let errorMessage = ""
			const maps = errorMaps
				.filter(m => !!m)
				.slice()
				.reverse()
			for (const map of maps)
				errorMessage = map(fullIssue, {
					data,
					defaultError: errorMessage,
				}).message
			return {
				...issueData,
				path: fullPath,
				message: issueData.message || errorMessage,
			}
		}
		function addIssueToContext(ctx, issueData) {
			const issue = makeIssue({
				issueData,
				data: ctx.data,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap,
				].filter(x => !!x),
			})
			ctx.common.issues.push(issue)
		}
		class ParseStatus {
			constructor() {
				this.value = "valid"
			}
			dirty() {
				"valid" === this.value && (this.value = "dirty")
			}
			abort() {
				"aborted" !== this.value && (this.value = "aborted")
			}
			static mergeArray(status, results) {
				const arrayValue = []
				for (const s of results) {
					if ("aborted" === s.status) return INVALID
					"dirty" === s.status && status.dirty()
					arrayValue.push(s.value)
				}
				return { status: status.value, value: arrayValue }
			}
			static async mergeObjectAsync(status, pairs) {
				const syncPairs = []
				for (const pair of pairs)
					syncPairs.push({ key: await pair.key, value: await pair.value })
				return ParseStatus.mergeObjectSync(status, syncPairs)
			}
			static mergeObjectSync(status, pairs) {
				const finalObject = {}
				for (const pair of pairs) {
					const { key, value } = pair
					if ("aborted" === key.status) return INVALID
					if ("aborted" === value.status) return INVALID
					"dirty" === key.status && status.dirty()
					"dirty" === value.status && status.dirty()
					;(void 0 !== value.value || pair.alwaysSet) &&
						(finalObject[key.value] = value.value)
				}
				return { status: status.value, value: finalObject }
			}
		}
		const INVALID = Object.freeze({ status: "aborted" }),
			DIRTY = value => ({ status: "dirty", value }),
			OK = value => ({ status: "valid", value }),
			isAborted = x => "aborted" === x.status,
			isDirty = x => "dirty" === x.status,
			isValid = x => "valid" === x.status,
			isAsync = x => "undefined" != typeof Promise && x instanceof Promise
		var errorUtil
		!(function (errorUtil) {
			errorUtil.errToObj = message =>
				"string" == typeof message ? { message } : message || {}
			errorUtil.toString = message =>
				"string" == typeof message
					? message
					: null == message
					? void 0
					: message.message
		})(errorUtil || (errorUtil = {}))
		class ParseInputLazyPath {
			constructor(parent, value, path, key) {
				this._cachedPath = []
				this.parent = parent
				this.data = value
				this._path = path
				this._key = key
			}
			get path() {
				this._cachedPath.length ||
					(this._key instanceof Array
						? this._cachedPath.push(...this._path, ...this._key)
						: this._cachedPath.push(...this._path, this._key))
				return this._cachedPath
			}
		}
		const handleResult = (ctx, result) => {
			if (isValid(result)) return { success: !0, data: result.value }
			if (!ctx.common.issues.length)
				throw new Error("Validation failed but no issues detected.")
			return {
				success: !1,
				get error() {
					if (this._error) return this._error
					const error = new ZodError(ctx.common.issues)
					this._error = error
					return this._error
				},
			}
		}
		function processCreateParams(params) {
			if (!params) return {}
			const { errorMap, invalid_type_error, required_error, description } =
				params
			if (errorMap && (invalid_type_error || required_error))
				throw new Error(
					'Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.'
				)
			return errorMap
				? { errorMap, description }
				: {
						errorMap: (iss, ctx) =>
							"invalid_type" !== iss.code
								? { message: ctx.defaultError }
								: void 0 === ctx.data
								? {
										message:
											null != required_error
												? required_error
												: ctx.defaultError,
								  }
								: {
										message:
											null != invalid_type_error
												? invalid_type_error
												: ctx.defaultError,
								  },
						description,
				  }
		}
		class ZodType {
			constructor(def) {
				this.spa = this.safeParseAsync
				this._def = def
				this.parse = this.parse.bind(this)
				this.safeParse = this.safeParse.bind(this)
				this.parseAsync = this.parseAsync.bind(this)
				this.safeParseAsync = this.safeParseAsync.bind(this)
				this.spa = this.spa.bind(this)
				this.refine = this.refine.bind(this)
				this.refinement = this.refinement.bind(this)
				this.superRefine = this.superRefine.bind(this)
				this.optional = this.optional.bind(this)
				this.nullable = this.nullable.bind(this)
				this.nullish = this.nullish.bind(this)
				this.array = this.array.bind(this)
				this.promise = this.promise.bind(this)
				this.or = this.or.bind(this)
				this.and = this.and.bind(this)
				this.transform = this.transform.bind(this)
				this.brand = this.brand.bind(this)
				this.default = this.default.bind(this)
				this.catch = this.catch.bind(this)
				this.describe = this.describe.bind(this)
				this.pipe = this.pipe.bind(this)
				this.isNullable = this.isNullable.bind(this)
				this.isOptional = this.isOptional.bind(this)
			}
			get description() {
				return this._def.description
			}
			_getType(input) {
				return getParsedType(input.data)
			}
			_getOrReturnCtx(input, ctx) {
				return (
					ctx || {
						common: input.parent.common,
						data: input.data,
						parsedType: getParsedType(input.data),
						schemaErrorMap: this._def.errorMap,
						path: input.path,
						parent: input.parent,
					}
				)
			}
			_processInputParams(input) {
				return {
					status: new ParseStatus(),
					ctx: {
						common: input.parent.common,
						data: input.data,
						parsedType: getParsedType(input.data),
						schemaErrorMap: this._def.errorMap,
						path: input.path,
						parent: input.parent,
					},
				}
			}
			_parseSync(input) {
				const result = this._parse(input)
				if (isAsync(result))
					throw new Error("Synchronous parse encountered promise.")
				return result
			}
			_parseAsync(input) {
				const result = this._parse(input)
				return Promise.resolve(result)
			}
			parse(data, params) {
				const result = this.safeParse(data, params)
				if (result.success) return result.data
				throw result.error
			}
			safeParse(data, params) {
				var _a
				const ctx = {
						common: {
							issues: [],
							async:
								null !== (_a = null == params ? void 0 : params.async) &&
								void 0 !== _a &&
								_a,
							contextualErrorMap: null == params ? void 0 : params.errorMap,
						},
						path: (null == params ? void 0 : params.path) || [],
						schemaErrorMap: this._def.errorMap,
						parent: null,
						data,
						parsedType: getParsedType(data),
					},
					result = this._parseSync({ data, path: ctx.path, parent: ctx })
				return handleResult(ctx, result)
			}
			async parseAsync(data, params) {
				const result = await this.safeParseAsync(data, params)
				if (result.success) return result.data
				throw result.error
			}
			async safeParseAsync(data, params) {
				const ctx = {
						common: {
							issues: [],
							contextualErrorMap: null == params ? void 0 : params.errorMap,
							async: !0,
						},
						path: (null == params ? void 0 : params.path) || [],
						schemaErrorMap: this._def.errorMap,
						parent: null,
						data,
						parsedType: getParsedType(data),
					},
					maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx }),
					result = await (isAsync(maybeAsyncResult)
						? maybeAsyncResult
						: Promise.resolve(maybeAsyncResult))
				return handleResult(ctx, result)
			}
			refine(check, message) {
				const getIssueProperties = val =>
					"string" == typeof message || void 0 === message
						? { message }
						: "function" == typeof message
						? message(val)
						: message
				return this._refinement((val, ctx) => {
					const result = check(val),
						setError = () =>
							ctx.addIssue({
								code: ZodIssueCode.custom,
								...getIssueProperties(val),
							})
					if ("undefined" != typeof Promise && result instanceof Promise)
						return result.then(data => {
							if (data) return !0
							setError()
							return !1
						})
					if (result) return !0
					setError()
					return !1
				})
			}
			refinement(check, refinementData) {
				return this._refinement((val, ctx) => {
					if (check(val)) return !0
					ctx.addIssue(
						"function" == typeof refinementData
							? refinementData(val, ctx)
							: refinementData
					)
					return !1
				})
			}
			_refinement(refinement) {
				return new ZodEffects({
					schema: this,
					typeName: ZodFirstPartyTypeKind.ZodEffects,
					effect: { type: "refinement", refinement },
				})
			}
			superRefine(refinement) {
				return this._refinement(refinement)
			}
			optional() {
				return ZodOptional.create(this, this._def)
			}
			nullable() {
				return ZodNullable.create(this, this._def)
			}
			nullish() {
				return this.nullable().optional()
			}
			array() {
				return ZodArray.create(this, this._def)
			}
			promise() {
				return ZodPromise.create(this, this._def)
			}
			or(option) {
				return ZodUnion.create([this, option], this._def)
			}
			and(incoming) {
				return ZodIntersection.create(this, incoming, this._def)
			}
			transform(transform) {
				return new ZodEffects({
					...processCreateParams(this._def),
					schema: this,
					typeName: ZodFirstPartyTypeKind.ZodEffects,
					effect: { type: "transform", transform },
				})
			}
			default(def) {
				const defaultValueFunc = "function" == typeof def ? def : () => def
				return new ZodDefault({
					...processCreateParams(this._def),
					innerType: this,
					defaultValue: defaultValueFunc,
					typeName: ZodFirstPartyTypeKind.ZodDefault,
				})
			}
			brand() {
				return new ZodBranded({
					typeName: ZodFirstPartyTypeKind.ZodBranded,
					type: this,
					...processCreateParams(this._def),
				})
			}
			catch(def) {
				const catchValueFunc = "function" == typeof def ? def : () => def
				return new ZodCatch({
					...processCreateParams(this._def),
					innerType: this,
					catchValue: catchValueFunc,
					typeName: ZodFirstPartyTypeKind.ZodCatch,
				})
			}
			describe(description) {
				return new (0, this.constructor)({ ...this._def, description })
			}
			pipe(target) {
				return ZodPipeline.create(this, target)
			}
			isOptional() {
				return this.safeParse(void 0).success
			}
			isNullable() {
				return this.safeParse(null).success
			}
		}
		const cuidRegex = /^c[^\s-]{8,}$/i,
			cuid2Regex = /^[a-z][a-z0-9]*$/,
			ulidRegex = /[0-9A-HJKMNP-TV-Z]{26}/,
			uuidRegex =
				/^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i,
			emailRegex =
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/,
			emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u,
			ipv4Regex =
				/^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/,
			ipv6Regex =
				/^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/
		class ZodString extends ZodType {
			constructor() {
				super(...arguments)
				this._regex = (regex, validation, message) =>
					this.refinement(data => regex.test(data), {
						validation,
						code: ZodIssueCode.invalid_string,
						...errorUtil.errToObj(message),
					})
				this.nonempty = message => this.min(1, errorUtil.errToObj(message))
				this.trim = () =>
					new ZodString({
						...this._def,
						checks: [...this._def.checks, { kind: "trim" }],
					})
				this.toLowerCase = () =>
					new ZodString({
						...this._def,
						checks: [...this._def.checks, { kind: "toLowerCase" }],
					})
				this.toUpperCase = () =>
					new ZodString({
						...this._def,
						checks: [...this._def.checks, { kind: "toUpperCase" }],
					})
			}
			_parse(input) {
				this._def.coerce && (input.data = String(input.data))
				if (this._getType(input) !== ZodParsedType.string) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.string,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const status = new ParseStatus()
				let ctx
				for (const check of this._def.checks)
					if ("min" === check.kind) {
						if (input.data.length < check.value) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_small,
								minimum: check.value,
								type: "string",
								inclusive: !0,
								exact: !1,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("max" === check.kind) {
						if (input.data.length > check.value) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_big,
								maximum: check.value,
								type: "string",
								inclusive: !0,
								exact: !1,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("length" === check.kind) {
						const tooBig = input.data.length > check.value,
							tooSmall = input.data.length < check.value
						if (tooBig || tooSmall) {
							ctx = this._getOrReturnCtx(input, ctx)
							tooBig
								? addIssueToContext(ctx, {
										code: ZodIssueCode.too_big,
										maximum: check.value,
										type: "string",
										inclusive: !0,
										exact: !0,
										message: check.message,
								  })
								: tooSmall &&
								  addIssueToContext(ctx, {
										code: ZodIssueCode.too_small,
										minimum: check.value,
										type: "string",
										inclusive: !0,
										exact: !0,
										message: check.message,
								  })
							status.dirty()
						}
					} else if ("email" === check.kind) {
						if (!emailRegex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "email",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("emoji" === check.kind) {
						if (!emojiRegex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "emoji",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("uuid" === check.kind) {
						if (!uuidRegex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "uuid",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("cuid" === check.kind) {
						if (!cuidRegex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "cuid",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("cuid2" === check.kind) {
						if (!cuid2Regex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "cuid2",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("ulid" === check.kind) {
						if (!ulidRegex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "ulid",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("url" === check.kind)
						try {
							new URL(input.data)
						} catch (_a) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "url",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					else if ("regex" === check.kind) {
						check.regex.lastIndex = 0
						if (!check.regex.test(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "regex",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("trim" === check.kind) input.data = input.data.trim()
					else if ("includes" === check.kind) {
						if (!input.data.includes(check.value, check.position)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.invalid_string,
								validation: { includes: check.value, position: check.position },
								message: check.message,
							})
							status.dirty()
						}
					} else if ("toLowerCase" === check.kind)
						input.data = input.data.toLowerCase()
					else if ("toUpperCase" === check.kind)
						input.data = input.data.toUpperCase()
					else if ("startsWith" === check.kind) {
						if (!input.data.startsWith(check.value)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.invalid_string,
								validation: { startsWith: check.value },
								message: check.message,
							})
							status.dirty()
						}
					} else if ("endsWith" === check.kind) {
						if (!input.data.endsWith(check.value)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.invalid_string,
								validation: { endsWith: check.value },
								message: check.message,
							})
							status.dirty()
						}
					} else if ("datetime" === check.kind) {
						if (
							!(
								(args = check).precision
									? args.offset
										? new RegExp(
												`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`
										  )
										: new RegExp(
												`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`
										  )
									: 0 === args.precision
									? args.offset
										? new RegExp(
												"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$"
										  )
										: new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$")
									: args.offset
									? new RegExp(
											"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$"
									  )
									: new RegExp(
											"^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$"
									  )
							).test(input.data)
						) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.invalid_string,
								validation: "datetime",
								message: check.message,
							})
							status.dirty()
						}
					} else if ("ip" === check.kind) {
						if (
							!((ip = input.data),
							(version = check.version),
							(("v4" === version || !version) && ipv4Regex.test(ip)) ||
								(("v6" === version || !version) && ipv6Regex.test(ip)))
						) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								validation: "ip",
								code: ZodIssueCode.invalid_string,
								message: check.message,
							})
							status.dirty()
						}
					} else util.assertNever(check)
				var ip, version, args
				return { status: status.value, value: input.data }
			}
			_addCheck(check) {
				return new ZodString({
					...this._def,
					checks: [...this._def.checks, check],
				})
			}
			email(message) {
				return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) })
			}
			url(message) {
				return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) })
			}
			emoji(message) {
				return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) })
			}
			uuid(message) {
				return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) })
			}
			cuid(message) {
				return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) })
			}
			cuid2(message) {
				return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) })
			}
			ulid(message) {
				return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) })
			}
			ip(options) {
				return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) })
			}
			datetime(options) {
				var _a
				return "string" == typeof options
					? this._addCheck({
							kind: "datetime",
							precision: null,
							offset: !1,
							message: options,
					  })
					: this._addCheck({
							kind: "datetime",
							precision:
								void 0 === (null == options ? void 0 : options.precision)
									? null
									: null == options
									? void 0
									: options.precision,
							offset:
								null !== (_a = null == options ? void 0 : options.offset) &&
								void 0 !== _a &&
								_a,
							...errorUtil.errToObj(null == options ? void 0 : options.message),
					  })
			}
			regex(regex, message) {
				return this._addCheck({
					kind: "regex",
					regex,
					...errorUtil.errToObj(message),
				})
			}
			includes(value, options) {
				return this._addCheck({
					kind: "includes",
					value,
					position: null == options ? void 0 : options.position,
					...errorUtil.errToObj(null == options ? void 0 : options.message),
				})
			}
			startsWith(value, message) {
				return this._addCheck({
					kind: "startsWith",
					value,
					...errorUtil.errToObj(message),
				})
			}
			endsWith(value, message) {
				return this._addCheck({
					kind: "endsWith",
					value,
					...errorUtil.errToObj(message),
				})
			}
			min(minLength, message) {
				return this._addCheck({
					kind: "min",
					value: minLength,
					...errorUtil.errToObj(message),
				})
			}
			max(maxLength, message) {
				return this._addCheck({
					kind: "max",
					value: maxLength,
					...errorUtil.errToObj(message),
				})
			}
			length(len, message) {
				return this._addCheck({
					kind: "length",
					value: len,
					...errorUtil.errToObj(message),
				})
			}
			get isDatetime() {
				return !!this._def.checks.find(ch => "datetime" === ch.kind)
			}
			get isEmail() {
				return !!this._def.checks.find(ch => "email" === ch.kind)
			}
			get isURL() {
				return !!this._def.checks.find(ch => "url" === ch.kind)
			}
			get isEmoji() {
				return !!this._def.checks.find(ch => "emoji" === ch.kind)
			}
			get isUUID() {
				return !!this._def.checks.find(ch => "uuid" === ch.kind)
			}
			get isCUID() {
				return !!this._def.checks.find(ch => "cuid" === ch.kind)
			}
			get isCUID2() {
				return !!this._def.checks.find(ch => "cuid2" === ch.kind)
			}
			get isULID() {
				return !!this._def.checks.find(ch => "ulid" === ch.kind)
			}
			get isIP() {
				return !!this._def.checks.find(ch => "ip" === ch.kind)
			}
			get minLength() {
				let min = null
				for (const ch of this._def.checks)
					"min" === ch.kind &&
						(null === min || ch.value > min) &&
						(min = ch.value)
				return min
			}
			get maxLength() {
				let max = null
				for (const ch of this._def.checks)
					"max" === ch.kind &&
						(null === max || ch.value < max) &&
						(max = ch.value)
				return max
			}
		}
		ZodString.create = params => {
			var _a
			return new ZodString({
				checks: [],
				typeName: ZodFirstPartyTypeKind.ZodString,
				coerce:
					null !== (_a = null == params ? void 0 : params.coerce) &&
					void 0 !== _a &&
					_a,
				...processCreateParams(params),
			})
		}
		function floatSafeRemainder(val, step) {
			const valDecCount = (val.toString().split(".")[1] || "").length,
				stepDecCount = (step.toString().split(".")[1] || "").length,
				decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount
			return (
				(parseInt(val.toFixed(decCount).replace(".", "")) %
					parseInt(step.toFixed(decCount).replace(".", ""))) /
				Math.pow(10, decCount)
			)
		}
		class ZodNumber extends ZodType {
			constructor() {
				super(...arguments)
				this.min = this.gte
				this.max = this.lte
				this.step = this.multipleOf
			}
			_parse(input) {
				this._def.coerce && (input.data = Number(input.data))
				if (this._getType(input) !== ZodParsedType.number) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.number,
						received: ctx.parsedType,
					})
					return INVALID
				}
				let ctx
				const status = new ParseStatus()
				for (const check of this._def.checks)
					if ("int" === check.kind) {
						if (!util.isInteger(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.invalid_type,
								expected: "integer",
								received: "float",
								message: check.message,
							})
							status.dirty()
						}
					} else if ("min" === check.kind) {
						if (
							check.inclusive
								? input.data < check.value
								: input.data <= check.value
						) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_small,
								minimum: check.value,
								type: "number",
								inclusive: check.inclusive,
								exact: !1,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("max" === check.kind) {
						if (
							check.inclusive
								? input.data > check.value
								: input.data >= check.value
						) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_big,
								maximum: check.value,
								type: "number",
								inclusive: check.inclusive,
								exact: !1,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("multipleOf" === check.kind) {
						if (0 !== floatSafeRemainder(input.data, check.value)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.not_multiple_of,
								multipleOf: check.value,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("finite" === check.kind) {
						if (!Number.isFinite(input.data)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.not_finite,
								message: check.message,
							})
							status.dirty()
						}
					} else util.assertNever(check)
				return { status: status.value, value: input.data }
			}
			gte(value, message) {
				return this.setLimit("min", value, !0, errorUtil.toString(message))
			}
			gt(value, message) {
				return this.setLimit("min", value, !1, errorUtil.toString(message))
			}
			lte(value, message) {
				return this.setLimit("max", value, !0, errorUtil.toString(message))
			}
			lt(value, message) {
				return this.setLimit("max", value, !1, errorUtil.toString(message))
			}
			setLimit(kind, value, inclusive, message) {
				return new ZodNumber({
					...this._def,
					checks: [
						...this._def.checks,
						{ kind, value, inclusive, message: errorUtil.toString(message) },
					],
				})
			}
			_addCheck(check) {
				return new ZodNumber({
					...this._def,
					checks: [...this._def.checks, check],
				})
			}
			int(message) {
				return this._addCheck({
					kind: "int",
					message: errorUtil.toString(message),
				})
			}
			positive(message) {
				return this._addCheck({
					kind: "min",
					value: 0,
					inclusive: !1,
					message: errorUtil.toString(message),
				})
			}
			negative(message) {
				return this._addCheck({
					kind: "max",
					value: 0,
					inclusive: !1,
					message: errorUtil.toString(message),
				})
			}
			nonpositive(message) {
				return this._addCheck({
					kind: "max",
					value: 0,
					inclusive: !0,
					message: errorUtil.toString(message),
				})
			}
			nonnegative(message) {
				return this._addCheck({
					kind: "min",
					value: 0,
					inclusive: !0,
					message: errorUtil.toString(message),
				})
			}
			multipleOf(value, message) {
				return this._addCheck({
					kind: "multipleOf",
					value,
					message: errorUtil.toString(message),
				})
			}
			finite(message) {
				return this._addCheck({
					kind: "finite",
					message: errorUtil.toString(message),
				})
			}
			safe(message) {
				return this._addCheck({
					kind: "min",
					inclusive: !0,
					value: Number.MIN_SAFE_INTEGER,
					message: errorUtil.toString(message),
				})._addCheck({
					kind: "max",
					inclusive: !0,
					value: Number.MAX_SAFE_INTEGER,
					message: errorUtil.toString(message),
				})
			}
			get minValue() {
				let min = null
				for (const ch of this._def.checks)
					"min" === ch.kind &&
						(null === min || ch.value > min) &&
						(min = ch.value)
				return min
			}
			get maxValue() {
				let max = null
				for (const ch of this._def.checks)
					"max" === ch.kind &&
						(null === max || ch.value < max) &&
						(max = ch.value)
				return max
			}
			get isInt() {
				return !!this._def.checks.find(
					ch =>
						"int" === ch.kind ||
						("multipleOf" === ch.kind && util.isInteger(ch.value))
				)
			}
			get isFinite() {
				let max = null,
					min = null
				for (const ch of this._def.checks) {
					if (
						"finite" === ch.kind ||
						"int" === ch.kind ||
						"multipleOf" === ch.kind
					)
						return !0
					"min" === ch.kind
						? (null === min || ch.value > min) && (min = ch.value)
						: "max" === ch.kind &&
						  (null === max || ch.value < max) &&
						  (max = ch.value)
				}
				return Number.isFinite(min) && Number.isFinite(max)
			}
		}
		ZodNumber.create = params =>
			new ZodNumber({
				checks: [],
				typeName: ZodFirstPartyTypeKind.ZodNumber,
				coerce: (null == params ? void 0 : params.coerce) || !1,
				...processCreateParams(params),
			})
		class ZodBigInt extends ZodType {
			constructor() {
				super(...arguments)
				this.min = this.gte
				this.max = this.lte
			}
			_parse(input) {
				this._def.coerce && (input.data = BigInt(input.data))
				if (this._getType(input) !== ZodParsedType.bigint) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.bigint,
						received: ctx.parsedType,
					})
					return INVALID
				}
				let ctx
				const status = new ParseStatus()
				for (const check of this._def.checks)
					if ("min" === check.kind) {
						if (
							check.inclusive
								? input.data < check.value
								: input.data <= check.value
						) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_small,
								type: "bigint",
								minimum: check.value,
								inclusive: check.inclusive,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("max" === check.kind) {
						if (
							check.inclusive
								? input.data > check.value
								: input.data >= check.value
						) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_big,
								type: "bigint",
								maximum: check.value,
								inclusive: check.inclusive,
								message: check.message,
							})
							status.dirty()
						}
					} else if ("multipleOf" === check.kind) {
						if (input.data % check.value !== BigInt(0)) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.not_multiple_of,
								multipleOf: check.value,
								message: check.message,
							})
							status.dirty()
						}
					} else util.assertNever(check)
				return { status: status.value, value: input.data }
			}
			gte(value, message) {
				return this.setLimit("min", value, !0, errorUtil.toString(message))
			}
			gt(value, message) {
				return this.setLimit("min", value, !1, errorUtil.toString(message))
			}
			lte(value, message) {
				return this.setLimit("max", value, !0, errorUtil.toString(message))
			}
			lt(value, message) {
				return this.setLimit("max", value, !1, errorUtil.toString(message))
			}
			setLimit(kind, value, inclusive, message) {
				return new ZodBigInt({
					...this._def,
					checks: [
						...this._def.checks,
						{ kind, value, inclusive, message: errorUtil.toString(message) },
					],
				})
			}
			_addCheck(check) {
				return new ZodBigInt({
					...this._def,
					checks: [...this._def.checks, check],
				})
			}
			positive(message) {
				return this._addCheck({
					kind: "min",
					value: BigInt(0),
					inclusive: !1,
					message: errorUtil.toString(message),
				})
			}
			negative(message) {
				return this._addCheck({
					kind: "max",
					value: BigInt(0),
					inclusive: !1,
					message: errorUtil.toString(message),
				})
			}
			nonpositive(message) {
				return this._addCheck({
					kind: "max",
					value: BigInt(0),
					inclusive: !0,
					message: errorUtil.toString(message),
				})
			}
			nonnegative(message) {
				return this._addCheck({
					kind: "min",
					value: BigInt(0),
					inclusive: !0,
					message: errorUtil.toString(message),
				})
			}
			multipleOf(value, message) {
				return this._addCheck({
					kind: "multipleOf",
					value,
					message: errorUtil.toString(message),
				})
			}
			get minValue() {
				let min = null
				for (const ch of this._def.checks)
					"min" === ch.kind &&
						(null === min || ch.value > min) &&
						(min = ch.value)
				return min
			}
			get maxValue() {
				let max = null
				for (const ch of this._def.checks)
					"max" === ch.kind &&
						(null === max || ch.value < max) &&
						(max = ch.value)
				return max
			}
		}
		ZodBigInt.create = params => {
			var _a
			return new ZodBigInt({
				checks: [],
				typeName: ZodFirstPartyTypeKind.ZodBigInt,
				coerce:
					null !== (_a = null == params ? void 0 : params.coerce) &&
					void 0 !== _a &&
					_a,
				...processCreateParams(params),
			})
		}
		class ZodBoolean extends ZodType {
			_parse(input) {
				this._def.coerce && (input.data = Boolean(input.data))
				if (this._getType(input) !== ZodParsedType.boolean) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.boolean,
						received: ctx.parsedType,
					})
					return INVALID
				}
				return OK(input.data)
			}
		}
		ZodBoolean.create = params =>
			new ZodBoolean({
				typeName: ZodFirstPartyTypeKind.ZodBoolean,
				coerce: (null == params ? void 0 : params.coerce) || !1,
				...processCreateParams(params),
			})
		class ZodDate extends ZodType {
			_parse(input) {
				this._def.coerce && (input.data = new Date(input.data))
				if (this._getType(input) !== ZodParsedType.date) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.date,
						received: ctx.parsedType,
					})
					return INVALID
				}
				if (isNaN(input.data.getTime())) {
					addIssueToContext(this._getOrReturnCtx(input), {
						code: ZodIssueCode.invalid_date,
					})
					return INVALID
				}
				const status = new ParseStatus()
				let ctx
				for (const check of this._def.checks)
					if ("min" === check.kind) {
						if (input.data.getTime() < check.value) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_small,
								message: check.message,
								inclusive: !0,
								exact: !1,
								minimum: check.value,
								type: "date",
							})
							status.dirty()
						}
					} else if ("max" === check.kind) {
						if (input.data.getTime() > check.value) {
							ctx = this._getOrReturnCtx(input, ctx)
							addIssueToContext(ctx, {
								code: ZodIssueCode.too_big,
								message: check.message,
								inclusive: !0,
								exact: !1,
								maximum: check.value,
								type: "date",
							})
							status.dirty()
						}
					} else util.assertNever(check)
				return { status: status.value, value: new Date(input.data.getTime()) }
			}
			_addCheck(check) {
				return new ZodDate({
					...this._def,
					checks: [...this._def.checks, check],
				})
			}
			min(minDate, message) {
				return this._addCheck({
					kind: "min",
					value: minDate.getTime(),
					message: errorUtil.toString(message),
				})
			}
			max(maxDate, message) {
				return this._addCheck({
					kind: "max",
					value: maxDate.getTime(),
					message: errorUtil.toString(message),
				})
			}
			get minDate() {
				let min = null
				for (const ch of this._def.checks)
					"min" === ch.kind &&
						(null === min || ch.value > min) &&
						(min = ch.value)
				return null != min ? new Date(min) : null
			}
			get maxDate() {
				let max = null
				for (const ch of this._def.checks)
					"max" === ch.kind &&
						(null === max || ch.value < max) &&
						(max = ch.value)
				return null != max ? new Date(max) : null
			}
		}
		ZodDate.create = params =>
			new ZodDate({
				checks: [],
				coerce: (null == params ? void 0 : params.coerce) || !1,
				typeName: ZodFirstPartyTypeKind.ZodDate,
				...processCreateParams(params),
			})
		class ZodSymbol extends ZodType {
			_parse(input) {
				if (this._getType(input) !== ZodParsedType.symbol) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.symbol,
						received: ctx.parsedType,
					})
					return INVALID
				}
				return OK(input.data)
			}
		}
		ZodSymbol.create = params =>
			new ZodSymbol({
				typeName: ZodFirstPartyTypeKind.ZodSymbol,
				...processCreateParams(params),
			})
		class ZodUndefined extends ZodType {
			_parse(input) {
				if (this._getType(input) !== ZodParsedType.undefined) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.undefined,
						received: ctx.parsedType,
					})
					return INVALID
				}
				return OK(input.data)
			}
		}
		ZodUndefined.create = params =>
			new ZodUndefined({
				typeName: ZodFirstPartyTypeKind.ZodUndefined,
				...processCreateParams(params),
			})
		class ZodNull extends ZodType {
			_parse(input) {
				if (this._getType(input) !== ZodParsedType.null) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.null,
						received: ctx.parsedType,
					})
					return INVALID
				}
				return OK(input.data)
			}
		}
		ZodNull.create = params =>
			new ZodNull({
				typeName: ZodFirstPartyTypeKind.ZodNull,
				...processCreateParams(params),
			})
		class ZodAny extends ZodType {
			constructor() {
				super(...arguments)
				this._any = !0
			}
			_parse(input) {
				return OK(input.data)
			}
		}
		ZodAny.create = params =>
			new ZodAny({
				typeName: ZodFirstPartyTypeKind.ZodAny,
				...processCreateParams(params),
			})
		class ZodUnknown extends ZodType {
			constructor() {
				super(...arguments)
				this._unknown = !0
			}
			_parse(input) {
				return OK(input.data)
			}
		}
		ZodUnknown.create = params =>
			new ZodUnknown({
				typeName: ZodFirstPartyTypeKind.ZodUnknown,
				...processCreateParams(params),
			})
		class ZodNever extends ZodType {
			_parse(input) {
				const ctx = this._getOrReturnCtx(input)
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_type,
					expected: ZodParsedType.never,
					received: ctx.parsedType,
				})
				return INVALID
			}
		}
		ZodNever.create = params =>
			new ZodNever({
				typeName: ZodFirstPartyTypeKind.ZodNever,
				...processCreateParams(params),
			})
		class ZodVoid extends ZodType {
			_parse(input) {
				if (this._getType(input) !== ZodParsedType.undefined) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.void,
						received: ctx.parsedType,
					})
					return INVALID
				}
				return OK(input.data)
			}
		}
		ZodVoid.create = params =>
			new ZodVoid({
				typeName: ZodFirstPartyTypeKind.ZodVoid,
				...processCreateParams(params),
			})
		class ZodArray extends ZodType {
			_parse(input) {
				const { ctx, status } = this._processInputParams(input),
					def = this._def
				if (ctx.parsedType !== ZodParsedType.array) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.array,
						received: ctx.parsedType,
					})
					return INVALID
				}
				if (null !== def.exactLength) {
					const tooBig = ctx.data.length > def.exactLength.value,
						tooSmall = ctx.data.length < def.exactLength.value
					if (tooBig || tooSmall) {
						addIssueToContext(ctx, {
							code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
							minimum: tooSmall ? def.exactLength.value : void 0,
							maximum: tooBig ? def.exactLength.value : void 0,
							type: "array",
							inclusive: !0,
							exact: !0,
							message: def.exactLength.message,
						})
						status.dirty()
					}
				}
				if (null !== def.minLength && ctx.data.length < def.minLength.value) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.too_small,
						minimum: def.minLength.value,
						type: "array",
						inclusive: !0,
						exact: !1,
						message: def.minLength.message,
					})
					status.dirty()
				}
				if (null !== def.maxLength && ctx.data.length > def.maxLength.value) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.too_big,
						maximum: def.maxLength.value,
						type: "array",
						inclusive: !0,
						exact: !1,
						message: def.maxLength.message,
					})
					status.dirty()
				}
				if (ctx.common.async)
					return Promise.all(
						[...ctx.data].map((item, i) =>
							def.type._parseAsync(
								new ParseInputLazyPath(ctx, item, ctx.path, i)
							)
						)
					).then(result => ParseStatus.mergeArray(status, result))
				const result = [...ctx.data].map((item, i) =>
					def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i))
				)
				return ParseStatus.mergeArray(status, result)
			}
			get element() {
				return this._def.type
			}
			min(minLength, message) {
				return new ZodArray({
					...this._def,
					minLength: { value: minLength, message: errorUtil.toString(message) },
				})
			}
			max(maxLength, message) {
				return new ZodArray({
					...this._def,
					maxLength: { value: maxLength, message: errorUtil.toString(message) },
				})
			}
			length(len, message) {
				return new ZodArray({
					...this._def,
					exactLength: { value: len, message: errorUtil.toString(message) },
				})
			}
			nonempty(message) {
				return this.min(1, message)
			}
		}
		ZodArray.create = (schema, params) =>
			new ZodArray({
				type: schema,
				minLength: null,
				maxLength: null,
				exactLength: null,
				typeName: ZodFirstPartyTypeKind.ZodArray,
				...processCreateParams(params),
			})
		function deepPartialify(schema) {
			if (schema instanceof ZodObject) {
				const newShape = {}
				for (const key in schema.shape) {
					const fieldSchema = schema.shape[key]
					newShape[key] = ZodOptional.create(deepPartialify(fieldSchema))
				}
				return new ZodObject({ ...schema._def, shape: () => newShape })
			}
			return schema instanceof ZodArray
				? new ZodArray({ ...schema._def, type: deepPartialify(schema.element) })
				: schema instanceof ZodOptional
				? ZodOptional.create(deepPartialify(schema.unwrap()))
				: schema instanceof ZodNullable
				? ZodNullable.create(deepPartialify(schema.unwrap()))
				: schema instanceof ZodTuple
				? ZodTuple.create(schema.items.map(item => deepPartialify(item)))
				: schema
		}
		class ZodObject extends ZodType {
			constructor() {
				super(...arguments)
				this._cached = null
				this.nonstrict = this.passthrough
				this.augment = this.extend
			}
			_getCached() {
				if (null !== this._cached) return this._cached
				const shape = this._def.shape(),
					keys = util.objectKeys(shape)
				return (this._cached = { shape, keys })
			}
			_parse(input) {
				if (this._getType(input) !== ZodParsedType.object) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.object,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const { status, ctx } = this._processInputParams(input),
					{ shape, keys: shapeKeys } = this._getCached(),
					extraKeys = []
				if (
					!(
						this._def.catchall instanceof ZodNever &&
						"strip" === this._def.unknownKeys
					)
				)
					for (const key in ctx.data)
						shapeKeys.includes(key) || extraKeys.push(key)
				const pairs = []
				for (const key of shapeKeys) {
					const keyValidator = shape[key],
						value = ctx.data[key]
					pairs.push({
						key: { status: "valid", value: key },
						value: keyValidator._parse(
							new ParseInputLazyPath(ctx, value, ctx.path, key)
						),
						alwaysSet: key in ctx.data,
					})
				}
				if (this._def.catchall instanceof ZodNever) {
					const unknownKeys = this._def.unknownKeys
					if ("passthrough" === unknownKeys)
						for (const key of extraKeys)
							pairs.push({
								key: { status: "valid", value: key },
								value: { status: "valid", value: ctx.data[key] },
							})
					else if ("strict" === unknownKeys) {
						if (extraKeys.length > 0) {
							addIssueToContext(ctx, {
								code: ZodIssueCode.unrecognized_keys,
								keys: extraKeys,
							})
							status.dirty()
						}
					} else if ("strip" !== unknownKeys)
						throw new Error(
							"Internal ZodObject error: invalid unknownKeys value."
						)
				} else {
					const catchall = this._def.catchall
					for (const key of extraKeys) {
						const value = ctx.data[key]
						pairs.push({
							key: { status: "valid", value: key },
							value: catchall._parse(
								new ParseInputLazyPath(ctx, value, ctx.path, key)
							),
							alwaysSet: key in ctx.data,
						})
					}
				}
				return ctx.common.async
					? Promise.resolve()
							.then(async () => {
								const syncPairs = []
								for (const pair of pairs) {
									const key = await pair.key
									syncPairs.push({
										key,
										value: await pair.value,
										alwaysSet: pair.alwaysSet,
									})
								}
								return syncPairs
							})
							.then(syncPairs => ParseStatus.mergeObjectSync(status, syncPairs))
					: ParseStatus.mergeObjectSync(status, pairs)
			}
			get shape() {
				return this._def.shape()
			}
			strict(message) {
				errorUtil.errToObj
				return new ZodObject({
					...this._def,
					unknownKeys: "strict",
					...(void 0 !== message
						? {
								errorMap: (issue, ctx) => {
									var _a, _b, _c, _d
									const defaultError =
										null !==
											(_c =
												null === (_b = (_a = this._def).errorMap) ||
												void 0 === _b
													? void 0
													: _b.call(_a, issue, ctx).message) && void 0 !== _c
											? _c
											: ctx.defaultError
									return "unrecognized_keys" === issue.code
										? {
												message:
													null !== (_d = errorUtil.errToObj(message).message) &&
													void 0 !== _d
														? _d
														: defaultError,
										  }
										: { message: defaultError }
								},
						  }
						: {}),
				})
			}
			strip() {
				return new ZodObject({ ...this._def, unknownKeys: "strip" })
			}
			passthrough() {
				return new ZodObject({ ...this._def, unknownKeys: "passthrough" })
			}
			extend(augmentation) {
				return new ZodObject({
					...this._def,
					shape: () => ({ ...this._def.shape(), ...augmentation }),
				})
			}
			merge(merging) {
				return new ZodObject({
					unknownKeys: merging._def.unknownKeys,
					catchall: merging._def.catchall,
					shape: () => ({ ...this._def.shape(), ...merging._def.shape() }),
					typeName: ZodFirstPartyTypeKind.ZodObject,
				})
			}
			setKey(key, schema) {
				return this.augment({ [key]: schema })
			}
			catchall(index) {
				return new ZodObject({ ...this._def, catchall: index })
			}
			pick(mask) {
				const shape = {}
				util.objectKeys(mask).forEach(key => {
					mask[key] && this.shape[key] && (shape[key] = this.shape[key])
				})
				return new ZodObject({ ...this._def, shape: () => shape })
			}
			omit(mask) {
				const shape = {}
				util.objectKeys(this.shape).forEach(key => {
					mask[key] || (shape[key] = this.shape[key])
				})
				return new ZodObject({ ...this._def, shape: () => shape })
			}
			deepPartial() {
				return deepPartialify(this)
			}
			partial(mask) {
				const newShape = {}
				util.objectKeys(this.shape).forEach(key => {
					const fieldSchema = this.shape[key]
					mask && !mask[key]
						? (newShape[key] = fieldSchema)
						: (newShape[key] = fieldSchema.optional())
				})
				return new ZodObject({ ...this._def, shape: () => newShape })
			}
			required(mask) {
				const newShape = {}
				util.objectKeys(this.shape).forEach(key => {
					if (mask && !mask[key]) newShape[key] = this.shape[key]
					else {
						let newField = this.shape[key]
						for (; newField instanceof ZodOptional; )
							newField = newField._def.innerType
						newShape[key] = newField
					}
				})
				return new ZodObject({ ...this._def, shape: () => newShape })
			}
			keyof() {
				return createZodEnum(util.objectKeys(this.shape))
			}
		}
		ZodObject.create = (shape, params) =>
			new ZodObject({
				shape: () => shape,
				unknownKeys: "strip",
				catchall: ZodNever.create(),
				typeName: ZodFirstPartyTypeKind.ZodObject,
				...processCreateParams(params),
			})
		ZodObject.strictCreate = (shape, params) =>
			new ZodObject({
				shape: () => shape,
				unknownKeys: "strict",
				catchall: ZodNever.create(),
				typeName: ZodFirstPartyTypeKind.ZodObject,
				...processCreateParams(params),
			})
		ZodObject.lazycreate = (shape, params) =>
			new ZodObject({
				shape,
				unknownKeys: "strip",
				catchall: ZodNever.create(),
				typeName: ZodFirstPartyTypeKind.ZodObject,
				...processCreateParams(params),
			})
		class ZodUnion extends ZodType {
			_parse(input) {
				const { ctx } = this._processInputParams(input),
					options = this._def.options
				if (ctx.common.async)
					return Promise.all(
						options.map(async option => {
							const childCtx = {
								...ctx,
								common: { ...ctx.common, issues: [] },
								parent: null,
							}
							return {
								result: await option._parseAsync({
									data: ctx.data,
									path: ctx.path,
									parent: childCtx,
								}),
								ctx: childCtx,
							}
						})
					).then(function (results) {
						for (const result of results)
							if ("valid" === result.result.status) return result.result
						for (const result of results)
							if ("dirty" === result.result.status) {
								ctx.common.issues.push(...result.ctx.common.issues)
								return result.result
							}
						const unionErrors = results.map(
							result => new ZodError(result.ctx.common.issues)
						)
						addIssueToContext(ctx, {
							code: ZodIssueCode.invalid_union,
							unionErrors,
						})
						return INVALID
					})
				{
					let dirty
					const issues = []
					for (const option of options) {
						const childCtx = {
								...ctx,
								common: { ...ctx.common, issues: [] },
								parent: null,
							},
							result = option._parseSync({
								data: ctx.data,
								path: ctx.path,
								parent: childCtx,
							})
						if ("valid" === result.status) return result
						"dirty" !== result.status ||
							dirty ||
							(dirty = { result, ctx: childCtx })
						childCtx.common.issues.length && issues.push(childCtx.common.issues)
					}
					if (dirty) {
						ctx.common.issues.push(...dirty.ctx.common.issues)
						return dirty.result
					}
					const unionErrors = issues.map(issues => new ZodError(issues))
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_union,
						unionErrors,
					})
					return INVALID
				}
			}
			get options() {
				return this._def.options
			}
		}
		ZodUnion.create = (types, params) =>
			new ZodUnion({
				options: types,
				typeName: ZodFirstPartyTypeKind.ZodUnion,
				...processCreateParams(params),
			})
		const getDiscriminator = type =>
			type instanceof ZodLazy
				? getDiscriminator(type.schema)
				: type instanceof ZodEffects
				? getDiscriminator(type.innerType())
				: type instanceof ZodLiteral
				? [type.value]
				: type instanceof ZodEnum
				? type.options
				: type instanceof ZodNativeEnum
				? Object.keys(type.enum)
				: type instanceof ZodDefault
				? getDiscriminator(type._def.innerType)
				: type instanceof ZodUndefined
				? [void 0]
				: type instanceof ZodNull
				? [null]
				: null
		class ZodDiscriminatedUnion extends ZodType {
			_parse(input) {
				const { ctx } = this._processInputParams(input)
				if (ctx.parsedType !== ZodParsedType.object) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.object,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const discriminator = this.discriminator,
					discriminatorValue = ctx.data[discriminator],
					option = this.optionsMap.get(discriminatorValue)
				if (!option) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_union_discriminator,
						options: Array.from(this.optionsMap.keys()),
						path: [discriminator],
					})
					return INVALID
				}
				return ctx.common.async
					? option._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
					: option._parseSync({ data: ctx.data, path: ctx.path, parent: ctx })
			}
			get discriminator() {
				return this._def.discriminator
			}
			get options() {
				return this._def.options
			}
			get optionsMap() {
				return this._def.optionsMap
			}
			static create(discriminator, options, params) {
				const optionsMap = new Map()
				for (const type of options) {
					const discriminatorValues = getDiscriminator(
						type.shape[discriminator]
					)
					if (!discriminatorValues)
						throw new Error(
							`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`
						)
					for (const value of discriminatorValues) {
						if (optionsMap.has(value))
							throw new Error(
								`Discriminator property ${String(
									discriminator
								)} has duplicate value ${String(value)}`
							)
						optionsMap.set(value, type)
					}
				}
				return new ZodDiscriminatedUnion({
					typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
					discriminator,
					options,
					optionsMap,
					...processCreateParams(params),
				})
			}
		}
		function mergeValues(a, b) {
			const aType = getParsedType(a),
				bType = getParsedType(b)
			if (a === b) return { valid: !0, data: a }
			if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
				const bKeys = util.objectKeys(b),
					sharedKeys = util
						.objectKeys(a)
						.filter(key => -1 !== bKeys.indexOf(key)),
					newObj = { ...a, ...b }
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key])
					if (!sharedValue.valid) return { valid: !1 }
					newObj[key] = sharedValue.data
				}
				return { valid: !0, data: newObj }
			}
			if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
				if (a.length !== b.length) return { valid: !1 }
				const newArray = []
				for (let index = 0; index < a.length; index++) {
					const sharedValue = mergeValues(a[index], b[index])
					if (!sharedValue.valid) return { valid: !1 }
					newArray.push(sharedValue.data)
				}
				return { valid: !0, data: newArray }
			}
			return aType === ZodParsedType.date &&
				bType === ZodParsedType.date &&
				+a == +b
				? { valid: !0, data: a }
				: { valid: !1 }
		}
		class ZodIntersection extends ZodType {
			_parse(input) {
				const { status, ctx } = this._processInputParams(input),
					handleParsed = (parsedLeft, parsedRight) => {
						if (isAborted(parsedLeft) || isAborted(parsedRight)) return INVALID
						const merged = mergeValues(parsedLeft.value, parsedRight.value)
						if (!merged.valid) {
							addIssueToContext(ctx, {
								code: ZodIssueCode.invalid_intersection_types,
							})
							return INVALID
						}
						;(isDirty(parsedLeft) || isDirty(parsedRight)) && status.dirty()
						return { status: status.value, value: merged.data }
					}
				return ctx.common.async
					? Promise.all([
							this._def.left._parseAsync({
								data: ctx.data,
								path: ctx.path,
								parent: ctx,
							}),
							this._def.right._parseAsync({
								data: ctx.data,
								path: ctx.path,
								parent: ctx,
							}),
					  ]).then(([left, right]) => handleParsed(left, right))
					: handleParsed(
							this._def.left._parseSync({
								data: ctx.data,
								path: ctx.path,
								parent: ctx,
							}),
							this._def.right._parseSync({
								data: ctx.data,
								path: ctx.path,
								parent: ctx,
							})
					  )
			}
		}
		ZodIntersection.create = (left, right, params) =>
			new ZodIntersection({
				left,
				right,
				typeName: ZodFirstPartyTypeKind.ZodIntersection,
				...processCreateParams(params),
			})
		class ZodTuple extends ZodType {
			_parse(input) {
				const { status, ctx } = this._processInputParams(input)
				if (ctx.parsedType !== ZodParsedType.array) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.array,
						received: ctx.parsedType,
					})
					return INVALID
				}
				if (ctx.data.length < this._def.items.length) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.too_small,
						minimum: this._def.items.length,
						inclusive: !0,
						exact: !1,
						type: "array",
					})
					return INVALID
				}
				if (!this._def.rest && ctx.data.length > this._def.items.length) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.too_big,
						maximum: this._def.items.length,
						inclusive: !0,
						exact: !1,
						type: "array",
					})
					status.dirty()
				}
				const items = [...ctx.data]
					.map((item, itemIndex) => {
						const schema = this._def.items[itemIndex] || this._def.rest
						return schema
							? schema._parse(
									new ParseInputLazyPath(ctx, item, ctx.path, itemIndex)
							  )
							: null
					})
					.filter(x => !!x)
				return ctx.common.async
					? Promise.all(items).then(results =>
							ParseStatus.mergeArray(status, results)
					  )
					: ParseStatus.mergeArray(status, items)
			}
			get items() {
				return this._def.items
			}
			rest(rest) {
				return new ZodTuple({ ...this._def, rest })
			}
		}
		ZodTuple.create = (schemas, params) => {
			if (!Array.isArray(schemas))
				throw new Error("You must pass an array of schemas to z.tuple([ ... ])")
			return new ZodTuple({
				items: schemas,
				typeName: ZodFirstPartyTypeKind.ZodTuple,
				rest: null,
				...processCreateParams(params),
			})
		}
		class ZodRecord extends ZodType {
			get keySchema() {
				return this._def.keyType
			}
			get valueSchema() {
				return this._def.valueType
			}
			_parse(input) {
				const { status, ctx } = this._processInputParams(input)
				if (ctx.parsedType !== ZodParsedType.object) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.object,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const pairs = [],
					keyType = this._def.keyType,
					valueType = this._def.valueType
				for (const key in ctx.data)
					pairs.push({
						key: keyType._parse(
							new ParseInputLazyPath(ctx, key, ctx.path, key)
						),
						value: valueType._parse(
							new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)
						),
					})
				return ctx.common.async
					? ParseStatus.mergeObjectAsync(status, pairs)
					: ParseStatus.mergeObjectSync(status, pairs)
			}
			get element() {
				return this._def.valueType
			}
			static create(first, second, third) {
				return new ZodRecord(
					second instanceof ZodType
						? {
								keyType: first,
								valueType: second,
								typeName: ZodFirstPartyTypeKind.ZodRecord,
								...processCreateParams(third),
						  }
						: {
								keyType: ZodString.create(),
								valueType: first,
								typeName: ZodFirstPartyTypeKind.ZodRecord,
								...processCreateParams(second),
						  }
				)
			}
		}
		class ZodMap extends ZodType {
			_parse(input) {
				const { status, ctx } = this._processInputParams(input)
				if (ctx.parsedType !== ZodParsedType.map) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.map,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const keyType = this._def.keyType,
					valueType = this._def.valueType,
					pairs = [...ctx.data.entries()].map(([key, value], index) => ({
						key: keyType._parse(
							new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])
						),
						value: valueType._parse(
							new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])
						),
					}))
				if (ctx.common.async) {
					const finalMap = new Map()
					return Promise.resolve().then(async () => {
						for (const pair of pairs) {
							const key = await pair.key,
								value = await pair.value
							if ("aborted" === key.status || "aborted" === value.status)
								return INVALID
							;("dirty" !== key.status && "dirty" !== value.status) ||
								status.dirty()
							finalMap.set(key.value, value.value)
						}
						return { status: status.value, value: finalMap }
					})
				}
				{
					const finalMap = new Map()
					for (const pair of pairs) {
						const key = pair.key,
							value = pair.value
						if ("aborted" === key.status || "aborted" === value.status)
							return INVALID
						;("dirty" !== key.status && "dirty" !== value.status) ||
							status.dirty()
						finalMap.set(key.value, value.value)
					}
					return { status: status.value, value: finalMap }
				}
			}
		}
		ZodMap.create = (keyType, valueType, params) =>
			new ZodMap({
				valueType,
				keyType,
				typeName: ZodFirstPartyTypeKind.ZodMap,
				...processCreateParams(params),
			})
		class ZodSet extends ZodType {
			_parse(input) {
				const { status, ctx } = this._processInputParams(input)
				if (ctx.parsedType !== ZodParsedType.set) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.set,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const def = this._def
				if (null !== def.minSize && ctx.data.size < def.minSize.value) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.too_small,
						minimum: def.minSize.value,
						type: "set",
						inclusive: !0,
						exact: !1,
						message: def.minSize.message,
					})
					status.dirty()
				}
				if (null !== def.maxSize && ctx.data.size > def.maxSize.value) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.too_big,
						maximum: def.maxSize.value,
						type: "set",
						inclusive: !0,
						exact: !1,
						message: def.maxSize.message,
					})
					status.dirty()
				}
				const valueType = this._def.valueType
				function finalizeSet(elements) {
					const parsedSet = new Set()
					for (const element of elements) {
						if ("aborted" === element.status) return INVALID
						"dirty" === element.status && status.dirty()
						parsedSet.add(element.value)
					}
					return { status: status.value, value: parsedSet }
				}
				const elements = [...ctx.data.values()].map((item, i) =>
					valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i))
				)
				return ctx.common.async
					? Promise.all(elements).then(elements => finalizeSet(elements))
					: finalizeSet(elements)
			}
			min(minSize, message) {
				return new ZodSet({
					...this._def,
					minSize: { value: minSize, message: errorUtil.toString(message) },
				})
			}
			max(maxSize, message) {
				return new ZodSet({
					...this._def,
					maxSize: { value: maxSize, message: errorUtil.toString(message) },
				})
			}
			size(size, message) {
				return this.min(size, message).max(size, message)
			}
			nonempty(message) {
				return this.min(1, message)
			}
		}
		ZodSet.create = (valueType, params) =>
			new ZodSet({
				valueType,
				minSize: null,
				maxSize: null,
				typeName: ZodFirstPartyTypeKind.ZodSet,
				...processCreateParams(params),
			})
		class ZodFunction extends ZodType {
			constructor() {
				super(...arguments)
				this.validate = this.implement
			}
			_parse(input) {
				const { ctx } = this._processInputParams(input)
				if (ctx.parsedType !== ZodParsedType.function) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.function,
						received: ctx.parsedType,
					})
					return INVALID
				}
				function makeArgsIssue(args, error) {
					return makeIssue({
						data: args,
						path: ctx.path,
						errorMaps: [
							ctx.common.contextualErrorMap,
							ctx.schemaErrorMap,
							getErrorMap(),
							errorMap,
						].filter(x => !!x),
						issueData: {
							code: ZodIssueCode.invalid_arguments,
							argumentsError: error,
						},
					})
				}
				function makeReturnsIssue(returns, error) {
					return makeIssue({
						data: returns,
						path: ctx.path,
						errorMaps: [
							ctx.common.contextualErrorMap,
							ctx.schemaErrorMap,
							getErrorMap(),
							errorMap,
						].filter(x => !!x),
						issueData: {
							code: ZodIssueCode.invalid_return_type,
							returnTypeError: error,
						},
					})
				}
				const params = { errorMap: ctx.common.contextualErrorMap },
					fn = ctx.data
				return this._def.returns instanceof ZodPromise
					? OK(async (...args) => {
							const error = new ZodError([]),
								parsedArgs = await this._def.args
									.parseAsync(args, params)
									.catch(e => {
										error.addIssue(makeArgsIssue(args, e))
										throw error
									}),
								result = await fn(...parsedArgs)
							return await this._def.returns._def.type
								.parseAsync(result, params)
								.catch(e => {
									error.addIssue(makeReturnsIssue(result, e))
									throw error
								})
					  })
					: OK((...args) => {
							const parsedArgs = this._def.args.safeParse(args, params)
							if (!parsedArgs.success)
								throw new ZodError([makeArgsIssue(args, parsedArgs.error)])
							const result = fn(...parsedArgs.data),
								parsedReturns = this._def.returns.safeParse(result, params)
							if (!parsedReturns.success)
								throw new ZodError([
									makeReturnsIssue(result, parsedReturns.error),
								])
							return parsedReturns.data
					  })
			}
			parameters() {
				return this._def.args
			}
			returnType() {
				return this._def.returns
			}
			args(...items) {
				return new ZodFunction({
					...this._def,
					args: ZodTuple.create(items).rest(ZodUnknown.create()),
				})
			}
			returns(returnType) {
				return new ZodFunction({ ...this._def, returns: returnType })
			}
			implement(func) {
				return this.parse(func)
			}
			strictImplement(func) {
				return this.parse(func)
			}
			static create(args, returns, params) {
				return new ZodFunction({
					args: args || ZodTuple.create([]).rest(ZodUnknown.create()),
					returns: returns || ZodUnknown.create(),
					typeName: ZodFirstPartyTypeKind.ZodFunction,
					...processCreateParams(params),
				})
			}
		}
		class ZodLazy extends ZodType {
			get schema() {
				return this._def.getter()
			}
			_parse(input) {
				const { ctx } = this._processInputParams(input)
				return this._def
					.getter()
					._parse({ data: ctx.data, path: ctx.path, parent: ctx })
			}
		}
		ZodLazy.create = (getter, params) =>
			new ZodLazy({
				getter,
				typeName: ZodFirstPartyTypeKind.ZodLazy,
				...processCreateParams(params),
			})
		class ZodLiteral extends ZodType {
			_parse(input) {
				if (input.data !== this._def.value) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						received: ctx.data,
						code: ZodIssueCode.invalid_literal,
						expected: this._def.value,
					})
					return INVALID
				}
				return { status: "valid", value: input.data }
			}
			get value() {
				return this._def.value
			}
		}
		ZodLiteral.create = (value, params) =>
			new ZodLiteral({
				value,
				typeName: ZodFirstPartyTypeKind.ZodLiteral,
				...processCreateParams(params),
			})
		function createZodEnum(values, params) {
			return new ZodEnum({
				values,
				typeName: ZodFirstPartyTypeKind.ZodEnum,
				...processCreateParams(params),
			})
		}
		class ZodEnum extends ZodType {
			_parse(input) {
				if ("string" != typeof input.data) {
					const ctx = this._getOrReturnCtx(input),
						expectedValues = this._def.values
					addIssueToContext(ctx, {
						expected: util.joinValues(expectedValues),
						received: ctx.parsedType,
						code: ZodIssueCode.invalid_type,
					})
					return INVALID
				}
				if (-1 === this._def.values.indexOf(input.data)) {
					const ctx = this._getOrReturnCtx(input),
						expectedValues = this._def.values
					addIssueToContext(ctx, {
						received: ctx.data,
						code: ZodIssueCode.invalid_enum_value,
						options: expectedValues,
					})
					return INVALID
				}
				return OK(input.data)
			}
			get options() {
				return this._def.values
			}
			get enum() {
				const enumValues = {}
				for (const val of this._def.values) enumValues[val] = val
				return enumValues
			}
			get Values() {
				const enumValues = {}
				for (const val of this._def.values) enumValues[val] = val
				return enumValues
			}
			get Enum() {
				const enumValues = {}
				for (const val of this._def.values) enumValues[val] = val
				return enumValues
			}
			extract(values) {
				return ZodEnum.create(values)
			}
			exclude(values) {
				return ZodEnum.create(this.options.filter(opt => !values.includes(opt)))
			}
		}
		ZodEnum.create = createZodEnum
		class ZodNativeEnum extends ZodType {
			_parse(input) {
				const nativeEnumValues = util.getValidEnumValues(this._def.values),
					ctx = this._getOrReturnCtx(input)
				if (
					ctx.parsedType !== ZodParsedType.string &&
					ctx.parsedType !== ZodParsedType.number
				) {
					const expectedValues = util.objectValues(nativeEnumValues)
					addIssueToContext(ctx, {
						expected: util.joinValues(expectedValues),
						received: ctx.parsedType,
						code: ZodIssueCode.invalid_type,
					})
					return INVALID
				}
				if (-1 === nativeEnumValues.indexOf(input.data)) {
					const expectedValues = util.objectValues(nativeEnumValues)
					addIssueToContext(ctx, {
						received: ctx.data,
						code: ZodIssueCode.invalid_enum_value,
						options: expectedValues,
					})
					return INVALID
				}
				return OK(input.data)
			}
			get enum() {
				return this._def.values
			}
		}
		ZodNativeEnum.create = (values, params) =>
			new ZodNativeEnum({
				values,
				typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
				...processCreateParams(params),
			})
		class ZodPromise extends ZodType {
			unwrap() {
				return this._def.type
			}
			_parse(input) {
				const { ctx } = this._processInputParams(input)
				if (
					ctx.parsedType !== ZodParsedType.promise &&
					!1 === ctx.common.async
				) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.promise,
						received: ctx.parsedType,
					})
					return INVALID
				}
				const promisified =
					ctx.parsedType === ZodParsedType.promise
						? ctx.data
						: Promise.resolve(ctx.data)
				return OK(
					promisified.then(data =>
						this._def.type.parseAsync(data, {
							path: ctx.path,
							errorMap: ctx.common.contextualErrorMap,
						})
					)
				)
			}
		}
		ZodPromise.create = (schema, params) =>
			new ZodPromise({
				type: schema,
				typeName: ZodFirstPartyTypeKind.ZodPromise,
				...processCreateParams(params),
			})
		class ZodEffects extends ZodType {
			innerType() {
				return this._def.schema
			}
			sourceType() {
				return this._def.schema._def.typeName ===
					ZodFirstPartyTypeKind.ZodEffects
					? this._def.schema.sourceType()
					: this._def.schema
			}
			_parse(input) {
				const { status, ctx } = this._processInputParams(input),
					effect = this._def.effect || null
				if ("preprocess" === effect.type) {
					const processed = effect.transform(ctx.data)
					return ctx.common.async
						? Promise.resolve(processed).then(processed =>
								this._def.schema._parseAsync({
									data: processed,
									path: ctx.path,
									parent: ctx,
								})
						  )
						: this._def.schema._parseSync({
								data: processed,
								path: ctx.path,
								parent: ctx,
						  })
				}
				const checkCtx = {
					addIssue: arg => {
						addIssueToContext(ctx, arg)
						arg.fatal ? status.abort() : status.dirty()
					},
					get path() {
						return ctx.path
					},
				}
				checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx)
				if ("refinement" === effect.type) {
					const executeRefinement = acc => {
						const result = effect.refinement(acc, checkCtx)
						if (ctx.common.async) return Promise.resolve(result)
						if (result instanceof Promise)
							throw new Error(
								"Async refinement encountered during synchronous parse operation. Use .parseAsync instead."
							)
						return acc
					}
					if (!1 === ctx.common.async) {
						const inner = this._def.schema._parseSync({
							data: ctx.data,
							path: ctx.path,
							parent: ctx,
						})
						if ("aborted" === inner.status) return INVALID
						"dirty" === inner.status && status.dirty()
						executeRefinement(inner.value)
						return { status: status.value, value: inner.value }
					}
					return this._def.schema
						._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
						.then(inner => {
							if ("aborted" === inner.status) return INVALID
							"dirty" === inner.status && status.dirty()
							return executeRefinement(inner.value).then(() => ({
								status: status.value,
								value: inner.value,
							}))
						})
				}
				if ("transform" === effect.type) {
					if (!1 === ctx.common.async) {
						const base = this._def.schema._parseSync({
							data: ctx.data,
							path: ctx.path,
							parent: ctx,
						})
						if (!isValid(base)) return base
						const result = effect.transform(base.value, checkCtx)
						if (result instanceof Promise)
							throw new Error(
								"Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead."
							)
						return { status: status.value, value: result }
					}
					return this._def.schema
						._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
						.then(base =>
							isValid(base)
								? Promise.resolve(effect.transform(base.value, checkCtx)).then(
										result => ({ status: status.value, value: result })
								  )
								: base
						)
				}
				util.assertNever(effect)
			}
		}
		ZodEffects.create = (schema, effect, params) =>
			new ZodEffects({
				schema,
				typeName: ZodFirstPartyTypeKind.ZodEffects,
				effect,
				...processCreateParams(params),
			})
		ZodEffects.createWithPreprocess = (preprocess, schema, params) =>
			new ZodEffects({
				schema,
				effect: { type: "preprocess", transform: preprocess },
				typeName: ZodFirstPartyTypeKind.ZodEffects,
				...processCreateParams(params),
			})
		class ZodOptional extends ZodType {
			_parse(input) {
				return this._getType(input) === ZodParsedType.undefined
					? OK(void 0)
					: this._def.innerType._parse(input)
			}
			unwrap() {
				return this._def.innerType
			}
		}
		ZodOptional.create = (type, params) =>
			new ZodOptional({
				innerType: type,
				typeName: ZodFirstPartyTypeKind.ZodOptional,
				...processCreateParams(params),
			})
		class ZodNullable extends ZodType {
			_parse(input) {
				return this._getType(input) === ZodParsedType.null
					? OK(null)
					: this._def.innerType._parse(input)
			}
			unwrap() {
				return this._def.innerType
			}
		}
		ZodNullable.create = (type, params) =>
			new ZodNullable({
				innerType: type,
				typeName: ZodFirstPartyTypeKind.ZodNullable,
				...processCreateParams(params),
			})
		class ZodDefault extends ZodType {
			_parse(input) {
				const { ctx } = this._processInputParams(input)
				let data = ctx.data
				ctx.parsedType === ZodParsedType.undefined &&
					(data = this._def.defaultValue())
				return this._def.innerType._parse({ data, path: ctx.path, parent: ctx })
			}
			removeDefault() {
				return this._def.innerType
			}
		}
		ZodDefault.create = (type, params) =>
			new ZodDefault({
				innerType: type,
				typeName: ZodFirstPartyTypeKind.ZodDefault,
				defaultValue:
					"function" == typeof params.default
						? params.default
						: () => params.default,
				...processCreateParams(params),
			})
		class ZodCatch extends ZodType {
			_parse(input) {
				const { ctx } = this._processInputParams(input),
					newCtx = { ...ctx, common: { ...ctx.common, issues: [] } },
					result = this._def.innerType._parse({
						data: newCtx.data,
						path: newCtx.path,
						parent: { ...newCtx },
					})
				return isAsync(result)
					? result.then(result => ({
							status: "valid",
							value:
								"valid" === result.status
									? result.value
									: this._def.catchValue({
											get error() {
												return new ZodError(newCtx.common.issues)
											},
											input: newCtx.data,
									  }),
					  }))
					: {
							status: "valid",
							value:
								"valid" === result.status
									? result.value
									: this._def.catchValue({
											get error() {
												return new ZodError(newCtx.common.issues)
											},
											input: newCtx.data,
									  }),
					  }
			}
			removeCatch() {
				return this._def.innerType
			}
		}
		ZodCatch.create = (type, params) =>
			new ZodCatch({
				innerType: type,
				typeName: ZodFirstPartyTypeKind.ZodCatch,
				catchValue:
					"function" == typeof params.catch ? params.catch : () => params.catch,
				...processCreateParams(params),
			})
		class ZodNaN extends ZodType {
			_parse(input) {
				if (this._getType(input) !== ZodParsedType.nan) {
					const ctx = this._getOrReturnCtx(input)
					addIssueToContext(ctx, {
						code: ZodIssueCode.invalid_type,
						expected: ZodParsedType.nan,
						received: ctx.parsedType,
					})
					return INVALID
				}
				return { status: "valid", value: input.data }
			}
		}
		ZodNaN.create = params =>
			new ZodNaN({
				typeName: ZodFirstPartyTypeKind.ZodNaN,
				...processCreateParams(params),
			})
		const BRAND = Symbol("zod_brand")
		class ZodBranded extends ZodType {
			_parse(input) {
				const { ctx } = this._processInputParams(input),
					data = ctx.data
				return this._def.type._parse({ data, path: ctx.path, parent: ctx })
			}
			unwrap() {
				return this._def.type
			}
		}
		class ZodPipeline extends ZodType {
			_parse(input) {
				const { status, ctx } = this._processInputParams(input)
				if (ctx.common.async)
					return (async () => {
						const inResult = await this._def.in._parseAsync({
							data: ctx.data,
							path: ctx.path,
							parent: ctx,
						})
						if ("aborted" === inResult.status) return INVALID
						if ("dirty" === inResult.status) {
							status.dirty()
							return DIRTY(inResult.value)
						}
						return this._def.out._parseAsync({
							data: inResult.value,
							path: ctx.path,
							parent: ctx,
						})
					})()
				{
					const inResult = this._def.in._parseSync({
						data: ctx.data,
						path: ctx.path,
						parent: ctx,
					})
					if ("aborted" === inResult.status) return INVALID
					if ("dirty" === inResult.status) {
						status.dirty()
						return { status: "dirty", value: inResult.value }
					}
					return this._def.out._parseSync({
						data: inResult.value,
						path: ctx.path,
						parent: ctx,
					})
				}
			}
			static create(a, b) {
				return new ZodPipeline({
					in: a,
					out: b,
					typeName: ZodFirstPartyTypeKind.ZodPipeline,
				})
			}
		}
		const custom = (check, params = {}, fatal) =>
				check
					? ZodAny.create().superRefine((data, ctx) => {
							var _a, _b
							if (!check(data)) {
								const p =
										"function" == typeof params
											? params(data)
											: "string" == typeof params
											? { message: params }
											: params,
									_fatal =
										null ===
											(_b =
												null !== (_a = p.fatal) && void 0 !== _a
													? _a
													: fatal) ||
										void 0 === _b ||
										_b,
									p2 = "string" == typeof p ? { message: p } : p
								ctx.addIssue({ code: "custom", ...p2, fatal: _fatal })
							}
					  })
					: ZodAny.create(),
			late = { object: ZodObject.lazycreate }
		var ZodFirstPartyTypeKind
		!(function (ZodFirstPartyTypeKind) {
			ZodFirstPartyTypeKind.ZodString = "ZodString"
			ZodFirstPartyTypeKind.ZodNumber = "ZodNumber"
			ZodFirstPartyTypeKind.ZodNaN = "ZodNaN"
			ZodFirstPartyTypeKind.ZodBigInt = "ZodBigInt"
			ZodFirstPartyTypeKind.ZodBoolean = "ZodBoolean"
			ZodFirstPartyTypeKind.ZodDate = "ZodDate"
			ZodFirstPartyTypeKind.ZodSymbol = "ZodSymbol"
			ZodFirstPartyTypeKind.ZodUndefined = "ZodUndefined"
			ZodFirstPartyTypeKind.ZodNull = "ZodNull"
			ZodFirstPartyTypeKind.ZodAny = "ZodAny"
			ZodFirstPartyTypeKind.ZodUnknown = "ZodUnknown"
			ZodFirstPartyTypeKind.ZodNever = "ZodNever"
			ZodFirstPartyTypeKind.ZodVoid = "ZodVoid"
			ZodFirstPartyTypeKind.ZodArray = "ZodArray"
			ZodFirstPartyTypeKind.ZodObject = "ZodObject"
			ZodFirstPartyTypeKind.ZodUnion = "ZodUnion"
			ZodFirstPartyTypeKind.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"
			ZodFirstPartyTypeKind.ZodIntersection = "ZodIntersection"
			ZodFirstPartyTypeKind.ZodTuple = "ZodTuple"
			ZodFirstPartyTypeKind.ZodRecord = "ZodRecord"
			ZodFirstPartyTypeKind.ZodMap = "ZodMap"
			ZodFirstPartyTypeKind.ZodSet = "ZodSet"
			ZodFirstPartyTypeKind.ZodFunction = "ZodFunction"
			ZodFirstPartyTypeKind.ZodLazy = "ZodLazy"
			ZodFirstPartyTypeKind.ZodLiteral = "ZodLiteral"
			ZodFirstPartyTypeKind.ZodEnum = "ZodEnum"
			ZodFirstPartyTypeKind.ZodEffects = "ZodEffects"
			ZodFirstPartyTypeKind.ZodNativeEnum = "ZodNativeEnum"
			ZodFirstPartyTypeKind.ZodOptional = "ZodOptional"
			ZodFirstPartyTypeKind.ZodNullable = "ZodNullable"
			ZodFirstPartyTypeKind.ZodDefault = "ZodDefault"
			ZodFirstPartyTypeKind.ZodCatch = "ZodCatch"
			ZodFirstPartyTypeKind.ZodPromise = "ZodPromise"
			ZodFirstPartyTypeKind.ZodBranded = "ZodBranded"
			ZodFirstPartyTypeKind.ZodPipeline = "ZodPipeline"
		})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}))
		const stringType = ZodString.create,
			numberType = ZodNumber.create,
			nanType = ZodNaN.create,
			bigIntType = ZodBigInt.create,
			booleanType = ZodBoolean.create,
			dateType = ZodDate.create,
			symbolType = ZodSymbol.create,
			undefinedType = ZodUndefined.create,
			nullType = ZodNull.create,
			anyType = ZodAny.create,
			unknownType = ZodUnknown.create,
			neverType = ZodNever.create,
			voidType = ZodVoid.create,
			arrayType = ZodArray.create,
			objectType = ZodObject.create,
			strictObjectType = ZodObject.strictCreate,
			unionType = ZodUnion.create,
			discriminatedUnionType = ZodDiscriminatedUnion.create,
			intersectionType = ZodIntersection.create,
			tupleType = ZodTuple.create,
			recordType = ZodRecord.create,
			lib_mapType = ZodMap.create,
			setType = ZodSet.create,
			functionType = ZodFunction.create,
			lazyType = ZodLazy.create,
			literalType = ZodLiteral.create,
			enumType = ZodEnum.create,
			nativeEnumType = ZodNativeEnum.create,
			promiseType = ZodPromise.create,
			effectsType = ZodEffects.create,
			optionalType = ZodOptional.create,
			nullableType = ZodNullable.create,
			preprocessType = ZodEffects.createWithPreprocess,
			pipelineType = ZodPipeline.create,
			coerce = {
				string: arg => ZodString.create({ ...arg, coerce: !0 }),
				number: arg => ZodNumber.create({ ...arg, coerce: !0 }),
				boolean: arg => ZodBoolean.create({ ...arg, coerce: !0 }),
				bigint: arg => ZodBigInt.create({ ...arg, coerce: !0 }),
				date: arg => ZodDate.create({ ...arg, coerce: !0 }),
			},
			NEVER = INVALID
		var z = Object.freeze({
			__proto__: null,
			defaultErrorMap: errorMap,
			setErrorMap: function (map) {
				overrideErrorMap = map
			},
			getErrorMap,
			makeIssue,
			EMPTY_PATH: [],
			addIssueToContext,
			ParseStatus,
			INVALID,
			DIRTY,
			OK,
			isAborted,
			isDirty,
			isValid,
			isAsync,
			get util() {
				return util
			},
			get objectUtil() {
				return objectUtil
			},
			ZodParsedType,
			getParsedType,
			ZodType,
			ZodString,
			ZodNumber,
			ZodBigInt,
			ZodBoolean,
			ZodDate,
			ZodSymbol,
			ZodUndefined,
			ZodNull,
			ZodAny,
			ZodUnknown,
			ZodNever,
			ZodVoid,
			ZodArray,
			ZodObject,
			ZodUnion,
			ZodDiscriminatedUnion,
			ZodIntersection,
			ZodTuple,
			ZodRecord,
			ZodMap,
			ZodSet,
			ZodFunction,
			ZodLazy,
			ZodLiteral,
			ZodEnum,
			ZodNativeEnum,
			ZodPromise,
			ZodEffects,
			ZodTransformer: ZodEffects,
			ZodOptional,
			ZodNullable,
			ZodDefault,
			ZodCatch,
			ZodNaN,
			BRAND,
			ZodBranded,
			ZodPipeline,
			custom,
			Schema: ZodType,
			ZodSchema: ZodType,
			late,
			get ZodFirstPartyTypeKind() {
				return ZodFirstPartyTypeKind
			},
			coerce,
			any: anyType,
			array: arrayType,
			bigint: bigIntType,
			boolean: booleanType,
			date: dateType,
			discriminatedUnion: discriminatedUnionType,
			effect: effectsType,
			enum: enumType,
			function: functionType,
			instanceof: (
				cls,
				params = { message: `Input not instance of ${cls.name}` }
			) => custom(data => data instanceof cls, params),
			intersection: intersectionType,
			lazy: lazyType,
			literal: literalType,
			map: lib_mapType,
			nan: nanType,
			nativeEnum: nativeEnumType,
			never: neverType,
			null: nullType,
			nullable: nullableType,
			number: numberType,
			object: objectType,
			oboolean: () => booleanType().optional(),
			onumber: () => numberType().optional(),
			optional: optionalType,
			ostring: () => stringType().optional(),
			pipeline: pipelineType,
			preprocess: preprocessType,
			promise: promiseType,
			record: recordType,
			set: setType,
			strictObject: strictObjectType,
			string: stringType,
			symbol: symbolType,
			transformer: effectsType,
			tuple: tupleType,
			undefined: undefinedType,
			union: unionType,
			unknown: unknownType,
			void: voidType,
			NEVER,
			ZodIssueCode,
			quotelessJson: obj =>
				JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, "$1:"),
			ZodError,
		})
		const configEffect = (k, v) => c => () =>
				runPromise(c.provideLog(c.setConfig[k](v))),
			stepTiming = stepCount => `steps(${stepCount}, jump-end)`,
			setComputed = {
				useStepTiming: v => c => s =>
					pipe(
						v ? stepTiming(Editable_value(s.timingStepCount)) : "linear",
						timingFunction => [
							{ ...s, timingFunction },
							configEffect("timingFunction", timingFunction)(c),
						]
					),
			},
			settingUI_setComputed = setComputed,
			setRange = keyA => keyB => bFn => vA => commander => s =>
				pipe(
					{ a: Editable_value(vA) },
					Identity_let_("b", ({ a }) => bFn(a)(Editable_value(s[keyB]))),
					({ a, b }) =>
						pipe(
							[configEffect(keyA, a), configEffect(keyB, b)],
							xs => c =>
								pipe(
									xs,
									ReadonlyArray_map(x => x(c)),
									effects => [
										{ ...s, [keyA]: vA, [keyB]: setValue(b)(s[keyB]) },
										...effects,
									]
								)
						)(commander)
				),
			setState = {
				flowY1: setRange("flowY1")("flowY2")(a => b => Math.max(b, a + 0.05)),
				flowY2: setRange("flowY2")("flowY1")(a => b => Math.min(b, a - 0.05)),
				flowX1: setRange("flowX1")("flowX2")(a => b => Math.max(b, a + 0.05)),
				flowX2: setRange("flowX2")("flowX1")(a => b => Math.min(b, a - 0.05)),
				timingStepCount: v => c => s =>
					pipe(stepTiming(Editable_value(v)), timingFunction => [
						{ ...s, timingStepCount: v, timingFunction },
						configEffect("timingFunction", timingFunction)(c),
					]),
			},
			settingUI_setState = setState,
			updateAt = k => v =>
				pipe(
					k in settingUI_setComputed
						? settingUI_setComputed[k](v)
						: k in settingUI_setState
						? settingUI_setState[k](v)
						: c => s =>
								[
									{ ...s, [k]: v },
									...(k in c.setConfig && "filterExp" !== k
										? [
												configEffect(
													k,
													Array.isArray(v) &&
														2 === v.length &&
														isEditable(k)(v[0])
														? Editable_value(v)
														: v
												)(c),
										  ]
										: []),
								]
				),
			checkboxNode = label => c => s => {
				return ((label, checked, onchange) =>
					h(
						"div",
						{},
						h("label", {}, [
							hyperapp_text(label),
							h("input", { type: "checkbox", checked, onchange }),
						])
					))(
					getText(label)(s.lang),
					getState(label)(s),
					((key = label),
					flip((s, e) =>
						pipe(
							(e =>
								z.instanceof(HTMLInputElement).parse(e.currentTarget).checked)(
								e
							),
							updateAt(key),
							flip,
							apply(s)
						)
					))(c)
				)
				var key
			},
			mapSettingNodes = f => xs => c => s =>
				pipe(
					xs,
					ReadonlyArray_map(x => x(c)(s)),
					f
				),
			errorText = subject => edit =>
				pipe(
					edit,
					error,
					Option_map(x => `${subject}${"" === x ? "" : ": "}${x}`),
					getOrElse(constant(""))
				),
			rangeRow = (min, max, step, action) => value =>
				h("div", {}, [
					h("input", {
						style: { width: "150px", verticalAlign: "middle" },
						type: "range",
						min,
						max,
						step,
						value: Editable_value(value).toString(),
						oninput: action.onchange,
					}),
					h("input", {
						style: {
							width: "30px",
							backgroundColor: "transparent",
							color: "inherit",
							borderWidth: "1px",
							verticalAlign: "middle",
							borderColor: hasError(value) ? "#f55" : void 0,
						},
						inputmode: "decimal",
						value: pipe(
							value,
							Editable_text,
							getOrElse(
								constant(
									Editable_value(value)
										.toFixed(4)
										.replace(/\.?0+$/, "")
								)
							)
						),
						...action,
					}),
				]),
			settingRow = (label, error, content) =>
				h("div", {}, [
					h("span", {}, hyperapp_text(label)),
					h(
						"span",
						{
							style: {
								color: "#f55",
								marginLeft: "5px",
								whiteSpace: "pre-wrap",
							},
						},
						hyperapp_text(error)
					),
					h("div", {}, content),
				]),
			setter_setEditNumber = editing => value => state =>
				pipe(
					value,
					Number.parseFloat,
					editing
						? x =>
								Number.isNaN(x) || "." === value.at(-1)
									? pipe(state, setText(value))
									: fromValueText(x)(value)
						: x =>
								Number.isNaN(x)
									? pipe(
											state,
											mapSecond(constant(Option_some([value, Option_some("")])))
									  )
									: Editable_of(x)
				),
			updateInput = (
				(getState, updateAt) => key => setter => c => (s, e) =>
					pipe(
						(e => {
							const target = e.currentTarget ?? e.__target
							if (
								target instanceof HTMLSelectElement ||
								target instanceof HTMLTextAreaElement ||
								target instanceof HTMLInputElement
							)
								return target.value
							throw Error("Event target type isn't acceptable.")
						})(e),
						setter,
						apply(getState(key)(s)),
						updateAt(key),
						x => x(c)(s)
					)
			)(getState, updateAt),
			editAction = (key, setter) => c => ({
				oninput: updateInput(key)(setter(!0))(c),
				onchange: updateInput(key)(setter(!1))(c),
			}),
			numberNode = (label, min, max, step) => c => s =>
				settingRow(
					getText(label)(s.lang),
					errorText(getText("inputNonNumberic")(s.lang))(s[label]),
					[
						rangeRow(
							min,
							max,
							step,
							editAction(label, setter_setEditNumber)(c)
						)(getState(label)(s)),
					]
				),
			settingUI_chatFieldPanel = pipe(
				[
					pipe(
						[
							numberNode("fieldScale", 0.7, 1.5, 0.05),
							checkboxNode("simplifyChatField"),
							checkboxNode("createBanButton"),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(644) }, x))
					),
				],
				mapSettingNodes(Function_identity)
			),
			action = {
				copy: () => s =>
					Effect_map(
						Effect_promise(async () => {
							return GM.setClipboard(
								((x = s.eventLog),
								`<pre>${JSON.stringify({
									nextId: x.nextId,
									blocks: pipe(
										x.compressedBlocks,
										ReadonlyArray_map(
											external_LZString_namespaceObject.decompressFromUTF16
										),
										append(JSON.stringify(x.lastBlock)),
										mapNonEmpty(
											external_LZString_namespaceObject.compressToEncodedURIComponent
										)
									),
								})}</pre>`)
							)
							var x
						}),
						() => s
					),
				clearFlowChats: c => s => Effect_map(c.act.clearFlowChats, () => s),
				importLog: () => s =>
					pipe(
						Effect_promise(() =>
							external_Swal_default().fire({
								input: "textarea",
								inputLabel: getText("importLog")(s.lang),
							})
						),
						Effect_map(x =>
							x.isConfirmed ? { ...s, eventLog: importLog(x.value ?? "") } : s
						)
					),
			},
			buttonNode = label => c => state =>
				h(
					"button",
					{
						type: "button",
						onclick: s => [
							s,
							d =>
								runPromise(
									c.provideLog(
										pipe(
											action[label](c)(s),
											Effect_flatMap(newS => Effect_sync(() => d(newS)))
										)
									)
								),
						],
					},
					hyperapp_text(getText(label)(state.lang))
				),
			feedbackPanel = c => s =>
				pipe(
					getState("eventLog")(s).compressedBlocks.length + 1,
					logPageCount => [
						pipe(
							[checkboxNode("logEvents"), buttonNode("importLog")],
							mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x))
						)(c)(s),
						h("div", { style: panelBoxStyle(428) }, [
							h(
								"a",
								{
									style: { color: "#f0f" },
									href: "https://greasyfork.org/en/scripts/411442-flow-youtube-chat/feedback",
									target: "_blank",
								},
								hyperapp_text(getText("giveFeedback")(s.lang))
							),
							h("div", {}, [
								h("span", {}, hyperapp_text(getText("eventLog")(s.lang))),
								buttonNode("copy")(c)(s),
								tabContainer({
									container: {},
									label: { padding: "4px", width: "2em", textAlign: "center" },
									labelFocus: { background: "#666" },
									tab: {
										height: "251px",
										display: "flex",
										flexDirection: "column",
										padding: "6px",
									},
								})((_, n) => updateAt("logTab")(n)(c))(
									pipe(makeBy(logPageCount, x => `${x}`))
								)(
									pipe(getState("eventLog")(s), l =>
										makeBy(
											logPageCount,
											i => () =>
												pipe(
													ReadonlyArray_get(l.compressedBlocks, i),
													Option_map(decompressBlock),
													getOrElse(() => l.lastBlock),
													ReadonlyArray_map((x, j) =>
														h("div", { style: { display: "flex" } }, [
															h(
																"div",
																{
																	style: {
																		userSelect: "none",
																		flex: "0 0 2em",
																	},
																},
																hyperapp_text(x.id)
															),
															h(
																"div",
																{
																	style: {
																		background: j % 2 == 0 ? "#fff" : "#ddd",
																		color: "#000",
																		flex: "auto",
																		wordBreak: "break-all",
																		whiteSpace: "break-spaces",
																		padding: "0 2px",
																	},
																},
																hyperapp_text(`[${x.level}] ${x.text}`)
															),
														])
													)
												)
										)
									)
								)(getState("logTab")(s)),
							]),
						]),
					]
				),
			setter_setEditRegexes = editing => value =>
				pipe(
					value,
					split(/\r\n|\n/),
					ReadonlyArray_filter(not(isEmpty)),
					Identity_bindTo("regexes"),
					Identity_let_("errors", ({ regexes }) =>
						pipe(
							regexes,
							ReadonlyArray_map((x, i) => {
								try {
									RegExp(x, "u")
									return Option_none()
								} catch (e) {
									return Option_some(`${e} in regex number ${i}`)
								}
							}),
							(Semigroup =>
								fromSemigroup(
									Semigroup_make((self, that) =>
										Option_isNone(self)
											? that
											: Option_isNone(that)
											? self
											: Option_some(Semigroup.combine(self.value, that.value))
									),
									Option_none()
								))(intercalate("\n")(Semigroup)).combineAll
						)
					),
					ctx =>
						editing
							? setText(value)
							: pipe(
									ctx.errors,
									Option_map(x =>
										mapSecond(() => Option_some([value, Option_some(x)]))
									),
									getOrElse(() => () => Editable_of(ctx.regexes))
							  )
				),
			setter_setEditStrings = editing => value =>
				pipe(value, split(/\r\n|\n/), ReadonlyArray_filter(not(isEmpty)), x =>
					constant(
						editing ? [x, Option_some([value, Option_none()])] : Editable_of(x)
					)
				),
			textAreaRow = (rows, action) => value =>
				h("textarea", {
					rows,
					style: {
						resize: "none",
						boxSizing: "border-box",
						width: "100%",
						borderColor: hasError(value) ? "#f55" : void 0,
					},
					value: pipe(
						value,
						Editable_text,
						getOrElse(pipe(Editable_value(value), join("\n"), constant))
					),
					...action,
				}),
			textAreaNode = (label, rows, setter) => c => s =>
				settingRow(
					getText(label)(s.lang),
					errorText(getText("invalidSetting")(s.lang))(s[label]),
					[textAreaRow(rows, editAction(label, setter)(c))(getState(label)(s))]
				),
			filterPanelOld = c => s =>
				[
					h(
						"div",
						{ style: panelBoxStyle(212) },
						textAreaNode("bannedWords", 18, setter_setEditStrings)(c)(s)
					),
					h(
						"div",
						{ style: panelBoxStyle(212) },
						textAreaNode("bannedWordRegexes", 18, setter_setEditRegexes)(c)(s)
					),
					h(
						"div",
						{ style: panelBoxStyle(212) },
						textAreaNode("bannedUsers", 18, setter_setEditStrings)(c)(s)
					),
				],
			colorPicker = action => color =>
				h("input", {
					style: { width: "36px", verticalAlign: "middle" },
					type: "color",
					value: color,
					oninput: action.onchange,
				}),
			textInput = action => value =>
				h("input", {
					style: {
						verticalAlign: "middle",
						width: "5.5em",
						borderColor: hasError(value) ? "#f55" : void 0,
					},
					maxlength: 20,
					value: pipe(
						value,
						Editable_text,
						getOrElse(constant(Editable_value(value)))
					),
					...action,
				})
		var validate_color_lib = __webpack_require__(694),
			lib_default = __webpack_require__.n(validate_color_lib)
		const setter_setEditColor = editing => value =>
				editing
					? lib_default()(value)
						? constant(fromValueText(value)(value))
						: setText(value)
					: lib_default()(value)
					? constant(Editable_of(value))
					: mapSecond(constant(Option_some([value, Option_some("")]))),
			setter_setEditInt = editing => value => state =>
				pipe(
					value,
					Number.parseInt,
					editing
						? x =>
								Number.isNaN(x) || "." === value.at(-1)
									? pipe(state, setText(value))
									: fromValueText(x)(value)
						: x =>
								Number.isNaN(x)
									? pipe(
											state,
											mapSecond(constant(Option_some([value, Option_some("")])))
									  )
									: Editable_of(x)
				),
			intNode = (label, min, max, step) => c => s =>
				settingRow(
					getText(label)(s.lang),
					errorText(getText("inputNonNumberic")(s.lang))(s[label]),
					[
						rangeRow(
							min,
							max,
							step,
							editAction(label, setter_setEditInt)(c)
						)(getState(label)(s)),
					]
				),
			setter_setEditString = editing =>
				flow(x => constant(editing ? fromValueText(x)(x) : Editable_of(x))),
			fonts = currentFont => [
				["", "Default", "デフォルト"],
				["arial", "Arial", "Arial"],
				["arial black", "Arial Black", "Arial Black"],
				["arial narrow", "Arial Narrow", "Arial Narrow"],
				["Century", "Century", "Century"],
				["Comic Sans MS", "Comic Sans MS", "Comic Sans MS"],
				["Courier", "Courier", "Courier"],
				["cursive", "cursive", "cursive"],
				["fantasy", "fantasy", "fantasy"],
				["Impact", "Impact", "Impact"],
				["Meiryo", "Meiryo", "メイリオ"],
				["Meiryo UI", "Meiryo UI", "メイリオ UI"],
				["monospace", "monospace", "monospace"],
				["Monotype Corsiva", "Monotype Corsiva", "Monotype Corsiva"],
				["MS PGothic", "MS PGothic", "MS Pゴシック"],
				["MS Gothic", "MS Gothic", "MS ゴシック"],
				["MS Sans Serif", "MS Sans Serif", "MS Sans Serif"],
				["MS Serif", "MS Serif", "MS Serif"],
				["MS UI Gothic", "MS UI Gothic", "MS UI Gothic"],
				["sans-serif", "Sans-serif", "Sans-serif"],
				["serif", "Serif", "Serif"],
				["Times New Roman", "Times New Roman", "Times New Roman"],
				["Yu Gothic", "Yu Gothic", "遊ゴシック"],
				["YuGothic", "YuGothic", "游ゴシック体"],
				[currentFont, "Custom", "カスタム"],
			],
			settingUI_textRowStyle = { width: "70%", boxSizing: "border-box" },
			colorTextOutput = textStyle => color =>
				h(
					"span",
					{ style: { ...textStyle, color } },
					hyperapp_text("Aa1あア亜")
				),
			validColor = x => lib_default()(x.replace(/grey/gi, "gray")),
			lib_setEditColor = editing => value =>
				editing
					? validColor(value)
						? constant(fromValueText(value)(value))
						: setText(value)
					: validColor(value)
					? constant(Editable_of(value))
					: mapSecond(constant(Option_some([value, Option_some("")]))),
			exampleTextStyle = s => ({
				fontFamily: Editable_value(s.font),
				fontWeight: Editable_value(s.fontWeight).toString(),
				textShadow: textShadow(Editable_value(s.shadowColor))(
					Editable_value(s.shadowFontWeight)
				),
			}),
			textColorNode = label => c => s =>
				settingRow(
					getText(label)(s.lang),
					errorText(getText("invalidColor")(s.lang))(s[label]),
					pipe(
						{
							a: editAction(label, lib_setEditColor)(c),
							v: Editable_value(s[label]),
						},
						({ a, v }) => [
							colorPicker(a)(v),
							textInput(a)(s[label]),
							colorTextOutput(exampleTextStyle(s))(v),
						]
					)
				),
			flowChatPanel = pipe(
				[
					pipe(
						[
							c => s =>
								pipe(Editable_value(s.font), font =>
									settingRow(getText("font")(s.lang), "", [
										h(
											"select",
											{
												style: settingUI_textRowStyle,
												onchange: updateInput("font")(setter_setEditString(!1))(
													c
												),
											},
											pipe(
												fonts(font),
												findFirstIndex(x => x[0] === font),
												getOrElse(() => 0),
												index =>
													pipe(
														fonts(font),
														ReadonlyArray_map((f, i) =>
															node_option(
																f[0],
																pipe(
																	languages,
																	findFirstIndex(x => x === s.lang),
																	Option_map(x => unsafeGet(x + 1)(f)),
																	getOrElse(() => "Error")
																),
																i === index
															)
														)
													)
											)
										),
										h("input", {
											style: settingUI_textRowStyle,
											maxlength: 20,
											value: font,
											...editAction("font", setter_setEditString),
										}),
									])
								),
							textColorNode("color"),
							textColorNode("ownerColor"),
							textColorNode("moderatorColor"),
							textColorNode("memberColor"),
							((label = "shadowColor"),
							c => s =>
								settingRow(
									getText(label)(s.lang),
									errorText(getText("invalidColor")(s.lang))(s[label]),
									pipe(editAction(label, setter_setEditColor)(c), x => [
										colorPicker(x)(Editable_value(s[label])),
										textInput(x)(s[label]),
									])
								)),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x))
					),
					pipe(
						[
							numberNode("chatOpacity", 0, 1, 0.05),
							numberNode("fontSize", 0.3, 2, 0.05),
							numberNode("fontWeight", 10, 1e3, 10),
							numberNode("shadowFontWeight", 0, 3, 0.1),
							numberNode("flowSpeed", 1, 50, 1),
							intNode("maxChatCount", 5, 200, 5),
							intNode("maxChatLength", 5, 200, 5),
							intNode("laneCount", 1, 25, 1),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x))
					),
					pipe(
						[
							numberNode("flowY1", 0, 0.95, 0.01),
							numberNode("flowY2", 0.05, 1, 0.01),
							numberNode("flowX1", 0, 0.95, 0.01),
							numberNode("flowX2", 0.05, 1, 0.01),
							numberNode("minSpacing", 0, 2.5, 0.1),
							c => s =>
								h("div", {}, [
									checkboxNode("useStepTiming")(c)(s),
									h(
										"div",
										{
											style: {
												opacity: getState("useStepTiming")(s) ? void 0 : "0.5",
											},
										},
										intNode("timingStepCount", 1, 400, 1)(c)(s)
									),
								]),
							checkboxNode("createChats"),
							checkboxNode("displayModName"),
							checkboxNode("displaySuperChatAuthor"),
							checkboxNode("textOnly"),
							() => s => hyperapp_text(getText("flowNewChatIf")(s.lang)),
							checkboxNode("noOverlap"),
							buttonNode("clearFlowChats"),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x))
					),
				],
				mapSettingNodes(Function_identity)
			)
		var label
		const settingUI_flowChatPanel = flowChatPanel,
			simpleWrap = (comp, init) =>
				pipe(
					Effect_sync(() => document.createElement(comp.tag)),
					Effect_flatMap(node =>
						Effect_sync(() => ({
							node,
							dispatch: app({ init, view: comp.view, node }),
						}))
					)
				),
			toggleSettingsPanelComponent = flow(
				syncState => (x, e) =>
					pipe({ ...x, showPanel: !x.showPanel }, newState => [
						newState,
						x.showPanel
							? () => z.instanceof(HTMLElement).parse(e.currentTarget).blur()
							: () => {},
						() =>
							runPromise(syncState(oldState => ({ ...oldState, ...newState }))),
					]),
				toggle => state =>
					h(
						"button",
						{
							class: "fyc_button",
							style: {
								background: "rgba(0,0,0,0)",
								marginLeft: "10px",
								whiteSpace: "nowrap",
							},
							onclick: toggle,
						},
						[
							h(
								"svg",
								{
									preserveAspectRatio: "xMidYMid meet",
									viewBox: "0 0 640 640",
									width: "15",
									height: "15",
									style: { position: "relative", top: "1px" },
								},
								[
									h(
										"defs",
										{},
										h("path", {
											id: "d1TbzTC1zI",
											d: "M135 58c25 14 67 30 82 35-7 49 16 109-15 149-50 71-19 184 64 213 74 31 165-18 183-95-3-38 23-62 58-36l120 55c-39 10-106 35-72 85 40 38 1 71-29 98-29 53-70-17-109-5-46 22-25 109-96 85h-55c-24-31-21-103-80-84-32 32-70 31-93-9l-35-36c4-40 57-96-6-120-45 5-58-32-52-68 2-19-4-41 3-59 35-15 100-22 77-79-48-43 1-84 35-115 5-6 12-12 20-14zM577 2c52 3 72 62 62 106-5 51 19 117-27 155-18 24 8 49 11 74-39-8-98-46-146-60-55-1-111 2-167-2-52-15-57-76-52-121S242 52 282 18c38-30 88-11 132-16h163z",
										})
									),
									h("use", {
										href: "#d1TbzTC1zI",
										opacity: "1",
										fill: "var(--iron-icon-fill-color, currentcolor)",
										"fill-opacity": "1",
									}),
								]
							),
							h(
								"span",
								{
									style: {
										position: "relative",
										top: "-2px",
										marginLeft: "8px,",
									},
								},
								hyperapp_text(getText("setting")(state.lang))
							),
						]
					),
				button =>
					makeComponent(
						tag => s => h(tag, { style: { display: "flex" } }, button(s))
					)("span")
			),
			videoToggleStream = video =>
				pipe(
					[["playing"], ["waiting", "pause"]],
					ReadonlyArray_map((x, i) => [x, 0 === i]),
					ReadonlyArray_flatMap(([xs, b]) =>
						pipe(
							xs,
							ReadonlyArray_map(x => [x, b])
						)
					),
					ReadonlyArray_map(([x, b]) =>
						pipe(
							(0, external_rxjs_namespaceObject.fromEvent)(video, x),
							(0, external_rxjs_namespaceObject.map)(() => b)
						)
					),
					x => (0, external_rxjs_namespaceObject.merge)(...x)
				),
			Logger_make = makeLogger,
			Logger_replace = replaceLogger,
			Logger_withMinimumLogLevel = withMinimumLogLevel,
			Logger_zip = logger_zip,
			Logger_defaultLogger = defaultLogger
		var LogAnnotationKeys
		!(function (LogAnnotationKeys) {
			LogAnnotationKeys.name = "name"
		})(LogAnnotationKeys || (LogAnnotationKeys = {}))
		const src_LogAnnotationKeys = LogAnnotationKeys,
			maxEventLogBlockCount = Math.floor(50),
			preserveEventLogBlockCount = Math.floor(0.2 * maxEventLogBlockCount),
			getConsoleLog = x =>
				(x === Trace
					? console.trace
					: x === Level_Debug
					? console.debug
					: x === Info
					? console.info
					: x === Warning
					? console.warn
					: x === Level_Error || x === Fatal
					? console.error
					: console.log
				).bind(console),
			metaLogger = Logger_make(
				(fiberId, logLevel, message, cause, context, span, annotations) =>
					runPromise(
						pipe(
							() =>
								`${pipe(
									annotations,
									mjs_HashMap_get(src_LogAnnotationKeys.name),
									match(
										() => "",
										x => `[${x}] `
									)
								)}${message}`,
							getStr =>
								pipe(
									FiberRefs_getOrDefault(context, logMeta),
									match(
										() =>
											greaterThanEqual(Warning)(logLevel)
												? Effect_sync(() => getConsoleLog(logLevel)(getStr()))
												: Effect_unit(),
										meta =>
											Effect_sync(() =>
												getConsoleLog(logLevel)(`${getStr()}: `, meta)
											)
									)
								)
						)
					)
			)
		runPromise(
			pipe(
				Effect_Do(),
				Effect_letDiscard(
					"settingUpdateApps",
					new external_rxjs_namespaceObject.BehaviorSubject([])
				),
				bindValue_("provideLog", x => {
					return (
						(settingUpdateApps = x.settingUpdateApps),
						effect => {
							return pipe(
								Effect_succeed(
									Logger_replace(
										Logger_defaultLogger,
										Logger_zip(metaLogger)(
											((apps = settingUpdateApps),
											Logger_make((fiberId, logLevel, message) =>
												runPromise(
													(
														apps => dispatchable =>
															pipe(
																apps,
																ReadonlyArray_map(x =>
																	Effect_sync(() => x(dispatchable))
																),
																x => Effect_all(x)
															)
													)(apps.getValue())(s => {
														return s.logEvents
															? {
																	...s,
																	eventLog: ((text = message),
																	(level = logLevel.label),
																	flow(
																		x =>
																			x.compressedBlocks.length ===
																			maxEventLogBlockCount
																				? (
																						i => log =>
																							i > log.compressedBlocks.length
																								? log
																								: makeLog({
																										nextId: log.nextId,
																										...(i ===
																										log.compressedBlocks.length
																											? {
																													lastBlock: [],
																													compressedBlocks:
																														log.compressedBlocks,
																											  }
																											: {
																													lastBlock:
																														log.lastBlock,
																													compressedBlocks:
																														ReadonlyArray_remove(
																															log.compressedBlocks,
																															i
																														),
																											  }),
																								  })
																				  )(
																						Math.floor(
																							preserveEventLogBlockCount
																						)
																				  )(x)
																				: x,
																		(
																			(text, level) => log =>
																				makeLog({
																					nextId: log.nextId + 1,
																					...pipe(
																						log.lastBlock,
																						append({
																							id: log.nextId,
																							text,
																							level,
																						}),
																						x =>
																							200 === x.length
																								? {
																										compressedBlocks: append(
																											log.compressedBlocks,
																											makeCompressedLogBlock(
																												(0,
																												external_LZString_namespaceObject.compressToUTF16)(
																													JSON.stringify(x)
																												)
																											)
																										),
																										lastBlock: [],
																								  }
																								: {
																										compressedBlocks:
																											log.compressedBlocks,
																										lastBlock: x,
																								  }
																					),
																				})
																		)(text, level)
																	))(s.eventLog),
															  }
															: s
														var text, level
													})
												)
											))
										)
									)
								),
								Effect_flatMap(logLayer =>
									pipe(
										effect,
										Effect_tapErrorCause(x => Effect_logError(Cause_pretty(x))),
										Effect_provideSomeLayer(logLayer)
									)
								),
								Effect_logAnnotate(src_LogAnnotationKeys.name, "FYC"),
								Logger_withMinimumLogLevel(Level_Debug)
							)
							var apps
						}
					)
					var settingUpdateApps
				}),
				Effect_flatMap(({ settingUpdateApps, provideLog }) =>
					provideLog(
						pipe(
							src_defaultGMConfig,
							x => ({ gmConfig: x, configKeys: Object.keys(x) }),
							Effect_succeed,
							Effect_letDiscard("updateSettingState", dispatchable =>
								provideLog(
									pipe(
										settingUpdateApps.getValue(),
										ReadonlyArray_map(x => Effect_sync(() => x(dispatchable))),
										x => Effect_all(x)
									)
								)
							),
							Effect_bind("config", ctx => {
								return (
									(config = ctx.gmConfig),
									pipe(
										Object.entries(config),
										ReadonlyArray_map(([k, c]) =>
											pipe(
												c.getValue,
												Effect_map(x => [k, x])
											)
										),
										x => Effect_all(x),
										Effect_map(Object.fromEntries)
									)
								)
								var config
							}),
							bindValue_("getConfig", ctx =>
								(c =>
									pipe(
										c,
										mapObject(([x]) => [x, Effect_sync(() => c[x])])
									))(ctx.config)
							),
							flow(
								bindValue_("mainState", x => ({
									chatPlaying: !0,
									playerRect: new DOMRectReadOnly(0, 0, 600, 400),
									config: x.config,
									flowChats: [],
								})),
								bindValue_("configSubject", ctx =>
									pipe(
										ctx.configKeys,
										ReadonlyArray_map(x => [
											x,
											new external_rxjs_namespaceObject.Subject(),
										]),
										Object.fromEntries
									)
								),
								bindValue_("setterFromKeysMap", ctx =>
									(
										keys => f =>
											pipe(
												keys,
												ReadonlyArray_map(x => [x, f(x)]),
												Object.fromEntries
											)
									)(ctx.configKeys)
								),
								bindValue_("setConfigPlain", ctx =>
									ctx.setterFromKeysMap(
										key => val =>
											Effect_promise(async () => {
												Object.assign(ctx.mainState.config, { [key]: val })
												ctx.configSubject[key].next(val)
											})
									)
								),
								bindValue_(
									"changedConfigMap",
									ctx => key => val =>
										pipe(
											Effect_promise(async () => ctx.config[key]),
											Effect_filterOrFail(
												x => !fast_deep_equal_default()(x, val),
												Option_none
											),
											Effect_flatMap(() => ctx.setConfigPlain[key](val))
										)
								),
								bindValue_("setChangedConfig", ctx =>
									ctx.setterFromKeysMap(
										key => val =>
											pipe(ctx.changedConfigMap(key)(val), Effect_ignore)
									)
								),
								Effect_letDiscard(
									"channel",
									new broadcast_channel_BroadcastChannel("fyc-0615654655528523")
								)
							),
							flow(
								bindValue_("setConfig", ctx =>
									ctx.setterFromKeysMap(
										key => val =>
											pipe(
												ctx.changedConfigMap(key)(val),
												Effect_zipRight(
													Effect_promise(() =>
														ctx.channel.postMessage([key, val])
													)
												),
												Effect_zipRight(
													Effect_promise(() =>
														pipe(ctx.gmConfig[key], x =>
															GM.setValue(x.gmKey, x.toGm(val))
														)
													)
												),
												Effect_ignore
											)
									)
								),
								Effect_bindDiscard(
									"reinitSubject",
									Effect_sync(() => new external_rxjs_namespaceObject.Subject())
								),
								bindValue_("reinitialize", ctx =>
									provideLog(
										Effect_sync(() => {
											requestAnimationFrame(() => lib(ctx.reinitSubject)())
										})
									)
								),
								Effect_tap(ctx =>
									ctx.setConfigPlain.filterExp(defaultFilter(ctx.config))
								),
								bindValue_("toggleChatButtonInit", ctx => ({
									lang: ctx.config.lang,
									displayChats: ctx.config.displayChats,
								})),
								Effect_bind("wrappedToggleChat", ctx => {
									return simpleWrap(
										((setConfig = ctx.setConfig),
										pipe(
											"button",
											makeComponent(
												tag => state =>
													pipe(
														getText(
															state.displayChats ? "hideChats" : "showChats"
														)(state.lang),
														label =>
															h(
																tag,
																{
																	class: "ytp-button",
																	style: {
																		background: "none",
																		border: "none",
																		cursor: "pointer",
																		float: "left",
																		fontSize: "1em",
																		height: "4em",
																		outline: "none",
																		overflow: "visible",
																		padding: "0 0 0em",
																		position: "relative",
																		width: "48px",
																		display: "flex",
																		alignItems: "center",
																	},
																	type: "button",
																	"aria-label": label,
																	title: label,
																	onclick: s =>
																		pipe(!s.displayChats, displayChats => [
																			{ ...s, displayChats },
																			() =>
																				runPromise(
																					setConfig.displayChats(displayChats)
																				),
																		]),
																},
																[
																	h(
																		"svg",
																		{
																			style: { width: "36px" },
																			viewBox: "0 0 36 36",
																		},
																		[
																			h("path", {
																				class: "chat-button-path",
																				d: "m11 12h17q1 0 1 1v9q0 1-1 1h-1v2l-4-2h-12q-1 0-1-1v-9q0-1 1-1z",
																				fill: "#fff",
																				"fill-opacity": state.displayChats
																					? "1"
																					: "0",
																				stroke: "#fff",
																				"stroke-width": "2",
																			}),
																		]
																	),
																]
															)
													)
											)
										)),
										ctx.toggleChatButtonInit
									)
									var setConfig
								}),
								Effect_bind("wrappedSettings", ctx =>
									simpleWrap(
										pipe(
											(c => state => {
												return state.showPanel
													? h(
															"div",
															{
																class: "fyc_panel",
																style: {
																	backgroundColor: "rgba(30,30,30,0.9)",
																	position: "absolute",
																	zIndex: "1000",
																	color: "#fff",
																	fontSize: "14px",
																	overflow: "auto",
																	left: `${state.panelRect.x}px`,
																	top: `${state.panelRect.y}px`,
																	width: `${state.panelRect.width}px`,
																	height: `${state.panelRect.height}px`,
																	border: "solid 1px #666",
																	fontFamily: "MS PGothic",
																	lineHeight: "1.2",
																	colorScheme: "dark",
																},
															},
															[
																h(
																	"div",
																	{
																		style: {
																			position: "absolute",
																			inset: "3px 3px auto auto",
																		},
																	},
																	[
																		hyperapp_text("🌐"),
																		h(
																			"select",
																			{
																				onchange: updateInput("lang")(
																					((allowedStrings = [
																						"FYC_EN",
																						"FYC_JA",
																					]),
																					value => state =>
																						pipe(
																							value,
																							liftPredicate(x =>
																								ReadonlyArray_contains(
																									String_Equivalence
																								)(allowedStrings, x)
																							),
																							getOrElse(() => state)
																						))
																				)(c),
																			},
																			pipe(
																				languages,
																				zip(languageLabels),
																				ReadonlyArray_map(([lang, label]) =>
																					node_option(
																						lang,
																						label,
																						lang === state.lang
																					)
																				)
																			)
																		),
																	]
																),
																tabContainer({
																	container: {},
																	label: { padding: "6px" },
																	labelFocus: { background: "#666" },
																	tab: {
																		height: "364px",
																		display: "flex",
																		padding: "6px",
																	},
																})((s, n) => updateAt("mainTab")(n)(c)(s))(
																	pipe(
																		[
																			"flowChat",
																			"chatFilter",
																			"chatField",
																			"feedback",
																		],
																		ReadonlyArray_map(getText),
																		ReadonlyArray_map(apply(state.lang))
																	)
																)(
																	pipe(
																		[
																			settingUI_flowChatPanel,
																			filterPanelOld,
																			settingUI_chatFieldPanel,
																			feedbackPanel,
																		],
																		ReadonlyArray_map(apply(c)),
																		ReadonlyArray_map(constant),
																		ReadonlyArray_map(flip),
																		ReadonlyArray_map(apply(state))
																	)
																)(getState("mainTab")(state)),
															]
													  )
													: h("div", {})
												var allowedStrings
											})({
												setConfig: ctx.setConfig,
												act: {
													clearFlowChats: removeOldChats(ctx.mainState)(0),
												},
												provideLog,
											}),
											panel =>
												makeComponent(
													tag => s =>
														h(tag, { style: { display: "contents" } }, panel(s))
												)("span")
										),
										settingStateInit(ctx.config)
									)
								),
								Effect_bind("wrappedToggleSettings", ctx =>
									simpleWrap(
										toggleSettingsPanelComponent(ctx.updateSettingState),
										settingStateInit(ctx.config)
									)
								)
							),
							flow(
								Effect_tap(ctx =>
									Effect_sync(() =>
										settingUpdateApps.next([
											ctx.wrappedSettings.dispatch,
											ctx.wrappedToggleSettings.dispatch,
										])
									)
								),
								Effect_letDiscard(
									"settingsRectSubject",
									new external_rxjs_namespaceObject.BehaviorSubject(
										new DOMRectReadOnly(0, 0, 660, 395)
									)
								),
								Effect_tap(ctx =>
									pipe(
										[
											"Version: 1.16.1",
											`User Agent: ${window.navigator.userAgent}`,
											`GMConfig: ${JSON.stringify(ctx.config, void 0, "\t")}`,
										],
										ReadonlyArray_map(Effect_logDebug),
										x => Effect_all(x)
									)
								),
								Effect_zipLeft(
									pipe(
										Effect_logDebug("10s..."),
										Effect_repeat(Schedule_fixed(seconds(10))),
										Effect_delay(seconds(10)),
										Effect_forkDaemon
									)
								)
							),
							bindValue_("co", ctx =>
								pipe(
									ctx.configSubject,
									mapObject(([k, value]) => [
										k,
										pipe(
											value,
											tapEffect(v =>
												provideLog(
													pipe(
														v,
														x => s => ({ ...s, [k]: x }),
														Effect_succeed,
														Effect_tap(() => {
															return ctx.updateSettingState(
																((key = k),
																value => state => ({
																	...state,
																	[key]: isEditable(key)(value)
																		? setValue(value)(state[key])
																		: "filterExp" === key
																		? void 0
																		: value,
																}))(v)
															)
															var key
														}),
														Effect_zipLeft(
															pipe(
																[
																	"bannedWords",
																	"bannedUsers",
																	"bannedWordRegexes",
																],
																ReadonlyArray_contains(String_Equivalence)(k),
																x =>
																	x
																		? ctx.setConfig.filterExp(
																				defaultFilter(ctx.config)
																		  )
																		: Effect_unit()
															)
														),
														Effect_flatMap(x =>
															k in ctx.toggleChatButtonInit
																? Effect_sync(() =>
																		ctx.wrappedToggleChat.dispatch(x)
																  )
																: Effect_unit()
														),
														x => () => runPromise(provideLog(x)),
														x => Effect_sync(() => requestAnimationFrame(x))
													)
												)
											),
											(0, external_rxjs_namespaceObject.share)()
										),
									])
								)
							),
							Effect_letDiscard("livePage", livePageYt),
							bindValue_("live", ctx => makePageState(ctx.livePage)),
							Effect_bindDiscard("chatScreen", makeChatScreen),
							Effect_bind("all$", ctx => {
								return pipe(
									{
										eq:
											((E = strict()),
											Equivalence_make(
												(x, y) =>
													x === y ||
													(Option_isNone(x)
														? Option_isNone(y)
														: !Option_isNone(y) && E(x.value, y.value))
											)),
										initDelay: 100,
										urlDelay: 1700,
										changeDetectInterval: 700,
										bodyResizeDetectInterval: 300,
										errorRetryInterval: 5e3,
										liveElementKeys: Object.keys(ctx.livePage),
										tapUpdateSettingsRect: ob =>
											(0, external_rxjs_namespaceObject.switchMap)(value => {
												return pipe(
													ctx.settingsRectSubject,
													(0, external_rxjs_namespaceObject.first)(),
													(0, external_rxjs_namespaceObject.map)(
														((toggleSettingsElement =
															ctx.wrappedToggleSettings.node),
														nextSettingsRect => last =>
															pipe(
																Effect_succeed(toggleSettingsElement),
																Effect_filterOrFail(
																	x => null !== x.offsetParent,
																	Option_none
																),
																Effect_map(x => x.getBoundingClientRect()),
																Effect_map(
																	x =>
																		new DOMRectReadOnly(
																			Math.max(
																				0,
																				x.right + window.scrollX - 660
																			),
																			Math.max(0, x.y + window.scrollY - 395),
																			660,
																			Math.min(x.y + window.scrollY, 395)
																		)
																),
																Effect_orElseSucceed(
																	() =>
																		new DOMRectReadOnly(-660, -395, 660, 395)
																),
																Effect_filterOrFail(
																	x =>
																		x.x !== last.x ||
																		x.y !== last.y ||
																		x.width !== last.width ||
																		x.height !== last.height,
																	Option_none
																),
																Effect_tap(nextSettingsRect),
																Effect_ignore
															))(rect =>
															Effect_sync(() =>
																ctx.settingsRectSubject.next(rect)
															)
														)
													),
													tapEffect(provideLog),
													(0, external_rxjs_namespaceObject.map)(() => value)
												)
												var toggleSettingsElement
											})(ob),
										config$: configStream(
											provideLog,
											ctx.mainState,
											ctx.co,
											ctx.chatScreen,
											ctx.live
										),
									},
									Effect_succeed,
									Effect_bindDiscard("css", mainCss),
									Effect_bindDiscard(
										"documentMutationPair",
										observePair(MutationObserver)
									),
									Effect_bindDiscard(
										"chatMutationPair",
										observePair(MutationObserver)
									),
									Effect_bindDiscard(
										"playerResizePair",
										observePair(ResizeObserver)
									),
									Effect_bindDiscard(
										"bodyResizePair",
										observePair(ResizeObserver)
									),
									Effect_map(c =>
										pipe(
											ctx.reinitSubject,
											(0, external_rxjs_namespaceObject.observeOn)(
												external_rxjs_namespaceObject.asyncScheduler
											),
											(0, external_rxjs_namespaceObject.delay)(c.initDelay),
											tapEffect(() => provideLog(Effect_logInfo("Init"))),
											(0, external_rxjs_namespaceObject.switchMap)(() =>
												pipe(
													(0, external_rxjs_namespaceObject.interval)(
														c.changeDetectInterval
													),
													c.tapUpdateSettingsRect,
													(0, external_rxjs_namespaceObject.concatMap)(index =>
														pipe(
															(0, external_rxjs_namespaceObject.from)(
																runPromise(
																	provideLog(
																		pipe(
																			c.liveElementKeys,
																			ReadonlyArray_map(key =>
																				pipe(
																					ctx.live[key],
																					x => x.read,
																					Effect_matchEffect(
																						() => Effect_succeed(Option_none()),
																						flow(Option_some, Effect_succeed)
																					),
																					Effect_map(
																						liftPredicate(
																							newEle =>
																								!c.eq(ctx.live[key].ele, newEle)
																						)
																					),
																					Effect_map(
																						Option_map(
																							flow(
																								Effect_succeed,
																								Effect_tap(x =>
																									Effect_sync(() => {
																										ctx.live[key].ele = x
																									})
																								),
																								Effect_map(Option_isSome),
																								Effect_map(
																									x =>
																										`${key} ${
																											x ? "found" : "lost"
																										}`
																								),
																								Effect_flatMap(Effect_logDebug)
																							)
																						)
																					),
																					Effect_flatMap(
																						match(
																							() => Effect_succeed(!1),
																							Effect_zipRight(
																								Effect_succeed(!0)
																							)
																						)
																					)
																				)
																			),
																			x => Effect_all(x),
																			Effect_map(
																				ReadonlyArray_some(Function_identity)
																			)
																		)
																	)
																)
															),
															(0, external_rxjs_namespaceObject.filter)(
																Function_identity
															),
															(0, external_rxjs_namespaceObject.map)(
																() => index
															)
														)
													),
													(0, external_rxjs_namespaceObject.startWith)(0)
												)
											),
											tapEffect(() =>
												provideLog(
													pipe(
														Effect_logDebug("Loading..."),
														Effect_zipRight(removeOldChats(ctx.mainState)(0)),
														Effect_zipRight(
															Effect_sync(() => {
																c.documentMutationPair.observer.disconnect()
																c.documentMutationPair.observer.observe(
																	document,
																	{ childList: !0, subtree: !0 }
																)
																c.chatMutationPair.observer.disconnect()
																c.playerResizePair.observer.disconnect()
																c.bodyResizePair.observer.disconnect()
																document.head.append(c.css)
															})
														),
														Effect_zipRight(
															pipe(
																[
																	pipe(
																		ctx.live.chatField.ele,
																		Option_map(x =>
																			Effect_sync(() =>
																				c.chatMutationPair.observer.observe(x, {
																					childList: !0,
																				})
																			)
																		)
																	),
																	pipe(
																		ctx.live.chatTicker.ele,
																		Option_map(x =>
																			Effect_sync(() =>
																				c.chatMutationPair.observer.observe(x, {
																					childList: !0,
																				})
																			)
																		)
																	),
																	pipe(
																		ctx.live.player.ele,
																		Option_map(
																			flow(
																				Effect_succeed,
																				Effect_tap(x =>
																					Effect_sync(() =>
																						c.playerResizePair.observer.observe(
																							x
																						)
																					)
																				),
																				Effect_flatMap(x =>
																					Effect_sync(() =>
																						x.prepend(ctx.chatScreen)
																					)
																				)
																			)
																		)
																	),
																	pipe(
																		ctx.live.toggleChatBtnParent.ele,
																		Option_map(x =>
																			Effect_sync(() =>
																				x.prepend(ctx.wrappedToggleChat.node)
																			)
																		)
																	),
																	pipe(
																		ctx.live.settingsToggleNextElement.ele,
																		Option_map(x =>
																			Effect_sync(() =>
																				x.before(ctx.wrappedToggleSettings.node)
																			)
																		)
																	),
																	pipe(
																		ctx.live.settingsContainer.ele,
																		Option_map(x =>
																			Effect_sync(() =>
																				x.append(ctx.wrappedSettings.node)
																			)
																		)
																	),
																	pipe(
																		document.body,
																		fromNullable,
																		Option_map(x =>
																			Effect_sync(() =>
																				c.bodyResizePair.observer.observe(x)
																			)
																		)
																	),
																],
																ReadonlyArray_compact,
																append(
																	pipe(
																		ctx.live.video.ele,
																		Option_filter(x => !x.paused),
																		orElse(() => ctx.live.offlineSlate.ele),
																		Option_isSome,
																		x =>
																			Effect_sync(() => {
																				Object.assign(ctx.mainState, {
																					chatPlaying: x,
																				})
																			})
																	)
																),
																x => Effect_all(x)
															)
														)
													)
												)
											),
											(0, external_rxjs_namespaceObject.switchMap)(() =>
												(0, external_rxjs_namespaceObject.merge)(
													pipe(
														(0, external_rxjs_namespaceObject.fromEvent)(
															ctx.channel,
															"message"
														),
														(0, external_rxjs_namespaceObject.map)(
															([key, val]) =>
																pipe(
																	src_listeningBroadcastConfigKeys.includes(
																		key
																	),
																	x =>
																		x
																			? ctx.setChangedConfig[key](val)
																			: Effect_sync(() => {})
																)
														),
														tapEffect(provideLog)
													),
													...pipe(
														ctx.configKeys,
														ReadonlyArray_map(key =>
															pipe(
																ctx.co[key],
																(0, external_rxjs_namespaceObject.startWith)(
																	ctx.config[key]
																),
																(0, external_rxjs_namespaceObject.bufferCount)(
																	2,
																	1
																),
																(0, external_rxjs_namespaceObject.map)(
																	([x, y]) =>
																		(0, external_DeepDiff_namespaceObject.diff)(
																			x,
																			y
																		)
																),
																(0, external_rxjs_namespaceObject.map)(x =>
																	Effect_logDebug(
																		`Config ${key}: ${JSON.stringify(
																			x,
																			void 0,
																			2
																		)}`
																	)
																),
																tapEffect(provideLog)
															)
														)
													),
													c.config$,
													pipe(
														ctx.live.video.ele,
														match(
															() => external_rxjs_namespaceObject.EMPTY,
															flow(
																videoToggleStream,
																(0, external_rxjs_namespaceObject.map)(
																	playing =>
																		playing ||
																		Option_isSome(ctx.live.offlineSlate.ele)
																),
																(0, external_rxjs_namespaceObject.map)(
																	chatPlaying =>
																		pipe(
																			Effect_sync(() => {
																				ctx.mainState.chatPlaying = chatPlaying
																			}),
																			Effect_zipRight(
																				pipe(
																					ctx.mainState.flowChats,
																					ReadonlyArray_map(setChatPlayState),
																					ReadonlyArray_map(
																						apply(ctx.mainState)
																					),
																					x => Effect_all(x)
																				)
																			)
																		)
																),
																tapEffect(provideLog)
															)
														)
													),
													pipe(
														c.chatMutationPair.subject,
														(0, external_rxjs_namespaceObject.map)(
															onChatFieldMutate(
																ctx.chatScreen,
																ctx.mainState,
																ctx.getConfig,
																ctx.setConfig
															)
														),
														tapEffect(provideLog)
													),
													pipe(
														c.documentMutationPair.subject,
														(0, external_rxjs_namespaceObject.map)(
															() => window.location.href
														),
														(0,
														external_rxjs_namespaceObject.distinctUntilChanged)(),
														(0, external_rxjs_namespaceObject.skip)(1),
														c.tapUpdateSettingsRect,
														(0, external_rxjs_namespaceObject.map)(x =>
															Effect_all([
																Effect_logDebug(`URL Changed: ${x}`),
																removeOldChats(ctx.mainState)(0),
																Effect_logDebug(`Wait for ${c.urlDelay}ms...`),
															])
														),
														tapEffect(provideLog),
														(0, external_rxjs_namespaceObject.delay)(
															c.urlDelay
														),
														tapEffect(() => ctx.reinitialize)
													),
													pipe(
														c.playerResizePair.subject,
														(0, external_rxjs_namespaceObject.throttleTime)(
															500,
															void 0,
															{ leading: !0, trailing: !0 }
														),
														(0, external_rxjs_namespaceObject.startWith)([]),
														(0, external_rxjs_namespaceObject.map)(
															flow(
																() => ctx.live.player.ele,
																Option_map(x => x.getBoundingClientRect()),
																match(
																	() => Effect_unit(),
																	x => {
																		return (
																			(rect = x),
																			(mainState = ctx.mainState),
																			pipe(
																				rect,
																				Effect_succeed,
																				Effect_tap(x =>
																					Effect_logDebug(
																						`Resize [${x.width.toFixed(
																							1
																						)}, ${x.height.toFixed(1)}]`
																					)
																				),
																				Effect_flatMap(
																					flow(
																						x =>
																							Effect_sync(() =>
																								Object.assign(mainState, {
																									playerRect: x,
																								})
																							),
																						Effect_map(
																							() => mainState.flowChats
																						),
																						Effect_map(
																							ReadonlyArray_flatMap(x => [
																								renderChat(x)(mainState),
																								setChatAnimation(x)(mainState),
																							])
																						),
																						Effect_flatMap(x => Effect_all(x))
																					)
																				)
																			)
																		)
																		var rect, mainState
																	}
																)
															)
														),
														tapEffect(provideLog)
													),
													pipe(
														c.bodyResizePair.subject,
														(0, external_rxjs_namespaceObject.throttleTime)(
															c.bodyResizeDetectInterval,
															void 0,
															{ leading: !0, trailing: !0 }
														),
														(0, external_rxjs_namespaceObject.startWith)([]),
														c.tapUpdateSettingsRect
													),
													pipe(
														ctx.settingsRectSubject,
														tapEffect(panelRect =>
															ctx.updateSettingState(s => ({ ...s, panelRect }))
														)
													)
												)
											),
											(0, external_rxjs_namespaceObject.retry)({
												delay: e =>
													pipe(
														e,
														external_rxjs_namespaceObject.of,
														tapEffect(() =>
															provideLog(
																logWithMeta(Level_Error)(`Errored: ${e}`)(e)
															)
														),
														(0, external_rxjs_namespaceObject.delay)(
															c.errorRetryInterval
														),
														tapEffect(() => ctx.reinitialize)
													),
											})
										)
									)
								)
								var E
							}),
							Effect_tap(ctx =>
								Effect_sync(() =>
									ctx.all$.subscribe({
										error: x =>
											runPromise(
												logWithMeta(Level_Error)(`Stream Errored: ${x}`)(x)
											),
										complete: () =>
											runPromise(Effect_logWarning("Stream complete")),
									})
								)
							),
							Effect_tap(ctx => ctx.reinitialize)
						)
					)
				),
				Effect_withParallelismUnbounded
			)
		)
	})()
})()
