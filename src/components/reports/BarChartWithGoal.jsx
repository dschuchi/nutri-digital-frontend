import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    LabelList,
} from 'recharts';

const BarChartWithGoal = ({
    data,
    dataKey,
    label,
    color = '#8884d8',
    goal = 2000,
    yUnit = '',
}) => {
    const actualMax = Math.max(...data.map(d => d[dataKey] ?? 0));
    const maxY = actualMax > goal ? actualMax + 100 : goal + 200;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => value.slice(5)}
                    label={{ value: 'Fecha', position: 'bottom', offset: 0 }}
                />
                <YAxis
                    domain={[0, maxY]}
                    label={{ value: yUnit, angle: -90, position: 'insideLeft', offset: 10 }}
                />
                <Tooltip />
                <ReferenceLine
                    y={goal}
                    stroke={color}
                    strokeDasharray="3 3"
                    label={{ value: 'Objetivo', position: 'right', fill: color }}
                />
                <Bar dataKey={dataKey} fill={color}>
                    <LabelList dataKey={dataKey} position="top" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartWithGoal;
