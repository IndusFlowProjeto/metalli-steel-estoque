Teste automático de histórico e leituras

1) Atualizar leituras (exemplo - CMD):
curl -X PATCH -H "Content-Type: application/json" -d "{"amarelo":15,"verde":12,"vermelho":9}" "https://indus-flow-projeto-default-rtdb.firebaseio.com/leituras.json"

4) Exemplo PowerShell:
Invoke-RestMethod -Method Patch -Uri 'https://indus-flow-projeto-default-rtdb.firebaseio.com/leituras.json' -Body (@{amarelo=22; verde=18; vermelho=14} | ConvertTo-Json) -ContentType 'application/json'
