import { UserContextProvider } from './components/UserContext';
import './index.css'
import axios from 'axios'
import Routes from './components/Routes';


function App() {
  axios.defaults.baseURL = 'http://localhost:3000'
  axios.defaults.withCredentials = true;
  return (
    <div className="App">
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  );
}

export default App
