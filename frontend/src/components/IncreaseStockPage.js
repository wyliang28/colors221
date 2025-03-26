import React, { useState, useEffect } from 'react';
import { getColors, createIncreaseStock, getIncreaseStock } from '../api';

const IncreaseStockPage = () => {
  const [colors, setColors] = useState([]);  // 存储所有颜色
  const [selectedColor, setSelectedColor] = useState('');  // 当前选择的颜色
  const [increaseNum, setIncreaseNum] = useState(1);  // 增加数量
  const [increaseRecords, setIncreaseRecords] = useState([]);  // 存储增加记录

  // 获取所有颜色
  useEffect(() => {
    const fetchColors = async () => {
      const data = await getColors();
      setColors(data);
    };
    fetchColors();

    // 获取库存增加记录
    const fetchIncreaseRecords = async () => {
      const data = await getIncreaseStock();
      setIncreaseRecords(data);
    };
    fetchIncreaseRecords();
  }, []);

  // 处理库存增加
  const handleIncreaseStock = async () => {
    if (!selectedColor || increaseNum <= 0) {
      alert('请选择颜色并输入有效的增加数量');
      return;
    }

    // 调用后端 API 增加库存
    try {
      const result = await createIncreaseStock(selectedColor, increaseNum);
      alert(result.message); // 显示成功消息

      // 更新库存增加记录
      const data = await getIncreaseStock();
      setIncreaseRecords(data);

      setSelectedColor('');
      setIncreaseNum(1); // 重置表单
    } catch (error) {
      alert('库存增加失败');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <h2>库存增加</h2>

      {/* 选择颜色 */}
      <div>
        <label>选择颜色:</label>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}  // 设置选择的颜色
        >
          <option value="">请选择颜色</option>
          {colors.map(color => (
            <option key={color.id} value={color.name}>
              {color.name}
            </option>
          ))}
        </select>
      </div>

      {/* 输入增加数量 */}
      <div>
        <label>增加数量:</label>
        <input
          type="number"
          value={increaseNum}
          onChange={(e) => setIncreaseNum(Number(e.target.value))}
        />
      </div>

      <button onClick={handleIncreaseStock}>提交增加库存</button>

      {/* 显示库存增加记录 */}
      <div style={{ marginTop: '30px' }}>
        <h3>库存增加记录</h3>
        <table>
          <thead>
            <tr>
              <th>颜色名称</th>
              <th>增加数量</th>
              <th>增加时间</th>
            </tr>
          </thead>
          <tbody>
            {increaseRecords.length > 0 ? (
              increaseRecords.map(record => (
                <tr key={record.id}>
                  <td>{record.name}</td>
                  <td>{record.increase_num}</td>
                  <td>{record.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">暂无库存增加记录</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncreaseStockPage;
