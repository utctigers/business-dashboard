# Install AWS CLI v2 for Windows
$url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$output = "$env:TEMP\AWSCLIV2.msi"

Write-Host "Downloading AWS CLI v2..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Installing AWS CLI v2..."
Start-Process msiexec.exe -Wait -ArgumentList "/i $output /quiet"

Write-Host "AWS CLI installation complete!"
Write-Host "Please restart your terminal and run 'aws --version' to verify installation."