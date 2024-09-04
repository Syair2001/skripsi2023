from flask import Flask, request, jsonify,request,redirect
from flask_mysqldb import MySQL
import pickle
import pandas as pd
import numpy as np	
import json
from sentimen import *
from cleaning_data import *
from werkzeug.utils import secure_filename
import os
from netwok_als import *
from lstm_predictor import *
from flask_cors import CORS,cross_origin
from io import StringIO

app = Flask(__name__)


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'sentimen-analysis'

mysql = MySQL(app)


@app.route('/submit', methods=['POST'])
@cross_origin()
def index():
	hasil_sentimen = proses_data_kalimat()
	return jsonify({

    "data" : {
        "sentimen":hasil_sentimen
		}
    })


@app.route('/upload_senti_graph', methods=['POST'])
def upload_sentimen():

	id = request.form.get('id')
	nama_file = request.form.get('nama_file')
	print(nama_file)
	df = pd.read_csv(StringIO(request.form.get('csv')))
	csv_file_path = r'D:\Web\flask\static\upload\\'+id+'_'+nama_file # Specify the path where you want to save the CSV file
	print(csv_file_path)
	if not os.path.exists(csv_file_path):
		df.to_csv(csv_file_path, index=False)
		proses_sentimen(nama_file,id)
		result1 = str(id)+'_'+'Sentimen_Analysis.csv'
		result2 = str(id)+'_'+'persentase.png'
		result3 = str(id)+'_'+'wc_all.png'
		result4 = str(id)+'_'+'wc_pos_neg.png'
		errors = {}
		success = False

	
	success = True
	cur = mysql.connection.cursor()
	cur.execute("INSERT INTO sentimenresults (sentimen_id, result1, result2, result3, result4) VALUES (%s, %s, %s, %s, %s)", (int(id),result1,result2,result3,result4))
	mysql.connection.commit()

	if success and errors:
		errors['message'] = 'File(s) successfully uploaded'
		resp = jsonify(errors)
		resp.status_code = 500
		return resp
	if success:
		resp = jsonify({
			'message' : 'Files successfully uploaded',
			'data' : {
				'id': id,
				'success': success
			}
		})
		resp.status_code = 201
		#query database untuk menyimpan data nama file gambar dan id sentimen
		return resp
	else:
		resp = jsonify(errors)
		resp.status_code = 500
		return resp

@app.route('/upload_network', methods=['POST'])
def upload_network():
	id = request.form.get('id')
	nama_file = request.form.get('nama_file')
	#print(nama_file)
	df = pd.read_csv(StringIO(request.form.get('csv')))
	csv_file_path = r'D:\Web\flask\static\upload\\'+id+'_'+nama_file # Specify the path where you want to save the CSV file
	#print(csv_file_path)
	if not os.path.exists(csv_file_path):
		df.to_csv(csv_file_path, index=False)
		buat_network(nama_file,id)
		result = str(id)+'_'+'network.png'
		errors = {}
		success = False

	success = True
	cur = mysql.connection.cursor()
	cur.execute("INSERT INTO networkresults (result1, network_id) VALUES (%s, %s)", (result,id))
	mysql.connection.commit()
	
	if success and errors:
		errors['message'] = 'File(s) successfully uploaded'
		resp = jsonify(errors)
		resp.status_code = 210
		return resp
	if success:
		resp = jsonify({
			'message' : 'Files successfully uploaded',
			'data' : {
				'id': id,
				'success': success
			}
		})
		resp.status_code = 201
		#query database untuk menyimpan data nama file gambar dan id sentimen
		return resp
	else:
		resp = jsonify(errors)
		resp.status_code = 500
		return resp

if __name__ == '__main__':
    app.run(debug=True)