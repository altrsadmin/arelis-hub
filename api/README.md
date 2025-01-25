# Arelis Hub API Documentation

## Overview

The Arelis Hub API provides programmatic access to agent management, monitoring, and integration capabilities. This API follows REST principles and uses JSON for request and response payloads.

## Base URL

```
https://api.arelishub.com/v1
```

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```
Authorization: Bearer your-api-key
```

## Rate Limiting

- 1000 requests per minute per API key
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Endpoints

### Agents

#### List Agents

```http
GET /agents
```

Query Parameters:
- `status` - Filter by status (active, paused, stopped)
- `customer_id` - Filter by customer
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20)

#### Get Agent

```http
GET /agents/:uuid
```

#### Update Agent Status

```http
PATCH /agents/:uuid/status
```

Payload:
```json
{
  "status": "active" | "paused" | "stopped"
}
```

#### Get Agent Metrics

```http
GET /agents/:uuid/metrics
```

### Webhooks

#### List Webhooks

```http
GET /webhooks
```

#### Create Webhook

```http
POST /webhooks
```

Payload:
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["agent.status.changed", "agent.execution.completed"],
  "secret": "your-webhook-secret"
}
```

#### Delete Webhook

```http
DELETE /webhooks/:id
```

## Webhook Events

Events that can trigger webhooks:

- `agent.created` - When a new agent is created
- `agent.updated` - When an agent's configuration is updated
- `agent.status.changed` - When an agent's status changes
- `agent.execution.started` - When an agent starts execution
- `agent.execution.completed` - When an agent completes execution
- `agent.execution.failed` - When an agent execution fails
- `agent.limit.reached` - When an agent reaches its execution limit

### Webhook Payload Example

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

## Error Handling

The API uses conventional HTTP response codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Error Response Format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": {
      "field": "status",
      "reason": "must be one of: active, paused, stopped"
    }
  }
}
```

## SDKs

Official SDKs are available for:

- Node.js
- Python
- PHP
- Go
- Ruby

## Support

For API support, contact:
- Email: api@arelishub.com
- Documentation: https://docs.arelishub.com