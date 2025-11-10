Teste automático de histórico e leituras

1) Atualizar leituras (exemplo - CMD):
curl -X PATCH -H "Content-Type: application/json" -d "{"amarelo":15,"verde":12,"vermelho":9}" "https://indus-flow-projeto-default-rtdb.firebaseio.com/leituras.json"

2) Após rodar o comando acima, o site vai detectar as mudanças e automaticamente criar registros em:
   /registros/laser
   /registros/oxicorte
   /registros/plasma

3) Veja registro:
   - Abra o dashboard e clique no card correspondente (ex: Oxicorte) para ver o histórico.

4) Exemplo PowerShell:
Invoke-RestMethod -Method Patch -Uri 'https://indus-flow-projeto-default-rtdb.firebaseio.com/leituras.json' -Body (@{amarelo=22; verde=18; vermelho=14} | ConvertTo-Json) -ContentType 'application/json'
