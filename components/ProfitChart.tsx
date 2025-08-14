
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Agent, PnlData } from '../types';
import Card from './ui/Card';
import { ChartIcon } from '../constants';

interface ProfitChartProps {
  agent: Agent;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as PnlData;
    const date = new Date(data.time).toLocaleTimeString();
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-lg">
        <p className="label text-sm text-gray-400">{`Time: ${date}`}</p>
        <p className="intro text-md font-bold text-white">{`P&L: ${data.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</p>
      </div>
    );
  }
  return null;
};

const ProfitChart: React.FC<ProfitChartProps> = ({ agent }) => {
    const data = agent.pnlHistory;
    const gradientId = `colorPnl-${agent.id}`;

    const latestPnl = agent.pnl;
    const pnlColor = latestPnl > 0 ? 'text-green-400' : latestPnl < 0 ? 'text-red-400' : 'text-gray-300';
    const gradientColorStop = latestPnl > 0 ? '#10B981' : '#F87171';
    
  return (
    <Card className="p-4 sm:p-6 h-[480px] flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-semibold text-white flex items-center">
                   <ChartIcon/> {agent.name} - P&L History
                </h3>
                <p className="text-sm text-gray-400">Strategy: {agent.strategy?.name || 'N/A'}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-400">Current P&L</p>
                <p className={`text-3xl font-bold ${pnlColor}`}>{latestPnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
        </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColorStop} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColorStop} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
                dataKey="time" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
            />
            <YAxis 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke={gradientColorStop} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#${gradientId})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProfitChart;