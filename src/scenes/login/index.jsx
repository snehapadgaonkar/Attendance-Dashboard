import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { adminLogin } from "../../services/api.ts"; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(username, password);
      setMessage(response.data.message);
      login();
      navigate("/dashboard");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full height to center vertically
      }}
    >
      <Box sx={{ maxWidth: 400, width: '100%', p: 3, bgcolor: '#7564C0', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h4" align="center">Login</Typography>
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
    </Box>
  );
};

export default Login;
