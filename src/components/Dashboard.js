import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Mock data
const stats = {
  totalStudents: 120,
  totalExams: 15,
  totalSubjects: 10,
  meanScore: 75.5,
};

const exams = [
  { id: 1, name: 'Form 4 End Term 1', date: '2025-07-01', subjects: 10 },
  { id: 2, name: 'Form 3 End Term 2', date: '2025-06-15', subjects: 8 },
  { id: 3, name: 'Form 2 End Term 3', date: '2025-05-30', subjects: 7 },
];

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Students
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.totalStudents}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Exams
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.totalExams}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Subjects
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.totalSubjects}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Mean Score
            </Typography>
            <Typography variant="h4" color="primary">
              {stats.meanScore}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Exams */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Exams
        </Typography>
        <Grid container spacing={3}>
          {exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {exam.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {new Date(exam.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {exam.subjects} Subjects
                </Typography>
                <Button 
                  component={RouterLink} 
                  to={`/exams/${exam.id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View Results
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
