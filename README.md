# Global Payment Strategy (GPS/P3)

Enterprise-grade payment processing platform with Spring Boot backend and React frontend.

## ✅ Integration Status

**FULLY INTEGRATED** - Frontend and backend are now connected with complete API integration. All features are working with JWT authentication, role-based access control, and real-time data flow.


## 🏗️ Project Structure
```
Global-Payment-Strategy/
├── Backend/                    # Spring Boot 3.5.10 + Java 17
│   ├── src/
│   │   ├── main/java/         # Java source code
│   │   └── resources/         # Application properties
│   └── pom.xml
│
├── gps-frontend/              # React 18 + Material-UI
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API integration
│   │   ├── context/          # State management
│   │   └── utils/            # Helper functions
│   └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+ and npm
- Oracle Database (configured in application.yml)
- IBM MQ (configured in application.yml)
- Apache Kafka (configured in application.yml)

### Start the Complete Application

**Option 1: One-Click Start (Recommended)**

Simply double-click: **START-ALL.bat**

This will:
1. Start Spring Boot backend on port 8080
2. Install frontend dependencies (if needed)
3. Start React frontend on port 3000
4. Open browser automatically to http://localhost:3000

**Option 2: Using PowerShell Scripts**

Open **TWO** PowerShell terminals:

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Admin\Downloads\Global-Payment-Strategy"
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Admin\Downloads\Global-Payment-Strategy"
.\start-frontend.ps1
```

**Option 3: Manual Start**

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Admin\Downloads\Global-Payment-Strategy\Backend"
.\mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Admin\Downloads\Global-Payment-Strategy\gps-frontend"
npm install --legacy-peer-deps    # First time only
npm start
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080/swagger-ui.html

### Default Login Credentials

| Username  | Password | Role          | Access                                      |
|-----------|----------|---------------|---------------------------------------------|
| admin     | admin    | ADMIN         | Full access (all pages including Admin)     |
| opsuser   | password | OPS_USER      | Operations access (no Admin page)           |
| business  | password | BUSINESS_USER | View-only (Dashboard and Reports only)      |

## 👥 User Roles

- **ADMIN** - Full system access (Dashboard, Payments, Bulk, Exceptions, Reports, Admin)
- **OPS_USER** - Operations access (Dashboard, Payments, Bulk, Exceptions, Reports)
- **BUSINESS_USER** - View-only access (Dashboard, Reports)

## 📋 Features

### Backend (Spring Boot)
- ✅ RESTful API with Spring Web
- ✅ Oracle Database integration
- ✅ IBM MQ messaging
- ✅ Apache Kafka streaming
- ✅ Spring Integration workflows
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Exception handling with retry mechanisms
- ✅ Payment dashboard and search APIs
- ✅ Batch file upload (CSV/Excel)
- ✅ Reports generation (Daily/Audit)
- ✅ Admin configuration management
- ✅ CORS configuration for frontend
- ✅ Database migrations (Flyway)

### Frontend (React)
- ✅ **Login** - JWT authentication with auto-refresh
- ✅ **Dashboard** - Real-time metrics, charts, and payment trends
- ✅ **Payment Search** - Advanced filtering, pagination, and sorting
- ✅ **Payment Details** - Full payment lifecycle, history, and audit trail
- ✅ **Bulk Upload** - CSV/Excel batch processing with job monitoring
- ✅ **Exception Handling** - Failed payment management with retry/cancel/repair
- ✅ **Reports** - Daily and audit reports with CSV/Excel export
- ✅ **Admin Panel** - System configuration, regional rules, thresholds, user management (Admin only)
- ✅ **Role-Based UI** - Dynamic navigation based on user permissions
- ✅ **Material-UI** - Modern, responsive design

## 🛠️ Technology Stack

### Backend
- Spring Boot 3.5.10
- Java 17
- Spring Integration 6.2.0
- Oracle JDBC 21.9.0.0
- IBM MQ 9.3.3.0
- Apache Kafka
- Lombok 1.18.30
- MapStruct 1.5.5

### Frontend
- React 18.2.0
- Material-UI 5.14.20
- React Router 6.20.1
- Axios 1.6.2
- Recharts 2.10.3
- Jest + React Testing Library

## 📝 Environment Configuration

### Backend Configuration Files
- `application.yml` - Main configuration
- `application-dev.yml` - Development profile
- `application-prod.yml` - Production profile
- `application-local.yml` - Local development

### Frontend Environment Files
- `.env.development` - Development (localhost:8080)
- `.env.production` - Production API URL

## 🧪 Testing

### Backend Tests
```powershell
cd Backend
.\mvnw.cmd test
```

### Frontend Tests
```powershell
cd gps-frontend
npm test
```

## 📦 Building for Production

### Backend
```powershell
cd Backend
.\mvnw.cmd clean package
# Output: target/Global-Payment-Strategy-0.0.1-SNAPSHOT.jar
```

### Frontend
```powershell
cd gps-frontend
npm run build
# Output: build/ directory
```

## 🔧 Troubleshooting

### Backend Issues
- **Database Connection:** Check Oracle DB credentials in `application.yml`
- **MQ Connection:** Verify IBM MQ settings in `application.yml`
- **Kafka Connection:** Ensure Kafka broker is running
- **Port 8080 in use:** Change `server.port` in `application.yml`
- **Build fails:** Run `.\mvnw.cmd clean install` to rebuild

### Frontend Issues
- **Dependencies:** Run `npm install --legacy-peer-deps` in gps-frontend directory
- **API Connection:** Verify backend is running on port 8080
- **CORS errors:** Check CorsConfig.java allows http://localhost:3000
- **Port 3000 in use:** Set `PORT=3001` before running `npm start`
- **Build errors:** Delete `node_modules` and `package-lock.json`, then reinstall
- **401 Unauthorized:** Check JWT token in browser localStorage, try logging out and back in

### Integration Issues
- **API calls fail:** Check apiClient.js base URL is `http://localhost:8080`
- **Authentication fails:** Verify JwtAuthenticationFilter is processing tokens
- **Mock data showing:** Backend may be using fallback data if database is empty

## 📚 Documentation

See the following files for detailed documentation:
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - ✅ Complete integration summary and testing guide
- `gps-frontend/README.md` - Frontend features and architecture
- `gps-frontend/QUICKSTART.md` - Quick start guide
- `gps-frontend/IMPLEMENTATION_SUMMARY.md` - Technical implementation details

## 🧪 Testing the Integration

1. **Start both servers** using START-ALL.bat
2. **Wait for backend** to show "Started GlobalPaymentStrategyApplication"
3. **Browser opens** automatically to http://localhost:3000
4. **Login** with `admin` / `admin`
5. **Test each page**:
   - ✅ Dashboard → Should show stats and charts
   - ✅ Payment Search → Should show payments table with filters
   - ✅ Payment Details → Click any payment row to view details
   - ✅ Bulk Upload → Try uploading a CSV file
   - ✅ Exception Handling → Shows failed payments with retry options
   - ✅ Reports → Daily and Audit reports with export
   - ✅ Admin → Config, rules, users (Admin role only)

## 🔐 Security

- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Automatic token refresh mechanism
- ✅ Secure API communication with interceptors
- ✅ Environment-based configuration
- ✅ CORS configured for frontend origin
- ✅ Protected routes based on user roles

## 🔄 Integration Architecture

```
Frontend (React on port 3000)
    ↓
  Axios Request with JWT in Authorization header
    ↓
Backend (Spring Boot on port 8080)
    ↓
JWT Authentication Filter (validates token)
    ↓
REST Controller (PaymentDashboardController, BatchController, etc.)
    ↓
Service Layer (PaymentService, BatchService, etc.)
    ↓
Repository Layer (Spring Data JPA)
    ↓
Database (Oracle) / MQ (IBM MQ) / Kafka
    ↓
Response back to Frontend (JSON)
```

## 📄 License

Proprietary - Internal Banking System

---

**For support, contact the GPS development team.**
