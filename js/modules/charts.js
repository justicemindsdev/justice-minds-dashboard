/**
 * @fileoverview Chart initialization - Chart.js setup
 */

import { CHART_COLORS } from '../config.js';

const CHART_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } }
};

const AXIS_STYLE = {
    grid: { color: '#21262d' },
    ticks: { color: '#8b949e', font: { size: 11 } }
};

/**
 * Initialize horizontal bar chart
 * @param {string} id - Canvas element ID
 * @param {string[]} labels
 * @param {number[]} data
 */
export function initBarChart(id, labels, data) {
    const ctx = document.getElementById(id);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: CHART_COLORS.slice(0, labels.length),
                borderRadius: 4,
                barThickness: 18
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            indexAxis: 'y',
            scales: {
                x: AXIS_STYLE,
                y: { ...AXIS_STYLE, grid: { display: false } }
            }
        }
    });
}

/**
 * Initialize doughnut chart
 * @param {string} id - Canvas element ID
 * @param {string[]} labels
 * @param {number[]} data
 */
export function initDoughnutChart(id, labels, data) {
    const ctx = document.getElementById(id);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: CHART_COLORS.slice(0, labels.length),
                borderWidth: 0
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            cutout: '65%',
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: { color: '#8b949e', padding: 8, boxWidth: 12, font: { size: 11 } }
                }
            }
        }
    });
}
