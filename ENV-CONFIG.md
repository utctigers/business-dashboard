# Environment Configuration

## Toggle Between Mock and Real Aurora DSQL

### Development Mode (Mock Data)
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  useMockData: true, // Uses mock Aurora DSQL data
  aurora: {
    clusterId: '4vthvxld47txd4lmgqpjzagqki',
    endpoint: '4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws',
    region: 'us-east-1'
  }
};
```

### Production Mode (Real Aurora DSQL)
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  useMockData: false, // Uses actual Aurora DSQL service
  aurora: {
    clusterId: '4vthvxld47txd4lmgqpjzagqki',
    endpoint: '4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws',
    region: 'us-east-1'
  }
};
```

## Current Status
✅ **Mock Mode**: Fully functional with simulated Aurora DSQL  
⚠️ **Real Mode**: Falls back to mock until AWS SDK supports DSQL  

## How to Switch
1. **Enable Mock**: Set `useMockData: true`
2. **Enable Real**: Set `useMockData: false` (will fallback to mock until SDK ready)

The application automatically detects the mode and logs the connection type in the console.