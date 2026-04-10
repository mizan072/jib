// --- PRO VIDEO ENGINE: SOCIAL MEDIA OPTIMIZED ---
window.VideoGeneratorTool = function(props) {
    const { useState, useEffect, useRef } = React;

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();

        // --- Configuration & State ---
        let bgImage = null;
        let animationStartTime = 0;
        let animationFrameId = null;
        let isRecording = false;
        let recordedChunks = [];
        let mediaRecorder = null;
        let particles = [];
        const RENDER_DURATION = 7000; 

        // Canvas Settings (1080x1350 is the Pro standard for FB/IG Feed)
        const renderCanvas = document.getElementById('renderCanvas');
        const ctx = renderCanvas.getContext('2d');
        const W = 1080;
        const H = 1350; 
        renderCanvas.width = W;
        renderCanvas.height = H;

        const inputs = {
            sportType: document.getElementById('sportType'),
            themeColor: document.getElementById('themeColor'),
            cardType: document.getElementById('cardType'),
            imageUpload: document.getElementById('imageUpload'),
            teamA: document.getElementById('teamA'),
            teamB: document.getElementById('teamB'),
            scoreA: document.getElementById('scoreA'),
            scoreB: document.getElementById('scoreB'),
            matchStatus: document.getElementById('matchStatus'),
            matchDate: document.getElementById('matchDate'),
            matchVenue: document.getElementById('matchVenue'),
            newsTag: document.getElementById('newsTag'),
            newsHeadline: document.getElementById('newsHeadline'),
            newsDetails: document.getElementById('newsDetails'),
            brandText: document.getElementById('brandText'),
            // Shared Player/Stats
            playerName: document.getElementById('playerName'),
            playerStats: document.getElementById('playerStats'),
            quoteText: document.getElementById('quoteText'),
            quoteSpeaker: document.getElementById('quoteSpeaker')
        };

        const isBengali = (text) => /[\u0980-\u09FF]/.test(text);

        // --- Ken Burns Background Logic ---
        function drawBackground(elapsed) {
            if (!bgImage) {
                ctx.fillStyle = '#020617';
                ctx.fillRect(0, 0, W, H);
                return;
            }
            
            ctx.save();
            // Slow cinematic zoom
            const scale = 1.1 + (elapsed * 0.00002);
            const xShift = (elapsed * 0.01);
            
            const imgRatio = bgImage.width / bgImage.height;
            const canvasRatio = W / H;
            let drawW, drawH;

            if (imgRatio > canvasRatio) {
                drawH = H * scale;
                drawW = (bgImage.width * (H / bgImage.height)) * scale;
            } else {
                drawW = W * scale;
                drawH = (bgImage.height * (W / bgImage.width)) * scale;
            }

            ctx.translate(W/2, H/2);
            ctx.drawImage(bgImage, -drawW/2 - xShift, -drawH/2, drawW, drawH);
            ctx.restore();

            // Professional Grading
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, 'rgba(2, 6, 23, 0.4)');
            grad.addColorStop(0.5, 'transparent');
            grad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);
        }

        // --- Particle System ---
        function drawParticles(elapsed) {
            if (particles.length === 0) {
                for(let i=0; i<50; i++) {
                    particles.push({ x: Math.random()*W, y: Math.random()*H, s: Math.random()*3+1, o: Math.random()*0.5 });
                }
            }
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            particles.forEach(p => {
                p.y -= 0.5; if(p.y < 0) p.y = H;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
            });
        }

        // --- Optimized Text Rendering ---
        function drawProText(text, x, y, size, weight, color, align, isHeading = false) {
            let fontName = isHeading ? '"Anek Bangla"' : '"Hind Siliguri"';
            if (!isBengali(text)) fontName = isHeading ? 'Oswald' : 'Inter';
            
            ctx.font = `${weight} ${size}px ${fontName}, sans-serif`;
            ctx.textAlign = align;
            ctx.fillStyle = color;
            
            // Pro Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetY = 5;
            
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
        }

        // --- Main Templates ---
        function renderScene(elapsed) {
            const type = inputs.cardType.value;
            const theme = inputs.themeColor.value;
            const t = Math.min(elapsed / 1000, 1); // Animation progress 0 to 1

            drawBackground(elapsed);
            drawParticles(elapsed);

            // Top Branding
            if (inputs.brandText.value) {
                ctx.globalAlpha = Math.min(elapsed / 500, 0.8);
                drawProText(inputs.brandText.value, W-50, 80, 28, "700", "#fff", "right");
                ctx.globalAlpha = 1;
            }

            if (type === 'result') {
                // Intro Slide from bottom
                const yOff = 100 * (1 - easeOutExpo(t));
                ctx.save();
                ctx.translate(0, yOff);
                
                // Match Status Badge
                ctx.fillStyle = theme;
                const status = inputs.matchStatus.value;
                ctx.font = "bold 30px 'Hind Siliguri'";
                const sw = ctx.measureText(status).width + 60;
                ctx.beginPath(); ctx.roundRect(W/2 - sw/2, 300, sw, 60, 30); ctx.fill();
                drawProText(status, W/2, 340, 30, "800", "#000", "center");

                // Teams
                drawProText(inputs.teamA.value, W/2 - 100, 500, 80, "900", "#fff", "right", true);
                drawProText(inputs.teamB.value, W/2 + 100, 500, 80, "900", "#fff", "left", true);
                drawProText("VS", W/2, 490, 40, "900", theme, "center");

                // Scores with Glow
                ctx.shadowColor = theme; ctx.shadowBlur = 30;
                drawProText(inputs.scoreA.value, W/2 - 120, 720, 220, "900", "#fff", "right", true);
                drawProText(inputs.scoreB.value, W/2 + 120, 720, 220, "900", "#fff", "left", true);
                ctx.shadowBlur = 0;

                ctx.restore();
            } 
            
            else if (type === 'transfer' || type === 'transfer') {
                const tag = inputs.newsTag.value;
                const head = inputs.newsHeadline.value;
                const details = inputs.newsDetails.value;

                ctx.save();
                ctx.translate(0, 100 * (1-easeOutExpo(t)));
                
                // Breaking Tag
                ctx.fillStyle = theme;
                ctx.fillRect(0, H*0.5, W*0.7*t, 80);
                drawProText(tag, 50, H*0.5+55, 40, "900", "#000", "left", true);

                // Headline
                drawProText(head, 50, H*0.5+200, 130, "900", "#fff", "left", true);
                
                // Details
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.fillRect(50, H*0.5+250, W-100, 4);
                drawProText(details, 50, H*0.5+320, 45, "600", "#cbd5e1", "left");
                
                ctx.restore();
            }
            
            else if (type === 'quote') {
                const quote = inputs.quoteText.value;
                const speaker = inputs.quoteSpeaker.value;
                
                ctx.save();
                ctx.globalAlpha = t;
                ctx.fillStyle = theme;
                ctx.font = "900 300px serif";
                ctx.fillText("“", 50, 450);
                
                // Quote Text wrapping logic
                ctx.font = "600 60px 'Hind Siliguri'";
                const words = quote.split(' ');
                let line = '';
                let y = 500;
                for(let n=0; n<words.length; n++) {
                    let test = line + words[n] + ' ';
                    if(ctx.measureText(test).width > W-150) {
                        drawProText(line, W/2, y, 60, "700", "#fff", "center");
                        line = words[n] + ' '; y += 80;
                    } else { line = test; }
                }
                drawProText(line, W/2, y, 60, "700", "#fff", "center");
                
                // Speaker
                drawProText("— " + speaker, W/2, y + 120, 40, "900", theme, "center", true);
                ctx.restore();
            }
        }

        function easeOutExpo(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }

        function startRecording() {
            if (isRecording) return;
            isRecording = true;
            recordedChunks = [];
            
            const stream = renderCanvas.captureStream(60); // 60 FPS for smoothness
            mediaRecorder = new MediaRecorder(stream, { 
                mimeType: 'video/webm;codecs=vp9', // Higher quality codec
                videoBitsPerSecond: 8000000 // 8Mbps for crystal clear output
            });

            mediaRecorder.ondataavailable = (e) => { if(e.data.size > 0) recordedChunks.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                window.ysFixWebmDuration(blob, RENDER_DURATION, (fixedBlob) => {
                    const url = URL.createObjectURL(fixedBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `ProVideo_${Date.now()}.webm`;
                    link.click();
                    isRecording = false;
                    restartAnimation();
                });
            };

            mediaRecorder.start();
            const start = Date.now();
            function loop() {
                const now = Date.now() - start;
                renderScene(now);
                if (now < RENDER_DURATION) requestAnimationFrame(loop);
                else mediaRecorder.stop();
            }
            loop();
        }

        function restartAnimation() {
            if (isRecording) return;
            animationStartTime = Date.now();
            function frame() {
                renderScene(Date.now() - animationStartTime);
                animationFrameId = requestAnimationFrame(frame);
            }
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            frame();
        }

        // Init Default Image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1080&auto=format&fit=crop";
        img.onload = () => { bgImage = img; restartAnimation(); };

        // Attach Render Button
        document.getElementById('btnRenderVideo').onclick = async () => {
            const VIDEO_COST = 15;
            if (props.points < VIDEO_COST) return alert("Low balance!");
            const ok = await props.onGenerateVideo(VIDEO_COST);
            if (ok) startRecording();
        };

    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-white font-sans">
            <header className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={props.onBack} className="bg-white/5 p-2 rounded-lg hover:bg-white/10"><i data-lucide="arrow-left"></i></button>
                    <h1 className="text-xl font-black tracking-tighter">VIDEO <span className="text-indigo-500">STUDIO PRO</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                        <span className="text-indigo-400 font-bold">{props.points} Pts</span>
                    </div>
                    <button id="btnRenderVideo" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-500/20">Export High-Res</button>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-8xl mx-auto w-full">
                {/* Control Panel */}
                <div className="space-y-6 overflow-y-auto max-h-[80vh] pr-4 custom-scroll">
                    <section className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6">Visual Settings</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <select id="cardType" className="bg-slate-900 border border-white/10 p-3 rounded-xl">
                                <option value="result">🏆 Match Result</option>
                                <option value="transfer">🚨 Breaking News</option>
                                <option value="quote">💬 Viral Quote</option>
                            </select>
                            <input type="color" id="themeColor" defaultValue="#6366f1" className="w-full h-12 bg-transparent cursor-pointer" />
                        </div>
                        <input type="file" id="imageUpload" className="w-full text-sm text-slate-400 file:bg-indigo-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer" />
                    </section>

                    <section className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-2">Content Data</h2>
                        <input type="text" id="teamA" placeholder="Team A Name" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <input type="text" id="teamB" placeholder="Team B Name" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" id="scoreA" placeholder="Score A" className="bg-slate-900 border border-white/10 p-3 rounded-xl text-center font-bold" />
                            <input type="text" id="scoreB" placeholder="Score B" className="bg-slate-900 border border-white/10 p-3 rounded-xl text-center font-bold" />
                        </div>
                        <input type="text" id="matchStatus" placeholder="e.g. FULL TIME" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <textarea id="quoteText" placeholder="Write quote/news here..." className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl h-24"></textarea>
                        <input type="text" id="quoteSpeaker" placeholder="Author/Source Name" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <input type="text" id="brandText" placeholder="Your Handle (e.g. @SportsLive)" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <input type="text" id="newsTag" placeholder="News Tag (e.g. BREAKING)" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <input type="text" id="newsHeadline" placeholder="Main Headline" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                        <input type="text" id="newsDetails" placeholder="Small Details" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" />
                    </section>
                </div>

                {/* Preview Panel */}
                <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-[450px] aspect-[4/5] bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] border-4 border-white/10">
                        <canvas id="renderCanvas" className="w-full h-full object-cover"></canvas>
                    </div>
                    <p className="text-slate-500 text-xs mt-6 font-bold uppercase tracking-widest">Live 60FPS Preview (1080x1350)</p>
                </div>
            </main>
        </div>
    );
};
