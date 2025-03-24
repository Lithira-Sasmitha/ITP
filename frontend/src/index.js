import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './page/machine/redux/store';  // Use default import
import reportWebVitals from './reportWebVitals'
import  {storefinancial} from './store/store'
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <React.StrictMode>
    <Provider store={store && storefinancial}>
      <App />
    </Provider>
  </React.StrictMode>

);

reportWebVitals();
