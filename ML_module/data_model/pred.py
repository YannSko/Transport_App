import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def predict_problems(res_com_list):
    try:
        # Charger le modèle sauvegardé
        model = joblib.load('detect_issue.pkl')
        
        # Vérifier si l'entrée est une liste ou une chaîne unique
        if isinstance(res_com_list, str):
            res_com_list = [res_com_list]
        
        # Créer un DataFrame à partir des données d'entrée
        df_input = pd.DataFrame(res_com_list, columns=['res_com'])

        # Load the template of the original features
        template = pd.read_csv('df_with_problems.csv', nrows=1).drop(['problème'], axis=1)
        
        if 'JOUR' in template.columns:
            template['JOUR'] = pd.to_datetime(template['JOUR'])
            template['year'] = template['JOUR'].dt.year
            template['month'] = template['JOUR'].dt.month
            template['day'] = template['JOUR'].dt.day
            template.drop(['JOUR'], axis=1, inplace=True)
        
        # Fill the template with default values and the input 'res_com'
        for col in template.columns:
            if col != 'res_com':
                if template[col].dtype == 'object':
                    df_input[col] = template[col].iloc[0]
                else:
                    df_input[col] = template[col].mean()  # or another appropriate default value

        # Appliquer les mêmes transformations que lors de l'entraînement
        le_res_com = LabelEncoder()
        le_res_com.fit(list(template['res_com']) + list(df_input['res_com'].unique()))  # Fit with all possible labels
        df_input['res_com'] = le_res_com.transform(df_input['res_com'])

        # Apply transformations for other categorical variables
        categorical_cols = template.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if col != 'res_com':
                le = LabelEncoder()
                le.fit(list(template[col]) + list(df_input[col].unique()))  # Fit with all possible labels
                df_input[col] = le.transform(df_input[col])

        # Check and add missing date-related columns to the input DataFrame
        if 'year' not in df_input.columns:
            df_input['year'] = template['year'].iloc[0]
        if 'month' not in df_input.columns:
            df_input['month'] = template['month'].iloc[0]
        if 'day' not in df_input.columns:
            df_input['day'] = template['day'].iloc[0]

        # Apply scaling for numerical variables
        numerical_cols = template.select_dtypes(include=[np.number]).columns
        scaler = StandardScaler()
        scaler.fit(template[numerical_cols])
        df_input[numerical_cols] = scaler.transform(df_input[numerical_cols])

        # Faire des prédictions de probabilités
        predictions = model.predict_proba(df_input)[:, 1] 
        
        return predictions
    except Exception as e:
        print(f"An error occurred: {e}")
        return None