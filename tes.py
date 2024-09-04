from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Konfigurasi database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://syair:fujitora@localhost/sentimen-analysis'
db = SQLAlchemy(app)

class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sentimen_id = db.Column(db.Integer)
    result1 = db.Column(db.String(255))
    result2 = db.Column(db.String(255))
    result3 = db.Column(db.String(255))
    result4 = db.Column(db.String(255))
    createdAt = db.Column(db.DateTime)
    updatedAt = db.Column(db.DateTime)

@app.route('/api', methods=['GET'])
def get_data_from_mysql():
    try:
        # Mengambil semua data dari tabel
        data = Data.query.all()
        data_list = [{"id": item.id, "sentimen_id": item.sentimen_id, "result1":item.result1,
                      "result2":item.result2,"result3":item.result3,"result4":item.result4,
                      "createdAt":item.createdAt,"updatedAt":item.updatedAt} for item in data]
        return jsonify(data_list)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)