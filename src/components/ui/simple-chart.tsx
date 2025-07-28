import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface SimpleBarChartProps {
  data: any[]
  dataKey: string
  xAxisKey: string
  title?: string
  color?: string
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  dataKey, 
  xAxisKey, 
  title,
  color = "hsl(var(--primary))" 
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface SimplePieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  title?: string
  colors?: string[]
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({ 
  data, 
  dataKey, 
  nameKey, 
  title,
  colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--safe))",
    "hsl(var(--warning))",
    "hsl(var(--secondary))"
  ]
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface SimpleLineChartProps {
  data: any[]
  dataKey: string
  xAxisKey: string
  title?: string
  color?: string
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  dataKey, 
  xAxisKey, 
  title,
  color = "hsl(var(--primary))" 
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}