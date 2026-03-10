import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Users, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function AnalyticsDashboard() {
  return (
    <div className="analytics-page">
      <Navbar isAdmin={true} />

      <motion.div
        className="container dashboard-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header className="dashboard-header glass-panel" variants={itemVariants}>
          <div>
            <h1 className="text-gradient">Performance Analytics</h1>
            <p className="text-muted">Monitor your business metrics and customer flow with real-time insights.</p>
          </div>
        </motion.header>

        {/* Smart Business Insights */}
        <section className="insights-panel mt-6">
          <motion.div className="insight-card glass-panel hover-card" variants={itemVariants}>
            <div className="insight-icon bg-indigo"><TrendingUp size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Peak Traffic Hours</span>
              <h4 className="text-lg">6:00 PM - 8:00 PM</h4>
              <span className="text-xs text-primary flex items-center gap-1 font-medium">
                <ArrowUpRight size={12} /> 12% vs last week
              </span>
            </div>
          </motion.div>
          <motion.div className="insight-card glass-panel hover-card" variants={itemVariants}>
            <div className="insight-icon bg-success"><Clock size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Avg Service Time</span>
              <h4 className="text-lg">8 minutes</h4>
              <span className="text-xs text-success flex items-center gap-1 font-medium">
                <ArrowDownRight size={12} /> 2m faster today
              </span>
            </div>
          </motion.div>
          <motion.div className="insight-card glass-panel hover-card" variants={itemVariants}>
            <div className="insight-icon bg-warning"><Star size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Satisfaction Rate</span>
              <h4 className="text-lg">4.6 / 5.0</h4>
              <span className="text-xs text-warning flex items-center gap-1 font-medium">
                <TrendingUp size={12} /> Stable this month
              </span>
            </div>
          </motion.div>
          <motion.div className="insight-card glass-panel hover-card" variants={itemVariants}>
            <div className="insight-icon bg-primary"><Users size={24} /></div>
            <div className="insight-info">
              <span className="text-muted text-sm">Total Visits Today</span>
              <h4 className="text-lg">42</h4>
              <span className="text-xs text-primary flex items-center gap-1 font-medium">
                <ArrowUpRight size={12} /> 8% higher than avg
              </span>
            </div>
          </motion.div>
        </section>

        {/* Charts Grid */}
        <section className="charts-grid mt-6">
          <motion.div className="chart-card glass-panel" variants={itemVariants}>
            <h3 className="section-title mb-4">Customer Traffic Distribution</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyTrafficData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                  />
                  <Bar dataKey="customers" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="chart-card glass-panel" variants={itemVariants}>
            <h3 className="section-title mb-4">Live Queue Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={queueTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="size"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="chart-card glass-panel chart-full-width" variants={itemVariants}>
            <h3 className="section-title mb-4">Feedback Sentiment Breakdown</h3>
            <div className="chart-container pie-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {ratingData.map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <div className="legend-left">
                      <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}></span>
                      <span className="text-muted text-sm font-medium">{entry.name}</span>
                    </div>
                    <span className="text-white font-bold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
