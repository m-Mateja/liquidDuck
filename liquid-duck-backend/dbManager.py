import duckdb

def migrate(db):
    db.execute('''
    CREATE TABLE IF NOT EXISTS liquid_sheets (
        id INTEGER PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        parquet_file BLOB NOT NULL
    )
    ''')

    db.execute('CREATE TABLE IF NOT EXISTS sessions (session_id INTEGER PRIMARY KEY)')

def insertLiquidSheet(db,id,sheetName,pqEncoded):

    liquidSheet = getLiquidSheetById(db,id)
    if liquidSheet is not None:
        updateLiquidSheet(db,id,sheetName,pqEncoded)
        print('updated liquid sheet')
    else:
        db.execute('INSERT INTO liquid_sheets (id, name, parquet_file) VALUES (?,?,?)', (id, sheetName, pqEncoded))
        print('inserted liquid sheet')

def getLiquidSheetById(db,id):
    return db.execute('SELECT * FROM liquid_sheets WHERE id = ?', (id,)).fetchone()

def updateLiquidSheet(db,id,sheetName,pqEncoded):
    db.execute('UPDATE liquid_sheets SET name = ?, parquet_file = ? WHERE id = ?', (sheetName, pqEncoded, id))

def getAllLiquidSheets(db):
    return db.execute('SELECT * FROM liquid_sheets').fetchall()


