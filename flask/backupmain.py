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

UPLOAD_FOLDER = r'D:\archive\Skripsi\Web\flask\static\upload'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


ALLOWED_EXTENSIONS = set(['csv'])
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



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
	# Pastikan permintaan adalah POST dan berisi file CSV
    # check if the post request has the file part
	#print("files :",request.form['csv'])
	#print(request.form.get('csv'))
	id = request.form.get('id')
	nama_file = request.form.get('nama_file')
	df = pd.read_csv(StringIO(request.form.get('csv')))
	csv_file_path = '../flask/static/upload/'+id+'_'+nama_file # Specify the path where you want to save the CSV file
	df.to_csv(csv_file_path, index=False)  # Set index=False to exclude row numbers

	# if 'csv' not in request.files:
	# 	resp = jsonify({'message' : 'No file part in the request'})
	# 	resp.status_code = 400
	# 	return resp

	files = csv_file_path
	
	
	errors = {}
	success = False
	
	for file in files:		
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'],str(id)+"_"+filename)) #id_filename
			proses_sentimen(filename,id)
			result1 = str(id)+'_'+'Sentimen_Analysis.csv'
			result2 = str(id)+'_'+'persentase.png'
			result3 = str(id)+'_'+'wc_all.png'
			result4 = str(id)+'_'+'wc_pos_neg.png'

			success = True
			cur = mysql.connection.cursor()
			cur.execute("INSERT INTO sentimenresults (sentimen_id, result1, result2, result3, result4) VALUES (%s, %s, %s, %s, %s)", (int(id),result1,result2,result3,result4))
			mysql.connection.commit()

		else:
			errors[file.filename] = 'File type is not allowed'
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
	# Pastikan permintaan adalah POST dan berisi file CSV
    # check if the post request has the file part
	if 'csv' not in request.files:
		resp = jsonify({'message' : 'No file part in the request'})
		resp.status_code = 400
		return resp

	files = request.files.getlist('csv')
	id = request.form.get('id')
	
	errors = {}
	success = False
	
	for file in files:		
		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'],str(id)+"_"+filename)) #id_filename
			buat_network(filename,id)
			result1 = str(id)+'_'+'network.png'

			success = True
			cur = mysql.connection.cursor()
			cur.execute("INSERT INTO networkresults (network_id, result1) VALUES (%s,%s)", (id,result1))
			mysql.connection.commit()

		else:
			errors[file.filename] = 'File type is not allowed'
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

if __name__ == '__main__':
    app.run(debug=True)