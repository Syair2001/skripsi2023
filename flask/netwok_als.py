import pandas as pd
import re
import string
import networkx as nx
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt

from cleaning_data import clean_data_net

# df = r"D:\archive\Skripsi\Web\static\upload\dump\cleaned_output.csv"
# new_df = r"D:\archive\Skripsi\Web\static\upload\dump\modified.csv"
# 

def buat_network(filename,id):
    a = id
    file_path = r'D:\Web\flask\static\upload\\' + str(a) + '_' + filename
    network_analysis = pd.read_csv(file_path)
    # Mencari @username menggunakan ekspresi reguler
    network_analysis['responding'] = network_analysis['responding'].apply(str)
    network_analysis['target'] = network_analysis['responding'].apply(clean_data_net)
    network_analysis.drop(['username', 'postDate','responding','retweets','likes'], axis=1, inplace=True)
    #network_analysis.to_csv(r"D:\archive\Skripsi\Web\static\upload\dump\cleaned_output.csv", index=False)
    #network_analysis
    #return network_analysis
    new_data = []
    # Memproses setiap baris dalam DataFrame
    for index, row in network_analysis.iterrows():
        # Memisahkan entri dalam kolom "source" dan "target" menjadi dua kata
        sources = row["handle"].split(',')
        targets = row["target"].split()     
        # Menambahkan dua baris ke daftar baru dengan nama yang sesuai
        for source in sources:
            for target in targets:
                new_data.append({"source": source.strip(), "target": target.strip()})

    # Membuat DataFrame baru dari hasil pemisahan
    new_df = pd.DataFrame(new_data)
    # Menyimpan hasil pemisahan ke dalam file CSV
    #new_df.to_csv(r"D:\archive\Skripsi\Web\static\upload\dump\cleaned_output.csv", index=False)
    new_df["target"] = "@" + new_df["target"]
    # Menyimpan hasil perubahan ke dalam file CSV
    #new_df.to_csv(r"D:\archive\Skripsi\Web\static\upload\dump\modified.csv", index=False)
    #df = data_tengah
    #data_akhir = pd.read_csv(new_df)
    # Inisialisasi grafik
    G = nx.from_pandas_edgelist(new_df, source='source', target='target', create_using=nx.DiGraph)

    # Calculate degree centrality
    degree_centrality = nx.degree_centrality(G)

    # Get top 5 nodes by degree centrality
    top_5_degree = sorted(degree_centrality.items(), key=lambda x: x[1], reverse=True)[:5]

    # Add labels to the top 5 nodes
    labels = {node: f'{node}\nDegree Centrality: {centrality:.4f}' for node, centrality in top_5_degree}

    # Draw the graph with labels
    plt.figure(figsize=(70, 60))
    pos = nx.spring_layout(G, scale=0.1,iterations=100)
    node_colors = list(degree_centrality.values())
    print(list(degree_centrality.values()))
    cmap = plt.cm.twilight  # Choose a colormap (e.g., viridis)
    vmin = min(node_colors)
    vmax = max(node_colors)

    nx.draw(G, pos, with_labels=True, labels=labels, node_size=8200, node_color=node_colors, 
            font_color='black', font_size=80, alpha=0.8, cmap=cmap, vmin=vmin, vmax=vmax)
    # Menampilkan gambar
    plt.savefig(r'D:\Web\flask\static\plot\\'+a+'_'+'network.png')
    plt.close()
    return network_analysis