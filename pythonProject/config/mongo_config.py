import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

def get_mongo_rank(tier,division):
    mongo_url = os.getenv("MONGO_URL")
    client = pymongo.MongoClient(mongo_url)
    db = client[os.getenv("MONGO_DB")]
    collection_name = f"{tier}_{division}"  # 컬렉션 이름을 조합하여 생성
    #print(f"{client.server_info()},{db},{collection_name}")
    return db[collection_name]
