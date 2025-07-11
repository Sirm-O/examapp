import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';

const Settings = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* School Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              School Settings
            </Typography>
            <Typography variant="body1" gutterBottom>
              Configure your school's basic information
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Edit School Info
            </Button>
          </Paper>
        </Grid>

        {/* Exam Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Exam Settings
            </Typography>
            <Typography variant="body1" gutterBottom>
              Configure exam grading system and settings
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Edit Exam Settings
            </Button>
          </Paper>
        </Grid>

        {/* User Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Settings
            </Typography>
            <Typography variant="body1" gutterBottom>
              Manage user accounts and permissions
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Manage Users
            </Button>
          </Paper>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Settings
            </Typography>
            <Typography variant="body1" gutterBottom>
              Configure system preferences and options
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              System Preferences
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
