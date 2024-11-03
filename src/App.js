import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Login from "./scenes/login";
import Calendar from "./scenes/calendar/calendar";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation(); // Get current location

  const isLoginPage = location.pathname === "/"; // Check if the current page is the login page

  return (
    <AuthProvider> {/* Wrap your app with AuthProvider */}
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {!isLoginPage && <Sidebar isSidebar={isSidebar} />} {/* Render sidebar only if not on login page */}
            <main className="content">
              {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />} {/* Render topbar only if not on login page */}
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/team" element={
                  <PrivateRoute>
                    <Team />
                  </PrivateRoute>
                } />
                <Route path="/contacts" element={
                  <PrivateRoute>
                    <Contacts />
                  </PrivateRoute>
                } />
                <Route path="/form" element={
                  <PrivateRoute>
                    <Form />
                  </PrivateRoute>
                } />
                <Route path="/bar" element={
                  <PrivateRoute>
                    <Bar />
                  </PrivateRoute>
                } />
                <Route path="/pie" element={
                  <PrivateRoute>
                    <Pie />
                  </PrivateRoute>
                } />
                <Route path="/line" element={
                  <PrivateRoute>
                    <Line />
                  </PrivateRoute>
                } />
                <Route path="/calendar" element={
                  <PrivateRoute>
                    <Calendar />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
