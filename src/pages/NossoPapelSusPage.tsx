// src/pages/NossoPapelSusPage.tsx
import { Link } from 'react-router-dom';
import VideoPlayer from '@/components/common/VideoPlayer';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle } from 'lucide-react';

export default function NossoPapelSusPage() {
    const { user } = useAuthStore();
    const isCompleted = user?.badges.includes('checkin-hc');

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full mx-auto space-y-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Nosso papel e o Sistema Único de Saúde (SUS)</h1>
                <p className="mt-2 text-lg text-gray-600">Entenda como funciona o acesso dos pacientes ao Complexo HC.</p>

                <div className="card-elevated p-4">
                    <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=vgB9iSK3Q-o" title="Como funciona o acesso dos pacientes SUS ao HC?" />
                    
                </div>

                <div className="pt-8">
                    {isCompleted ? (
                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
                            <CheckCircle className="w-6 h-6" />
                            <span>Quiz já respondido!</span>
                        </div>
                    ) : (
                        <Link to="/boas-vindas/quiz" className="btn-primary text-lg px-10 py-4">
                            Iniciar Quiz
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}