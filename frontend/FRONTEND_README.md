# Driver Drowsiness Detection System - Frontend

A modern React-based web application for real-time driver drowsiness detection using computer vision and machine learning.

## Features

### 📤 Image Upload & Analysis
- Upload images for instant drowsiness detection
- Real-time analysis using the backend API
- Annotated image response showing facial landmarks
- Detailed metrics display (EAR, MAR)

### 📹 Webcam Monitoring
- Live feed monitoring from the backend
- Real-time metric tracking
- Drowsiness and yawning detection alerts
- Visual status indicators

### 📊 Detailed Metrics
- **EAR (Eye Aspect Ratio)**: Measures eye opening levels
  - Threshold: 0.25 (below = drowsy)
- **MAR (Mouth Aspect Ratio)**: Measures mouth opening
  - Threshold: 0.70 (above = yawning)

### 🎨 Modern UI
- Dark theme with gradient design
- Real-time status updates
- Responsive design for all devices
- Visual alerts and notifications

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **CSS3** - Styling with custom properties
- **Fetch API** - Backend communication

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ImageUpload.jsx      # Image upload component
│   │   ├── ImageUpload.css      # Image upload styles
│   │   ├── StatusDisplay.jsx    # Analysis results display
│   │   ├── StatusDisplay.css    # Results styles
│   │   ├── WebcamMonitor.jsx    # Live webcam monitoring
│   │   └── WebcamMonitor.css    # Webcam styles
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # App styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── package.json
├── vite.config.js
└── index.html
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## API Endpoints Expected

### Image Analysis
- **POST** `/analyze`
  - Request: Form data with image file
  - Response: `{ ear, mar, drowsy, yawning, annotated_image }`

### Live Status
- **GET** `/status`
  - Response: `{ ear, mar, drowsy, yawning }`

### Health Check
- **GET** `/health`
  - Response: `{ status: "ok" }`

## Usage

### 1. Upload Image Mode
1. Click "📤 Upload Image" tab
2. Click the upload area or drag-and-drop an image
3. Click "🔍 Analyze Image"
4. View results with annotated image and metrics

### 2. Webcam Monitor Mode
1. Click "📹 Webcam Monitor" tab
2. System automatically fetches live metrics every 500ms
3. View real-time EAR and MAR values
4. Monitor drowsiness and yawning alerts
5. Check overall safety status

## Color Coding

- 🟢 **Green**: Normal/Alert state
- 🔴 **Red**: Drowsy/Warning state
- 🟠 **Orange**: Yawning detected
- 🟡 **Critical**: Both drowsy and yawning

## Performance Tips

- Use modern browsers (Chrome, Firefox, Edge)
- Ensure adequate lighting for webcam analysis
- Close other applications for better performance
- Check console for API connection status

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend

### No metrics updating in webcam view
- Verify backend webcam loop is active
- Check browser console for errors
- Restart both frontend and backend

### Image upload fails
- Ensure image file is valid (PNG, JPG, GIF)
- Check file size is under 10MB
- Verify backend API is responding

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customization

Edit CSS variables in files for theming:
- Primary color: `--primary-color`
- Secondary color: `--secondary-color`
- Danger color: `--danger-color`
- Success color: `--success-color`

## License

This project is part of the Driver Drowsiness Detection System.
