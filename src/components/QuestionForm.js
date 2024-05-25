import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';

const QuestionForm = ({ documentId, onAnswerReceived }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/ask/', {
        document_id: documentId,
        question: question,
      });
      onAnswerReceived(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Ask a Question</Typography>
      <TextField
        label="Question"
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Button variant="contained" type="submit">
        Ask
      </Button>
    </form>
  );
};

export default QuestionForm;
