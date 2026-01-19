/**
 * @fileoverview App configuration - edit colors, icons, settings here
 */

/** @type {Record<string, import('./types.js').GroupConfig>} */
export const INSTITUTIONS = {
    'Westminster Council': { icon: 'WC', color: '#238636', className: 'inst-westminster' },
    'Liverpool Council':   { icon: 'LC', color: '#da3633', className: 'inst-liverpool' },
    'NHS / Health':        { icon: 'NHS', color: '#1f6feb', className: 'inst-nhs' },
    'Courts / Legal':      { icon: 'LAW', color: '#8957e5', className: 'inst-courts' },
    'Police':              { icon: 'POL', color: '#0969da', className: 'inst-police' },
    'NHG Housing':         { icon: 'NHG', color: '#bf8700', className: 'inst-housing' },
    'Media':               { icon: 'MED', color: '#f85149', className: 'inst-media' },
    'Social Care':         { icon: 'SOC', color: '#a371f7', className: 'inst-social' },
    'Self / Internal':     { icon: 'INT', color: '#3fb950', className: 'inst-self' },
    'Government':          { icon: 'GOV', color: '#bc8cff', className: 'inst-gov' },
    'Other':               { icon: 'OTH', color: '#6e7681', className: 'inst-other' },
    'Accommodation':       { icon: 'ACC', color: '#6e7681', className: 'inst-other' }
};

/** Chart colors array (matches institution order) */
export const CHART_COLORS = Object.values(INSTITUTIONS).map(i => i.color);

/** Engagement thresholds */
export const ENGAGEMENT = {
    HIGH: 100,    // opens >= 100
    MEDIUM: 20,   // opens >= 20
};

/** Debounce delay for search (ms) */
export const SEARCH_DELAY = 150;

/** Max items per category in lists */
export const MAX_DISPLAY_ITEMS = 200;
