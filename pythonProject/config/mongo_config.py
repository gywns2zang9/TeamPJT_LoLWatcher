import pymongo

def get_mongo_client():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['riot_data']
    return db['match_data']  # match_data 컬렉션 반환

def get_mongo_rank(tear,decord):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client['riot_data']
    collection_name = f"{tear}_{decord}"  # 컬렉션 이름을 조합하여 생성
    return db[collection_name]
