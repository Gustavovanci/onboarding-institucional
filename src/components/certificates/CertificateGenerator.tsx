// src/components/certificates/CertificateGenerator.tsx
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { type Certificate, type User, type Module } from '../../types';

interface CertificateTemplateProps {
  certificate: Certificate;
  user: User;
  module: Module;
}

// Este é o componente React que define a aparência do seu certificado.
export const CertificateTemplate = ({ certificate, user, module }: CertificateTemplateProps) => (
  <div style={{
    width: '1123px', // A4 landscape width in pixels (approx @ 96dpi)
    height: '794px', // A4 landscape height in pixels (approx @ 96dpi)
    fontFamily: 'serif',
    color: '#333',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: 'white', // Fundo branco para garantir a captura
    // Se você tiver uma imagem de fundo, coloque em /public e descomente a linha abaixo:
    // backgroundImage: `url('/fundo-certificado.png')`,
    // backgroundSize: 'cover'
  }}>
    <img src="/hc/HCFMUSP.png" alt="HCFMUSP Logo" style={{ position: 'absolute', top: '40px', left: '40px', width: '120px' }} />

    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#0D4E48', marginBottom: '20px' }}>
      CERTIFICADO DE CONCLUSÃO
    </h1>
    <p style={{ fontSize: '20px', margin: '10px 0' }}>
      Certificamos que
    </p>
    <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2B97D4', margin: '10px 0' }}>
      {user.displayName}
    </h2>
    <p style={{ fontSize: '20px', margin: '10px 0', textAlign: 'center', maxWidth: '80%' }}>
      concluiu com sucesso o módulo de onboarding institucional
    </p>
    <h3 style={{ fontSize: '28px', fontStyle: 'italic', color: '#20856B', margin: '10px 0' }}>
      "{module.title}"
    </h3>
    <p style={{ fontSize: '18px', margin: '10px 0' }}>
      com uma carga horária estimada de {module.estimatedMinutes} minutos.
    </p>
    <p style={{ fontSize: '16px', marginTop: '40px' }}>
      Concluído em: {new Date(certificate.completionDate).toLocaleDateString('pt-BR')}
    </p>
    <p style={{ fontSize: '12px', marginTop: 'auto', position: 'absolute', bottom: '40px' }}>
      ID do Certificado: {certificate.id}
    </p>
  </div>
);

// ==================================================================
// == ✅ A CORREÇÃO ESTÁ AQUI: A PALAVRA 'export' É ESSENCIAL ==
// ==================================================================
export const useCertificateGenerator = () => {
  const generatePDF = async (certificate: Certificate, user: User, module: Module) => {
    // Cria um container temporário fora da tela para renderizar o template
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // Move para fora da tela
    document.body.appendChild(tempContainer);

    // Usa a nova API do React 18 para renderizar o componente
    const root = createRoot(tempContainer);
    root.render(<CertificateTemplate certificate={certificate} user={user} module={module} />);

    // Espera um momento para garantir que tudo foi renderizado, incluindo imagens
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
      scale: 2, // Aumenta a resolução para melhor qualidade de impressão
      useCORS: true, // Permite carregar imagens de outras origens (como a foto do Google)
    });
    
    // Limpa o container temporário
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`certificado-${module.id}-${user.displayName.replace(/ /g, '_')}.pdf`);
  };

  return { generatePDF };
};