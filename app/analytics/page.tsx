"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Flame, Code2, Target, Moon, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    streak: 0,
    totalDsa: 0,
    avgScore: 0,
    avgSleep: 0,
  });
  
  // Last 7 days info for heatmap
  const [heatmap, setHeatmap] = useState<{date: string, score: number | null, label: string}[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      // 1. Total DSA
      const { count: totalDsa } = await supabase
        .from("dsa_problems")
        .select("*", { count: "exact", head: true });

      // 2. All daily logs for streak, avg score, avg sleep
      const { data: logs } = await supabase
        .from("daily_logs")
        .select("date, focus_score, sleep_hours")
        .order("date", { ascending: false });

      let streak = 0;
      let totalScore = 0;
      let totalSleep = 0;
      
      const todayStr = new Date().toISOString().split("T")[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

      if (logs && logs.length > 0) {
        // Calculate averages
        logs.forEach(log => {
          totalScore += log.focus_score || 0;
          totalSleep += log.sleep_hours || 0;
        });
        
        // Calculate streak
        let currentStreak = 0;
        
        // Check if today or yesterday is logged to start streak
        const firstLogDate = logs[0].date;
        if (firstLogDate === todayStr || firstLogDate === yesterdayStr) {
          const dateSet = new Set(logs.map(l => l.date));
          
          let checkDate = new Date(firstLogDate);
          while (true) {
            const checkStr = checkDate.toISOString().split("T")[0];
            if (dateSet.has(checkStr)) {
              currentStreak++;
              checkDate.setDate(checkDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
        streak = currentStreak;
      }

      setStats({
        streak,
        totalDsa: totalDsa || 0,
        avgScore: logs?.length ? Math.round(totalScore / logs.length) : 0,
        avgSleep: logs?.length ? Number((totalSleep / logs.length).toFixed(1)) : 0,
      });

      // 3. Last 7 days heatmap
      const last7Days = [];
      const logMap = new Map((logs || []).map(l => [l.date, l.focus_score]));
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split("T")[0];
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        last7Days.push({
          date: dStr,
          score: logMap.has(dStr) ? logMap.get(dStr)! : null,
          label: dayLabel,
        });
      }
      
      setHeatmap(last7Days);
      setIsLoading(false);
    }
    
    loadData();
  }, []);

  const getHeatmapColor = (score: number | null) => {
    if (score === null) return "bg-gray-800 border-gray-700";
    if (score >= 70) return "bg-green-500 border-green-400";
    if (score >= 40) return "bg-yellow-500 border-yellow-400";
    return "bg-red-500 border-red-400";
  };

  return (
    <div className="p-6 flex flex-col gap-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-sm text-gray-400">Measure your consistency over time.</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#6c63ff]" size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Stat Cards */}
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mb-1">
                <Flame size={20} />
              </div>
              <span className="text-3xl font-bold text-white leading-none">{stats.streak}</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Day Streak</span>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-1">
                <Code2 size={20} />
              </div>
              <span className="text-3xl font-bold text-white leading-none">{stats.totalDsa}</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total DSA</span>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] flex items-center justify-center mb-1">
                <Target size={20} />
              </div>
              <span className="text-3xl font-bold text-white leading-none">{stats.avgScore}</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Focus</span>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col gap-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mb-1">
                <Moon size={20} />
              </div>
              <span className="text-3xl font-bold text-white leading-none">{stats.avgSleep}</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Sleep (hrs)</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">7-Day Focus Heatmap</h2>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex justify-between items-end shadow-sm">
              {heatmap.map((day) => (
                <div key={day.date} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-8 h-12 rounded-md border ${getHeatmapColor(day.score)} transition-all duration-300 hover:scale-105 shadow-inner`}
                    title={day.score !== null ? `Score: ${day.score}` : 'No data'}
                  />
                  <span className="text-[10px] font-medium text-gray-500">{day.label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-5 mt-4 text-[10px] font-medium text-gray-400 justify-center">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-green-500 shadow-sm" /> &ge; 70</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-yellow-500 shadow-sm" /> &ge; 40</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-sm" /> &lt; 40</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
