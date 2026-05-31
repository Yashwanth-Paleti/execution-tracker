"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Loader2 } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

interface Problem {
  id: string;
  topic: string;
  difficulty: Difficulty;
  date: string;
}

export default function DSAPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchProblems = async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("dsa_problems")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: false });
    
    if (data) setProblems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !difficulty) return;
    setIsAdding(true);
    const today = new Date().toISOString().split("T")[0];
    
    const { data } = await supabase
      .from("dsa_problems")
      .insert([{ topic: topic.trim(), difficulty, date: today }])
      .select()
      .single();
      
    if (data) {
      setProblems([data, ...problems]);
      setTopic("");
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("dsa_problems").delete().eq("id", id);
    setProblems(problems.filter(p => p.id !== id));
  };

  const diffColors = {
    easy: "bg-green-500/20 text-green-500 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-500 border-red-500/30",
  };

  return (
    <div className="p-6 flex flex-col gap-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-white mb-1">DSA Tracker</h1>
        <p className="text-sm text-gray-400">Log the problems you conquered today.</p>
      </header>

      <form onSubmit={handleAdd} className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Problem / Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Reverse Linked List"
            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] outline-none transition-all min-h-[48px]"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "")}
              className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff] outline-none transition-all min-h-[48px] appearance-none"
            >
              <option value="" disabled>Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isAdding || !topic.trim() || !difficulty}
              className="bg-[#6c63ff] hover:bg-[#5b54d6] text-white font-medium rounded-lg px-6 h-[48px] flex items-center justify-center gap-2 transition-colors disabled:opacity-70 min-w-[100px] shadow-md touch-manipulation"
            >
              {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              Add
            </button>
          </div>
        </div>
      </form>

      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Today&apos;s Solved</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-[#6c63ff]" size={32} />
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-10 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
            <p className="text-gray-500">No problems solved today yet. Let&apos;s get to work!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {problems.map((problem) => (
              <div key={problem.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between gap-4 shadow-sm group">
                <div className="flex flex-col gap-1.5 flex-1 overflow-hidden">
                  <span className="font-medium text-white truncate">{problem.topic}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${diffColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <button
                    onClick={() => handleDelete(problem.id)}
                    className="text-gray-500 hover:text-red-500 p-2 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 touch-manipulation"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
