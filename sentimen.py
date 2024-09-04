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


def proses_sentimen(filename, id ):
    a = id
    file_path = r'D:\Web\flask\static\upload\\' + str(a) + '_' + filename
    tweets_data = pd.read_csv(file_path)
    columns_to_convert = ['username', 'handle','responding']

# Convert selected columns to string
    tweets_data[columns_to_convert] = tweets_data[columns_to_convert].astype(str)

    tweets_data = tweets_data.rename(columns={'username': 'account_name', 'handle': 'username', 'postDate': 'created_at', 'responding': 'tweet'})
    tweets_sentimen = tweets_data[['account_name', 'username', 'created_at', 'tweet', 'retweets', 'likes']]
    
    #bersih-bersih karena kebersihan sebagian dari iman
    tweets_sentimen['text_clean'] = tweets_sentimen['tweet'].apply(cleaningText)
    tweets_sentimen['text_clean'] = tweets_sentimen['text_clean'].apply(casefoldingText)
    tweets_sentimen.drop(['tweet'], axis = 1, inplace = True)

    tweets_sentimen['text_preprocessed'] = tweets_sentimen['text_clean'].apply(tokenizingText)
    tweets_sentimen['text_preprocessed'] = tweets_sentimen['text_preprocessed'].apply(filteringText)
    tweets_sentimen['text_preprocessed'] = tweets_sentimen['text_preprocessed'].apply(stemmingText)

    tweets_sentimen.drop_duplicates(subset = 'text_clean', inplace = True)
    tweets_sentimen = tweets_sentimen[tweets_sentimen['text_clean'].str.split().apply(len) > 1]

    results = tweets_sentimen['text_preprocessed'].apply(sentiment_analysis_lexicon_indonesia)
    results = list(zip(*results))
    tweets_sentimen['polarity_score'] = results[0]
    tweets_sentimen['polarity'] = results[1]
    tweets_sentimen.to_csv(r'D:\Web\flask\static\CSV\\'+str(a)+'_'+'Sentimen_Analysis.csv', index=False)

    fig, ax = plt.subplots(figsize = (7, 7))
    sizes = [count for count in tweets_sentimen['polarity'].value_counts()]
    labels = list(tweets_sentimen['polarity'].value_counts().index)
    explode = (0.1, 0, 0)
    ax.pie(x = sizes, labels = labels, autopct = '%1.1f%%', explode = explode, textprops={'fontsize': 14})
    ax.set_title('Persentase Polaritas Sentimen  \n', fontsize = 16, pad = 20)
    plt.savefig(r'D:\Web\flask\static\plot\\'+str(a)+'_'+'persentase.png')
    plt.close()

    partikel = ('yg','pk', 'ma','jd','ga','ya','aja','tdk','dgn','und','klo','sih','nya','si')
    list_words=''
    for tweet in tweets_sentimen['text_preprocessed']:
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


    sentiment_words = tweets_sentimen['text_preprocessed'].apply(words_with_sentiment)
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

    return tweets_sentimen