# Prim Algorithm Visualizer

This project is a web-based application designed to visualize the Prim's algorithm for finding the Minimum Spanning Tree (MST) of a graph. It provides multiple input methods, interactive graph drawing, and real-time visualization of the algorithm's steps.

## Features

### Input Methods
- **Manual Input**: Users can manually input vertices and edges with weights.
- **File Upload**: Upload graph data in a predefined format for visualization.
- **Interactive Drawing**: Draw graphs directly on the canvas.

### Visualization
- **Step-by-Step Execution**: Visualize each step of Prim's algorithm in real-time.
- **Graph Representation**: Display vertices, edges, and weights dynamically.
- **Highlighting**: Highlight edges and vertices as they are added to the MST.

### User Interface
- **Responsive Design**: Optimized for various screen sizes.
- **Loading Screen**: Animated loading screen for better user experience.
- **Menu Navigation**: Easy navigation between input methods and visualization modes.

## Technologies Used

### Frontend
- **React.js**: Component-based architecture for building the user interface.
- **Anime.js**: Used for animations in the UI.
- **Bootstrap**: Responsive design framework.
- **SASS**: Modular styling with variables and mixins.

### Backend
- **Node.js**: Server-side runtime for handling file uploads and processing graph data.
- **Express.js**: Web framework for building RESTful APIs.

### Tools
- **Vite**: Build tool for fast development.
- **ESLint**: Code quality and linting.

## MVC Architecture

The project follows a component-based architecture inspired by MVC principles:

- **Model**: Graph data is managed in state variables and processed for visualization.
- **View**: React components render the user interface dynamically.
- **Controller**: Logic within components handles user interactions and updates the view.

## Project Structure

```
prim-algorithm/
├── .gitignore
├── package.json
├── README.md
├── public/
│   ├── _redirects
│   ├── index.html
├── src/
│   ├── App.jsx
│   ├── index.js
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── graph.svg
│   │   │   ├── graphique.svg
│   │   │   ├── input.svg
│   │   │   ├── setting.svg
│   │   │   ├── upload.svg
│   │   ├── images/
│   │   │   ├── background.jpg
│   │   ├── videos/
│   │   │   ├── background.mp4
│   ├── components/
│   │   ├── LoadingScreen.jsx
│   ├── pages/
│   │   ├── DrawGraph.jsx
│   │   ├── FileUpload.jsx
│   │   ├── ManualInput.jsx
│   │   ├── Menu.jsx
│   ├── styles/
│       ├── css/
│       │   ├── main.css
│       │   ├── main.css.map
│       ├── sass/
│           ├── main.scss
│           ├── animations/
│           │   ├── fade.scss
│           ├── components/
│           │   ├── aside-menu.scss
│           ├── font/
│           ├── pages/
```

## How to Run

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:3000`.

## Notes
- Ensure the graph data format is correct when using the file upload feature.
- The application requires WebGL support in the browser for interactive graph drawing.
