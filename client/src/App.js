// import axios from 'axios';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './screens/home'
import Itineraire from './screens/itineraire';

const router = createBrowserRouter([
  {
    path: "/",
    element : <Home/>
  },
  {
    path: "/itineraire",
    element : <Itineraire/>
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;