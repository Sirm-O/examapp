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

function Exams() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exam Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage your exams here.
      </Typography>
    </Box>
  );
}

function Students() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage your students here.
      </Typography>
    </Box>
  );
}

function Results() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Results Management
      </Typography>
      <Typography variant="body1" paragraph>
        View and manage exam results here.
      </Typography>
    </Box>
  );
}

function App() {
  return (
    <Container maxWidth="lg">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/students" element={<Students />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Container>
  );
}

export default App;
