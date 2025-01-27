import React from 'react';
import {Routes, Route} from 'react-router-dom'
import { AdminPanel } from './components/propertylistingpage/AdminPanel';
import './index.css';
// import UserManagementTable from './components/usermanagement/adminfile';
import AdminFile from './components/usermanagement/adminfile';

function App() {
  return (
    <Routes>
      <Route path='/propertylisting' element={<AdminPanel/>}></Route>
      <Route path='/user-management' element={<AdminFile/>}></Route>
    </Routes>
     
     
  );
}

export default App;

