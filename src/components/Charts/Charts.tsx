import React from 'react';
import { useAppSelector } from '../../hooks';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

// Theme Colors
const COLORS = {
  Applied: '#0ea5e9',   // Blue
  Screening: '#f59e0b', // Amber/Orange
  Interview: '#a855f7', // Purple
  Offer: '#10b981',     // Emerald/Green
  Rejected: '#f43f5e',  // Rose/Red
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const StatusPieChart: React.FC = () => {
  const { applications } = useAppSelector((state) => state.internships);

  // Group by status
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(COLORS).map((status) => ({
    name: status,
    value: statusCounts[status] || 0,
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
        No application data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MonthlyBarChart: React.FC = () => {
  const { applications } = useAppSelector((state) => state.internships);

  // Group by month
  // We'll gather the last 6 months based on current time or app data
  const monthlyCounts: Record<string, number> = {};

  // Initialize last 6 months with 0
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyCounts[key] = 0;
  }

  applications.forEach((app) => {
    try {
      const date = new Date(app.appliedDate);
      if (!isNaN(date.getTime())) {
        const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
        if (key in monthlyCounts) {
          monthlyCounts[key] += 1;
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  const data = Object.keys(monthlyCounts).map((monthYear) => ({
    name: monthYear,
    Applications: monthlyCounts[monthYear],
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          />
          <Bar dataKey="Applications" fill="url(#colorBar)" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#0ea5e9" />
            ))}
          </Bar>
          <defs>
            <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GrowthLineChart: React.FC = () => {
  const { applications } = useAppSelector((state) => state.internships);

  // Calculate cumulative application count over time
  // Sort applications by appliedDate ascending
  const sortedApps = [...applications].sort(
    (a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime()
  );

  let cumulativeCount = 0;
  const data = sortedApps.map((app) => {
    cumulativeCount += 1;
    let formattedDate = app.appliedDate;
    try {
      const d = new Date(app.appliedDate);
      formattedDate = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
    } catch {
      // Fallback
    }

    return {
      date: formattedDate,
      rawDate: app.appliedDate,
      Applications: cumulativeCount,
    };
  });

  // Group applications by date to avoid duplicates in line chart
  const uniqueDateData: typeof data = [];
  data.forEach((item) => {
    const existing = uniqueDateData.find(x => x.rawDate === item.rawDate);
    if (existing) {
      existing.Applications = item.Applications; // Update with latest cumulative count
    } else {
      uniqueDateData.push(item);
    }
  });

  if (uniqueDateData.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
        No application growth data available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={uniqueDateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis 
            dataKey="date" 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="Applications" 
            stroke="#a855f7" 
            strokeWidth={3} 
            dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
