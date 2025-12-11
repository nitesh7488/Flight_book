import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
     <PersistGate loading={<div>Loading Session...</div>} persistor={persistor}>
      <BrowserRouter  future={{
         v7_startTransition: true,
         v7_relativeSplatPath: true
         }}>
        <App />
      </BrowserRouter>
     </PersistGate>

    </Provider>
  </React.StrictMode>
);
