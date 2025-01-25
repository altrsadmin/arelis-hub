# NotificaMe HUB Service

This service provides a TypeScript client and service wrapper for interacting with the NotificaMe HUB API for messaging integration.

## Features

- Type-safe API client
- Message status monitoring
- Event-based status updates
- Webhook handling
- Error handling

## Usage

```typescript
import { NotificameHubService } from '@arelis/notificame-hub';

// Create service instance
const service = new NotificameHubService({
  apiKey: 'your-api-key'
});

// Initialize service
await service.initialize();

// Listen for message status updates
service.on('messageStatus', (status) => {
  console.log(`Message ${status.id} status: ${status.status}`);
});

// Send a text message
const response = await service.sendMessage({
  to: '5511999999999',
  message: 'Hello from NotificaMe HUB!'
});

// Send a media message
const mediaResponse = await service.sendMessage({
  to: '5511999999999',
  message: 'Check out this image!',
  type: 'image',
  mediaUrl: 'https://example.com/image.jpg',
  caption: 'Cool image'
});

// Configure webhook
await service.configureWebhook({
  url: 'https://your-domain.com/webhook',
  events: ['message.status'],
  secret: 'your-webhook-secret'
});

// Clean up
service.destroy();
```

## Message Types

The service supports various message types:

- `text`: Simple text messages
- `image`: Image messages with optional caption
- `video`: Video messages with optional caption
- `audio`: Audio messages
- `document`: Document messages with filename

## Events

The service emits the following events:

- `messageStatus`: When a message status changes
  ```typescript
  {
    id: string;
    status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    error?: string;
  }
  ```

- `error`: When an error occurs
  ```typescript
  {
    messageId?: string;
    error: Error;
  }
  ```

## API Reference

### NotificameHubService

#### Methods

- `initialize()`: Initialize the service
- `sendMessage(options)`: Send a message
- `getMessageStatus(messageId)`: Get message status
- `configureWebhook(config)`: Configure webhook
- `getWebhookConfig()`: Get webhook configuration
- `handleWebhookEvent(event)`: Handle incoming webhook event
- `destroy()`: Clean up resources

#### Message Status

Messages can have the following statuses:

- `queued`: Message is queued for sending
- `sent`: Message has been sent
- `delivered`: Message was delivered to recipient
- `read`: Message was read by recipient
- `failed`: Message failed to send

## Support

For API support, contact:
- Email: suporte@notificame.com.br
- Documentation: https://hub.notificame.com.br/docs