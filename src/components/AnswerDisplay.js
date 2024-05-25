import React from 'react';
import { Typography } from '@mui/material';

const AnswerDisplay = ({ answer }) => {
  return (
    <div>
      <Typography variant="h6">Answer</Typography>
      <Typography>{answer}</Typography>
    </div>
  );
};

export default AnswerDisplay;
