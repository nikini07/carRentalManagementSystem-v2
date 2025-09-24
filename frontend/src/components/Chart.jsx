// frontend/src/components/Chart.jsx
import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts'; // Install recharts

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Chart = ({ type, data }) => {
  const processedData = data.reduce((acc, item) => {
    const key = item.month || item.type;
    acc[key] = (acc[key] || 0) + (item.count || item.value);
    return acc;
  }, {});

  const chartData = Object.entries(processedData).map(([name, value]) => ({ name, value }));

  return (
    <div className="my-4">
      {type === 'bar' && (
        <BarChart width={600} height={300} data={chartData}>
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      )}
      {type === 'pie' && (
        <PieChart width={400} height={400}>
          <Pie data={chartData} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      )}
    </div>
  );
};

export default Chart;