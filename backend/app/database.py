import os

from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")

if not all([COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD]):
    raise RuntimeError("Missing CognoDB environment variables")

driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(COGNODB_USERNAME, COGNODB_PASSWORD),
)


def verify_connection():
    driver.verify_connectivity()
    return True