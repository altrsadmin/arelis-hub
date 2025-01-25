@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Plug, Plus, Trash2, Edit2, X, Save, Power, PowerOff, AlertCircle } from 'lucide-react';
 import { supabase } from '../lib/supabase';
-import { Button } from '../../components/ui/Button';
-import { Input } from '../../components/ui/Input';
-import { Select } from '../../components/ui/Select';
-import { Badge } from '../../components/ui/Badge';
+import { Button } from '../components/ui/Button';
+import { Input } from '../components/ui/Input';
+import { Select } from '../components/ui/Select';
+import { Badge } from '../components/ui/Badge';
+import { useLanguage } from '../contexts/LanguageContext';
 
 interface ConnectorField {
@@ .. @@
 export default function Connectors() {
   const [connectorTypes, setConnectorTypes] = useState<ConnectorType[]>([]);
   const [connectors, setConnectors] = useState<Connector[]>([]);
+  const { t } = useLanguage();
   const [loading, setLoading] = useState(true);
@@ .. @@
       <div className="flex justify-between items-center">
         <div className="flex items-center gap-2">
           <Plug className="h-5 w-5 text-blue-500" />
-          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
-            Connectors
-          </h3>
+          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
+            {t('navigation.connectors')}
+          </h2>
         </div>
         <Button
           onClick={() => setIsModalOpen(true)}
           icon={Plus}
         >
-          New Connector
+          {t('connectors.newConnector')}
         </Button>
       </div>