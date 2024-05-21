import streamlit as st
from template.validation import validation
from template.reseau import reseau_ferre

st.title("Application Streamlit avec Modules")

option = st.sidebar.selectbox(
    'Choisissez un module Ã afficher',
    ('Aucun', 'Validation')
)

if option == 'Validation':
    validation()
elif option == 'reseau':
    reseau_ferre()