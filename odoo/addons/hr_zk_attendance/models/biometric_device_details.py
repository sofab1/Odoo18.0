# -*- coding: utf-8 -*-
################################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#    Copyright (C) 2025-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
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
import datetime
import logging
import pytz
from odoo import api, fields, models, _
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)
try:
    from zk import ZK, const
except ImportError:
    _logger.error("Please Install pyzk library.")


class BiometricDeviceDetails(models.Model):
    """Model for configuring and connect the biometric device with odoo"""
    _name = 'biometric.device.details'
    _description = 'Biometric Device Details'

    name = fields.Char(string='Name', required=True, help='Record Name')
    device_ip = fields.Char(string='Device IP', required=True,
                            help='The IP address of the Device')
    port_number = fields.Integer(string='Port Number', required=True,
                                 help="The Port Number of the Device")
    address_id = fields.Many2one('res.partner', string='Working Address',
                                 help='Working address of the partner')
    company_id = fields.Many2one('res.company', string='Company',
                                 default=lambda
                                     self: self.env.user.company_id.id,
                                 help='Current Company')

    def device_connect(self, zk):
        """Function for connecting the device with Odoo"""
        try:
            conn = zk.connect()
            return conn
        except Exception:
            return False

    def action_test_connection(self):
        """Checking the connection status"""
        zk = ZK(self.device_ip, port=self.port_number, timeout=30,
                password=False, ommit_ping=False)
        try:
            if zk.connect():
                return {
                    'type': 'ir.actions.client',
                    'tag': 'display_notification',
                    'params': {
                        'message': 'Successfully Connected',
                        'type': 'success',
                        'sticky': False
                    }
                }
        except Exception as error:
            raise ValidationError(f'{error}')

    def action_set_timezone(self):
        """Function to set user's timezone to device"""
        for info in self:
            machine_ip = info.device_ip
            zk_port = info.port_number
            try:
                # Connecting with the device with the ip and port provided
                zk = ZK(machine_ip, port=zk_port, timeout=15,
                        password=0,
                        force_udp=False, ommit_ping=False)
            except NameError:
                raise UserError(
                    _("Pyzk module not Found. Please install it"
                      "with 'pip3 install pyzk'."))
            conn = self.device_connect(zk)
            if conn:
                user_tz = self.env.context.get(
                    'tz') or self.env.user.tz or 'UTC'
                user_timezone_time = pytz.utc.localize(fields.Datetime.now())
                user_timezone_time = user_timezone_time.astimezone(
                    pytz.timezone(user_tz))
                conn.set_time(user_timezone_time)
                return {
                    'type': 'ir.actions.client',
                    'tag': 'display_notification',
                    'params': {
                        'message': 'Successfully Set the Time',
                        'type': 'success',
                        'sticky': False
                    }
                }
            else:
                raise UserError(_(
                    "Please Check the Connection"))

    def action_clear_attendance(self):
        """Methode to clear record from the zk.machine.attendance model and
        from the device"""
        for info in self:
            try:
                machine_ip = info.device_ip
                zk_port = info.port_number
                try:
                    # Connecting with the device
                    zk = ZK(machine_ip, port=zk_port, timeout=30,
                            password=0, force_udp=False, ommit_ping=False)
                except NameError:
                    raise UserError(_(
                        "Please install it with 'pip3 install pyzk'."))
                conn = self.device_connect(zk)
                if conn:
                    conn.enable_device()
                    clear_data = zk.get_attendance()
                    if clear_data:
                        # Clearing data in the device
                        conn.clear_attendance()
                        # Clearing data from attendance log
                        self._cr.execute(
                            """delete from zk_machine_attendance""")
                        conn.disconnect()
                    else:
                        raise UserError(
                            _('Unable to clear Attendance log.Are you sure '
                              'attendance log is not empty.'))
                else:
                    raise UserError(
                        _('Unable to connect to Attendance Device. Please use '
                          'Test Connection button to verify.'))
            except Exception as error:
                raise ValidationError(f'{error}')

    @api.model
    def cron_download(self):
        machines = self.env['biometric.device.details'].search([])
        for machine in machines:
            machine.action_download_attendance()

    def action_download_attendance(self):
        """Function to download attendance records from the device"""
        _logger.info("++++++++++++Cron Executed++++++++++++++++++++++")
        zk_attendance = self.env['zk.machine.attendance']
        hr_attendance = self.env['hr.attendance']
        for info in self:
            machine_ip = info.device_ip
            zk_port = info.port_number
            try:
                # Connecting with the device with the ip and port provided
                zk = ZK(machine_ip, port=zk_port, timeout=15,
                        password=0,
                        force_udp=False, ommit_ping=False)
            except NameError:
                raise UserError(
                    _("Pyzk module not Found. Please install it"
                      "with 'pip3 install pyzk'."))
            conn = self.device_connect(zk)
            self.action_set_timezone()
            if conn:
                conn.disable_device()  # Device Cannot be used during this time.
                user = conn.get_users()
                attendance = conn.get_attendance()
                if attendance:
                    for each in attendance:
                        atten_time = each.timestamp
                        local_tz = pytz.timezone(
                            self.env.user.partner_id.tz or 'GMT')
                        local_dt = local_tz.localize(atten_time, is_dst=None)
                        utc_dt = local_dt.astimezone(pytz.utc)
                        utc_dt = utc_dt.strftime("%Y-%m-%d %H:%M:%S")
                        atten_time = datetime.datetime.strptime(
                            utc_dt, "%Y-%m-%d %H:%M:%S")
                        atten_time = fields.Datetime.to_string(atten_time)
                        for uid in user:
                            if uid.user_id == each.user_id:
                                get_user_id = self.env['hr.employee'].search(
                                    [('device_id_num', '=', each.user_id)])
                                if get_user_id:
                                    duplicate_atten_ids = zk_attendance.search(
                                        [('device_id_num', '=', each.user_id),
                                         ('punching_time', '=', atten_time)])
                                    if not duplicate_atten_ids:
                                        zk_attendance.create({
                                            'employee_id': get_user_id.id,
                                            'device_id_num': each.user_id,
                                            'attendance_type': str(each.status),
                                            'punch_type': str(each.punch),
                                            'punching_time': atten_time,
                                            'address_id': info.address_id.id
                                        })
                                        att_var = hr_attendance.search([(
                                            'employee_id', '=', get_user_id.id),
                                            ('check_out', '=', False)])
                                        if each.punch == 0:  # check-in
                                            if not att_var:
                                                hr_attendance.create({
                                                    'employee_id':
                                                        get_user_id.id,
                                                    'check_in': atten_time
                                                })
                                        if each.punch == 1:  # check-out
                                            if len(att_var) == 1:
                                                att_var.write({
                                                    'check_out': atten_time
                                                })
                                            else:
                                                att_var1 = hr_attendance.search(
                                                    [('employee_id', '=',
                                                      get_user_id.id)])
                                                if att_var1:
                                                    att_var1[-1].write({
                                                        'check_out': atten_time
                                                    })
                                else:
                                    employee = self.env['hr.employee'].create({
                                        'device_id_num': each.user_id,
                                        'name': uid.name
                                    })
                                    zk_attendance.create({
                                        'employee_id': employee.id,
                                        'device_id_num': each.user_id,
                                        'attendance_type': str(each.status),
                                        'punch_type': str(each.punch),
                                        'punching_time': atten_time,
                                        'address_id': info.address_id.id
                                    })
                                    hr_attendance.create({
                                        'employee_id': employee.id,
                                        'check_in': atten_time
                                    })
                    conn.disconnect
                    return True
                else:
                    raise UserError(_('Unable to get the attendance log, please'
                                      'try again later.'))
            else:
                raise UserError(_('Unable to connect, please check the'
                                  'parameters and network connections.'))

    def action_import_employees_and_attendance(self):
        """Function to import all employees and their attendance from the biometric device"""
        _logger.info("++++++++++++Importing Employees and Attendance from Device++++++++++++++++++++++")

        for info in self:
            machine_ip = info.device_ip
            zk_port = info.port_number
            try:
                # Connecting with the device with the ip and port provided
                zk = ZK(machine_ip, port=zk_port, timeout=15,
                        password=0,
                        force_udp=False, ommit_ping=False)
            except NameError:
                raise UserError(
                    _("Pyzk module not Found. Please install it"
                      "with 'pip3 install pyzk'."))

            conn = self.device_connect(zk)
            if conn:
                conn.disable_device()  # Device Cannot be used during this time.

                try:
                    # Get all users from the device
                    users = conn.get_users()
                    _logger.info(f"Found {len(users)} users in the device")

                    # Get attendance data
                    attendance_records = conn.get_attendance()
                    _logger.info(f"Found {len(attendance_records)} attendance records in the device")

                    imported_count = 0
                    updated_count = 0
                    attendance_count = 0

                    # First, import/update employees
                    for user in users:
                        # Check if employee already exists
                        existing_employee = self.env['hr.employee'].search([
                            ('device_id_num', '=', user.user_id)
                        ], limit=1)

                        # Prepare employee data
                        employee_data = {
                            'device_id_num': user.user_id,
                            'name': user.name or f"Employee {user.user_id}",
                        }

                        # Add additional fields if available
                        if hasattr(user, 'card') and user.card:
                            employee_data['identification_id'] = user.card

                        if existing_employee:
                            # Update existing employee
                            existing_employee.write(employee_data)
                            updated_count += 1
                            _logger.info(f"Updated employee: {user.name} (ID: {user.user_id})")
                        else:
                            # Create new employee
                            self.env['hr.employee'].create(employee_data)
                            imported_count += 1
                            _logger.info(f"Created new employee: {user.name} (ID: {user.user_id})")

                    # Then, import attendance data
                    if attendance_records:
                        zk_attendance = self.env['zk.machine.attendance']
                        hr_attendance = self.env['hr.attendance']

                        for each in attendance_records:
                            # Find the employee
                            employee = self.env['hr.employee'].search([
                                ('device_id_num', '=', each.user_id)
                            ], limit=1)

                            if employee:
                                # Convert timestamp
                                atten_time = each.timestamp
                                local_tz = pytz.timezone(
                                    self.env.user.partner_id.tz or 'GMT')
                                local_dt = local_tz.localize(atten_time, is_dst=None)
                                utc_dt = local_dt.astimezone(pytz.utc)
                                utc_dt = utc_dt.strftime("%Y-%m-%d %H:%M:%S")
                                atten_time = datetime.datetime.strptime(
                                    utc_dt, "%Y-%m-%d %H:%M:%S")
                                atten_time = fields.Datetime.to_string(atten_time)

                                # Check for duplicates
                                duplicate_atten_ids = zk_attendance.search([
                                    ('device_id_num', '=', each.user_id),
                                    ('punching_time', '=', atten_time)
                                ])

                                if not duplicate_atten_ids:
                                    # Create ZK attendance record
                                    zk_attendance.create({
                                        'employee_id': employee.id,
                                        'device_id_num': each.user_id,
                                        'attendance_type': str(each.status),
                                        'punch_type': str(each.punch),
                                        'punching_time': atten_time,
                                        'address_id': info.address_id.id
                                    })

                                    # Create HR attendance record
                                    att_var = hr_attendance.search([
                                        ('employee_id', '=', employee.id),
                                        ('check_out', '=', False)
                                    ])

                                    if each.punch == 0:  # check-in
                                        if not att_var:
                                            hr_attendance.create({
                                                'employee_id': employee.id,
                                                'check_in': atten_time
                                            })
                                            attendance_count += 1
                                    elif each.punch == 1:  # check-out
                                        if len(att_var) == 1:
                                            att_var.write({
                                                'check_out': atten_time
                                            })
                                        else:
                                            att_var1 = hr_attendance.search([
                                                ('employee_id', '=', employee.id)
                                            ])
                                            if att_var1:
                                                att_var1[-1].write({
                                                    'check_out': atten_time
                                                })

                    conn.enable_device()
                    conn.disconnect()

                    return {
                        'type': 'ir.actions.client',
                        'tag': 'display_notification',
                        'params': {
                            'message': f'Successfully imported {imported_count} new employees, updated {updated_count} existing employees, and imported {attendance_count} attendance records from the device.',
                            'type': 'success',
                            'sticky': True
                        }
                    }

                except Exception as e:
                    conn.enable_device()
                    conn.disconnect()
                    _logger.error(f"Error importing data: {str(e)}")
                    raise UserError(f"Error importing data: {str(e)}")
            else:
                raise UserError(_('Unable to connect, please check the'
                                  'parameters and network connections.'))

    def action_import_employees(self):
        """Function to import all employees from the biometric device"""
        _logger.info("++++++++++++Importing Employees from Device++++++++++++++++++++++")

        for info in self:
            machine_ip = info.device_ip
            zk_port = info.port_number
            try:
                # Connecting with the device with the ip and port provided
                zk = ZK(machine_ip, port=zk_port, timeout=15,
                        password=0,
                        force_udp=False, ommit_ping=False)
            except NameError:
                raise UserError(
                    _("Pyzk module not Found. Please install it"
                      "with 'pip3 install pyzk'."))

            conn = self.device_connect(zk)
            if conn:
                conn.disable_device()  # Device Cannot be used during this time.

                try:
                    # Get all users from the device
                    users = conn.get_users()
                    _logger.info(f"Found {len(users)} users in the device")

                    imported_count = 0
                    updated_count = 0

                    for user in users:
                        # Check if employee already exists
                        existing_employee = self.env['hr.employee'].search([
                            ('device_id_num', '=', user.user_id)
                        ], limit=1)

                        # Prepare employee data
                        employee_data = {
                            'device_id_num': user.user_id,
                            'name': user.name or f"Employee {user.user_id}",
                        }

                        # Add additional fields if available
                        if hasattr(user, 'card') and user.card:
                            employee_data['identification_id'] = user.card

                        if existing_employee:
                            # Update existing employee
                            existing_employee.write(employee_data)
                            updated_count += 1
                            _logger.info(f"Updated employee: {user.name} (ID: {user.user_id})")
                        else:
                            # Create new employee
                            self.env['hr.employee'].create(employee_data)
                            imported_count += 1
                            _logger.info(f"Created new employee: {user.name} (ID: {user.user_id})")

                    conn.enable_device()
                    conn.disconnect()

                    return {
                        'type': 'ir.actions.client',
                        'tag': 'display_notification',
                        'params': {
                            'message': f'Successfully imported {imported_count} new employees and updated {updated_count} existing employees from the device.',
                            'type': 'success',
                            'sticky': True
                        }
                    }

                except Exception as e:
                    conn.enable_device()
                    conn.disconnect()
                    _logger.error(f"Error importing employees: {str(e)}")
                    raise UserError(f"Error importing employees: {str(e)}")
            else:
                raise UserError(_('Unable to connect, please check the'
                                  'parameters and network connections.'))

    def action_restart_device(self):
        """For restarting the device"""
        zk = ZK(self.device_ip, port=self.port_number, timeout=15,
                password=0,
                force_udp=False, ommit_ping=False)
        self.device_connect(zk).restart()
