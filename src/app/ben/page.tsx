"use client";

import { Suspense, useEffect, useState, useCallback } from "react";

interface Quote {
  id: number;
  quote: string;
  added_by: string | null;
  created_at: string;
}

function BenQuotesContent() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredQuote, setFeaturedQuote] = useState<Quote | null>(null);

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const [quotesRes, randomRes] = await Promise.all([
        fetch("/api/quotes"),
        fetch("/api/quotes?random=true"),
      ]);

      if (quotesRes.ok) {
        const data = await quotesRes.json();
        setQuotes(data);
      }

      if (randomRes.ok) {
        const data = await randomRes.json();
        setFeaturedQuote(data);
      }
    } catch (error) {
      console.error("Failed to load quotes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotes();
  }, [loadQuotes]);

  const handleAddQuote = async () => {
    if (!newQuote.trim()) return;

    try {
      setSaving(true);
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: newQuote.trim(),
          added_by: addedBy.trim() || undefined,
        }),
      });

      if (response.ok) {
        setNewQuote("");
        setAddedBy("");
        loadQuotes();
      }
    } catch (error) {
      console.error("Failed to add quote:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm("Delete this quote?")) return;

    try {
      const response = await fetch(`/api/quotes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadQuotes();
      }
    } catch (error) {
      console.error("Failed to delete quote:", error);
    }
  };

  const getRandomQuote = async () => {
    try {
      const response = await fetch("/api/quotes?random=true");
      if (response.ok) {
        const data = await response.json();
        setFeaturedQuote(data);
      }
    } catch (error) {
      console.error("Failed to get random quote:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading Ben's wisdom...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Ben's Corner</h1>
          <p className="text-gray-500 mt-2">Wisdom from afar</p>
        </div>

        {/* Featured Quote */}
        {featuredQuote && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="text-5xl mb-4">"</div>
            <blockquote className="text-2xl font-medium italic leading-relaxed">
              {featuredQuote.quote}
            </blockquote>
            <div className="mt-6 flex justify-between items-center">
              <span className="text-purple-200 text-sm">
                — Ben {featuredQuote.added_by && `(added by ${featuredQuote.added_by})`}
              </span>
              <button
                onClick={getRandomQuote}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Another quote
              </button>
            </div>
          </div>
        )}

        {/* Add New Quote */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add a Ben Quote
          </h2>
          <textarea
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="What wisdom did Ben share today?"
            className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3 mt-3">
            <input
              type="text"
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
              placeholder="Added by (optional)"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddQuote}
              disabled={saving || !newQuote.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
            >
              {saving ? "Adding..." : "Add Quote"}
            </button>
          </div>
        </div>

        {/* All Quotes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Quotes ({quotes.length})
          </h2>
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl group"
              >
                <div className="flex-1">
                  <p className="text-gray-900">"{quote.quote}"</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {quote.added_by && `Added by ${quote.added_by} • `}
                    {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQuote(quote.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm transition-opacity"
                >
                  Delete
                </button>
              </div>
            ))}
            {quotes.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No quotes yet. Add Ben's first piece of wisdom!
              </p>
            )}
          </div>
        </div>

        {/* Back to Chores */}
        <a
          href="/manage?uuid=f8bbba48-d902-4a35-95f6-044985d1b5fa"
          className="block w-full bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 transition-colors text-center"
        >
          Back to Chore Schedule
        </a>
      </div>
    </div>
  );
}

export default function BenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <BenQuotesContent />
    </Suspense>
  );
}
