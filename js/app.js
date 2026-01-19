/**
 * Justice Minds Dashboard - Single bundle (no ES modules for file:// compatibility)
 */

(function() {
    'use strict';

    // === CONFIG ===
    const CONFIG = {
        SEARCH_DELAY: 150,
        ENGAGEMENT: { HIGH: 100, MEDIUM: 20 },
        INSTITUTIONS: {
            'Westminster Council': { icon: 'WC', color: '#238636', cls: 'inst-westminster' },
            'Liverpool Council':   { icon: 'LC', color: '#da3633', cls: 'inst-liverpool' },
            'NHS / Health':        { icon: 'NHS', color: '#1f6feb', cls: 'inst-nhs' },
            'Courts / Legal':      { icon: 'LAW', color: '#8957e5', cls: 'inst-courts' },
            'Police':              { icon: 'POL', color: '#0969da', cls: 'inst-police' },
            'NHG Housing':         { icon: 'NHG', color: '#bf8700', cls: 'inst-housing' },
            'Media':               { icon: 'MED', color: '#f85149', cls: 'inst-media' },
            'Social Care':         { icon: 'SOC', color: '#a371f7', cls: 'inst-social' },
            'Self / Internal':     { icon: 'INT', color: '#3fb950', cls: 'inst-self' },
            'Government':          { icon: 'GOV', color: '#bc8cff', cls: 'inst-gov' },
            'Other':               { icon: 'OTH', color: '#6e7681', cls: 'inst-other' }
        }
    };

    const COLORS = Object.values(CONFIG.INSTITUTIONS).map(i => i.color);

    // === UTILS ===
    const $ = sel => document.querySelector(sel);
    const $$ = sel => document.querySelectorAll(sel);
    const fmt = n => (n || 0).toLocaleString();

    function debounce(fn, ms) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }

    // === DATA ===
    function calcStats(groups, data) {
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

    function searchEmails(groups, data, q) {
        if (!q) return null;
        q = q.toLowerCase();
        const results = {};
        groups.forEach(g => {
            const filtered = (data[g] || []).filter(e =>
                (e.subject || '').toLowerCase().includes(q) ||
                (e.recipient || '').toLowerCase().includes(q) ||
                (e.email || '').toLowerCase().includes(q)
            );
            if (filtered.length) results[g] = filtered;
        });
        return results;
    }

    // === RENDER ===
    function groupHeader(group, count, opens, idx) {
        const cfg = CONFIG.INSTITUTIONS[group] || CONFIG.INSTITUTIONS['Other'];
        return `
            <div class="group__header" data-idx="${idx}">
                <svg class="group__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
                <div class="group__icon ${cfg.cls}">${cfg.icon}</div>
                <div class="group__info">
                    <div class="group__name">${group}</div>
                    <div class="group__stats">${count} emails · ${fmt(opens)} opens</div>
                </div>
            </div>`;
    }

    function emailItem(e, group, idx) {
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

    function groupFull(group, emails, opens, idx) {
        return `
            <div class="group">
                ${groupHeader(group, emails.length, opens, idx)}
                <div class="group__content" data-content="${idx}">
                    ${emails.map((e, i) => emailItem(e, group, i)).join('')}
                </div>
            </div>`;
    }

    function getBadge(opens) {
        if (opens >= CONFIG.ENGAGEMENT.HIGH) return { text: 'High', cls: 'badge--high' };
        if (opens >= CONFIG.ENGAGEMENT.MEDIUM) return { text: 'Medium', cls: 'badge--medium' };
        return { text: 'Low', cls: 'badge--low' };
    }

    // === CHARTS ===
    function initCharts(groups, totals, data) {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        const axisStyle = { grid: { color: '#21262d' }, ticks: { color: '#8b949e', font: { size: 11 } } };

        // Bar chart
        const barCtx = document.getElementById('chartOpens');
        if (barCtx) {
            new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: groups,
                    datasets: [{ data: groups.map(g => totals[g] || 0), backgroundColor: COLORS, borderRadius: 4 }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: axisStyle, y: { ...axisStyle, grid: { display: false } } }
                }
            });
        }

        // Doughnut chart
        const doughnutCtx = document.getElementById('chartCount');
        if (doughnutCtx) {
            new Chart(doughnutCtx, {
                type: 'doughnut',
                data: {
                    labels: groups,
                    datasets: [{ data: groups.map(g => (data[g] || []).length), backgroundColor: COLORS, borderWidth: 0 }]
                },
                options: {
                    responsive: true,
                    cutout: '65%',
                    plugins: { legend: { display: true, position: 'right', labels: { color: '#8b949e', padding: 8, boxWidth: 12 } } }
                }
            });
        }
    }

    // === APP ===
    class App {
        constructor() {
            this.groups = window.emailGroups || [];
            this.data = window.emailData || {};
            this.totals = window.groupTotals || {};
            this.certs = window.certificateData || [];
            this.stats = calcStats(this.groups, this.data);
            this.init();
        }

        init() {
            this.renderStats();
            this.renderGroups();
            initCharts(this.groups, this.totals, this.data);
            this.bindEvents();
            if (this.groups.length) this.toggleGroup(0);
        }

        renderStats() {
            $('#totalEmails').textContent = fmt(this.stats.totalEmails);
            $('#totalOpens').textContent = fmt(this.stats.totalOpens);
            $('#totalClicks').textContent = fmt(this.stats.totalClicks);
            $('#totalGroups').textContent = this.stats.groupCount;
        }

        renderGroups(filtered = null) {
            const list = $('#groupList');
            const groups = filtered ? Object.keys(filtered) : this.groups;

            list.innerHTML = groups.map((g, i) => {
                const emails = filtered ? filtered[g] : this.data[g] || [];
                return groupFull(g, emails, this.totals[g] || 0, i);
            }).join('');

            // Bind clicks
            list.querySelectorAll('.email-item').forEach(el => {
                el.onclick = () => this.selectEmail(el.dataset.group, +el.dataset.id);
            });
            list.querySelectorAll('.group__header').forEach(el => {
                el.onclick = () => this.toggleGroup(+el.dataset.idx);
            });

            if (filtered) this.expandAll();
        }

        bindEvents() {
            const search = $('#searchInput');
            if (search) {
                search.oninput = debounce(e => {
                    const q = e.target.value.trim();
                    this.renderGroups(q ? searchEmails(this.groups, this.data, q) : null);
                }, CONFIG.SEARCH_DELAY);
            }
        }

        toggleGroup(idx) {
            const content = $(`[data-content="${idx}"]`);
            const header = $(`[data-idx="${idx}"]`);
            if (content && header) {
                content.classList.toggle('group__content--open');
                header.classList.toggle('group__header--open');
            }
        }

        expandAll() {
            $$('.group__content').forEach(el => el.classList.add('group__content--open'));
            $$('.group__header').forEach(el => el.classList.add('group__header--open'));
        }

        selectEmail(group, id) {
            const email = (this.data[group] || []).find(e => e.id === id);
            if (!email) return;

            $$('.email-item').forEach(el => el.classList.remove('email-item--active'));
            $(`[data-group="${group}"][data-id="${id}"]`)?.classList.add('email-item--active');

            this.renderDetail(email, group);
        }

        renderDetail(e, group) {
            $('#detailPanel').classList.add('detail--active');
            $('#dSubject').textContent = e.subject || '-';
            $('#dOpens').textContent = e.opens;
            $('#dClicks').textContent = e.clicks;
            $('#dPdf').textContent = e.pdfViews || 0;
            $('#dEmail').textContent = e.email || e.recipient || '-';
            $('#dRecipient').textContent = e.recipient || '-';
            $('#dSent').textContent = e.sent || '-';
            $('#dLastOpen').textContent = e.lastOpened || '-';
            $('#dInstitution').textContent = group;
            $('#dSource').textContent = e.source || '-';

            const pct = Math.min(100, Math.round((e.opens / this.stats.maxOpens) * 100));
            $('#dEngagement').textContent = pct + '%';
            $('#engagementBar').style.width = pct + '%';

            const badge = getBadge(e.opens);
            const badgeEl = $('#dBadge');
            badgeEl.textContent = badge.text;
            badgeEl.className = 'badge ' + badge.cls;

            // Render timeline from certificate data if available
            this.renderTimeline(e);
        }

        renderTimeline(email) {
            const timelineList = $('#timelineList');
            const recipientsSection = $('#recipientsSection');
            const recipientsList = $('#recipientsList');
            const certLinkSection = $('#certLinkSection');
            const certLink = $('#certLink');

            // Find matching certificate using multiple signals
            const certs = window.certificateData || [];
            const emailAddr = (email.email || '').toLowerCase();
            const emailSubject = (email.subject || '').toLowerCase();

            const cert = certs.find(c => {
                // Match by recipient email
                const certRecipients = (c.delivered_to || []).map(r => r.email.toLowerCase());
                if (emailAddr && certRecipients.some(r => r.includes(emailAddr) || emailAddr.includes(r))) {
                    // Also check subject has some overlap (at least 20 chars match)
                    const certSubject = (c.subject || '').toLowerCase();
                    if (emailSubject && certSubject) {
                        const words = emailSubject.split(/\s+/).filter(w => w.length > 4);
                        if (words.some(w => certSubject.includes(w))) return true;
                    }
                }
                // Match by subject similarity
                if (emailSubject && c.subject) {
                    const certSubject = c.subject.toLowerCase();
                    // Check if significant portion matches
                    const subjectWords = emailSubject.split(/\s+/).filter(w => w.length > 5);
                    const matchCount = subjectWords.filter(w => certSubject.includes(w)).length;
                    if (matchCount >= 3) return true;
                    // Direct substring match
                    if (certSubject.includes(emailSubject.substring(0, 40))) return true;
                    if (emailSubject.includes(certSubject.substring(0, 40))) return true;
                }
                return false;
            });

            // Show certificate PDF link if available
            if (cert && cert.pdf_url) {
                certLinkSection.style.display = 'block';
                certLink.href = cert.pdf_url;
            } else {
                certLinkSection.style.display = 'none';
            }

            if (cert && cert.timeline && cert.timeline.length > 0) {
                // Render timeline
                timelineList.innerHTML = cert.timeline.map(event => `
                    <div class="timeline__item">
                        <div class="timeline__icon timeline__icon--${event.type === 'opened' ? 'open' : 'click'}">
                            ${event.type === 'opened' ? '&#128065;' : '&#128279;'}
                        </div>
                        <div class="timeline__content">
                            <div class="timeline__action">${event.type === 'opened' ? 'Opened' : 'Link clicked'}</div>
                            <div class="timeline__actor">${event.actor}</div>
                            <div class="timeline__time">${event.date} at ${event.time}</div>
                        </div>
                    </div>
                `).join('');

                // Render recipients if multiple
                if (cert.delivered_to && cert.delivered_to.length > 1) {
                    recipientsSection.style.display = 'block';
                    recipientsList.innerHTML = cert.delivered_to.map(r => {
                        const hasOpened = cert.timeline.some(t =>
                            t.actor.toLowerCase().includes(r.email.toLowerCase()) ||
                            (r.name && t.actor.toLowerCase().includes(r.name.toLowerCase()))
                        );
                        return `<span class="recipient-tag ${hasOpened ? 'recipient-tag--opened' : ''}">${r.name || r.email}</span>`;
                    }).join('');
                } else {
                    recipientsSection.style.display = 'none';
                }
            } else {
                // No certificate data - show placeholder
                timelineList.innerHTML = `
                    <p class="timeline__empty">No detailed timeline available.</p>
                    <p class="timeline__empty" style="margin-top: 8px; font-size: 11px;">
                        Summary: ${email.opens} opens, ${email.clicks} clicks
                        ${email.lastOpened ? '<br>Last: ' + email.lastOpened : ''}
                    </p>
                `;
                recipientsSection.style.display = 'none';
            }
        }
    }

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new App());
    } else {
        new App();
    }
})();
