/** @odoo-module */

import { _t } from "@web/core/l10n/translation";

/**
 * Advanced 3D Charts for AI Bijouterie Dashboard
 * Provides interactive 3D visualizations and advanced chart components
 */
export class AdvancedCharts {
    constructor() {
        this.charts = {};
        this.animations = {};
        this.themes = {
            light: {
                background: 'rgba(255, 255, 255, 0.9)',
                text: '#2c3e50',
                grid: 'rgba(0, 0, 0, 0.1)',
                primary: '#667eea',
                secondary: '#764ba2',
                success: '#4facfe',
                warning: '#43e97b',
                danger: '#fa709a'
            },
            dark: {
                background: 'rgba(0, 0, 0, 0.9)',
                text: '#ecf0f1',
                grid: 'rgba(255, 255, 255, 0.1)',
                primary: '#667eea',
                secondary: '#764ba2',
                success: '#4facfe',
                warning: '#43e97b',
                danger: '#fa709a'
            }
        };
        this.currentTheme = 'light';
    }

    /**
     * Initialize Chart.js with advanced configurations
     */
    initializeChartJS() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
            Chart.defaults.font.size = 12;
            Chart.defaults.animation.duration = 1000;
            Chart.defaults.animation.easing = 'easeInOutQuart';
            
            // Register custom plugins
            this.registerCustomPlugins();
        }
    }

    /**
     * Register custom Chart.js plugins
     */
    registerCustomPlugins() {
        // Glassmorphism background plugin
        Chart.register({
            id: 'glassmorphism',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.fillStyle = this.themes[this.currentTheme].background;
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        });

        // Animated gradient plugin
        Chart.register({
            id: 'animatedGradient',
            beforeDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                
                if (chart.config.options.animatedGradient) {
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    const time = Date.now() * 0.001;
                    
                    gradient.addColorStop(0, `hsla(${(time * 50) % 360}, 70%, 60%, 0.8)`);
                    gradient.addColorStop(0.5, `hsla(${(time * 50 + 120) % 360}, 70%, 60%, 0.6)`);
                    gradient.addColorStop(1, `hsla(${(time * 50 + 240) % 360}, 70%, 60%, 0.4)`);
                    
                    chart.data.datasets.forEach((dataset, index) => {
                        if (dataset.animatedGradient) {
                            dataset.backgroundColor = gradient;
                        }
                    });
                }
            }
        });
    }

    /**
     * Create advanced production forecast chart
     */
    createProductionForecastChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: _t('Production Réelle'),
                        data: data.actual,
                        borderColor: this.themes[this.currentTheme].primary,
                        backgroundColor: this.createGradient(ctx, this.themes[this.currentTheme].primary),
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 2,
                    },
                    {
                        label: _t('Prédiction IA'),
                        data: data.predicted,
                        borderColor: this.themes[this.currentTheme].secondary,
                        backgroundColor: this.createGradient(ctx, this.themes[this.currentTheme].secondary),
                        borderWidth: 3,
                        borderDash: [10, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: this.themes[this.currentTheme].text
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.themes[this.currentTheme].primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: (context) => {
                                return `${context[0].label}`;
                            },
                            label: (context) => {
                                const confidence = data.confidence ? data.confidence[context.dataIndex] : 0.85;
                                return `${context.dataset.label}: ${context.parsed.y} bijoux (${Math.round(confidence * 100)}% confiance)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: this.themes[this.currentTheme].grid,
                            borderColor: this.themes[this.currentTheme].grid
                        },
                        ticks: {
                            color: this.themes[this.currentTheme].text
                        }
                    },
                    y: {
                        grid: {
                            color: this.themes[this.currentTheme].grid,
                            borderColor: this.themes[this.currentTheme].grid
                        },
                        ticks: {
                            color: this.themes[this.currentTheme].text,
                            callback: (value) => `${value} bijoux`
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        this.charts[canvasId] = chart;
        return chart;
    }

    /**
     * Create 3D-style quality radar chart
     */
    createQualityRadarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: _t('Qualité Actuelle'),
                        data: data.current,
                        borderColor: this.themes[this.currentTheme].success,
                        backgroundColor: this.createRadialGradient(ctx, this.themes[this.currentTheme].success),
                        borderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 2,
                    },
                    {
                        label: _t('Objectif'),
                        data: data.target,
                        borderColor: this.themes[this.currentTheme].warning,
                        backgroundColor: this.createRadialGradient(ctx, this.themes[this.currentTheme].warning),
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: this.themes[this.currentTheme].text,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: this.themes[this.currentTheme].grid
                        },
                        angleLines: {
                            color: this.themes[this.currentTheme].grid
                        },
                        pointLabels: {
                            color: this.themes[this.currentTheme].text,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            color: this.themes[this.currentTheme].text,
                            backdropColor: 'transparent'
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutCubic'
                }
            }
        });

        this.charts[canvasId] = chart;
        return chart;
    }

    /**
     * Create animated donut chart for inventory
     */
    createInventoryDonutChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        this.themes[this.currentTheme].primary,
                        this.themes[this.currentTheme].secondary,
                        this.themes[this.currentTheme].success,
                        this.themes[this.currentTheme].warning,
                        this.themes[this.currentTheme].danger
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.themes[this.currentTheme].text,
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: (context) => {
                                const percentage = ((context.parsed / data.total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        this.charts[canvasId] = chart;
        return chart;
    }

    /**
     * Create gradient background
     */
    createGradient(ctx, color) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, color + '80');
        gradient.addColorStop(1, color + '20');
        return gradient;
    }

    /**
     * Create radial gradient
     */
    createRadialGradient(ctx, color) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
        gradient.addColorStop(0, color + '60');
        gradient.addColorStop(1, color + '20');
        return gradient;
    }

    /**
     * Update chart theme
     */
    updateTheme(theme) {
        this.currentTheme = theme;
        
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                // Update chart colors based on new theme
                this.updateChartTheme(chart);
                chart.update('none');
            }
        });
    }

    /**
     * Update individual chart theme
     */
    updateChartTheme(chart) {
        const options = chart.options;
        
        // Update text colors
        if (options.plugins?.legend?.labels) {
            options.plugins.legend.labels.color = this.themes[this.currentTheme].text;
        }
        
        // Update scale colors
        if (options.scales) {
            Object.values(options.scales).forEach(scale => {
                if (scale.grid) {
                    scale.grid.color = this.themes[this.currentTheme].grid;
                }
                if (scale.ticks) {
                    scale.ticks.color = this.themes[this.currentTheme].text;
                }
                if (scale.pointLabels) {
                    scale.pointLabels.color = this.themes[this.currentTheme].text;
                }
            });
        }
    }

    /**
     * Animate chart data update
     */
    animateDataUpdate(chartId, newData) {
        const chart = this.charts[chartId];
        if (!chart) return;

        // Smooth data transition
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            if (newData.datasets[datasetIndex]) {
                dataset.data = newData.datasets[datasetIndex].data;
            }
        });

        chart.update('active');
    }

    /**
     * Destroy all charts
     */
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    /**
     * Get chart instance
     */
    getChart(chartId) {
        return this.charts[chartId];
    }

    /**
     * Export chart as image
     */
    exportChart(chartId, format = 'png') {
        const chart = this.charts[chartId];
        if (!chart) return null;

        return chart.toBase64Image(format, 1.0);
    }
}

// Export singleton instance
export const advancedCharts = new AdvancedCharts();
