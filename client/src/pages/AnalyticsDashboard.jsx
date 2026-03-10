import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Users, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import './AnalyticsDashboard.css';

const hourlyTrafficData = [
  { time: '9 AM', customers: 4 },
  { time: '10 AM', customers: 8 },
  { time: '11 AM', customers: 12 },
  { time: '12 PM', customers: 6 },
  { time: '1 PM', customers: 5 },
  { time: '2 PM', customers: 7 },
  { time: '3 PM', customers: 10 },
  { time: '4 PM', customers: 15 },
  { time: '5 PM', customers: 22 },
  { time: '6 PM', customers: 28 },
  { time: '7 PM', customers: 25 },
  { time: '8 PM', customers: 14 }
];

const queueTrendData = [
  { time: '9 AM', size: 1 },
  { time: '11 AM', size: 4 },
  { time: '1 PM', size: 2 },
  { time: '3 PM', size: 5 },
  { time: '5 PM', size: 10 },
  { time: '7 PM', size: 12 },
  { time: '9 PM', size: 3 }
];

const ratingData = [
  { name: '5 Stars', value: 65 },
  { name: '4 Stars', value: 20 },
  { name: '3 Stars', value: 10 },
  { name: '1-2 Stars', value: 5 }
];

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export default function AnalyticsDashboard() {
  return (
    <div className="analytics-page">
      <Navbar isAdmin={true} />
      
      <div className="container dashboard-container">
        <header className="dashboard-header glass-panel">
          <div>
            <h1 className="text-gradient">Performance Analytics</h1>
            <p className="text-muted">Monitor your business metrics and customer flow.</p>
          </div>
        </header>

        {/* Smart Business Insights */}
        <section className="insights-panel mt-6">
          <div className="insight-card glass-panel hover-card">
            <div className="insight-icon bg-indigo"><TrendingUp size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Peak Traffic Hours</span>
              <h4 className="text-lg">6:00 PM - 8:00 PM</h4>
            </div>
          </div>
          <div className="insight-card glass-panel hover-card">
            <div className="insight-icon bg-success"><Clock size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Avg Service Time</span>
              <h4 className="text-lg">8 minutes</h4>
            </div>
          </div>
          <div className="insight-card glass-panel hover-card">
            <div className="insight-icon bg-warning"><Star size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Customer Satisfaction</span>
              <h4 className="text-lg">4.6 / 5.0</h4>
            </div>
          </div>
          <div className="insight-card glass-panel hover-card">
            <div className="insight-icon bg-primary"><Users size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Total Customers Today</span>
              <h4 className="text-lg">42</h4>
            </div>
          </div>
        </section>

        {/* Charts Grid */}
        <section className="charts-grid mt-6">
          <div className="chart-card glass-panel">
            <h3 className="section-title mb-4">Customer Traffic Today</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Bar dataKey="customers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card glass-panel">
            <h3 className="section-title mb-4">Queue Size Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={queueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="size" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card glass-panel chart-full-width">
            <h3 className="section-title mb-4">Customer Rating Distribution</h3>
            <div className="chart-container pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {ratingData.map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-muted text-sm">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
