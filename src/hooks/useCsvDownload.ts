// src/hooks/useCsvDownload.ts
import { useCallback } from 'react';

export function useCsvDownload() {
  const downloadCsv = useCallback((data: Record<string, any>[], filename: string) => {
    if (!data || data.length === 0) {
      console.warn("Nenhum dado para baixar.");
      return;
    }

    // Define o BOM para UTF-8 para garantir a codificação correta (acentos)
    const BOM = '\uFEFF'; 
    const headers = Object.keys(data[0]);
    
    // Cria o cabeçalho
    const csvHeader = headers.join(';') + '\n';
    
    // Cria as linhas
    const csvRows = data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        // Escapa aspas dentro da célula
        cell = cell.replace(/"/g, '""');
        // Coloca aspas se a célula contiver ponto e vírgula ou nova linha
        if (cell.includes(';') || cell.includes('\n') || cell.includes(',')) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(';')
    ).join('\n');

    const csvContent = BOM + csvHeader + csvRows;

    // Cria o Blob e o link de download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return { downloadCsv };
}