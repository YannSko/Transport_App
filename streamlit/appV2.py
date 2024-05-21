import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import streamlit as st
import folium
from streamlit_folium import folium_static
import os
from concurrent.futures import ThreadPoolExecutor
import json
from datetime import datetime
import plotly.express as px

# Charger les données
csv_file_path_population = "D:\\Transport_App\\ML_module\\data_model\\population_evol_depart\\nombre-de-residences-principales-des-communes-dile-de-france-donnee-insee0.csv"
df_population = pd.read_csv(csv_file_path_population, delimiter=';')

population_columns = ['rp1962', 'rp1968', 'rp1975', 'rp1982', 'rp1990', 'rp1999', 'rp2006', 'rp2007', 'rp2008', 'rp2009', 'rp2010', 'rp2011', 'rp2012', 'rp2013', 'rp2014', 'rp2015', 'rp2016', 'rp2017']

st.title("Graphiques")

# Calculer la moyenne de la population par année
population_mean = df_population[population_columns].mean().reset_index()
population_mean.columns = ['Année', 'Population Moyenne']

# Convertir l'année en format entier
population_mean['Année'] = population_mean['Année'].str.extract('(\d+)').astype(int)

# Titre de l'application
st.title("Évolution de la Population Moyenne par Année")

# Graphique de l'évolution de la population moyenne par année
plt.figure(figsize=(12, 8))
sns.lineplot(x='Année', y='Population Moyenne', data=population_mean, marker='o', color='b')
plt.title('Évolution de la population moyenne par année')
plt.xlabel('Année')
plt.ylabel('Population Moyenne')
plt.xticks(rotation=45)
plt.grid(True)
st.pyplot(plt)

# Calculer l'augmentation de la population entre 1962 et 2017
df_population['Augmentation_1962_2017'] = df_population['rp2017'] - df_population['rp1962']

# Graphique 1 : Évolution de la population pour les 10 communes les plus peuplées en 2017
st.header("Évolution de la population des 10 communes les plus peuplées")
top10_communes = df_population.nlargest(10, 'rp2017')

plt.figure(figsize=(14, 8))
for idx, row in top10_communes.iterrows():
    plt.plot(population_columns, row[population_columns], marker='o', label=row['insee'])
plt.title("Évolution de la population des 10 communes les plus peuplées")
plt.xlabel("Année")
plt.ylabel("Population")
plt.legend(title='Code INSEE')
plt.grid(True)
st.pyplot(plt)

# Graphique 2 : Comparaison de la population entre 1962 et 2017 pour chaque commune
st.header("Comparaison de la population entre 1962 et 2017 pour les 20 communes avec la plus forte croissance")
df_population['Croissance_1962_2017'] = df_population['rp2017'] - df_population['rp1962']

plt.figure(figsize=(14, 8))
sns.barplot(data=df_population.sort_values(by='Croissance_1962_2017', ascending=False).head(20),
            x='Croissance_1962_2017', y='insee', palette='viridis')
plt.title('Comparaison de la population entre 1962 et 2017 pour les 20 communes avec la plus forte croissance')
plt.xlabel('Croissance de la population')
plt.ylabel('Commune (Code INSEE)')
plt.grid(True)
st.pyplot(plt)

# Graphique 3 : Top 10 des communes avec la plus forte croissance de population entre 1962 et 2017
st.header("Top 10 des communes avec la plus forte croissance de population entre 1962 et 2017")
top10_croissance = df_population.nlargest(10, 'Croissance_1962_2017')

plt.figure(figsize=(14, 8))
sns.barplot(data=top10_croissance, x='Croissance_1962_2017', y='insee', palette='coolwarm')
plt.title('Top 10 des communes avec la plus forte croissance de population entre 1962 et 2017')
plt.xlabel('Croissance de la population')
plt.ylabel('Commune (Code INSEE)')
plt.grid(True)
st.pyplot(plt)

# Graphique 4 : Répartition de la population par commune en 2017
st.header("Répartition de la population par commune")
plt.figure(figsize=(14, 8))
sns.barplot(data=df_population.sort_values(by='rp2017', ascending=False).head(20), x='rp2017', y='insee', palette='magma')
plt.title('Répartition de la population par commune')
plt.xlabel('Population en 2017')
plt.ylabel('Commune (Code INSEE)')
plt.grid(True)
st.pyplot(plt)

# Graphique 5 : Carte des communes avec la population en 2017
st.header("Carte des communes avec la population en 2017")
df_population[['lat', 'lon']] = df_population['Geo Point'].str.split(',', expand=True)
df_population['lat'] = df_population['lat'].astype(float)
df_population['lon'] = df_population['lon'].astype(float)

map_population = folium.Map(location=[48.8566, 2.3522], zoom_start=10)

for idx, row in df_population.iterrows():
    if not pd.isna(row['lat']) and not pd.isna(row['lon']) and not pd.isna(row['rp2017']):
        folium.CircleMarker(
            location=[row['lat'], row['lon']],
            radius=5,
            popup=f"{row['insee']} - Population 2017: {int(row['rp2017'])}",
            color='blue',
            fill=True,
            fill_color='blue'
        ).add_to(map_population)

folium_static(map_population)

# Fonction pour lire un fichier CSV
def read_csv(file_path):
    return pd.read_csv(file_path)

# Fonction pour traiter tous les fichiers CSV dans un dossier
def process_files(directory):
    files = [os.path.join(directory, file) for file in os.listdir(directory) if file.endswith('.csv')]
    if not files:
        st.error("Aucun fichier CSV trouvé dans le répertoire spécifié.")
        return pd.DataFrame()  # Retourne un DataFrame vide
    with ThreadPoolExecutor() as executor:
        df_list = list(executor.map(read_csv, files))
    return pd.concat(df_list, ignore_index=True)

# Fonction pour afficher les validations par jour avec un graphique
def display_validation():
    st.title("Validation")
    st.write("Description des validations par jours")

    # Définir le chemin du répertoire contenant les fichiers CSV
    csv_directory = "D:\Transport_App\streamlit"
    
    # Traiter les fichiers CSV
    all_data = process_files(csv_directory)
    
    if all_data.empty:
        st.error("Le DataFrame combiné est vide. Vérifiez les fichiers CSV et réessayez.")
        return

    # Convertir la colonne 'JOUR' en datetime
    all_data['JOUR'] = pd.to_datetime(all_data['JOUR'], format='%d/%m/%Y')

    # Afficher une description des validations par jour
    validations_per_day = all_data.groupby('JOUR')['NB_VALD'].sum().reset_index()
    fig, ax = plt.subplots()
    ax.plot(validations_per_day['JOUR'], validations_per_day['NB_VALD'], marker='o')
    ax.set_title('Nombre de validations par jour')
    ax.set_xlabel('Jour')
    ax.set_ylabel('Nombre de validations')
    ax.grid(True)
    st.pyplot(fig)

    # Afficher une description des validations par région
    validations_per_region = all_data.groupby('CODE_STIF_RES')['NB_VALD'].sum().reset_index()
    fig, ax = plt.subplots()
    ax.bar(validations_per_region['CODE_STIF_RES'], validations_per_region['NB_VALD'])
    ax.set_title('Nombre de validations par région')
    ax.set_xlabel('Région')
    ax.set_ylabel('Nombre de validations')
    ax.grid(True)
    st.pyplot(fig)

    # Afficher une description des validations par jour de la semaine
    all_data['DayOfWeek'] = all_data['JOUR'].dt.day_name()
    validations_per_dayofweek = all_data.groupby('DayOfWeek')['NB_VALD'].sum().reindex(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).reset_index()
    fig, ax = plt.subplots()
    ax.bar(validations_per_dayofweek['DayOfWeek'], validations_per_dayofweek['NB_VALD'])
    ax.set_title('Nombre de validations par jour de la semaine')
    ax.set_xlabel('Jour de la semaine')
    ax.set_ylabel('Nombre de validations')
    ax.grid(True)
    st.pyplot(fig)

    # Afficher une description des validations par titre
    validations_per_title = all_data.groupby('CATEGORIE_TITRE')['NB_VALD'].sum().reset_index()
    fig, ax = plt.subplots()
    ax.bar(validations_per_title['CATEGORIE_TITRE'], validations_per_title['NB_VALD'])
    ax.set_title('Nombre de validations par titre')
    ax.set_xlabel('Titre')
    ax.set_ylabel('Nombre de validations')
    ax.grid(True)
    st.pyplot(fig)

display_validation()


# Charger les données
csv_file_path_chantiers = "D:\\Transport_App\\ML_module\\data\\CSV_Cool\\TravauxSNCF_RATP_2019-2022.csv"
df_chantiers = pd.read_csv(csv_file_path_chantiers, delimiter=';')

# Convertir les dates en datetime
df_chantiers['Date début du chantier'] = pd.to_datetime(df_chantiers['Date début du chantier'], errors='coerce')
df_chantiers['Date fin du chantier'] = pd.to_datetime(df_chantiers['Date fin du chantier'], errors='coerce')

# Calculer la durée des chantiers
df_chantiers['Durée (jours)'] = (df_chantiers['Date fin du chantier'] - df_chantiers['Date début du chantier']).dt.days

# Extraire l'année de début du chantier
df_chantiers['Année début'] = df_chantiers['Date début du chantier'].dt.year

# Titre de l'application
st.title("Analyse des Chantiers SNCF RATP (2019-2022)")

# Exemple 1 : Répartition des chantiers par commune
st.header("Répartition des chantiers par commune")
plt.figure(figsize=(12, 8))
sns.countplot(y='Code postal arrondissement - Commune', data=df_chantiers, order=df_chantiers['Code postal arrondissement - Commune'].value_counts().index)
plt.title('Répartition des chantiers par commune')
plt.xlabel('Nombre de chantiers')
plt.ylabel('Commune')
st.pyplot(plt)

# Exemple 2 : Durée des chantiers
st.header("Distribution de la durée des chantiers")
plt.figure(figsize=(12, 8))
sns.histplot(df_chantiers['Durée (jours)'].dropna(), bins=30, kde=True)
plt.title('Distribution de la durée des chantiers')
plt.xlabel('Durée (jours)')
plt.ylabel('Nombre de chantiers')
st.pyplot(plt)

# Graphique du nombre de chantiers par année
st.header("Nombre de chantiers par année")
plt.figure(figsize=(12, 8))
sns.countplot(x='Année début', data=df_chantiers, palette='viridis')
plt.title('Nombre de chantiers par année')
plt.xlabel('Année')
plt.ylabel('Nombre de chantiers')
plt.xticks(rotation=45)
st.pyplot(plt)

# Calculer la durée moyenne par année
mean_duration_per_year = df_chantiers.groupby('Année début')['Durée (jours)'].mean().reset_index()

# Graphique de la durée moyenne des chantiers par année
st.header("Durée moyenne des chantiers par année")
plt.figure(figsize=(12, 8))
sns.lineplot(x='Année début', y='Durée (jours)', data=mean_duration_per_year, marker='o', color='b')
plt.title('Durée moyenne des chantiers par année')
plt.xlabel('Année')
plt.ylabel('Durée moyenne (jours)')
plt.xticks(rotation=45)
st.pyplot(plt)

# Carte des chantiers
st.header("Carte des chantiers")
df_chantiers[['lat', 'lon']] = df_chantiers['geo_point_2d'].str.split(',', expand=True)
df_chantiers['lat'] = df_chantiers['lat'].astype(float)
df_chantiers['lon'] = df_chantiers['lon'].astype(float)

map_chantiers = folium.Map(location=[48.8566, 2.3522], zoom_start=12)

for idx, row in df_chantiers.iterrows():
    if not pd.isna(row['lat']) and not pd.isna(row['lon']):
        folium.Marker(
            location=[row['lat'], row['lon']],
            popup=f"{row['Référence Chantier']} - {row['Synthèse - Nature du chantier']}",
            tooltip=row['Synthèse - Nature du chantier']
        ).add_to(map_chantiers)

folium_static(map_chantiers)

# Chemin vers le fichier JSON
file_path = r'D:\Transport_App\streamlit\template\reseau\traces-du-reseau-ferre-idf.json'  # Chemin correct vers le fichier JSON

# Charger les données du fichier JSON
try:
    with open(file_path, 'r', encoding='utf-8') as file:
        data_json = json.load(file)
except FileNotFoundError:
    st.error(f"Le fichier {file_path} est introuvable. Veuillez vérifier le chemin et réessayer.")
    st.stop()

features = data_json["features"]
data = []

for feature in features:
    properties = feature["properties"]
    if "date_mes" in properties:
        date_mes = datetime.fromisoformat(properties["date_mes"][:-1]).strftime('%Y-%m-%d')
        shape_leng = properties["shape_leng"]
        data.append({"date_mes": date_mes, "shape_leng": shape_leng})
    if "mode" in properties:
        mode = properties["mode"]
        shape_leng = properties["shape_leng"]
        reseau = properties["reseau"]
        exploitant = properties["exploitant"]
        data.append({"mode": mode, "shape_leng": shape_leng, "reseau": reseau, "exploitant": exploitant})

df = pd.DataFrame(data)

st.title("Visualisation des Données de Transport")

# Graphique : Quantité de lignes posées par année
fig_bar = px.bar(df, x="date_mes", y="shape_leng", title="Quantité de lignes posées par année")
fig_bar.update_yaxes(range=[0, 300000])
st.plotly_chart(fig_bar)

df['date_mes'] = pd.to_datetime(df['date_mes'])

df['year'] = df['date_mes'].dt.year
df['month'] = df['date_mes'].dt.strftime('%m')

stations_per_year = df.groupby('year').size().reset_index(name='count')
stations_per_month = df.groupby('month').size().reset_index(name='count')

# Graphique : Nombre de gares ouvertes par année
fig_year = px.bar(stations_per_year, x='year', y='count', title='Nombre de gares ouvertes par année')
st.plotly_chart(fig_year)

# Graphique : Nombre de gares ouvertes par mois
fig_month = px.bar(stations_per_month, x='month', y='count', title='Nombre de gares ouvertes par mois')
st.plotly_chart(fig_month)

# Graphique : Quantité de lignes construites par mode de transport
fig = px.box(df, x='mode', y='shape_leng', title='Quantité de lignes construites par mode de transport')
st.plotly_chart(fig)

# Graphique : Distribution des modes de transports
fig_reseau = px.histogram(df, x='reseau', title='Distribution des modes de transports')
st.plotly_chart(fig_reseau, use_container_width=True)

# Graphique : Distribution des opérateurs de transport
fig_exploitant = px.histogram(df, x='exploitant', title='Distribution des opérateurs de transport')
st.plotly_chart(fig_exploitant, use_container_width=True)