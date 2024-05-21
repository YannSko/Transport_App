import streamlit as st
from template.validation import display_validation

st.title("Application Streamlit avec Modules")

option = st.sidebar.selectbox(
    'Choisissez un module à afficher',
    ('Aucun', 'Validation')
)

if option == 'Validation':
    display_validation()