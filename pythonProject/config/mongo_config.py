import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

def get_mongo_rank(tear,division):
    mongo_uri = os.getenv("MONGO_URI")
    client = pymongo.MongoClient(mongo_uri)
    db = client[os.getenv("MONGO_DB")]
    collection_name = f"{tear}_{division}"  # 컬렉션 이름을 조합하여 생성
    return db[collection_name]
