import React, { useState } from 'react';
import { Bell, GitPullRequest, Users, Settings, Search } from 'lucide-react';
import { sendPRNotification } from './services/slackNotifications';

interface PullRequest {
  id: string;
  title: string;
  author: string;
  created: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewers: string[];
  description: string;
  url: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Mock data - replace with your actual data fetching logic
  const pullRequests: PullRequest[] = [
    {
      id: 'PR-123',
      title: 'Feature: Add notification system',
      author: 'Sarah Chen',
      created: '2024-03-15',
      status: 'pending',
      reviewers: ['John Doe', 'Jane Smith'],
      description: 'Implemented real-time notification system for PR updates',
      url: 'https://github.com/your-repo/pull/123'
    },
    {
      id: 'PR-124',
      title: 'Fix: Authentication flow',
      author: 'Mike Johnson',
      created: '2024-03-14',
      status: 'approved',
      reviewers: ['Alice Brown'],
      description: 'Fixed issues with OAuth authentication process',
      url: 'https://github.com/your-repo/pull/124'
    }
  ];

  const filteredPRs = pullRequests
    .filter(pr => {
      if (activeTab === 'pending') return pr.status === 'pending';
      if (activeTab === 'approved') return pr.status === 'approved';
      return true;
    })
    .filter(pr =>
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleReviewClick = async (pr: PullRequest) => {
    try {
      // Send notification to Slack
      await sendPRNotification(
        pr.title,
        pr.url,
        pr.author,
        pr.reviewers,
        {
          channel: 'merge-mate-notifications', // Replace with your channel name
          userIds: pr.reviewers.map(reviewer => `@${reviewer.toLowerCase().replace(' ', '')}`),
        }
      );

      setNotificationMessage('Notifications sent successfully!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Failed to send notifications:', error);
      setNotificationMessage('Failed to send notifications. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-3 z-50 animate-fade-in">
          <p className="text-sm text-gray-800">{notificationMessage}</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GitPullRequest className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Merge-Mate</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pull requests..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All PRs
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'pending'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'approved'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {/* Pull Requests List */}
        <div className="space-y-4">
          {filteredPRs.map((pr) => (
            <div
              key={pr.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{pr.id}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pr.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        pr.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{pr.description}</p>
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {pr.reviewers.join(', ')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Created on {pr.created} by {pr.author}
                    </span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => handleReviewClick(pr)}
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;