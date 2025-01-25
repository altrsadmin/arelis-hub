import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check, Key } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';

interface EndpointProps {
  method: string;
  path: string;
  description: string;
  params?: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
  }[];
  response?: {
    status: number;
    example: string;
  };
  request?: {
    example: string;
  };
}

function Endpoint({ method, path, description, params, response, request }: EndpointProps) {
  const [isExpanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors = {
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    POST: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    PATCH: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
        onClick={() => setExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${methodColors[method as keyof typeof methodColors]}`}>
            {method}
          </span>
          <code className="text-sm font-mono">{path}</code>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>

          {params && params.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Parameters</h4>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                {params.map((param, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                    <div className="flex-1">
                      <code className="text-sm font-mono text-gray-900 dark:text-white">{param.name}</code>
                      <span className="ml-2 text-xs text-gray-500">({param.type})</span>
                      {param.required && (
                        <span className="ml-2 text-xs text-red-500">required</span>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{param.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {request && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Request Example</h4>
              <div className="relative">
                <pre className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    {request.example}
                  </code>
                </pre>
                <button
                  onClick={() => handleCopy(request.example)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {response && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Response Example ({response.status})
              </h4>
              <div className="relative">
                <pre className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-gray-900 dark:text-white">
                    {response.example}
                  </code>
                </pre>
                <button
                  onClick={() => handleCopy(response.example)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApiDocs() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const agentEndpoints: EndpointProps[] = [
    {
      method: 'GET',
      path: '/agents',
      description: 'List all agents with optional filtering',
      params: [
        { name: 'status', type: 'string', description: 'Filter by status (active, paused, stopped)' },
        { name: 'customer_id', type: 'string', description: 'Filter by customer' },
        { name: 'page', type: 'number', description: 'Page number for pagination' },
        { name: 'per_page', type: 'number', description: 'Items per page' }
      ],
      response: {
        status: 200,
        example: JSON.stringify({
          data: [
            {
              id: "123",
              name: "Example Agent",
              status: "active",
              customer_id: "456",
              created_at: "2024-01-22T04:45:32Z"
            }
          ],
          pagination: {
            page: 1,
            per_page: 20,
            total: 1
          }
        }, null, 2)
      }
    },
    {
      method: 'GET',
      path: '/agents/:uuid',
      description: 'Get a specific agent by UUID',
      response: {
        status: 200,
        example: JSON.stringify({
          id: "123",
          name: "Example Agent",
          status: "active",
          customer_id: "456",
          created_at: "2024-01-22T04:45:32Z",
          config: {}
        }, null, 2)
      }
    },
    {
      method: 'PATCH',
      path: '/agents/:uuid/status',
      description: 'Update agent status',
      request: {
        example: JSON.stringify({
          status: "paused"
        }, null, 2)
      },
      response: {
        status: 200,
        example: JSON.stringify({
          id: "123",
          status: "paused",
          updated_at: "2024-01-22T04:45:32Z"
        }, null, 2)
      }
    }
  ];

  const webhookEndpoints: EndpointProps[] = [
    {
      method: 'GET',
      path: '/webhooks',
      description: 'List all webhooks',
      response: {
        status: 200,
        example: JSON.stringify([
          {
            id: "123",
            url: "https://example.com/webhook",
            events: ["agent.status.changed", "agent.execution.completed"],
            created_at: "2024-01-22T04:45:32Z"
          }
        ], null, 2)
      }
    },
    {
      method: 'POST',
      path: '/webhooks',
      description: 'Create a new webhook',
      request: {
        example: JSON.stringify({
          url: "https://example.com/webhook",
          events: ["agent.status.changed", "agent.execution.completed"],
          secret: "your-webhook-secret"
        }, null, 2)
      },
      response: {
        status: 201,
        example: JSON.stringify({
          id: "123",
          url: "https://example.com/webhook",
          events: ["agent.status.changed", "agent.execution.completed"],
          created_at: "2024-01-22T04:45:32Z"
        }, null, 2)
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Arelis Hub API
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Complete API reference for integrating with Arelis Hub
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Getting Started
                </h3>
                <nav className="space-y-2">
                  <a 
                    href="#authentication"
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Authentication
                  </a>
                  <a 
                    href="#rate-limiting"
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Rate Limiting
                  </a>
                  <a 
                    href="#errors"
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Errors
                  </a>
                </nav>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Resources
                </h3>
                <nav className="space-y-2">
                  <a 
                    href="#agents"
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Agents
                  </a>
                  <a 
                    href="#webhooks"
                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Webhooks
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Authentication */}
            <section id="authentication" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Authentication
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  All API requests require authentication using an API key. Include your API key in the Authorization header:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                  <code className="text-sm font-mono">
                    Authorization: Bearer your-api-key
                  </code>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Key className="h-4 w-4" />
                  <span>You can get your API key from the Settings page.</span>
                </div>
              </div>
            </section>

            {/* Rate Limiting */}
            <section id="rate-limiting" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Rate Limiting
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The API implements rate limiting to ensure fair usage:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                  <li>1000 requests per minute per API key</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Rate limit information is included in the response headers:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>X-RateLimit-Limit</li>
                  <li>X-RateLimit-Remaining</li>
                  <li>X-RateLimit-Reset</li>
                </ul>
              </div>
            </section>

            {/* Errors */}
            <section id="errors" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Errors
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The API uses conventional HTTP response codes:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                  <li>200: Success</li>
                  <li>400: Bad Request</li>
                  <li>401: Unauthorized</li>
                  <li>403: Forbidden</li>
                  <li>404: Not Found</li>
                  <li>429: Too Many Requests</li>
                  <li>500: Internal Server Error</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Error responses follow this format:
                </p>
                <pre className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <code className="text-sm font-mono">{JSON.stringify({
                    error: {
                      code: "invalid_request",
                      message: "The request was invalid",
                      details: {
                        field: "status",
                        reason: "must be one of: active, paused, stopped"
                      }
                    }
                  }, null, 2)}</code>
                </pre>
              </div>
            </section>

            {/* Agents */}
            <section id="agents" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Agents
              </h2>
              <div className="space-y-4">
                {agentEndpoints.map((endpoint, index) => (
                  <Endpoint key={index} {...endpoint} />
                ))}
              </div>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Webhooks
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Webhooks allow you to receive real-time updates about events in your account.
                  Available events:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>agent.created - When a new agent is created</li>
                  <li>agent.updated - When an agent's configuration is updated</li>
                  <li>agent.status.changed - When an agent's status changes</li>
                  <li>agent.execution.started - When an agent starts execution</li>
                  <li>agent.execution.completed - When an agent completes execution</li>
                  <li>agent.execution.failed - When an agent execution fails</li>
                </ul>
              </div>
              <div className="space-y-4">
                {webhookEndpoints.map((endpoint, index) => (
                  <Endpoint key={index} {...endpoint} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}