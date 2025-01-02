import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Updated import
import { BASE_URL, setAuthToken } from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Updated usage

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      const token = response.data.token;
      setAuthToken(token);
      localStorage.setItem('token', token);  // Store token in localStorage
      navigate('/dashboard');  // Updated navigation method
    } catch (err) {
      setError('Invalid credentials or something went wrong');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Login;
