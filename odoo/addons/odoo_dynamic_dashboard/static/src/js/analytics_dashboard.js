/** @odoo-module **/
import { Component, xml, useRef, onMounted, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

class AnalyticsDashboard extends Component {
    static template = xml`
        <div class="analytics_dashboard_container p-4">
            <div class="analytics_header">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="mb-0">
                        <i t-att-class="state.dashboard_icon"/>
                        <t t-esc="state.title"/>
                    </h2>
                    <div class="analytics_controls">
                        <button class="btn btn-outline-success me-2" t-on-click="createDemoData">
                            <i class="fa fa-database"/> Create Demo Data
                        </button>

                        <button class="btn btn-outline-primary me-2" t-on-click="refreshDashboard">
                            <i class="fa fa-refresh"/> Refresh
                        </button>
                        <button class="btn btn-primary" t-on-click="openSettings">
                            <i class="fa fa-cog"/> Settings
                        </button>
                    </div>
                </div>
            </div>

            <div class="analytics_content" t-ref="dashboardContent">
                <t t-if="state.loading">
                    <div class="text-center p-5">
                        <i class="fa fa-spinner fa-spin fa-2x"/>
                        <p class="mt-2">Loading dashboard...</p>
                    </div>
                </t>

                <t t-else="">
                    <!-- KPI Widgets Row -->
                    <div class="row mb-4" t-if="state.widgets.length">
                        <t t-foreach="state.widgets" t-as="widget" t-key="widget_index">
                            <div class="col-xl-3 col-md-6 mb-3 widget_card">
                                <div t-att-class="'card border-left-' + widget.color + ' shadow py-2'">
                                    <div class="card-body">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col mr-2">
                                                <div t-att-class="'text-xs font-weight-bold text-' + widget.color + ' text-uppercase mb-1'">
                                                    <t t-esc="widget.title"/>
                                                </div>
                                                <div class="h5 mb-0 font-weight-bold text-gray-800">
                                                    <t t-esc="widget.value"/>
                                                </div>
                                                <div class="text-xs text-muted" t-if="widget.subtitle">
                                                    <t t-esc="widget.subtitle"/>
                                                    <span t-if="widget.trend" t-att-class="'ml-1 ' + (widget.trend.startsWith('+') ? 'text-success' : 'text-danger')">
                                                        <t t-esc="widget.trend"/>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-auto">
                                                <i t-att-class="'fas ' + widget.icon + ' fa-2x text-gray-300'"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </t>
                    </div>

                    <!-- Charts Row -->
                    <div class="row" t-if="state.charts.length">
                        <t t-foreach="state.charts" t-as="chart" t-key="chart_index">
                            <div t-att-class="(chart.size || 'col-xl-6 col-lg-12') + ' mb-4 chart_card'">
                                <div class="card shadow">
                                    <div class="card-header py-3 d-flex justify-content-between align-items-center">
                                        <h6 class="m-0 font-weight-bold text-primary">
                                            <t t-esc="chart.title"/>
                                        </h6>
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                <i class="fa fa-ellipsis-v"/>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#" t-on-click="() => this.exportChart(chart_index)">
                                                    <i class="fa fa-download"/> Export
                                                </a></li>
                                                <li><a class="dropdown-item" href="#" t-on-click="() => this.fullscreenChart(chart_index)">
                                                    <i class="fa fa-expand"/> Fullscreen
                                                </a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <canvas t-att-id="'chart_' + chart_index" style="height: 300px;"></canvas>
                                    </div>
                                </div>
                            </div>
                        </t>
                    </div>

                    <!-- Empty State -->
                    <div class="text-center p-5" t-if="!state.widgets.length and !state.charts.length">
                        <i class="fa fa-chart-bar fa-3x text-muted mb-3"/>
                        <h4 class="text-muted">Welcome to Analytics Dashboard</h4>
                        <p class="text-muted">Your dashboard is ready. Data will appear here as you configure widgets and charts.</p>
                        <button class="btn btn-primary" t-on-click="openSettings">
                            <i class="fa fa-plus"/> Add Your First Widget
                        </button>
                    </div>
                </t>

                <!-- Footer section to ensure scrolling -->
                <div class="row mt-5" t-if="state.widgets.length">
                    <div class="col-12">
                        <div class="card shadow">
                            <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-info">📊 Dashboard Summary</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6>📈 Key Insights:</h6>
                                        <ul class="list-unstyled">
                                            <li>• Real-time data from Odoo database</li>
                                            <li>• Interactive charts with Chart.js</li>
                                            <li>• Auto-refresh every 30 seconds</li>
                                            <li>• Responsive design for all devices</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>🎯 Quick Actions:</h6>
                                        <div class="d-flex flex-wrap">
                                            <button class="btn btn-outline-primary btn-sm me-2 mb-2">📊 Export PDF</button>
                                            <button class="btn btn-outline-success btn-sm me-2 mb-2">📈 View Report</button>
                                            <button class="btn btn-outline-info btn-sm me-2 mb-2">🔄 Refresh Data</button>
                                            <button class="btn btn-outline-warning btn-sm me-2 mb-2">⚙️ Settings</button>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div class="text-center text-muted small">
                                    <p>Last updated: <span t-esc="new Date().toLocaleString()"/> | Dashboard Type: <span t-esc="state.dashboard_type || 'overview'"/></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    `;

    setup() {
        this.orm = useService("orm");
        this.dashboardRef = useRef("dashboardContent");

        this.state = useState({
            title: 'Analytics Dashboard',
            dashboard_icon: 'fa fa-chart-bar',
            dashboard_type: 'overview',
            widgets: [],
            charts: [],
            loading: true
        });

        onMounted(() => {
            this.loadDashboardData();
            this.startAutoRefresh();
        });
    }

    async loadDashboardData() {
        try {
            const params = this.props.action?.params || {};
            const dashboardType = params.dashboard_type || 'overview';

            const data = await this.orm.call(
                'analytics.dashboard',
                'get_dashboard_data',
                [dashboardType]
            );

            this.state.title = data.title || 'Analytics Dashboard';
            this.state.dashboard_type = data.dashboard_type || 'overview';
            this.state.widgets = data.widgets || [];
            this.state.charts = data.charts || [];
            this.state.loading = false;

            // Set appropriate icon based on dashboard type
            this.setDashboardIcon(dashboardType);

            // Render charts after data is loaded
            setTimeout(() => {
                this.renderCharts();
            }, 100);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.state.loading = false;
        }
    }

    setDashboardIcon(dashboardType) {
        const icons = {
            'overview': 'fa fa-chart-bar',
            'sales': 'fa fa-euro-sign',
            'production': 'fa fa-industry',
            'stock': 'fa fa-boxes',
            'maintenance': 'fa fa-wrench',
            'inventory': 'fa fa-clipboard-list',
            'workshop': 'fa fa-cogs',
            'manufacturing': 'fa fa-hammer'
        };
        this.state.dashboard_icon = icons[dashboardType] || 'fa fa-chart-bar';
    }

    async refreshDashboard() {
        this.state.loading = true;
        await this.loadDashboardData();
    }

    async createDemoData() {
        try {
            this.state.loading = true;

            const result = await this.orm.call(
                'analytics.dashboard',
                'create_demo_data',
                []
            );

            if (result) {
                // Refresh dashboard after creating demo data
                await this.loadDashboardData();
                alert('✅ Demo data created successfully! Dashboard refreshed.');
            } else {
                alert('❌ Failed to create demo data. Check console for errors.');
            }
        } catch (error) {
            console.error('Error creating demo data:', error);
            alert('❌ Error creating demo data: ' + error.message);
            this.state.loading = false;
        }
    }



    openSettings() {
        console.log('Open dashboard settings');
        // TODO: Implement settings modal
    }

    renderCharts() {
        if (!this.state.charts || this.state.charts.length === 0) return;

        this.state.charts.forEach((chart, index) => {
            const canvasId = `chart_${index}`;
            const canvas = document.getElementById(canvasId);

            if (canvas && window.Chart) {
                // Destroy existing chart if it exists
                if (canvas.chart) {
                    canvas.chart.destroy();
                }

                const ctx = canvas.getContext('2d');

                // Configure options based on chart type
                let options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false  // Disable legends to avoid Chart.js error
                        },
                        tooltip: {
                            enabled: true
                        }
                    }
                };

                // Add simple scales for line and bar charts
                if (chart.type === 'line' || chart.type === 'bar') {
                    options.scales = {
                        y: {
                            beginAtZero: true
                        }
                    };
                }

                canvas.chart = new Chart(ctx, {
                    type: chart.type,
                    data: chart.data,
                    options: options
                });
            }
        });
    }

    startAutoRefresh() {
        // Auto refresh every 30 seconds
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        this.refreshInterval = setInterval(() => {
            this.refreshDashboard();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    exportChart(chartIndex) {
        const canvas = document.getElementById(`chart_${chartIndex}`);
        if (canvas && canvas.chart) {
            const url = canvas.chart.toBase64Image();
            const link = document.createElement('a');
            link.download = `chart_${chartIndex}.png`;
            link.href = url;
            link.click();
        }
    }

    fullscreenChart(chartIndex) {
        const chartCard = document.getElementById(`chart_${chartIndex}`).closest('.card');
        if (chartCard) {
            if (chartCard.requestFullscreen) {
                chartCard.requestFullscreen();
            } else if (chartCard.webkitRequestFullscreen) {
                chartCard.webkitRequestFullscreen();
            } else if (chartCard.msRequestFullscreen) {
                chartCard.msRequestFullscreen();
            }
        }
    }
}

registry.category("actions").add("analytics_dashboard", AnalyticsDashboard);

// Add compatibility for old action names that might exist in database
registry.category("actions").add("DashboardSummary", AnalyticsDashboard);
registry.category("actions").add("odoo_dynamic_dashboard.dashboard", AnalyticsDashboard);
registry.category("actions").add("OdooDynamicDashboard", AnalyticsDashboard);