from flask import request,jsonify
import pickle
import tensorflow as tf
import tensorflow.keras as keras
import pandas as pd
import numpy as np
import json
from keras_preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences
from cleaning_data import *
from keras.models import load_model


# Load tokenizer dari file pickle
with open('models/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

with open('models/pad_sequence.pickle', 'rb') as handle:
    padded_data = pickle.load(handle)

model = load_model(r'models\model.h5')

def proses_data_kalimat():
    data = request.get_json()
    json_dump = json.dumps(data)
    parsed_data = json.loads(json_dump)
    df = pd.DataFrame([parsed_data])
    df = df['text']
    df = df.apply(cleaningText)
    df = df.apply(casefoldingText)

    df = df.apply(tokenizingText)
    df = df.apply(filteringText)
    df = df.apply(stemmingText)

    X_df = df.apply(toSentence)
    X_df = tokenizer.texts_to_sequences(X_df.values)
    X_df = pad_sequences(X_df, maxlen=47)

    prediksi = model.predict(X_df)
    hasil_prediksi = np.argmax(prediksi, axis=-1)
    polarity_decode = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
    hasil_sentimen = polarity_decode[hasil_prediksi[0]]
    return hasil_sentimen

