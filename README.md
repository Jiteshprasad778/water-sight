# Watersight 🌊🛰️

> **Geospatial platform for visualization, automated AI validation, and multi-temporal remote sensing analysis of watershed development projects.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://water-sight.onrender.com/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostGIS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![AI Engine](https://img.shields.io/badge/AI%20Inference-ONNX%20Runtime-005CED?style=for-the-badge&logo=onnx)](https://onnxruntime.ai/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev/)

🔗 **Live Application URL**: [https://water-sight.onrender.com/](https://water-sight.onrender.com/)

---

## 📌 Problem Statement & Objective

Monitoring watershed development projects across India (under schemes such as **WDC-PMKSY**) requires tracking vast geographic areas, verifying ground interventions, and validating physical field progress. 

**Watersight** solves this challenge through a multi-tier monitoring approach:
1. **Automated AI Evidence Screening**: Real-time validation of geotagged field photos using lightweight edge AI (ONNX Runtime) to reject invalid or spoofed submissions before database ingestion.
2. **Official Administrative & Watershed Project Mapping**: Real-time integration of 35 States, 722 Districts, and 1,138 Watershed projects from official government records (Bhuvan/NRSC & WDC-PMKSY).
3. **Multi-Temporal Satellite Analysis**: STAC-based Sentinel-2 multispectral satellite imagery fetching to calculate vegetative health (**NDVI**) and surface water persistence (**NDWI**).
4. **Pre/Post Change Detection**: Spatial delta analysis comparing baseline and comparison scenes to quantify watershed intervention impact over time.
5. **Disaster & Weather Early Warning**: Live integration with NDMA SACHET for real-time district-level disaster alerts.

---

## 🏛️ Project Architecture & Modular Separation

The codebase follows the industry-standard decoupled architecture separating client presentation (`frontend/`) from server logic, spatial algorithms, and AI computation (`backend/`).

```
water-sight/
│
├── backend/                       # Flask REST API, GIS processing & AI inference
│   ├── app.py                     # Main Flask application entry point
│   ├── models.py                  # SQLAlchemy models (PostGIS/Supabase + SQLite fallback)
│   ├── alerts_service.py          # NDMA live weather and disaster alerts
│   ├── analysis_service.py        # Sentinel-2 STAC search & NDVI/NDWI computation
│   ├── change_analysis_service.py # Pre/Post watershed change detection
│   ├── projects_service.py        # Administrative & WDC-PMKSY official data API
│   ├── satellite_service.py       # Microsoft Planetary Computer STAC client
│   ├── cdse_client.py             # Copernicus Data Space Ecosystem API client
│   ├── exif_utils.py              # Photo EXIF metadata & GPS coordinate extractor
│   ├── mobilenet_v3_small.onnx    # Lightweight AI validation model (ONNX Runtime, 10MB)
│   ├── imagenet_classes.txt       # Model class labels
│   ├── requirements.txt           # Python dependencies (gunicorn, onnxruntime, psycopg2, etc.)
│   ├── Procfile                   # Web process definition (`web: gunicorn app:app`)
│   ├── data/                      # Cached datasets and sample evidence
│   ├── scripts/                   # Data ingestion and administrative refresh utilities
│   ├── static/                    # Generated GeoTIFFs, satellite previews, and uploads
│   └── templates/                 # Backend HTML templates & full-stack mount point
│
├── frontend/                      # Modern React single-page application (SPA)
│   ├── src/                       # React components, pages, hooks, Leaflet maps, Tailwind
│   ├── public/                    # Public assets, GeoJSON layers, and icons
│   ├── index.html                 # Vite HTML entry point
│   ├── vite.config.js             # Vite config with local `/api` reverse proxy to port 5000
│   ├── package.json               # Frontend dependencies (React, Leaflet, Chart.js)
│   └── vercel.json                # Vercel SPA routing rewrites to live backend
│
├── docs/                          # Technical specifications and analysis pipeline docs
├── render.yaml                    # Render Blueprint infrastructure-as-code configuration
├── .gitignore                     # Production ignore rules for Python and Node
└── README.md                      # Comprehensive project documentation
```

---

## 🧠 AI Verification & Edge Optimization

- **Model Engine**: ONNX Runtime (`mobilenet_v3_small.onnx`, 10.1 MB).
- **Optimization Rationale**: Replaced heavy deep learning runtimes (PyTorch ~800MB download, ~350MB RAM idle) with ONNX Runtime (~15MB package, ~25MB RAM footprint).
- **Latency**: **~15–25 ms** inference time on standard CPU.
- **Validation Rule**: Automatically screens uploaded field photos to reject fake submissions (screenshots, UI mockups, irrelevant objects) before accepting geotagged evidence.

---

## 🗄️ Database & Spatial Cloud Storage

- **Database**: Cloud PostgreSQL hosted on **Supabase** with **PostGIS** spatial extension.
- **Object Storage**: Supabase Storage bucket (`evidence`) with global CDN asset delivery.
- **Ingested Data**: Pre-seeded with **35 States**, **722 Districts**, and **1,138 Watershed projects** from official records.

---

## 🚀 Local Development Setup

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

## ☁️ Deployment Specifications

### Render (Live Backend + Full-Stack Host)
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
- **Live URL**: [https://water-sight.onrender.com/](https://water-sight.onrender.com/)

### Vercel (Frontend SPA)
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **API Routing**: Configured via `frontend/vercel.json` rewrite proxying `/api/*` to `https://water-sight.onrender.com/api/:match*`
