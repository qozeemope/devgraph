from .database import driver
from .queries import CREATE_CONSTRAINTS


def initialize_database():
    with driver.session() as session:
        for query in CREATE_CONSTRAINTS:
            session.run(query)

    print("Database constraints created successfully.")


if __name__ == "__main__":
    initialize_database()
    driver.close()