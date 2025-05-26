/** @odoo-module **/
import { loadJS } from '@web/core/assets';
import { _t } from "@web/core/l10n/translation";
import { ConfirmationDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
const { Component, xml, onWillStart, useRef, onMounted } = owl;

export class DynamicDashboardChart extends Component {
    setup() {
        this.chartRef = useRef("chart");
        this.doAction = this.props.doAction?.doAction;
        this.dialog = this.props.dialog;
        this.orm = this.props.orm;
        this.chart = null;

        onWillStart(async () => {
            await this.loadChartLibraries();
        });

        onMounted(() => {
            this.renderChart();
        });
    }

    async loadChartLibraries() {
        try {
            // Check if Chart.js is already loaded
            if (typeof Chart === 'undefined') {
                await loadJS('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js');
            }
        } catch (error) {
            console.error("Failed to load Chart.js:", error);
        }
    }

    renderChart() {
        if (!this.chartRef.el || !window.Chart) return;

        const ctx = this.chartRef.el.getContext('2d');

        // Sample data - in real implementation, this would come from the server
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Ventes',
                data: [12, 19, 3, 5, 2, 3, 20, 33, 23, 12, 19, 27],
                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };

        const config = {
            type: this.props.widget.chart_type || 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: "'Nunito', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            family: "'Nunito', sans-serif",
                            size: 14
                        },
                        bodyFont: {
                            family: "'Nunito', sans-serif",
                            size: 13
                        },
                        padding: 10,
                        cornerRadius: 4
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: "'Nunito', sans-serif",
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Nunito', sans-serif",
                                size: 11
                            }
                        }
                    }
                }
            }
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, config);
    }

    async getConfiguration(ev) {
        if (!this.doAction) return;
        ev.stopPropagation();
        ev.preventDefault();
        await this.doAction({
            type: "ir.actions.act_window",
            res_model: "dashboard.block",
            res_id: this.props.widget.id,
            view_mode: "form",
            views: [[false, "form"]],
        });
    }

    async removeChart(ev) {
        if (!this.dialog || !this.orm) return;
        ev.stopPropagation();
        ev.preventDefault();
        this.dialog.add(ConfirmationDialog, {
            title: _t("Delete Confirmation"),
            body: _t("Are you sure you want to delete this chart?"),
            confirmLabel: _t("Yes"),
            cancelLabel: _t("No"),
            confirm: async () => {
                await this.orm.unlink("dashboard.block", [this.props.widget.id]);
                location.reload();
            },
        });
    }
}

DynamicDashboardChart.template = xml`
    <div class="resize-drag chart-tile rounded shadow-sm p-3 bg-white"
        t-att-data-id="this.props.widget.id"
        t-att-data-x="this.props.widget.data_x"
        t-att-data-y="this.props.widget.data_y"
        t-att-style="'transform: translate('+ this.props.widget.translate_x +', '+ this.props.widget.translate_y +'); width:' + this.props.widget.width + '; height:' + this.props.widget.height + ';'">

        <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
                <h4 class="m-0 fw-bold" t-esc="this.props.widget.name"/>
                <span class="small text-muted">Graphique</span>
            </div>
            <div class="btn-group">
                <button class="btn btn-sm btn-light" t-on-click="(ev) => this.getConfiguration(ev)">
                    <i class="fa fa-cog" title="Config"/>
                </button>
                <button class="btn btn-sm btn-light" t-on-click="(ev) => this.removeChart(ev)">
                    <i class="fa fa-times" title="Delete"/>
                </button>
            </div>
        </div>

        <div class="chart-container" style="position: relative; height: calc(100% - 50px);">
            <canvas t-ref="chart"></canvas>
        </div>
    </div>`;

