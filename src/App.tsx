import React, { useState } from 'react';
import { Search, BookOpen, Layers, History, Globe, Lightbulb, Loader2, ChevronRight, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeWord } from './services/geminiService';
import { WordAnalysis } from './types';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeWord(query.trim());
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze word. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20">
      {/* Header */}
      <header className="bg-white border-bottom border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">LexiRoot</h1>
          </div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Etymology & Structure
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        {/* Search Section */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">
              Unlock the DNA of Words
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Explore roots, etymology, and cross-language connections to build a deeper, lasting vocabulary.
            </p>
          </motion.div>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter an English word (e.g., inspect, perspective...)"
              className="w-full h-14 pl-14 pr-32 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Analyze'}
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
        </section>

        <AnimatePresence mode="wait">
          {analysis ? (
            <motion.div
              key={analysis.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Main Word Card */}
              <div className="glass-card p-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <h3 className="text-5xl font-serif font-bold text-indigo-900">{analysis.word}</h3>
                  {analysis.phonetic && (
                    <span className="text-slate-400 font-mono text-lg">{analysis.phonetic}</span>
                  )}
                </div>
                <p className="text-xl text-slate-600 border-l-4 border-indigo-200 pl-4 italic">
                  "{analysis.coreMeaning}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Structure Section */}
                <div className="glass-card p-6">
                  <div className="section-title flex items-center gap-2">
                    <Layers size={14} /> Structure Breakdown
                  </div>
                  <div className="space-y-4">
                    {analysis.structure.prefix && (
                      <div className="flex items-start gap-3">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-1">PREFIX</div>
                        <div>
                          <div className="font-bold text-indigo-600 text-lg">{analysis.structure.prefix.text}</div>
                          <div className="text-sm text-slate-500">{analysis.structure.prefix.meaning}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-16 text-xs font-mono text-slate-400 pt-1">ROOT</div>
                      <div>
                        <div className="font-bold text-indigo-900 text-xl underline decoration-indigo-200 decoration-4 underline-offset-4">
                          {analysis.structure.root.text}
                        </div>
                        <div className="text-sm text-slate-600 font-medium mt-1">{analysis.structure.root.meaning}</div>
                        <div className="text-xs text-slate-400 italic mt-1">Origin: {analysis.structure.root.origin}</div>
                      </div>
                    </div>
                    {analysis.structure.suffix && (
                      <div className="flex items-start gap-3">
                        <div className="w-16 text-xs font-mono text-slate-400 pt-1">SUFFIX</div>
                        <div>
                          <div className="font-bold text-indigo-600 text-lg">{analysis.structure.suffix.text}</div>
                          <div className="text-sm text-slate-500">{analysis.structure.suffix.meaning}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="text-xs font-mono text-slate-400 uppercase mb-3">Related Words</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.relatedWords.map((w) => (
                        <span key={w} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Etymology Section */}
                <div className="glass-card p-6">
                  <div className="section-title flex items-center gap-2">
                    <History size={14} /> Etymology & Origin
                  </div>
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-bold uppercase tracking-wider mb-2">
                      {analysis.etymology.language}
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {analysis.etymology.origin}
                    </p>
                  </div>
                  {analysis.etymology.story && (
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <Lightbulb size={16} />
                        <span className="text-sm font-bold">The Story</span>
                      </div>
                      <p className="text-sm text-amber-900/80 italic leading-relaxed">
                        {analysis.etymology.story}
                      </p>
                    </div>
                  )}
                </div>

                {/* Context Section */}
                <div className="glass-card p-6 md:col-span-2">
                  <div className="section-title flex items-center gap-2">
                    <Globe size={14} /> Usage & Context
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                      <div className="text-xs font-mono text-slate-400 uppercase mb-3">Collocations</div>
                      <ul className="space-y-2">
                        {analysis.context.collocations.map((c) => (
                          <li key={c} className="flex items-center gap-2 text-slate-700 text-sm">
                            <ChevronRight size={14} className="text-indigo-400" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <div className="text-xs font-mono text-slate-400 uppercase mb-3">Example Sentence</div>
                        <p className="text-lg text-slate-800 font-medium leading-snug">
                          {analysis.context.exampleSentence}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-mono text-slate-400 uppercase mb-3">Mini Context</div>
                        <p className="text-slate-600 leading-relaxed italic">
                          {analysis.context.miniParagraph}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* French Connection Section */}
                <div className="glass-card p-6 md:col-span-2 bg-gradient-to-br from-indigo-50/30 to-white">
                  <div className="section-title flex items-center gap-2">
                    <Languages size={14} /> The French Connection
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                        <div className="text-3xl font-bold text-indigo-900">{analysis.word}</div>
                        <div className="w-8 h-[2px] bg-slate-300"></div>
                        <div className="text-3xl font-bold text-rose-600">{analysis.frenchConnection.frenchWord}</div>
                      </div>
                      <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        {analysis.frenchConnection.type}
                      </div>
                      <p className="text-slate-600 max-w-xl">
                        {analysis.frenchConnection.similarityNote}
                      </p>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="text-xs font-mono text-slate-400 uppercase mb-2">French Example</div>
                        <p className="text-slate-800 font-serif italic text-lg">
                          "{analysis.frenchConnection.frenchExample}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 text-indigo-200 mb-6">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-medium text-slate-400">Search for a word to begin your journey</h3>
              <p className="text-slate-400 mt-2">Try "inspect", "benevolent", or "philosophy"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          LexiRoot — Your personal etymology companion.
        </p>
      </footer>
    </div>
  );
}
