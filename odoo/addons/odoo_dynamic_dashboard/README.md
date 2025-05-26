# 📊 Odoo Dynamic Dashboard

A modern, interactive dashboard module for Odoo 18 with real-time analytics and beautiful visualizations.

## ✨ Features

### 📈 Multiple Dashboard Types
- **📊 Overview Analytics** - General business overview
- **💰 Sales Analytics** - Sales performance and trends
- **🏭 Production Analytics** - Manufacturing and production metrics
- **📦 Stock Analytics** - Inventory and stock management
- **🔧 Maintenance Analytics** - Equipment maintenance tracking
- **📋 Inventory Analytics** - Detailed inventory analysis
- **🔨 Workshop Analytics** - Workshop operations
- **⚙️ Manufacturing Analytics** - Manufacturing orders and processes

### 🎯 Key Features
- ✅ **Real-time data** from Odoo database
- ✅ **Interactive charts** with Chart.js
- ✅ **Responsive design** for all devices
- ✅ **Auto-refresh** every 30 seconds
- ✅ **Scrollable interface** for large datasets
- ✅ **Modern UI/UX** with beautiful colors
- ✅ **Export capabilities** (charts to PNG)
- ✅ **Demo data creation** for testing

### 📊 Chart Types
- **Line Charts** - Trends and time series
- **Bar Charts** - Comparisons and distributions
- **Doughnut Charts** - Proportions and percentages
- **Radar Charts** - Multi-dimensional analysis

## 🚀 Installation

1. Copy the module to your Odoo addons directory:
```bash
cp -r odoo_dynamic_dashboard /path/to/odoo/addons/
```

2. Update the addons list in Odoo:
```bash
./odoo-bin -u all -d your_database
```

3. Install the module from Apps menu in Odoo interface

## 📱 Usage

1. Go to **📊 Analytics** menu in Odoo
2. Choose your desired dashboard type
3. Click **"Create Demo Data"** if you need sample data
4. Enjoy real-time analytics!

## 🛠️ Technical Details

### Dependencies
- Odoo 18.0+
- Chart.js (loaded via CDN)
- Bootstrap (included in Odoo)

### Architecture
- **Models**: `analytics.dashboard` for data processing
- **Views**: OWL components for modern UI
- **Controllers**: Client-side actions
- **Assets**: CSS/JS for styling and interactions

## 🎨 Customization

The module is designed to be easily customizable:
- Add new dashboard types in `models/dashboard.py`
- Modify chart configurations in JavaScript
- Customize styling in CSS files
- Add new chart types as needed

## 📝 License

AGPL-3 License

## 👨‍💻 Author

Developed for modern Odoo 18 implementations with focus on:
- Performance
- User Experience
- Real-time Analytics
- Beautiful Design

---

**🚀 Ready to transform your Odoo analytics experience!**
