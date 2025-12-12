# Frontend Configuration Guide

## API Configuration

The frontend communicates with the backend API. The default endpoint is configured as:

```
http://localhost:8000
```

### Changing API Endpoint

To use a different backend URL, update the fetch URLs in these files:

#### In `src/App.jsx` (Webcam status endpoint):
```javascript
const response = await fetch('http://localhost:8000/status')
```

#### In `src/components/ImageUpload.jsx` (Analysis endpoint):
```javascript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  body: formData,
})
```

### Environment Variables (Optional)

Create a `.env` file in the frontend root:

```
VITE_API_URL=http://localhost:8000
```

Then update components to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const response = await fetch(`${API_URL}/analyze`, {...})
```

## CORS Configuration

If you encounter CORS errors, ensure your backend has CORS enabled:

**Backend (FastAPI):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Development Configuration

### Vite Config
File: `vite.config.js`

Current configuration optimizes for React development. Adjust if needed:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## Performance Settings

### Polling Interval
In `src/App.jsx`, adjust webcam status update frequency:

```javascript
statusIntervalRef.current = setInterval(async () => {
  // Currently 500ms
}, 500)
```

Lower values = faster updates but more API calls
Higher values = fewer API calls but slower response

### Image Upload Settings
In `src/components/ImageUpload.jsx`:

- Max file size: Currently limited by HTML input
- Accepted formats: image/* (modify in ImageUpload.jsx line 25)

## Styling Customization

### Theme Colors
Edit CSS variables in `src/App.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --danger-color: #f56565;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --bg-color: #0f172a;
  --card-bg: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border-color: #334155;
}
```

### Responsive Breakpoints
Current breakpoints in CSS files:
- Mobile: `max-width: 600px`
- Tablet: `max-width: 768px`

Adjust in respective CSS files as needed.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Server

### Start Dev Server
```bash
npm run dev
```

Runs on `http://localhost:5173` by default

### Build Optimizations

```bash
npm run build
```

Produces optimized production build in `dist/` directory

## Dependencies

### Core Dependencies
- `react` - UI framework
- `react-dom` - DOM rendering

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React support for Vite
- `eslint` - Code linting

## Troubleshooting Configuration

### Hot Module Replacement (HMR) Not Working
Add to `vite.config.js`:
```javascript
server: {
  hmr: {
    protocol: 'ws',
    host: 'localhost',
    port: 5173,
  }
}
```

### Port Already in Use
Change port in `vite.config.js`:
```javascript
server: {
  port: 3000  // or any available port
}
```

### Module Resolution Issues
Clear node_modules and reinstall:
```bash
rm -r node_modules
npm install
```

## Testing Configuration

Currently no testing framework configured. To add:

```bash
npm install --save-dev vitest @testing-library/react
```

Create `vitest.config.js` and update `package.json` scripts.

## Production Deployment

### Build
```bash
npm run build
```

### Serve Static Files
The `dist/` folder contains production-ready files.

### Environment Setup
Update API endpoint for production before building:
```javascript
// In source files or use environment variables
const API_URL = 'https://your-api-domain.com'
```

Then rebuild with `npm run build`.

## Monitoring and Logging

Current console logging available for debugging:

- Check browser DevTools Console for API errors
- Network tab shows all API requests
- Component state updates logged with React DevTools

For production, consider adding error tracking service (e.g., Sentry).
