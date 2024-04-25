// import axios from 'axios';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './screens/home'
import Itineraire from './screens/itineraire';
import FindAddress from './screens/address';

const router = createBrowserRouter([
  {
    path: "/",
    element : <Home/>
  },
  {
    path: "/itineraire",
    element : <Itineraire/>
  },
  {
    path: "/find_address",
    element : <FindAddress/>
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;