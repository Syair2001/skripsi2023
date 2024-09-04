import re
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from wordcloud import WordCloud
import os
import pandas as pd
from cleaning_data import *
from lexicon import *
import matplotlib.pyplot as plt
from io import StringIO
import tensorflow.keras as keras
import numpy as np
import json
from keras_preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences
#from keras_preprocessing.sequence import pad_sequences
from cleaning_data import *
from keras.models import load_model
import pickle

# Load tokenizer dari file pickle
with open('models/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

with open('models/pad_sequence.pickle', 'rb') as handle:
    padded_data = pickle.load(handle)

model = load_model(r'models\model.h5')


def proses_sentimen(filename, id ):
    a = id
    file_path = r'D:\Web\flask\static\upload\\' + str(a) + '_' + filename
    tweets_data = pd.read_csv(file_path)
    columns_to_convert = ['username', 'handle','responding']

# Convert selected columns to string
    tweets_data[columns_to_convert] = tweets_data[columns_to_convert].astype(str)

    tweets_data = tweets_data.rename(columns={'username': 'account_name', 'handle': 'username', 'postDate': 'created_at', 'responding': 'tweet'})
    df = tweets_data[['account_name', 'username', 'created_at', 'tweet', 'retweets', 'likes']]
    
    #bersih-bersih karena kebersihan sebagian dari iman
    df['cleaned_text'] = df['tweet'].apply(cleaningText)
    df = df.drop_duplicates(subset=['cleaned_text'])
    df['casefolded_text'] = df['cleaned_text'].apply(casefoldingText)
    df['tokenized_text'] = df['casefolded_text'].apply(tokenizingText)
    df['filtered_text'] = df['tokenized_text'].apply(filteringText)
    df = df.drop_duplicates(subset=['filtered_text'])
    df['stemmed_text'] = df['filtered_text'].apply(stemmingText)
    df['processed_sentence'] = df['stemmed_text'].apply(toSentence)

    # Tokenize and pad sequences (assuming tokenizer and maxlen are defined)
    X_df = df['processed_sentence']
    X_df = tokenizer.texts_to_sequences(X_df.values)
    X_df = pad_sequences(X_df, maxlen=47)

    # Predict sentiment
    prediksi = model.predict(X_df)
    hasil_prediksi = np.argmax(prediksi, axis=-1)

    # Map predicted labels to sentiment categories
    polarity_decode = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
    df['polarity'] = [polarity_decode[pred] for pred in hasil_prediksi]

    df.drop_duplicates(subset = 'tweet', inplace = True)
    #tweets_sentimen = tweets_sentimen[tweets_sentimen['text_clean'].str.split().apply(len) > 1]

    df.to_csv(r'D:\Web\flask\static\CSV\\'+str(a)+'_'+'Sentimen_Analysis.csv', index=False)

    fig, ax = plt.subplots(figsize = (7, 7))
    sizes = [count for count in df['polarity'].value_counts()]
    labels = list(df['polarity'].value_counts().index)
    explode = (0.1, 0, 0)
    ax.pie(x = sizes, labels = labels, autopct = '%1.1f%%', explode = explode, textprops={'fontsize': 14})
    ax.set_title('Persentase Polaritas Sentimen  \n', fontsize = 16, pad = 20)
    plt.savefig(r'D:\Web\flask\static\plot\\'+str(a)+'_'+'persentase.png')
    plt.close()

    partikel = ('yg','pk', 'ma','jd','ga','ya','aja','tdk','dgn','und','klo','sih','nya','si')
    list_words=''
    for tweet in df['stemmed_text']:
        for word in tweet:
            if word not in partikel:
                list_words += ' '+(word)
            
    wordcloud = WordCloud(width = 600, height = 400, background_color = 'black', min_font_size = 10).generate(list_words)
    fig, ax = plt.subplots(figsize = (8, 6))
    ax.set_title('Word Cloud of Tweets Data', fontsize = 18)
    ax.grid(False)
    ax.imshow((wordcloud))
    fig.tight_layout(pad=0)
    ax.axis('off')
    ax.set_title('Wordcloud Keseleruhan data \n', fontsize = 16, pad = 20)
    plt.savefig(r'D:\Web\flask\static\plot\\'+str(a)+'_'+'wc_all.png')
    plt.close()


    sentiment_words = df['stemmed_text'].apply(words_with_sentiment)
    sentiment_words = list(zip(*sentiment_words))
    positive_words = sentiment_words[0]
    negative_words = sentiment_words[1]

    fig, ax = plt.subplots(1, 2,figsize = (12, 10))
    list_words_postive=''
    for row_word in positive_words:
        for word in row_word:
            list_words_postive += ' '+(word)
    wordcloud_positive = WordCloud(width = 800, height = 600, background_color = 'black', colormap = 'Greens'
                                , min_font_size = 10).generate(list_words_postive)
    ax[0].set_title('Word Cloud of Positive Words on Tweets Data \n (based on Indonesia Sentiment Lexicon)', fontsize = 14)
    ax[0].grid(False)
    ax[0].imshow((wordcloud_positive))
    fig.tight_layout(pad=0)
    ax[0].axis('off')

    list_words_negative=''
    for row_word in negative_words:
        for word in row_word:
            list_words_negative += ' '+(word)
    wordcloud_negative = WordCloud(width = 800, height = 600, background_color = 'black', colormap = 'Reds'
                                , min_font_size = 10).generate(list_words_negative)
    ax[1].set_title('Word Cloud of Negative Words on Tweets Data \n (based on Indonesia Sentiment Lexicon)', fontsize = 14)
    ax[1].grid(False)
    ax[1].imshow((wordcloud_negative))
    fig.tight_layout(pad=0)
    ax[1].axis('off')
    plt.savefig(r'D:\Web\flask\static\plot\\'+str(a)+'_'+'wc_pos_neg.png')
    plt.close()

    return df