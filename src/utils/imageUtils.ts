// src/utils/imageUtils.ts

/**
 * Limpa URLs de fotos do Google removendo tokens de autenticação
 * que podem causar problemas de CORS
 * 
 * @param url - URL da foto (pode ser null ou undefined)
 * @returns URL limpa ou null
 */
export const cleanPhotoURL = (url: string | null | undefined): string | null => {
  if (!url) return null;
  // Remove tudo depois do primeiro '=' para limpar tokens do Google
  return url.split('=')[0];
};

/**
 * Gera URL de fallback para avatares usando ui-avatars.com
 * 
 * @param displayName - Nome do usuário para gerar o avatar
 * @param options - Opções customizadas para o avatar
 * @returns URL do avatar de fallback
 */
export const getFallbackAvatarURL = (
  displayName: string,
  options?: {
    size?: number;
    background?: string;
    color?: string;
  }
): string => {
  const { size = 96, background = 'random', color = '' } = options || {};
  
  const params = new URLSearchParams({
    name: displayName,
    background,
    size: size.toString(),
  });

  if (color) {
    params.append('color', color);
  }

  return `https://ui-avatars.com/api/?${params.toString()}`;
};

/**
 * Retorna a URL da foto processada ou fallback
 * 
 * @param photoURL - URL da foto original
 * @param displayName - Nome para fallback
 * @param options - Opções para o fallback
 * @returns URL processada ou fallback
 */
export const getProcessedPhotoURL = (
  photoURL: string | null | undefined,
  displayName: string,
  options?: Parameters<typeof getFallbackAvatarURL>[1]
): string => {
  const cleaned = cleanPhotoURL(photoURL);
  return cleaned || getFallbackAvatarURL(displayName, options);
};

/**
 * Props para o componente de imagem com fallback
 */
export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  fallbackSrc: string;
}

/**
 * Handler de erro padrão para imagens
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackURL: string
): void => {
  e.currentTarget.src = fallbackURL;
};