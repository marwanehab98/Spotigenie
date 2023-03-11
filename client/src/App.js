import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/home/home';
import { createTheme, NextUIProvider } from '@nextui-org/react';

const darkTheme = createTheme({
  type: 'dark',
});

function App() {
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
