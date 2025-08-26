# Script PowerShell - Teste API FirstLabel
Write-Host "=== TESTE API FIRSTLABEL ===" -ForegroundColor Green

# Configuração
$baseUrl = "http://localhost:3000/api"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "1. Testando Auth endpoints..." -ForegroundColor Yellow
try {
    # Teste login (substitua com credenciais válidas)
    $loginData = @{ 
        email = "test@firstlabel.com"
        password = "password123" 
    } | ConvertTo-Json
    
    Write-Host "   POST /auth/login - " -NoNewline
    # Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers
    Write-Host "SKIP (credenciais necessárias)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "2. Testando Order endpoints..." -ForegroundColor Yellow
try {
    Write-Host "   GET /orders - " -NoNewline
    # $orders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method GET -Headers $headers
    Write-Host "PENDENTE (auth necessária)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "3. Testando Customer endpoints..." -ForegroundColor Yellow
try {
    Write-Host "   GET /customers - " -NoNewline
    # $customers = Invoke-RestMethod -Uri "$baseUrl/customers" -Method GET -Headers $headers
    Write-Host "PENDENTE (auth necessária)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTE MANUAL RECOMENDADO ===" -ForegroundColor Green
Write-Host "1. npm run dev" -ForegroundColor Cyan
Write-Host "2. Acesse http://localhost:3000" -ForegroundColor Cyan
Write-Host "3. Teste workflow: Login > Orders > Create > Status" -ForegroundColor Cyan
Write-Host "4. Valide PDFs: Orçamento + Ordem de Serviço" -ForegroundColor Cyan