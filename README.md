# 🚀 Odoo 18.0 with Dynamic Dashboard

A complete Odoo 18.0 installation with custom dynamic dashboard modules for advanced business analytics and real-time data visualization.

## 📊 Features

### 🎯 **Dynamic Dashboard Module**
- **8 Different Dashboard Types**: Overview, Sales, Production, Stock, Maintenance, Inventory, Workshop, Manufacturing
- **Real-time Analytics**: Live data from Odoo database with auto-refresh every 30 seconds
- **Interactive Charts**: Line, Bar, Doughnut, and Radar charts powered by Chart.js
- **Responsive Design**: Mobile-friendly interface with scrollable content
- **Export Capabilities**: Export charts as PNG images
- **Demo Data Creation**: Built-in demo data generator for testing

### 🏭 **Included Modules**
- **odoo_dynamic_dashboard**: Main analytics dashboard with 8 dashboard types
- **custom_dashboard**: Additional custom dashboard functionality
- **hr_zk_attendance**: Biometric attendance management system

### 🎨 **Modern UI/UX**
- Beautiful color schemes compatible with Odoo's design
- Compact KPI widgets with automatic sizing
- Smooth scrolling interface
- Modern card-based layout
- Professional dashboard design

## 🛠️ Installation

### Prerequisites
- Python 3.8+ 
- PostgreSQL 12+
- Git
- Node.js (for assets compilation)

### 1. Clone the Repository
```bash
git clone https://github.com/sofab1/Odoo18.0.git
cd Odoo18.0
```

### 2. Create Virtual Environment
```bash
# On Linux/Mac
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r odoo/requirements.txt
```

### 4. Install Additional Python Packages
```bash
pip install psycopg2-binary
pip install pillow
pip install reportlab
pip install qrcode
pip install python-dateutil
```

### 5. Setup PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE USER odoo18 WITH CREATEDB PASSWORD 'odoo18';
CREATE DATABASE odoo18_db OWNER odoo18;
```

### 6. Configure Odoo
Edit `odoo.conf` file:
```ini
[options]
addons_path = odoo/addons,odoo/odoo/addons
admin_passwd = admin
db_host = localhost
db_port = 5432
db_user = odoo18
db_password = odoo18
db_name = odoo18_db
```

## 🚀 Running the Project

### Start Odoo Server
```bash
# From the Odoo18.0 directory
python odoo/odoo-bin -c odoo.conf
```

### Access the Application
- **URL**: http://localhost:8069
- **Database**: odoo18_db
- **Master Password**: admin
- **Default Login**: admin / admin

## 📊 Using Dynamic Dashboards

### 1. Access Analytics Menu
Navigate to **📊 Analytics** in the main menu

### 2. Available Dashboards
- **📈 Dashboard Overview**: General business overview
- **💰 Sales Analytics**: Sales performance and trends  
- **🏭 Production Analytics**: Manufacturing metrics
- **📦 Stock Analytics**: Inventory management
- **🔧 Maintenance Analytics**: Equipment maintenance
- **📋 Inventory Analytics**: Detailed inventory analysis
- **🔨 Workshop Analytics**: Workshop operations
- **⚙️ Manufacturing Analytics**: Manufacturing orders

### 3. Create Demo Data
Click **"Create Demo Data"** button in any dashboard to generate sample data for testing

### 4. Features
- **Auto-refresh**: Dashboards update every 30 seconds
- **Real-time KPIs**: Live metrics from database
- **Interactive Charts**: Hover for details, click for interactions
- **Export**: Right-click charts to save as PNG
- **Responsive**: Works on desktop, tablet, and mobile

## 🔧 Development

### Project Structure
```
Odoo18.0/
├── odoo.conf                     # Odoo configuration
├── odoo/                         # Odoo core
│   ├── odoo/                     # Core framework
│   └── addons/                   # Standard addons
└── odoo/addons/                  # Custom addons
    ├── odoo_dynamic_dashboard/   # Main dashboard module
    ├── custom_dashboard/         # Custom dashboard features
    └── hr_zk_attendance/         # Attendance management
```

### Adding New Dashboard Types
1. Edit `odoo/addons/odoo_dynamic_dashboard/models/dashboard.py`
2. Add new dashboard method following existing patterns
3. Update menu in `views/analytics_actions.xml`
4. Restart Odoo and update the module

### Customizing Charts
1. Modify chart configurations in `static/src/js/analytics_dashboard.js`
2. Add new chart types by extending Chart.js integration
3. Update CSS in `static/src/css/analytics_dashboard.css`

## 🐛 Troubleshooting

### Common Issues

**1. Module not found error**
```bash
# Update module list
python odoo/odoo-bin -c odoo.conf -u all -d odoo18_db
```

**2. Chart.js errors**
- Ensure internet connection for CDN
- Check browser console for JavaScript errors
- Verify Chart.js version compatibility

**3. Database connection issues**
- Verify PostgreSQL is running
- Check database credentials in odoo.conf
- Ensure database exists and user has permissions

**4. Permission errors**
- Check file permissions on Odoo directory
- Ensure virtual environment is activated
- Run with appropriate user permissions

### Logs
Check Odoo logs for detailed error information:
```bash
tail -f ~/.local/share/Odoo/odoo.log
```

## 📝 License

This project is licensed under AGPL-3 License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check Odoo documentation: https://www.odoo.com/documentation/18.0/
- Community forum: https://www.odoo.com/forum/

## 🎯 Roadmap

- [ ] AI-powered analytics with OpenAI integration
- [ ] Advanced export formats (Excel, PDF reports)
- [ ] Custom dashboard builder interface
- [ ] Real-time notifications and alerts
- [ ] Mobile app integration
- [ ] Advanced filtering and date ranges
- [ ] Multi-company dashboard support

---

**🚀 Ready to transform your business analytics with Odoo 18 Dynamic Dashboards!**
