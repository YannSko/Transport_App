Paris Transport

This project explores how Paris and its suburbs adapt their railway network to meet mobility needs and address related issues.
Overview
History of the Paris Metro
Past

    Necessity: Why was the metro needed? (growing population, London model)
    Construction: How was it built? (number of workers, construction time, quantity of materials used, types)
    Meeting Needs: How did it meet the needs of its time? (number of users, satisfaction)
    Evolution: How have the railway routes evolved and how has the Paris model extended to the suburbs (intra/extra km, interactive graph)

Present

    Current Structure: Interactive map, traffic, starting points
    Line Usage: Evolution graph
    Global Stats: Network statistics
    Modernization: Modernization of lines

Future

    Evolution: Future developments

Application
ML Module with Streamlit

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

Hosting

Reserved for Augustin.
