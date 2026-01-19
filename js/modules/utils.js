/**
 * @fileoverview Utility functions - DOM helpers, formatting
 */

/** @param {string} sel @returns {Element|null} */
export const $ = (sel) => document.querySelector(sel);

/** @param {string} sel @returns {NodeListOf<Element>} */
export const $$ = (sel) => document.querySelectorAll(sel);

/** @param {number} n @returns {string} */
export const fmt = (n) => n.toLocaleString();

/**
 * Debounce function execution
 * @param {Function} fn
 * @param {number} ms
 */
export const debounce = (fn, ms) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
};

/**
 * Create element with attributes
 * @param {string} tag
 * @param {Object} attrs
 * @param {string} html
 */
export const el = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') e.className = v;
        else if (k === 'data') Object.assign(e.dataset, v);
        else e.setAttribute(k, v);
    });
    if (html) e.innerHTML = html;
    return e;
};

/**
 * Safely get nested property
 * @param {Object} obj
 * @param {string} path
 * @param {*} fallback
 */
export const get = (obj, path, fallback = '') => {
    return path.split('.').reduce((o, k) => o?.[k], obj) ?? fallback;
};
