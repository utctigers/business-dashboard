export const environment = {
  production: true,
  useMockData: false, // Use backend API in production
  apiUrl: 'https://your-api-domain.com/api',
  aurora: {
    clusterId: '4vthvxld47txd4lmgqpjzagqki',
    endpoint: '4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws',
    region: 'us-east-1',
    port: 5432,
    database: 'postgres',
    ssl: true
  }
};