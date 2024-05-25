# PDF NLP Application

This is a PDF NLP application built with FastAPI and React. The backend extracts text from uploaded PDF files and allows users to ask questions about the content. The frontend is a React application that interacts with the FastAPI backend.

## Table of Contents
- [Overview](#overview)
- [Application Architecture](#application-architecture)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)

## Overview

The PDF NLP Application allows users to upload PDF documents and ask questions about their content. The backend extracts the text from the PDF, stores it in a database, and uses a pre-trained NLP model to answer questions based on the extracted text. The frontend provides a user-friendly interface for interacting with the backend.

## Application Architecture

- **Backend**: FastAPI
  - Extracts text from uploaded PDFs
  - Stores extracted text in a database
  - Provides an API for uploading PDFs and asking questions
  - Uses a pre-trained NLP model (`deepset/roberta-base-squad2`) for question answering

- **Frontend**: React
  - Allows users to upload PDFs
  - Enables users to ask questions about the content of uploaded PDFs
  - Displays the extracted text and answers from the backend

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/pdf-nlp-app.git
   cd pdf-nlp-app/backend

   
2.**Create a virtual environment**:
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3.**Install the dependencies**:
pip install -r requirements.txt

4.**Run the FastAPI application**:
uvicorn main:app --reload




### Frontend Setup
Navigate to the frontend directory:

1.Install the dependencies:
npm install

2.Start the React application:
npm start


## API Documentation

Upload PDF
Endpoint: /upload/
Method: POST
Description: Uploads a PDF file and extracts its text content.
Request:
file: PDF file to be uploaded
Response:
filename: Name of the uploaded file
document_id: ID of the stored document

Ask Question
Endpoint: /ask/
Method: POST
Description: Asks a question about the content of an uploaded PDF.
Request:
document_id: ID of the document to ask a question about
question: The question to be asked
Response:
answer: The answer to the question based on the document content



Example Requests
Upload PDF

curl -X POST "http://localhost:8000/upload/" -F "file=@path/to/your/file.pdf"
Ask Question

curl -X POST "http://localhost:8000/ask/" -H "Content-Type: application/json" -d '{"document_id": 1, "question": "What is the main topic of the document?"}'
Notes
Ensure you have the necessary permissions to upload and process the PDF files.
This application is designed for educational purposes and might require further enhancements for production use.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

License
This project is licensed under the MIT License. See the LICENSE file for details.


### Explanation:

1. **Overview**: Provides a brief introduction to the application.
2. **Application Architecture**: Describes the backend and frontend technologies used.
3. **Setup Instructions**: Provides detailed steps for setting up both the backend and frontend.
4. **API Documentation**: Details the endpoints, methods, request parameters, and example requests for the API.
5. **Notes**: Additional information and disclaimers.
6. **Contributing**: Encourages contributions.
7. **License**: Specifies the license under which the project is distributed.


