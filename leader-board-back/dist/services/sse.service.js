import { getLeaderboard } from './team.service.js';
// Store connected SSE clients
const clients = new Set();
export function addClient(res) {
    clients.add(res);
    console.log(`[SSE] Client connected. Total clients: ${clients.size}`);
}
export function removeClient(res) {
    clients.delete(res);
    console.log(`[SSE] Client disconnected. Total clients: ${clients.size}`);
}
export function getClientCount() {
    return clients.size;
}
export async function broadcastLeaderboard() {
    if (clients.size === 0) {
        console.log('[SSE] No clients connected, skipping broadcast');
        return;
    }
    try {
        const leaderboard = await getLeaderboard();
        const data = JSON.stringify(leaderboard);
        console.log(`[SSE] Broadcasting to ${clients.size} clients`);
        clients.forEach((client) => {
            client.write(`data: ${data}\n\n`);
        });
        console.log('[SSE] Broadcast complete');
    }
    catch (error) {
        console.error('[SSE] Error broadcasting:', error);
    }
}
//# sourceMappingURL=sse.service.js.map