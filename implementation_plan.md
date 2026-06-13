# Implementation Plan: Enterprise AI-Powered Jersey Customizer SaaS

This plan details the pivot to a Next.js (TypeScript) frontend, FastAPI (Python) backend, Supabase database/storage, and Fal AI integrations for high-fidelity customizer actions.

## User Review Required

> [!IMPORTANT]
> **Architectural Transition:** This changes the repository tech stack. The existing Node.js Express server in `/backend` will be replaced with a Python FastAPI server. The React/Vite frontend in `/frontend` will be migrated to Next.js 14 App Router (TypeScript).

> [!WARNING]
> **API Credentials:** You must supply the following keys in the updated `.env` configurations:
> * `FAL_KEY`: API Key for Fal AI hosted FLUX inpainting/image-to-image endpoints.
> * `OCR_SPACE_API_KEY`: API Key for OCR.Space OCR API.

## Open Questions

> [!NOTE]
> **Supabase Auth vs Existing Auth:** We will transition all authentication routes from the current Express custom JWT setup to native Supabase Auth on the frontend. Please verify if you have Supabase Auth providers enabled in your console.

---

## Proposed Changes

### 1. Backend Service Layer (FastAPI Python)
Create service classes under `/backend/app/services` utilizing abstraction interfaces.

#### [NEW] [base.py](file:///d:/MiniProjects/bhondu/backend/app/services/base.py)
Defines abstract base interfaces (`ABC`) for all service layers (dependency injection).

#### [NEW] [object_detection.py](file:///d:/MiniProjects/bhondu/backend/app/services/object_detection.py)
Integrates hosted vision APIs (Fal AI or similar SAM/Grounding DINO hosted endpoint) to find zones, sleeves, collar, names, and logos.

#### [NEW] [ocr.py](file:///d:/MiniProjects/bhondu/backend/app/services/ocr.py)
Interfaces with OCR.Space API to extract text content, baseline skews, and bounding boxes.

#### [NEW] [inpainting.py](file:///d:/MiniProjects/bhondu/backend/app/services/inpainting.py)
Integrates Fal AI hosted FLUX Inpainting API. Uses coordinates from `object_detection` and `ocr` to reconstruct jersey fabric textures underneath text and logos.

#### [NEW] [color_replacement.py](file:///d:/MiniProjects/bhondu/backend/app/services/color_replacement.py)
Uses OpenCV/Shader overlays to dynamically map replacement colors over fabric creases.

#### [NEW] [export.py](file:///d:/MiniProjects/bhondu/backend/app/services/export.py)
Converts layered canvas JSON layouts into high-res (300 DPI) print-ready vectors and PDFs.

---

### 2. Frontend Customizer Workspace (Next.js TypeScript)
Create a drag-and-drop workspace at `/frontend/src/app/designer/[productId]/page.tsx` using Fabric.js.

#### [NEW] [page.tsx](file:///d:/MiniProjects/bhondu/frontend/src/app/designer/[productId]/page.tsx)
The parent page that handles layout grid, sidebar selection, and canvas coordinates.

#### [NEW] [CustomizerCanvas.tsx](file:///d:/MiniProjects/bhondu/frontend/src/components/editor/CustomizerCanvas.tsx)
Handles canvas instance lifecycle, vector overlay shaders, object tracking, and history storage.

#### [NEW] [CustomizerSidebar.tsx](file:///d:/MiniProjects/bhondu/frontend/src/components/editor/CustomizerSidebar.tsx)
Side controls containing:
* **Product Views Panel:** View switches (front, back, left-sleeve, right-sleeve, collar).
* **Text Controls:** Typographic parameters, custom fonts, path curvatures.
* **Asset Uploader:** Team logos upload to Supabase Storage.
* **Shapes & Code Generator:** Add squares, circles, QR codes.
* **Layers Inspector:** Reorder, lock/unlock, delete, toggle visibility.

---

### 3. API Endpoints Contract (FastAPI REST Routing)
* `POST /api/v1/upload`: Upload asset to Supabase Storage.
* `POST /api/v1/detect`: Bounding boxes for sleeves, front, back, name, and logos.
* `POST /api/v1/ocr`: OCR scan text boundaries.
* `POST /api/v1/remove-elements`: Fal AI FLUX inpainting element removal.
* `POST /api/v1/generate-template`: Generates clean product template.
* `POST /api/v1/replace-color`: WebGL shader recolor preview asset.
* `POST /api/v1/save-template`: Mappings save to Supabase db.
* `POST /api/v1/export`: High-res vector PDF generation.

---

## Verification Plan

### Automated Verification
* Run type check compilation in Next.js: `npm run build` or `npx tsc --noEmit`.
* Execute unit test suites in Python: `pytest tests/`.

### Manual Verification
* Test Fal AI API responses using mock image payloads.
* Validate canvas layer positioning and snaps inside the local web app.
