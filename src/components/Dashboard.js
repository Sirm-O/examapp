import React from 'react';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Exam Management */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Exam Management
              </Typography>
              <Button 
                component={RouterLink} 
                to="/exams" 
                variant="contained" 
                color="primary"
                fullWidth
              >
                Manage Exams
              </Button>
            </Paper>
          </Grid>

          {/* Student Management */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Student Management
              </Typography>
              <Button 
                component={RouterLink} 
                to="/students" 
                variant="contained" 
                color="primary"
                fullWidth
              >
                Manage Students
              </Button>
            </Paper>
          </Grid>

          {/* Results Management */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Results Management
              </Typography>
              <Button 
                component={RouterLink} 
                to="/results" 
                variant="contained" 
                color="primary"
                fullWidth
              >
                View Results
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
