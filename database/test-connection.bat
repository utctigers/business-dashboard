@echo off
echo Testing Aurora DSQL connection...
echo Cluster: 4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws

set ENDPOINT=https://4vthvxld47txd4lmgqpjzagqki.dsql.us-east-1.on.aws
set REGION=us-east-1

echo.
echo Testing connection with simple query...
aws dsql execute-statement --endpoint-url %ENDPOINT% --region %REGION% --sql "SELECT 1 as test_connection;"

echo.
echo Connection test complete!