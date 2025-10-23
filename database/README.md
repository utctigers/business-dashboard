# Aurora DSQL Database Setup

## Employee Management System Database

This directory contains the Aurora DSQL schema and configuration for the employee management system.

### Schema Files

- `employees-schema.sql` - Main employee table schema with sample data

### Table Structure

**employees**
- `id` (BIGINT PRIMARY KEY) - Unique employee identifier
- `name` (VARCHAR(255)) - Employee full name
- `email` (VARCHAR(255) UNIQUE) - Employee email address
- `phone` (VARCHAR(20))` - Employee phone number
- `department` (VARCHAR(100)) - Employee department
- `role` (VARCHAR(100))` - Employee role/position
- `salary` (DECIMAL(10,2))` - Annual salary
- `start_date` (DATE) - Employment start date
- `status` (VARCHAR(20)) - Employment status (Active, On Leave, Inactive)
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record update timestamp

### Aurora DSQL Configuration

**Cluster ID**: `4vthvxld47txd4lmgqpjzagqki`  
**Endpoint**: `4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws`  
**Region**: `us-east-1`

### Setup Instructions

1. Connect to Aurora DSQL cluster: `4vthvxld47txd4lmgqpjzagqki`
2. Execute `employees-schema.sql` to create tables and insert sample data
3. Application automatically connects to the configured cluster endpoint

### Performance Optimizations

- Indexed on `status` for filtering active employees
- Indexed on `department` for department-based queries
- Unique constraint on `email` for data integrity

### Sample Queries

```sql
-- Get all active employees
SELECT * FROM employees WHERE status = 'Active';

-- Get employee count by department
SELECT department, COUNT(*) as count FROM employees GROUP BY department;

-- Get employees by salary range
SELECT * FROM employees WHERE salary BETWEEN 70000 AND 100000;
```