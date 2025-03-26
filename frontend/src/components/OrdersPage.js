import React, { useState, useEffect } from 'react';
import { createOrder, deleteOrder, getPackages, getOrders } from '../api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [packageNum, setPackageNum] = useState(1);
  const [packages, setPackages] = useState([]);

  // 获取订单和套餐信息
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);  // 加载订单数据
    };
    fetchOrders();

    const fetchPackages = async () => {
      const data = await getPackages();
      setPackages(data);
    };
    fetchPackages();
  }, []);

  // 创建订单
  const handleCreateOrder = async () => {
    if (!packageName || packageNum <= 0) {
      alert('请选择套餐并输入有效数量');
      return;
    }

    const newOrder = { package_name: packageName, package_num: packageNum };

    await createOrder(newOrder);
    setPackageName('');
    setPackageNum(1);

    // 刷新订单列表
    const data = await getOrders();
    setOrders(data);
  };

  // 删除订单
  const handleDeleteOrder = async (id) => {
    await deleteOrder(id);
    const data = await getOrders();
    setOrders(data);
  };

  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <h2>订单管理</h2>

      {/* 套餐选择 */}
      <div>
        <label>选择套餐:</label>
        <select
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        >
          <option value="">请选择套餐</option>
          {packages.map(pkg => (
            <option key={pkg.id} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>套餐数量:</label>
        <input
          type="number"
          placeholder="套餐数量"
          value={packageNum}
          onChange={(e) => setPackageNum(Number(e.target.value))}
        />
      </div>

      <button onClick={handleCreateOrder}>创建订单</button>

      {/* 订单表格 */}
      <table style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>订单ID</th>
            <th>套餐名称</th>
            <th>套餐数量</th>
            <th>订单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.package_name}</td>
                <td>{order.package_num}</td>
                <td>{order.date}</td>  {/* 显示订单时间 */}
                <td>
                  <button onClick={() => handleDeleteOrder(order.id)}>删除</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">暂无订单</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
