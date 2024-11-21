import io
import pyarrow as pa
import pandas as pd
from pyarrow import parquet as pq

def getLiquidSheet(liquidSheet) -> list:
    id = liquidSheet[0]
    name = liquidSheet[1]
    data = liquidSheet[2]
    print(liquidSheet)
    buffer = io.BytesIO(data)
    table = pq.read_table(buffer)
    df = table.to_pandas()
    spreadSheet = df.values.tolist()
    return [id, name, spreadSheet]

def postLiquidSheet(tempData) -> list:
    data = tempData.get('data')
    name = tempData.get('name')
    id = tempData.get('id')
    df = pd.DataFrame(data)
    table = pa.Table.from_pandas(df)
    buffer = io.BytesIO()
    pq.write_table(table,buffer)
    pqEncoded = buffer.getvalue()
    return [id, name, pqEncoded]