from .database import driver


def cleanup_duplicate_relationships():
    with driver.session() as session:
        session.run(
            """
            MATCH (a:Technology)-[r:RELATED_TO]->(b:Technology)
            WHERE a.id > b.id
            DELETE r
            """
        )

    print("Duplicate technology relationships cleaned up.")


if __name__ == "__main__":
    try:
        cleanup_duplicate_relationships()
    finally:
        driver.close()