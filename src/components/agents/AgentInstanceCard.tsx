import React, { useState } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLanguage } from '../../contexts/LanguageContext';

interface AgentInstanceCardProps {
  instance: {
    id: string;
    name: string;
    webhook_url?: string;
  };
  status?: {
    status: 'connecting' | 'connected' | 'disconnected' | 'qrcode';
    qrCode?: string;
  };
  onRemove: () => void;
  onUpdate: (updates: Partial<AgentInstanceCardProps['instance']>) => void;
}

export function AgentInstanceCard({ instance, status, onRemove, onUpdate }: AgentInstanceCardProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: instance.name,
    webhook_url: instance.webhook_url || ''
  });

  const handleSave = () => {
    if (!editData.name.trim()) return;
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: instance.name,
      webhook_url: instance.webhook_url || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('agents.instanceName')}
            autoFocus
            fullWidth
          />
          <Input
            value={editData.webhook_url}
            onChange={(e) => setEditData(prev => ({ ...prev, webhook_url: e.target.value }))}
            placeholder={t('agents.webhookUrl')}
            fullWidth
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              icon={X}
            >
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              icon={Save}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {instance.name}
              </h4>
              {instance.webhook_url && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs break-all">
                    {instance.webhook_url}
                  </code>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon={Edit2}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                icon={Trash2}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              />
            </div>
          </div>

          {status && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                status.status === 'connected' ? 'bg-green-500' :
                status.status === 'connecting' ? 'bg-yellow-500' :
                status.status === 'qrcode' ? 'bg-blue-500' :
                'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t(`agents.instanceStatus.${status.status}`)}
              </span>
            </div>
          )}

          {status?.status === 'qrcode' && status.qrCode && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img
                src={`data:image/png;base64,${status.qrCode}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}