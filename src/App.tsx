import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

export default function App() {
  return (
    <Router>
      <Container>
        <Typography variant="h1">Kenyan Exam Manager</Typography>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Welcome to Kenyan Exam Manager</h2>
      <p>This is a web application for managing exams.</p>
    </div>
  );
}
