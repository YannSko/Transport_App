import os
import pandas as pd
import matplotlib.pyplot as plt
import streamlit as st
from concurrent.futures import ThreadPoolExecutor

# Fonction pour lire un fichier CSV
def read_csv(file_path):
    return pd.read_csv(file_path)

# Fonction pour traiter tous les fichiers CSV dans un dossier
def process_files(directory):
    files = [os.path.join(directory, file) for file in os.listdir(directory) if file.endswith('.csv')]
    with ThreadPoolExecutor() as executor:
        df_list = list(executor.map(read_csv, files))
    return pd.concat(df_list, ignore_index=True)

# Fonction pour afficher les validations par jour avec un graphique
def display_validation():
    st.title("Validation")
    st.write("Description des validations par jours")

    # Définir le chemin du répertoire contenant les fichiers CSV
    csv_directory = "validation"
    
    # Traiter les fichiers CSV
    all_data = process_files(csv_directory)
    
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
