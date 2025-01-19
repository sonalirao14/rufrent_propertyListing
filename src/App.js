import React from 'react';
import {Routes, Route} from 'react-router-dom'
import { AdminPanel } from './components/propertylistingpage/AdminPanel';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path='/propertylisting' element={<AdminPanel/>}></Route>
    </Routes>
     
     
  );
}

export default App;

