import React, { useEffect, useState } from 'react';
import { getColors } from '../api';

const ColorsPage = () => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchColors = async () => {
      const data = await getColors();
      setColors(data);
    };
    fetchColors();
  }, []);

  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <h2>颜色库存</h2>
      <table>
        <thead>
          <tr>
            <th>颜色名称</th>
            <th>颜色代码</th>
            <th>库存数量</th>
          </tr>
        </thead>
        <tbody>
          {colors.map(color => (
            <tr key={color.id}>
              <td>{color.name}</td>
              <td>{color.color_id}</td>
              <td>{color.num}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColorsPage;
