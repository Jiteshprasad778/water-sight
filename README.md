# Watersight 🌊🛰️

> Geospatial platform for visualization, automated AI validation, and multi-temporal remote sensing analysis of watershed development projects.

---

## 🏛️ Project Architecture

```
water-sight/
├── backend/                  # Flask REST API, GIS processing & AI inference
│   ├── app.py                # Main Flask application entry point
│   ├── models.py             # SQLAlchemy models (PostGIS/Supabase + SQLite fallback)
│   ├── alerts_service.py     # NDMA live weather and disaster alerts
│   ├── analysis_service.py   # Sentinel-2 STAC search & NDVI/NDWI computation
│   ├── change_analysis_service.py # Pre/Post watershed change detection
│   ├── projects_service.py   # Administrative & WDC-PMKSY official data API
│   ├── satellite_service.py  # Microsoft Planetary Computer STAC client
│   ├── cdse_client.py        # Copernicus Data Space Ecosystem API client
│   ├── exif_utils.py         # Image EXIF metadata & GPS coordinate extractor
│   ├── mobilenet_v3_small.onnx # Lightweight AI validation model (ONNX Runtime, 10MB)
│   ├── imagenet_classes.txt  # Model class labels
│   ├── requirements.txt      # Python dependencies (gunicorn, onnxruntime, psycopg2, etc.)
│   ├── Procfile              # Render web process definition (`web: gunicorn app:app`)
│   ├── data/                 # Cached datasets and sample evidence
│   ├── scripts/              # Data ingestion and administrative refresh utilities
│   ├── static/               # Generated GeoTIFFs, satellite previews, and uploads
│   └── templates/            # Backend HTML templates
│
├── frontend/                 # Modern React single-page application (SPA)
│   ├── src/                  # React components, pages, hooks, Leaflet maps, Tailwind
│   ├── public/               # Public assets and icons
│   ├── index.html            # Vite HTML entry point
│   ├── vite.config.js        # Vite config with local `/api` reverse proxy to port 5000
│   ├── package.json          # Frontend dependencies (React, Leaflet, Chart.js)
│   └── vercel.json           # Vercel SPA routing rewrites
│
├── docs/                     # Technical specifications and analysis pipeline docs
├── render.yaml               # Render Blueprint infrastructure-as-code configuration
├── .gitignore                # Comprehensive ignore file for Python and Node
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup (Flask API)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL, Google OAuth, and Secret Key

# Start the Flask API server (runs on http://127.0.0.1:5000)
python app.py
```

### 2. Frontend Setup (React + Vite)

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173 with proxy to backend :5000)
npm run dev
```

---

## ☁️ Deployment Guide

### Deploy Backend to Render

1. Connect your repository (`water-sight`) to **Render**.
2. Create a new **Web Service**:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
3. Add Environment Variables in Render Dashboard:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string (Transaction pooler on port 5432 or 6543)
   - `SECRET_KEY`: A secure random string
   - `SUPABASE_URL`: `https://<project-id>.supabase.co`
   - `SUPABASE_KEY`: Supabase service role key
   - `SUPABASE_BUCKET`: `evidence`
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `FLASK_ENV`: `production`

*(Alternatively, use `render.yaml` with Render Blueprints for one-click deployment).*

### Deploy Frontend to Vercel

1. Import your repository into **Vercel**.
2. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In `frontend/vercel.json`, update the backend destination URL to your live Render backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:match*",
         "destination": "https://YOUR-RENDER-BACKEND.onrender.com/api/:match*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
4. Deploy!

---

## 🧠 AI Verification & Optimization

- **Model Engine**: ONNX Runtime (`mobilenet_v3_small.onnx`, 10.1 MB).
- **RAM Footprint**: ~25 MB (reduced from ~350 MB PyTorch footprint).
- **Latency**: ~15–25 ms inference time on standard CPU.
- **Validation**: Automatically screens uploaded field photos to reject fake submissions (screenshots, UI mockups, irrelevant objects) before accepting geotagged evidence.

---

## 🗄️ Database & Cloud Storage

- **Database**: Supabase PostgreSQL with PostGIS spatial extension enabled.
- **Object Storage**: Supabase Storage (`evidence` bucket with public CDN delivery).
- **Administrative Data**: Pre-seeded with 35 States, 722 Districts, and 1,138 Watershed projects from official WDC-PMKSY records.
