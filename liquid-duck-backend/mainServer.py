from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
import duckdb
import pyarrow as pa
import pyarrow.parquet as pq
import pandas as pd
import io
import dbManager

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {"origins": "*"},
    r"/socket.io/*": {"origins": "*"}
})
socketio = SocketIO(app, cors_allowed_origins="*")

db = duckdb.connect('liquidDuckDb.duckdb', read_only=False)
dbManager.migrate(db)

@app.route('/api/save/spread-sheet', methods=['POST'])
def saveSpreadSheet() -> dict:
    tempData = request.get_json()
    data = tempData.get('data')
    name = tempData.get('name')
    id = tempData.get('id')
    df = pd.DataFrame(data)
    table = pa.Table.from_pandas(df)
    buffer = io.BytesIO()
    pq.write_table(table,buffer)
    pqEncoded = buffer.getvalue()
    dbManager.insertLiquidSheet(db, id, name, pqEncoded)
    return {'data':'Saved Liquid Sheet'}

@app.route('/api/get/spread-sheet/<int:id>', methods=['GET'])
def getSpreadSheet(id) -> dict:
    liquidSheet = dbManager.getLiquidSheetById(db, id)
    name = liquidSheet[1]
    data = liquidSheet[2]
    print(liquidSheet)
    buffer = io.BytesIO(data)
    table = pq.read_table(buffer)
    df = table.to_pandas()
    spreadSheet = df.values.tolist()

    return {'liquidSheetName':name,
            'data':spreadSheet
            }

@socketio.on('connect')
def handle_connect():
    sessionId = request.args.get('sessionId')
    print(f'{sessionId} Connected')
    send(f'welcome to the ws {sessionId}')

@socketio.on('disconnect')
def handle_disconnect():
    sessionId = request.args.get('sessionId')
    print(f'{sessionId} Disconnected')

@socketio.on('message')
def handle_message(message):
    emit('message', {'message':message}, broadcast=True)

@socketio.on('titleChange')
def handle_titleChange(message):
    emit('titleChange', {'title':message}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000, allow_unsafe_werkzeug=True)
