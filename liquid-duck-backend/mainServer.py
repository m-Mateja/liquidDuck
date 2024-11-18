from flask import Flask, request
from flask_cors import CORS
import duckdb
import pyarrow as pa
import pyarrow.parquet as pq
import pandas as pd
import io
import dbManager

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

db = duckdb.connect('liquidDuckDb.duckdb', read_only=False)
dbManager.migrate(db)

@app.route('/api/save/spread-sheet', methods=['POST'])
def saveSpreadSheet() -> str:
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
    return 'Wow we did it'

@app.route('/api/get/spread-sheet/<int:id>', methods=['GET'])
def getSpreadSheet(id):
    liquidSheet = dbManager.getLiquidSheetById(db, id)
    print(liquidSheet)
    buffer = io.BytesIO(liquidSheet[2])
    table = pq.read_table(buffer)
    df = table.to_pandas()
    spreadSheet = df.values.tolist()
    return spreadSheet


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
