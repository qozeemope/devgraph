from .database import driver


def find_developers_for_project(project_id):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Project {id: $project_id})-[:USES]->(project_tech:Technology)
            MATCH (project_tech)-[:RELATED_TO]-(related_tech:Technology)
            MATCH (developer:Developer)-[skill:HAS_SKILL]->(related_tech)

            RETURN
                developer.id AS developer_id,
                developer.name AS developer,
                collect(DISTINCT related_tech.name) AS related_skills,
                collect(DISTINCT skill.proficiency) AS proficiency_levels

            ORDER BY developer.name
            """,
            project_id=project_id,
        )

        return result.data()


if __name__ == "__main__":
    try:
        results = find_developers_for_project("project-001")

        for result in results:
            print(result)
    finally:
        driver.close()