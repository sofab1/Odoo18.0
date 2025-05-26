# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from datetime import datetime, timedelta
import json
import random
import math
from odoo.tools.float_utils import float_round

class AIAnalytics(models.Model):
    _name = 'ai.analytics'
    _description = 'AI Analytics for Bijouterie Dashboard'

    name = fields.Char(string='Analysis Name', required=True)
    analysis_type = fields.Selection([
        ('production', 'Production Forecasting'),
        ('quality', 'Quality Prediction'),
        ('inventory', 'Inventory Optimization'),
        ('maintenance', 'Predictive Maintenance'),
    ], string='Analysis Type', required=True)
    
    data_points = fields.Text(string='Historical Data Points')
    model_parameters = fields.Text(string='AI Model Parameters')
    accuracy_score = fields.Float(string='Model Accuracy', digits=(5, 2))
    last_training = fields.Datetime(string='Last Training Date')
    is_active = fields.Boolean(string='Active', default=True)
    
    @api.model
    def get_ai_insights(self):
        """Generate AI-powered insights for the dashboard"""
        insights = []
        
        # Production insights
        production_insights = self._get_production_insights()
        insights.extend(production_insights)
        
        # Quality insights
        quality_insights = self._get_quality_insights()
        insights.extend(quality_insights)
        
        # Inventory insights
        inventory_insights = self._get_inventory_insights()
        insights.extend(inventory_insights)
        
        # Maintenance insights
        maintenance_insights = self._get_maintenance_insights()
        insights.extend(maintenance_insights)
        
        return insights
    
    def _get_production_insights(self):
        """AI-powered production insights"""
        insights = []
        
        # Simulate AI analysis of production data
        current_efficiency = self._calculate_production_efficiency()
        predicted_output = self._predict_production_output()
        bottleneck_analysis = self._analyze_production_bottlenecks()
        
        insights.append({
            'type': 'production',
            'title': _('Efficacité de Production'),
            'description': _('Analyse IA de l\'efficacité actuelle de production'),
            'value': f"{current_efficiency:.1f}%",
            'confidence': 0.87,
            'trend': 'up' if current_efficiency > 85 else 'down',
            'recommendation': _('Optimiser les postes de travail pour améliorer l\'efficacité'),
            'priority': 'high' if current_efficiency < 80 else 'medium'
        })
        
        insights.append({
            'type': 'production',
            'title': _('Prévision Production'),
            'description': _('Production prévue pour les 7 prochains jours'),
            'value': f"{predicted_output} bijoux",
            'confidence': 0.82,
            'trend': 'stable',
            'recommendation': _('Maintenir le rythme actuel de production'),
            'priority': 'medium'
        })
        
        if bottleneck_analysis['detected']:
            insights.append({
                'type': 'production',
                'title': _('Goulot d\'étranglement détecté'),
                'description': f"IA détecte un goulot au poste: {bottleneck_analysis['station']}",
                'value': f"-{bottleneck_analysis['impact']}%",
                'confidence': 0.91,
                'trend': 'down',
                'recommendation': _('Réorganiser les ressources pour éliminer le goulot'),
                'priority': 'high'
            })
        
        return insights
    
    def _get_quality_insights(self):
        """AI-powered quality insights"""
        insights = []
        
        # Simulate AI quality analysis
        defect_prediction = self._predict_defect_rate()
        quality_trend = self._analyze_quality_trend()
        material_impact = self._analyze_material_quality_impact()
        
        insights.append({
            'type': 'quality',
            'title': _('Prédiction Défauts'),
            'description': _('Taux de défauts prévu basé sur l\'analyse IA'),
            'value': f"{defect_prediction:.2f}%",
            'confidence': 0.89,
            'trend': 'down' if defect_prediction < 3 else 'up',
            'recommendation': _('Surveiller la température et l\'humidité'),
            'priority': 'high' if defect_prediction > 5 else 'medium'
        })
        
        insights.append({
            'type': 'quality',
            'title': _('Tendance Qualité'),
            'description': _('Évolution de la qualité sur 30 jours'),
            'value': f"{quality_trend['improvement']:.1f}%",
            'confidence': 0.85,
            'trend': quality_trend['direction'],
            'recommendation': quality_trend['recommendation'],
            'priority': 'medium'
        })
        
        if material_impact['significant']:
            insights.append({
                'type': 'quality',
                'title': _('Impact Matières Premières'),
                'description': _('Qualité des matières affecte la production'),
                'value': f"{material_impact['correlation']:.0f}%",
                'confidence': 0.78,
                'trend': 'warning',
                'recommendation': _('Vérifier la qualité des matières premières'),
                'priority': 'high'
            })
        
        return insights
    
    def _get_inventory_insights(self):
        """AI-powered inventory insights"""
        insights = []
        
        # Simulate AI inventory analysis
        stock_optimization = self._optimize_stock_levels()
        demand_forecast = self._forecast_demand()
        reorder_suggestions = self._generate_reorder_suggestions()
        
        insights.append({
            'type': 'inventory',
            'title': _('Optimisation Stock'),
            'description': _('Niveaux de stock optimaux calculés par IA'),
            'value': f"{stock_optimization['savings']:.0f}€",
            'confidence': 0.83,
            'trend': 'up',
            'recommendation': stock_optimization['action'],
            'priority': 'medium'
        })
        
        insights.append({
            'type': 'inventory',
            'title': _('Prévision Demande'),
            'description': _('Demande prévue pour le mois prochain'),
            'value': f"+{demand_forecast['increase']:.1f}%",
            'confidence': 0.79,
            'trend': 'up' if demand_forecast['increase'] > 0 else 'down',
            'recommendation': _('Ajuster les commandes en conséquence'),
            'priority': 'medium'
        })
        
        if reorder_suggestions:
            insights.append({
                'type': 'inventory',
                'title': _('Suggestions Réapprovisionnement'),
                'description': f"IA suggère de commander {len(reorder_suggestions)} articles",
                'value': f"{len(reorder_suggestions)} articles",
                'confidence': 0.86,
                'trend': 'warning',
                'recommendation': _('Passer commande pour éviter les ruptures'),
                'priority': 'high'
            })
        
        return insights
    
    def _get_maintenance_insights(self):
        """AI-powered maintenance insights"""
        insights = []
        
        # Simulate AI maintenance analysis
        equipment_health = self._analyze_equipment_health()
        maintenance_schedule = self._predict_maintenance_needs()
        
        for equipment in equipment_health:
            if equipment['risk_level'] == 'high':
                insights.append({
                    'type': 'maintenance',
                    'title': _('Maintenance Prédictive'),
                    'description': f"Équipement {equipment['name']} nécessite attention",
                    'value': f"{equipment['health_score']:.0f}%",
                    'confidence': 0.88,
                    'trend': 'down',
                    'recommendation': _('Programmer maintenance préventive'),
                    'priority': 'high'
                })
        
        return insights
    
    def _calculate_production_efficiency(self):
        """Calculate current production efficiency"""
        # Simulate efficiency calculation
        base_efficiency = 85
        random_factor = random.uniform(-10, 15)
        return max(60, min(100, base_efficiency + random_factor))
    
    def _predict_production_output(self):
        """Predict production output for next week"""
        # Simulate production prediction
        base_output = 150
        seasonal_factor = 1.1 if datetime.now().month in [11, 12] else 1.0
        random_factor = random.uniform(0.9, 1.2)
        return int(base_output * seasonal_factor * random_factor)
    
    def _analyze_production_bottlenecks(self):
        """Analyze production bottlenecks"""
        # Simulate bottleneck detection
        stations = ['Polissage', 'Sertissage', 'Finition', 'Contrôle']
        detected = random.choice([True, False])
        
        if detected:
            return {
                'detected': True,
                'station': random.choice(stations),
                'impact': random.randint(15, 35)
            }
        return {'detected': False}
    
    def _predict_defect_rate(self):
        """Predict defect rate"""
        # Simulate defect rate prediction
        base_rate = 2.5
        environmental_factor = random.uniform(-1, 2)
        return max(0, base_rate + environmental_factor)
    
    def _analyze_quality_trend(self):
        """Analyze quality trend"""
        # Simulate quality trend analysis
        improvement = random.uniform(-5, 10)
        direction = 'up' if improvement > 0 else 'down'
        
        if improvement > 5:
            recommendation = _('Maintenir les bonnes pratiques actuelles')
        elif improvement < -2:
            recommendation = _('Réviser les processus de contrôle qualité')
        else:
            recommendation = _('Continuer la surveillance')
        
        return {
            'improvement': improvement,
            'direction': direction,
            'recommendation': recommendation
        }
    
    def _analyze_material_quality_impact(self):
        """Analyze material quality impact"""
        # Simulate material quality analysis
        correlation = random.uniform(60, 95)
        significant = correlation > 80
        
        return {
            'correlation': correlation,
            'significant': significant
        }
    
    def _optimize_stock_levels(self):
        """Optimize stock levels"""
        # Simulate stock optimization
        savings = random.uniform(500, 2000)
        actions = [
            _('Réduire le stock d\'or de 15%'),
            _('Augmenter le stock de pierres précieuses'),
            _('Optimiser la rotation des stocks'),
            _('Ajuster les seuils de réapprovisionnement')
        ]
        
        return {
            'savings': savings,
            'action': random.choice(actions)
        }
    
    def _forecast_demand(self):
        """Forecast demand"""
        # Simulate demand forecasting
        increase = random.uniform(-10, 25)
        return {'increase': increase}
    
    def _generate_reorder_suggestions(self):
        """Generate reorder suggestions"""
        # Simulate reorder suggestions
        materials = ['Or 18k', 'Argent 925', 'Diamants', 'Rubis', 'Émeraudes']
        suggestions = []
        
        for material in materials:
            if random.choice([True, False]):
                suggestions.append({
                    'material': material,
                    'quantity': random.randint(10, 100),
                    'urgency': random.choice(['low', 'medium', 'high'])
                })
        
        return suggestions
    
    def _analyze_equipment_health(self):
        """Analyze equipment health"""
        # Simulate equipment health analysis
        equipment_list = [
            {'name': 'Polisseuse A1', 'health_score': random.uniform(60, 95)},
            {'name': 'Four de fusion', 'health_score': random.uniform(70, 98)},
            {'name': 'Presse hydraulique', 'health_score': random.uniform(65, 90)},
        ]
        
        for equipment in equipment_list:
            if equipment['health_score'] < 75:
                equipment['risk_level'] = 'high'
            elif equipment['health_score'] < 85:
                equipment['risk_level'] = 'medium'
            else:
                equipment['risk_level'] = 'low'
        
        return equipment_list
    
    def _predict_maintenance_needs(self):
        """Predict maintenance needs"""
        # Simulate maintenance prediction
        return {
            'next_maintenance': datetime.now() + timedelta(days=random.randint(7, 30)),
            'estimated_cost': random.uniform(200, 1500),
            'downtime_hours': random.randint(2, 8)
        }
    
    @api.model
    def get_predictive_analytics(self):
        """Get predictive analytics data"""
        return {
            'production_forecast': self._get_production_forecast(),
            'quality_prediction': self._get_quality_prediction(),
            'inventory_optimization': self._get_inventory_optimization(),
            'maintenance_schedule': self._get_maintenance_schedule(),
            'business_insights': self._get_business_insights()
        }
    
    def _get_production_forecast(self):
        """Get production forecast data"""
        forecast_days = 30
        forecast_data = []
        
        for i in range(forecast_days):
            date = datetime.now() + timedelta(days=i)
            base_production = 20
            seasonal_factor = 1.2 if date.month in [11, 12] else 1.0
            day_factor = 0.8 if date.weekday() >= 5 else 1.0
            random_factor = random.uniform(0.8, 1.3)
            
            production = int(base_production * seasonal_factor * day_factor * random_factor)
            
            forecast_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'predicted_production': production,
                'confidence': random.uniform(0.75, 0.95)
            })
        
        return forecast_data
    
    def _get_quality_prediction(self):
        """Get quality prediction data"""
        return {
            'defect_rate_trend': [random.uniform(1, 5) for _ in range(30)],
            'quality_score_prediction': random.uniform(85, 98),
            'risk_factors': [
                {'factor': 'Température', 'impact': random.uniform(0.1, 0.8)},
                {'factor': 'Humidité', 'impact': random.uniform(0.1, 0.6)},
                {'factor': 'Expérience opérateur', 'impact': random.uniform(0.2, 0.9)},
            ]
        }
    
    def _get_inventory_optimization(self):
        """Get inventory optimization data"""
        return {
            'optimal_levels': {
                'or_18k': {'current': 1250, 'optimal': 1100, 'savings': 150},
                'argent_925': {'current': 3400, 'optimal': 3200, 'savings': 200},
                'diamants': {'current': 156, 'optimal': 180, 'cost': 2400},
            },
            'reorder_alerts': self._generate_reorder_suggestions(),
            'cost_optimization': random.uniform(1000, 5000)
        }
    
    def _get_maintenance_schedule(self):
        """Get maintenance schedule data"""
        equipment = self._analyze_equipment_health()
        schedule = []
        
        for eq in equipment:
            if eq['risk_level'] in ['high', 'medium']:
                schedule.append({
                    'equipment': eq['name'],
                    'scheduled_date': (datetime.now() + timedelta(days=random.randint(1, 14))).strftime('%Y-%m-%d'),
                    'type': 'preventive' if eq['risk_level'] == 'medium' else 'urgent',
                    'estimated_duration': random.randint(2, 8),
                    'cost_estimate': random.uniform(200, 1500)
                })
        
        return schedule
    
    def _get_business_insights(self):
        """Get business insights"""
        return {
            'revenue_forecast': random.uniform(50000, 120000),
            'cost_optimization_potential': random.uniform(5000, 15000),
            'efficiency_improvement': random.uniform(5, 25),
            'market_trends': [
                {'trend': 'Demande bijoux personnalisés', 'impact': '+15%'},
                {'trend': 'Prix de l\'or en hausse', 'impact': '+8%'},
                {'trend': 'Nouvelles réglementations', 'impact': '-3%'},
            ]
        }
