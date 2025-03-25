import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './page/machine/redux/store';  // Use default import
import { store as storefinancial } from './store/store';
import { store as order } from "./page/order/redux/store"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <React.StrictMode>
<Provider store={store}>
  <Provider store={storefinancial}>
  <Provider store={order}>
    <App />
  </Provider>
</Provider>
</Provider>
</React.StrictMode>

);

reportWebVitals();
