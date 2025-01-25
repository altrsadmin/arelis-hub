# Documentação da API Arelis Hub

## Visão Geral

A API do Arelis Hub fornece acesso programático para gerenciamento de agentes, monitoramento e recursos de integração. Esta API segue os princípios REST e utiliza JSON para payloads de requisição e resposta.

## URL Base

```
https://api.arelishub.com/v1
```

## Autenticação

Todas as requisições à API requerem autenticação usando uma chave de API. Inclua sua chave de API no cabeçalho `Authorization`:

```
Authorization: Bearer sua-chave-api
```

## Limite de Requisições

- 1000 requisições por minuto por chave de API
- Cabeçalhos de limite incluídos nas respostas:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Endpoints

### Agentes

#### Listar Agentes

```http
GET /agents
```

Parâmetros de Consulta:
- `status` - Filtrar por status (active, paused, stopped)
- `customer_id` - Filtrar por cliente
- `page` - Número da página (padrão: 1)
- `per_page` - Itens por página (padrão: 20)

#### Obter Agente

```http
GET /agents/:uuid
```

#### Atualizar Status do Agente

```http
PATCH /agents/:uuid/status
```

Payload:
```json
{
  "status": "active" | "paused" | "stopped"
}
```

#### Obter Métricas do Agente

```http
GET /agents/:uuid/metrics
```

### Webhooks

#### Listar Webhooks

```http
GET /webhooks
```

#### Criar Webhook

```http
POST /webhooks
```

Payload:
```json
{
  "url": "https://seu-dominio.com/webhook",
  "events": ["agent.status.changed", "agent.execution.completed"],
  "secret": "seu-segredo-webhook"
}
```

#### Excluir Webhook

```http
DELETE /webhooks/:id
```

## Eventos de Webhook

Eventos que podem acionar webhooks:

- `agent.created` - Quando um novo agente é criado
- `agent.updated` - Quando a configuração de um agente é atualizada
- `agent.status.changed` - Quando o status de um agente muda
- `agent.execution.started` - Quando uma execução de agente inicia
- `agent.execution.completed` - Quando uma execução de agente é concluída
- `agent.execution.failed` - Quando uma execução de agente falha
- `agent.limit.reached` - Quando um agente atinge seu limite de execução

### Exemplo de Payload de Webhook

```json
{
  "id": "evt_123",
  "type": "agent.status.changed",
  "created": "2024-01-22T04:45:32Z",
  "data": {
    "agent_uuid": "abc-123",
    "previous_status": "active",
    "new_status": "paused",
    "reason": "execution_limit_reached"
  }
}
```

## Tratamento de Erros

A API usa códigos de resposta HTTP convencionais:

- 200: Sucesso
- 400: Requisição Inválida
- 401: Não Autorizado
- 403: Proibido
- 404: Não Encontrado
- 429: Muitas Requisições
- 500: Erro Interno do Servidor

Formato de Resposta de Erro:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "A requisição é inválida",
    "details": {
      "field": "status",
      "reason": "deve ser um dos valores: active, paused, stopped"
    }
  }
}
```

## SDKs

SDKs oficiais disponíveis para:

- Node.js
- Python
- PHP
- Go
- Ruby

## Suporte

Para suporte da API, contate:
- Email: api@arelishub.com
- Documentação: https://docs.arelishub.com