import React from 'react';
import { FileText, Eye, TrendingUp, Clock, Activity } from 'lucide-react';
import { Card } from '../ui/card';
import { dashboardStats, recentActivity } from '../../data/mockData';

export const DashboardOverview: React.FC = () => {
  const stats = [
    {
      label: 'Total Articles',
      value: dashboardStats.totalArticles,
      icon: FileText,
      change: '+12 this week',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Total Views',
      value: dashboardStats.totalViews.toLocaleString(),
      icon: Eye,
      change: '+15% from last week',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Weekly Views',
      value: dashboardStats.weeklyViews.toLocaleString(),
      icon: TrendingUp,
      change: '+8% increase',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Avg. Read Time',
      value: `${dashboardStats.averageReadTime} min`,
      icon: Clock,
      change: 'Consistent',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart Placeholder */}
        <Card className="p-6 lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-white">
              Traffic Overview
            </h3>
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would display here</p>
              <p className="text-sm mt-1">Showing visitor trends over time</p>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                <p className="text-gray-900 dark:text-white mb-1">
                  {activity.action}
                </p>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-1 mb-1">
                  {activity.title}
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Categories */}
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white mb-4">
          Top Performing Categories
        </h3>
        <div className="space-y-4">
          {['Politics', 'Technology', 'Business', 'Sports'].map((category, index) => {
            const percentage = [85, 72, 68, 54][index];
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">{category}</span>
                  <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-[#007BFF] h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
