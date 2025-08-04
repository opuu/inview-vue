import _ from "@opuu/inview";
function u() {
  return typeof window != "undefined" && typeof document != "undefined";
}
function o(i, e) {
  var n, t, s;
  if (!u())
    return null;
  if (!i.__inviewInstance) {
    i.__inviewUniqueClass || (i.__inviewUniqueClass = "inview-" + Math.random().toString(36).substr(2, 9), i.classList.add(i.__inviewUniqueClass));
    const r = {
      selector: `.${i.__inviewUniqueClass}`,
      delay: (n = e.delay) != null ? n : 0,
      precision: (t = e.precision) != null ? t : "medium",
      single: (s = e.single) != null ? s : !0
    };
    i.__inviewInstance = new _(r), i.__inviewListenerCount = 0;
  }
  return i.__inviewInstance;
}
function w(i = {}) {
  return {
    /**
     * Called when the directive is mounted on the element.
     *
     * @param {HTMLElement} el - The element the directive is bound to.
     * @param {DirectiveBinding} binding - The binding object (expects a callback function as value).
     */
    mounted(e, n) {
      const t = n.value;
      if (typeof t != "function") {
        console.warn("[InView]: v-inview expects a function as its value.");
        return;
      }
      if (!u())
        return;
      const s = o(e, i);
      s && (s.on("enter", (r) => {
        t(r);
      }), e.__inviewListenerCount = (e.__inviewListenerCount || 0) + 1);
    },
    /**
     * Called when the directive is unmounted from the element.
     *
     * @param {HTMLElement} el - The element the directive was bound to.
     */
    unmounted(e) {
      const n = e;
      n.__inviewInstance && (n.__inviewListenerCount = (n.__inviewListenerCount || 1) - 1, n.__inviewListenerCount <= 0 && (n.__inviewInstance.destroy(), delete n.__inviewInstance, delete n.__inviewListenerCount));
    },
    /**
     * SSR-specific hook that returns props to be rendered during server-side rendering.
     * This prevents the "getSSRProps" error in Nuxt and other SSR frameworks.
     *
     * @param {DirectiveBinding} _binding - The binding object (unused).
     * @returns {Record<string, any>} Empty object since we don't need to add any attributes during SSR.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSSRProps(e) {
      return {};
    }
  };
}
function a(i = {}) {
  return {
    /**
     * Called when the directive is mounted on the element.
     *
     * @param {HTMLElement} el - The element the directive is bound to.
     * @param {DirectiveBinding} binding - The binding object (expects a callback function as value).
     */
    mounted(e, n) {
      const t = n.value;
      if (typeof t != "function") {
        console.warn("[InView]: v-outview expects a function as its value.");
        return;
      }
      if (!u())
        return;
      const s = o(e, i);
      s && (s.on("exit", (r) => {
        t(r);
      }), e.__inviewListenerCount = (e.__inviewListenerCount || 0) + 1);
    },
    /**
     * Called when the directive is unmounted from the element.
     *
     * @param {HTMLElement} el - The element the directive was bound to.
     */
    unmounted(e) {
      const n = e;
      n.__inviewInstance && (n.__inviewListenerCount = (n.__inviewListenerCount || 1) - 1, n.__inviewListenerCount <= 0 && (n.__inviewInstance.destroy(), delete n.__inviewInstance, delete n.__inviewListenerCount));
    },
    /**
     * SSR-specific hook that returns props to be rendered during server-side rendering.
     * This prevents the "getSSRProps" error in Nuxt and other SSR frameworks.
     *
     * @param {DirectiveBinding} _binding - The binding object (unused).
     * @returns {Record<string, any>} Empty object since we don't need to add any attributes during SSR.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSSRProps(e) {
      return {};
    }
  };
}
export {
  w as createInViewDirective,
  a as createOutViewDirective
};
