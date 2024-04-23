import axios from 'axios';
import './App.css';

const apiCall = () => {
  axios.get('http://localhost:3001/').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}

export default function App() {
  return (
    <div className="App">
      <header className="App-header">

        <button onClick={apiCall}>Make API Call</button>

      </header>
    </div>
  );
}