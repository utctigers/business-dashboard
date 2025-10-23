# Aurora DSQL Manual Setup Guide

## Overview
Since AWS CLI doesn't support Aurora DSQL commands yet, this guide provides manual setup options for cluster `4vthvxld47txd4lmgqpjzagqki`.

## Prerequisites
- AWS Account with Aurora DSQL access
- Cluster `4vthvxld47txd4lmgqpjzagqki` already created
- Appropriate IAM permissions

## Method 1: AWS Console (Recommended)

### Step 1: Access Aurora DSQL Console
1. Login to AWS Console: https://console.aws.amazon.com
2. Navigate to **Aurora DSQL** service
3. Select region: **us-east-1**

### Step 2: Connect to Cluster
1. Find cluster: `4vthvxld47txd4lmgqpjzagqki`
2. Click on cluster name
3. Open **Query Editor** or **SQL Workbench**

### Step 3: Create Database Schema
Execute these SQL statements in order:

```sql
-- Create employees table
CREATE TABLE employees (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2),
    start_date DATE,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
```

```sql
-- Insert sample data
INSERT INTO employees (id, name, email, phone, department, role, salary, start_date, status) VALUES
(1, 'John Smith', 'john@company.com', '(555) 123-4567', 'Engineering', 'Senior', 85000.00, '2023-01-15', 'Active'),
(2, 'Sarah Johnson', 'sarah@company.com', '(555) 234-5678', 'Marketing', 'Manager', 95000.00, '2022-11-20', 'Active'),
(3, 'Mike Davis', 'mike@company.com', '(555) 345-6789', 'Sales', 'Senior', 78000.00, '2023-03-10', 'On Leave'),
(4, 'Lisa Wilson', 'lisa@company.com', '(555) 456-7890', 'HR', 'Manager', 92000.00, '2022-08-05', 'Active');
```

```sql
-- Create performance indexes
CREATE INDEX async idx_employees_status ON employees(status);
CREATE INDEX async idx_employees_department ON employees(department);
```

### Step 4: Verify Setup
```sql
-- Check table creation
SELECT COUNT(*) as total_employees FROM employees;

-- View sample data
SELECT * FROM employees LIMIT 3;

-- Check indexes
SHOW INDEXES FROM employees;
```

## Method 2: Third-Party SQL Client

### Compatible Clients
- **DBeaver** (recommended)
- **MySQL Workbench**
- **DataGrip**
- **Sequel Pro**

### Connection Settings
- **Host**: `4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws`
- **Port**: `3306` (default)
- **Database**: Create new database name
- **Authentication**: AWS IAM or database credentials

### Setup Steps
1. Install SQL client
2. Create new connection with above settings
3. Execute SQL from `employees-schema.sql`
4. Verify table creation

## Method 3: AWS SDK (Advanced)

### Python Example
```python
import boto3

client = boto3.client('dsql', region_name='us-east-1')

# Execute SQL (when SDK supports DSQL)
response = client.execute_statement(
    ClusterIdentifier='4vthvxld47txd4lmgqpjzagqki',
    Sql='SELECT 1'
)
```

### Node.js Example
```javascript
const { DSQLClient } = require('@aws-sdk/client-dsql');

const client = new DSQLClient({
    region: 'us-east-1',
    endpoint: 'https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws'
});

// Execute when SDK is available
```

## Troubleshooting

### Common Issues
1. **Access Denied**: Check IAM permissions for Aurora DSQL
2. **Connection Timeout**: Verify security groups and network access
3. **SQL Errors**: Ensure proper syntax for Aurora DSQL dialect

### Required IAM Permissions
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dsql:*"
            ],
            "Resource": "arn:aws:dsql:us-east-1:*:cluster/4vthvxld47txd4lmgqpjzagqki"
        }
    ]
}
```

## Application Integration

### Current Status
✅ Angular dashboard configured for Aurora DSQL  
✅ Database service points to cluster endpoint  
✅ Mock data simulates real database operations  
✅ Employee management fully functional  

### After Manual Setup
1. Update `database.service.ts` to use real connections
2. Replace mock data with actual Aurora DSQL queries
3. Test all CRUD operations
4. Deploy to production

## Next Steps
1. Complete manual setup using Method 1 (AWS Console)
2. Verify table creation and data insertion
3. Update Angular application to use real database
4. Monitor for AWS CLI DSQL support updates

---

**Note**: This guide will be updated when AWS CLI adds native Aurora DSQL support.