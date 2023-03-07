import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/home/home';
import { NextUIProvider } from '@nextui-org/react';


function App() {
  return (
    <BrowserRouter>
      <NextUIProvider>
        <Routes>
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
