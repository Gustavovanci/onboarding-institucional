// src/pages/CertificatesPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { db } from "../utils/firebase";
import { collection, doc, getDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useCertificateGenerator } from "../components/certificates/CertificateGenerator";
import { type Certificate, type Module, type User } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Award, Download } from "lucide-react";
import { motion } from "framer-motion";

interface CertificateWithDetails {
  certificate: Certificate;
  module: Module;
  user: User;
}

export default function CertificatesPage() {
  const { user } = useAuthStore();
  const [certificates, setCertificates] = useState<CertificateWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { generatePDF } = useCertificateGenerator();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // 🔄 Escuta em tempo real os certificados do usuário
    const certificatesRef = collection(db, "certificates");
    const q = query(certificatesRef, where("userId", "==", user.uid), orderBy("completionDate", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedData: CertificateWithDetails[] = await Promise.all(
        snapshot.docs.map(async (certDoc) => {
          const certData = {
            ...certDoc.data(),
            id: certDoc.id,
            completionDate:
              certDoc.data().completionDate?.toMillis?.() || certDoc.data().completionDate,
          } as Certificate;

          let moduleData: Module | null = null;

          if (certData.moduleId === "trilha-institucional-completa") {
            moduleData = {
              id: "trilha-institucional-completa",
              title: "Conclusão da Trilha Institucional",
              description:
                "Certificado concedido pela conclusão de todos os módulos obrigatórios da trilha de integração do HCFMUSP.",
              estimatedMinutes: 120,
              order: 999,
              points: 0,
              category: "Geral",
              isRequired: true,
            };
          } else {
            const moduleRef = doc(db, "modules", certData.moduleId);
            const moduleSnap = await getDoc(moduleRef);
            if (moduleSnap.exists()) {
              moduleData = { ...moduleSnap.data(), id: moduleSnap.id } as Module;
            }
          }

          if (moduleData) {
            return { certificate: certData, module: moduleData, user };
          }
          return null;
        })
      );

      setCertificates(fetchedData.filter(Boolean) as CertificateWithDetails[]);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Meus Certificados</h1>
        <p className="mt-2 text-lg text-gray-600">
          Aqui estão todas as suas conquistas certificadas. Parabéns!
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="space-y-6">
          {certificates.map(({ certificate, module, user }, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-card border p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{module.title}</h3>
                  <p className="text-sm text-gray-500">
                    Concluído em:{" "}
                    {new Date(certificate.completionDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => generatePDF(certificate, user, module)}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">
            Você ainda não possui certificados.
          </h2>
          <p className="text-gray-600 mt-2">
            Complete os módulos para ganhar seus certificados e vê-los aqui!
          </p>
          <Link to="/modules" className="btn-primary mt-6">
            Explorar Módulos
          </Link>
        </div>
      )}
    </div>
  );
}
