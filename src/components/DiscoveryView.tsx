import { useState, useEffect } from "react";
import { Search, BookOpen, PlusCircle, Clock, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DiscoveryViewProps {
  library: any[];
  onAddBook: (book: any) => Promise<void>;
}

interface FoundBook {
  title: string;
  author: string;
  coverUrl?: string;
  pages?: number;
  publishYear?: number;
  subjects?: string[];
  olKey?: string;
  rating?: number;
}

// Diccionario de traducción de términos comunes en español → keywords para OpenLibrary
const QUERY_TRANSLATIONS: Record<string, string> = {
  "amor": "love romance",
  "novela": "novel fiction",
  "ciencia ficción": "science fiction",
  "fantasía": "fantasy",
  "misterio": "mystery",
  "terror": "horror",
  "aventura": "adventure",
  "historia": "history historical",
  "biografía": "biography",
  "autoayuda": "self help",
  "filosofía": "philosophy",
  "poesía": "poetry",
  "humor": "comedy humor",
  "thriller": "thriller suspense",
  "romance": "romance",
  "clásico": "classic literature",
  "infantil": "children",
  "juvenil": "young adult",
  "siglo 20": "20th century",
  "siglo xix": "19th century",
  "siglo xx": "20th century",
  "siglo xxi": "21st century",
  "peruano": "peru peruvian",
  "mexicano": "mexico mexican",
  "argentino": "argentina argentinian",
  "latinoamericano": "latin america",
  "español": "spain spanish",
  "colombiano": "colombia colombian",
  "chileno": "chile chilean",
};

function translateQuery(query: string): string {
  let translated = query.toLowerCase();
  Object.entries(QUERY_TRANSLATIONS).forEach(([es, en]) => {
    translated = translated.replace(new RegExp(es, 'gi'), en);
  });
  // Remover palabras de relleno en español
  const stopwords = ['quiero', 'dame', 'busco', 'recomiéndame', 'un', 'una', 'de', 'por', 'del', 'el', 'la', 'los', 'las', 'escrito', 'escrita', 'que', 'sea', 'sobre'];
  stopwords.forEach(w => {
    translated = translated.replace(new RegExp(`\\b${w}\\b`, 'gi'), ' ');
  });
  return translated.replace(/\s+/g, ' ').trim();
}

export function DiscoveryView({ library, onAddBook }: DiscoveryViewProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FoundBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [addedKeys, setAddedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('bookworm_search_history');
    if (saved) {
      try { setRecentSearches(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveToHistory = (q: string) => {
    if (!q.trim()) return;
    const newHistory = [q, ...recentSearches.filter(r => r !== q)].slice(0, 6);
    setRecentSearches(newHistory);
    localStorage.setItem('bookworm_search_history', JSON.stringify(newHistory));
  };

  const searchBooks = async (searchQuery: string = query) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    if (searchQuery && searchQuery !== query) setQuery(searchQuery);

    setLoading(true);
    setError(null);
    setResults([]);
    saveToHistory(finalQuery);

    try {
      const translatedQuery = translateQuery(finalQuery);
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(translatedQuery)}&limit=9&lang=spa,eng&fields=key,title,author_name,cover_i,number_of_pages_median,first_publish_year,subject,ratings_average`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al conectar con OpenLibrary.");

      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        setError("No se encontraron libros para esa búsqueda. Intenta con otras palabras.");
        return;
      }

      const books: FoundBook[] = data.docs
        .filter((d: any) => d.title && d.author_name)
        .slice(0, 9)
        .map((d: any) => ({
          title: d.title,
          author: d.author_name?.[0] || "Autor desconocido",
          coverUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : undefined,
          pages: d.number_of_pages_median || 0,
          publishYear: d.first_publish_year,
          subjects: d.subject?.slice(0, 3) || [],
          olKey: d.key,
          rating: d.ratings_average ? Math.round(d.ratings_average * 10) / 10 : undefined,
        }));

      setResults(books);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al buscar libros.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (book: FoundBook) => {
    await onAddBook({
      title: book.title,
      author: book.author,
      pages: book.pages || 0,
      coverUrl: book.coverUrl || '',
      status: 'wishlist',
      genres: book.subjects || [],
      publishDate: book.publishYear?.toString() || '',
    });
    setAddedKeys(prev => new Set(prev).add(book.olKey || book.title));
  };

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Search className="w-7 h-7 text-[#00BFB3]" /> Buscar Libros
        </h2>
        <p className="text-gray-500">Describe el libro que buscas en lenguaje natural y lo encontraremos en nuestra base de datos.</p>
      </div>

      {/* Search box */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mb-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej. 'Novela de amor de autor peruano del siglo 20' o 'Ciencia ficción espacial'"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#00BFB3] focus:ring-2 focus:ring-[#00BFB3]/20 outline-none transition-all text-sm font-medium"
              onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
            />
          </div>
          <Button
            onClick={() => searchBooks()}
            disabled={loading || !query.trim()}
            className="bg-[#00BFB3] hover:bg-[#009F95] text-white py-4 px-8 h-auto rounded-xl font-bold shadow-md shadow-[#00BFB3]/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        {/* Historial de búsquedas */}
        {!loading && results.length === 0 && recentSearches.length > 0 && (
          <div className="flex flex-col gap-2 mt-1 animate-in fade-in">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Búsquedas recientes
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, i) => (
                <button key={i} onClick={() => searchBooks(s)} className="text-sm px-3 py-1.5 bg-gray-50 hover:bg-[#00BFB3]/10 hover:text-[#00BFB3] hover:border-[#00BFB3]/30 text-gray-600 rounded-lg border border-gray-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl font-medium text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
          <div className="w-12 h-12 border-4 border-[#00BFB3]/20 border-t-[#00BFB3] rounded-full animate-spin" />
          <p className="font-medium">Buscando en millones de libros...</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-gray-400 font-medium mb-5">{results.length} resultados para <span className="text-gray-700 font-semibold">"{query}"</span></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((book, i) => {
              const isAdded = addedKeys.has(book.olKey || book.title);
              return (
                <Card key={i} className="border-none shadow-sm hover:shadow-lg transition-all group bg-white rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-300">
                        <BookOpen className="w-16 h-16" />
                        <span className="text-xs font-medium">Sin portada</span>
                      </div>
                    )}
                    {/* Overlay con botón añadir */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Button
                        onClick={() => handleAdd(book)}
                        disabled={isAdded}
                        className={`w-full font-bold transition-all ${isAdded ? 'bg-green-500 text-white cursor-default' : 'bg-white text-gray-900 hover:bg-[#00BFB3] hover:text-white'}`}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {isAdded ? '¡Añadido a deseos!' : 'Añadir a deseos'}
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-1 leading-tight line-clamp-2">{book.title}</h3>
                    <p className="text-sm font-medium text-[#00BFB3] mb-3">{book.author}</p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-50">
                      {book.publishYear && (
                        <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-none text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {book.publishYear}
                        </Badge>
                      )}
                      {book.pages ? (
                        <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-none text-xs">
                          {book.pages} pág.
                        </Badge>
                      ) : null}
                      {book.rating && (
                        <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none text-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {book.rating}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Historial debajo de resultados */}
          {recentSearches.length > 0 && (
            <div className="flex flex-col gap-2 mt-10 animate-in fade-in">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Búsquedas recientes
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s, i) => (
                  <button key={i} onClick={() => searchBooks(s)} className="text-sm px-3 py-1.5 bg-gray-50 hover:bg-[#00BFB3]/10 hover:text-[#00BFB3] text-gray-600 rounded-lg border border-gray-100 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 py-16">
          <BookOpen className="w-20 h-20 text-gray-100" />
          <div className="text-center">
            <p className="font-semibold text-gray-500 mb-1">Describe el libro que buscas</p>
            <p className="text-sm text-gray-400">Puedes usar lenguaje natural, como:<br/><em>"Novela de terror de autor mexicano"</em></p>
          </div>
        </div>
      )}
    </div>
  );
}
