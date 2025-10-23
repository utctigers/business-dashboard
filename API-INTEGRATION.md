# API Integration Guide

## Backend API Configuration

The Angular dashboard now connects to the Node.js backend API for Aurora DSQL operations.

### Environment Configuration

**Development** (`environment.ts`):
```typescript
useMockData: false, // Uses backend API
apiUrl: 'http://localhost:3001/api'
```

**Production** (`environment.prod.ts`):
```typescript
useMockData: false, // Uses backend API
apiUrl: 'https://your-api-domain.com/api'
```

### API Endpoints Used

- `GET /api/employees` - Fetch all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### How It Works

1. **Angular Frontend** → HTTP requests → **Node.js Backend** → **Aurora DSQL**
2. **Automatic Fallback**: If API fails, falls back to mock data
3. **Error Handling**: Graceful degradation with user feedback

### Starting Both Services

```bash
# Terminal 1: Start Backend API
cd dashboard-api
npm start
# Runs on http://localhost:3001

# Terminal 2: Start Angular Dashboard  
cd business-dashboard
npm start
# Runs on http://localhost:4201
```

### Features

✅ **Real Aurora DSQL**: Backend connects to cluster `4vthvxld47txd4lmgqpjzagqki`  
✅ **HTTP Client**: Angular uses proper HTTP calls  
✅ **Error Handling**: Automatic fallback to mock data  
✅ **CORS Enabled**: Backend configured for Angular frontend  
✅ **Environment Toggle**: Easy switch between API and mock modes  

### Testing

1. Start backend API server
2. Start Angular dashboard
3. Check browser console for "API" mode logs
4. Test employee CRUD operations
5. Backend logs show Aurora DSQL operations

The dashboard now uses a proper client-server architecture with Aurora DSQL integration!