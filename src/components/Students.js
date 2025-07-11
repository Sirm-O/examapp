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

const students = [
  { id: 1, name: 'John Doe', formId: 4, admissionNumber: '2025/001' },
  { id: 2, name: 'Jane Smith', formId: 4, admissionNumber: '2025/002' },
  { id: 3, name: 'Mike Johnson', formId: 3, admissionNumber: '2025/003' },
];

const Students = () => {
  const [selectedForm, setSelectedForm] = React.useState(forms[0]);

  const filteredStudents = students.filter(student => student.formId === selectedForm.id);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Management
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

      {/* Student List */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Students
        </Typography>
        <Grid container spacing={3}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {student.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {student.admissionNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Form {selectedForm.name}
                </Typography>
                <Button 
                  component={RouterLink} 
                  to={`/students/${student.id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Students;
