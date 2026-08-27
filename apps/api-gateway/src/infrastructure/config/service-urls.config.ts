export const serviceUrls = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  wallet: process.env.WALLET_SERVICE_URL || 'http://localhost:3002',
  transaction: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3004',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
};