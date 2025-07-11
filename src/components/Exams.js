import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Mock data
const forms = [
  { id: 1, name: 'Form 1' },
  { id: 2, name: 'Form 2' },
  { id: 3, name: 'Form 3' },
  { id: 4, name: 'Form 4' },
];

const exams = [
  { id: 1, name: 'End Term 1', formId: 4, date: '2025-07-01', subjects: 10 },
  { id: 2, name: 'End Term 2', formId: 3, date: '2025-06-15', subjects: 8 },
  { id: 3, name: 'End Term 3', formId: 2, date: '2025-05-30', subjects: 7 },
];

const Exams = () => {
  const [selectedForm, setSelectedForm] = React.useState(forms[0]);

  const filteredExams = exams.filter(exam => exam.formId === selectedForm.id);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Exam Management
        </Typography>
      </Box>

      {/* Form Selector */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select Form
        </Typography>
        <Grid container spacing={2}>
          {forms.map(form => (
            <Grid item xs={12} sm={6} md={3} key={form.id}>
              <Paper 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  cursor: 'pointer',
                  bgcolor: selectedForm.id === form.id ? 'primary.main' : 'background.paper'
                }}
                onClick={() => setSelectedForm(form)}
              >
                <Typography variant="h6" color={selectedForm.id === form.id ? 'white' : 'primary'}>
                  {form.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Exam List */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Exams
        </Typography>
        <Grid container spacing={3}>
          {filteredExams.map((exam) => (
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

export default Exams;
