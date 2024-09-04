import re
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory


def remove_single_word(text):
    text = text.group(0)
    if re.match(r'^\w+$', text):  # Check if the word contains only letters, digits, or underscores
        return ''  # Replace the word with an empty string
    else:
        return text  # Keep the word unchanged
# Some functions for preprocessing text
def cleaningText(text):
    text = re.sub(r'#[A-Za-z0-9]+', '', text) # remove hashtag
    text = re.sub(r'RT[\s]', '', text) # remove RT
    text = re.sub(r"http\S+", '', text) # remove link
    text = re.sub(r'[0-9]+', '', text) # remove numbers
    text = re.sub(r'^Replying to\s', '', text) # menghapus Replyting to
    text = re.sub(r'@\w+\s*', '', text) # menghapus mention
    text = re.sub(r'(?<!\w)and(?!\w)', '', text) # menghapus kata "and"
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text) # menghilangkan simbol â€™
    text = re.sub(r'(^|\s)\w+($|\s)', remove_single_word, text)
    text = text.replace('others', ' ') # replace new line into space
    text = text.replace('\n', ' ') # replace new line into space
    text = text.translate(str.maketrans('', '', string.punctuation)) # remove all punctuations
    text = text.strip(' ') # remove characters space from both left and right text
    return text

def casefoldingText(text): # Converting all the characters in a text into lower case
    text = text.lower() 
    return text

def tokenizingText(text): # Tokenizing or splitting a string, text into a list of tokens
    text = word_tokenize(text) 
    return text

def filteringText(text): # Remove stopwors in a text
    listStopwords = set(stopwords.words('indonesian'))
    filtered = []
    for txt in text:
        if txt not in listStopwords:
            filtered.append(txt)
    text = filtered 
    return text

def stemmingText(text): # Reducing a word to its word stem that affixes to suffixes and prefixes or to the roots of words
    factory = StemmerFactory()
    stemmer = factory.create_stemmer()
    text = [stemmer.stem(word) for word in text]
    return text

def toSentence(list_words): # Convert list of words into sentence
    sentence = ' '.join(word for word in list_words)
    return sentence

def clean_data_net(text):
    # Mencari @username menggunakan ekspresi reguler
    usernames = re.findall(r'@([a-zA-Z0-9_]+)', text)
    
    # Menggabungkan @username menjadi satu string
    cleaned_text = ' '.join(usernames)
    
    return cleaned_text

