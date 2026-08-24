from .database import driver


developers = [
    {
        "id": "dev-001",
        "name": "Ada Okafor",
        "username": "adaokafor",
        "bio": "Full-stack developer focused on web applications and developer tools.",
        "location": "Lagos, Nigeria",
    },
    {
        "id": "dev-002",
        "name": "Daniel Smith",
        "username": "danielsmith",
        "bio": "Backend engineer specializing in Python and API development.",
        "location": "London, UK",
    },
    {
        "id": "dev-003",
        "name": "Sarah Johnson",
        "username": "sarahjohnson",
        "bio": "Frontend developer building accessible and responsive interfaces.",
        "location": "Toronto, Canada",
    },
]


technologies = [
    {
        "id": "tech-001",
        "name": "React",
        "category": "Frontend",
        "description": "A JavaScript library for building user interfaces.",
    },
    {
        "id": "tech-002",
        "name": "TypeScript",
        "category": "Language",
        "description": "A typed superset of JavaScript.",
    },
    {
        "id": "tech-003",
        "name": "Python",
        "category": "Backend",
        "description": "A general-purpose programming language widely used for web development.",
    },
    {
        "id": "tech-004",
        "name": "FastAPI",
        "category": "Backend",
        "description": "A modern Python framework for building APIs.",
    },
    {
        "id": "tech-005",
        "name": "PostgreSQL",
        "category": "Database",
        "description": "An open-source relational database system.",
    },
]

developer_skills = [
    ("dev-001", "tech-001", "Advanced"),
    ("dev-001", "tech-002", "Advanced"),
    ("dev-001", "tech-003", "Intermediate"),

    ("dev-002", "tech-003", "Advanced"),
    ("dev-002", "tech-004", "Advanced"),
    ("dev-002", "tech-005", "Advanced"),

    ("dev-003", "tech-001", "Advanced"),
    ("dev-003", "tech-002", "Advanced"),
]


technology_relationships = [
    ("tech-001", "tech-002"),
    ("tech-003", "tech-004"),
]


projects = [
    {
        "id": "project-001",
        "name": "DevBoard",
        "description": "A collaborative developer dashboard for tracking projects and technical skills.",
        "repository_url": "https://github.com/example/devboard",
        "stars": 128,
    },
    {
        "id": "project-002",
        "name": "TaskFlow API",
        "description": "A backend API for managing tasks, teams and project workflows.",
        "repository_url": "https://github.com/example/taskflow-api",
        "stars": 94,
    },
    {
        "id": "project-003",
        "name": "ShopSphere",
        "description": "An e-commerce platform with product discovery and order management.",
        "repository_url": "https://github.com/example/shopsphere",
        "stars": 217,
    },
]


companies = [
    {
        "id": "company-001",
        "name": "Nova Labs",
        "industry": "Software",
    },
    {
        "id": "company-002",
        "name": "CloudForge",
        "industry": "Cloud Technology",
    },
]


domains = [
    {
        "id": "domain-001",
        "name": "Developer Tools",
    },
    {
        "id": "domain-002",
        "name": "E-commerce",
    },
    {
        "id": "domain-003",
        "name": "Backend Systems",
    },
]


project_technologies = [
    ("project-001", "tech-001"),
    ("project-001", "tech-002"),

    ("project-002", "tech-003"),
    ("project-002", "tech-004"),
    ("project-002", "tech-005"),

    ("project-003", "tech-001"),
    ("project-003", "tech-002"),
    ("project-003", "tech-005"),
]


project_domains = [
    ("project-001", "domain-001"),
    ("project-002", "domain-003"),
    ("project-003", "domain-002"),
]


developer_projects = [
    ("dev-001", "project-001", "Lead Developer", 2025),
    ("dev-002", "project-002", "Backend Developer", 2025),
    ("dev-003", "project-001", "Frontend Developer", 2025),
    ("dev-003", "project-003", "Frontend Developer", 2024),
]


developer_companies = [
    ("dev-001", "company-001"),
    ("dev-002", "company-002"),
    ("dev-003", "company-001"),
]


company_projects = [
    ("company-001", "project-001"),
    ("company-001", "project-003"),
    ("company-002", "project-002"),
]










def seed_database():
    with driver.session() as session:

        for developer in developers:
            session.run(
                """
                MERGE (d:Developer {id: $id})
                SET d.name = $name,
                    d.username = $username,
                    d.bio = $bio,
                    d.location = $location
                """,
                developer,
            )

        for technology in technologies:
            session.run(
                """
                MERGE (t:Technology {id: $id})
                SET t.name = $name,
                    t.category = $category,
                    t.description = $description
                """,
                technology,
            )

        for developer_id, technology_id, proficiency in developer_skills:
            session.run(
                """
                MATCH (d:Developer {id: $developer_id})
                MATCH (t:Technology {id: $technology_id})
                MERGE (d)-[r:HAS_SKILL]->(t)
                SET r.proficiency = $proficiency
                """,
                developer_id=developer_id,
                technology_id=technology_id,
                proficiency=proficiency,
            )

        for technology_a, technology_b in technology_relationships:
            session.run(
                """
                MATCH (a:Technology {id: $technology_a})
                MATCH (b:Technology {id: $technology_b})
                MERGE (a)-[:RELATED_TO]->(b)
                """,
                technology_a=technology_a,
                technology_b=technology_b,
            )

        for project in projects:
            session.run(
                """
                MERGE (p:Project {id: $id})
                SET p.name = $name,
                    p.description = $description,
                    p.repository_url = $repository_url,
                    p.stars = $stars
                """,
                project,
            )

        for company in companies:
            session.run(
                """
                MERGE (c:Company {id: $id})
                SET c.name = $name,
                    c.industry = $industry
                """,
                company,
            )

        for domain in domains:
            session.run(
                """
                MERGE (d:Domain {id: $id})
                SET d.name = $name
                """,
                domain,
            )

        for project_id, technology_id in project_technologies:
            session.run(
                """
                MATCH (p:Project {id: $project_id})
                MATCH (t:Technology {id: $technology_id})
                MERGE (p)-[:USES]->(t)
                """,
                project_id=project_id,
                technology_id=technology_id,
            )

        for project_id, domain_id in project_domains:
            session.run(
                """
                MATCH (p:Project {id: $project_id})
                MATCH (d:Domain {id: $domain_id})
                MERGE (p)-[:BELONGS_TO]->(d)
                """,
                project_id=project_id,
                domain_id=domain_id,
            )

        for developer_id, project_id, role, year in developer_projects:
            session.run(
                """
                MATCH (d:Developer {id: $developer_id})
                MATCH (p:Project {id: $project_id})
                MERGE (d)-[r:WORKED_ON]->(p)
                SET r.role = $role,
                    r.year = $year
                """,
                developer_id=developer_id,
                project_id=project_id,
                role=role,
                year=year,
            )

        for developer_id, company_id in developer_companies:
            session.run(
                """
                MATCH (d:Developer {id: $developer_id})
                MATCH (c:Company {id: $company_id})
                MERGE (d)-[:WORKS_AT]->(c)
                """,
                developer_id=developer_id,
                company_id=company_id,
            )

        for company_id, project_id in company_projects:
            session.run(
                """
                MATCH (c:Company {id: $company_id})
                MATCH (p:Project {id: $project_id})
                MERGE (c)-[:OWNS]->(p)
                """,
                company_id=company_id,
                project_id=project_id,
            )

    print("Seed data inserted successfully.")


if __name__ == "__main__":
    try:
        seed_database()
    finally:
        driver.close()