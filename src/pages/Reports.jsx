import React from 'react';
import { Card, Space, Select, Button } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';

const objetivoDiario = 1600;

const data = [
  { date: '2025-05-24', calories: 1200 },
  { date: '2025-05-25', calories: 1350 },
  { date: '2025-05-26', calories: 1600 },
  { date: '2025-05-27', calories: 1000 },
  { date: '2025-05-28', calories: 1800 },
  { date: '2025-05-29', calories: 1700 },
  { date: '2025-05-30', calories: 2000 },
];

const Reports = () => {
  return (
    <Card title="Calorías consumidas" style={{ width: '100%' }}>
      <Space style={{ marginBottom: 16 }}>
        <Select defaultValue="calorias" style={{ width: 120 }}>
          <Select.Option value="calorias">Calorías</Select.Option>
        </Select>
        <Button type="primary">Exportar</Button>
      </Space>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Etiqueta eje X */}
          <XAxis
            dataKey="date"
            label={{ value: 'Fecha', position: 'bottom', offset: 0 }}
          />
          {/* Etiqueta eje Y */}
          <YAxis
            label={{
              value: 'Calorías',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
            }}
          />
          <Tooltip />
          <ReferenceLine y={objetivoDiario} stroke="red" strokeDasharray="3 3" label="Objetivo" />
          <Bar dataKey="calories" fill="#8884d8">
            <LabelList dataKey="calories" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Reports;
