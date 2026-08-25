from ..database import driver


def get_developers():
    with driver.session() as session:
        result = session.run(
            """
            MATCH (d:Developer)
            RETURN
                d.id AS id,
                d.name AS name,
                d.username AS username,
                d.bio AS bio,
                d.location AS location
            ORDER BY d.name
            """
        )

        return result.data()


def get_developer(developer_id):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (d:Developer {id: $developer_id})

            OPTIONAL MATCH (d)-[skill:HAS_SKILL]->(t:Technology)

            OPTIONAL MATCH (d)-[work:WORKED_ON]->(p:Project)

            RETURN
                d.id AS id,
                d.name AS name,
                d.username AS username,
                d.bio AS bio,
                d.location AS location,

                collect(DISTINCT {
                    id: t.id,
                    name: t.name,
                    category: t.category,
                    proficiency: skill.proficiency
                }) AS skills,

                collect(DISTINCT {
                    id: p.id,
                    name: p.name,
                    role: work.role,
                    year: work.year
                }) AS projects
            """,
            developer_id=developer_id,
        )

        record = result.single()

        if not record:
            return None

        return {
            "id": record["id"],
            "name": record["name"],
            "username": record["username"],
            "bio": record["bio"],
            "location": record["location"],
            "skills": record["skills"],
            "projects": record["projects"],
        }

def get_developer_projects(developer_id):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (d:Developer {id: $developer_id})
                  -[r:WORKED_ON]->(p:Project)

            RETURN
                p.id AS id,
                p.name AS name,
                p.description AS description,
                p.repository_url AS repository_url,
                p.stars AS stars,
                r.role AS role,
                r.year AS year

            ORDER BY p.name
            """,
            developer_id=developer_id,
        )

        return result.data()


def get_projects():
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Project)
            RETURN
                p.id AS id,
                p.name AS name,
                p.description AS description,
                p.repository_url AS repository_url,
                p.stars AS stars
            ORDER BY p.name
            """
        )

        return result.data()


def get_project(project_id):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Project {id: $project_id})

            OPTIONAL MATCH (p)-[:USES]->(t:Technology)

            OPTIONAL MATCH (p)-[:BELONGS_TO]->(domain:Domain)

            RETURN
                p.id AS id,
                p.name AS name,
                p.description AS description,
                p.repository_url AS repository_url,
                p.stars AS stars,
                collect(DISTINCT {
                    id: t.id,
                    name: t.name,
                    category: t.category
                }) AS technologies,
                collect(DISTINCT domain.name) AS domains
            """,
            project_id=project_id,
        )

        record = result.single()

        if not record:
            return None

        return {
            "id": record["id"],
            "name": record["name"],
            "description": record["description"],
            "repository_url": record["repository_url"],
            "stars": record["stars"],
            "technologies": record["technologies"],
            "domains": record["domains"],
        }


def get_recommended_developers(project_id):
    with driver.session() as session:
        result = session.run(
            """
            MATCH (p:Project {id: $project_id})

            OPTIONAL MATCH (p)-[:USES]->(direct_tech:Technology)
            OPTIONAL MATCH (direct_developer:Developer)-[
                direct_skill:HAS_SKILL
            ]->(direct_tech)

            WITH
                p,
                collect(DISTINCT {
                    developer_id: direct_developer.id,
                    developer: direct_developer.name,
                    technology: direct_tech.name,
                    proficiency: direct_skill.proficiency,
                    match_type: "direct"
                }) AS direct_matches

            OPTIONAL MATCH (p)-[:USES]->(used_tech:Technology)
            MATCH (used_tech)-[:RELATED_TO]-(related_tech:Technology)
            OPTIONAL MATCH (related_developer:Developer)-[
                related_skill:HAS_SKILL
            ]->(related_tech)

            WITH
                direct_matches,
                collect(DISTINCT {
                    developer_id: related_developer.id,
                    developer: related_developer.name,
                    technology: related_tech.name,
                    proficiency: related_skill.proficiency,
                    match_type: "related"
                }) AS related_matches

            UNWIND direct_matches + related_matches AS match

            WITH
                match.developer_id AS developer_id,
                match.developer AS developer,
                collect(DISTINCT match) AS matches

            WITH
                developer_id,
                developer,
                matches,
                any(
                    match IN matches
                    WHERE match.match_type = "direct"
                ) AS has_direct_match

            WITH
                developer_id,
                developer,
                matches,
                has_direct_match

            WITH
                developer_id,
                developer,
                has_direct_match,
                [
                    match IN matches
                    WHERE
                        has_direct_match = false
                        OR match.match_type = "direct"
                ] AS filtered_matches

            WITH
                developer_id,
                developer,
                CASE
                    WHEN has_direct_match
                    THEN "direct"
                    ELSE "related"
                END AS match_type,
                filtered_matches

            WITH
                developer_id,
                developer,
                match_type,
                filtered_matches,
                reduce(
                    score = 0,
                    match IN filtered_matches |
                    score +
                    CASE
                        WHEN match.match_type = "direct"
                        THEN 2
                        ELSE 1
                    END +
                    CASE
                        WHEN match.proficiency = "Advanced"
                        THEN 1
                        WHEN match.proficiency = "Intermediate"
                        THEN 0.5
                        ELSE 0
                    END
                ) AS score

            RETURN
                developer_id,
                developer,
                match_type,
                [
                    match IN filtered_matches |
                    {
                        technology: match.technology,
                        proficiency: match.proficiency,
                        match_type: match.match_type
                    }
                ] AS matched_skills,
                score

            ORDER BY score DESC, developer
            """,
            project_id=project_id,
        )

        return result.data()

def get_graph_stats():
    with driver.session() as session:
        result = session.run(
            """
            MATCH (d:Developer)
            WITH count(d) AS developers

            MATCH (p:Project)
            WITH developers, count(p) AS projects

            MATCH (t:Technology)
            WITH developers, projects, count(t) AS technologies

            RETURN
                developers,
                projects,
                technologies
            """
        )

        record = result.single()

        return {
            "developers": record["developers"],
            "projects": record["projects"],
            "technologies": record["technologies"],
        }