import os

from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from .database import verify_connection
from .routers import developers, projects, technologies, stats

load_dotenv()

app = FastAPI(
    title="DevGraph API",
    description="Developer and technology relationship explorer powered by CognoDB.",
    version="1.0.0",
)


frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    frontend_url = frontend_url.rstrip("/")



app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(developers.router)
app.include_router(projects.router)
app.include_router(technologies.router)
app.include_router(stats.router)


@app.get("/health")
def health_check():
    try:
        verify_connection()

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception:
        return {
            "status": "unhealthy",
            "database": "unavailable",
        }


@app.get("/")
def root():
    return {
        "message": "DevGraph API is running",
    }