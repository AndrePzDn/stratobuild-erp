from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import health, kpis, dashboard, project, client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(kpis.router)
app.include_router(dashboard.router)
app.include_router(project.router)
app.include_router(client.router)

# Global exception handler kept minimal here; FastAPI default handlers will apply.
