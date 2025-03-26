import React, { useState, useEffect } from 'react';
import { getPackages, createPackage, deletePackage, getColors } from '../api';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState('');
  const [colors, setColors] = useState([]);  // 存储选中的颜色名称
  const [colorNum, setColorNum] = useState(10);
  const [allColors, setAllColors] = useState([]);  // 存储所有颜色

  useEffect(() => {
    const fetchPackages = async () => {
      const data = await getPackages();
      setPackages(data);
    };
    fetchPackages();

    // 获取所有颜色
    const fetchColors = async () => {
      const data = await getColors();  // 使用您提供的 getColors API
      setAllColors(data);  // 存储所有颜色信息
    };
    fetchColors();
  }, []);

  const handleCreatePackage = async () => {
    try {
      const newPackage = {
        name,
        colors,  // 传递颜色名称数组
        color_num: colorNum
      };
      await createPackage(newPackage);  // 发送请求
      setName('');
      setColors([]);
      setColorNum(10);
      const data = await getPackages();
      setPackages(data);
    } catch (error) {
      console.error("Error creating package:", error);  // 打印详细的错误信息
    }
  };

  const handleDeletePackage = async (id) => {
    await deletePackage(id);  // 使用您提供的 deletePackage API
    const data = await getPackages();
    setPackages(data);
  };

  const handleColorChange = (e) => {
    const selectedColorName = e.target.value;
    // 如果勾选框被选中，就将选中的颜色名称添加到 colors 数组；否则移除它
    if (e.target.checked) {
      setColors(prevColors => [...prevColors, selectedColorName]);
    } else {
      setColors(prevColors => prevColors.filter(name => name !== selectedColorName));
    }
  };

  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <h2>套餐管理</h2>
      <input
        type="text"
        placeholder="套餐名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <label>选择颜色:</label>
        <div>
          {allColors.map(color => (
            <div key={color.id}>
              <input
                type="checkbox"
                value={color.name}  // 使用颜色名称
                checked={colors.includes(color.name)}  // 判断该颜色是否被选中
                onChange={handleColorChange}
              />
              <label>{color.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h4>已选择颜色:</h4>
        <ul>
          {colors.map(colorName => (
            <li key={colorName}>{colorName}</li>
          ))}
        </ul>
      </div>

      <input
        type="number"
        placeholder="颜色克数"
        value={colorNum}
        onChange={(e) => setColorNum(e.target.value)}
      />
      <button onClick={handleCreatePackage}>创建套餐</button>

      <table>
        <thead>
          <tr>
            <th>套餐名称</th>
            <th>颜色名称</th>  {/* 显示颜色名称 */}
            <th>颜色克数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr key={pkg.id}>
              <td>{pkg.name}</td>
              <td>{pkg.colors}</td>  {/* 直接显示颜色名称 */}
              <td>{pkg.color_num}</td>
              <td>
                <button onClick={() => handleDeletePackage(pkg.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PackagesPage;
