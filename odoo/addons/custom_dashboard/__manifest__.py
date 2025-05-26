# -*- coding: utf-8 -*-
{
    'name': 'AI Bijouterie Dashboard Pro',
    'version': '18.0.2.0.0',
    'category': 'Productivity/Dashboard',
    'summary': 'Advanced AI-Powered Interactive Dashboard for Jewelry Manufacturing',
    'description': """
        Advanced AI-Powered Dashboard for Jewelry Manufacturing Management

        🚀 ADVANCED FEATURES:
        ✨ AI-Powered Predictive Analytics
        📊 Real-time Interactive 3D Visualizations
        🎯 Smart Quality Prediction Algorithms
        🔮 Inventory Optimization with Machine Learning
        🎨 Modern Glassmorphism UI Design
        🗣️ Voice Command Integration
        📱 Mobile-First Responsive Design
        🔔 Smart Notifications & Alerts
        🎛️ Drag-and-Drop Dashboard Customization
        📈 Advanced Business Intelligence

        CORE FUNCTIONALITIES:
        - AI-Enhanced Production Forecasting
        - Smart Quality Control with ML Predictions
        - Intelligent Inventory Management
        - Real-time Performance Analytics
        - Advanced Workshop Monitoring
        - Predictive Maintenance Alerts
        - Interactive Data Exploration Tools
    """,
    'depends': ['base', 'web'],
    'data': [
        'data/cleanup_data.xml',
        'security/ir.model.access.csv',
        'views/dashboard_views.xml',
        'views/dashboard_menu.xml',
        'views/ai_dashboard_templates.xml',
        'views/dashboard_home_template.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'custom_dashboard/static/src/js/ai_dashboard_action.js',
            'custom_dashboard/static/src/xml/ai_dashboard_templates.xml',
            'custom_dashboard/static/src/css/ai_dashboard_component.css',
            'custom_dashboard/static/src/bundle/advanced_ai_dashboard.js',
            'custom_dashboard/static/src/bundle/simple_dashboard_template.xml',
            'custom_dashboard/static/src/bundle/advanced_ai_dashboard.css',
            'custom_dashboard/static/src/bundle/ai_dashboard.js',
            'custom_dashboard/static/src/bundle/simple_dashboard.css',
            'custom_dashboard/static/src/css/dashboard.css',
            'custom_dashboard/static/src/js/dashboard.js',
            'custom_dashboard/static/src/js/dashboard_action.js',
            'custom_dashboard/static/src/xml/dashboard_templates.xml',
        ],
    },
    'installable': False,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}



