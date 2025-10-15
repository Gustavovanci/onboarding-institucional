// src/pages/NossoPapelSusPage.tsx
import { Link } from 'react-router-dom';
import VideoPlayer from '@/components/common/VideoPlayer';

export default function NossoPapelSusPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full mx-auto space-y-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Nosso papel e o Sistema Único de Saúde (SUS)</h1>
                <p className="mt-2 text-lg text-gray-600">Entenda como funciona o acesso dos pacientes ao Complexo HC.</p>

                <div className="card-elevated p-4">
                    <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=SErc_d_tB2I" title="Como funciona o acesso dos pacientes SUS ao HC?" />
                </div>

                <div className="pt-8">
                    <Link to="/boas-vindas/quiz" className="btn-primary text-lg px-10 py-4">
                        Quiz Boas-Vindas
                    </Link>
                </div>
            </div>
        </div>
    );
}