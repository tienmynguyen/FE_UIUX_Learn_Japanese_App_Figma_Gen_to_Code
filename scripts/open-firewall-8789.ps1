# Mo cong 8789 cho Wrangler dev (dien thoai trong LAN goi duoc may Windows).
#
# QUAN TRONG: ban dang o thu muc nao cung duoc, nhung phai goi DUNG DUONG DAN file .ps1
# (khong duoc chi go "scripts\..." khi dang o C:\Windows\System32).
#
# Cach 1 - PowerShell "Run as Administrator", dan nguyen dong:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; & "E:\VKU\Figma\AppGen\scripts\open-firewall-8789.ps1"
#
# Cach 2 - cd vao project roi chay:
#   cd E:\VKU\Figma\AppGen
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
#   .\scripts\open-firewall-8789.ps1
#
# Cach 3 - khong can file, dan lenh netsh (van phai Administrator):
#   netsh advfirewall firewall add rule name="AppGen Wrangler Dev 8789" dir=in action=allow protocol=TCP localport=8789

netsh advfirewall firewall add rule name="AppGen Wrangler Dev 8789" dir=in action=allow protocol=TCP localport=8789
if ($LASTEXITCODE -ne 0) {
  Write-Error "That bai. Dam bao chay PowerShell voi quyen Administrator."
  exit 1
}
Write-Host "OK: da them rule cho TCP 8789 (inbound)."
