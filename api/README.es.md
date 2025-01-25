# Documentación de la API de Arelis Hub

## Descripción General

La API de Arelis Hub proporciona acceso programático para la gestión de agentes, monitoreo y capacidades de integración. Esta API sigue los principios REST y utiliza JSON para las cargas útiles de solicitud y respuesta.

## URL Base

```
https://api.arelishub.com/v1
```

## Autenticación

Todas las solicitudes a la API requieren autenticación usando una clave de API. Incluya su clave de API en el encabezado `Authorization`:

```
Authorization: Bearer tu-clave-api
```

## Límites de Tasa

- 1000 solicitudes por minuto por clave de API
- Encabezados de límite incluidos en las respuestas:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Endpoints

### Agentes

#### Listar Agentes

```http
GET /agents
```

Parámetros de Consulta:
- `status` - Filtrar por estado (active, paused, stopped)
- `customer_id` - Filtrar por cliente
- `page` - Número de página (predeterminado: 1)
- `per_page` - Elementos por página (predeterminado: 20)

#### Obtener Agente

```http
GET /agents/:uuid
```

#### Actualizar Estado del Agente

```http
PATCH /agents/:uuid/status
```

Carga útil:
```json
{
  "status": "active" | "paused" | "stopped"
}
```

#### Obtener Métricas del Agente

```http
GET /agents/:uuid/metrics
```

### Webhooks

#### Listar Webhooks

```http
GET /webhooks
```

#### Crear Webhook

```http
POST /webhooks
```

Carga útil:
```json
{
  "url": "https://tu-dominio.com/webhook",
  "events": ["agent.status.changed", "agent.execution.completed"],
  "secret": "tu-secreto-webhook"
}
```

#### Eliminar Webhook

```http
DELETE /webhooks/:id
```

## Eventos de Webhook

Eventos que pueden activar webhooks:

- `agent.created` - Cuando se crea un nuevo agente
- `agent.updated` - Cuando se actualiza la configuración de un agente
- `agent.status.changed` - Cuando cambia el estado de un agente
- `agent.execution.started` - Cuando comienza la ejecución de un agente
- `agent.execution.completed` - Cuando se completa la ejecución de un agente
- `agent.execution.failed` - Cuando falla la ejecución de un agente
- `agent.limit.reached` - Cuando un agente alcanza su límite de ejecución

### Ejemplo de Carga Útil de Webhook

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

## Manejo de Errores

La API utiliza códigos de respuesta HTTP convencionales:

- 200: Éxito
- 400: Solicitud Incorrecta
- 401: No Autorizado
- 403: Prohibido
- 404: No Encontrado
- 429: Demasiadas Solicitudes
- 500: Error Interno del Servidor

Formato de Respuesta de Error:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "La solicitud no es válida",
    "details": {
      "field": "status",
      "reason": "debe ser uno de: active, paused, stopped"
    }
  }
}
```

## SDKs

SDKs oficiales disponibles para:

- Node.js
- Python
- PHP
- Go
- Ruby

## Soporte

Para soporte de la API, contacte:
- Email: api@arelishub.com
- Documentación: https://docs.arelishub.com