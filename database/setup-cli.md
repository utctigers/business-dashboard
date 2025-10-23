# Aurora DSQL Setup Instructions

## Manual Setup via AWS CLI

Since the AWS SDK for DSQL is still in development, use the AWS CLI to execute the schema:

### Prerequisites
```bash
# Install AWS CLI v2
# Configure AWS credentials with DSQL permissions
aws configure
```

### Execute Schema

1. **Connect to Aurora DSQL cluster endpoint:**
```bash
# Set cluster endpoint
export DSQL_ENDPOINT="4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws"

# Execute schema file
aws dsql execute-statement \
  --endpoint-url "https://$DSQL_ENDPOINT" \
  --region us-east-1 \
  --sql "$(cat employees-schema.sql)"
```

2. **Or execute statements individually:**

```bash
# Create table
aws dsql execute-statement \
  --endpoint-url "https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws" \
  --region us-east-1 \
  --sql "CREATE TABLE employees (
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);"

# Insert sample data
aws dsql execute-statement \
  --endpoint-url "https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws" \
  --region us-east-1 \
  --sql "INSERT INTO employees (id, name, email, phone, department, role, salary, start_date, status) VALUES
(1, 'John Smith', 'john@company.com', '(555) 123-4567', 'Engineering', 'Senior', 85000.00, '2023-01-15', 'Active'),
(2, 'Sarah Johnson', 'sarah@company.com', '(555) 234-5678', 'Marketing', 'Manager', 95000.00, '2022-11-20', 'Active'),
(3, 'Mike Davis', 'mike@company.com', '(555) 345-6789', 'Sales', 'Senior', 78000.00, '2023-03-10', 'On Leave'),
(4, 'Lisa Wilson', 'lisa@company.com', '(555) 456-7890', 'HR', 'Manager', 92000.00, '2022-08-05', 'Active');"

# Create indexes
aws dsql execute-statement \
  --endpoint-url "https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws" \
  --region us-east-1 \
  --sql "CREATE INDEX idx_employees_status ON employees(status);"

aws dsql execute-statement \
  --endpoint-url "https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws" \
  --region us-east-1 \
  --sql "CREATE INDEX idx_employees_department ON employees(department);"
```

### Verify Setup
```bash
# Check if table was created
aws dsql execute-statement \
  --endpoint-url "https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws" \
  --region us-east-1 \
  --sql "SELECT COUNT(*) FROM employees;"
```

The database schema is now ready for the Angular dashboard application.