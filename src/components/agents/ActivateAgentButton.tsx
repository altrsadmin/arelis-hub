import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { ActivateAgentModal } from './ActivateAgentModal';
import { useLanguage } from '../../contexts/LanguageContext';

export function ActivateAgentButton() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const { t } = useLanguage();

  const handleSuccess = () => {
    setModalOpen(false);
    // You can add any additional success handling here
  };

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        className="bg-[#2afbc6] hover:bg-[#2afbc6]/90 text-gray-900 font-semibold"
        icon={Zap}
      >
        {t('agents.activate')}
      </Button>

      <ActivateAgentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}