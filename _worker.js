// _worker.js
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // Serve static files
        if (url.pathname === '/') {
            const html = await fetch('index.html').then(res => res.text());
            
            // Replace environment variables
            const modifiedHtml = html
                .replace('{{BOT_TOKEN}}', env.BOT_TOKEN || '')
                .replace('{{CHAT_ID}}', env.CHAT_ID || '');
            
            return new Response(modifiedHtml, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        // Serve other static files
        return fetch(request);
    }
}
