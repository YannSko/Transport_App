from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

with open('./modele/issue_prev_2.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/prediction', methods=['POST'])
def prediction():
    data = request.json['data']
    prediction = model.predict([data])[0]
    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True, port=5000)