type Props = { youtubeUrl: string; title?: string };

export default function VideoPlayer({ youtubeUrl, title }: Props) {
  const id = extractId(youtubeUrl);
  if (!id) return <div className="text-red-600">URL inválida do YouTube.</div>;
  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title || "Vídeo"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function extractId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch { return null; }
}
