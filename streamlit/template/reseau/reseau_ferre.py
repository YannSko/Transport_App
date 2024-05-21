from datetime import datetime
import plotly.express as px
import streamlit as st
import pandas as pd
import folium
import json

file_path = './template/reseau/traces-du-reseau-ferre-idf.json'
with open(file_path, 'r') as file:
    data_json = json.load(file)

features = data_json["features"]
data = []

for feature in features:
    properties = feature["properties"]
    if "date_mes" not in properties:
        continue
    else:
        date_mes = datetime.fromisoformat(properties["date_mes"][:-1]).strftime('%Y-%m-%d')
        shape_leng = properties["shape_leng"]
        data.append({"date_mes": date_mes, "shape_leng": shape_leng})
        
    if "mode" not in properties:
        continue
    else:
        mode = properties["mode"]
        shape_leng = properties["shape_leng"]
        reseau = properties["reseau"]
        exploitant = properties["exploitant"]
        data.append({"mode": mode, "shape_leng": shape_leng, "reseau": reseau, "exploitant": exploitant})

df = pd.DataFrame(data)

st.title("Visualisation des Données de Transport")

fig_bar = px.bar(df, x="date_mes", y="shape_leng", title="Quantité de lignes posées par année")
fig_bar.update_yaxes(range=[0, 300000])
st.plotly_chart(fig_bar)

df['date_mes'] = pd.to_datetime(df['date_mes'])

df['year'] = df['date_mes'].dt.year
df['month'] = df['date_mes'].dt.strftime('%m')  

stations_per_year = df.groupby('year').size().reset_index(name='count')

stations_per_month = df.groupby('month').size().reset_index(name='count')

fig_year = px.bar(stations_per_year, x='year', y='count', title='Nombre de gares ouvertes par année')
fig_month = px.bar(stations_per_month, x='month', y='count', title='Nombre de gares ouvertes par mois')

st.plotly_chart(fig_year)
st.plotly_chart(fig_month)

fig = px.box(df, x='mode', y='shape_leng', title='Quantit de lignes construites par mode de transport')
st.plotly_chart(fig)

fig_reseau = px.histogram(df, x='reseau', title='Distribution des modes de transports')
fig_exploitant = px.histogram(df, x='exploitant', title='Distribution des opraeteurs de transport')

st.plotly_chart(fig_reseau, use_container_width=True)
st.plotly_chart(fig_exploitant, use_container_width=True)

# nouveau json

# def parse_json(json_data):
#     data = []

#     for feature in json_data["features"]:
#         properties = feature["properties"]
#         creation = properties.get("creation", 0)
#         prolong = properties.get("prolong", 0)
#         amelior = properties.get("amelior", 0)
#         mode = properties.get("mode", "Unknown")
#         phase = properties.get("phase", "Unknown")

#         data.append({"Creation": creation, "Prolong": prolong, "Amelior": amelior, "Mode": mode, "Phase": phase})

#     return pd.DataFrame(data)

# file_path = 'projets_lignes_idf.json'
# with open(file_path, 'r') as file:
#     data_json = json.load(file)
    
# df = parse_json(data_json)

# def create_map(df):
#     m = folium.Map(location=[48.9, 2.3], zoom_start=12)  # Centered roughly around the given coordinates

#     # Adding features to the map
#     for feature in df['features']:
#         if feature['geometry']['type'] == 'LineString':
#             folium.PolyLine(locations=feature['geometry']['coordinates'], color=feature['properties']['rvb']).add_to(m)

#     return m

# # App layout
# st.title("GeoJSON Visualization")

# # Display map
# st.subheader("Map")
# folium_map = create_map(df)
# folium_static(folium_map)