/**
 * @fileoverview Render functions - generate HTML for components
 */

import { INSTITUTIONS, ENGAGEMENT } from '../config.js';
import { fmt } from './utils.js';

/**
 * Render group header
 * @param {string} group
 * @param {number} count
 * @param {number} opens
 * @param {number} idx
 */
export function groupHeader(group, count, opens, idx) {
    const cfg = INSTITUTIONS[group] || INSTITUTIONS['Other'];
    return `
        <div class="group__header" data-idx="${idx}">
            <svg class="group__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
            <div class="group__icon ${cfg.className}">${cfg.icon}</div>
            <div class="group__info">
                <div class="group__name">${group}</div>
                <div class="group__stats">${count} emails · ${fmt(opens)} opens</div>
            </div>
        </div>`;
}

/**
 * Render email item
 * @param {import('../types.js').EmailItem} e
 * @param {string} group
 * @param {number} idx
 */
export function emailItem(e, group, idx) {
    const date = (e.sent || '').split(' ')[0];
    return `
        <div class="email-item" data-group="${group}" data-id="${e.id}">
            <span class="email-item__num">${idx + 1}</span>
            <div class="email-item__info">
                <div class="email-item__addr">${e.email || e.recipient || '-'}</div>
                <div class="email-item__subject">${e.subject || '-'}</div>
                <div class="email-item__meta">${date} · ${e.source || ''}</div>
            </div>
            <span class="email-item__opens">${e.opens}</span>
        </div>`;
}

/**
 * Render full group with emails
 * @param {string} group
 * @param {import('../types.js').EmailItem[]} emails
 * @param {number} opens
 * @param {number} idx
 */
export function groupFull(group, emails, opens, idx) {
    return `
        <div class="group">
            ${groupHeader(group, emails.length, opens, idx)}
            <div class="group__content" data-content="${idx}">
                ${emails.map((e, i) => emailItem(e, group, i)).join('')}
            </div>
        </div>`;
}

/**
 * Get badge config based on opens
 * @param {number} opens
 * @returns {{text: string, class: string}}
 */
export function getBadge(opens) {
    if (opens >= ENGAGEMENT.HIGH) return { text: 'High', class: 'badge--high' };
    if (opens >= ENGAGEMENT.MEDIUM) return { text: 'Medium', class: 'badge--medium' };
    return { text: 'Low', class: 'badge--low' };
}
