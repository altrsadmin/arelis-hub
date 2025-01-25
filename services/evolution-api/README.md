# Evolution API Service

This service provides a TypeScript client and service wrapper for interacting with the Evolution API for WhatsApp integration.

## Features

- Type-safe API client
- Automatic instance state monitoring
- Event-based state changes
- Connection management
- QR code handling
- Error handling

## Usage

```typescript
import { EvolutionApiService } from '@arelis/evolution-api';

// Create service instance
const service = new EvolutionApiService({
  baseUrl: 'https://your-evolution-api.com',
  apiKey: 'your-api-key'
});

// Initialize service
await service.initialize();

// Listen for state changes
service.on('stateChange', ({ instanceName, currentState, qrcode }) => {
  if (currentState === 'qrcode') {
    console.log(`New QR code for ${instanceName}:`, qrcode);
  } else if (currentState === 'connected') {
    console.log(`Instance ${instanceName} is now connected`);
  }
});

// Create new WhatsApp instance
const instance = await service.createInstance('my-instance');

// Connect instance
await service.connectInstance('my-instance');

// Get instance state
const instanceState = service.getInstance('my-instance');

// Configure webhook
await service.configureWebhook('my-instance', {
  enabled: true,
  url: 'https://my-webhook.com/evolution-api',
  webhook_by_events: true,
  events: ['messages.upsert', 'connection.update']
});

// Configure settings
await service.configureSettings('my-instance', {
  reject_call: true,
  msg_call: 'Sorry, calls are not supported',
  groups_ignore: true,
  always_online: true,
  read_messages: true,
  read_status: true
});

// Clean up
service.destroy();
```

## Events

The service emits the following events:

- `stateChange`: When an instance's state changes
  ```typescript
  {
    instanceName: string;
    previousState: string;
    currentState: string;
    qrcode?: string;
    number?: string;
  }
  ```

- `error`: When an error occurs
  ```typescript
  {
    instanceName: string;
    error: Error;
  }
  ```

## API Reference

### EvolutionApiService

#### Methods

- `initialize()`: Initialize the service and start monitoring existing instances
- `createInstance(instanceName: string)`: Create a new WhatsApp instance
- `getInstance(instanceName: string)`: Get instance by name
- `getAllInstances()`: Get all instances
- `connectInstance(instanceName: string)`: Connect an instance
- `logoutInstance(instanceName: string)`: Logout from an instance
- `deleteInstance(instanceName: string)`: Delete an instance
- `destroy()`: Clean up resources

#### Events

- `stateChange`: Emitted when instance state changes
- `error`: Emitted when an error occurs

### Instance States

- `connecting`: Instance is connecting

### Webhook Configuration

The webhook configuration allows you to receive real-time updates about instance events:

```typescript
interface WebhookConfig {
  enabled: boolean;
  url: string;
  webhook_by_events?: boolean;
  events?: string[];
}
```

Available events:
- `messages.upsert`: New messages
- `messages.update`: Message updates
- `messages.delete`: Deleted messages
- `connection.update`: Connection status changes
- `qr.update`: QR code updates
- `contacts.upsert`: Contact updates
- `contacts.update`: Contact modifications
- `groups.upsert`: Group updates
- `groups.update`: Group modifications

### Instance Settings

Configure instance behavior with settings:

```typescript
interface Settings {
  reject_call?: boolean;    // Reject incoming calls
  msg_call?: string;        // Message to send when rejecting calls
  groups_ignore?: boolean;  // Ignore group messages
  always_online?: boolean;  // Keep instance always online
  read_messages?: boolean;  // Mark messages as read
  read_status?: boolean;    // Mark status as read
}
```
- `connected`: Instance is connected and ready
- `disconnected`: Instance is disconnected
- `qrcode`: Instance is waiting for QR code scan