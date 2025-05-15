// index.js - Updated imports to match your export patterns

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css'; 
// Import stores with correct export names
import {store as machineStore} from './page/machine/redux/store';
// For named exports, use the correct import syntax
import { store as financialStore } from './store/store';
import { store as orderStore } from './page/order/redux/store';

// Create a CombinedStoreProvider component to handle multiple stores
// Note: This is not the recommended Redux approach, but will work as a temporary solution
const CombinedStoreProvider = ({ children }) => {
  return (
    // Nest the providers - the innermost provider will have priority for state access
    <Provider store={machineStore}>
      <Provider store={orderStore}>
        <Provider store={financialStore}>
          {children}
        </Provider>
      </Provider>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CombinedStoreProvider>
      <App />
    </CombinedStoreProvider>
  </React.StrictMode>
);