from calendar import month

import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

def get_mongo_rank(tier,division):
    mongo_url = os.getenv("MONGO_URL")
    client = pymongo.MongoClient(mongo_url)
    db = client[os.getenv("MONGO_DB")]
    if tier in ["master", "grandmaster", "challenger"]:
        collection_name = tier.lower()
    else:
        collection_name = f"{tier}_{division}".lower()
    #print(f"{client.server_info()},{db},{collection_name}")
    return db[collection_name]

def mongo_rank_analytics():
    mongo_url = os.getenv("MONGO_URL")
    client = pymongo.MongoClient(mongo_url)
    db = client[os.getenv("MONGO_DB")]
    collection_name = "analytics"
    return db[collection_name]

