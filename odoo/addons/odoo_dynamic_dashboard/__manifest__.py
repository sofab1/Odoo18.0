# -*- coding: utf-8 -*-
################################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#    Copyright (C) 2024-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
#    Author: Bhagyadev KP (odoo@cybrosys.com)
#
#    This program is free software: you can modify
#    it under the terms of the GNU Affero General Public License (AGPL) as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
################################################################################
{
    'name': "Advanced Analytics Dashboard",
    'version': '18.0.2.0.0',
    'category': 'Productivity',
    'summary': """Modern Analytics Dashboard with AI Integration""",
    'description': """
        Advanced Analytics Dashboard for Odoo 18

        Features:
        - Modern responsive dashboard interface
        - Real-time analytics for Sales, Production, Stock, Maintenance
        - Interactive charts and KPI widgets
        - AI-powered insights with OpenAI integration
        - Customizable dashboard layouts
        - Export capabilities (PDF, Excel, CSV)
    """,
    'author': 'Cybrosys Techno Solutions',
    'website': "https://www.cybrosys.com",
    'license': "AGPL-3",
    'depends': ['web', 'mail', 'sale', 'stock', 'product'],
    'data': [
        'security/ir.model.access.csv',
        'views/analytics_dashboard_views.xml',
        'views/analytics_actions.xml',
        'views/dashboard_menu_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            # Modern Fonts
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',

            # Chart.js for future charts
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',

            # Our Analytics Dashboard
            'odoo_dynamic_dashboard/static/src/css/analytics_dashboard.css',
            'odoo_dynamic_dashboard/static/src/js/analytics_dashboard.js',
        ],
    },
    'images': ['static/description/banner.jpg'],
    'license': "AGPL-3",
    'installable': True,
    'auto_install': False,
    'application': True,
}