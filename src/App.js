import React from 'react';
import {Routes, Route} from 'react-router-dom'
// import { AdminPanel } from './components/AdminPanel';
import { AdminPanel } from './components/propertylistingpage/AdminPanel';
import './index.css';
// import { Route } from 'lucide-react';
// import EventsListPage from './EventListPage';

function App() {
  return (
    <Routes>
      <Route path='/propertylisting' element={<AdminPanel/>}></Route>
    </Routes>
     
      // <EventsListPage/>
  );
}

export default App;

