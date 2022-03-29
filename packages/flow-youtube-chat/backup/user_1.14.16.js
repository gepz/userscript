// ==UserScript==
// @name        Flow Youtube Chat
// @version     1.14.16
// @description Youtubeのチャットをニコニコ風に画面上へ流すスクリプトです(再アップ，絵文字バグ修正済み)
// @match       https://www.youtube.com/*
// @namespace   FlowYoutubeChatScript
// @run-at      document-end
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @noframes
// @license     AGPL-3.0-or-later
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@10.10.1/dist/sweetalert2.all.min.js#sha384-OCBhaEdUu7BFgaeRVey2PDeHof2MSQRFe/e6S8Q3XrmSV7wrKpLmhPj8FOldGiaF
// @require     https://unpkg.com/loglevel@1.7.0/dist/loglevel.min.js#sha384-7gGuWfek8Ql6j/uNDFrS0BCe4x2ZihD4B68w9Eu580OVHJBV+bl3rZmEWC7q5/Gj
// @require     https://unpkg.com/rxjs@7.0.0-beta.10/dist/bundles/rxjs.umd.min.js#sha384-+BwV2u+ZJFwj586/3PlpsZdYS1U/+hT/zpjYSznHH4XzUJqgshDzZITJ+zGeWl//
// @require     https://unpkg.com/mithril@2.0.4/mithril.min.js#sha384-vo9crXih40MlEv6JWHqS7SsPiFp+76csaWQFOF2UU0/xI58Jm/ZvK/1UtpaicJT9
// @require     https://cdn.jsdelivr.net/npm/check-types@11.1.2/src/check-types.min.js#sha384-KGnImnhVjA5llfqKEbjBiY+1Mp6oa+NvW/TEY1XTPAKWNgrAwa3Qvn//MXL07wBM
// ==/UserScript==

/* jshint esversion: 6 */

;(() => {
  var __webpack_modules__ = {
      238: module => {
        function monadic(fn, cache, serializer, arg) {
          var value,
            cacheKey =
              null == (value = arg) ||
              "number" == typeof value ||
              "boolean" == typeof value
                ? arg
                : serializer(arg),
            computedValue = cache.get(cacheKey)
          return (
            void 0 === computedValue &&
              ((computedValue = fn.call(this, arg)),
              cache.set(cacheKey, computedValue)),
            computedValue
          )
        }
        function variadic(fn, cache, serializer) {
          var args = Array.prototype.slice.call(arguments, 3),
            cacheKey = serializer(args),
            computedValue = cache.get(cacheKey)
          return (
            void 0 === computedValue &&
              ((computedValue = fn.apply(this, args)),
              cache.set(cacheKey, computedValue)),
            computedValue
          )
        }
        function assemble(fn, context, strategy, cache, serialize) {
          return strategy.bind(context, fn, cache, serialize)
        }
        function strategyDefault(fn, options) {
          return assemble(
            fn,
            this,
            1 === fn.length ? monadic : variadic,
            options.cache.create(),
            options.serializer
          )
        }
        function serializerDefault() {
          return JSON.stringify(arguments)
        }
        function ObjectWithoutPrototypeCache() {
          this.cache = Object.create(null)
        }
        ;(ObjectWithoutPrototypeCache.prototype.has = function (key) {
          return key in this.cache
        }),
          (ObjectWithoutPrototypeCache.prototype.get = function (key) {
            return this.cache[key]
          }),
          (ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
            this.cache[key] = value
          })
        var cacheDefault = {
          create: function () {
            return new ObjectWithoutPrototypeCache()
          },
        }
        ;(module.exports = function (fn, options) {
          var cache = options && options.cache ? options.cache : cacheDefault,
            serializer =
              options && options.serializer
                ? options.serializer
                : serializerDefault
          return (options && options.strategy
            ? options.strategy
            : strategyDefault)(fn, { cache, serializer })
        }),
          (module.exports.strategies = {
            variadic: function (fn, options) {
              return assemble(
                fn,
                this,
                variadic,
                options.cache.create(),
                options.serializer
              )
            },
            monadic: function (fn, options) {
              return assemble(
                fn,
                this,
                monadic,
                options.cache.create(),
                options.serializer
              )
            },
          })
      },
    },
    __webpack_module_cache__ = {}
  function __webpack_require__(moduleId) {
    if (__webpack_module_cache__[moduleId])
      return __webpack_module_cache__[moduleId].exports
    var module = (__webpack_module_cache__[moduleId] = { exports: {} })
    return (
      __webpack_modules__[moduleId](
        module,
        module.exports,
        __webpack_require__
      ),
      module.exports
    )
  }
  ;(__webpack_require__.n = module => {
    var getter =
      module && module.__esModule ? () => module.default : () => module
    return __webpack_require__.d(getter, { a: getter }), getter
  }),
    (__webpack_require__.d = (exports, definition) => {
      for (var key in definition)
        __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key) &&
          Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key],
          })
    }),
    (__webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop)),
    (() => {
      "use strict"
      const external_log_namespaceObject = log
      var external_log_default = __webpack_require__.n(
        external_log_namespaceObject
      )
      const lib = observer => value => {
        observer.next(value)
      }
      function function_identity(a) {
        return a
      }
      function constant(a) {
        return function () {
          return a
        }
      }
      function function_pipe(
        a,
        ab,
        bc,
        cd,
        de,
        ef,
        fg,
        gh,
        hi,
        ij,
        jk,
        kl,
        lm,
        mn,
        no,
        op,
        pq,
        qr,
        rs,
        st
      ) {
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
          case 10:
            return ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))
          case 11:
            return jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))
          case 12:
            return kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))
          case 13:
            return lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))
          case 14:
            return mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))
          case 15:
            return no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))
          case 16:
            return op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
          case 17:
            return pq(
              op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
            )
          case 18:
            return qr(
              pq(op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))))
            )
          case 19:
            return rs(
              qr(
                pq(
                  op(no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a)))))))))))))))
                )
              )
            )
          case 20:
            return st(
              rs(
                qr(
                  pq(
                    op(
                      no(mn(lm(kl(jk(ij(hi(gh(fg(ef(de(cd(bc(ab(a))))))))))))))
                    )
                  )
                )
              )
            )
        }
      }
      var eqStrict = {
        equals: function (a, b) {
          return a === b
        },
      }
      function flap(F) {
        return function (a) {
          return function (fab) {
            return F.map(fab, function (f) {
              return f(a)
            })
          }
        }
      }
      var _map = function (ma, f) {
          return function () {
            return f(ma())
          }
        },
        of = constant,
        Functor = { URI: "IO", map: _map },
        sequenceArray =
          (flap(Functor),
          (function (f) {
            return (function (f) {
              return function (as) {
                return function () {
                  return as.map(function (a, i) {
                    return f(i, a)()
                  })
                }
              }
            })(function (_, a) {
              return f(a)
            })
          })(function_identity)),
        separated = function (left, right) {
          return { left, right }
        },
        es6_Separated_map = function (f) {
          return function (fa) {
            return separated(left(fa), f(right(fa)))
          }
        },
        left =
          (flap({
            URI: "Separated",
            map: function (fa, f) {
              return function_pipe(fa, es6_Separated_map(f))
            },
          }),
          function (s) {
            return s.left
          }),
        right = function (s) {
          return s.right
        },
        isSome = function (fa) {
          return "Some" === fa._tag
        },
        isNone = function (fa) {
          return "None" === fa._tag
        },
        none = { _tag: "None" },
        some = function (a) {
          return { _tag: "Some", value: a }
        },
        fromNullable = function (a) {
          return null == a ? none : some(a)
        }
      var matchW = function (onNone, onSome) {
          return function (ma) {
            return isNone(ma) ? onNone() : onSome(ma.value)
          }
        },
        match = matchW,
        getOrElse = function (onNone) {
          return function (ma) {
            return isNone(ma) ? onNone() : ma.value
          }
        },
        chainNullableK = function (f) {
          return function (ma) {
            return isNone(ma) ? none : fromNullable(f(ma.value))
          }
        },
        es6_Option_map = function (f) {
          return function (fa) {
            return isNone(fa) ? none : some(f(fa.value))
          }
        },
        alt = function (that) {
          return function (fa) {
            return isNone(fa) ? that() : fa
          }
        },
        filter = function (predicate) {
          return function (fa) {
            return isNone(fa) ? none : predicate(fa.value) ? fa : none
          }
        }
      function getEq(E) {
        return {
          equals: function (x, y) {
            return (
              x === y ||
              (isNone(x) ? isNone(y) : !isNone(y) && E.equals(x.value, y.value))
            )
          },
        }
      }
      var head = ReadonlyNonEmptyArray_head
      var NonEmptyArray_map = function (fa, f) {
          return function_pipe(fa, es6_NonEmptyArray_map(f))
        },
        es6_NonEmptyArray_map = function (f) {
          return mapWithIndex(function (_, a) {
            return f(a)
          })
        },
        mapWithIndex = function (f) {
          return function (as) {
            for (var out = [f(0, head(as))], i = 1; i < as.length; i++)
              out.push(f(i, as[i]))
            return out
          }
        },
        NonEmptyArray_Functor = { URI: "NonEmptyArray", map: NonEmptyArray_map }
      flap(NonEmptyArray_Functor)
      var a
      a = void 0
      var ReadonlyNonEmptyArray_empty = [],
        ReadonlyNonEmptyArray_append = function (end) {
          return function (init) {
            return ReadonlyNonEmptyArray_concat(init, [end])
          }
        }
      function ReadonlyNonEmptyArray_concat(first, second) {
        return first.concat(second)
      }
      var ReadonlyNonEmptyArray_map = function (fa, f) {
          return function_pipe(fa, es6_ReadonlyNonEmptyArray_map(f))
        },
        es6_ReadonlyNonEmptyArray_map = function (f) {
          return es6_ReadonlyNonEmptyArray_mapWithIndex(function (_, a) {
            return f(a)
          })
        },
        es6_ReadonlyNonEmptyArray_mapWithIndex = function (f) {
          return function (as) {
            for (
              var out = [f(0, ReadonlyNonEmptyArray_head(as))], i = 1;
              i < as.length;
              i++
            )
              out.push(f(i, as[i]))
            return out
          }
        },
        ReadonlyNonEmptyArray_extract = function (as) {
          return as[0]
        },
        ReadonlyNonEmptyArray_Functor = {
          URI: "ReadonlyNonEmptyArray",
          map: ReadonlyNonEmptyArray_map,
        },
        ReadonlyNonEmptyArray_head =
          (flap(ReadonlyNonEmptyArray_Functor), ReadonlyNonEmptyArray_extract)
      var ReadonlyArray_append = ReadonlyNonEmptyArray_append,
        isEmpty = function (as) {
          return 0 === as.length
        }
      var ReadonlyArray_map = function (fa, f) {
          return function_pipe(fa, es6_ReadonlyArray_map(f))
        },
        es6_ReadonlyArray_chain = function (f) {
          return function (ma) {
            return function_pipe(
              ma,
              (function (f) {
                return function (as) {
                  for (var out = [], i = 0; i < as.length; i++)
                    out.push.apply(out, f(i, as[i]))
                  return out
                }
              })(function (_, a) {
                return f(a)
              })
            )
          }
        },
        es6_ReadonlyArray_map = function (f) {
          return function (fa) {
            return fa.map(function (a) {
              return f(a)
            })
          }
        },
        es6_ReadonlyArray_filter = function (predicate) {
          return function (fa) {
            return fa.filter(predicate)
          }
        },
        ReadonlyArray_Functor = {
          URI: "ReadonlyArray",
          map: ReadonlyArray_map,
        },
        ReadonlyArray_empty =
          (flap(ReadonlyArray_Functor), ReadonlyNonEmptyArray_empty)
      const external_m_namespaceObject = m
      var external_m_default = __webpack_require__.n(external_m_namespaceObject)
      const external_rxjs_namespaceObject = rxjs,
        external_rxjs_operators_namespaceObject = rxjs.operators,
        package_namespaceObject_i8 = "1.14.16",
        indirectConfig = async (gmKey, defaultVal, toItem, toGm) => {
          const val = await GM.getValue(gmKey)
          return {
            gmKey,
            val: void 0 !== val ? toItem(val) : defaultVal,
            defaultVal,
            toGm,
          }
        },
        simpleConfig = async (gmKey, defaultVal) => {
          var _a
          return {
            gmKey,
            val:
              null !== (_a = await GM.getValue(gmKey)) && void 0 !== _a
                ? _a
                : defaultVal,
            defaultVal,
            toGm: x => x,
          }
        },
        lineConfigArgs = [
          [],
          x => x.split(/\r\n|\n/).filter(s => "" !== s),
          x => x.join("\n"),
        ],
        chatApp = () =>
          function_pipe(
            fromNullable(document.querySelector("#chatframe")),
            filter(x => {
              var _a
              const state =
                null === (_a = x.contentDocument) || void 0 === _a
                  ? void 0
                  : _a.readyState
              return "loading" === state || "complete" === state
            }),
            chainNullableK(x => x.contentDocument),
            alt(() => some(document)),
            chainNullableK(x => x.querySelector("yt-live-chat-app"))
          ),
        mountComponent = x => {
          ;(x.root.style.display = "contents"),
            external_m_default().mount(x.root, x.comp)
        },
        external_Swal_namespaceObject = Swal
      var external_Swal_default = __webpack_require__.n(
        external_Swal_namespaceObject
      )
      const createBanButton = (chat, id, getConfig, setConfig) => {
        var _a
        if (chat.children.namedItem("card")) return
        const button = document.createElement("button")
        button.classList.add(
          "style-scope",
          "yt-icon-button",
          "fyc_button",
          "fyc_ngbutton"
        ),
          (button.style.padding = "0px"),
          (button.style.width = "20px"),
          (button.style.height = "20px"),
          (button.style.fill = "#fff"),
          button.setAttribute("aria-label", "NGに入れる(Ban this user)"),
          (button.innerHTML =
            '<div style="width: 100%; height: 75%;fill: var(--yt-spec-text-secondary);"><svg class="style-scope yt-icon" width="100%" height="100%" version="1.1" viewBox="0 0 512 512" x="0px" y="0px"><path d="m437.02 74.977c-99.984-99.969-262.06-99.969-362.05 0-99.969 99.984-99.969 262.06 0 362.05 99.969 99.969 262.08 99.969 362.05 0s99.969-262.08 0-362.05zm-299.81 62.234c54.391-54.391 137.02-63.453 201.02-27.531l-228.55 228.55c-35.922-64-26.86-146.62 27.531-201.02zm237.59 237.58c-54.391 54.391-137.03 63.469-201.03 27.547l228.56-228.56c35.921 64 26.843 146.64-27.532 201.02z" fill-rule="evenodd"></path></svg></div>'),
          (button.onclick = () => {
            const users = getConfig.bannedUsers()
            users.includes(id) ||
              (setConfig.bannedUsers([...users, id]),
              external_m_default().redraw(),
              external_Swal_default()
                .mixin({
                  toast: !0,
                  position: "bottom-left",
                  timer: 2500,
                  timerProgressBar: !0,
                  showConfirmButton: !1,
                  didOpen: toast => {
                    toast.addEventListener(
                      "mouseenter",
                      external_Swal_default().stopTimer
                    ),
                      toast.addEventListener(
                        "mouseleave",
                        external_Swal_default().resumeTimer
                      )
                  },
                })
                .fire({ title: `Added Banned User: ${id}`, icon: "success" })),
              (chat.style.display = "none")
          }),
          null === (_a = chat.querySelector("#content #message")) ||
            void 0 === _a ||
            _a.append(button)
      }
      var src = __webpack_require__(238),
        src_default = __webpack_require__.n(src)
      const getChatLane = (
          flowChat,
          progress,
          flowChats,
          mainState,
          getConfig
        ) => {
          const chatIndex = flowChats.indexOf(flowChat),
            playerWidth = mainState.playerRect.width,
            playerX = mainState.playerRect.x,
            chatRect = flowChat.element.getBoundingClientRect(),
            chatWidth = chatRect.width,
            chatHeight = chatRect.height,
            chatX = progress ? chatRect.x - playerX : playerWidth,
            movingChats =
              ((as = flowChats
                .slice(0, chatIndex >= 0 ? chatIndex : void 0)
                .filter(chat => !chat.animationEnded)
                .sort((a, b) => a.lane - b.lane)),
              isEmpty(as) ? ReadonlyArray_empty : as.slice())
          var as
          const tooCloseTo = src_default()(i => {
              const otherRect = movingChats[i].element.getBoundingClientRect(),
                otherWidth = otherRect.width,
                otherX = otherRect.x - playerX,
                gap =
                  (chatHeight * otherWidth * chatWidth) ** 0.333 *
                  getConfig.minSpacing()
              return (
                (playerWidth - otherX) / (playerWidth + otherWidth) - progress <
                  (chatWidth + gap) / (playerWidth + chatWidth) ||
                otherX + otherWidth + gap > chatX
              )
            }),
            occupyInfo = [
              ...movingChats.map((x, i) => ({
                tooClose: () => tooCloseTo(i),
                lane: x.lane,
              })),
              { tooClose: () => !0, lane: getConfig.laneCount() },
            ],
            index = occupyInfo.findIndex(x => x.lane >= flowChat.lane),
            rightFreeLane = occupyInfo
              .slice(index)
              .findIndex(x => x.tooClose()),
            leftFreeLane = function_pipe(
              occupyInfo.slice(0, index),
              ((predicate = x => x.tooClose()),
              function (as) {
                for (var i = as.length - 1; i >= 0; i--)
                  if (predicate(as[i])) return some(i)
                return none
              }),
              getOrElse(() => -1)
            )
          var predicate
          let formerLaneInterval = 0
          leftFreeLane < flowChat.lane &&
            flowChat.lane < rightFreeLane &&
            (formerLaneInterval = Math.min(
              Math.max(
                formerLaneInterval,
                Math.min(
                  flowChat.lane - leftFreeLane,
                  rightFreeLane - flowChat.lane
                )
              ),
              1
            ))
          let maxInterval = 0,
            maxIntervalLane = 0,
            lastLane = -1
          for (let i = 0; i < occupyInfo.length; i += 1)
            if (occupyInfo[i].tooClose()) {
              const nextLane = occupyInfo[i].lane,
                interLane = Math.min(
                  Math.max((lastLane + nextLane) / 2, 0),
                  getConfig.laneCount() - 1
                ),
                newInterval = Math.min(
                  interLane - lastLane,
                  nextLane - interLane,
                  1
                )
              if (
                newInterval - maxInterval > 0.001 &&
                ((maxIntervalLane = Math.max(lastLane + newInterval, 0)),
                (maxInterval = newInterval),
                maxInterval > 0.999)
              )
                break
              lastLane = nextLane
            }
          return {
            lane:
              Math.abs(formerLaneInterval - maxInterval) < 0.001
                ? flowChat.lane
                : maxIntervalLane,
            interval: maxInterval,
          }
        },
        setChatPlayState = (flowChat, mainState, getConfig) => {
          !flowChat.animationEnded &&
            flowChat.animation &&
            (mainState.chatPlaying
              ? flowChat.animation.play()
              : flowChat.animation.pause(),
            (flowChat.animation.playbackRate = getConfig.flowSpeed() / 15))
        },
        setChatAnimation = (flowChat, flowChats, mainState, getConfig) => {
          var _a, _b, _c
          if (flowChat.animationEnded) return !1
          const time =
              null !==
                (_b =
                  null === (_a = flowChat.animation) || void 0 === _a
                    ? void 0
                    : _a.currentTime) && void 0 !== _b
                ? _b
                : void 0,
            progress = void 0 !== time ? time / flowChat.animationDuration : 0,
            { lane, interval } = getChatLane(
              flowChat,
              progress,
              flowChats,
              mainState,
              getConfig
            )
          if (getConfig.noOverlap() && interval < 0.999)
            return (
              null === (_c = flowChat.animation) ||
                void 0 === _c ||
                _c.finish(),
              (flowChat.animation = void 0),
              !1
            )
          flowChat.lane = lane
          const laneY = ((lane, mainState, getConfig) => {
            const laneCount = getConfig.laneCount(),
              laneR = lane % (2 * laneCount - 1),
              playerHeight = mainState.playerRect.height
            return (
              Math.round(
                100 *
                  (laneR < laneCount
                    ? (playerHeight * (laneR % laneCount)) / laneCount + 4
                    : playerHeight *
                      ((laneR % laneCount) / laneCount + 1 / (2 * laneCount)))
              ) / 100
            )
          })(flowChat.lane, mainState, getConfig)
          flowChat.animation && flowChat.animation.cancel(),
            (flowChat.animationDuration = 6400),
            (flowChat.animation = flowChat.element.animate(
              [
                {
                  transform: `translate(${mainState.playerRect.width}px, ${laneY}px)`,
                },
                {
                  transform: `translate(${-flowChat.element.getBoundingClientRect()
                    .width}px, ${laneY}px)`,
                },
              ],
              { duration: 6400, easing: getConfig.timingFunction() }
            )),
            (flowChat.animation.onfinish = () => {
              flowChat.animationEnded = !0
            })
          const newTime = void 0 !== time ? 6400 * progress : 0
          return (
            (flowChat.animation.currentTime = newTime),
            setChatPlayState(flowChat, mainState, getConfig),
            !0
          )
        },
        setChatStyle = (flowChat, mainState, getConfig) => {
          const fontSize = ((mainState, getConfig) =>
              Math.round(
                Math.max(getConfig.fontSize() - 0.2, 0.01) *
                  (mainState.playerRect.height / getConfig.laneCount()) *
                  100
              ) / 100)(mainState, getConfig),
            { style } = flowChat.element
          ;(style.visibility = getConfig.displayChats() ? "visible" : "hidden"),
            (style.color =
              "owner" === flowChat.authorType
                ? getConfig.ownerColor()
                : "moderator" === flowChat.authorType
                ? getConfig.moderatorColor()
                : "member" === flowChat.authorType
                ? getConfig.memberColor()
                : getConfig.color()),
            (style.fontSize = `${fontSize}px`),
            (style.fontWeight = getConfig.fontWeight().toString()),
            (style.fontFamily = getConfig.font()),
            (style.opacity = getConfig.chatOpacity().toString())
          const offset = getConfig.shadowFontWeight()
          ;(style.textShadow = `-${offset}px -${offset}px #0009, ${offset}px -${offset}px #0009, -${offset}px ${offset}px #0009, ${offset}px ${offset}px #0009`),
            (style.transform = `translate(${mainState.playerRect.width}px, -${
              2 * fontSize
            }px)`)
        },
        assert_lib = check.assert,
        tapNonNull = x => (assert_lib(null != x), x),
        textStyle = { fontFamily: "inherit" },
        parseMessage = (lengthBefore, message, getConfig) => {
          var _a
          const eleWin =
              null !== (_a = message.ownerDocument.defaultView) && void 0 !== _a
                ? _a
                : window,
            maxChatLength = getConfig.maxChatLength(),
            vnodes = []
          let semantic = "",
            length = lengthBefore
          return (
            Array.from(message.childNodes).some(node => {
              var _a, _b
              if (
                !getConfig.textOnly() &&
                node instanceof eleWin.HTMLImageElement
              ) {
                const { src, alt } = node
                vnodes.push(
                  external_m_default()("img", {
                    style: { height: "1em", width: "1em" },
                    src,
                    alt,
                  })
                ),
                  (semantic += `<img alt="${alt}">`),
                  (length += 1)
              } else if (node instanceof eleWin.HTMLAnchorElement) {
                const { href } = node,
                  text =
                    null !== (_a = node.textContent) && void 0 !== _a ? _a : "",
                  beginning = text.slice(0, maxChatLength)
                vnodes.push(
                  external_m_default()(
                    "span",
                    {
                      style: {
                        fontSize: "smaller",
                        textDecoration: "underline",
                        ...textStyle,
                      },
                    },
                    beginning
                  )
                ),
                  (semantic += `<a href="${href}">${text}</a>`),
                  (length += beginning.length)
              } else {
                const text =
                    null !== (_b = node.textContent) && void 0 !== _b ? _b : "",
                  beginning = text.slice(0, maxChatLength)
                vnodes.push(external_m_default().fragment({}, beginning)),
                  (semantic += text),
                  (length += beginning.length)
              }
              return length >= maxChatLength
            }),
            { vnodes, semantic, length }
          )
        },
        onChatFieldMutate = (
          chatScrn,
          flowChats,
          mainState,
          getConfig,
          setConfig,
          mainLog
        ) => mutations => {
          function_pipe(
            mutations,
            es6_ReadonlyArray_chain(e => Array.from(e.addedNodes)),
            es6_ReadonlyArray_filter(x => x.children.length > 0)
          ).forEach(chat => {
            var _a
            const chatData = ((chat, getConfig) => {
                let semantic = "",
                  length = 0
                const vnodes = []
                let authorID
                const authorType = chat.querySelector(".owner")
                  ? "owner"
                  : chat.querySelector(".moderator")
                  ? "moderator"
                  : chat.querySelector(".member")
                  ? "member"
                  : "normal"
                return (
                  Array.from(chat.children).forEach(child => {
                    var _a, _b, _c, _d
                    const childID = child.id,
                      message = child.querySelector("#message"),
                      authorName = child.querySelector("#author-name")
                    if ("content" === childID) {
                      if (
                        (chat.querySelector(".moderator") &&
                          getConfig.displayModName() &&
                          vnodes.push(
                            external_m_default()(
                              "span",
                              { style: { fontSize: "smaller", ...textStyle } },
                              `${
                                null !==
                                  (_a =
                                    null == authorName
                                      ? void 0
                                      : authorName.innerText) && void 0 !== _a
                                  ? _a
                                  : ""
                              }: `
                            )
                          ),
                        message)
                      ) {
                        const result = parseMessage(length, message, getConfig)
                        vnodes.push(...result.vnodes),
                          (semantic += result.semantic),
                          (length += result.length)
                      }
                    } else if ("author-photo" === childID) {
                      const matches = (null !==
                        (_c =
                          null === (_b = child.lastElementChild) ||
                          void 0 === _b
                            ? void 0
                            : _b.getAttribute("src")) && void 0 !== _c
                        ? _c
                        : ""
                      ).match(/ytc\/(.*)=/)
                      authorID =
                        null == matches ? void 0 : matches[matches.length - 1]
                    } else if ("card" === childID) {
                      const normalChat = child.matches(
                          [
                            ".style-scope",
                            ".yt-live-chat-paid-message-renderer",
                          ].join("")
                        ),
                        stickerChat = child.matches(
                          [
                            ".style-scope",
                            ".yt-live-chat-paid-sticker-renderer",
                          ].join("")
                        )
                      if (normalChat || stickerChat) {
                        const paidAmount = tapNonNull(
                          child.querySelector("#purchase-amount") ||
                            child.querySelector("#purchase-amount-chip")
                        )
                        authorID = void 0
                        const headerColor = normalChat
                            ? window
                                .getComputedStyle(
                                  tapNonNull(child.querySelector("#header"))
                                )
                                .getPropertyValue("background-color")
                            : window
                                .getComputedStyle(chat)
                                .getPropertyValue(
                                  "--yt-live-chat-paid-sticker-chip-background-color"
                                ),
                          paidColor = normalChat
                            ? window
                                .getComputedStyle(
                                  tapNonNull(child.querySelector("#content"))
                                )
                                .getPropertyValue("background-color")
                            : window
                                .getComputedStyle(chat)
                                .getPropertyValue(
                                  "--yt-live-chat-paid-sticker-background-color"
                                )
                        if (
                          (getConfig.displaySuperChatAuthor() &&
                            vnodes.push(
                              external_m_default()(
                                "span",
                                {
                                  style: {
                                    color: headerColor,
                                    fontSize: "smaller",
                                    ...textStyle,
                                  },
                                },
                                `${
                                  null !==
                                    (_d =
                                      null == authorName
                                        ? void 0
                                        : authorName.innerText) && void 0 !== _d
                                    ? _d
                                    : ""
                                }: `
                              )
                            ),
                          normalChat && message)
                        ) {
                          const result = parseMessage(
                            length,
                            message,
                            getConfig
                          )
                          vnodes.push(
                            external_m_default()(
                              "span",
                              { style: { color: headerColor, ...textStyle } },
                              result.vnodes
                            )
                          ),
                            (semantic += result.semantic),
                            (length += result.length)
                        }
                        ;(length += paidAmount.innerText.length),
                          vnodes.push(
                            external_m_default()(
                              "span",
                              {
                                style: {
                                  color: paidColor,
                                  fontSize: "smaller",
                                  ...textStyle,
                                },
                              },
                              external_m_default()(
                                "strong",
                                { style: { ...textStyle } },
                                paidAmount.innerText
                              )
                            )
                          )
                      }
                    }
                  }),
                  { vnodes, semantic, authorType, authorID }
                )
              })(chat, getConfig),
              semanticTextContent =
                null !==
                  (_a = new DOMParser().parseFromString(
                    `<span>${chatData.semantic}<span>`,
                    "text/html"
                  ).body.textContent) && void 0 !== _a
                  ? _a
                  : ""
            ;((content, getConfig, mainLog) =>
              getConfig
                .bannedWords()
                .some(
                  word =>
                    !!content.includes(word) &&
                    (mainLog(`Banned Word: "${word}" in "${content}"`), !0)
                ))(semanticTextContent, getConfig, mainLog) ||
            ((content, getConfig, mainLog) =>
              getConfig.bannedWordRegexs().some(word => {
                const result = content.match(RegExp(word, "u"))
                return (
                  !!result &&
                  (mainLog(
                    `Banned Word: "${result.toString()}" in "${content}"`
                  ),
                  !0)
                )
              }))(semanticTextContent, getConfig, mainLog) ||
            (void 0 !== chatData.authorID &&
              ((authorID, getConfig, mainLog) =>
                getConfig
                  .bannedUsers()
                  .some(
                    user =>
                      !(
                        authorID !== user ||
                        (mainLog(`Banned User: "${authorID}"`), 0)
                      )
                  ))(chatData.authorID, getConfig, mainLog))
              ? (chat.style.display = "none")
              : (getConfig.createChats() &&
                  ((chatData, flowChats, chatScrn, mainState, getConfig) => {
                    var _a
                    let element
                    const offScreenChatIndex = flowChats.findIndex(
                      chat =>
                        chat.animationEnded ||
                        flowChats.length >= getConfig.maxChatCount()
                    )
                    if (-1 !== offScreenChatIndex) {
                      element = flowChats[offScreenChatIndex].element
                      const [oldChat] = flowChats.splice(offScreenChatIndex, 1)
                      null === (_a = oldChat.animation) ||
                        void 0 === _a ||
                        _a.cancel()
                    } else
                      external_log_default().debug("CreateFlowChat"),
                        (element = document.createElement("span")),
                        chatScrn.append(element)
                    element.classList.add("fyc_chat")
                    const flowChat = {
                      element,
                      lane: -1,
                      animation: void 0,
                      animationDuration: 0,
                      animationEnded: !1,
                      authorType: chatData.authorType,
                    }
                    external_m_default().render(element, chatData.vnodes),
                      setChatStyle(flowChat, mainState, getConfig),
                      setChatAnimation(
                        flowChat,
                        flowChats,
                        mainState,
                        getConfig
                      )
                        ? flowChats.push(flowChat)
                        : flowChat.element.remove()
                  })(chatData, flowChats, chatScrn, mainState, getConfig),
                getConfig.createBanButton() &&
                  void 0 !== chatData.authorID &&
                  !chat.querySelector(".owner") &&
                  createBanButton(
                    chat,
                    chatData.authorID,
                    getConfig,
                    setConfig
                  ),
                getConfig.simplifyChatField() &&
                  (chat => {
                    if (
                      chat.querySelector(
                        ".style-scope.yt-live-chat-paid-message-renderer"
                      ) ||
                      chat.querySelector(".owner")
                    )
                      return
                    chat.style.borderBottom =
                      "1px solid var(--yt-spec-text-secondary)"
                    const authorPhoto = chat.querySelector("#author-photo")
                    authorPhoto && (authorPhoto.style.display = "none")
                    const authorChip = chat.querySelector(
                      "yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer"
                    )
                    authorChip && (authorChip.style.display = "none")
                  })(chat))
          })
        },
        removeOldChats = (flowChats, maxChatCount) => {
          flowChats.sort((a, b) =>
            a.animationEnded === b.animationEnded
              ? 0
              : a.animationEnded
              ? -1
              : 1
          ),
            flowChats
              .splice(0, Math.max(0, flowChats.length - maxChatCount))
              .forEach(x => {
                external_log_default().debug("RemoveChat"), x.element.remove()
              })
        },
        settingPanel_option = (value, label) =>
          external_m_default()("option", { value }, label),
        settingRow = (label, content) =>
          external_m_default()("div", [
            external_m_default()("span", label),
            external_m_default()("div", content),
          ]),
        textColorRow = (color, textStyle, oninput) =>
          external_m_default()("div", [
            external_m_default()("input", {
              style: { width: "36px", verticalAlign: "middle" },
              type: "color",
              value: color,
              oninput,
            }),
            external_m_default()("input", {
              style: { verticalAlign: "middle", width: "5.5em" },
              type: "text",
              maxlength: 20,
              value: color,
              oninput,
            }),
            external_m_default()(
              "span",
              { style: { ...textStyle, color } },
              "Aa1あア亜"
            ),
          ]),
        rangeRow = (min, max, step, value, oninput) =>
          external_m_default()("div", [
            external_m_default()("input", {
              style: { width: "150px", verticalAlign: "middle" },
              type: "range",
              min,
              max,
              step,
              value,
              oninput,
            }),
            external_m_default()("input", {
              style: {
                width: "30px",
                backgroundColor: "transparent",
                color: "inherit",
                borderWidth: "1px",
                verticalAlign: "middle",
              },
              inputmode: "decimal",
              value,
              onchange: oninput,
            }),
          ]),
        checkboxRow = (label, checked, onchange) =>
          external_m_default()(
            "div",
            external_m_default()("label", [
              label,
              external_m_default()("input", {
                type: "checkbox",
                checked,
                onchange,
              }),
            ])
          ),
        getInputValue = e => {
          const target = e.currentTarget
          if (
            target instanceof HTMLSelectElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLInputElement
          )
            return target.value
          throw Error(
            "Event target isn't an Input or TextArea or Input element"
          )
        },
        getInputChecked = e => {
          return ((constructor = HTMLInputElement),
          (x = e.currentTarget),
          assert_lib(x instanceof constructor),
          x).checked
          var constructor, x
        },
        langOptions = [
          ["FYC_EN", "English"],
          ["FYC_JA", "日本語"],
        ],
        fontOptions = [
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
        ],
        settingPanel = (flowChats, mainState, state, getConfig, setConfig) => {
          var _a, _b
          const panelState = {
              bannedWordRegexs: getConfig.bannedWordRegexs(),
              bannedWordRegexsValid: !0,
              bannedWordRegexsError: "",
              currentTab: 0,
              timingStepCount: parseInt(
                null !==
                  (_b =
                    null ===
                      (_a = getConfig
                        .timingFunction()
                        .match(/^steps\((\d+),.+/)) || void 0 === _a
                      ? void 0
                      : _a[1]) && void 0 !== _b
                  ? _b
                  : "150",
                10
              ),
            },
            stepTiming = stepCount => `steps(${stepCount}, jump-end)`,
            useStepTiming = () =>
              Boolean(getConfig.timingFunction().match(/^steps\(.+/)),
            panelBoxStyle = width => ({
              flex: `0 0 ${width}px`,
              margin: "2px",
            }),
            textAreaStyle = {
              resize: "horizontal",
              boxSizing: "border-box",
              width: "100%",
            },
            textRecord = {
              font: ["Font", "フォント"],
              color: ["Color(Normal)", "色(通常)"],
              ownerColor: ["Color(Owner)", "色(オーナー)"],
              moderatorColor: ["Color(Moderator)", "色(モデレーター)"],
              memberColor: ["Color(Member)", "色(メンバー)"],
              feedback: ["Feedback", "バグ報告と要望"],
              eventLog: ["Event log", "イベントログ"],
              giveFeedback: [
                "Give your feedbacks here(Please attach the event log if they're bug related)",
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
              bannedWordRegexs: ["Banned Words(Regex)", "NGワード(正規表現)"],
              bannedUsers: ["Banned Users", "NGユーザー"],
              simplifyChatField: ["Simplify", "簡略化する"],
              createBanButton: ["Show ban button", "NGボタンを表示する"],
              displayModName: [
                "Show moderator's name",
                "モデレータの名前を表示する",
              ],
              displaySuperChatAuthor: [
                "Show super chat author",
                "スパチャの作成者を表示する",
              ],
              createChats: ["Display flowing chats", "チャットを流す"],
              textOnly: [
                "Text only(ignore emojis)",
                "文字のみ(絵文字を無視する)",
              ],
              error: ["Error", "エラー"],
              video: ["Video", "画面"],
              chatField: ["Chat Window", "チャット欄"],
              useStepTiming: ["Move chat in steps", "チャットを段階的に動かす"],
              timingStepCount: ["└Step Count", "└段階数"],
              chatFilter: ["Chat Filter", "チャットフィルター"],
              flowChat: ["Flow Chat", "チャット流れ"],
              clearFlowChats: [
                "Clear Flowing Chats",
                "流れるチャットをクリアする",
              ],
              flowNewChatIf: [
                "A new chat will appear if all of the followings are met:",
                "新しいチャットは以下のすべてを満たす場合に流れます：",
              ],
              noOverlap: ["└Chats won't overlap", "└他のチャットと重ならない"],
              minSpacing: ["Min spacing between chats", "チャットの最小間隔"],
              fieldScale: ["Scale", "拡大率"],
            },
            getLang = key => {
              const lang = getConfig.lang()
              return textRecord[key]["FYC_EN" === lang ? 0 : 1]
            },
            ss = {
              lang: new external_rxjs_namespaceObject.Subject(),
              font: new external_rxjs_namespaceObject.Subject(),
              color: new external_rxjs_namespaceObject.Subject(),
              ownerColor: new external_rxjs_namespaceObject.Subject(),
              moderatorColor: new external_rxjs_namespaceObject.Subject(),
              memberColor: new external_rxjs_namespaceObject.Subject(),
              num: {
                chatOpacity: new external_rxjs_namespaceObject.Subject(),
                fontSize: new external_rxjs_namespaceObject.Subject(),
                fontWeight: new external_rxjs_namespaceObject.Subject(),
                shadowFontWeight: new external_rxjs_namespaceObject.Subject(),
                flowSpeed: new external_rxjs_namespaceObject.Subject(),
                minSpacing: new external_rxjs_namespaceObject.Subject(),
                fieldScale: new external_rxjs_namespaceObject.Subject(),
              },
              int: {
                maxChatCount: new external_rxjs_namespaceObject.Subject(),
                maxChatLength: new external_rxjs_namespaceObject.Subject(),
                laneCount: new external_rxjs_namespaceObject.Subject(),
              },
              bannedWords: new external_rxjs_namespaceObject.Subject(),
              bannedWordRegexs: new external_rxjs_namespaceObject.Subject(),
              bannedUsers: new external_rxjs_namespaceObject.Subject(),
              createChats: new external_rxjs_namespaceObject.Subject(),
              textOnly: new external_rxjs_namespaceObject.Subject(),
              displayModName: new external_rxjs_namespaceObject.Subject(),
              displaySuperChatAuthor: new external_rxjs_namespaceObject.Subject(),
              noOverlap: new external_rxjs_namespaceObject.Subject(),
              simplifyChatField: new external_rxjs_namespaceObject.Subject(),
              createBanButton: new external_rxjs_namespaceObject.Subject(),
              useStepTiming: new external_rxjs_namespaceObject.Subject(),
              timingStepCount: new external_rxjs_namespaceObject.Subject(),
              clearFlowChats: new external_rxjs_namespaceObject.Subject(),
              tabChange: new external_rxjs_namespaceObject.Subject(),
            },
            checkboxNode = label =>
              checkboxRow(getLang(label), getConfig[label](), lib(ss[label])),
            textColorNode = label =>
              settingRow(getLang(label), [
                textColorRow(
                  getConfig[label](),
                  {
                    fontFamily: getConfig.font(),
                    fontWeight: getConfig.fontWeight().toString(),
                  },
                  lib(ss[label])
                ),
              ]),
            rangeNode = (label, streams, min, max, step) =>
              settingRow(getLang(label), [
                rangeRow(
                  min,
                  max,
                  step,
                  getConfig[label](),
                  lib(streams[label])
                ),
              ]),
            updateStringMacro = key => {
              return (
                (stream = ss[key]),
                (configKey = key),
                stream.pipe(
                  (0, external_rxjs_operators_namespaceObject.map)(
                    getInputValue
                  ),
                  (0, external_rxjs_operators_namespaceObject.tap)(x => {
                    setConfig[configKey](x)
                  })
                )
              )
              var stream, configKey
            },
            updateNumberMacro = key => {
              return (
                (stream = ss.num[key]),
                (configKey = key),
                stream.pipe(
                  (0, external_rxjs_operators_namespaceObject.map)(
                    getInputValue
                  ),
                  (0, external_rxjs_operators_namespaceObject.map)(parseFloat),
                  (0, external_rxjs_operators_namespaceObject.tap)(x => {
                    setConfig[configKey](x)
                  })
                )
              )
              var stream, configKey
            },
            updateIntMacro = key => {
              return (
                (stream = ss.int[key]),
                (configKey = key),
                stream.pipe(
                  (0, external_rxjs_operators_namespaceObject.map)(
                    getInputValue
                  ),
                  (0, external_rxjs_operators_namespaceObject.map)(x =>
                    parseInt(x, 10)
                  ),
                  (0, external_rxjs_operators_namespaceObject.tap)(x => {
                    setConfig[configKey](x)
                  })
                )
              )
              var stream, configKey
            },
            updateBoolMacro = key => {
              return (
                (stream = ss[key]),
                (configKey = key),
                stream.pipe(
                  (0, external_rxjs_operators_namespaceObject.map)(
                    getInputChecked
                  ),
                  (0, external_rxjs_operators_namespaceObject.tap)(x => {
                    setConfig[configKey](x)
                  })
                )
              )
              var stream, configKey
            }
          return (
            (0, external_rxjs_namespaceObject.merge)(
              (0, external_rxjs_namespaceObject.merge)(
                (0, external_rxjs_namespaceObject.merge)(
                  updateStringMacro("font"),
                  updateNumberMacro("fontSize"),
                  updateNumberMacro("fontWeight"),
                  updateIntMacro("laneCount"),
                  updateNumberMacro("minSpacing")
                ).pipe(
                  (0, external_rxjs_operators_namespaceObject.mapTo)({
                    setStyle: !0,
                    setAnimation: !0,
                  })
                ),
                (0, external_rxjs_namespaceObject.merge)(
                  updateStringMacro("color"),
                  updateStringMacro("ownerColor"),
                  updateStringMacro("moderatorColor"),
                  updateStringMacro("memberColor"),
                  updateNumberMacro("chatOpacity"),
                  updateNumberMacro("shadowFontWeight")
                ).pipe(
                  (0, external_rxjs_operators_namespaceObject.mapTo)({
                    setStyle: !0,
                  })
                ),
                (0, external_rxjs_namespaceObject.merge)(
                  updateNumberMacro("flowSpeed")
                ).pipe(
                  (0, external_rxjs_operators_namespaceObject.mapTo)({
                    setPlayState: !0,
                  })
                ),
                (0, external_rxjs_namespaceObject.merge)(
                  updateIntMacro("maxChatCount").pipe(
                    (0, external_rxjs_operators_namespaceObject.tap)(x =>
                      removeOldChats(flowChats, x)
                    )
                  ),
                  updateBoolMacro("noOverlap"),
                  ss.useStepTiming.pipe(
                    (0, external_rxjs_operators_namespaceObject.map)(
                      getInputChecked
                    ),
                    (0, external_rxjs_operators_namespaceObject.tap)(x => {
                      setConfig.timingFunction(
                        x ? stepTiming(panelState.timingStepCount) : "linear"
                      )
                    })
                  ),
                  ss.timingStepCount.pipe(
                    (0, external_rxjs_operators_namespaceObject.map)(
                      getInputValue
                    ),
                    (0, external_rxjs_operators_namespaceObject.map)(x =>
                      parseInt(x, 10)
                    ),
                    (0, external_rxjs_operators_namespaceObject.tap)(x => {
                      ;(panelState.timingStepCount = x),
                        setConfig.timingFunction(stepTiming(x))
                    })
                  )
                ).pipe(
                  (0, external_rxjs_operators_namespaceObject.mapTo)({
                    setAnimation: !0,
                  })
                )
              ).pipe(
                (0, external_rxjs_operators_namespaceObject.throttleTime)(
                  180,
                  void 0,
                  { leading: !0, trailing: !0 }
                ),
                (0, external_rxjs_operators_namespaceObject.tap)(x => {
                  flowChats
                    .filter(chat => !chat.animationEnded)
                    .forEach(chat => {
                      const config = {
                        setStyle: !1,
                        setAnimation: !1,
                        setPlayState: !1,
                        ...x,
                      }
                      config.setStyle &&
                        setChatStyle(chat, mainState, getConfig),
                        config.setAnimation
                          ? setChatAnimation(
                              chat,
                              flowChats,
                              mainState,
                              getConfig
                            )
                          : config.setPlayState &&
                            setChatPlayState(chat, mainState, getConfig)
                    })
                })
              ),
              updateStringMacro("lang"),
              ss.tabChange.pipe(
                (0, external_rxjs_operators_namespaceObject.tap)(x => {
                  panelState.currentTab = x
                })
              ),
              updateIntMacro("maxChatLength"),
              updateBoolMacro("simplifyChatField"),
              updateBoolMacro("createBanButton"),
              updateBoolMacro("createChats"),
              updateBoolMacro("displayModName"),
              updateBoolMacro("displaySuperChatAuthor"),
              updateBoolMacro("textOnly"),
              updateNumberMacro("fieldScale"),
              ss.bannedWords.pipe(
                (0, external_rxjs_operators_namespaceObject.map)(getInputValue),
                (0, external_rxjs_operators_namespaceObject.map)(x =>
                  x.split(/\r\n|\n/).filter(word => "" !== word)
                ),
                (0, external_rxjs_operators_namespaceObject.tap)(x => {
                  setConfig.bannedWords(x)
                })
              ),
              ss.bannedWordRegexs.pipe(
                (0, external_rxjs_operators_namespaceObject.map)(getInputValue),
                (0, external_rxjs_operators_namespaceObject.map)(x =>
                  x.split(/\r\n|\n/).filter(regex => "" !== regex)
                ),
                (0, external_rxjs_operators_namespaceObject.tap)(x => {
                  panelState.bannedWordRegexs = x
                  let valid = !0
                  ;(panelState.bannedWordRegexsError = ""),
                    panelState.bannedWordRegexs.forEach(regex => {
                      try {
                        RegExp(regex, "u")
                      } catch (error) {
                        ;(panelState.bannedWordRegexsError += `${error} in ${regex};`),
                          (valid = !1)
                      }
                    }),
                    valid && setConfig.bannedWordRegexs(x),
                    (panelState.bannedWordRegexsValid = valid)
                })
              ),
              ss.bannedUsers.pipe(
                (0, external_rxjs_operators_namespaceObject.map)(getInputValue),
                (0, external_rxjs_operators_namespaceObject.map)(x =>
                  x.split(/\r\n|\n/).filter(user => "" !== user)
                ),
                (0, external_rxjs_operators_namespaceObject.tap)(x => {
                  setConfig.bannedUsers(x)
                })
              ),
              ss.clearFlowChats.pipe(
                (0, external_rxjs_operators_namespaceObject.tap)(() =>
                  removeOldChats(flowChats, 0)
                )
              )
            ).subscribe(),
            {
              view: () => {
                return external_m_default()(
                  "div",
                  {
                    className: "fyc_panel",
                    style: {
                      visibility: state.showPanel ? "visible" : "hidden",
                      backgroundColor: "rgba(30,30,30,0.9)",
                      zIndex: 5,
                      position: "absolute",
                      bottom: "40px",
                      right: "0px",
                      color: "#fff",
                      fontSize: "14px",
                      width: "660px",
                      border: "solid 1px #666",
                      fontFamily: "MS PGothic",
                      lineHeight: "1.2",
                    },
                  },
                  [
                    external_m_default()(
                      "div",
                      { style: { float: "right", margin: "3px 3px 0 0" } },
                      [
                        "🌐",
                        external_m_default()(
                          "select",
                          {
                            selectedIndex: langOptions.findIndex(
                              x => x[0] === getConfig.lang()
                            ),
                            onchange: lib(ss.lang),
                          },
                          langOptions.map(x => settingPanel_option(...x))
                        ),
                      ]
                    ),
                    ((style = {
                      container: { height: "364px" },
                      label: { padding: "6px" },
                      labelFocus: { background: "#666" },
                      tab: { display: "flex", padding: "6px" },
                    }),
                    (labels = [
                      getLang("flowChat"),
                      getLang("chatFilter"),
                      getLang("chatField"),
                      getLang("feedback"),
                    ]),
                    (tabs = [
                      [
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(212) },
                          [
                            settingRow(getLang("font"), [
                              external_m_default()(
                                "select",
                                {
                                  style: { width: "60%" },
                                  selectedIndex: fontOptions.findIndex(
                                    x => x[0] === getConfig.font()
                                  ),
                                  onchange: lib(ss.font),
                                },
                                fontOptions.map(x =>
                                  settingPanel_option(
                                    x[0],
                                    "FYC_JA" === getConfig.lang() ? x[2] : x[1]
                                  )
                                )
                              ),
                            ]),
                            textColorNode("color"),
                            textColorNode("ownerColor"),
                            textColorNode("moderatorColor"),
                            textColorNode("memberColor"),
                          ]
                        ),
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(212) },
                          [
                            rangeNode("chatOpacity", ss.num, 0, 1, 0.05),
                            rangeNode("fontSize", ss.num, 0.3, 2, 0.05),
                            rangeNode("fontWeight", ss.num, 10, 1e3, 10),
                            rangeNode("shadowFontWeight", ss.num, 0, 3, 0.1),
                            rangeNode("flowSpeed", ss.num, 1, 50, 1),
                            rangeNode("maxChatCount", ss.int, 5, 200, 5),
                            rangeNode("maxChatLength", ss.int, 5, 200, 5),
                            rangeNode("laneCount", ss.int, 1, 25, 1),
                          ]
                        ),
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(212) },
                          [
                            rangeNode("minSpacing", ss.num, 0, 2.5, 0.1),
                            checkboxRow(
                              getLang("useStepTiming"),
                              useStepTiming(),
                              lib(ss.useStepTiming)
                            ),
                            external_m_default()(
                              "div",
                              {
                                style: {
                                  ...(useStepTiming()
                                    ? {}
                                    : { opacity: "0.5" }),
                                },
                              },
                              settingRow(getLang("timingStepCount"), [
                                rangeRow(
                                  1,
                                  400,
                                  1,
                                  panelState.timingStepCount,
                                  lib(ss.timingStepCount)
                                ),
                              ])
                            ),
                            checkboxNode("createChats"),
                            checkboxNode("displayModName"),
                            checkboxNode("displaySuperChatAuthor"),
                            checkboxNode("textOnly"),
                            external_m_default()(
                              "span",
                              getLang("flowNewChatIf")
                            ),
                            checkboxNode("noOverlap"),
                            external_m_default()(
                              "button",
                              {
                                type: "button",
                                onclick: lib(ss.clearFlowChats),
                              },
                              getLang("clearFlowChats")
                            ),
                          ]
                        ),
                      ],
                      [
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(212) },
                          [
                            settingRow(getLang("bannedWords"), [
                              external_m_default()(
                                "textarea",
                                {
                                  rows: 18,
                                  style: textAreaStyle,
                                  onchange: lib(ss.bannedWords),
                                },
                                getConfig.bannedWords().join("\n")
                              ),
                            ]),
                          ]
                        ),
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(212) },
                          [
                            settingRow(getLang("bannedWordRegexs"), [
                              external_m_default()(
                                "span",
                                panelState.bannedWordRegexsValid
                                  ? ""
                                  : `${getLang("error")}: ${
                                      panelState.bannedWordRegexsError
                                    }`
                              ),
                              external_m_default()(
                                "textarea",
                                {
                                  rows: 18,
                                  style: textAreaStyle,
                                  onchange: lib(ss.bannedWordRegexs),
                                },
                                panelState.bannedWordRegexs.join("\n")
                              ),
                            ]),
                          ]
                        ),
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(212) },
                          [
                            settingRow(getLang("bannedUsers"), [
                              external_m_default()(
                                "textarea",
                                {
                                  rows: 18,
                                  style: textAreaStyle,
                                  onchange: lib(ss.bannedUsers),
                                },
                                getConfig.bannedUsers().join("\n")
                              ),
                            ]),
                          ]
                        ),
                      ],
                      [
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(644) },
                          [
                            rangeNode("fieldScale", ss.num, 0.7, 1.5, 0.05),
                            checkboxNode("simplifyChatField"),
                            checkboxNode("createBanButton"),
                          ]
                        ),
                      ],
                      [
                        external_m_default()(
                          "div",
                          { style: panelBoxStyle(644) },
                          [
                            external_m_default()(
                              "div",
                              { style: { float: "right" } },
                              external_m_default()(
                                "a",
                                {
                                  style: { color: "#f0f" },
                                  href:
                                    "https://greasyfork.org/en/scripts/411442-flow-youtube-chat/feedback",
                                  target: "_blank",
                                },
                                getLang("giveFeedback")
                              )
                            ),
                            settingRow(getLang("eventLog"), [
                              external_m_default()(
                                "textarea",
                                {
                                  rows: 18,
                                  style: textAreaStyle,
                                  readOnly: !0,
                                  onclick: () => {},
                                },
                                mainState.log
                              ),
                            ]),
                          ]
                        ),
                      ],
                    ]),
                    (currentTab = panelState.currentTab),
                    (ontabSelect = lib(ss.tabChange)),
                    external_m_default()("div", [
                      external_m_default()(
                        "div",
                        ...labels.map((x, i) =>
                          external_m_default()(
                            "span",
                            {
                              style: {
                                ...style.label,
                                ...(currentTab === i ? style.labelFocus : {}),
                                display: "inline-block",
                              },
                              onclick: () => ontabSelect(i),
                            },
                            x
                          )
                        )
                      ),
                      external_m_default()(
                        "div",
                        {
                          style: {
                            ...style.container,
                            overflow: "hidden auto",
                          },
                        },
                        ...tabs.map((x, i) => {
                          var _a
                          return external_m_default()(
                            "div",
                            {
                              style: {
                                ...style.tab,
                                display:
                                  i === currentTab
                                    ? null !== (_a = style.tab.display) &&
                                      void 0 !== _a
                                      ? _a
                                      : "block"
                                    : "none",
                              },
                            },
                            x
                          )
                        })
                      ),
                    ])),
                  ]
                )
                var style, labels, tabs, currentTab, ontabSelect
              },
            }
          )
        },
        settingComponent = (flowChats, mainState, getConfig, setConfig) => {
          const state = { showPanel: !1 },
            panel = settingPanel(
              flowChats,
              mainState,
              state,
              getConfig,
              setConfig
            ),
            toggleButton = ((state, getConfig) => {
              const click$ = new external_rxjs_namespaceObject.Subject()
              return (
                click$
                  .pipe(
                    (0, external_rxjs_operators_namespaceObject.tap)(() => {
                      state.showPanel = !state.showPanel
                    })
                  )
                  .subscribe(),
                {
                  view: () =>
                    external_m_default()(
                      "button",
                      {
                        className: "fyc_button",
                        style: {
                          background: "rgba(0,0,0,0)",
                          marginLeft: "10px",
                          whiteSpace: "nowrap",
                        },
                        onclick: lib(click$),
                      },
                      [
                        external_m_default()(
                          "svg",
                          {
                            preserveAspectRatio: "xMidYMid meet",
                            viewBox: "0 0 640 640",
                            width: "15",
                            height: "15",
                            style: { position: "relative", top: "1px" },
                          },
                          [
                            external_m_default()(
                              "defs",
                              external_m_default()("path", {
                                id: "d1TbzTC1zI",
                                d:
                                  "m135.38 58.17 0.64 0.05 0.63 0.07 0.65 0.1 0.65 0.13 0.66 0.14 0.66 0.17 0.67 0.18 0.67 0.21 0.68 0.23 0.69 0.25 0.68 0.26 0.69 0.29 0.7 0.3 0.69 0.32 0.7 0.33 0.71 0.35 0.7 0.37 0.71 0.38 0.71 0.39 0.7 0.41 0.72 0.42 0.71 0.43 0.71 0.45 45.87 26.91 0.9-0.5 8.92-4.47 9.12-4.12 0.92-0.38v142.27l-2.42 2.55-3.53 4.01-3.38 4.15-3.22 4.28-3.06 4.41-2.9 4.53-2.73 4.65-2.55 4.76-2.37 4.87-2.19 4.97-2 5.07-1.82 5.17-1.61 5.26-1.41 5.35-1.21 5.43-1 5.51-0.78 5.57-0.57 5.65-0.34 5.71-0.12 5.77 0.12 5.78 0.34 5.71 0.57 5.64 0.78 5.58 1 5.51 1.21 5.43 1.41 5.34 1.61 5.27 1.82 5.16 2 5.08 2.19 4.97 2.37 4.87 2.55 4.76 2.73 4.65 2.9 4.53 3.06 4.41 3.22 4.28 3.38 4.14 3.53 4.02 3.68 3.87 3.82 3.73 3.96 3.57 4.09 3.43 4.23 3.26 4.34 3.1 4.47 2.94 4.59 2.76 4.7 2.59 4.8 2.4 4.91 2.22 5.01 2.03 5.1 1.84 5.19 1.63 5.28 1.44 5.36 1.22 5.43 1.01 5.51 0.8 5.57 0.57 5.63 0.35 5.7 0.11 5.69-0.11 5.64-0.35 5.57-0.57 5.51-0.8 5.43-1.01 5.36-1.22 5.28-1.44 5.19-1.63 5.1-1.84 5.01-2.03 4.91-2.22 4.8-2.4 4.7-2.59 4.59-2.76 4.46-2.94 4.35-3.1 4.23-3.26 4.09-3.43 3.96-3.57 3.82-3.73 3.68-3.87 3.53-4.02 3.38-4.14 3.22-4.28 3.06-4.41 2.9-4.53 2.72-4.65 2.56-4.76 2.37-4.87 2.19-4.97 2-5.08 1.81-5.16 1.62-5.27 1.41-5.34 1.21-5.43 1-5.51 0.78-5.58 0.57-5.64 0.34-5.71 0.12-5.78-0.12-5.77-0.06-1.06h33.29l140.27 63.64-0.02 0.01-0.48 0.4-0.51 0.38-0.52 0.37-0.55 0.36-0.57 0.36-0.58 0.34-0.6 0.34-0.63 0.33-0.63 0.32-0.66 0.31-0.67 0.31-0.69 0.3-0.7 0.29-0.71 0.3-0.73 0.28-0.74 0.28-1.52 0.56-0.78 0.27-0.78 0.28-1.6 0.54-0.82 0.26-51.23 13.84-1.32 4.34-3.37 9.6-3.71 9.43-4.07 9.24-4.41 9.04-0.5 0.91 26.56 46.48 0.44 0.72 0.84 1.44 0.4 0.72 0.39 0.72 0.38 0.72 0.36 0.71 0.34 0.71 0.33 0.71 0.32 0.71 0.3 0.7 0.28 0.7 0.26 0.7 0.24 0.69 0.23 0.69 0.2 0.68 0.19 0.67 0.16 0.68 0.14 0.66 0.12 0.66 0.1 0.66 0.08 0.65 0.05 0.64 0.02 0.63 0.01 0.62-0.03 0.62-0.05 0.61-0.08 0.6-0.1 0.59-0.13 0.59-0.16 0.57-0.2 0.57-0.22 0.55-0.25 0.54-0.28 0.54-0.31 0.52-0.35 0.51-0.37 0.5-0.41 0.48-0.45 0.48-66.99 67.88-0.47 0.45-0.47 0.41-0.49 0.38-0.49 0.34-0.51 0.31-0.51 0.27-0.53 0.24-0.53 0.21-0.54 0.18-0.55 0.14-0.56 0.12-0.56 0.09-0.58 0.06-0.58 0.03-0.59 0.01-0.6-0.02-0.61-0.04-0.62-0.07-0.62-0.09-0.63-0.12-0.64-0.13-0.65-0.16-0.65-0.17-0.66-0.2-0.67-0.21-0.68-0.23-0.68-0.25-0.69-0.26-0.69-0.28-0.71-0.3-0.7-0.3-0.72-0.32-0.72-0.33-0.73-0.34-0.73-0.36-0.74-0.36-0.75-0.37-0.75-0.38-1.52-0.78-45.87-26.91-0.9 0.5-8.92 4.47-9.12 4.12-9.3 3.77-9.47 3.41-4.29 1.34-13.65 51.91-0.27 0.83-0.26 0.81-0.27 0.81-0.27 0.8-0.54 1.56-0.28 0.76-0.28 0.75-0.28 0.74-0.29 0.73-0.29 0.71-0.3 0.69-0.3 0.68-0.31 0.67-0.32 0.64-0.32 0.63-0.33 0.61-0.34 0.6-0.35 0.57-0.36 0.55-0.36 0.54-0.38 0.51-0.39 0.49-0.4 0.46-0.41 0.45-0.42 0.42-0.44 0.39-0.45 0.37-0.46 0.34-0.48 0.32-0.49 0.29-0.5 0.26-0.52 0.24-0.54 0.2-0.56 0.18-0.57 0.14-0.59 0.12-0.6 0.08-0.63 0.05-0.64 0.01h-94.74l-0.64-0.01-0.64-0.05-0.61-0.08-0.6-0.12-0.59-0.14-0.57-0.18-0.55-0.2-0.54-0.24-0.53-0.26-0.52-0.29-0.5-0.32-0.49-0.34-0.47-0.37-0.46-0.39-0.45-0.42-0.43-0.45-0.43-0.46-0.41-0.49-0.4-0.51-0.38-0.54-0.38-0.55-0.36-0.57-0.36-0.6-0.34-0.61-0.33-0.63-0.32-0.64-0.31-0.67-0.3-0.68-0.29-0.69-0.28-0.71-0.27-0.73-0.26-0.74-0.25-0.75-0.25-0.76-0.46-1.56-0.21-0.8-0.42-1.62-0.19-0.83-13.65-51.91-4.29-1.34-9.47-3.41-9.3-3.77-9.12-4.12-8.92-4.47-1.08-0.59-45.69 26.81-1.42 0.88-0.72 0.42-0.7 0.4-0.71 0.4-0.71 0.38-0.7 0.37-0.71 0.35-0.7 0.33-0.69 0.32-0.7 0.3-0.69 0.29-0.68 0.26-0.69 0.25-0.68 0.23-0.67 0.2-0.67 0.19-0.66 0.17-0.66 0.14-0.65 0.12-0.65 0.1-0.63 0.08-0.64 0.05-0.62 0.03h-0.62l-0.61-0.03-0.6-0.05-0.59-0.08-0.59-0.1-0.57-0.14-0.57-0.16-0.56-0.19-0.54-0.23-0.54-0.25-0.52-0.28-0.52-0.32-0.5-0.35-0.49-0.38-0.48-0.42-0.47-0.45-66.99-67.88-0.45-0.48-0.4-0.48-0.37-0.49-0.34-0.5-0.3-0.52-0.27-0.52-0.24-0.53-0.21-0.54-0.17-0.54-0.15-0.56-0.11-0.57-0.09-0.57-0.06-0.58-0.03-0.6-0.01-0.6 0.02-0.6 0.04-0.62 0.07-0.62 0.09-0.64 0.11-0.64 0.14-0.64 0.15-0.66 0.17-0.66 0.19-0.67 0.44-1.36 0.25-0.69 0.26-0.7 0.27-0.71 0.29-0.71 0.3-0.72 0.32-0.72 0.33-0.73 0.33-0.74 0.35-0.74 0.36-0.75 0.74-1.52 0.38-0.77 0.39-0.77 26.5-46.38-0.44-0.82-4.41-9.04-4.07-9.24-3.72-9.43-3.36-9.6-1.33-4.34-51.22-13.84-0.82-0.26-1.6-0.54-0.78-0.28-0.78-0.27-1.52-0.56-0.74-0.28-0.73-0.28-0.71-0.3-0.7-0.29-0.69-0.3-0.67-0.31-0.66-0.31-0.64-0.32-0.62-0.33-0.6-0.34-0.58-0.34-0.57-0.36-0.55-0.36-0.52-0.37-0.51-0.38-0.48-0.4-0.46-0.4-0.44-0.42-0.41-0.43-0.39-0.44-0.37-0.45-0.33-0.47-0.32-0.48-0.28-0.5-0.26-0.51-0.23-0.53-0.21-0.55-0.17-0.56-0.14-0.58-0.11-0.6-0.08-0.61-0.05-0.63-0.02-0.66v-96l0.02-0.65 0.05-0.64 0.08-0.62 0.11-0.61 0.14-0.59 0.17-0.58 0.21-0.57 0.23-0.54 0.26-0.54 0.28-0.52 0.32-0.51 0.33-0.49 0.37-0.48 0.39-0.47 0.41-0.45 0.44-0.45 0.46-0.42 0.48-0.42 0.51-0.4 0.52-0.4 0.55-0.38 0.57-0.37 0.58-0.35 0.6-0.35 0.62-0.34 0.64-0.32 0.66-0.32 0.67-0.3 0.69-0.29 0.7-0.29 0.71-0.27 0.73-0.27 0.74-0.25 0.76-0.25 0.76-0.24 1.56-0.44 0.8-0.22 0.8-0.2 0.82-0.2 51.22-13.83 1.33-4.35 3.36-9.6 3.72-9.42 4.07-9.24 4.41-9.04 0.5-0.91-26.56-46.48-0.77-1.54-0.74-1.52-0.36-0.75-0.35-0.74-0.33-0.74-0.33-0.73-0.32-0.73-0.3-0.71-0.29-0.72-0.27-0.7-0.26-0.7-0.25-0.69-0.44-1.36-0.19-0.67-0.17-0.66-0.15-0.66-0.14-0.65-0.11-0.64-0.09-0.63-0.07-0.62-0.04-0.62-0.02-0.61 0.01-0.6 0.03-0.59 0.06-0.58 0.09-0.58 0.11-0.56 0.15-0.56 0.17-0.55 0.21-0.54 0.24-0.53 0.27-0.52 0.3-0.51 0.34-0.5 0.37-0.49 0.4-0.49 0.45-0.47 66.99-67.88 0.47-0.45 0.48-0.42 0.49-0.38 0.5-0.35 0.52-0.32 0.52-0.28 0.54-0.26 0.54-0.22 0.56-0.19 0.57-0.17 0.57-0.13 0.59-0.11 0.59-0.08 0.6-0.05 0.61-0.02h0.62l0.62 0.03zm441.37-56.16 2.78 0.28 2.75 0.4 2.71 0.49 2.67 0.61 2.63 0.7 2.59 0.81 2.54 0.9 2.5 1 2.45 1.09 2.39 1.18 2.35 1.28 2.28 1.36 2.23 1.44 2.17 1.53 2.11 1.6 2.04 1.69 1.97 1.76 1.91 1.83 1.83 1.91 1.76 1.97 1.69 2.05 1.61 2.1 1.52 2.17 1.45 2.23 1.36 2.29 1.27 2.34 1.18 2.4 1.1 2.44 0.99 2.5 0.91 2.55 0.8 2.58 0.71 2.64 0.6 2.67 0.5 2.71 0.39 2.74 0.28 2.78 0.17 2.81 0.06 2.84v137.8l-0.06 2.84-0.17 2.81-0.28 2.78-0.39 2.75-0.5 2.71-0.6 2.67-0.71 2.63-0.8 2.59-0.91 2.54-0.99 2.5-1.1 2.45-1.18 2.39-1.27 2.35-1.36 2.28-1.45 2.23-1.52 2.17-1.61 2.11-1.69 2.04-1.76 1.97-1.83 1.91-1.91 1.83-1.97 1.76-2.04 1.69-2.11 1.61-2.17 1.52-2.23 1.45-2.28 1.36-2.35 1.27-0.98 0.49 21.81 70.8-141.75-63.6h-155.05l-2.84-0.06-2.81-0.17-2.78-0.28-2.74-0.39-2.71-0.5-2.67-0.6-2.64-0.71-2.58-0.8-2.55-0.91-2.5-1-2.44-1.09-2.4-1.18-2.34-1.27-2.29-1.36-2.23-1.45-2.17-1.52-2.1-1.61-2.05-1.69-1.97-1.76-1.91-1.83-1.83-1.91-1.76-1.97-1.68-2.04-1.61-2.11-1.53-2.17-1.44-2.23-1.36-2.28-1.27-2.35-1.19-2.39-1.09-2.45-1-2.5-0.9-2.54-0.81-2.59-0.7-2.63-0.61-2.67-0.49-2.71-0.39-2.75-0.29-2.78-0.17-2.81-0.06-2.84v-137.8l0.06-2.84 0.17-2.81 0.29-2.78 0.39-2.74 0.49-2.71 0.61-2.67 0.7-2.64 0.81-2.58 0.9-2.55 1-2.5 1.09-2.44 1.19-2.4 1.27-2.34 1.36-2.29 1.44-2.23 1.53-2.17 1.61-2.1 1.68-2.05 1.76-1.97 1.83-1.91 1.91-1.83 1.97-1.76 2.05-1.69 2.1-1.6 2.17-1.53 2.23-1.44 2.29-1.36 2.34-1.28 2.4-1.18 2.44-1.09 2.5-1 2.55-0.9 2.58-0.81 2.64-0.7 2.67-0.61 2.71-0.49 2.74-0.4 2.78-0.28 2.81-0.17 2.84-0.06h244.31l2.84 0.06 2.81 0.17z",
                              })
                            ),
                            external_m_default()("use", {
                              "xlink:href": "#d1TbzTC1zI",
                              opacity: "1",
                              fill: "var(--iron-icon-fill-color, currentcolor)",
                              "fill-opacity": "1",
                            }),
                          ]
                        ),
                        external_m_default()(
                          "span",
                          {
                            style: {
                              position: "relative",
                              top: "-2px",
                              marginLeft: "8px,",
                            },
                          },
                          "FYC_JA" === getConfig.lang() ? "設定" : "Settings"
                        ),
                      ]
                    ),
                }
              )
            })(state, getConfig)
          return {
            view: () => [
              external_m_default()(panel),
              external_m_default()(toggleButton),
            ],
          }
        },
        initialize = async (mainState, mainLog) => {
          const consoleLog = (a, ...b) => {
            mainLog(a, ...b),
              external_log_default().info(`【FYC】 ${a}`),
              b.length > 0 && external_log_default().info(...b)
          }
          mainLog("Version", package_namespaceObject_i8),
            mainLog("User Agent", window.navigator.userAgent)
          const userConfig = await (async () => ({
            lang: await simpleConfig("FYC_LANG", "FYC_EN"),
            font: await simpleConfig("FYC_FONT", "MS PGothic"),
            chatOpacity: await simpleConfig("FYC_OPACITY", 0.8),
            color: await simpleConfig("FYC_COLOR", "#ffffff"),
            ownerColor: await simpleConfig("FYC_COLOR_OWNER", "#ffd600"),
            moderatorColor: await simpleConfig(
              "FYC_COLOR_MODERATOR",
              "#a74fff"
            ),
            memberColor: await simpleConfig("FYC_COLOR_MEMBER", "#9fffff"),
            fontSize: await simpleConfig("FYC_SIZE", 1),
            fontWeight: await simpleConfig("FYC_WEIGHT", 730),
            shadowFontWeight: await simpleConfig("FYC_WEIGHT_SHADOW", 1),
            maxChatCount: await simpleConfig("FYC_LIMIT", 40),
            flowSpeed: await simpleConfig("FYC_SPEED", 18),
            maxChatLength: await simpleConfig("FYC_MAX", 100),
            laneCount: await simpleConfig("FYC_LANE_DIV", 12),
            bannedWords: await indirectConfig(
              "FYC_NG_WORDS",
              ...lineConfigArgs
            ),
            bannedWordRegexs: await indirectConfig(
              "FYC_NG_REG_WORDS",
              ...lineConfigArgs
            ),
            bannedUsers: await indirectConfig(
              "FYC_NG_USERS",
              ...lineConfigArgs
            ),
            createChats: await simpleConfig("FYC_TOGGLE_CREATE_COMMENTS", !0),
            noOverlap: await simpleConfig("FYC_NO_OVERLAP", !0),
            createBanButton: await simpleConfig("FYC_NG_BUTTON", !0),
            simplifyChatField: await simpleConfig("FYC_SIMPLE_CHAT_FIELD", !1),
            displayModName: await simpleConfig(
              "FYC_DISPLAY_MODERATOR_NAME",
              !0
            ),
            displaySuperChatAuthor: await simpleConfig(
              "FYC_DISPLAY_SUPER_CHAT_AUTHOR",
              !0
            ),
            textOnly: await simpleConfig("FYC_TEXT_ONLY", !1),
            timingFunction: await simpleConfig("FYC_TIMING_FUNCTION", "linear"),
            displayChats: await simpleConfig("FYC_DISPLAY_COMMENTS", !0),
            minSpacing: await simpleConfig("FYC_MIN_SPACING", 0.5),
            fieldScale: await simpleConfig("FYC_FIELD_SCALE", 1),
          }))()
          mainLog("UserConfig", JSON.stringify(userConfig))
          const configKeys = Object.keys(userConfig),
            getConfig = function_pipe(
              configKeys,
              es6_ReadonlyArray_map(x => [x, () => userConfig[x].val]),
              Object.fromEntries
            ),
            configStream = function_pipe(
              configKeys,
              es6_ReadonlyArray_map(x => [
                x,
                new external_rxjs_namespaceObject.Subject(),
              ]),
              Object.fromEntries
            ),
            channel = new BroadcastChannel("fyc-0615654655528523"),
            setConfigPlain = function_pipe(
              configKeys,
              es6_ReadonlyArray_map(x => [
                x,
                async val => {
                  ;(userConfig[x].val = val), configStream[x].next(val)
                },
              ]),
              Object.fromEntries
            ),
            setConfig = function_pipe(
              configKeys,
              es6_ReadonlyArray_map(x => [
                x,
                async val => {
                  setConfigPlain[x](val)
                  const item = userConfig[x]
                  channel.postMessage([x, val]),
                    await GM.setValue(item.gmKey, item.toGm(val))
                },
              ]),
              Object.fromEntries
            ),
            reinitSubject = new external_rxjs_namespaceObject.Subject(),
            reinitialize = lib(reinitSubject),
            chatScrn = (() => {
              const element = document.createElement("div")
              return (
                (element.style.pointerEvents = "none"),
                (element.style.zIndex = "30"),
                element
              )
            })(),
            css = (() => {
              const element = document.createElement("style")
              return (
                (element.innerHTML =
                  ".fyc_chat {\n    line-height: 1;\n    z-index: 30;\n    position: absolute;\n    user-select: none;\n    white-space: nowrap;\n    will-change: transform;\n  }\n  .fyc_chat > img {\n    vertical-align: text-top;\n  }\n  .fyc_button {\n    display: inline-block;\n    border-style: none;\n    z-index: 4;\n    font-weight: 500;\n    color: var(--yt-spec-text-secondary);\n  }"),
                element
              )
            })(),
            flowChats = [],
            observePair = con => {
              const subject = new external_rxjs_namespaceObject.Subject()
              return { subject, observer: new con(lib(subject)) }
            },
            documentMutationPair = observePair(MutationObserver),
            chatFieldMutationPair = observePair(MutationObserver),
            playerResizePair = observePair(ResizeObserver),
            simpleWrap = comp => ({
              comp,
              root: document.createElement("span"),
            }),
            wrappedToggleChatBtn = simpleWrap(
              ((flowChats, getConfig, setConfig) => {
                const click$ = new external_rxjs_namespaceObject.Subject()
                click$
                  .pipe(
                    (0, external_rxjs_operators_namespaceObject.tap)(() => {
                      const newDisplay = !getConfig.displayChats()
                      flowChats.forEach(x => {
                        x.element.style.visibility = newDisplay
                          ? "visible"
                          : "hidden"
                      }),
                        setConfig.displayChats(newDisplay)
                    })
                  )
                  .subscribe()
                const label = () =>
                  "チャット" + (getConfig.displayChats() ? "非表示" : "表示")
                return {
                  view: () =>
                    external_m_default()(
                      "button",
                      {
                        className: ["ytp-button"].join(" "),
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
                          width: "3em",
                        },
                        type: "button",
                        "aria-label": label(),
                        title: label(),
                        onclick: lib(click$),
                      },
                      [
                        external_m_default()(
                          "svg",
                          { style: { width: "100%" }, viewBox: "0 0 36 36" },
                          [
                            external_m_default()("path", {
                              className: ["chat-button-path"].join(" "),
                              d:
                                "m11 12h17q1 0 1 1v9q0 1-1 1h-1v2l-4-2h-12q-1 0-1-1v-9q0-1 1-1z",
                              fill: "#fff",
                              "fill-opacity": getConfig.displayChats()
                                ? "1"
                                : "0",
                              stroke: "#fff",
                              "stroke-width": "2",
                            }),
                          ]
                        ),
                      ]
                    ),
                }
              })(flowChats, getConfig, setConfig)
            ),
            wrappedSetting = simpleWrap(
              settingComponent(flowChats, mainState, getConfig, setConfig)
            ),
            livePage = {
              toggleChatBtnParent: () =>
                fromNullable(document.querySelector(".ytp-right-controls")),
              settingNextElement: () =>
                fromNullable(
                  document.querySelector(
                    "#menu-container .dropdown-trigger.ytd-menu-renderer"
                  )
                ),
              player: () =>
                fromNullable(document.querySelector("#movie_player")),
              video: () =>
                fromNullable(
                  document.querySelector("video.video-stream.html5-main-video")
                ),
              chatField: () =>
                function_pipe(
                  chatApp(),
                  chainNullableK(x =>
                    x.querySelector("#items.yt-live-chat-item-list-renderer")
                  )
                ),
              chatScroller: () =>
                function_pipe(
                  chatApp(),
                  chainNullableK(x =>
                    x.querySelector(
                      "#item-scroller.yt-live-chat-item-list-renderer"
                    )
                  )
                ),
              offlineSlate: () =>
                fromNullable(document.querySelector(".ytp-offline-slate")),
            },
            liveElementKeys = Object.keys(livePage),
            live = function_pipe(
              liveElementKeys,
              es6_ReadonlyArray_map(x => {
                return [x, ((key = x), { ele: none, read: livePage[key] })]
                var key
              }),
              Object.fromEntries
            ),
            eq = getEq(eqStrict).equals
          reinitSubject
            .pipe(
              (0, external_rxjs_operators_namespaceObject.observeOn)(
                external_rxjs_namespaceObject.asyncScheduler
              ),
              (0, external_rxjs_operators_namespaceObject.delay)(300),
              (0, external_rxjs_operators_namespaceObject.switchMap)(() =>
                (0, external_rxjs_namespaceObject.interval)(500).pipe(
                  (0, external_rxjs_operators_namespaceObject.filter)(() => {
                    return function_pipe(
                      liveElementKeys,
                      es6_ReadonlyArray_map(key => {
                        return function_pipe(
                          live[key].read(),
                          ((predicate = newEle => !eq(live[key].ele, newEle)),
                          function (a) {
                            return predicate(a) ? some(a) : none
                          }),
                          es6_Option_map(x => () => (
                            (live[key].ele = x),
                            consoleLog(`${key} changed`),
                            !0
                          )),
                          getOrElse(() => of(!1))
                        )
                        var predicate
                      }),
                      sequenceArray,
                      (function (f) {
                        return function (fa) {
                          return _map(fa, f)
                        }
                      })(
                        ((predicate = Boolean),
                        function (as) {
                          return as.some(predicate)
                        })
                      )
                    )()
                    var predicate
                  }),
                  (0, external_rxjs_operators_namespaceObject.startWith)(0)
                )
              ),
              (0, external_rxjs_operators_namespaceObject.tap)(() => {
                consoleLog("Loading..."),
                  removeOldChats(flowChats, 0),
                  documentMutationPair.observer.disconnect(),
                  documentMutationPair.observer.observe(document, {
                    childList: !0,
                    subtree: !0,
                  }),
                  chatFieldMutationPair.observer.disconnect(),
                  playerResizePair.observer.disconnect(),
                  document.head.append(css),
                  function_pipe(
                    [
                      function_pipe(
                        live.chatField.ele,
                        es6_Option_map(x => () => {
                          var chatField
                          ;((chatField = x),
                          () =>
                            function_pipe(
                              fromNullable(chatField.parentElement),
                              es6_Option_map(x => () => {
                                x.style.overflow = "unset"
                              })
                            ))(),
                            chatFieldMutationPair.observer.observe(x, {
                              childList: !0,
                            })
                        })
                      ),
                      function_pipe(
                        live.player.ele,
                        es6_Option_map(x => () => {
                          playerResizePair.observer.observe(x),
                            x.insertAdjacentElement("afterbegin", chatScrn)
                        })
                      ),
                      function_pipe(
                        live.toggleChatBtnParent.ele,
                        es6_Option_map(x => () => {
                          x.append(wrappedToggleChatBtn.root),
                            mountComponent(wrappedToggleChatBtn)
                        })
                      ),
                      function_pipe(
                        live.settingNextElement.ele,
                        es6_Option_map(x => () => {
                          x.insertAdjacentElement(
                            "beforebegin",
                            wrappedSetting.root
                          ),
                            mountComponent(wrappedSetting)
                        })
                      ),
                    ],
                    es6_ReadonlyArray_map(getOrElse(() => () => {})),
                    ReadonlyArray_append(
                      function_pipe(
                        live.video.ele,
                        filter(x => !x.paused),
                        alt(() => live.offlineSlate.ele),
                        isSome,
                        x => () => {
                          mainState.chatPlaying = x
                        }
                      )
                    ),
                    sequenceArray
                  )()
              }),
              (0, external_rxjs_operators_namespaceObject.switchMap)(() =>
                (0, external_rxjs_namespaceObject.merge)(
                  (0, external_rxjs_namespaceObject.fromEvent)(
                    channel,
                    "message"
                  ).pipe(
                    (0, external_rxjs_operators_namespaceObject.pluck)("data"),
                    (0, external_rxjs_operators_namespaceObject.tap)(
                      ([key, val]) => {
                        ;[
                          "bannedWords",
                          "bannedWordRegexs",
                          "bannedUsers",
                          "simplifyChatField",
                          "createBanButton",
                          "fieldScale",
                        ].includes(key) &&
                          (setConfigPlain[key](val),
                          external_m_default().redraw())
                      }
                    )
                  ),
                  ...function_pipe(
                    configKeys,
                    es6_ReadonlyArray_map(key =>
                      configStream[key].pipe(
                        (0, external_rxjs_operators_namespaceObject.tap)(x =>
                          mainLog(`Config ${key} changed`, x)
                        )
                      )
                    )
                  ),
                  configStream.fieldScale.pipe(
                    (0, external_rxjs_operators_namespaceObject.startWith)(
                      getConfig.fieldScale()
                    ),
                    (0, external_rxjs_operators_namespaceObject.tap)(scale =>
                      function_pipe(
                        live.chatField.ele,
                        match(
                          () => () => {},
                          field => () => {
                            function_pipe(
                              fromNullable(field.parentElement),
                              match(
                                () => () => {},
                                x => () => {
                                  ;(x.style.transformOrigin =
                                    (scale >= 1 ? "top" : "bottom") + " left"),
                                    (x.style.transform = `scale(${scale})`),
                                    (x.style.width = 100 / scale + "%"),
                                    (x.style.height = `${field.offsetHeight}px`)
                                }
                              )
                            )(),
                              function_pipe(
                                live.chatScroller.ele,
                                match(
                                  () => () => {},
                                  scroller => () => {
                                    scroller.scrollTop = scroller.scrollHeight
                                  }
                                )
                              )()
                          }
                        )
                      )()
                    )
                  ),
                  function_pipe(
                    live.video.ele,
                    match(
                      () => external_rxjs_namespaceObject.EMPTY,
                      x => {
                        return ((video = x),
                        (0, external_rxjs_namespaceObject.merge)(
                          (0, external_rxjs_namespaceObject.fromEvent)(
                            video,
                            "playing"
                          ).pipe(
                            (0, external_rxjs_operators_namespaceObject.mapTo)(
                              !0
                            )
                          ),
                          (0, external_rxjs_namespaceObject.fromEvent)(
                            video,
                            "waiting"
                          ).pipe(
                            (0, external_rxjs_operators_namespaceObject.mapTo)(
                              !1
                            )
                          ),
                          (0, external_rxjs_namespaceObject.fromEvent)(
                            video,
                            "pause"
                          ).pipe(
                            (0, external_rxjs_operators_namespaceObject.mapTo)(
                              !1
                            )
                          )
                        )).pipe(
                          (0, external_rxjs_operators_namespaceObject.map)(
                            playing => playing || isSome(live.offlineSlate.ele)
                          ),
                          (0, external_rxjs_operators_namespaceObject.tap)(
                            chatPlaying => {
                              ;(mainState.chatPlaying = chatPlaying),
                                flowChats.forEach(chat => {
                                  setChatPlayState(chat, mainState, getConfig)
                                })
                            }
                          )
                        )
                        var video
                      }
                    )
                  ),
                  chatFieldMutationPair.subject.pipe(
                    (0, external_rxjs_operators_namespaceObject.tap)(
                      onChatFieldMutate(
                        chatScrn,
                        flowChats,
                        mainState,
                        getConfig,
                        setConfig,
                        mainLog
                      )
                    )
                  ),
                  documentMutationPair.subject.pipe(
                    (0, external_rxjs_operators_namespaceObject.map)(
                      () => window.location.href
                    ),
                    (0,
                    external_rxjs_operators_namespaceObject.distinctUntilChanged)(),
                    (0, external_rxjs_operators_namespaceObject.skip)(1),
                    (0, external_rxjs_operators_namespaceObject.tap)(x => {
                      consoleLog("URL Changed", x),
                        removeOldChats(flowChats, 0),
                        consoleLog("Wait for 1700ms...")
                    }),
                    (0, external_rxjs_operators_namespaceObject.delay)(1700),
                    (0, external_rxjs_operators_namespaceObject.tap)(() =>
                      reinitialize()
                    )
                  ),
                  playerResizePair.subject.pipe(
                    (0,
                    external_rxjs_operators_namespaceObject.throttleTime)(
                      500,
                      void 0,
                      { leading: !0, trailing: !0 }
                    ),
                    (0, external_rxjs_operators_namespaceObject.startWith)([]),
                    (0, external_rxjs_operators_namespaceObject.map)(
                      () => live.player.ele
                    ),
                    (0, external_rxjs_operators_namespaceObject.map)(
                      es6_Option_map(x => x.getBoundingClientRect())
                    ),
                    (0, external_rxjs_operators_namespaceObject.tap)(x =>
                      ((rect, flowChats, mainState, getConfig, mainLog) =>
                        function_pipe(
                          rect,
                          match(
                            () => () => {},
                            x => () => {
                              mainLog("Resize detected"),
                                (mainState.playerRect = x),
                                flowChats.forEach(chat => {
                                  setChatStyle(chat, mainState, getConfig),
                                    setChatAnimation(
                                      chat,
                                      flowChats,
                                      mainState,
                                      getConfig
                                    )
                                })
                            }
                          )
                        )())(x, flowChats, mainState, getConfig, mainLog)
                    )
                  )
                )
              ),
              (0, external_rxjs_operators_namespaceObject.retryWhen)(
                (0, external_rxjs_operators_namespaceObject.tap)(x =>
                  consoleLog("Errored", x)
                )
              )
            )
            .subscribe(),
            reinitialize()
        }
      ;(async () => {
        external_log_namespaceObject.setLevel("info")
        const mainState = {
            chatPlaying: !0,
            playerRect: new DOMRect(24, 80, 839, 472),
            log: "",
          },
          mainLog = (mainState => (a, ...b) => {
            ;(mainState.log += `${a}${b.length > 0 ? ": " : ""}${b.join(
              ", "
            )}\n`),
              mainState.log.length > 22e3 &&
                (mainState.log = `${mainState.log.slice(0, 6e3)}\n`)
          })(mainState)
        try {
          await initialize(mainState, mainLog)
        } catch (error) {
          mainLog("Errored", error)
        }
      })()
    })()
})()
