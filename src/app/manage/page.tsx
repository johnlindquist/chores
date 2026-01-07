"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface KidChores {
  name: string;
  chores: string[];
}

interface DayPreview {
  date: string;
  dateIso: string;
  kids: KidChores[];
}

interface ScheduleData {
  schedule_text: string;
  timezone: string;
  plugin_setting_id: number | null;
  preview: DayPreview[];
}

function ManageContent() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleText, setScheduleText] = useState("");
  const [preview, setPreview] = useState<DayPreview[]>([]);
  const [pluginSettingId, setPluginSettingId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeRequired, setPasscodeRequired] = useState(false);
  const [passcodeVerified, setPasscodeVerified] = useState(false);

  const loadSchedule = useCallback(async () => {
    if (!uuid) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/schedule?uuid=${uuid}`);
      if (!response.ok) {
        throw new Error("Failed to load schedule");
      }
      const data: ScheduleData = await response.json();
      setScheduleText(data.schedule_text);
      setPreview(data.preview);
      setPluginSettingId(data.plugin_setting_id);
    } catch {
      setError("Failed to load schedule. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    // Check if passcode is required
    const storedPasscode = localStorage.getItem("chores_passcode");
    if (storedPasscode) {
      setPasscode(storedPasscode);
      setPasscodeVerified(true);
    }
    loadSchedule();
  }, [loadSchedule]);

  const handleSave = async () => {
    if (!uuid) return;

    // Check if passcode is needed
    if (passcodeRequired && !passcodeVerified) {
      setError("Please enter the passcode first");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid,
          schedule_text: scheduleText,
          passcode: passcode || undefined,
        }),
      });

      if (response.status === 401) {
        setPasscodeRequired(true);
        setPasscodeVerified(false);
        setError("Passcode required");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const data = await response.json();
      setPreview(data.preview);

      // Store verified passcode
      if (passcode) {
        localStorage.setItem("chores_passcode", passcode);
        setPasscodeVerified(true);
      }

      alert("Schedule saved!");
    } catch {
      setError("Failed to save schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBackToTrmnl = () => {
    if (pluginSettingId) {
      window.location.href = `https://usetrmnl.com/plugin_settings/${pluginSettingId}/edit?force_refresh=true`;
    } else {
      window.location.href = "https://usetrmnl.com";
    }
  };

  if (!uuid) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold text-red-600">Missing UUID</h1>
          <p className="mt-2 text-gray-600">
            This page requires a UUID parameter. Please access it through TRMNL.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4">
          <h1 className="text-2xl font-bold text-gray-900">Chore Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit your family's chore schedule
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Passcode Input (if required) */}
        {passcodeRequired && !passcodeVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-yellow-800 mb-2">
              Enter Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Passcode"
            />
          </div>
        )}

        {/* Schedule Editor */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule (DSL Format)
          </label>
          <textarea
            value={scheduleText}
            onChange={(e) => setScheduleText(e.target.value)}
            className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="@kids Ava, Ben, Chloe, Dylan..."
          />
          <p className="mt-2 text-xs text-gray-500">
            Use @kids to define kids, @mon-@sun for weekly, @YYYY-MM-DD for overrides.
            Format: Kid Name: chore 1; chore 2
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {saving ? "Saving..." : "Save Schedule"}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            {showPreview ? "Hide" : "Preview"}
          </button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Next 7 Days Preview
            </h2>
            <div className="space-y-4">
              {preview.map((day) => (
                <div
                  key={day.dateIso}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{day.date}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {day.kids.map((kid) => (
                      <div key={kid.name} className="bg-gray-50 p-2 rounded">
                        <p className="font-medium text-sm text-gray-800">
                          {kid.name}
                        </p>
                        <ul className="text-xs text-gray-600 mt-1">
                          {kid.chores.length > 0 ? (
                            kid.chores.map((chore, i) => (
                              <li key={i}>• {chore}</li>
                            ))
                          ) : (
                            <li className="italic">No chores</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to TRMNL Button */}
        <button
          onClick={handleBackToTrmnl}
          className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
        >
          Back to TRMNL (Force Refresh)
        </button>

        {/* Help */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <h3 className="font-medium text-gray-800 mb-2">Schedule Format Help</h3>
          <ul className="space-y-1">
            <li>
              <code className="bg-gray-200 px-1 rounded">@kids</code> - Define kid names (comma separated)
            </li>
            <li>
              <code className="bg-gray-200 px-1 rounded">@mon</code> to{" "}
              <code className="bg-gray-200 px-1 rounded">@sun</code> - Weekly schedule sections
            </li>
            <li>
              <code className="bg-gray-200 px-1 rounded">@YYYY-MM-DD</code> - Date override (takes priority)
            </li>
            <li>
              <code className="bg-gray-200 px-1 rounded">Kid: chore; chore</code> - Assign chores
            </li>
            <li>
              <code className="bg-gray-200 px-1 rounded">*: chore</code> - Global chore for everyone
            </li>
            <li>
              <code className="bg-gray-200 px-1 rounded">#</code> - Comment line
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <ManageContent />
    </Suspense>
  );
}
