from fastapi import APIRouter, HTTPException

from ..database import driver


router = APIRouter(
    prefix="/api/technologies",
    tags=["Technologies"],
)


@router.get("")
def list_technologies():
    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (t:Technology)
                RETURN
                    t.id AS id,
                    t.name AS name,
                    t.category AS category,
                    t.description AS description
                ORDER BY t.name
                """
            )

            return result.data()

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Technology data is temporarily unavailable.",
        )


@router.get("/{technology_id}/related")
def related_technologies(technology_id: str):
    try:
        with driver.session() as session:
            result = session.run(
                """
                MATCH (t:Technology {id: $technology_id})
                      -[:RELATED_TO]-
                      (related:Technology)

                RETURN
                    related.id AS id,
                    related.name AS name,
                    related.category AS category

                ORDER BY related.name
                """,
                technology_id=technology_id,
            )

            return result.data()

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Related technologies are temporarily unavailable.",
        )