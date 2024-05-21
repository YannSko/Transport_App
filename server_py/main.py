from model import pred
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

@app.route('/prediction', methods=['POST'])
def prediction():
    data = request.json['data']
    prediction = pred.predict_problems(data)
    
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True, port=5000)