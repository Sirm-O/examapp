import React from 'react';
import { Container, Typography, Box, Tabs, Tab, AppBar, Toolbar, Button } from '@mui/material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Exams from './components/Exams';
import Students from './components/Students';
import Settings from './components/Settings';

function TabNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    switch (location.pathname) {
      case '/':
        setValue(0);
        break;
      case '/exams':
        setValue(1);
        break;
      case '/students':
        setValue(2);
        break;
      case '/settings':
        setValue(3);
        break;
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/exams');
        break;
      case 2:
        navigate('/students');
        break;
      case 3:
        navigate('/settings');
        break;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          School Exam Manager
        </Typography>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Dashboard" />
          <Tab label="Exams" />
          <Tab label="Students" />
          <Tab label="Settings" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TabNav />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/students" element={<Students />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
