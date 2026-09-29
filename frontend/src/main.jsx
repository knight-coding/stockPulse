import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Providers from "./context/";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Providers.ThemeProvider>
        <Providers.AuthProvider>
            <App />
        </Providers.AuthProvider>
    </Providers.ThemeProvider>
  </BrowserRouter>
);