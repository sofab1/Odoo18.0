odoo.define('custom_dashboard.main', function (require) {
    "use strict";

    var AbstractAction = require('web.AbstractAction');
    var core = require('web.core');
    var rpc = require('web.rpc');
    var session = require('web.session');
    var QWeb = core.qweb;
    var Dialog = require('web.Dialog');

    var CustomDashboard = AbstractAction.extend({
        template: 'CustomDashboard',
        events: {
            'click .btn-filter': '_onFilterClick',
            'click .workcenter-card': '_onWorkcenterClick',
            'click .inventory-item': '_onInventoryItemClick',
            'click .production-item': '_onProductionItemClick',
            'change #period-filter': '_onPeriodFilterChange',
            'change #jewelry-type-filter': '_onJewelryTypeFilterChange',
        },

        init: function(parent, action) {
            this._super.apply(this, arguments);
            this.dashboardData = {};
            this.chartInstances = {};
            this.currentPeriod = 'week';
            this.currentJewelryType = 'all';
        },

        willStart: function() {
            var self = this;
            return this._super.apply(this, arguments).then(function() {
                return self._fetchData();
            });
        },

        start: function() {
            var self = this;
            return this._super.apply(this, arguments).then(function() {
                self._renderDashboard();
                // Rafraîchir les données toutes les 5 minutes
                self.intervalId = setInterval(function() {
                    self.reload();
                }, 5 * 60 * 1000);
            });
        },

        destroy: function() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this._super.apply(this, arguments);
        },

        _fetchData: function() {
            var self = this;
            return rpc.query({
                model: 'dashboard.data',
                method: 'get_dashboard_data',
            }).then(function(result) {
                self.dashboardData = result;
            });
        },

        _renderDashboard: function() {
            var self = this;

            // Si nous n'avons pas encore de données, afficher un message de chargement
            if ($.isEmptyObject(this.dashboardData)) {
                this.$('.o_custom_dashboard').html(
                    $('<div>', {class: 'o_dashboard_loading'}).text('Chargement...')
                );
                return;
            }

            // Sinon, rendre le tableau de bord avec les données
            this.$('.o_custom_dashboard').html(
                QWeb.render('CustomDashboardContent', {
                    widget: this,
                    data: this.dashboardData,
                    currentPeriod: this.currentPeriod,
                    currentJewelryType: this.currentJewelryType
                })
            );

            // Initialiser les widgets ou graphiques
            this._initCharts();
            this._initTooltips();
        },

        _initCharts: function() {
            var self = this;

            // Détruire les instances de graphiques existantes
            Object.keys(this.chartInstances).forEach(function(chartId) {
                if (self.chartInstances[chartId]) {
                    self.chartInstances[chartId].destroy();
                }
            });
            this.chartInstances = {};

            // Graphique de production par jour
            if (this.dashboardData.charts && this.dashboardData.charts.production_by_day) {
                var productionCtx = this.$('#production-chart');
                if (productionCtx.length) {
                    this.chartInstances.production = new Chart(productionCtx, {
                        type: 'bar',
                        data: this.dashboardData.charts.production_by_day,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0
                                    }
                                }
                            }
                        }
                    });
                }
            }

            // Graphique de répartition des types de bijoux
            if (this.dashboardData.charts && this.dashboardData.charts.jewelry_types) {
                var jewelryTypesCtx = this.$('#jewelry-types-chart');
                if (jewelryTypesCtx.length) {
                    this.chartInstances.jewelryTypes = new Chart(jewelryTypesCtx, {
                        type: 'doughnut',
                        data: this.dashboardData.charts.jewelry_types,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right'
                                }
                            }
                        }
                    });
                }
            }

            // Graphique de qualité (taux de rejet, retouche, conformité)
            if (this.dashboardData.quality) {
                var qualityCtx = this.$('#quality-chart');
                if (qualityCtx.length) {
                    var qualityData = {
                        labels: ['Taux de rejet', 'Taux de retouche', 'Taux de conformité'],
                        datasets: [{
                            data: [
                                this.dashboardData.quality.rejection_rate,
                                this.dashboardData.quality.rework_rate,
                                this.dashboardData.quality.compliance_rate
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)'
                            ]
                        }]
                    };

                    this.chartInstances.quality = new Chart(qualityCtx, {
                        type: 'bar',
                        data: qualityData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });
                }
            }

            // Graphique des problèmes de qualité
            if (this.dashboardData.quality && this.dashboardData.quality.quality_issues) {
                var issuesCtx = this.$('#quality-issues-chart');
                if (issuesCtx.length) {
                    var issues = this.dashboardData.quality.quality_issues;
                    var issuesData = {
                        labels: issues.map(function(issue) { return issue.issue; }),
                        datasets: [{
                            data: issues.map(function(issue) { return issue.percentage; }),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)'
                            ]
                        }]
                    };

                    this.chartInstances.issues = new Chart(issuesCtx, {
                        type: 'pie',
                        data: issuesData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
            }
        },

        _initTooltips: function() {
            // Initialiser les tooltips Bootstrap
            this.$('[data-bs-toggle="tooltip"]').tooltip();
        },



        _onFilterClick: function(ev) {
            var $target = $(ev.currentTarget);
            var filter = $target.data('filter');

            // Mettre à jour l'UI
            this.$('.btn-filter').removeClass('active');
            $target.addClass('active');

            // Appliquer le filtre
            // Ici, vous pouvez implémenter la logique de filtrage
            console.log('Filtre appliqué:', filter);
        },

        _onWorkcenterClick: function(ev) {
            var $target = $(ev.currentTarget);
            var workcenterId = $target.data('id');

            if (workcenterId) {
                this.do_action({
                    type: 'ir.actions.act_window',
                    res_model: 'mrp.workcenter',
                    res_id: workcenterId,
                    views: [[false, 'form']],
                    target: 'current'
                });
            }
        },

        _onInventoryItemClick: function(ev) {
            var $target = $(ev.currentTarget);
            var category = $target.data('category');

            if (category) {
                this.do_action({
                    type: 'ir.actions.act_window',
                    name: 'Inventaire: ' + category,
                    res_model: 'stock.quant',
                    domain: [['location_id.usage', '=', 'internal'], ['product_id.name', 'ilike', category]],
                    views: [[false, 'list'], [false, 'form']],
                    target: 'current',
                    context: {
                        'search_default_internal_loc': 1,
                    }
                });
            }
        },

        _onProductionItemClick: function(ev) {
            var $target = $(ev.currentTarget);
            var state = $target.data('state');

            if (state) {
                var domain = state !== 'daily' && state !== 'oee' ? [['state', '=', state]] : [['state', '=', 'done']];

                this.do_action({
                    type: 'ir.actions.act_window',
                    name: 'Ordres de fabrication',
                    res_model: 'mrp.production',
                    domain: domain,
                    views: [[false, 'list'], [false, 'form']],
                    target: 'current'
                });
            }
        },

        _onPeriodFilterChange: function(ev) {
            this.currentPeriod = $(ev.target).val();
            this.reload();
        },

        _onJewelryTypeFilterChange: function(ev) {
            this.currentJewelryType = $(ev.target).val();
            this.reload();
        },

        reload: function() {
            return this._fetchData().then(this._renderDashboard.bind(this));
        },

        // Méthode pour afficher les détails d'un élément
        _showDetails: function(title, content) {
            new Dialog(this, {
                title: title,
                $content: $('<div>').html(content),
                buttons: [{
                    text: 'Fermer',
                    classes: 'btn-secondary',
                    close: true
                }]
            }).open();
        }
    });

    core.action_registry.add('custom_dashboard.main', CustomDashboard);

    return CustomDashboard;
});
