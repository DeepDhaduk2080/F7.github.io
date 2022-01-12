!(function (v) {
  var a = !0;
  (v.flexslider = function (p, e) {
    var m = v(p);
    "undefined" == typeof e.rtl &&
      "rtl" == v("html").attr("dir") &&
      (e.rtl = !0),
      (m.vars = v.extend({}, v.flexslider.defaults, e));
    var t,
      r = m.vars.namespace,
      f =
        window.navigator &&
        window.navigator.msPointerEnabled &&
        window.MSGesture,
      o =
        ("ontouchstart" in window ||
          f ||
          (window.DocumentTouch && document instanceof DocumentTouch)) &&
        m.vars.touch,
      l = "click touchend MSPointerUp keyup",
      c = "",
      g = "vertical" === m.vars.direction,
      h = m.vars.reverse,
      S = 0 < m.vars.itemWidth,
      x = "fade" === m.vars.animation,
      d = "" !== m.vars.asNavFor,
      u = {};
    v.data(p, "flexslider", m),
      (u = {
        init: function () {
          (m.animating = !1),
            (m.currentSlide = parseInt(m.vars.startAt || 0, 10)),
            isNaN(m.currentSlide) && (m.currentSlide = 0),
            (m.animatingTo = m.currentSlide),
            (m.atEnd = 0 === m.currentSlide || m.currentSlide === m.last),
            (m.containerSelector = m.vars.selector.substr(
              0,
              m.vars.selector.search(" ")
            )),
            (m.slides = v(m.vars.selector, m)),
            (m.container = v(m.containerSelector, m)),
            (m.count = m.slides.length),
            (m.syncExists = 0 < v(m.vars.sync).length),
            "slide" === m.vars.animation && (m.vars.animation = "swing"),
            (m.prop = g ? "top" : m.vars.rtl ? "marginRight" : "marginLeft"),
            (m.args = {}),
            (m.manualPause = !1),
            (m.stopped = !1),
            (m.started = !1),
            (m.startTimeout = null),
            (m.transitions =
              !m.vars.video &&
              !x &&
              m.vars.useCSS &&
              (function () {
                var e,
                  t = document.createElement("div"),
                  a = [
                    "perspectiveProperty",
                    "WebkitPerspective",
                    "MozPerspective",
                    "OPerspective",
                    "msPerspective",
                  ];
                for (e in a)
                  if (t.style[a[e]] !== undefined)
                    return (
                      (m.pfx = a[e].replace("Perspective", "").toLowerCase()),
                      (m.prop = "-" + m.pfx + "-transform"),
                      !0
                    );
                return !1;
              })()),
            (m.isFirefox =
              -1 < navigator.userAgent.toLowerCase().indexOf("firefox")),
            (m.ensureAnimationEnd = "") !== m.vars.controlsContainer &&
              (m.controlsContainer =
                0 < v(m.vars.controlsContainer).length &&
                v(m.vars.controlsContainer)),
            "" !== m.vars.manualControls &&
              (m.manualControls =
                0 < v(m.vars.manualControls).length &&
                v(m.vars.manualControls)),
            "" !== m.vars.customDirectionNav &&
              (m.customDirectionNav =
                2 === v(m.vars.customDirectionNav).length &&
                v(m.vars.customDirectionNav)),
            m.vars.randomize &&
              (m.slides.sort(function () {
                return Math.round(Math.random()) - 0.5;
              }),
              m.container.empty().append(m.slides)),
            m.doMath(),
            m.setup("init"),
            m.vars.controlNav && u.controlNav.setup(),
            m.vars.directionNav && u.directionNav.setup(),
            m.vars.keyboard &&
              (1 === v(m.containerSelector).length ||
                m.vars.multipleKeyboard) &&
              v(document).on("keyup", function (e) {
                e = e.keyCode;
                m.animating ||
                  (39 !== e && 37 !== e) ||
                  ((e = m.vars.rtl
                    ? 37 === e
                      ? m.getTarget("next")
                      : 39 === e && m.getTarget("prev")
                    : 39 === e
                    ? m.getTarget("next")
                    : 37 === e && m.getTarget("prev")),
                  m.flexAnimate(e, m.vars.pauseOnAction));
              }),
            m.vars.mousewheel &&
              m.on("mousewheel", function (e, t, a, n) {
                e.preventDefault();
                t = t < 0 ? m.getTarget("next") : m.getTarget("prev");
                m.flexAnimate(t, m.vars.pauseOnAction);
              }),
            m.vars.pausePlay && u.pausePlay.setup(),
            m.vars.slideshow &&
              m.vars.pauseInvisible &&
              u.pauseInvisible.init(),
            m.vars.slideshow &&
              (m.vars.pauseOnHover &&
                m
                  .on("mouseenter", function () {
                    m.manualPlay || m.manualPause || m.pause();
                  })
                  .on("mouseleave", function () {
                    m.manualPause || m.manualPlay || m.stopped || m.play();
                  }),
              (m.vars.pauseInvisible && u.pauseInvisible.isHidden()) ||
                (0 < m.vars.initDelay
                  ? (m.startTimeout = setTimeout(m.play, m.vars.initDelay))
                  : m.play())),
            d && u.asNav.setup(),
            o && m.vars.touch && u.touch(),
            (x && !m.vars.smoothHeight) ||
              v(window).on("resize orientationchange focus", u.resize),
            m.find("img").attr("draggable", "false"),
            setTimeout(function () {
              m.vars.start(m);
            }, 200);
        },
        asNav: {
          setup: function () {
            (m.asNav = !0),
              (m.animatingTo = Math.floor(m.currentSlide / m.move)),
              (m.currentItem = m.currentSlide),
              m.slides
                .removeClass(r + "active-slide")
                .eq(m.currentItem)
                .addClass(r + "active-slide"),
              f
                ? (p._slider = m).slides.each(function () {
                    var e = this;
                    (e._gesture = new MSGesture()),
                      (e._gesture.target = e).addEventListener(
                        "MSPointerDown",
                        function (e) {
                          e.preventDefault(),
                            e.currentTarget._gesture &&
                              e.currentTarget._gesture.addPointer(e.pointerId);
                        },
                        !1
                      ),
                      e.addEventListener("MSGestureTap", function (e) {
                        e.preventDefault();
                        var t = v(this),
                          e = t.index();
                        v(m.vars.asNavFor).data("flexslider").animating ||
                          t.hasClass("active") ||
                          ((m.direction = m.currentItem < e ? "next" : "prev"),
                          m.flexAnimate(e, m.vars.pauseOnAction, !1, !0, !0));
                      });
                  })
                : m.slides.on(l, function (e) {
                    e.preventDefault();
                    var t = v(this),
                      a = t.index(),
                      e = m.vars.rtl
                        ? -1 * (t.offset().right - v(m).scrollLeft())
                        : t.offset().left - v(m).scrollLeft();
                    e <= 0 && t.hasClass(r + "active-slide")
                      ? m.flexAnimate(m.getTarget("prev"), !0)
                      : v(m.vars.asNavFor).data("flexslider").animating ||
                        t.hasClass(r + "active-slide") ||
                        ((m.direction = m.currentItem < a ? "next" : "prev"),
                        m.flexAnimate(a, m.vars.pauseOnAction, !1, !0, !0));
                  });
          },
        },
        controlNav: {
          setup: function () {
            m.manualControls
              ? u.controlNav.setupManual()
              : u.controlNav.setupPaging();
          },
          setupPaging: function () {
            var e,
              t =
                "thumbnails" === m.vars.controlNav
                  ? "control-thumbs"
                  : "control-paging",
              a = 1;
            if (
              ((m.controlNavScaffold = v(
                '<ol class="' + r + "control-nav " + r + t + '"></ol>'
              )),
              1 < m.pagingCount)
            )
              for (var n = 0; n < m.pagingCount; n++) {
                var i = m.slides.eq(n);
                undefined === i.attr("data-thumb-alt") &&
                  i.attr("data-thumb-alt", ""),
                  (e = v("<a></a>").attr("href", "#").text(a)),
                  "thumbnails" === m.vars.controlNav &&
                    (e = v("<img/>").attr("src", i.attr("data-thumb"))),
                  "" !== i.attr("data-thumb-alt") &&
                    e.attr("alt", i.attr("data-thumb-alt")),
                  "thumbnails" !== m.vars.controlNav ||
                    !0 !== m.vars.thumbCaptions ||
                    ("" !== (i = i.attr("data-thumbcaption")) &&
                      undefined !== i &&
                      ((s = v("<span></span>")
                        .addClass(r + "caption")
                        .text(i)),
                      e.append(s)));
                var s = v("<li>");
                e.appendTo(s),
                  s.append("</li>"),
                  m.controlNavScaffold.append(s),
                  a++;
              }
            (m.controlsContainer ? v(m.controlsContainer) : m).append(
              m.controlNavScaffold
            ),
              u.controlNav.set(),
              u.controlNav.active(),
              m.controlNavScaffold.on(l, "a, img", function (e) {
                var t, a;
                e.preventDefault(),
                  ("" !== c && c !== e.type) ||
                    ((t = v(this)),
                    (a = m.controlNav.index(t)),
                    t.hasClass(r + "active") ||
                      ((m.direction = a > m.currentSlide ? "next" : "prev"),
                      m.flexAnimate(a, m.vars.pauseOnAction))),
                  "" === c && (c = e.type),
                  u.setToClearWatchedEvent();
              });
          },
          setupManual: function () {
            (m.controlNav = m.manualControls),
              u.controlNav.active(),
              m.controlNav.on(l, function (e) {
                var t, a;
                e.preventDefault(),
                  ("" !== c && c !== e.type) ||
                    ((t = v(this)),
                    (a = m.controlNav.index(t)),
                    t.hasClass(r + "active") ||
                      (a > m.currentSlide
                        ? (m.direction = "next")
                        : (m.direction = "prev"),
                      m.flexAnimate(a, m.vars.pauseOnAction))),
                  "" === c && (c = e.type),
                  u.setToClearWatchedEvent();
              });
          },
          set: function () {
            var e = "thumbnails" === m.vars.controlNav ? "img" : "a";
            m.controlNav = v(
              "." + r + "control-nav li " + e,
              m.controlsContainer || m
            );
          },
          active: function () {
            m.controlNav
              .removeClass(r + "active")
              .eq(m.animatingTo)
              .addClass(r + "active");
          },
          update: function (e, t) {
            1 < m.pagingCount && "add" === e
              ? m.controlNavScaffold.append(
                  v('<li><a href="#">' + m.count + "</a></li>")
                )
              : (1 === m.pagingCount
                  ? m.controlNavScaffold.find("li")
                  : m.controlNav.eq(t).closest("li")
                ).remove(),
              u.controlNav.set(),
              1 < m.pagingCount && m.pagingCount !== m.controlNav.length
                ? m.update(t, e)
                : u.controlNav.active();
          },
        },
        directionNav: {
          setup: function () {
            var e = v(
              '<ul class="' +
                r +
                'direction-nav"><li class="' +
                r +
                'nav-prev"><a class="' +
                r +
                'prev" href="#">' +
                m.vars.prevText +
                '</a></li><li class="' +
                r +
                'nav-next"><a class="' +
                r +
                'next" href="#">' +
                m.vars.nextText +
                "</a></li></ul>"
            );
            m.customDirectionNav
              ? (m.directionNav = m.customDirectionNav)
              : m.controlsContainer
              ? (v(m.controlsContainer).append(e),
                (m.directionNav = v(
                  "." + r + "direction-nav li a",
                  m.controlsContainer
                )))
              : (m.append(e),
                (m.directionNav = v("." + r + "direction-nav li a", m))),
              u.directionNav.update(),
              m.directionNav.on(l, function (e) {
                var t;
                e.preventDefault(),
                  ("" !== c && c !== e.type) ||
                    ((t = v(this).hasClass(r + "next")
                      ? m.getTarget("next")
                      : m.getTarget("prev")),
                    m.flexAnimate(t, m.vars.pauseOnAction)),
                  "" === c && (c = e.type),
                  u.setToClearWatchedEvent();
              });
          },
          update: function () {
            console.log("updating...");
            var e = r + "disabled";
            1 === m.pagingCount
              ? m.directionNav.addClass(e).attr("tabindex", "-1")
              : m.vars.animationLoop
              ? m.directionNav.removeClass(e).prop("tabindex", "-1")
              : 0 === m.animatingTo
              ? m.directionNav
                  .removeClass(e)
                  .filter("." + r + "prev")
                  .addClass(e)
                  .attr("tabindex", "-1")
              : m.animatingTo === m.last
              ? m.directionNav
                  .removeClass(e)
                  .filter("." + r + "next")
                  .addClass(e)
                  .attr("tabindex", "-1")
              : m.directionNav.removeClass(e).prop("tabindex", "-1");
          },
        },
        pausePlay: {
          setup: function () {
            var e = v('<div class="' + r + 'pauseplay"><a href="#"></a></div>');
            m.controlsContainer
              ? (m.controlsContainer.append(e),
                (m.pausePlay = v("." + r + "pauseplay a", m.controlsContainer)))
              : (m.append(e), (m.pausePlay = v("." + r + "pauseplay a", m))),
              u.pausePlay.update(m.vars.slideshow ? r + "pause" : r + "play"),
              m.pausePlay.on(l, function (e) {
                e.preventDefault(),
                  ("" !== c && c !== e.type) ||
                    (v(this).hasClass(r + "pause")
                      ? ((m.manualPause = !0), (m.manualPlay = !1), m.pause())
                      : ((m.manualPause = !1), (m.manualPlay = !0), m.play())),
                  "" === c && (c = e.type),
                  u.setToClearWatchedEvent();
              });
          },
          update: function (e) {
            "play" === e
              ? m.pausePlay
                  .removeClass(r + "pause")
                  .addClass(r + "play")
                  .html(m.vars.playText)
              : m.pausePlay
                  .removeClass(r + "play")
                  .addClass(r + "pause")
                  .html(m.vars.pauseText);
          },
        },
        touch: function () {
          var n,
            i,
            s,
            r,
            o,
            l,
            e,
            c,
            d,
            u = !1,
            t = 0,
            a = 0,
            v = 0;
          f
            ? ((p.style.msTouchAction = "none"),
              (p._gesture = new MSGesture()),
              (p._gesture.target = p).addEventListener(
                "MSPointerDown",
                function (e) {
                  e.stopPropagation(),
                    m.animating
                      ? e.preventDefault()
                      : (m.pause(),
                        p._gesture.addPointer(e.pointerId),
                        (v = 0),
                        (r = g ? m.h : m.w),
                        (l = Number(new Date())),
                        (s =
                          S && h && m.animatingTo === m.last
                            ? 0
                            : S && h
                            ? m.limit -
                              (m.itemW + m.vars.itemMargin) *
                                m.move *
                                m.animatingTo
                            : S && m.currentSlide === m.last
                            ? m.limit
                            : S
                            ? (m.itemW + m.vars.itemMargin) *
                              m.move *
                              m.currentSlide
                            : h
                            ? (m.last - m.currentSlide + m.cloneOffset) * r
                            : (m.currentSlide + m.cloneOffset) * r));
                },
                !1
              ),
              (p._slider = m),
              p.addEventListener(
                "MSGestureChange",
                function (e) {
                  e.stopPropagation();
                  var t,
                    a,
                    n = e.target._slider;
                  n &&
                    ((t = -e.translationX),
                    (a = -e.translationY),
                    (v += g ? a : t),
                    (o = (n.vars.rtl ? -1 : 1) * v),
                    (u = g
                      ? Math.abs(v) < Math.abs(-t)
                      : Math.abs(v) < Math.abs(-a)),
                    e.detail !== e.MSGESTURE_FLAG_INERTIA
                      ? (!u || 500 < Number(new Date()) - l) &&
                        (e.preventDefault(),
                        !x &&
                          n.transitions &&
                          (n.vars.animationLoop ||
                            (o =
                              v /
                              ((0 === n.currentSlide && v < 0) ||
                              (n.currentSlide === n.last && 0 < v)
                                ? Math.abs(v) / r + 2
                                : 1)),
                          n.setProps(s + o, "setTouch")))
                      : setImmediate(function () {
                          p._gesture.stop();
                        }));
                },
                !1
              ),
              p.addEventListener(
                "MSGestureEnd",
                function (e) {
                  e.stopPropagation();
                  var t,
                    a = e.target._slider;
                  a &&
                    (a.animatingTo !== a.currentSlide ||
                      u ||
                      null === o ||
                      ((e =
                        0 < (t = h ? -o : o)
                          ? a.getTarget("next")
                          : a.getTarget("prev")),
                      a.canAdvance(e) &&
                      ((Number(new Date()) - l < 550 && 50 < Math.abs(t)) ||
                        Math.abs(t) > r / 2)
                        ? a.flexAnimate(e, a.vars.pauseOnAction)
                        : x ||
                          a.flexAnimate(
                            a.currentSlide,
                            a.vars.pauseOnAction,
                            !0
                          )),
                    (s = o = i = n = null),
                    (v = 0));
                },
                !1
              ))
            : ((e = function (e) {
                m.animating
                  ? e.preventDefault()
                  : (!window.navigator.msPointerEnabled &&
                      1 !== e.touches.length) ||
                    (m.pause(),
                    (r = g ? m.h : m.w),
                    (l = Number(new Date())),
                    (t = e.touches[0].pageX),
                    (a = e.touches[0].pageY),
                    (s =
                      S && h && m.animatingTo === m.last
                        ? 0
                        : S && h
                        ? m.limit -
                          (m.itemW + m.vars.itemMargin) * m.move * m.animatingTo
                        : S && m.currentSlide === m.last
                        ? m.limit
                        : S
                        ? (m.itemW + m.vars.itemMargin) *
                          m.move *
                          m.currentSlide
                        : h
                        ? (m.last - m.currentSlide + m.cloneOffset) * r
                        : (m.currentSlide + m.cloneOffset) * r),
                    (n = g ? a : t),
                    (i = g ? t : a),
                    p.addEventListener("touchmove", c, !1),
                    p.addEventListener("touchend", d, !1));
              }),
              (c = function (e) {
                (t = e.touches[0].pageX),
                  (a = e.touches[0].pageY),
                  (o = g ? n - a : (m.vars.rtl ? -1 : 1) * (n - t));
                (!(u = g
                  ? Math.abs(o) < Math.abs(t - i)
                  : Math.abs(o) < Math.abs(a - i)) ||
                  500 < Number(new Date()) - l) &&
                  (e.preventDefault(),
                  !x &&
                    m.transitions &&
                    (m.vars.animationLoop ||
                      (o /=
                        (0 === m.currentSlide && o < 0) ||
                        (m.currentSlide === m.last && 0 < o)
                          ? Math.abs(o) / r + 2
                          : 1),
                    m.setProps(s + o, "setTouch")));
              }),
              (d = function (e) {
                var t, a;
                p.removeEventListener("touchmove", c, !1),
                  m.animatingTo !== m.currentSlide ||
                    u ||
                    null === o ||
                    ((a =
                      0 < (t = h ? -o : o)
                        ? m.getTarget("next")
                        : m.getTarget("prev")),
                    m.canAdvance(a) &&
                    ((Number(new Date()) - l < 550 && 50 < Math.abs(t)) ||
                      Math.abs(t) > r / 2)
                      ? m.flexAnimate(a, m.vars.pauseOnAction)
                      : x ||
                        m.flexAnimate(
                          m.currentSlide,
                          m.vars.pauseOnAction,
                          !0
                        )),
                  p.removeEventListener("touchend", d, !1),
                  (s = o = i = n = null);
              }),
              p.addEventListener("touchstart", e, !1));
        },
        resize: function () {
          !m.animating &&
            m.is(":visible") &&
            (S || m.doMath(),
            x
              ? u.smoothHeight()
              : S
              ? (m.slides.width(m.computedW),
                m.update(m.pagingCount),
                m.setProps())
              : g
              ? (m.viewport.height(m.h), m.setProps(m.h, "setTotal"))
              : (m.vars.smoothHeight && u.smoothHeight(),
                m.newSlides.width(m.computedW),
                m.setProps(m.computedW, "setTotal")));
        },
        smoothHeight: function (e) {
          var t;
          (g && !x) ||
            ((t = x ? m : m.viewport),
            e
              ? t.animate(
                  { height: m.slides.eq(m.animatingTo).innerHeight() },
                  e
                )
              : t.innerHeight(m.slides.eq(m.animatingTo).innerHeight()));
        },
        sync: function (e) {
          var t = v(m.vars.sync).data("flexslider"),
            a = m.animatingTo;
          switch (e) {
            case "animate":
              t.flexAnimate(a, m.vars.pauseOnAction, !1, !0);
              break;
            case "play":
              t.playing || t.asNav || t.play();
              break;
            case "pause":
              t.pause();
          }
        },
        uniqueID: function (e) {
          return (
            e
              .filter("[id]")
              .add(e.find("[id]"))
              .each(function () {
                var e = v(this);
                e.attr("id", e.attr("id") + "_clone");
              }),
            e
          );
        },
        pauseInvisible: {
          visProp: null,
          init: function () {
            var e = u.pauseInvisible.getHiddenProp();
            e &&
              ((e = e.replace(/[H|h]idden/, "") + "visibilitychange"),
              document.addEventListener(e, function () {
                u.pauseInvisible.isHidden()
                  ? m.startTimeout
                    ? clearTimeout(m.startTimeout)
                    : m.pause()
                  : !m.started && 0 < m.vars.initDelay
                  ? setTimeout(m.play, m.vars.initDelay)
                  : m.play();
              }));
          },
          isHidden: function () {
            var e = u.pauseInvisible.getHiddenProp();
            return !!e && document[e];
          },
          getHiddenProp: function () {
            var e = ["webkit", "moz", "ms", "o"];
            if ("hidden" in document) return "hidden";
            for (var t = 0; t < e.length; t++)
              if (e[t] + "Hidden" in document) return e[t] + "Hidden";
            return null;
          },
        },
        setToClearWatchedEvent: function () {
          clearTimeout(t),
            (t = setTimeout(function () {
              c = "";
            }, 3e3));
        },
      }),
      (m.flexAnimate = function (e, t, a, n, i) {
        if (
          (m.vars.animationLoop ||
            e === m.currentSlide ||
            (m.direction = e > m.currentSlide ? "next" : "prev"),
          d &&
            1 === m.pagingCount &&
            (m.direction = m.currentItem < e ? "next" : "prev"),
          !m.animating && (m.canAdvance(e, i) || a) && m.is(":visible"))
        ) {
          if (d && n) {
            n = v(m.vars.asNavFor).data("flexslider");
            if (
              ((m.atEnd = 0 === e || e === m.count - 1),
              n.flexAnimate(e, !0, !1, !0, i),
              (m.direction = m.currentItem < e ? "next" : "prev"),
              (n.direction = m.direction),
              Math.ceil((e + 1) / m.visible) - 1 === m.currentSlide || 0 === e)
            )
              return (
                (m.currentItem = e),
                m.slides
                  .removeClass(r + "active-slide")
                  .eq(e)
                  .addClass(r + "active-slide"),
                !1
              );
            (m.currentItem = e),
              m.slides
                .removeClass(r + "active-slide")
                .eq(e)
                .addClass(r + "active-slide"),
              (e = Math.floor(e / m.visible));
          }
          var s;
          (m.animating = !0),
            (m.animatingTo = e),
            t && m.pause(),
            m.vars.before(m),
            m.syncExists && !i && u.sync("animate"),
            m.vars.controlNav && u.controlNav.active(),
            S ||
              m.slides
                .removeClass(r + "active-slide")
                .eq(e)
                .addClass(r + "active-slide"),
            (m.atEnd = 0 === e || e === m.last),
            m.vars.directionNav && u.directionNav.update(),
            e === m.last && (m.vars.end(m), m.vars.animationLoop || m.pause()),
            x
              ? o
                ? (m.slides.eq(m.currentSlide).css({ opacity: 0, zIndex: 1 }),
                  m.slides.eq(e).css({ opacity: 1, zIndex: 2 }),
                  m.wrapup(s))
                : (m.slides
                    .eq(m.currentSlide)
                    .css({ zIndex: 1 })
                    .animate(
                      { opacity: 0 },
                      m.vars.animationSpeed,
                      m.vars.easing
                    ),
                  m.slides
                    .eq(e)
                    .css({ zIndex: 2 })
                    .animate(
                      { opacity: 1 },
                      m.vars.animationSpeed,
                      m.vars.easing,
                      m.wrapup
                    ))
              : ((s = g ? m.slides.filter(":first").height() : m.computedW),
                (e = S
                  ? ((i = m.vars.itemMargin),
                    (i = (m.itemW + i) * m.move * m.animatingTo) > m.limit &&
                    1 !== m.visible
                      ? m.limit
                      : i)
                  : 0 === m.currentSlide &&
                    e === m.count - 1 &&
                    m.vars.animationLoop &&
                    "next" !== m.direction
                  ? h
                    ? (m.count + m.cloneOffset) * s
                    : 0
                  : m.currentSlide === m.last &&
                    0 === e &&
                    m.vars.animationLoop &&
                    "prev" !== m.direction
                  ? h
                    ? 0
                    : (m.count + 1) * s
                  : h
                  ? (m.count - 1 - e + m.cloneOffset) * s
                  : (e + m.cloneOffset) * s),
                m.setProps(e, "", m.vars.animationSpeed),
                m.transitions
                  ? ((m.vars.animationLoop && m.atEnd) ||
                      ((m.animating = !1), (m.currentSlide = m.animatingTo)),
                    m.container.off("webkitTransitionEnd transitionend"),
                    m.container.on(
                      "webkitTransitionEnd transitionend",
                      function () {
                        clearTimeout(m.ensureAnimationEnd), m.wrapup(s);
                      }
                    ),
                    clearTimeout(m.ensureAnimationEnd),
                    (m.ensureAnimationEnd = setTimeout(function () {
                      m.wrapup(s);
                    }, m.vars.animationSpeed + 100)))
                  : m.container.animate(
                      m.args,
                      m.vars.animationSpeed,
                      m.vars.easing,
                      function () {
                        m.wrapup(s);
                      }
                    )),
            m.vars.smoothHeight && u.smoothHeight(m.vars.animationSpeed);
        }
      }),
      (m.wrapup = function (e) {
        x ||
          S ||
          (0 === m.currentSlide &&
          m.animatingTo === m.last &&
          m.vars.animationLoop
            ? m.setProps(e, "jumpEnd")
            : m.currentSlide === m.last &&
              0 === m.animatingTo &&
              m.vars.animationLoop &&
              m.setProps(e, "jumpStart")),
          (m.animating = !1),
          (m.currentSlide = m.animatingTo),
          m.vars.after(m);
      }),
      (m.animateSlides = function () {
        !m.animating && a && m.flexAnimate(m.getTarget("next"));
      }),
      (m.pause = function () {
        clearInterval(m.animatedSlides),
          (m.animatedSlides = null),
          (m.playing = !1),
          m.vars.pausePlay && u.pausePlay.update("play"),
          m.syncExists && u.sync("pause");
      }),
      (m.play = function () {
        m.playing && clearInterval(m.animatedSlides),
          (m.animatedSlides =
            m.animatedSlides ||
            setInterval(m.animateSlides, m.vars.slideshowSpeed)),
          (m.started = m.playing = !0),
          m.vars.pausePlay && u.pausePlay.update("pause"),
          m.syncExists && u.sync("play");
      }),
      (m.stop = function () {
        m.pause(), (m.stopped = !0);
      }),
      (m.canAdvance = function (e, t) {
        var a = d ? m.pagingCount - 1 : m.last;
        return (
          !!t ||
          (d &&
            m.currentItem === m.count - 1 &&
            0 === e &&
            "prev" === m.direction) ||
          ((!d ||
            0 !== m.currentItem ||
            e !== m.pagingCount - 1 ||
            "next" === m.direction) &&
            (e !== m.currentSlide || d) &&
            (!!m.vars.animationLoop ||
              ((!m.atEnd ||
                0 !== m.currentSlide ||
                e !== a ||
                "next" === m.direction) &&
                (!m.atEnd ||
                  m.currentSlide !== a ||
                  0 !== e ||
                  "next" !== m.direction))))
        );
      }),
      (m.getTarget = function (e) {
        return "next" === (m.direction = e)
          ? m.currentSlide === m.last
            ? 0
            : m.currentSlide + 1
          : 0 === m.currentSlide
          ? m.last
          : m.currentSlide - 1;
      }),
      (m.setProps = function (e, t, a) {
        var n,
          i =
            ((n = e || (m.itemW + m.vars.itemMargin) * m.move * m.animatingTo),
            (function () {
              if (S)
                return "setTouch" === t
                  ? e
                  : h && m.animatingTo === m.last
                  ? 0
                  : h
                  ? m.limit -
                    (m.itemW + m.vars.itemMargin) * m.move * m.animatingTo
                  : m.animatingTo === m.last
                  ? m.limit
                  : n;
              switch (t) {
                case "setTotal":
                  return h
                    ? (m.count - 1 - m.currentSlide + m.cloneOffset) * e
                    : (m.currentSlide + m.cloneOffset) * e;
                case "setTouch":
                  return e;
                case "jumpEnd":
                  return h ? e : m.count * e;
                case "jumpStart":
                  return h ? m.count * e : e;
                default:
                  return e;
              }
            })() *
              (m.vars.rtl ? 1 : -1) +
              "px");
        m.transitions &&
          ((i = g
            ? "translate3d(0," + i + ",0)"
            : "translate3d(" + parseInt(i) + "px,0,0)"),
          (a = a !== undefined ? a / 1e3 + "s" : "0s"),
          m.container.css("-" + m.pfx + "-transition-duration", a),
          m.container.css("transition-duration", a)),
          (m.args[m.prop] = i),
          (!m.transitions && a !== undefined) || m.container.css(m.args),
          m.container.css("transform", i);
      }),
      (m.setup = function (e) {
        var t, a;
        x
          ? (m.vars.rtl
              ? m.slides.css({
                  width: "100%",
                  float: "right",
                  marginLeft: "-100%",
                  position: "relative",
                })
              : m.slides.css({
                  width: "100%",
                  float: "left",
                  marginRight: "-100%",
                  position: "relative",
                }),
            "init" === e &&
              (o
                ? m.slides
                    .css({
                      opacity: 0,
                      display: "block",
                      webkitTransition:
                        "opacity " + m.vars.animationSpeed / 1e3 + "s ease",
                      zIndex: 1,
                    })
                    .eq(m.currentSlide)
                    .css({ opacity: 1, zIndex: 2 })
                : 0 == m.vars.fadeFirstSlide
                ? m.slides
                    .css({ opacity: 0, display: "block", zIndex: 1 })
                    .eq(m.currentSlide)
                    .css({ zIndex: 2 })
                    .css({ opacity: 1 })
                : m.slides
                    .css({ opacity: 0, display: "block", zIndex: 1 })
                    .eq(m.currentSlide)
                    .css({ zIndex: 2 })
                    .animate(
                      { opacity: 1 },
                      m.vars.animationSpeed,
                      m.vars.easing
                    )),
            m.vars.smoothHeight && u.smoothHeight())
          : ("init" === e &&
              ((m.viewport = v('<div class="' + r + 'viewport"></div>')
                .css({ overflow: "hidden", position: "relative" })
                .appendTo(m)
                .append(m.container)),
              (m.cloneCount = 0),
              (m.cloneOffset = 0),
              h &&
                ((a = v.makeArray(m.slides).reverse()),
                (m.slides = v(a)),
                m.container.empty().append(m.slides))),
            m.vars.animationLoop &&
              !S &&
              ((m.cloneCount = 2),
              (m.cloneOffset = 1),
              "init" !== e && m.container.find(".clone").remove(),
              m.container
                .append(
                  u
                    .uniqueID(m.slides.first().clone().addClass("clone"))
                    .attr("aria-hidden", "true")
                )
                .prepend(
                  u
                    .uniqueID(m.slides.last().clone().addClass("clone"))
                    .attr("aria-hidden", "true")
                )),
            (m.newSlides = v(m.vars.selector, m)),
            (t = h
              ? m.count - 1 - m.currentSlide + m.cloneOffset
              : m.currentSlide + m.cloneOffset),
            g && !S
              ? (m.container
                  .height(200 * (m.count + m.cloneCount) + "%")
                  .css("position", "absolute")
                  .width("100%"),
                setTimeout(
                  function () {
                    m.newSlides.css({ display: "block" }),
                      m.doMath(),
                      m.viewport.height(m.h),
                      m.setProps(t * m.h, "init");
                  },
                  "init" === e ? 100 : 0
                ))
              : (m.container.width(200 * (m.count + m.cloneCount) + "%"),
                m.setProps(t * m.computedW, "init"),
                setTimeout(
                  function () {
                    m.doMath(),
                      m.vars.rtl
                        ? m.newSlides.css({
                            width: m.computedW,
                            marginRight: m.computedM,
                            float: "right",
                            display: "block",
                          })
                        : m.newSlides.css({
                            width: m.computedW,
                            marginRight: m.computedM,
                            float: "left",
                            display: "block",
                          }),
                      m.vars.smoothHeight && u.smoothHeight();
                  },
                  "init" === e ? 100 : 0
                ))),
          S ||
            m.slides
              .removeClass(r + "active-slide")
              .eq(m.currentSlide)
              .addClass(r + "active-slide"),
          m.vars.init(m);
      }),
      (m.doMath = function () {
        var e = m.slides.first(),
          t = m.vars.itemMargin,
          a = m.vars.minItems,
          n = m.vars.maxItems;
        (m.w = (m.viewport === undefined ? m : m.viewport).width()),
          m.isFirefox && (m.w = m.width()),
          (m.h = e.height()),
          (m.boxPadding = e.outerWidth() - e.width()),
          S
            ? ((m.itemT = m.vars.itemWidth + t),
              (m.itemM = t),
              (m.minW = a ? a * m.itemT : m.w),
              (m.maxW = n ? n * m.itemT - t : m.w),
              (m.itemW =
                m.minW > m.w
                  ? (m.w - t * (a - 1)) / a
                  : m.maxW < m.w
                  ? (m.w - t * (n - 1)) / n
                  : m.vars.itemWidth > m.w
                  ? m.w
                  : m.vars.itemWidth),
              (m.visible = Math.floor(m.w / m.itemW)),
              (m.move =
                0 < m.vars.move && m.vars.move < m.visible
                  ? m.vars.move
                  : m.visible),
              (m.pagingCount = Math.ceil((m.count - m.visible) / m.move + 1)),
              (m.last = m.pagingCount - 1),
              (m.limit =
                1 === m.pagingCount
                  ? 0
                  : m.vars.itemWidth > m.w
                  ? m.itemW * (m.count - 1) + t * (m.count - 1)
                  : (m.itemW + t) * m.count - m.w - t))
            : ((m.itemW = m.w),
              (m.itemM = t),
              (m.pagingCount = m.count),
              (m.last = m.count - 1)),
          (m.computedW = m.itemW - m.boxPadding),
          (m.computedM = m.itemM);
      }),
      (m.update = function (e, t) {
        m.doMath(),
          S ||
            (e < m.currentSlide
              ? (m.currentSlide += 1)
              : e <= m.currentSlide && 0 !== e && --m.currentSlide,
            (m.animatingTo = m.currentSlide)),
          m.vars.controlNav &&
            !m.manualControls &&
            (("add" === t && !S) || m.pagingCount > m.controlNav.length
              ? u.controlNav.update("add")
              : (("remove" === t && !S) ||
                  m.pagingCount < m.controlNav.length) &&
                (S &&
                  m.currentSlide > m.last &&
                  (--m.currentSlide, --m.animatingTo),
                u.controlNav.update("remove", m.last))),
          m.vars.directionNav && u.directionNav.update();
      }),
      (m.addSlide = function (e, t) {
        e = v(e);
        (m.count += 1),
          (m.last = m.count - 1),
          g && h
            ? t !== undefined
              ? m.slides.eq(m.count - t).after(e)
              : m.container.prepend(e)
            : t !== undefined
            ? m.slides.eq(t).before(e)
            : m.container.append(e),
          m.update(t, "add"),
          (m.slides = v(m.vars.selector + ":not(.clone)", m)),
          m.setup(),
          m.vars.added(m);
      }),
      (m.removeSlide = function (e) {
        var t = isNaN(e) ? m.slides.index(v(e)) : e;
        --m.count,
          (m.last = m.count - 1),
          (isNaN(e)
            ? v(e, m.slides)
            : g && h
            ? m.slides.eq(m.last)
            : m.slides.eq(e)
          ).remove(),
          m.doMath(),
          m.update(t, "remove"),
          (m.slides = v(m.vars.selector + ":not(.clone)", m)),
          m.setup(),
          m.vars.removed(m);
      }),
      u.init();
  }),
    v(window)
      .on("blur", function (e) {
        a = !1;
      })
      .on("focus", function (e) {
        a = !0;
      }),
    (v.flexslider.defaults = {
      namespace: "flex-",
      selector: ".slides > li",
      animation: "fade",
      easing: "swing",
      direction: "horizontal",
      reverse: !1,
      animationLoop: !0,
      smoothHeight: !1,
      startAt: 0,
      slideshow: !0,
      slideshowSpeed: 7e3,
      animationSpeed: 600,
      initDelay: 0,
      randomize: !1,
      fadeFirstSlide: !0,
      thumbCaptions: !1,
      pauseOnAction: !0,
      pauseOnHover: !1,
      pauseInvisible: !0,
      useCSS: !0,
      touch: !0,
      video: !1,
      controlNav: !0,
      directionNav: !0,
      prevText: "Previous",
      nextText: "Next",
      keyboard: !0,
      multipleKeyboard: !1,
      mousewheel: !1,
      pausePlay: !1,
      pauseText: "Pause",
      playText: "Play",
      controlsContainer: "",
      manualControls: "",
      customDirectionNav: "",
      sync: "",
      asNavFor: "",
      itemWidth: 0,
      itemMargin: 0,
      minItems: 1,
      maxItems: 0,
      move: 0,
      allowOneSlide: !0,
      isFirefox: !1,
      start: function () {},
      before: function () {},
      after: function () {},
      end: function () {},
      added: function () {},
      removed: function () {},
      init: function () {},
      rtl: !1,
    }),
    (v.fn.flexslider = function (a) {
      if ("object" == typeof (a = a === undefined ? {} : a))
        return this.each(function () {
          var e = v(this),
            t = a.selector || ".slides > li",
            t = e.find(t);
          (1 === t.length && !1 === a.allowOneSlide) || 0 === t.length
            ? (t.fadeIn(400), a.start && a.start(e))
            : e.data("flexslider") === undefined && new v.flexslider(this, a);
        });
      var e = v(this).data("flexslider");
      switch (a) {
        case "play":
          e.play();
          break;
        case "pause":
          e.pause();
          break;
        case "stop":
          e.stop();
          break;
        case "next":
          e.flexAnimate(e.getTarget("next"), !0);
          break;
        case "prev":
        case "previous":
          e.flexAnimate(e.getTarget("prev"), !0);
          break;
        default:
          "number" == typeof a && e.flexAnimate(a, !0);
      }
    });
})(jQuery);