SubSmart
SubSmart is a full-stack web application that helps users track and manage online subscriptions. It features a FastAPI backend with a SQLite database and a React + Tailwind CSS frontend.

Project Structure
subsmart/
├── backend/
│   ├── .env
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── crud.py
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       ├── routes/
│       │   ├── __init__.py
│       │   └── subscriptions.py
│       └── schemas.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── SubscriptionForm.jsx
│       │   └── SubscriptionList.jsx
│       └── pages/
│           └── Dashboard.jsx
└── README.md
Backend Setup
Create a virtual environment (optional but recommended).
Install dependencies:
pip install -r backend/requirements.txt
Run the FastAPI server from backend/ so that Python resolves the app package correctly:
uvicorn app.main:app --reload
The backend is available at http://127.0.0.1:8000.

Frontend Setup
Install dependencies from frontend/:
npm install
Start the development server:
npm run dev
The frontend runs on http://127.0.0.1:5173 and proxies API requests to the backend.

Environment
Backend database URL is configured via backend/.env. Default points to a local SQLite file subscriptions.db.
Features
Manage subscriptions with CRUD operations.
Track monthly spend and renewal dates.
Responsive UI with Tailwind CSS styling.
