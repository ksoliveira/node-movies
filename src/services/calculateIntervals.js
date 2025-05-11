export function calculateIntervals(winnersByProducer) {
    const intervals = [];

    for (const producer in winnersByProducer) {
      winnersByProducer[producer].sort((a, b) => a - b);
    }
  
    for (const [producer, years] of Object.entries(winnersByProducer)) {
      if (years.length < 2) continue;
  
      for (let i = 1; i < years.length; i++) {
        const previousWin = years[i - 1];
        const followingWin = years[i];
        const interval = followingWin - previousWin;
  
        intervals.push({
          producer,
          interval,
          previousWin,
          followingWin,
        });
      }
    }
  
    if (intervals.length === 0) return { min: [], max: [] };
  
    const minInterval = Math.min(...intervals.map(i => i.interval));
    const maxInterval = Math.max(...intervals.map(i => i.interval));
  
    return {
      min: intervals.filter(i => i.interval === minInterval),
      max: intervals.filter(i => i.interval === maxInterval),
    };
  }