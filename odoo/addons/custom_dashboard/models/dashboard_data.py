# -*- coding: utf-8 -*-
from odoo import api, fields, models
from datetime import datetime, timedelta
import json
from odoo.tools.float_utils import float_round

class DashboardData(models.Model):
    _name = 'dashboard.data'
    _description = 'Données du tableau de bord'

    @api.model
    def get_dashboard_data(self):
        """Récupère les données pour le tableau de bord"""
        return {
            'stats': self._get_stats_data(),
            'activities': self._get_activities_data(),
            'production': self._get_production_data(),
            'inventory': self._get_inventory_data(),
            'workcenters': self._get_workcenters_data(),
            'quality': self._get_quality_data(),
            'charts': self._get_charts_data(),
        }

    def _get_stats_data(self):
        """Récupère les statistiques générales"""
        stats = []

        # Nombre d'ordres de fabrication en cours
        if 'mrp.production' in self.env:
            mo_count = self.env['mrp.production'].sudo().search_count([
                ('state', 'in', ['confirmed', 'progress', 'to_close'])
            ])
            stats.append({
                'value': mo_count,
                'label': 'Fabrications en cours',
                'icon': 'fa fa-cogs',
                'color': 'primary'
            })

        # Nombre de produits finis en stock
        if 'product.template' in self.env and 'stock.quant' in self.env:
            finished_products = self.env['product.template'].sudo().search_count([
                ('type', '=', 'product'),
                ('categ_id.name', 'ilike', 'bijou')
            ])
            stats.append({
                'value': finished_products,
                'label': 'Bijoux en stock',
                'icon': 'fa fa-gem',
                'color': 'success'
            })

        # Nombre de commandes clients en attente
        if 'sale.order' in self.env:
            pending_orders = self.env['sale.order'].sudo().search_count([
                ('state', 'in', ['sale', 'done']),
                ('invoice_status', '!=', 'invoiced')
            ])
            stats.append({
                'value': pending_orders,
                'label': 'Commandes en attente',
                'icon': 'fa fa-shopping-cart',
                'color': 'warning'
            })

        # Nombre d'ateliers actifs
        if 'mrp.workcenter' in self.env:
            active_workcenters = self.env['mrp.workcenter'].sudo().search_count([
                ('active', '=', True)
            ])
            stats.append({
                'value': active_workcenters,
                'label': 'Ateliers actifs',
                'icon': 'fa fa-industry',
                'color': 'info'
            })

        return stats

    def _get_production_data(self):
        """Récupère les données de production pour l'usine de bijoux"""
        production_data = []

        if 'mrp.production' in self.env:
            # Ordres de fabrication par état
            states = {
                'draft': 'Brouillon',
                'confirmed': 'Confirmé',
                'progress': 'En cours',
                'to_close': 'À terminer',
                'done': 'Terminé',
                'cancel': 'Annulé'
            }

            # Récupérer les données de production des 30 derniers jours
            date_30_days_ago = fields.Date.to_string(datetime.now() - timedelta(days=30))

            for state, label in states.items():
                count = self.env['mrp.production'].sudo().search_count([
                    ('state', '=', state),
                    ('date_start', '>=', date_30_days_ago)
                ])

                production_data.append({
                    'state': state,
                    'label': label,
                    'count': count,
                    'color': self._get_state_color(state)
                })

            # Ajouter la production quotidienne (terminée dans les 7 derniers jours)
            date_7_days_ago = fields.Date.to_string(datetime.now() - timedelta(days=7))
            daily_production = self.env['mrp.production'].sudo().search_count([
                ('state', '=', 'done'),
                ('date_finished', '>=', date_7_days_ago)
            ])

            production_data.append({
                'state': 'daily',
                'label': 'Production quotidienne (moy.)',
                'count': round(daily_production / 7, 1) if daily_production else 0,
                'color': 'success'
            })

            # Efficacité globale (OEE) - Calculée à partir des centres de travail
            if 'mrp.workcenter' in self.env:
                workcenters = self.env['mrp.workcenter'].sudo().search([])
                total_oee = sum(wc.oee for wc in workcenters if wc.oee)
                avg_oee = round(total_oee / len(workcenters), 1) if workcenters else 0

                production_data.append({
                    'state': 'oee',
                    'label': 'Efficacité globale (OEE)',
                    'count': f"{avg_oee}%",
                    'color': 'info'
                })

        return production_data

    def _get_inventory_data(self):
        """Récupère les données d'inventaire pour les matières premières et produits finis"""
        inventory_data = []

        if 'product.template' in self.env and 'stock.quant' in self.env:
            # Catégories de matières premières pour bijoux
            raw_material_categories = ['or', 'argent', 'platine', 'pierres', 'gemmes', 'diamants']

            for category in raw_material_categories:
                # Rechercher les produits dans cette catégorie
                products = self.env['product.template'].sudo().search([
                    ('name', 'ilike', category),
                    ('type', '=', 'product')
                ])

                if products:
                    total_qty = 0
                    total_value = 0

                    for product in products:
                        # Calculer la quantité en stock
                        quants = self.env['stock.quant'].sudo().search([
                            ('product_id', 'in', product.product_variant_ids.ids),
                            ('location_id.usage', '=', 'internal')
                        ])

                        for quant in quants:
                            total_qty += quant.quantity
                            total_value += quant.quantity * product.standard_price

                    inventory_data.append({
                        'category': category.capitalize(),
                        'quantity': float_round(total_qty, precision_digits=2),
                        'value': float_round(total_value, precision_digits=2),
                        'unit': products[0].uom_id.name if products[0].uom_id else ''
                    })

            # Ajouter les produits finis (bijoux)
            finished_products = self.env['product.template'].sudo().search([
                ('categ_id.name', 'ilike', 'bijou'),
                ('type', '=', 'product')
            ])

            if finished_products:
                total_qty = 0
                total_value = 0

                for product in finished_products:
                    quants = self.env['stock.quant'].sudo().search([
                        ('product_id', 'in', product.product_variant_ids.ids),
                        ('location_id.usage', '=', 'internal')
                    ])

                    for quant in quants:
                        total_qty += quant.quantity
                        total_value += quant.quantity * product.list_price

                inventory_data.append({
                    'category': 'Bijoux finis',
                    'quantity': int(total_qty),
                    'value': float_round(total_value, precision_digits=2),
                    'unit': 'pcs'
                })

        return inventory_data

    def _get_workcenters_data(self):
        """Récupère les données des ateliers de fabrication"""
        workcenters_data = []

        if 'mrp.workcenter' in self.env:
            workcenters = self.env['mrp.workcenter'].sudo().search([])

            for workcenter in workcenters:
                # Calculer la charge de travail (en heures)
                workload = workcenter.workcenter_load / 60 if workcenter.workcenter_load else 0

                # Déterminer l'état actuel
                if workcenter.working_state == 'normal':
                    state = 'Disponible'
                    state_color = 'success'
                elif workcenter.working_state == 'done':
                    state = 'En production'
                    state_color = 'primary'
                else:
                    state = 'Bloqué'
                    state_color = 'danger'

                workcenters_data.append({
                    'id': workcenter.id,
                    'name': workcenter.name,
                    'state': state,
                    'state_color': state_color,
                    'workload': float_round(workload, precision_digits=1),
                    'oee': workcenter.oee,
                    'performance': workcenter.performance,
                    'pending_orders': workcenter.workorder_pending_count,
                    'ready_orders': workcenter.workorder_ready_count
                })

        return workcenters_data

    def _get_quality_data(self):
        """Récupère les données de qualité pour la production de bijoux"""
        quality_data = {
            'rejection_rate': 0,
            'rework_rate': 0,
            'compliance_rate': 100,
            'quality_issues': []
        }

        # Ces données seraient normalement calculées à partir de modules de qualité
        # Pour l'instant, nous utilisons des données fictives
        quality_data['rejection_rate'] = 2.3
        quality_data['rework_rate'] = 5.7
        quality_data['compliance_rate'] = 97.8

        quality_data['quality_issues'] = [
            {'issue': 'Défauts de polissage', 'count': 12, 'percentage': 35},
            {'issue': 'Sertissage incorrect', 'count': 8, 'percentage': 23},
            {'issue': 'Problèmes de finition', 'count': 7, 'percentage': 20},
            {'issue': 'Dimensions incorrectes', 'count': 5, 'percentage': 14},
            {'issue': 'Autres défauts', 'count': 3, 'percentage': 8}
        ]

        return quality_data

    def _get_charts_data(self):
        """Prépare les données pour les graphiques"""
        charts_data = {}

        # Graphique de production par jour (7 derniers jours)
        if 'mrp.production' in self.env:
            production_by_day = []
            labels = []

            for i in range(6, -1, -1):
                date = datetime.now() - timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                labels.append(date.strftime('%d/%m'))

                count = self.env['mrp.production'].sudo().search_count([
                    ('state', '=', 'done'),
                    ('date_finished', '>=', date_str + ' 00:00:00'),
                    ('date_finished', '<=', date_str + ' 23:59:59')
                ])

                production_by_day.append(count)

            charts_data['production_by_day'] = {
                'labels': labels,
                'datasets': [{
                    'label': 'Bijoux produits',
                    'data': production_by_day,
                    'backgroundColor': 'rgba(54, 162, 235, 0.2)',
                    'borderColor': 'rgba(54, 162, 235, 1)',
                    'borderWidth': 1
                }]
            }

        # Graphique de répartition des types de bijoux produits
        if 'mrp.production' in self.env and 'product.template' in self.env:
            # Catégories de bijoux
            jewelry_types = ['bague', 'collier', 'bracelet', 'boucle', 'pendentif', 'autre']
            jewelry_counts = []

            for jewelry_type in jewelry_types:
                # Trouver les produits de ce type
                products = self.env['product.template'].sudo().search([
                    ('name', 'ilike', jewelry_type),
                    ('type', '=', 'product')
                ])

                if products:
                    # Compter les ordres de fabrication pour ces produits
                    count = self.env['mrp.production'].sudo().search_count([
                        ('product_id', 'in', products.mapped('product_variant_ids').ids),
                        ('state', '=', 'done'),
                        ('date_finished', '>=', fields.Date.to_string(datetime.now() - timedelta(days=30)))
                    ])

                    jewelry_counts.append(count)
                else:
                    jewelry_counts.append(0)

            charts_data['jewelry_types'] = {
                'labels': [t.capitalize() for t in jewelry_types],
                'datasets': [{
                    'data': jewelry_counts,
                    'backgroundColor': [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ]
                }]
            }

        return charts_data

    def _get_activities_data(self):
        """Récupère les activités récentes"""
        activities = []

        # Messages récents
        if 'mail.message' in self.env:
            messages = self.env['mail.message'].sudo().search([
                ('message_type', '!=', 'notification'),
                ('model', '!=', False),
                ('res_id', '!=', 0)
            ], limit=5, order='date desc')

            for message in messages:
                author = message.author_id.name if message.author_id else 'Système'
                model_name = self.env[message.model]._description if message.model in self.env else message.model

                activities.append({
                    'icon': 'fa fa-comment',
                    'message': f"{author} a commenté sur {model_name}",
                    'time': self._format_time(message.date),
                })

        # Ordres de fabrication récemment terminés
        if 'mrp.production' in self.env:
            recent_productions = self.env['mrp.production'].sudo().search([
                ('state', '=', 'done')
            ], limit=5, order='date_finished desc')

            for production in recent_productions:
                activities.append({
                    'icon': 'fa fa-check-circle',
                    'message': f"Production terminée: {production.product_id.name}",
                    'time': self._format_time(production.date_finished),
                })

        return activities

    def _format_time(self, dt):
        """Formate une date en texte relatif"""
        now = fields.Datetime.now()
        diff = now - dt

        if diff.days > 0:
            if diff.days == 1:
                return "Hier"
            elif diff.days < 7:
                return f"Il y a {diff.days} jours"
            else:
                return dt.strftime("%d/%m/%Y")
        else:
            hours = diff.seconds // 3600
            if hours > 0:
                return f"Il y a {hours} heures"
            else:
                minutes = diff.seconds // 60
                return f"Il y a {minutes} minutes" if minutes > 0 else "À l'instant"

    def _get_state_color(self, state):
        """Retourne une couleur en fonction de l'état"""
        colors = {
            'draft': 'secondary',
            'confirmed': 'info',
            'progress': 'primary',
            'to_close': 'warning',
            'done': 'success',
            'cancel': 'danger'
        }
        return colors.get(state, 'secondary')