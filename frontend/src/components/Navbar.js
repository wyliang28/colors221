import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ width: '200px', float: 'left', marginTop: '20px' }}>
      <ul>
        <li><Link to="/colors">颜色库存</Link></li>
        <li><Link to="/packages">套餐管理</Link></li>
        <li><Link to="/orders">订单管理</Link></li>
        <li><Link to="/increaseStock">增加库存</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
