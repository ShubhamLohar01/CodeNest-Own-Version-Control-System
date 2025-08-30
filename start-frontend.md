# 🚀 Frontend Startup Guide

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd Github-main/frontend-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to `http://localhost:5173`
   - Visit `http://localhost:5173/test` to see the test page

## 🎯 Available Routes

- `/` - Dashboard (requires login)
- `/auth` - Login page
- `/signup` - Signup page
- `/create` - Create repository
- `/profile` - User profile
- `/repo/:id` - View repository
- `/test` - Test page (no login required)

## 🔧 Features Working

✅ **Modern UI/UX** - GitHub-like interface
✅ **Responsive Design** - Works on mobile and desktop
✅ **Navigation** - Working navbar with dropdown
✅ **Authentication** - Login/signup pages
✅ **Repository Management** - Create and view repositories
✅ **File Explorer** - Browse repository files
✅ **Search Functionality** - Search repositories
✅ **Loading States** - Professional loading indicators

## 🎨 Components

- **Dashboard** - Main repository overview
- **Navbar** - Navigation with user menu
- **CreateRepository** - Repository creation form
- **RepositoryView** - Individual repository view
- **Login/Signup** - Authentication pages
- **Profile** - User profile page

## 🚨 Troubleshooting

### If you see a blank page:
1. Check browser console for errors
2. Make sure backend is running on port 3002
3. Visit `/test` route to verify frontend is working

### If styles are missing:
1. Make sure all CSS files are in the correct locations
2. Check that imports are correct
3. Restart the development server

### If API calls fail:
1. Ensure backend is running: `http://localhost:3002`
2. Check network tab in browser dev tools
3. Verify API endpoints are correct

## 📱 Testing

1. **Test the frontend:** Visit `http://localhost:5173/test`
2. **Test authentication:** Visit `http://localhost:5173/auth`
3. **Test dashboard:** Visit `http://localhost:5173/` (after login)

## 🎉 Success!

Your frontend should now be working with:
- Modern GitHub-like interface
- Responsive design
- Working navigation
- Repository management
- File viewing capabilities

The frontend is ready to connect to your existing backend! 