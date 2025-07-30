# 🚗 Vehicle Vault — Vehicle Parking Management System (V2)

**Author**: Mili Parashar  
**Email**: 23f2004291@ds.study.iitm.ac.in  
**Roll Number**: 23f2004291  
**Program**: BS in Data Science, IIT Madras  

---

## 🔍 Project Overview

**Vehicle Vault** is a full-stack, role-based web application for seamless **4-wheeler parking management** across multiple locations. It simplifies parking operations for both **administrators** and **users**, offering real-time spot tracking, reservation workflows, digital receipts, and scheduled reporting.

This solution leverages modern technologies such as **Flask**, **VueJS**, **Celery**, and **Redis**, making it robust, responsive, and scalable for real-world deployment.

---

## 🚀 Key Features

- 🔒 **Role-based Access** (Admin/User)
- 📍 **Live Spot Status** (Available / Occupied)
- 🧾 **Reservation System** with automated receipts
- 💳 **Integrated Payment Handling**
- 📊 **Interactive Dashboards** (Charts & Graphs)
- 📅 **Automated Monthly Reports** (PDF & Excel)
- ⏱️ **Scheduled Background Tasks** via Celery
- ⚡ **Optimized with Caching** (Redis)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | VueJS, Vue Router, Custom CSS |
| **Backend** | Flask, Flask-RESTful, Flask-SQLAlchemy |
| **Auth & Roles** | Flask-Security (Token-based) |
| **Database** | SQLite |
| **Async & Caching** | Celery with Redis |
| **Reports** | ReportLab (PDF), pyexcel/Flask-Excel (Excel) |
| **Charts** | Matplotlib |
| **Email** | smtplib + email.mime (SMTP Integration) |

---

## 🧩 Database Design

### Core Entities

- **User**: Registers, logs in, adds vehicles, makes reservations
- **Role** / **UserRoles**: Role-based Access Control (RBAC)
- **ParkingLot**: Container for multiple parking spots
- **ParkingSpot**: Individual parking units (Available/Occupied)
- **Vehicle**: Linked to user, used for reservations
- **Reservation**: Connects a user’s vehicle to a spot
- **Payment**: Bound to reservation for transaction tracking

---

## 🧱 Architecture Overview

**Pattern**: Model–View–Controller (MVC)

- **Models**: SQLAlchemy entities (`User`, `Reservation`, `Spot`, etc.)
- **Views**: VueJS components with client-side routing
- **Controllers**: Flask-based REST APIs
- **Tasks**: Celery for background processing (e.g., report mailing)
- **Caching**: Redis backend for faster API responses

---

## ⚙️ Getting Started

### 🚧 Backend

```bash
# Set up Python environment
pip install -r requirements.txt

# Run Flask backend
python app.py

# run celery worker
celery -A app:celery_app worker -l INFO

#run celery beat
celery -A app:celery_app beat -l INFO
