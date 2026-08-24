from fastapi import APIRouter, HTTPException

from ..services.graph_service import get_graph_stats


router = APIRouter(
    prefix="/api",
    tags=["Statistics"],
)


@router.get("/stats")
def graph_stats():
    try:
        return get_graph_stats()

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Graph statistics are temporarily unavailable.",
        )