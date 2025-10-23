# AWS CLI Configuration

## Step 1: Verify Installation
Open a new terminal and run:
```bash
aws --version
```

## Step 2: Configure AWS Credentials
```bash
aws configure
```

Enter your AWS credentials:
- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key  
- **Default region name**: `us-east-1`
- **Default output format**: `json`

## Step 3: Test Connection
```bash
aws sts get-caller-identity
```

## Step 4: Execute Database Schema
Once configured, run the Aurora DSQL setup:
```bash
aws dsql execute-statement \
  --cluster-identifier 4vthvxld47txd4lmgqpjzagqki \
  --region us-east-1 \
  --sql "SELECT 1 as test;"
```

Then proceed with the full schema setup from `setup-cli.md`.