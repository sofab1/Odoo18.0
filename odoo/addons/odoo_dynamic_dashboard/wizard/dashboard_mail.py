# -*- coding: utf-8 -*-
from odoo import models, fields, api, _


class DashboardMailWizard(models.TransientModel):
    _name = 'dashboard.mail.wizard'
    _description = 'Dashboard Mail Wizard'

    dashboard_id = fields.Many2one('dashboard.dashboard', string='Dashboard', required=True)
    partner_ids = fields.Many2many('res.partner', string='Recipients', required=True)
    subject = fields.Char(string='Subject', required=True, default=lambda self: _('Dashboard: %s') % self.env.context.get('dashboard_name', ''))
    body = fields.Html(string='Body', required=True, default=lambda self: self._get_default_body())

    @api.model
    def _get_default_body(self):
        dashboard_name = self.env.context.get('dashboard_name', '')
        return f"""
            <p>Hello,</p>
            <p>I am sharing the dashboard "{dashboard_name}" with you.</p>
            <p>You can access it by clicking on the button below:</p>
            <p><a href="#" class="btn btn-primary">View Dashboard</a></p>
            <p>Best regards,</p>
            <p>{self.env.user.name}</p>
        """

    def action_send_mail(self):
        self.ensure_one()
        
        # Create mail activity for each partner
        for partner in self.partner_ids:
            self.env['mail.activity'].create({
                'activity_type_id': self.env.ref('mail.mail_activity_data_todo').id,
                'note': self.body,
                'res_id': self.dashboard_id.id,
                'res_model_id': self.env['ir.model']._get('dashboard.dashboard').id,
                'user_id': partner.user_ids[0].id if partner.user_ids else self.env.user.id,
                'summary': self.subject,
            })
        
        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _('Success'),
                'message': _('Dashboard shared successfully with %s recipients.') % len(self.partner_ids),
                'sticky': False,
                'type': 'success',
            }
        }

