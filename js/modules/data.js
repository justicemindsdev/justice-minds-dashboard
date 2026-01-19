/**
 * @fileoverview Data management - stats calculation, search, filtering
 */

/**
 * Calculate dashboard statistics
 * @param {string[]} groups
 * @param {Object} data
 * @returns {import('../types.js').DashboardStats}
 */
export function calcStats(groups, data) {
    let totalEmails = 0, totalOpens = 0, totalClicks = 0, maxOpens = 0;

    groups.forEach(g => {
        (data[g] || []).forEach(e => {
            totalEmails++;
            totalOpens += e.opens || 0;
            totalClicks += e.clicks || 0;
            if (e.opens > maxOpens) maxOpens = e.opens;
        });
    });

    return { totalEmails, totalOpens, totalClicks, maxOpens, groupCount: groups.length };
}

/**
 * Search emails across all groups
 * @param {string[]} groups
 * @param {Object} data
 * @param {string} query
 * @returns {Object} Filtered data by group
 */
export function searchEmails(groups, data, query) {
    if (!query) return null; // null = show all
    const q = query.toLowerCase();
    const results = {};

    groups.forEach(g => {
        const filtered = (data[g] || []).filter(e =>
            e.subject?.toLowerCase().includes(q) ||
            e.recipient?.toLowerCase().includes(q) ||
            e.email?.toLowerCase().includes(q)
        );
        if (filtered.length) results[g] = filtered;
    });

    return results;
}

/**
 * Get group totals for charts
 * @param {string[]} groups
 * @param {Object} totals
 * @returns {number[]}
 */
export function getGroupTotals(groups, totals) {
    return groups.map(g => totals[g] || 0);
}

/**
 * Get email counts per group
 * @param {string[]} groups
 * @param {Object} data
 * @returns {number[]}
 */
export function getGroupCounts(groups, data) {
    return groups.map(g => (data[g] || []).length);
}
