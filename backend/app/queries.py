CREATE_CONSTRAINTS = [
    """
    CREATE CONSTRAINT developer_id IF NOT EXISTS
    FOR (d:Developer)
    REQUIRE d.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT technology_id IF NOT EXISTS
    FOR (t:Technology)
    REQUIRE t.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT project_id IF NOT EXISTS
    FOR (p:Project)
    REQUIRE p.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT company_id IF NOT EXISTS
    FOR (c:Company)
    REQUIRE c.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT domain_id IF NOT EXISTS
    FOR (d:Domain)
    REQUIRE d.id IS UNIQUE
    """,
]