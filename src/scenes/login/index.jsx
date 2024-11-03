import React, { useState } from "react"; // Only import React once
import { Box, Typography, TextField, Button } from "@mui/material"; // Consolidate MUI imports
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path
import { adminLogin } from "../../services/api.ts"; // Adjust the import path

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting to log in with:', { username, password }); // Log input values
    try {
      const response = await adminLogin(username, password);
      console.log('Login response:', response.data); // Log the response data
      setMessage(response.data.message);
      login(); // Update authentication state
      navigate("/dashboard"); // Redirect to the dashboard

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error('Login error:', error); // Log the error
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h4" align="center">
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      {message && (
        <Typography color={message.includes('successful') ? 'success.main' : 'error.main'} align="center">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Login;
