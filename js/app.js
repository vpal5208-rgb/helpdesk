/* =============================================
   app.js — Main entry point & view routing
============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Init data
  initTickets();

  // Init UI
  initTheme();
  initThemeEvents();
  initSidebarToggle();
  initNotifications();
  initTicketEvents();
  initSettings();
  initEmailConfig();

  // Render initial views
  updateDashboard();
  renderAgentsView();
  initUsersView();

  // Navigation — use delegation so clicks on child spans still work
  document.querySelector('.sidebar-nav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-item[data-view]');
    if (!btn) return;
    e.preventDefault();
    navigateTo(btn.dataset.view);
  });

  // Chart resize observer
  const resizeObserver = new ResizeObserver(() => {
    const activeView = document.querySelector('.view.active')?.id;
    if (activeView === 'view-dashboard') updateDashboard();
    if (activeView === 'view-reports') {
      renderMonthlyChart();
      renderResolutionChart();
      renderAgentPerfChart();
    }
  });
  const mainContent = document.getElementById('main');
  if (mainContent) resizeObserver.observe(mainContent);

  // Auto-refresh KPIs every 30s
  setInterval(() => {
    if (document.querySelector('#view-dashboard.active')) {
      updateKPIs();
    }
  }, 30000);
});

function navigateTo(view) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-view="${view}"]`)?.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.add('active');

  if (view === 'dashboard') updateDashboard();
  if (view === 'tickets') { applyFilters(); }
  if (view === 'agents') renderAgentsView();
  if (view === 'users') refreshUsersView();
  if (view === 'reports') {
    setTimeout(() => {
      renderMonthlyChart();
      renderResolutionChart();
      renderAgentPerfChart();
    }, 50);
  }
}
