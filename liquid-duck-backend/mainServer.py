from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/save/spread-sheet', methods=['POST'])
def saveSpreadSheet() -> str:
    data = request.get_json()
    data = data.get('data')
    print(data)
    return 'Wow we did it'


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
