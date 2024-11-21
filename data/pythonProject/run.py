from flask import Flask, jsonify, request
from receive.receive_match_data import routes
app = Flask(__name__)
app.register_blueprint(routes)
@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/docker-test')
def docker_test():
    return '도커 테스트 완료'

if __name__ == '__main__':
    app.run(debug=True)