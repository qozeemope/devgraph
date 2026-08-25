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


def test_multi_hop_traversal(project_id):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Project {id: $project_id})
                  -[:USES]->(t:Technology)
                  -[:RELATED_TO]->(related:Technology)
                  <-[:HAS_SKILL]-(d:Developer)

            RETURN
                p.name AS project,
                t.name AS project_technology,
                related.name AS related_technology,
                d.name AS developer

            ORDER BY d.name
            """,
            project_id=project_id,
        )

        return result.data()


if __name__ == "__main__":
    try:
        print("Related-skill developers:")

        results = find_developers_for_project("project-001")

        for result in results:
            print(result)

        print("\nMulti-hop traversal:")

        results = test_multi_hop_traversal("project-001")

        for result in results:
            print(result)

    finally:
        driver.close()