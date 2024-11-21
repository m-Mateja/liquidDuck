from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
import duckdb
import pyarrow as pa
import pyarrow.parquet as pq
import pandas as pd
import io
import dbManager
import service

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
    [id,name,pqEncoded] = service.postLiquidSheet(tempData)
    dbManager.insertLiquidSheet(db, id, name, pqEncoded)
    return {'data':'Save completed'}

@app.route('/api/get/spread-sheet/<int:id>', methods=['GET'])
def getSpreadSheet(id) -> dict:
    liquidSheet = dbManager.getLiquidSheetById(db, id)
    [id,name,spreadSheet] = service.getLiquidSheet(liquidSheet)
    return {'liquidSheetName':name,
            'data':spreadSheet
            }

@app.route('/api/get/spread-sheet/all', methods=['GET'])
def getAllSpreadSheets() -> dict:
    allSheets = []
    liquidSheets = dbManager.getAllLiquidSheets(db)

    for sheet in liquidSheets:
        [id,name,spreadSheet] = service.getLiquidSheet(sheet)
        allSheets.append([id,name,spreadSheet])

    return {'data':allSheets}

@socketio.on('connect')
def handle_connect():
    sessionId = request.args.get('sessionId')
    print(f'{sessionId} Connected')
    send(f'welcome to the ws {sessionId}')

@socketio.on('disconnect')
def handle_disconnect():
    sessionId = request.args.get('sessionId')
    print(f'{sessionId} Disconnected')

@socketio.on('titleChange')
def handle_titleChange(message):
    emit('titleChange', {'id':message[0],'title':message[1]}, broadcast=True)

@socketio.on('cellChange')
def handle_cellChange(message):
    emit('cellChange', {
        'id':message[0],
        'row': message[1][0],
        'prop': message[1][1],
        'newValue': message[1][3]
    }, broadcast=True, include_self=False)



if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000, allow_unsafe_werkzeug=True)
