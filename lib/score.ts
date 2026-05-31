export type EnergyLevel = 'high' | 'normal' | 'low';
export type DistractionLevel = 'minimal' | 'some' | 'alot';

export interface ScoreData {
  dsa_done: boolean;
  redlix_done: boolean;
  class_done: boolean;
  college_done: boolean;
  sleep_hours: number | "";
  energy: EnergyLevel | "";
  distraction: DistractionLevel | "";
}

export function calcScore(data: ScoreData): number {
  const toggles = [data.dsa_done, data.redlix_done, data.class_done, data.college_done];
  const togglesDone = toggles.filter(Boolean).length;
  const togglePoints = togglesDone * 15;

  let sleepPoints = 0;
  if (typeof data.sleep_hours === 'number') {
    if (data.sleep_hours >= 7) sleepPoints = 20;
    else if (data.sleep_hours >= 6) sleepPoints = 12;
    else if (data.sleep_hours >= 5) sleepPoints = 6;
  }

  let energyPoints = 0;
  if (data.energy === 'high') energyPoints = 15;
  else if (data.energy === 'normal') energyPoints = 10;
  else if (data.energy === 'low') energyPoints = 5;

  let distractionPoints = 0;
  if (data.distraction === 'minimal') distractionPoints = 15;
  else if (data.distraction === 'some') distractionPoints = 10;
  else if (data.distraction === 'alot') distractionPoints = 5;

  let score = togglePoints + sleepPoints + energyPoints + distractionPoints;
  if (score > 100) score = 100;
  
  return score;
}
