
import { Agent, PnlData } from '../types';

type IntervalId = ReturnType<typeof setInterval>;
const activeSimulations = new Map<string, IntervalId>();

export const startTrading = (
    agent: Agent, 
    onUpdate: (pnl: number, pnlHistory: PnlData[]) => void
) => {
    if (activeSimulations.has(agent.id) || !agent.strategy) {
        return;
    }

    const riskFactor = {
        Low: 0.5,
        Medium: 1,
        High: 2
    }[agent.strategy.riskLevel];

    let currentPnl = agent.pnl;
    let newHistory: PnlData[] = [];

    const intervalId = setInterval(() => {
        // Simulate a more volatile random walk for "micro-trades" with a slight positive drift
        const change = (Math.random() - 0.48) * agent.balance * 0.0005 * riskFactor;
        currentPnl += change;
        
        const newPoint = { time: Date.now(), value: parseFloat(currentPnl.toFixed(2)) };
        newHistory = [newPoint];

        onUpdate(parseFloat(currentPnl.toFixed(2)), newHistory);
    }, 500); // Update every 500ms for a faster feel

    activeSimulations.set(agent.id, intervalId);
};

export const stopTrading = (agentId: string) => {
    if (activeSimulations.has(agentId)) {
        clearInterval(activeSimulations.get(agentId)!);
        activeSimulations.delete(agentId);
    }
};