# Paris Transport

This project explores how Paris and its suburbs adapt their railway network to meet mobility needs and address related issues.

## How to launch :

Go to server folder and create a .env file with your IDF mobilité API key

Open a Termial :

    $ cd server
    $ npm i
    $ npm start
    
Open another Terminal :

    $ cd client
    $ npm i 
    $ npm start

The server is nox running on the port 3000, enter this to test it :

    http://localhost:3001/getAddress?q=rue
    
The app is running in the port 3001, enter this to see :

    http://localhost:3000/


## ML Module with Streamlit

In the ML_module folder:

    Data: Contains all open-source data collected
    Data Model: Contains all data for model training

Files

All files are for processing or plotting CSV data:

    Model Development: final_model_dev.ipynb (notebook for model development)
    CSV for Model: df_with_problems.csv (CSV file used by the model)
    Model File: detect_issue.pkl (trained model)
    Prediction Script: pred.py (script for running predictions based on transport routes)

Streamlit Application

For the Streamlit application containing all graphs about the history and current state of the Île-de-France region:

    Navigate to the streamlit directory.

    Run the application:

    bash

    streamlit run appV2.py

