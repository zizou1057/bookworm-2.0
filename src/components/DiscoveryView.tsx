import { useState } from "react";
import { Search, Sparkles, BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiscoveryViewProps {
  library: any[];
  onAddBook: (book: any) => Promise<void>;
}

interface RecommendedBook {
  title: string;
  author: string;
  description: string;
  coverUrl?: string;
  pages?: number;
}

export function DiscoveryView({ library, onAddBook }: DiscoveryViewProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [error, setError] = useState<string | null>(null);

  const extractUserProfile = () => {
    // Extraer géneros top
    const genreCounts: Record<string, number> = {};
    library.forEach(b => {
      if (b.genres) {
        b.genres.forEach((g: string) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });
    
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => g);

    return `Mis géneros favoritos son: ${topGenres.join(', ')}.`;
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const userProfile = extractUserProfile();
      const prompt = `Actúa como un recomendador experto de libros. ${userProfile} 
El usuario también dijo: "${query}".
Recomienda exactamente 3 libros distintos. 
DEBES devolver ÚNICAMENTE un objeto JSON con la propiedad "recommendations" que contenga un arreglo con este formato exacto:
{
  "recommendations": [
    {
      "title": "Título del libro",
      "author": "Nombre del Autor",
      "description": "Una breve sinopsis atrapante de máximo 2 oraciones."
    }
  ]
}
No agregues texto antes ni después del JSON.`;

      // Llamada a la API online compatible con OpenAI (ej. OpenAI, Groq, OpenRouter, Gemini API)
      const apiUrl = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
      const apiKey = import.meta.env.VITE_AI_API_KEY || '';
      const aiModel = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo';

      if (!apiKey) {
        throw new Error("No hay una API Key configurada. Por favor configura VITE_AI_API_KEY en tu archivo .env.");
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`Error de la IA: ${errData.error?.message || res.statusText || 'Desconocido'}`);
      }
      
      const data = await res.json();
      const contentString = data?.choices?.[0]?.message?.content || "{}";
      
      // Intentar parsear el JSON de la IA
      let parsedBooks: RecommendedBook[] = [];
      try {
        const parsed = JSON.parse(contentString);
        parsedBooks = parsed.recommendations || [];
      } catch (e) {
        // En caso de que la IA responda con texto rodeando al JSON (ej. \`\`\`json ...)
        const match = contentString.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          parsedBooks = parsed.recommendations || [];
        } else {
          throw new Error("El formato devuelto por la IA no es válido.");
        }
      }

      // Enriquecer con OpenLibrary API
      const enrichedBooks = await Promise.all(parsedBooks.map(async (book) => {
        try {
          const olRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&limit=1`);
          const olData = await olRes.json();
          if (olData.docs && olData.docs.length > 0) {
            const info = olData.docs[0];
            return {
              ...book,
              coverUrl: info.cover_i ? `https://covers.openlibrary.org/b/id/${info.cover_i}-L.jpg` : undefined,
              pages: info.number_of_pages_median || 0
            };
          }
        } catch (e) {
          console.error("Error fetching OpenLibrary for", book.title);
        }
        return book;
      }));

      setRecommendations(enrichedBooks);

    } catch (err: any) {
      setError(err.message || "Ocurrió un error al buscar recomendaciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (book: RecommendedBook) => {
    await onAddBook({
      title: book.title,
      author: book.author,
      pages: book.pages || 0,
      coverUrl: book.coverUrl || '',
      status: 'unread',
      genres: []
    });
    // Opcional: mostrar notificación o quitar la tarjeta
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-[#00BFB3]" /> Descubrimiento Inteligente
        </h2>
        <p className="text-gray-500">Nuestra IA analiza tu biblioteca y tus gustos para encontrar tu próxima gran lectura.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm mb-10 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. 'Quiero una novela de misterio espacial' o déjalo vacío para usar tus favoritos..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#00BFB3] focus:ring-2 focus:ring-[#00BFB3]/20 outline-none transition-all text-sm font-medium"
            onKeyDown={(e) => e.key === 'Enter' && fetchRecommendations()}
          />
        </div>
        <Button 
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-[#00BFB3] hover:bg-[#009F95] text-white py-4 px-8 h-auto rounded-xl font-bold shadow-md shadow-[#00BFB3]/20 transition-all"
        >
          {loading ? 'Pensando...' : 'Descubrir'}
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl font-medium text-sm border border-red-100 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 animate-pulse">
          <Sparkles className="w-12 h-12 mb-4 text-[#00BFB3]/50" />
          <p className="font-medium">Explorando millones de libros para ti...</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="grid grid-cols-3 gap-8">
          {recommendations.map((book, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-lg transition-all group bg-white rounded-2xl overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform" />
                ) : (
                  <BookOpen className="w-16 h-16 text-gray-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <Button 
                    onClick={() => handleAdd(book)}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Añadir
                  </Button>
                </div>
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-1 leading-tight">{book.title}</h3>
                <p className="text-sm font-medium text-[#00BFB3] mb-3">{book.author}</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 flex-1">
                  {book.description}
                </p>
                {book.pages && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Badge variant="secondary" className="bg-gray-50 text-gray-500 font-semibold text-xs border-none">
                      {book.pages} páginas
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <BookOpen className="w-16 h-16 mb-4 text-gray-200" />
          <p className="font-medium text-gray-500">Las recomendaciones aparecerán aquí.</p>
        </div>
      )}
    </div>
  );
}
