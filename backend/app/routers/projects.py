from fastapi import APIRouter, HTTPException

from ..services.graph_service import (
    get_project,
    get_projects,
    get_recommended_developers,
)


router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("")
def list_projects():
    try:
        return get_projects()

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Project data is temporarily unavailable.",
        )


@router.get("/{project_id}")
def project_detail(project_id: str):
    try:
        project = get_project(project_id)

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        return project

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Project data is temporarily unavailable.",
        )


@router.get("/{project_id}/recommended-developers")
def recommended_developers(project_id: str):
    try:
        project = get_project(project_id)

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        return get_recommended_developers(project_id)

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Recommendation data is temporarily unavailable.",
        )