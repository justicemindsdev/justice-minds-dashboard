/**
 * @fileoverview Type definitions via JSDoc (IDE intellisense without TypeScript)
 * Edit this file to update data structures across the app
 */

/**
 * @typedef {Object} EmailItem
 * @property {number} id
 * @property {string} email
 * @property {string} recipient
 * @property {string} subject
 * @property {string} sent
 * @property {string} lastOpened
 * @property {string} source
 * @property {number} opens
 * @property {number} clicks
 * @property {number} pdfViews
 */

/**
 * @typedef {'Westminster Council'|'Liverpool Council'|'NHS / Health'|'Courts / Legal'|'Police'|'NHG Housing'|'Media'|'Social Care'|'Self / Internal'|'Government'|'Other'} InstitutionGroup
 */

/**
 * @typedef {Object} GroupConfig
 * @property {string} icon - Short code (e.g., 'WC', 'NHS')
 * @property {string} color - CSS color value
 * @property {string} className - CSS class for styling
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalEmails
 * @property {number} totalOpens
 * @property {number} totalClicks
 * @property {number} maxOpens
 * @property {number} groupCount
 */

/**
 * @typedef {Object} AppState
 * @property {string} searchQuery
 * @property {EmailItem|null} selectedEmail
 * @property {InstitutionGroup|null} selectedGroup
 * @property {Set<number>} expandedGroups
 */

// Export marker for module detection
export const TYPES_VERSION = '2.0';
