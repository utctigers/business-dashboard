# Aurora DSQL Console Setup

## AWS CLI DSQL Not Supported
Current AWS CLI doesn't have DSQL commands. Use AWS Console instead.

## Setup via AWS Console

1. **Open AWS Console**
   - Go to https://console.aws.amazon.com
   - Navigate to Aurora DSQL service

2. **Connect to Cluster**
   - Cluster ID: `4vthvxld47txd4lmgqpjzagqki`
   - Endpoint: `4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws`

3. **Execute SQL**
   Copy and paste from `employees-schema.sql`:
   ```sql
   CREATE TABLE employees (
       id BIGINT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       phone VARCHAR(20),
       department VARCHAR(100) NOT NULL,
       role VARCHAR(100) NOT NULL,
       salary DECIMAL(10,2),
       start_date DATE,
       status VARCHAR(20) DEFAULT 'Active'
   );
   ```

## Application Status
✅ Dashboard works with mock Aurora DSQL data
✅ All employee operations functional
✅ Ready for real database when console setup complete