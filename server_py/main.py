from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

with open('./modele/issue_prev_2.pkl', 'rb') as f:
    model = pickle.load(f)
    
df = pd.read_csv("merged_df.csv")

@app.route('/prediction', methods=['POST'])
def prediction():
    data = request.json['data']
    
    example_station_id = df.iloc[0]['station_id']
    example_row = df[df['station_id'] == example_station_id].drop(columns=['probleme']).iloc[0].to_frame().T
    example_prediction = model.predict(example_row)[0]
    example_proba = model.predict_proba(example_row)[0]
    
    return jsonify({'prediction': example_prediction, 'probability': example_proba})

if __name__ == '__main__':
    app.run(debug=True, port=5000)