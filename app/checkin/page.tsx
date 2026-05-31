"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { calcScore, EnergyLevel, DistractionLevel } from "@/lib/score";
import { Check, Save, Loader2 } from "lucide-react";

export default function CheckinPage() {
  const [dsaDone, setDsaDone] = useState(false);
  const [redlixDone, setRedlixDone] = useState(false);
  const [classDone, setClassDone] = useState(false);
  const [collegeDone, setCollegeDone] = useState(false);
  const [sleepHours, setSleepHours] = useState<number | "">("");
  const [energy, setEnergy] = useState<EnergyLevel | "">("");
  const [distraction, setDistraction] = useState<DistractionLevel | "">("");
  const [brainDump, setBrainDump] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const score = calcScore({
    dsa_done: dsaDone,
    redlix_done: redlixDone,
    class_done: classDone,
    college_done: collegeDone,
    sleep_hours: sleepHours,
    energy,
    distraction,
  });

  const handleSave = async () => {
    setIsSaving(true);
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const { error } = await supabase.from("daily_logs").upsert({
      date,
      dsa_done: dsaDone,
      redlix_done: redlixDone,
      class_done: classDone,
      college_done: collegeDone,
      sleep_hours: sleepHours === "" ? null : sleepHours,
      energy: energy === "" ? null : energy,
      distraction: distraction === "" ? null : distraction,
      brain_dump: brainDump,
      focus_score: score,
    }, { onConflict: "date" });

    setIsSaving(false);
    if (error) {
      setToast({ message: error.message, type: "error" });
    } else {
      setToast({ message: "Saved successfully!", type: "success" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const toggleClasses = (isActive: boolean) =>
    `flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all min-h-[100px] cursor-pointer touch-manipulation select-none ${
      isActive
        ? "border-green-500 bg-green-500/10 text-green-500"
        : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700"
    }`;

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-white mb-1">Daily Check-in</h1>
        <p className="text-sm text-gray-400">Track your execution and stay accountable.</p>
      </header>

      {/* Score Bar */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Focus Score</span>
          <span className="text-xl font-bold text-[#6c63ff]">{score}/100</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-[#6c63ff] h-full transition-all duration-500 ease-out"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <button className={toggleClasses(dsaDone)} onClick={() => setDsaDone(!dsaDone)}>
          <div className="mb-2">{dsaDone ? <Check size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-50" />}</div>
          <span className="text-sm font-medium">DSA Done</span>
        </button>
        <button className={toggleClasses(redlixDone)} onClick={() => setRedlixDone(!redlixDone)}>
          <div className="mb-2">{redlixDone ? <Check size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-50" />}</div>
          <span className="text-sm font-medium">Redlix Work</span>
        </button>
        <button className={toggleClasses(classDone)} onClick={() => setClassDone(!classDone)}>
          <div className="mb-2">{classDone ? <Check size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-50" />}</div>
          <span className="text-sm font-medium">Class / Teach</span>
        </button>
        <button className={toggleClasses(collegeDone)} onClick={() => setCollegeDone(!collegeDone)}>
          <div className="mb-2">{collegeDone ? <Check size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-50" />}</div>
          <span className="text-sm font-medium">College Done</span>
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Sleep (hours)</label>
          <input
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 7"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] outline-none transition-all min-h-[48px]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Energy Level</label>
          <select
            value={energy}
            onChange={(e) => setEnergy(e.target.value as EnergyLevel | "")}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] outline-none transition-all min-h-[48px] appearance-none"
          >
            <option value="" disabled>Select Energy</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Distraction Level</label>
          <select
            value={distraction}
            onChange={(e) => setDistraction(e.target.value as DistractionLevel | "")}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] outline-none transition-all min-h-[48px] appearance-none"
          >
            <option value="" disabled>Select Distraction</option>
            <option value="minimal">Minimal</option>
            <option value="some">Some</option>
            <option value="alot">A lot</option>
          </select>
        </div>
      </div>

      {/* Brain Dump */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">Brain Dump</label>
        <textarea
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="Dump worries, blockers, tomorrow&apos;s plan..."
          className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] outline-none transition-all min-h-[120px] resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-[#6c63ff] hover:bg-[#5b54d6] text-white font-medium rounded-xl p-4 flex items-center justify-center gap-2 transition-colors min-h-[56px] disabled:opacity-70 mt-2 touch-manipulation shadow-lg"
      >
        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        {isSaving ? "Saving..." : "Save Today&apos;s Log"}
      </button>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4 ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
