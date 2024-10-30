import pymongo

def get_mongo_client():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['riot_data']
    return db['match_data']  # match_data 컬렉션 반환
