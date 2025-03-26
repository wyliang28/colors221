import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ColorsPage from './components/ColorsPage';
import PackagesPage from './components/PackagesPage';
import OrdersPage from './components/OrdersPage';
import IncreaseStockPage from './components/IncreaseStockPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ marginLeft: '200px' }}>
        <Routes>
          <Route path="/colors" element={<ColorsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/increaseStock" element={<IncreaseStockPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
