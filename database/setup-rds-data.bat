@echo off
echo Setting up Aurora DSQL Database using RDS Data API...
echo Cluster: 4vthvxld47txd4lmgqpjzagqki

set CLUSTER_ARN=arn:aws:rds:us-east-1:123456789012:cluster:4vthvxld47txd4lmgqpjzagqki
set REGION=us-east-1

echo.
echo Creating employees table...
aws rds-data execute-statement --resource-arn "%CLUSTER_ARN%" --region %REGION% --sql "CREATE TABLE employees (id BIGINT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, phone VARCHAR(20), department VARCHAR(100) NOT NULL, role VARCHAR(100) NOT NULL, salary DECIMAL(10,2), start_date DATE, status VARCHAR(20) DEFAULT 'Active');"

echo.
echo Inserting sample data...
aws rds-data execute-statement --resource-arn "%CLUSTER_ARN%" --region %REGION% --sql "INSERT INTO employees (id, name, email, phone, department, role, salary, start_date, status) VALUES (1, 'John Smith', 'john@company.com', '(555) 123-4567', 'Engineering', 'Senior', 85000.00, '2023-01-15', 'Active');"

echo.
echo Database setup complete!