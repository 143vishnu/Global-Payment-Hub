# GPS Frontend - Global Payment Hub

A production-ready React frontend application for the Global Payment Hub (GPS) platform, built with React 18, Material-UI, and designed for enterprise-scale payment processing across 150+ countries.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with automatic token refresh
- Role-based access control (Admin, Ops User, Business User)
- Secure token storage and session management
- Demo credentials displayed on login page for testing

### 📊 Dashboard
- Real-time payment statistics and metrics
- Interactive charts (Regional Distribution, Status Charts, Payment Trends)
- Auto-refresh every 30 seconds
- Responsive cards with payment summaries
- Mock data support for development without backend

### 💳 Payment Management
- Advanced search with multiple filters (ID, date range, region, status, amount range)
- Detailed payment view with complete lifecycle history
- Pagination and sorting capabilities
- Audit trail tracking
- 50+ mock payment records for testing

### 📦 Bulk Processing
- CSV/Excel file upload for batch payments (max 10MB)
- Real-time job status monitoring
- Batch job list with progress tracking
- Retry failed records functionality
- Download processing reports
- File validation and error handling

### ⚠️ Exception Handling
- Failed payment management with detailed error messages
- Retry, cancel, and repair actions
- Role-based permissions for actions
- 25+ mock failed payment records
- Repair dialog with correction notes

### 📈 Reports & Analytics
- Daily and audit reports generation
- Export to CSV/Excel with mock data support
- Date range filtering
- Regional and payment type breakdowns
- Customizable report parameters

### ⚙️ Admin Configuration
- System configuration management (retry attempts, delays, batch size)
- Threshold adjustments for multiple metrics
- Regional rules configuration (North America, Europe, Asia Pacific, etc.)
- User role management
- Mock data for all configuration endpoints

### 🔧 Advanced Features
- **Config Versioning** - Version control for configuration changes with rollback capability
- **Landing Page** - Professional marketing page with platform overview
- **Theme Support** - Custom purple gradient theme with Material-UI
- **Comprehensive Mock Data** - Full offline functionality for development and demos

## 📁 Project Structure

```
gps-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── DataTable.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── ErrorMessage.js
│   │   │   ├── StatCard.js
│   │   │   ├── StatusChip.js
│   │   │   ├── CustomModal.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── PageNotFound.js
│   │   │   └── Unauthorized.js
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── RegionalDistribution.jsx
│   │   │   ├── PaymentStatusChart.jsx
│   │   │   └── PaymentTrend.jsx
│   │   ├── payments/        # Payment components
│   │   │   └── PaymentSearchFilters.jsx
│   │   ├── bulk/            # Bulk payment components
│   │   │   ├── BulkUpload.jsx
│   │   │   └── BatchJobList.jsx
│   │   └── layout/          # Layout components
│   │       └── Layout.jsx
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PaymentSearchPage.jsx
│   │   ├── PaymentDetailsPage.jsx
│   │   ├── BulkPaymentPage.jsx
│   │   ├── ExceptionPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── AdminPage.jsx
│   │   ├── ConfigVersioningPage.jsx
│   │   └── [20+ additional feature pages]
│   ├── services/            # API services
│   │   ├── apiClient.js     # Centralized HTTP client
│   │   ├── authService.js   # Authentication
│   │   ├── paymentService.js # Payment operations with mock data
│   │   ├── batchService.js  # Bulk processing with mock data
│   │   ├── reportService.js # Reports with mock CSV/Excel generation
│   │   └── adminService.js  # Admin config with mock data
│   ├── context/             # React Context
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── PaymentContext.jsx # Payment state
│   │   ├── BatchContext.jsx # Batch processing state
│   │   └── ThemeContext.jsx # Theme management
│   ├── routes/              # Routing
│   │   └── AppRoutes.js
│   ├── utils/               # Utilities
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── __tests__/           # Test files
│   │   ├── LoginPage.test.js
│   │   ├── StatCard.test.js
│   │   ├── paymentService.test.js
│   │   └── helpers.test.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   └── setupTests.js
├── .env.development
├── .env.production
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Material-UI v5** - Component library
- **React Router v6** - Navigation
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization
- **React Context** - State management
- **Jest & React Testing Library** - Testing

## 🎯 Mock Data Support

The application includes comprehensive mock data generation for all services, enabling:
- **Full offline development** - Work without a backend server
- **Demo mode** - Showcase features without backend deployment
- **Testing** - Reliable data for automated tests
- **Quick prototyping** - Test features rapidly

Mock data is automatically used when the backend is unavailable, with console warnings for debugging.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080` (optional - mock data available)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd gps-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Development: `.env.development` (already configured for localhost:8080)
   - Production: `.env.production` (configure your production API URL)

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Login** - POST `/auth/login` with username/password
2. **Token Storage** - JWT stored in localStorage
3. **Auto Refresh** - Automatic token refresh on 401 errors
4. **Logout** - Clears tokens and redirects to login

### Demo Credentials

The following test accounts are available (displayed on the login page):

- **Admin**: `admin` / `admin123`
  - Full system access including configuration management
- **Ops User**: `user` / `user123`
  - Payment operations, bulk processing, exception handling
- **Business User**: `business` / `business123`
  - Dashboard and reports access only

### Default User Roles

- **ADMIN** - Full access to all features including admin configuration
- **OPS_USER** - Access to dashboard, payments, bulk, exceptions, and reports
- **BUSINESS_USER** - Access to dashboard and reports only

## 🌐 API Integration

All API calls go through the centralized `apiClient.js` which handles:

- Base URL configuration from environment
- JWT token injection
- Automatic token refresh
- Global error handling
- Request/response interceptors

## 📊 Features by Role

| Feature | Admin | Ops User | Business User |
|---------|-------|----------|---------------|
| Dashboard | ✅ | ✅ | ✅ |
| Payment Search | ✅ | ✅ | ❌ |
| Payment Details | ✅ | ✅ | ❌ |
| Bulk Payment | ✅ | ✅ | ❌ |
| Exception Handling | ✅ | ✅ (read-only) | ❌ |
| Reports & Analytics | ✅ | ✅ | ✅ |
| Admin Configuration | ✅ | ❌ | ❌ |
| Config Versioning | ✅ | ✅ | ❌ |

## 🎨 Theming

The application uses Material-UI's theming system with a professional blue-teal gradient theme:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a', // Deep blue
    },
    secondary: {
      main: '#0d9488', // Teal
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

Custom theme colors are used throughout for:
- Navigation gradients
- Card highlights
- Status indicators
- Interactive elements

## 📱 Responsive Design

- Mobile-first approach
- Responsive drawer navigation
- Adaptive table layouts
- Touch-friendly controls

## 🔧 Development Tips

1. **Mock Data** - All services have mock data fallbacks when backend is unavailable
2. **Hot Reload** - Changes automatically refresh in browser
3. **Error Handling** - All API errors are caught and displayed with user-friendly messages
4. **Loading States** - Every async operation shows loading indicators and progress
5. **Console Warnings** - Mock data usage is logged to console for debugging
6. **File Validation** - CSV/Excel uploads validate file type and size (10MB max)
7. **Responsive Testing** - Test on mobile devices with Chrome DevTools

## 📦 Key Components

### DataTable
- Sortable columns
- Pagination support
- Row click actions
- Empty state handling
- Loading indicators

### StatusChip
- Color-coded status display
- Supports: SUCCESS, PENDING, FAILED, PROCESSING, COMPLETED, REJECTED, CANCELLED

### LoadingSpinner
- Customizable loading messages
- Consistent UX across the app

### ErrorMessage
- Dismissible error alerts
- Auto-generated from API responses

## 🚀 Deployment

### Deploy to Production

1. Update `.env.production` with your API URL
2. Build the application: `npm run build`
3. Deploy the `build/` folder to your hosting service (Netlify, Vercel, AWS S3, etc.)

### Environment Variables

- `REACT_APP_API_URL` - Backend API base URL
- `REACT_APP_ENV` - Environment name (development/production)

## 🐛 Troubleshooting

**Issue: CORS errors**
- Ensure backend CORS configuration allows your frontend origin
- Check browser console for specific CORS policy violations

**Issue: 401 Unauthorized**
- Check if JWT token is valid in localStorage
- Verify backend authentication endpoint is accessible
- Try logging out and logging back in

**Issue: Charts not rendering**
- Ensure recharts is installed: `npm install recharts`
- Check browser console for any component errors

**Issue: Blank pages or "Nothing there"**
- Mock data fallbacks should automatically work
- Check browser console for service errors
- Verify the route exists in AppRoutes.jsx

**Issue: File upload not working**
- Verify file is CSV or Excel format
- Check file size is under 10MB
- Look for validation errors in console

**Issue: Mock data not appearing**
- Check console for "Backend not available" warnings
- Verify service files have mock data generators
- Try refreshing the page

## 🌟 Key Features Highlights

- **25+ Pages**: Comprehensive feature set including dashboard, payments, bulk processing, exceptions, reports, admin, and many specialized pages
- **50+ Mock Payments**: Realistic test data for payment search
- **25+ Failed Payments**: Exception handling demo data
- **10 Batch Jobs**: Bulk processing examples
- **4 User Roles**: Admin, Ops User, Business User with different permissions
- **5 Regions**: North America, Europe, Asia Pacific, Latin America, Middle East
- **Multiple Payment Types**: WIRE, ACH, SEPA, SWIFT, INSTANT
- **8+ Currencies**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY
- **Professional Landing Page**: Marketing page with platform overview and features
- **Config Versioning**: Version control with rollback capability
- **CSV/Excel Export**: Download reports with mock data generation

## 📄 License

© 2026 Global Payment Hub. All rights reserved.

## 👥 Support

For issues and questions, contact the development team.

---

**Built with ❤️ for Global Payment Hub**
