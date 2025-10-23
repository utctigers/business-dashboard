export const environment = {
  production: false,
  useMockData: false, // Use backend API
  apiUrl: 'http://localhost:3001/api',
  aurora: {
    clusterId: '4vthvxld47txd4lmgqpjzagqki',
    endpoint: '4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws',
    region: 'us-east-1',
    port: 5432,
    database: 'postgres',
    ssl: true
  }
};