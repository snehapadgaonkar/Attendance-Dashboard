import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminRegister } from "../../services/api.ts"; // Adjust the import path

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await adminRegister(username, password, email);
      setMessage(response.message || "Registration successful. Please log in.");
      
      // Optional: Redirect to login page after registration
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
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
        <Typography variant="h4" align="center">Register</Typography>
        <form onSubmit={handleRegister}>
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
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
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

export default Register;
