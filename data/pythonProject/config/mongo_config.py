from calendar import month

import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

def get_mongo_rank(tier,division):
    mongo_url = (("mongodb://" + os.getenv("MONGO_DB_USERNAME")+
                 ":" + os.getenv("MONGO_DB_PASSWORD") +
                 "@" + os.getenv("MONGO_DB_URL")) +
                 ":" + os.getenv("MONGO_DB_PORT") +
                 "/" + os.getenv("MONGO_DB_DATABASE"))
    client = pymongo.MongoClient(mongo_url)
    db = client[os.getenv("MONGO_DB_DATABASE")]
    if tier in ["master", "grandmaster", "challenger"]:
        collection_name = tier.lower()
    else:
        collection_name = f"{tier}_{division}".lower()
    #print(f"{client.server_info()},{db},{collection_name}")
    return db[collection_name]

def mongo_rank_analytics():
    mongo_url = (("mongodb://" + os.getenv("MONGO_DB_USERNAME") +
                  ":" + os.getenv("MONGO_DB_PASSWORD") +
                  "@" + os.getenv("MONGO_DB_URL")) +
                 ":" + os.getenv("MONGO_DB_PORT") +
                 "/" + os.getenv("MONGO_DB_DATABASE"))
    client = pymongo.MongoClient(mongo_url)
    db = client[os.getenv("MONGO_DB_DATABASE")]
    collection_name = "analytics"
    return db[collection_name]

def get_mongo_report():
    mongo_url = (("mongodb://" + os.getenv("MONGO_DB_USERNAME") +
                  ":" + os.getenv("MONGO_DB_PASSWORD") +
                  "@" + os.getenv("MONGO_DB_URL")) +
                 ":" + os.getenv("MONGO_DB_PORT") +
                 "/" + os.getenv("MONGO_DB_DATABASE"))
    client = pymongo.MongoClient(mongo_url)
    db = client[os.getenv("MONGO_DB_DATABASE")]
    return db["report"]

