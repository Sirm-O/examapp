import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function Home() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Kenyan Exam Manager
      </Typography>
      <Typography variant="body1" paragraph>
        This is a web application for managing exams.
      </Typography>
      <Button 
        component={Link} 
        to="/dashboard" 
        variant="contained" 
        color="primary"
      >
        Get Started
      </Button>
    </Box>
  );
}

function App() {
  return (
    <Container maxWidth="lg">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Container>
  );
}

export default App;
