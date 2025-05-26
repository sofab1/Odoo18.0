# -*- coding: utf-8 -*-
"""
Migration script to fix OdooDynamicDashboard action tag references
"""

def migrate(cr, version):
    """
    Update all ir.actions.client records that use the old 'OdooDynamicDashboard' tag
    to use the new 'odoo_dynamic_dashboard.dashboard' tag
    """
    # Update existing client actions with old tag
    cr.execute("""
        UPDATE ir_actions_client 
        SET tag = 'odoo_dynamic_dashboard.dashboard'
        WHERE tag = 'OdooDynamicDashboard'
    """)
    
    # Log the number of updated records
    cr.execute("""
        SELECT COUNT(*) 
        FROM ir_actions_client 
        WHERE tag = 'odoo_dynamic_dashboard.dashboard'
    """)
    count = cr.fetchone()[0]
    
    print(f"Migration completed: Updated {count} client actions to use new tag")
