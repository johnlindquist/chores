"use client";

import { useEffect, useState, useCallback } from "react";

export default function BenPage() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadQuote = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ben-quote");
      if (response.ok) {
        const data = await response.json();
        setQuote(data.quote || "");
      }
    } catch (error) {
      console.error("Failed to load quote:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      const response = await fetch("/api/ben-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save quote:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Ben's Corner</h1>
          <p className="text-gray-500 mt-2">Update the quote shown on TRMNL</p>
        </div>

        {/* Current Quote Preview */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="text-4xl mb-4">"</div>
          <blockquote className="text-2xl font-medium italic leading-relaxed min-h-[80px]">
            {quote || "No quote set yet..."}
          </blockquote>
          <div className="mt-4 text-purple-200 text-sm">— Ben</div>
        </div>

        {/* Quote Editor */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edit Quote
          </label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="What's Ben saying today?"
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Quote"}
          </button>
          {saved && (
            <p className="text-center text-green-600 mt-2 text-sm">
              Quote updated! TRMNL will show it on next refresh.
            </p>
          )}
        </div>

        {/* Back to TRMNL */}
        <a
          href="https://usetrmnl.com"
          className="block w-full bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 transition-colors text-center"
        >
          Back to TRMNL
        </a>
      </div>
    </div>
  );
}
