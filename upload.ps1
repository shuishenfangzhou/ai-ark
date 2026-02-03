$password = ConvertTo-SecureString '210981040436Fhz' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential('root', $password)
$session = New-PSSession -HostName 47.96.82.66 -Credential $cred -Port 22
Copy-Item -Path 'D:\AI工具箱\dist\*' -Destination '/opt/1panel/apps/openresty/openresty/www/sites/my-ai-site/index/' -ToSession $session -Recurse -Force
Write-Host "Upload completed!"
