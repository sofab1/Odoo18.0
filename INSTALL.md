# 🚀 Quick Installation Guide

## Prerequisites

### 1. Install Python 3.8+
- **Windows**: Download from https://python.org
- **Linux**: `sudo apt install python3 python3-pip python3-venv`
- **Mac**: `brew install python3`

### 2. Install PostgreSQL
- **Windows**: Download from https://postgresql.org
- **Linux**: `sudo apt install postgresql postgresql-contrib`
- **Mac**: `brew install postgresql`

### 3. Install Git
- **Windows**: Download from https://git-scm.com
- **Linux**: `sudo apt install git`
- **Mac**: `brew install git`

## 🔧 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/sofab1/Odoo18.0.git
cd Odoo18.0
```

### 2. Setup Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Database
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create user and database
CREATE USER odoo18 WITH CREATEDB PASSWORD 'odoo18';
CREATE DATABASE odoo18_db OWNER odoo18;
\q
```

### 5. Configure Odoo
Edit `odoo.conf`:
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

### 6. Start Odoo
```bash
# Windows
start_odoo.bat

# Linux/Mac
chmod +x start_odoo.sh
./start_odoo.sh
```

### 7. Access Application
- Open browser: http://localhost:8069
- Database: odoo18_db
- Master Password: admin
- Login: admin / admin

## 🎯 Quick Test

1. Go to **📊 Analytics** menu
2. Click **📈 Dashboard Overview**
3. Click **"Create Demo Data"**
4. Enjoy your dynamic dashboards!

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Create an issue on GitHub
- Check troubleshooting section in README

---

**🎉 You're ready to use Odoo 18 Dynamic Dashboards!**
