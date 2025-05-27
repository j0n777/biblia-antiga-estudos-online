
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import BibleImportDialog from '@/components/admin/BibleImportDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle } from 'lucide-react';

const AdminImport = () => {
  return (
    <PageLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="bg-parchment-light/90 border-parchment-dark/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold font-oldstyle text-scripture-heading">
              <Database className="h-6 w-6 text-ancient-gold" />
              Administração - Importação de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Problema Identificado</h3>
                  <p className="text-sm text-amber-700">
                    Os dados da Bíblia no banco têm campos version_id e book_id nulos, 
                    causando problemas na busca e exibição dos livros.
                  </p>
                </div>
              </div>
              
              <BibleImportDialog />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminImport;
