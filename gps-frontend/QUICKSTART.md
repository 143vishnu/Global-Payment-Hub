# GPS Frontend - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd gps-frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```
The application will open at [http://localhost:3000](http://localhost:3000)

### 3. Login Credentials
Use your backend credentials. Default roles:
- **Admin**: Full access
- **OPS_USER**: Operations access
- **BUSINESS_USER**: Reports access

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (not recommended)

## Backend Connection

The frontend expects the backend API at:
- **Development**: `http://localhost:8080`
- **Production**: Configure in `.env.production`

Make sure your Spring Boot backend is running before starting the frontend.

## Key Features to Test

1. **Login** - Navigate to `/login`
2. **Dashboard** - View real-time statistics and charts
3. **Payment Search** - Search and filter payments
4. **Bulk Upload** - Upload CSV files for batch processing
5. **Exception Handling** - Manage failed payments
6. **Reports** - Generate and download reports
7. **Admin** - Configure system settings (Admin only)

## Troubleshooting

### CORS Issues
Ensure your backend has CORS enabled for `http://localhost:3000`

### API Not Connected
1. Verify backend is running on port 8080
2. Check `.env.development` for correct API URL
3. Open browser console for error details

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Production Build

```bash
npm run build
```

Deploy the `build/` folder to your hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Need Help?

Check the main README.md for detailed documentation.
