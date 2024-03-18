# Chatbot Application

## Introduction

This project is a chatbot application developed as part of the ProtonDatalabs AI developer Assignment. The application allows users to upload files and ask questions, with the chatbot generating responses based on the content of the uploaded files.

## Project Structure

The project consists of two main components: the backend and the frontend.

### Backend

The backend is built using Python and the FastAPI framework. It includes the following files and directories:

- `main.py`: Entry point to the FastAPI server.
- `requirements.txt`: List of Python dependencies for the project.
- `dotenv`: Configuration file for environment variables.
- `utils.py`: Contains utility functions for file processing and database operations.
- `app.py`: Contains the FastAPI application instance and route definitions.
- `MongoDB`: MongoDB database is used for storing question-answer pairs.

### Frontend

The frontend is built using React.js and includes the following files and directories:

- `App.tsx`: Main component of the React application, responsible for rendering the user interface and handling user interactions.
- `components/EmptyResponse.tsx`: Component for rendering an empty response when no data is available.
- `App.css`: Stylesheet for styling the components.
- `public/index.html`: HTML file serving as the entry point for the React application.

## Technologies Used

### Backend

- **FastAPI**: FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Pydantic**: Pydantic is used for data validation and settings management using Python type annotations.
- **PyPDF2**: PyPDF2 is a pure-Python PDF library capable of splitting, merging together, cropping, and transforming the pages of PDF files.
- **python-docx**: python-docx is a Python library for creating and updating Microsoft Word (.docx) files.
- **pandas**: pandas is a fast, powerful, flexible, and easy-to-use open-source data analysis and manipulation library built on top of the Python programming language.
- **requests**: requests is a simple, yet elegant HTTP library for Python.
- **pymongo**: pymongo is the official Python driver for MongoDB.

### Frontend

- **React.js**: React.js is a JavaScript library for building user interfaces, particularly single-page applications.
- **TypeScript**: TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.
- **React Icons**: React Icons is a library containing popular icon packs for React applications.
- **File Upload**: HTML input element with type="file" is used for uploading files.

## How It Was Built

1. **Backend Development**:
    - The backend was developed using FastAPI, a modern Python framework for building APIs.
    - Routes were defined to handle file uploads, user queries, and data retrieval from MongoDB.
    - File processing functions were implemented to extract text content from various file formats such as CSV, TXT, PDF, and DOCX.
    - MongoDB was used as the database to store question-answer pairs.

2. **Frontend Development**:
    - The frontend was developed using React.js with TypeScript for type safety.
    - Components were created to handle file uploads, user input, and display responses.
    - Tailwind CSS was used for styling the components, providing a clean and responsive design.
    - Fetch API was utilized to communicate with the backend server for sending requests and receiving responses.

## Why These Tools Were Used

1. **FastAPI**:
    - FastAPI was chosen for the backend due to its simplicity, performance, and support for asynchronous programming.
    - It provides automatic validation, serialization, and documentation of request and response data, making it easy to develop and maintain APIs.

2. **React.js**:
    - React.js was chosen for the frontend because of its component-based architecture, declarative syntax, and robust ecosystem.
    - TypeScript was used to enhance type safety and improve code maintainability.

3. **Tailwind CSS**:
    - Tailwind CSS was selected for styling the frontend components because of its utility-first approach, which allows for rapid prototyping and customization.
    - It eliminates the need for writing custom CSS and provides a consistent design system across the application.

4. **MongoDB**:
    - MongoDB was chosen as the database for its flexibility, scalability, and ease of use.
    - It allows for the storage of unstructured data, making it suitable for storing text content extracted from various file formats.

## Conclusion

The chatbot application was built using a combination of FastAPI for the backend, React.js for the frontend, and MongoDB for data storage. By leveraging these tools and technologies, we were able to create a robust and user-friendly application capable of processing user queries and generating responses based on uploaded files.
