from fastapi import APIRouter, HTTPException

from ..services.graph_service import (
    get_developer,
    get_developer_projects,
    get_developers,
)


router = APIRouter(prefix="/api/developers", tags=["Developers"])


@router.get("")
def list_developers():
    try:
        return get_developers()
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Developer data is temporarily unavailable.",
        )


@router.get("/{developer_id}")
def developer_detail(developer_id: str):
    try:
        developer = get_developer(developer_id)

        if not developer:
            raise HTTPException(
                status_code=404,
                detail="Developer not found.",
            )

        return developer

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Developer data is temporarily unavailable.",
        )


@router.get("/{developer_id}/projects")
def developer_projects(developer_id: str):
    try:
        return get_developer_projects(developer_id)

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Developer projects are temporarily unavailable.",
        )