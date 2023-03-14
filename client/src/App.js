import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/home/home';
import { createTheme, NextUIProvider } from '@nextui-org/react';
// import { useSelector } from 'react-redux';

const darkTheme = createTheme({ type: 'dark' });

// const lightTheme = createTheme({ type: 'light' });

function App() {
  // const darktheme = useSelector((state) => state.darktheme);
  return (
    <BrowserRouter>
      <NextUIProvider theme={darkTheme}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
