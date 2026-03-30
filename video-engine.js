// --- VIDEO ENGINE: ISOLATED GLOBAL COMPONENT ---
window.VideoGeneratorTool = function(props) {
    const { useState, useEffect, useRef } = React;

    useEffect(() => {
        // Initialize Icons
        if (window.lucide) window.lucide.createIcons();

        // --- Isolated State ---
        let bgImage = null;
        let animationStartTime = 0;
        let animationFrameId = null;
        let isRecording = false;
        let recordedChunks = [];
        let mediaRecorder = null;
        let particles = [];
        const RENDER_DURATION = 7000; 

        // --- DOM Elements ---
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
            
            h2hP1Name: document.getElementById('h2hP1Name'),
            h2hP2Name: document.getElementById('h2hP2Name'),
            h2hP1Stat: document.getElementById('h2hP1Stat'),
            h2hP2Stat: document.getElementById('h2hP2Stat'),
            h2hContext: document.getElementById('h2hContext'),
            
            mileNumber: document.getElementById('mileNumber'),
            mileName: document.getElementById('mileName'),
            mileDesc: document.getElementById('mileDesc'),

            playerName: document.getElementById('playerName'),
            playerStats: document.getElementById('playerStats'),

            tpsTourn: document.getElementById('tpsTourn'),
            tpsName: document.getElementById('tpsName'),
            tpsS1L: document.getElementById('tpsS1L'), tpsS1V: document.getElementById('tpsS1V'),
            tpsS2L: document.getElementById('tpsS2L'), tpsS2V: document.getElementById('tpsS2V'),
            tpsS3L: document.getElementById('tpsS3L'), tpsS3V: document.getElementById('tpsS3V'),
            tpsS4L: document.getElementById('tpsS4L'), tpsS4V: document.getElementById('tpsS4V'),
            tpsS5L: document.getElementById('tpsS5L'), tpsS5V: document.getElementById('tpsS5V'),
            tpsS6L: document.getElementById('tpsS6L'), tpsS6V: document.getElementById('tpsS6V'),

            careerRole: document.getElementById('careerRole'),
            cStat1L: document.getElementById('cStat1L'), cStat1V: document.getElementById('cStat1V'),
            cStat2L: document.getElementById('cStat2L'), cStat2V: document.getElementById('cStat2V'),
            cStat3L: document.getElementById('cStat3L'), cStat3V: document.getElementById('cStat3V'),
            cStat4L: document.getElementById('cStat4L'), cStat4V: document.getElementById('cStat4V'),

            tournName: document.getElementById('tournName'),
            tournCat: document.getElementById('tournCat'),
            tRank1N: document.getElementById('tRank1N'), tRank1V: document.getElementById('tRank1V'),
            tRank2N: document.getElementById('tRank2N'), tRank2V: document.getElementById('tRank2V'),
            tRank3N: document.getElementById('tRank3N'), tRank3V: document.getElementById('tRank3V'),

            quoteText: document.getElementById('quoteText'),
            quoteSpeaker: document.getElementById('quoteSpeaker'),
            
            brandText: document.getElementById('brandText'),

            lineupContext: document.getElementById('lineupContext'),
            lineupPlayers: document.getElementById('lineupPlayers'),
            
            sc1L: document.getElementById('sc1L'), sc1A: document.getElementById('sc1A'), sc1B: document.getElementById('sc1B'),
            sc2L: document.getElementById('sc2L'), sc2A: document.getElementById('sc2A'), sc2B: document.getElementById('sc2B'),
            sc3L: document.getElementById('sc3L'), sc3A: document.getElementById('sc3A'), sc3B: document.getElementById('sc3B'),
            sc4L: document.getElementById('sc4L'), sc4A: document.getElementById('sc4A'), sc4B: document.getElementById('sc4B'),
            
            rat1N: document.getElementById('rat1N'), rat1V: document.getElementById('rat1V'),
            rat2N: document.getElementById('rat2N'), rat2V: document.getElementById('rat2V'),
            rat3N: document.getElementById('rat3N'), rat3V: document.getElementById('rat3V'),
            rat4N: document.getElementById('rat4N'), rat4V: document.getElementById('rat4V'),
            
            triviaHead: document.getElementById('triviaHead'),
            triviaFact: document.getElementById('triviaFact'),
            
            countText: document.getElementById('countText')
        };

        const sections = {
            teams: document.getElementById('sectionTeams'),
            scores: document.getElementById('sectionScores'),
            fixture: document.getElementById('sectionFixture'),
            transfer: document.getElementById('sectionTransfer'),
            h2h: document.getElementById('sectionH2H'),
            milestone: document.getElementById('sectionMilestone'),
            player: document.getElementById('sectionPlayer'),
            tournPlayerStat: document.getElementById('sectionTournPlayerStat'),
            career: document.getElementById('sectionCareer'),
            tournament: document.getElementById('sectionTournament'),
            quote: document.getElementById('sectionQuote'),
            
            lineup: document.getElementById('sectionLineup'),
            statsComp: document.getElementById('sectionStatsComp'),
            ratings: document.getElementById('sectionRatings'),
            trivia: document.getElementById('sectionTrivia'),
            countdown: document.getElementById('sectionCountdown')
        };

        const renderCanvas = document.getElementById('renderCanvas');
        const canvasContainer = document.getElementById('canvasContainer');
        const ctx = renderCanvas.getContext('2d');
        const btnPlayAnim = document.getElementById('btnPlayAnim');
        const btnPreviewFullscreen = document.getElementById('btnPreviewFullscreen');
        const btnRenderVideo = document.getElementById('btnRenderVideo');
        const downloadLink = document.getElementById('downloadLink');

        const isBengali = (text) => /[\u0980-\u09FF]/.test(text);

        // --- Event Listeners ---
        inputs.imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const fileURL = URL.createObjectURL(file);
            bgImage = new Image();
            bgImage.onload = () => restartAnimation();
            bgImage.src = fileURL;
        });

        inputs.cardType.addEventListener('change', () => {
            const type = inputs.cardType.value;
            Object.values(sections).forEach(sec => sec.classList.add('hidden'));
            
            if (type === 'result') { sections.teams.classList.remove('hidden'); sections.scores.classList.remove('hidden'); }
            if (type === 'fixture') { sections.teams.classList.remove('hidden'); sections.fixture.classList.remove('hidden'); }
            if (type === 'transfer') sections.transfer.classList.remove('hidden');
            if (type === 'h2h') sections.h2h.classList.remove('hidden');
            if (type === 'milestone') sections.milestone.classList.remove('hidden');
            if (type === 'tournPlayerStat') sections.tournPlayerStat.classList.remove('hidden');
            
            if (type === 'player') { sections.player.classList.remove('hidden'); }
            if (type === 'career') { sections.player.classList.remove('hidden'); sections.career.classList.remove('hidden'); }
            
            if (type === 'tournament') sections.tournament.classList.remove('hidden');
            if (type === 'quote') sections.quote.classList.remove('hidden');

            if (type === 'lineup') { sections.teams.classList.remove('hidden'); sections.lineup.classList.remove('hidden'); }
            if (type === 'statsComp') { sections.teams.classList.remove('hidden'); sections.statsComp.classList.remove('hidden'); }
            if (type === 'ratings') { sections.teams.classList.remove('hidden'); sections.ratings.classList.remove('hidden'); }
            if (type === 'trivia') { sections.trivia.classList.remove('hidden'); }
            if (type === 'nextMatch') { sections.teams.classList.remove('hidden'); sections.fixture.classList.remove('hidden'); sections.countdown.classList.remove('hidden'); }

            restartAnimation();
        });

        inputs.sportType.addEventListener('change', () => {
            const isCricket = inputs.sportType.value === 'cricket';
            inputs.themeColor.value = isCricket ? '#0ea5e9' : '#3b82f6'; 
            
            if(isCricket) {
                inputs.teamA.value = 'INDIA'; inputs.teamB.value = 'AUSTRALIA';
                inputs.scoreA.value = '240/6'; inputs.scoreB.value = '238/9';
                inputs.matchStatus.value = 'INDIA WON BY 2 RUNS';
                inputs.matchVenue.value = 'MCG, MELBOURNE';
                inputs.newsHeadline.value = 'BUMRAH'; inputs.newsDetails.value = 'RULED OUT OF WORLD CUP DUE TO INJURY';
                inputs.h2hP1Name.value = 'KOHLI'; inputs.h2hP2Name.value = 'SMITH';
                inputs.h2hP1Stat.value = '80 CENTURIES'; inputs.h2hP2Stat.value = '44 CENTURIES';
                inputs.h2hContext.value = 'MODERN GREATS COLLIDE';
                inputs.mileNumber.value = '50'; inputs.mileName.value = 'VIRAT KOHLI'; inputs.mileDesc.value = 'ODI CENTURIES';
                inputs.playerName.value = 'VIRAT KOHLI'; inputs.playerStats.value = '85* (52) & 1/12';
                inputs.tpsTourn.value = 'ICC WORLD CUP 2023'; inputs.tpsName.value = 'VIRAT KOHLI';
                inputs.tpsS1L.value = 'INNINGS'; inputs.tpsS1V.value = '11';
                inputs.tpsS2L.value = 'RUNS'; inputs.tpsS2V.value = '765';
                inputs.tpsS3L.value = 'AVERAGE'; inputs.tpsS3V.value = '95.62';
                inputs.tpsS4L.value = 'STRIKE RATE'; inputs.tpsS4V.value = '90.31';
                inputs.tpsS5L.value = '100S / 50S'; inputs.tpsS5V.value = '3 / 6';
                inputs.tpsS6L.value = 'BEST'; inputs.tpsS6V.value = '117';
                inputs.careerRole.value = 'ODI BATTING CAREER';
                inputs.cStat1L.value = 'MATCHES'; inputs.cStat1V.value = '292';
                inputs.cStat2L.value = 'RUNS'; inputs.cStat2V.value = '13,848';
                inputs.cStat3L.value = 'AVERAGE'; inputs.cStat3V.value = '58.67';
                inputs.cStat4L.value = 'STRIKE RATE'; inputs.cStat4V.value = '93.58';
                inputs.tournName.value = "ICC MEN'S CWC 2023"; inputs.tournCat.value = 'MOST RUNS';
                inputs.tRank1N.value = '1. VIRAT KOHLI'; inputs.tRank1V.value = '765';
                inputs.tRank2N.value = '2. ROHIT SHARMA'; inputs.tRank2V.value = '597';
                inputs.tRank3N.value = '3. QUINTON DE KOCK'; inputs.tRank3V.value = '594';
                inputs.quoteSpeaker.value = 'ROHIT SHARMA';
                inputs.lineupContext.value = 'PLAYING XI';
                inputs.lineupPlayers.value = "ROHIT SHARMA (C)\nSHUBMAN GILL\nVIRAT KOHLI\nSHREYAS IYER\nKL RAHUL (WK)\nSURYAKUMAR YADAV\nRAVINDRA JADEJA\nMOHAMMED SHAMI\nKULDEEP YADAV\nJASPRIT BUMRAH\nMOHAMMED SIRAJ";
                inputs.sc1L.value = 'BOUNDARIES'; inputs.sc1A.value = '32'; inputs.sc1B.value = '18';
                inputs.sc2L.value = 'SIXES'; inputs.sc2A.value = '8'; inputs.sc2B.value = '4';
                inputs.sc3L.value = 'SPIN WICKETS'; inputs.sc3A.value = '6'; inputs.sc3B.value = '4';
                inputs.sc4L.value = 'PACE WICKETS'; inputs.sc4A.value = '4'; inputs.sc4B.value = '5';
                inputs.rat1N.value = 'VIRAT KOHLI'; inputs.rat1V.value = '9.5';
                inputs.rat2N.value = 'ROHIT SHARMA'; inputs.rat2V.value = '8.0';
                inputs.rat3N.value = 'M. SHAMI'; inputs.rat3V.value = '9.0';
                inputs.rat4N.value = 'K. RAHUL'; inputs.rat4V.value = '7.5';
                inputs.triviaHead.value = 'DID YOU KNOW?';
                inputs.triviaFact.value = 'SACHIN TENDULKAR IS THE ONLY PLAYER TO SCORE 100 INTERNATIONAL CENTURIES ACROSS ALL FORMATS.';
                inputs.countText.value = '2 DAYS TO GO';
            } else {
                inputs.teamA.value = 'REAL MADRID'; inputs.teamB.value = 'BARCELONA';
                inputs.scoreA.value = '3'; inputs.scoreB.value = '1';
                inputs.matchStatus.value = 'FULL TIME';
                inputs.matchVenue.value = 'SANTIAGO BERNABÉU';
                inputs.newsHeadline.value = 'KYLIAN MBAPPÉ'; inputs.newsDetails.value = 'SIGNS FOR REAL MADRID UNTIL 2029';
                inputs.h2hP1Name.value = 'HAALAND'; inputs.h2hP2Name.value = 'MBAPPÉ';
                inputs.h2hP1Stat.value = '25 GOALS'; inputs.h2hP2Stat.value = '24 GOALS';
                inputs.h2hContext.value = 'CHAMPIONS LEAGUE TOP SCORER';
                inputs.mileNumber.value = '100'; inputs.mileName.value = 'KEVIN DE BRUYNE'; inputs.mileDesc.value = 'PREMIER LEAGUE ASSISTS';
                inputs.playerName.value = 'LIONEL MESSI'; inputs.playerStats.value = '2 GOALS | 1 ASSIST';
                inputs.tpsTourn.value = 'FIFA WORLD CUP 2022'; inputs.tpsName.value = 'LIONEL MESSI';
                inputs.tpsS1L.value = 'MATCHES'; inputs.tpsS1V.value = '7';
                inputs.tpsS2L.value = 'GOALS'; inputs.tpsS2V.value = '7';
                inputs.tpsS3L.value = 'ASSISTS'; inputs.tpsS3V.value = '3';
                inputs.tpsS4L.value = 'SHOTS ON TARGET'; inputs.tpsS4V.value = '18';
                inputs.tpsS5L.value = 'KEY PASSES'; inputs.tpsS5V.value = '21';
                inputs.tpsS6L.value = 'MOTM AWARDS'; inputs.tpsS6V.value = '5';
                inputs.careerRole.value = 'ALL TIME CAREER';
                inputs.cStat1L.value = 'MATCHES'; inputs.cStat1V.value = '1,045';
                inputs.cStat2L.value = 'GOALS'; inputs.cStat2V.value = '821';
                inputs.cStat3L.value = 'ASSISTS'; inputs.cStat3V.value = '361';
                inputs.cStat4L.value = 'G/A RATIO'; inputs.cStat4V.value = '1.13';
                inputs.tournName.value = "UEFA CHAMPIONS LEAGUE"; inputs.tournCat.value = 'TOP SCORERS';
                inputs.tRank1N.value = '1. H. KANE'; inputs.tRank1V.value = '8';
                inputs.tRank2N.value = '2. K. MBAPPÉ'; inputs.tRank2V.value = '8';
                inputs.tRank3N.value = '3. E. HAALAND'; inputs.tRank3V.value = '6';
                inputs.quoteSpeaker.value = 'CARLO ANCELOTTI';
                inputs.lineupContext.value = 'STARTING XI';
                inputs.lineupPlayers.value = "COURTOIS (GK)\nCARVAJAL\nRÜDIGER\nALABA\nMENDY\nTCHOUAMÉNI\nVALVERDE\nKROOS\nBELLINGHAM\nVINÍCIUS JR\nRODRYGO";
                inputs.sc1L.value = 'POSSESSION'; inputs.sc1A.value = '55%'; inputs.sc1B.value = '45%';
                inputs.sc2L.value = 'SHOTS ON TARGET'; inputs.sc2A.value = '6'; inputs.sc2B.value = '4';
                inputs.sc3L.value = 'PASS ACCURACY'; inputs.sc3A.value = '89%'; inputs.sc3B.value = '84%';
                inputs.sc4L.value = 'CORNERS'; inputs.sc4A.value = '7'; inputs.sc4B.value = '3';
                inputs.rat1N.value = 'BELLINGHAM'; inputs.rat1V.value = '9.0';
                inputs.rat2N.value = 'VINÍCIUS JR'; inputs.rat2V.value = '8.5';
                inputs.rat3N.value = 'COURTOIS'; inputs.rat3V.value = '8.0';
                inputs.rat4N.value = 'RÜDIGER'; inputs.rat4V.value = '8.5';
                inputs.triviaHead.value = 'DID YOU KNOW?';
                inputs.triviaFact.value = 'REAL MADRID HAS WON THE MOST CHAMPIONS LEAGUE TITLES IN HISTORY, DOMINATING EUROPEAN FOOTBALL.';
                inputs.countText.value = 'TOMORROW';
            }
            restartAnimation();
        });

        Object.values(inputs).forEach(input => {
            if(input !== inputs.imageUpload) {
                input.addEventListener('input', () => { if(!animationFrameId && !isRecording) restartAnimation(); });
            }
        });

        btnPlayAnim.addEventListener('click', restartAnimation);
        btnPreviewFullscreen.addEventListener('click', () => {
            if (canvasContainer.requestFullscreen) canvasContainer.requestFullscreen();
            else if (canvasContainer.webkitRequestFullscreen) canvasContainer.webkitRequestFullscreen();
            restartAnimation();
        });

        document.addEventListener('fullscreenchange', () => {
            if(document.fullscreenElement) canvasContainer.classList.remove('border', 'border-slate-700', 'rounded-lg');
            else canvasContainer.classList.add('border', 'border-slate-700', 'rounded-lg');
        });

        // --- POINT SYSTEM INTEGRATION ---
        btnRenderVideo.addEventListener('click', async () => {
            if (isRecording) return;
            const VIDEO_COST = 10; // Set cost for video generation
            
            if (props.points < VIDEO_COST) {
                alert(`You need ${VIDEO_COST} Pro Points to render a video. Please buy points from the main dashboard.`);
                return;
            }
            
            btnRenderVideo.innerHTML = `<div class="loader"></div> Processing...`;
            btnRenderVideo.disabled = true;

            // Deduct points via parent app
            const success = await props.onGenerateVideo(VIDEO_COST);
            
            if (success) {
                btnRenderVideo.innerHTML = `<i data-lucide="video" class="w-5 h-5"></i> Rendering...`;
                startRecording();
            } else {
                btnRenderVideo.innerHTML = `<i data-lucide="video" class="w-5 h-5"></i> Render Pro Video`;
                btnRenderVideo.disabled = false;
            }
        });


        // --- Animation Engine ---
        function restartAnimation() {
            if (isRecording) return;
            animationStartTime = Date.now();
            particles = [];
            for(let i=0; i<40; i++) {
                particles.push({
                    x: Math.random() * 1080, y: Math.random() * 1080,
                    size: Math.random() * 4 + 1, speedY: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }

            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animate();
        }

        function animate() {
            if (isRecording) return; 
            const elapsed = Date.now() - animationStartTime;
            drawCanvas(elapsed);
            animationFrameId = requestAnimationFrame(animate);
        }

        const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
        const easeOutExpo = (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        const easeOutBack = (x) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
        const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
        
        function hexToRgba(hex, alpha) {
            let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        // --- Core Rendering ---
        function drawCanvas(elapsed) {
            const W = renderCanvas.width; const H = renderCanvas.height;
            const type = inputs.cardType.value;
            const themeColor = inputs.themeColor.value;

            ctx.save();
            if (elapsed < 200) {
                const shakeX = (Math.random() - 0.5) * 30 * (1 - elapsed/200);
                const shakeY = (Math.random() - 0.5) * 30 * (1 - elapsed/200);
                ctx.translate(shakeX, shakeY);
            }

            ctx.fillStyle = '#050b14'; ctx.fillRect(0, 0, W, H);
            ctx.globalAlpha = easeOutQuart(clamp(elapsed / 800, 0, 1));

            if (bgImage) {
                const zoomFactor = 1 + (elapsed * 0.00003); 
                const imgRatio = bgImage.width / bgImage.height;
                const canvasRatio = W / H;
                let drawW, drawH, startX, startY;

                if (imgRatio > canvasRatio) { drawH = H * zoomFactor; drawW = (bgImage.width * (H / bgImage.height)) * zoomFactor; } 
                else { drawW = W * zoomFactor; drawH = (bgImage.height * (W / bgImage.width)) * zoomFactor; }
                
                startX = (W - drawW) / 2 - (elapsed * 0.008);
                startY = (H - drawH) / 2 - (elapsed * 0.004);

                ctx.filter = 'contrast(1.25) saturate(1.15) brightness(0.65)';
                ctx.drawImage(bgImage, startX, startY, drawW, drawH);
                ctx.filter = 'none';
            }

            ctx.globalAlpha = 0.15;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            const stripeOffset = (elapsed * 0.1) % 40;
            ctx.beginPath();
            for(let i = -H; i < W + H; i += 20) {
                ctx.moveTo(i - stripeOffset, 0); ctx.lineTo(i - stripeOffset - H, H);
            }
            ctx.stroke();

            ctx.globalAlpha = 1.0;
            const overlayGrad = ctx.createRadialGradient(W/2, H/2, W * 0.2, W/2, H/2, W * 0.9);
            overlayGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
            overlayGrad.addColorStop(1, 'rgba(0,0,0,0.95)'); 
            ctx.fillStyle = overlayGrad; ctx.fillRect(0, 0, W, H);

            particles.forEach(p => {
                p.y -= p.speedY; if (p.y < 0) p.y = H;
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
            });

            if (elapsed < 300) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * (1 - elapsed/300)})`;
                ctx.fillRect(0, 0, W, H);
            }

            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
            
            switch (type) {
                case 'result': drawMatchResult(W, H, elapsed, themeColor); break;
                case 'fixture': drawFixture(W, H, elapsed, themeColor); break;
                case 'transfer': drawTransfer(W, H, elapsed, themeColor); break;
                case 'h2h': drawH2H(W, H, elapsed, themeColor); break;
                case 'milestone': drawMilestone(W, H, elapsed, themeColor); break;
                case 'player': drawPlayerCard(W, H, elapsed, themeColor); break;
                case 'tournPlayerStat': drawTournPlayerStat(W, H, elapsed, themeColor); break;
                case 'career': drawCareerCard(W, H, elapsed, themeColor); break;
                case 'tournament': drawTournamentCard(W, H, elapsed, themeColor); break;
                case 'quote': drawQuoteCard(W, H, elapsed, themeColor); break;
                case 'lineup': drawLineup(W, H, elapsed, themeColor); break;
                case 'statsComp': drawStatsComp(W, H, elapsed, themeColor); break;
                case 'ratings': drawRatings(W, H, elapsed, themeColor); break;
                case 'trivia': drawTrivia(W, H, elapsed, themeColor); break;
                case 'nextMatch': drawNextMatch(W, H, elapsed, themeColor); break;
            }

            const userBrand = inputs.brandText.value.trim();
            if (userBrand) {
                ctx.globalAlpha = 0.85;
                drawProText(userBrand, W - 40, 60, '700 28px Inter, sans-serif', '#ffffff', 'right', 'rgba(0,0,0,0.8)', 15, W / 2);
            }

            const tBrand = easeOutQuart(clamp((elapsed - 1000) / 1000, 0, 1));
            if (tBrand > 0) {
                ctx.globalAlpha = tBrand;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.font = '700 22px Inter, sans-serif';
                ctx.letterSpacing = "6px";
                ctx.fillText('BDCast', W / 2, (H - 30) - (20 * tBrand));
                ctx.letterSpacing = "0px";
            }

            ctx.restore(); 
        }

        function drawProText(text, x, y, font, color, align, shadowColor, shadowBlur = 20, maxWidth = null) {
            let activeFont = font;
            if (text && isBengali(text)) {
                activeFont = activeFont.replace('Oswald', '"Anek Bangla"').replace('Inter', '"Hind Siliguri"');
                activeFont = activeFont.replace('italic ', ''); 
            }
            ctx.font = activeFont; 
            ctx.textAlign = align;
            ctx.fillStyle = color;
            ctx.shadowColor = shadowColor || 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = shadowBlur; ctx.shadowOffsetY = shadowBlur > 0 ? 5 : 0;
            
            if (maxWidth) {
                ctx.fillText(text, x, y, maxWidth);
                ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                ctx.fillText(text, x, y, maxWidth); 
            } else {
                ctx.fillText(text, x, y);
                ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                ctx.fillText(text, x, y); 
            }
        }

        function drawSlantedBox(x, y, w, h, slant, color, alpha) {
            ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + slant, y); ctx.lineTo(x + w + slant, y);
            ctx.lineTo(x + w - slant, y + h); ctx.lineTo(x - slant, y + h);
            ctx.fill(); ctx.restore();
        }

        function drawGlassBox(x, y, w, h, radius, alpha) {
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill(); ctx.stroke();
            const grad = ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, 'rgba(255,255,255,0.05)'); grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad; ctx.fill(); ctx.restore();
        }

        // --- Video Render Templates (Truncated for space, they are identical to your HTML logic) ---
        function drawMatchResult(W, H, elapsed, themeColor) {
            const teamA = inputs.teamA.value.toUpperCase(); const teamB = inputs.teamB.value.toUpperCase();
            const scoreA = inputs.scoreA.value; const scoreB = inputs.scoreB.value;
            const status = inputs.matchStatus.value.toUpperCase();

            const tStatus = easeOutExpo(clamp(elapsed / 800, 0, 1));
            const tTeams = easeOutQuart(clamp((elapsed - 300) / 800, 0, 1));
            const tScores = easeOutBack(clamp((elapsed - 600) / 600, 0, 1));

            if (tStatus > 0) {
                const badgeY = (H * 0.42) - 50 * (1 - tStatus);
                ctx.globalAlpha = tStatus;
                ctx.font = '900 italic 26px Inter, sans-serif';
                if(isBengali(status)) ctx.font = '900 26px "Hind Siliguri", sans-serif';
                const sW = Math.min(ctx.measureText(status).width + 80, 500);

                drawSlantedBox(W/2 - sW/2, badgeY - 25, sW, 50, 15, themeColor, 1);
                drawProText(status, W/2, badgeY, '900 italic 26px Inter, sans-serif', '#ffffff', 'center', null, 0, sW - 20);
            }

            if (tTeams > 0) {
                ctx.globalAlpha = tTeams;
                const offsetA = -100 * (1 - tTeams); const offsetB = 100 * (1 - tTeams);
                drawProText(teamA, (W/2 - 80) + offsetA, H * 0.85, 'italic 900 65px Oswald, sans-serif', '#ffffff', 'right', null, 20, 420);
                drawProText(teamB, (W/2 + 80) + offsetB, H * 0.85, 'italic 900 65px Oswald, sans-serif', '#ffffff', 'left', null, 20, 420);
            }

            if (tScores > 0) {
                ctx.globalAlpha = clamp(tScores * 1.5, 0, 1);
                const glowColor = hexToRgba(themeColor, 0.4);
                const grad = ctx.createRadialGradient(W/2, H * 0.65, 0, W/2, H * 0.65, 300);
                grad.addColorStop(0, glowColor); grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

                ctx.save(); ctx.translate(W/2, H * 0.65);
                const scoreScale = 1 + (3 * (1 - tScores)); ctx.scale(scoreScale, scoreScale);
                drawProText(scoreA, -60, 0, 'italic 900 230px Oswald, sans-serif', '#ffffff', 'right', glowColor, 40, 350);
                drawProText('-', 0, -20, '900 200px Oswald, sans-serif', themeColor, 'center', null, 0, 100);
                drawProText(scoreB, 60, 0, 'italic 900 230px Oswald, sans-serif', '#ffffff', 'left', glowColor, 40, 350);
                ctx.restore();
            }
        }
        
        function drawFixture(W, H, elapsed, themeColor) {
            const teamA = inputs.teamA.value.toUpperCase(); const teamB = inputs.teamB.value.toUpperCase();
            const date = inputs.matchDate.value.toUpperCase(); const venue = inputs.matchVenue.value.toUpperCase();

            const tVS = easeOutBack(clamp(elapsed / 600, 0, 1));
            const tTeams = easeOutQuart(clamp((elapsed - 300) / 800, 0, 1));
            const tBox = easeOutExpo(clamp((elapsed - 600) / 800, 0, 1));

            if (tVS > 0) {
                ctx.save(); ctx.translate(W/2, H * 0.45);
                const scaleVS = 1 + (4 * (1 - tVS)); ctx.scale(scaleVS, scaleVS);
                ctx.globalAlpha = clamp(tVS * 2, 0, 1);
                drawProText("VS", 0, 0, 'italic 900 160px Oswald, sans-serif', themeColor, 'center', hexToRgba(themeColor, 0.6), 50, 300);
                ctx.restore();
            }

            if (tTeams > 0) {
                ctx.globalAlpha = tTeams; const spread = 80 + (50 * tTeams);
                drawProText(teamA, W/2 - spread, H * 0.45, 'italic 900 90px Oswald, sans-serif', '#ffffff', 'right', 'rgba(0,0,0,0.9)', 30, 380);
                drawProText(teamB, W/2 + spread, H * 0.45, 'italic 900 90px Oswald, sans-serif', '#ffffff', 'left', 'rgba(0,0,0,0.9)', 30, 380);
            }

            if (tBox > 0) {
                const boxY = (H * 0.7) + 100 * (1 - tBox);
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.beginPath(); ctx.moveTo(W/2 - 400, boxY); ctx.lineTo(W/2 + 350, boxY); ctx.lineTo(W/2 + 400, boxY + 160); ctx.lineTo(W/2 - 350, boxY + 160); ctx.fill();
                ctx.strokeStyle = themeColor; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(W/2 - 400, boxY); ctx.lineTo(W/2 + 350, boxY); ctx.stroke();

                ctx.globalAlpha = tBox;
                drawProText("MATCH PREVIEW", W/2, boxY + 35, '900 22px Inter, sans-serif', themeColor, 'center', null, 0, 700);
                drawProText(date, W/2, boxY + 80, '900 40px Inter, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.5)', 10, 750);
                drawProText(venue, W/2, boxY + 125, '700 24px Inter, sans-serif', '#94a3b8', 'center', null, 0, 750);
            }
        }
        
        function drawTransfer(W, H, elapsed, themeColor) {
            const tag = inputs.newsTag.value.toUpperCase();
            const headline = inputs.newsHeadline.value.toUpperCase();
            const details = inputs.newsDetails.value.toUpperCase();

            const tTag = easeOutExpo(clamp(elapsed / 500, 0, 1));
            const tHead = easeOutBack(clamp((elapsed - 300) / 600, 0, 1));
            const tDet = easeOutQuart(clamp((elapsed - 600) / 800, 0, 1));

            if(tTag > 0) {
                ctx.globalAlpha = tTag;
                ctx.font = isBengali(tag) ? '900 35px "Hind Siliguri", sans-serif' : '900 35px Inter, sans-serif';
                const tagW = Math.min(ctx.measureText(tag).width + 60, W - 40);
                drawSlantedBox(W/2 - tagW/2, H * 0.35, tagW, 60, -20, themeColor, 1);
                drawProText(tag, W/2, H * 0.35 + 30, '900 35px Inter, sans-serif', '#000000', 'center', null, 0, tagW - 40);
            }

            if(tHead > 0) {
                ctx.globalAlpha = tHead;
                ctx.save(); ctx.translate(W/2, H * 0.55);
                const scale = 1 + 2*(1-tHead); ctx.scale(scale, scale);
                drawProText(headline, 0, 0, 'italic 900 130px Oswald, sans-serif', '#ffffff', 'center', hexToRgba(themeColor, 0.5), 40, 960);
                ctx.restore();
            }

            if(tDet > 0) {
                ctx.globalAlpha = tDet;
                drawProText(details, W/2, H * 0.7 + 30*(1-tDet), '900 35px Inter, sans-serif', '#e2e8f0', 'center', 'rgba(0,0,0,0.9)', 20, 960);
                ctx.fillStyle = themeColor;
                ctx.fillRect(W/2 - (W * 0.3 * tDet), H * 0.7 + 40, W * 0.6 * tDet, 6);
            }
        }
        
        function drawH2H(W, H, elapsed, themeColor) {
            const p1 = inputs.h2hP1Name.value.toUpperCase(); const p2 = inputs.h2hP2Name.value.toUpperCase();
            const s1 = inputs.h2hP1Stat.value.toUpperCase(); const s2 = inputs.h2hP2Stat.value.toUpperCase();
            const ctxTxt = inputs.h2hContext.value.toUpperCase();

            const tLines = easeOutQuart(clamp(elapsed / 800, 0, 1));
            const tNames = easeOutBack(clamp((elapsed - 300) / 600, 0, 1));
            const tStats = easeOutExpo(clamp((elapsed - 600) / 800, 0, 1));

            if(tLines > 0) {
                ctx.strokeStyle = themeColor; ctx.lineWidth = 8;
                ctx.beginPath(); ctx.moveTo(W/2, H*0.2); ctx.lineTo(W/2, H*0.8 * tLines); ctx.stroke();
                drawProText("VS", W/2, H*0.5, 'italic 900 80px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 20, 150);
                drawProText(ctxTxt, W/2, H*0.85 + 20*(1-tLines), '900 30px Inter, sans-serif', themeColor, 'center', null, 0, 960);
            }

            if(tNames > 0) {
                ctx.globalAlpha = tNames;
                const off = 200 * (1-tNames);
                drawProText(p1, W/4 - off, H*0.4, 'italic 900 80px Oswald, sans-serif', '#ffffff', 'center', hexToRgba(themeColor, 0.5), 20, 450);
                drawProText(p2, (W*0.75) + off, H*0.6, 'italic 900 80px Oswald, sans-serif', '#ffffff', 'center', hexToRgba(themeColor, 0.5), 20, 450);
            }

            if(tStats > 0) {
                ctx.globalAlpha = tStats;
                drawProText(s1, W/4, H*0.48 + 20*(1-tStats), '900 40px Inter, sans-serif', '#cbd5e1', 'center', null, 0, 450);
                drawProText(s2, W*0.75, H*0.68 + 20*(1-tStats), '900 40px Inter, sans-serif', '#cbd5e1', 'center', null, 0, 450);
            }
        }
        
        function drawMilestone(W, H, elapsed, themeColor) {
            const num = inputs.mileNumber.value.toUpperCase();
            const name = inputs.mileName.value.toUpperCase();
            const desc = inputs.mileDesc.value.toUpperCase();

            const tNum = easeOutBack(clamp(elapsed / 800, 0, 1));
            const tName = easeOutQuart(clamp((elapsed - 400) / 800, 0, 1));

            if(tNum > 0) {
                ctx.save(); ctx.translate(W/2, H*0.45);
                const s = 1 + 2*(1-tNum); ctx.scale(s, s);
                ctx.globalAlpha = 0.3 * tNum; 
                drawProText(num, 0, 0, 'italic 900 450px Oswald, sans-serif', themeColor, 'center', null, 0, 960);
                ctx.globalAlpha = tNum;
                ctx.strokeStyle = themeColor; ctx.lineWidth = 4;
                ctx.strokeText(num, 0, 0, 960); 
                ctx.restore();
            }

            if(tName > 0) {
                ctx.globalAlpha = tName;
                drawProText(name, W/2, H*0.6 + 50*(1-tName), 'italic 900 110px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 30, 960);
                ctx.font = isBengali(desc) ? '900 28px "Hind Siliguri", sans-serif' : '900 28px Inter, sans-serif';
                const descW = Math.min(ctx.measureText(desc).width + 80, W - 40);
                drawSlantedBox(W/2 - descW/2, H*0.72 + 50*(1-tName), descW, 60, -15, themeColor, tName);
                drawProText(desc, W/2, H*0.72 + 30 + 50*(1-tName), '900 28px Inter, sans-serif', '#000000', 'center', null, 0, descW - 40);
            }
        }
        
        function drawPlayerCard(W, H, elapsed, themeColor) {
            const name = inputs.playerName.value.toUpperCase();
            const stats = inputs.playerStats.value.toUpperCase();

            const tBox = easeOutQuart(clamp((elapsed - 200) / 800, 0, 1));
            const tName = easeOutExpo(clamp((elapsed - 500) / 800, 0, 1));
            const tStats = easeOutQuart(clamp((elapsed - 800) / 800, 0, 1));

            const boxH = 300; const boxY = H - boxH - 60;

            if (tBox > 0) {
                ctx.globalAlpha = tBox;
                ctx.fillStyle = `rgba(15, 23, 42, ${0.95 * tBox})`;
                ctx.beginPath(); ctx.moveTo(0, boxY + 50); ctx.lineTo(W, boxY - 30); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();

                ctx.shadowColor = themeColor; ctx.shadowBlur = 20;
                ctx.strokeStyle = themeColor; ctx.lineWidth = 12;
                ctx.beginPath(); ctx.moveTo(0, boxY + 50); ctx.lineTo(W, boxY - 30); ctx.stroke();
                ctx.shadowBlur = 0;

                drawProText("STAR PERFORMER", 60, boxY + 90, '900 24px Inter, sans-serif', themeColor, 'left', null, 0, 900);
            }

            if (tName > 0) {
                ctx.globalAlpha = tName;
                drawProText(name, 60 - 50*(1-tName), boxY + 170, 'italic 900 120px Oswald, sans-serif', '#ffffff', 'left', hexToRgba(themeColor,0.5), 40, 960);
            }

            if (tStats > 0) {
                ctx.globalAlpha = 1.0;
                const statLen = Math.floor(Math.max(0, elapsed - 800) / 30);
                const visibleStats = stats.substring(0, Math.min(statLen, stats.length));
                
                drawProText(visibleStats, 60, boxY + 245, '900 45px Oswald, sans-serif', '#cbd5e1', 'left', null, 0, 960);
                if (statLen < stats.length && Math.floor(elapsed / 100) % 2 === 0) {
                    ctx.fillStyle = themeColor; ctx.fillRect(60 + ctx.measureText(visibleStats).width + 5, boxY + 225, 20, 40);
                }
            }
        }
        
        function drawTournPlayerStat(W, H, elapsed, themeColor) {
            const tourn = inputs.tpsTourn.value.toUpperCase();
            const name = inputs.tpsName.value.toUpperCase();
            const stats = [
                { l: inputs.tpsS1L.value.toUpperCase(), v: inputs.tpsS1V.value.toUpperCase() },
                { l: inputs.tpsS2L.value.toUpperCase(), v: inputs.tpsS2V.value.toUpperCase() },
                { l: inputs.tpsS3L.value.toUpperCase(), v: inputs.tpsS3V.value.toUpperCase() },
                { l: inputs.tpsS4L.value.toUpperCase(), v: inputs.tpsS4V.value.toUpperCase() },
                { l: inputs.tpsS5L.value.toUpperCase(), v: inputs.tpsS5V.value.toUpperCase() },
                { l: inputs.tpsS6L.value.toUpperCase(), v: inputs.tpsS6V.value.toUpperCase() }
            ];

            const tTourn = easeOutQuart(clamp(elapsed / 600, 0, 1));
            const tName = easeOutBack(clamp((elapsed - 300) / 600, 0, 1));
            const tBox = easeOutExpo(clamp((elapsed - 500) / 800, 0, 1));

            if(tTourn > 0) {
                ctx.globalAlpha = tTourn;
                ctx.font = isBengali(tourn) ? '900 24px "Hind Siliguri", sans-serif' : '900 24px Inter, sans-serif';
                const tw = Math.min(ctx.measureText(tourn).width + 60, W - 100);
                drawSlantedBox(W/2 - tw/2, H*0.18, tw, 45, -10, themeColor, 1);
                drawProText(tourn, W/2, H*0.18 + 22, '900 24px Inter, sans-serif', '#000000', 'center', null, 0, tw - 30);
            }

            if(tName > 0) {
                ctx.globalAlpha = tName;
                ctx.save(); ctx.translate(W/2, H*0.3);
                const s = 1 + 1*(1-tName); ctx.scale(s, s);
                drawProText(name, 0, 0, 'italic 900 110px Oswald, sans-serif', '#ffffff', 'center', hexToRgba(themeColor, 0.5), 30, W - 40);
                ctx.restore();
            }

            if(tBox > 0) {
                const boxW = W - 80; const boxH = 400; const boxY = H*0.45 + 50*(1-tBox);
                drawGlassBox(W/2 - boxW/2, boxY, boxW, boxH, 20, tBox);

                ctx.globalAlpha = tBox * 0.5;
                ctx.strokeStyle = themeColor; ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(W/2 - boxW/2 + 20, boxY + boxH/2); ctx.lineTo(W/2 + boxW/2 - 20, boxY + boxH/2); 
                ctx.moveTo(W/2 - boxW/6, boxY + 20); ctx.lineTo(W/2 - boxW/6, boxY + boxH - 20); 
                ctx.moveTo(W/2 + boxW/6, boxY + 20); ctx.lineTo(W/2 + boxW/6, boxY + boxH - 20); 
                ctx.stroke();

                stats.forEach((stat, i) => {
                    const delay = 800 + (i * 100);
                    const tStat = easeOutQuart(clamp((elapsed - delay) / 500, 0, 1));
                    if(tStat > 0) {
                        ctx.globalAlpha = tStat;
                        const row = Math.floor(i / 3); const col = i % 3;
                        const x = W/2 - boxW/3 + (col * boxW/3);
                        const y = boxY + 50 + (row * boxH/2) + 20*(1-tStat);
                        drawProText(stat.l, x, y, '600 24px Inter, sans-serif', '#94a3b8', 'center', null, 0, boxW/3 - 20);
                        drawProText(stat.v, x, y + 50, '900 65px Oswald, sans-serif', '#ffffff', 'center', hexToRgba(themeColor, 0.3), 15, boxW/3 - 10);
                    }
                });
            }
        }
        
        function drawCareerCard(W, H, elapsed, themeColor) {
            const name = inputs.playerName.value.toUpperCase();
            const role = inputs.careerRole.value.toUpperCase();
            const stats = [
                { l: inputs.cStat1L.value.toUpperCase(), v: inputs.cStat1V.value.toUpperCase() },
                { l: inputs.cStat2L.value.toUpperCase(), v: inputs.cStat2V.value.toUpperCase() },
                { l: inputs.cStat3L.value.toUpperCase(), v: inputs.cStat3V.value.toUpperCase() },
                { l: inputs.cStat4L.value.toUpperCase(), v: inputs.cStat4V.value.toUpperCase() }
            ];

            const tRole = easeOutExpo(clamp(elapsed / 500, 0, 1));
            const tName = easeOutBack(clamp((elapsed - 300) / 600, 0, 1));

            if(tRole > 0) {
                ctx.globalAlpha = tRole;
                drawSlantedBox(40, H * 0.15, 300, 40, 10, themeColor, 1);
                drawProText(role, 60, H * 0.15 + 20, '900 20px Inter, sans-serif', '#000000', 'left', null, 0, 260);
            }

            if(tName > 0) {
                ctx.globalAlpha = tName;
                ctx.save(); ctx.translate(40, H * 0.25);
                const scale = 1 + 1*(1-tName); ctx.scale(scale, scale);
                drawProText(name, 0, 0, 'italic 900 100px Oswald, sans-serif', '#ffffff', 'left', hexToRgba(themeColor, 0.5), 30, W - 80);
                ctx.restore();
            }

            const gridY = H * 0.45; const boxW = (W - 120) / 2; const boxH = 180; const gap = 40;

            stats.forEach((stat, index) => {
                const delay = 600 + (index * 200);
                const tBox = easeOutBack(clamp((elapsed - delay) / 600, 0, 1));

                if (tBox > 0) {
                    const row = Math.floor(index / 2); const col = index % 2;
                    const x = 40 + (col * (boxW + gap)); const y = gridY + (row * (boxH + gap));

                    ctx.save(); ctx.translate(x + boxW/2, y + boxH/2);
                    const bScale = tBox; ctx.scale(bScale, bScale);
                    ctx.globalAlpha = Math.min(tBox * 1.5, 1);

                    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
                    ctx.strokeStyle = themeColor; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.roundRect(-boxW/2, -boxH/2, boxW, boxH, 15);
                    ctx.fill(); ctx.stroke();
                    
                    ctx.shadowColor = themeColor; ctx.shadowBlur = 10;
                    ctx.stroke(); ctx.shadowBlur = 0;

                    drawProText(stat.l, 0, -30, '600 24px Inter, sans-serif', '#94a3b8', 'center', null, 0, boxW - 20);
                    drawProText(stat.v, 0, 30, '900 70px Oswald, sans-serif', '#ffffff', 'center', null, 0, boxW - 20);
                    ctx.restore();
                }
            });
        }
        
        function drawTournamentCard(W, H, elapsed, themeColor) {
            const name = inputs.tournName.value.toUpperCase();
            const cat = inputs.tournCat.value.toUpperCase();
            const ranks = [
                { n: inputs.tRank1N.value.toUpperCase(), v: inputs.tRank1V.value.toUpperCase() },
                { n: inputs.tRank2N.value.toUpperCase(), v: inputs.tRank2V.value.toUpperCase() },
                { n: inputs.tRank3N.value.toUpperCase(), v: inputs.tRank3V.value.toUpperCase() }
            ];

            const tHead = easeOutQuart(clamp(elapsed / 600, 0, 1));
            const tCat = easeOutExpo(clamp((elapsed - 300) / 600, 0, 1));

            if (tHead > 0) {
                ctx.globalAlpha = tHead;
                drawProText(name, W/2, H*0.18 - 30*(1-tHead), 'italic 900 60px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 20, W-80);
            }

            if (tCat > 0) {
                ctx.globalAlpha = tCat;
                ctx.font = isBengali(cat) ? '900 35px "Hind Siliguri", sans-serif' : '900 35px Inter, sans-serif';
                const catW = Math.min(ctx.measureText(cat).width + 60, W - 100);
                drawSlantedBox(W/2 - catW/2, H*0.28, catW, 60, -15, themeColor, 1);
                drawProText(cat, W/2, H*0.28 + 30, '900 35px Inter, sans-serif', '#000000', 'center', null, 0, catW - 40);
            }

            const startY = H * 0.45; const rowH = 110;

            ranks.forEach((rank, i) => {
                const delay = 600 + (i * 300);
                const tRow = easeOutQuart(clamp((elapsed - delay) / 800, 0, 1));

                if (tRow > 0) {
                    ctx.globalAlpha = tRow;
                    const y = startY + (i * rowH); const xOff = 100 * (1-tRow); 

                    ctx.fillStyle = i === 0 ? hexToRgba(themeColor, 0.2) : 'rgba(15, 23, 42, 0.7)';
                    ctx.strokeStyle = i === 0 ? themeColor : 'rgba(255,255,255,0.1)';
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.roundRect(60 + xOff, y, W - 120, rowH - 15, 12);
                    ctx.fill(); ctx.stroke();

                    drawProText(rank.n, 90 + xOff, y + (rowH-15)/2, '900 38px Inter, sans-serif', i===0 ? '#ffffff' : '#cbd5e1', 'left', null, 0, W - 300);
                    drawProText(rank.v, W - 90 + xOff, y + (rowH-15)/2, '900 55px Oswald, sans-serif', i===0 ? themeColor : '#ffffff', 'right', null, 0, 150);
                }
            });
        }
        
        function drawQuoteCard(W, H, elapsed, themeColor) {
            const quote = inputs.quoteText.value;
            const speaker = inputs.quoteSpeaker.value.toUpperCase();
            const tMark = easeOutBack(clamp(elapsed / 800, 0, 1));
            
            if (tMark > 0) {
                ctx.globalAlpha = clamp(tMark, 0, 0.2);
                ctx.save(); ctx.translate(80, H * 0.35);
                const markScale = 1 + (2 * (1 - tMark)); ctx.scale(markScale, markScale);
                drawProText('"', 0, 0, '900 450px Inter, sans-serif', themeColor, 'left', null, 0, 300);
                ctx.restore();
            }

            const maxWidth = W - 160; const lineHeight = 85; const x = 80;
            ctx.font = isBengali(quote) ? '700 60px "Anek Bangla", sans-serif' : 'italic 900 60px Oswald, sans-serif'; 
            
            const words = quote.split(' '); let line = ''; let lines = [];
            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > maxWidth && n > 0) { lines.push(line.trim()); line = words[n] + ' '; } 
                else { line = testLine; }
            }
            lines.push(line.trim());

            let y = H * 0.5 - ((lines.length * lineHeight) / 2);

            lines.forEach((l, index) => {
                const tLine = easeOutQuart(clamp((elapsed - (300 + index*200)) / 800, 0, 1));
                if (tLine > 0) {
                    ctx.globalAlpha = tLine;
                    drawProText(l, x, y + (lineHeight * index) + 30*(1-tLine), 'italic 900 60px Oswald, sans-serif', '#ffffff', 'left', 'rgba(0,0,0,0.9)', 20, maxWidth);
                }
            });

            const tSpeaker = easeOutExpo(clamp((elapsed - (600 + lines.length*200)) / 800, 0, 1));
            if (tSpeaker > 0) {
                ctx.globalAlpha = tSpeaker;
                const speakerY = y + (lines.length * lineHeight) + 40;
                ctx.fillStyle = themeColor; ctx.fillRect(x, speakerY - 15, 60 * tSpeaker, 6);
                drawProText(speaker, x + 80, speakerY - 12, '900 35px Inter, sans-serif', themeColor, 'left', null, 0, W - x - 100);
            }
        }
        
        function drawLineup(W, H, elapsed, themeColor) {
            const team = inputs.teamA.value.toUpperCase();
            const ctxTxt = inputs.lineupContext.value.toUpperCase();
            const players = inputs.lineupPlayers.value.toUpperCase().split('\n').filter(p => p.trim() !== '');

            const tHead = easeOutQuart(clamp(elapsed / 600, 0, 1));
            const startY = H * 0.35;
            
            if (tHead > 0) {
                ctx.globalAlpha = tHead;
                drawProText(team, W/2, H*0.18 - 30*(1-tHead), 'italic 900 80px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 20, W-80);
                
                ctx.font = isBengali(ctxTxt) ? '900 30px "Hind Siliguri", sans-serif' : '900 30px Inter, sans-serif';
                const ctxW = Math.min(ctx.measureText(ctxTxt).width + 60, W - 100);
                drawSlantedBox(W/2 - ctxW/2, H*0.25, ctxW, 45, -10, themeColor, 1);
                drawProText(ctxTxt, W/2, H*0.25 + 22, '900 24px Inter, sans-serif', '#000000', 'center', null, 0, ctxW - 40);
            }

            players.forEach((player, i) => {
                const delay = 400 + (i * 100);
                const tPlayer = easeOutQuart(clamp((elapsed - delay) / 500, 0, 1));
                
                if (tPlayer > 0) {
                    ctx.globalAlpha = tPlayer;
                    const isLeft = i < 6;
                    const col = isLeft ? 0 : 1;
                    const row = isLeft ? i : i - 6;
                    
                    const x = isLeft ? W*0.32 : W*0.75;
                    const y = startY + (row * 95);
                    const xOff = isLeft ? -50*(1-tPlayer) : 50*(1-tPlayer);
                    
                    ctx.fillStyle = hexToRgba(themeColor, 0.8);
                    ctx.beginPath(); ctx.arc(x - 160 + xOff, y, 24, 0, Math.PI*2); ctx.fill();
                    drawProText(i+1, x - 160 + xOff, y + 2, '900 22px Inter, sans-serif', '#ffffff', 'center', null, 0);
                    drawProText(player, x - 115 + xOff, y + 2, '900 38px Oswald, sans-serif', '#ffffff', 'left', 'rgba(0,0,0,0.9)', 10, W/2 - 140);
                }
            });
        }
        
        function drawStatsComp(W, H, elapsed, themeColor) {
            const teamA = inputs.teamA.value.toUpperCase(); const teamB = inputs.teamB.value.toUpperCase();
            const stats = [
                { l: inputs.sc1L.value.toUpperCase(), a: inputs.sc1A.value.toUpperCase(), b: inputs.sc1B.value.toUpperCase() },
                { l: inputs.sc2L.value.toUpperCase(), a: inputs.sc2A.value.toUpperCase(), b: inputs.sc2B.value.toUpperCase() },
                { l: inputs.sc3L.value.toUpperCase(), a: inputs.sc3A.value.toUpperCase(), b: inputs.sc3B.value.toUpperCase() },
                { l: inputs.sc4L.value.toUpperCase(), a: inputs.sc4A.value.toUpperCase(), b: inputs.sc4B.value.toUpperCase() }
            ];

            const tHead = easeOutQuart(clamp(elapsed / 600, 0, 1));
            
            if (tHead > 0) {
                ctx.globalAlpha = tHead;
                drawProText(`${teamA} vs ${teamB}`, W/2, H*0.18 - 20*(1-tHead), 'italic 900 65px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 20, W-80);
                const title = "MATCH STATS";
                ctx.font = isBengali(title) ? '900 28px "Hind Siliguri", sans-serif' : '900 28px Inter, sans-serif';
                const tw = ctx.measureText(title).width + 60;
                drawSlantedBox(W/2 - tw/2, H*0.26, tw, 45, -10, themeColor, 1);
                drawProText(title, W/2, H*0.26 + 22, '900 24px Inter, sans-serif', '#000000', 'center', null, 0);
            }

            const startY = H * 0.45; const rowH = 130; const barW = W - 160;

            stats.forEach((stat, i) => {
                const delay = 400 + (i * 200);
                const tRow = easeOutQuart(clamp((elapsed - delay) / 600, 0, 1));
                const tBar = easeOutExpo(clamp((elapsed - delay - 200) / 800, 0, 1));

                if (tRow > 0) {
                    ctx.globalAlpha = tRow;
                    const y = startY + (i * rowH);
                    
                    drawProText(stat.l, W/2, y, '900 28px Inter, sans-serif', '#cbd5e1', 'center', 'rgba(0,0,0,0.8)', 10, 300);
                    drawProText(stat.a, 80, y, '900 45px Oswald, sans-serif', '#ffffff', 'left', null, 10);
                    drawProText(stat.b, W - 80, y, '900 45px Oswald, sans-serif', themeColor, 'right', null, 10);

                    if (tBar > 0) {
                        ctx.globalAlpha = tBar;
                        const numA = parseFloat(stat.a.replace(/[^0-9.]/g, '')) || 0;
                        const numB = parseFloat(stat.b.replace(/[^0-9.]/g, '')) || 0;
                        const total = numA + numB || 1;
                        const ratioA = numA / total;
                        
                        const barY = y + 35;
                        ctx.fillStyle = 'rgba(255,255,255,0.1)';
                        ctx.beginPath(); ctx.roundRect(80, barY, barW, 12, 6); ctx.fill();
                        
                        const wA = (barW * ratioA - 2) * tBar;
                        if(wA > 0) {
                            ctx.fillStyle = '#ffffff';
                            ctx.beginPath(); ctx.roundRect(80, barY, wA, 12, {tl:6, bl:6, tr:0, br:0}); ctx.fill();
                        }
                        
                        const wB = (barW * (1 - ratioA) - 2) * tBar;
                        if(wB > 0) {
                            ctx.fillStyle = themeColor;
                            ctx.beginPath(); ctx.roundRect(80 + (barW * ratioA) + 2, barY, wB, 12, {tl:0, bl:0, tr:6, br:6}); ctx.fill();
                        }
                    }
                }
            });
        }
        
        function drawRatings(W, H, elapsed, themeColor) {
            const team = inputs.teamA.value.toUpperCase();
            const players = [
                { n: inputs.rat1N.value.toUpperCase(), v: inputs.rat1V.value },
                { n: inputs.rat2N.value.toUpperCase(), v: inputs.rat2V.value },
                { n: inputs.rat3N.value.toUpperCase(), v: inputs.rat3V.value },
                { n: inputs.rat4N.value.toUpperCase(), v: inputs.rat4V.value }
            ];

            const tHead = easeOutQuart(clamp(elapsed / 600, 0, 1));
            
            if (tHead > 0) {
                ctx.globalAlpha = tHead;
                drawProText(team, W/2, H*0.18 - 30*(1-tHead), 'italic 900 80px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 20, W-80);
                
                const title = "PLAYER RATINGS";
                ctx.font = isBengali(title) ? '900 30px "Hind Siliguri", sans-serif' : '900 30px Inter, sans-serif';
                const tw = ctx.measureText(title).width + 60;
                drawSlantedBox(W/2 - tw/2, H*0.26, tw, 50, -12, themeColor, 1);
                drawProText(title, W/2, H*0.26 + 25, '900 26px Inter, sans-serif', '#000000', 'center', null, 0);
            }

            const gridY = H * 0.45; const boxW = (W - 120) / 2; const boxH = 220; const gap = 40;

            players.forEach((p, index) => {
                const delay = 400 + (index * 200);
                const tBox = easeOutBack(clamp((elapsed - delay) / 600, 0, 1));

                if (tBox > 0) {
                    const row = Math.floor(index / 2); const col = index % 2;
                    const x = 40 + (col * (boxW + gap)); const y = gridY + (row * (boxH + gap));

                    ctx.save(); ctx.translate(x + boxW/2, y + boxH/2);
                    const bScale = tBox; ctx.scale(bScale, bScale);
                    ctx.globalAlpha = Math.min(tBox * 1.5, 1);

                    drawGlassBox(-boxW/2, -boxH/2, boxW, boxH, 20, 1);
                    
                    ctx.fillStyle = themeColor;
                    ctx.beginPath(); ctx.roundRect(-boxW/2, -boxH/2, boxW, 8, {tl:20, tr:20, bl:0, br:0}); ctx.fill();

                    const ratingNum = parseFloat(p.v) || 0;
                    const ratingColor = ratingNum >= 8 ? '#10b981' : (ratingNum >= 6 ? '#f59e0b' : '#ef4444');
                    
                    ctx.fillStyle = hexToRgba(ratingColor, 0.2);
                    ctx.beginPath(); ctx.arc(0, -10, 45, 0, Math.PI*2); ctx.fill();
                    
                    ctx.strokeStyle = ratingColor; ctx.lineWidth = 4;
                    ctx.beginPath(); ctx.arc(0, -10, 45, 0, Math.PI*2); ctx.stroke();

                    drawProText(p.v, 0, -10, '900 40px Oswald, sans-serif', '#ffffff', 'center', null, 0);
                    drawProText(p.n, 0, 65, '900 32px Oswald, sans-serif', '#cbd5e1', 'center', null, 0, boxW - 20);

                    ctx.restore();
                }
            });
        }
        
        function drawTrivia(W, H, elapsed, themeColor) {
            const head = inputs.triviaHead.value.toUpperCase();
            const fact = inputs.triviaFact.value.toUpperCase();

            const tMark = easeOutBack(clamp(elapsed / 800, 0, 1));
            const tHead = easeOutQuart(clamp((elapsed - 300) / 600, 0, 1));
            
            if (tMark > 0) {
                ctx.globalAlpha = clamp(tMark, 0, 0.15);
                ctx.save(); ctx.translate(W/2, H/2);
                const markScale = 1 + (2 * (1 - tMark)); ctx.scale(markScale, markScale);
                drawProText('?', 0, 0, '900 800px Inter, sans-serif', themeColor, 'center', null, 0);
                ctx.restore();
            }

            if (tHead > 0) {
                ctx.globalAlpha = tHead;
                ctx.font = isBengali(head) ? '900 50px "Hind Siliguri", sans-serif' : 'italic 900 65px Oswald, sans-serif';
                const hw = Math.min(ctx.measureText(head).width + 80, W - 40);
                drawSlantedBox(W/2 - hw/2, H*0.25, hw, 80, -20, themeColor, 1);
                drawProText(head, W/2, H*0.25 + 40, ctx.font, '#000000', 'center', null, 0, hw - 40);
            }

            const maxWidth = W - 120; const lineHeight = 75; const x = W/2;
            ctx.font = isBengali(fact) ? '700 50px "Anek Bangla", sans-serif' : 'italic 900 55px Oswald, sans-serif'; 
            
            const words = fact.split(' '); let line = ''; let lines = [];
            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > maxWidth && n > 0) { lines.push(line.trim()); line = words[n] + ' '; } 
                else { line = testLine; }
            }
            lines.push(line.trim());

            let y = H * 0.55 - ((lines.length * lineHeight) / 2);

            lines.forEach((l, index) => {
                const tLine = easeOutQuart(clamp((elapsed - (600 + index*150)) / 800, 0, 1));
                if (tLine > 0) {
                    ctx.globalAlpha = tLine;
                    drawProText(l, x, y + (lineHeight * index) + 30*(1-tLine), ctx.font, '#ffffff', 'center', 'rgba(0,0,0,0.9)', 20, maxWidth);
                }
            });
        }
        
        function drawNextMatch(W, H, elapsed, themeColor) {
            const teamA = inputs.teamA.value.toUpperCase(); const teamB = inputs.teamB.value.toUpperCase();
            const date = inputs.matchDate.value.toUpperCase(); const venue = inputs.matchVenue.value.toUpperCase();
            const countdown = inputs.countText.value.toUpperCase();

            const tVS = easeOutBack(clamp(elapsed / 600, 0, 1));
            const tTeams = easeOutQuart(clamp((elapsed - 300) / 800, 0, 1));
            const tBox = easeOutExpo(clamp((elapsed - 600) / 800, 0, 1));
            const tCount = easeOutBack(clamp((elapsed - 900) / 600, 0, 1));

            if (tVS > 0) {
                ctx.save(); ctx.translate(W/2, H * 0.35);
                const scaleVS = 1 + (4 * (1 - tVS)); ctx.scale(scaleVS, scaleVS);
                ctx.globalAlpha = clamp(tVS * 2, 0, 1);
                drawProText("VS", 0, 0, 'italic 900 140px Oswald, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.9)', 30, 200);
                ctx.restore();
            }

            if (tTeams > 0) {
                ctx.globalAlpha = tTeams; const spread = 70 + (50 * tTeams);
                drawProText(teamA, W/2 - spread, H * 0.35, 'italic 900 80px Oswald, sans-serif', '#ffffff', 'right', 'rgba(0,0,0,0.9)', 30, 380);
                drawProText(teamB, W/2 + spread, H * 0.35, 'italic 900 80px Oswald, sans-serif', '#ffffff', 'left', 'rgba(0,0,0,0.9)', 30, 380);
            }

            if (tBox > 0) {
                const boxY = (H * 0.55) + 100 * (1 - tBox);
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.beginPath(); ctx.moveTo(W/2 - 400, boxY); ctx.lineTo(W/2 + 350, boxY); ctx.lineTo(W/2 + 400, boxY + 160); ctx.lineTo(W/2 - 350, boxY + 160); ctx.fill();
                ctx.globalAlpha = tBox;
                drawProText(date, W/2, boxY + 60, '900 45px Inter, sans-serif', '#ffffff', 'center', 'rgba(0,0,0,0.5)', 10, 750);
                drawProText(venue, W/2, boxY + 110, '700 28px Inter, sans-serif', '#94a3b8', 'center', null, 0, 750);
            }

            if (tCount > 0) {
                ctx.globalAlpha = tCount;
                ctx.save(); ctx.translate(W/2, H * 0.82 + 50*(1-tCount));
                ctx.shadowColor = themeColor; ctx.shadowBlur = 30;
                ctx.fillStyle = themeColor;
                const cw = Math.min(ctx.measureText(countdown).width + 100, W - 40);
                ctx.beginPath(); ctx.roundRect(-cw/2, -40, cw, 80, 40); ctx.fill();
                ctx.shadowBlur = 0;
                drawProText(countdown, 0, 0, '900 45px Inter, sans-serif', '#000000', 'center', null, 0, cw - 40);
                ctx.restore();
            }
        }

        // --- Video Recording Logic ---
        function startRecording() {
            if (isRecording) return;
            isRecording = true;
            recordedChunks = [];
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            if (canvasContainer.requestFullscreen) {
                canvasContainer.requestFullscreen().catch(e => console.log(e));
            } else if (canvasContainer.webkitRequestFullscreen) {
                canvasContainer.webkitRequestFullscreen();
            }

            const recordingHud = document.getElementById('recordingHud');
            const recTime = document.getElementById('recTime');
            if (recordingHud) {
                recordingHud.classList.remove('hidden');
                recordingHud.classList.add('flex');
            }

            const stream = renderCanvas.captureStream(60);
            let mimeType = 'video/webm; codecs=vp8';
            if (MediaRecorder.isTypeSupported('video/mp4')) mimeType = 'video/mp4';
            else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp8')) mimeType = 'video/webm; codecs=vp8';
            else if (MediaRecorder.isTypeSupported('video/webm')) mimeType = 'video/webm';

            mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
            
            mediaRecorder.ondataavailable = (e) => { 
                if (e.data && e.data.size > 0) { recordedChunks.push(e.data); }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: mimeType });
                
                const finalizeDownload = (finalBlob) => {
                    const url = URL.createObjectURL(finalBlob);
                    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                    downloadLink.href = url; 
                    downloadLink.download = `ViralSport_${inputs.cardType.value}_${Date.now()}.${ext}`; 
                    downloadLink.click();
                    
                    isRecording = false;
                    if (recordingHud) { recordingHud.classList.remove('flex'); recordingHud.classList.add('hidden'); }
                    
                    if (document.fullscreenElement) { document.exitFullscreen().catch(e => console.log(e)); } 
                    else if (document.webkitFullscreenElement) { document.webkitExitFullscreen(); }

                    // Reset button state
                    btnRenderVideo.innerHTML = `<i data-lucide="video" class="w-5 h-5"></i> <span class="hidden sm:inline">Render Pro Video</span>`;
                    btnRenderVideo.disabled = false;

                    restartAnimation();
                };

                if (mimeType.includes('webm') && typeof ysFixWebmDuration !== 'undefined') {
                    ysFixWebmDuration(blob, RENDER_DURATION, finalizeDownload);
                } else { finalizeDownload(blob); }
            };

            setTimeout(() => {
                mediaRecorder.start(100); 
                const recStartTime = Date.now();
                particles = [];
                for(let i=0; i<40; i++) particles.push({ x: Math.random()*1080, y: Math.random()*1080, size: Math.random()*4+1, speedY: Math.random()*2+0.5, opacity: Math.random()*0.5+0.1 });

                function recordLoop() {
                    const elapsed = Date.now() - recStartTime;
                    drawCanvas(elapsed);
                    
                    if (recTime) { recTime.textContent = (elapsed / 1000).toFixed(1) + 's'; }

                    if (elapsed < RENDER_DURATION) {
                        animationFrameId = requestAnimationFrame(recordLoop);
                    } else {
                        mediaRecorder.stop();
                    }
                }
                recordLoop();
            }, 300);
        }

        const defaultStadiumImage = new Image();
        defaultStadiumImage.crossOrigin = "anonymous";
        defaultStadiumImage.onload = () => {
            if (!bgImage) {
                bgImage = defaultStadiumImage;
                if (!animationFrameId && !isRecording) restartAnimation();
            }
        };
        defaultStadiumImage.src = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1080&auto=format&fit=crop";

        document.fonts.ready.then(() => {
            if(!bgImage && !animationFrameId && !isRecording) restartAnimation();
        });

        // Cleanup on unmount
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
            {/* Custom Video Engine Styles */}
            <style dangerouslySetInnerHTML={{__html: `
                .font-sports { font-family: 'Oswald', 'Anek Bangla', sans-serif; text-transform: uppercase; }
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #1e293b; }
                ::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #64748b; }
                :fullscreen { background-color: black; display: flex; align-items: center; justify-content: center; }
                :fullscreen canvas { max-height: 100vh; max-width: 100vw; }
            `}} />

            {/* Header */}
            <header className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={props.onBack} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Back to App">
                            <i data-lucide="arrow-left" className="w-5 h-5"></i>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <i data-lucide="zap" className="w-6 h-6 text-white"></i>
                            </div>
                            <h1 className="text-xl md:text-2xl font-sports font-bold tracking-wide text-white">Video <span className="text-indigo-400">Studio</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                            <span className="text-xs text-slate-400 font-bold uppercase">Balance:</span>
                            <span className="text-sm font-bold text-amber-400">{props.points} Pts</span>
                        </div>
                        <button id="btnRenderVideo" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 md:px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg text-sm md:text-base">
                            <i data-lucide="video" className="w-5 h-5"></i> <span className="hidden sm:inline">Render Pro Video</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Controls & Inputs */}
                <div className="lg:col-span-5 space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pr-2 pb-10">
                    
                    {/* Global Settings */}
                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
                        <div className="flex items-center gap-2 mb-4 text-indigo-400">
                            <i data-lucide="settings" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Animation Settings</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Sport</label>
                                <select id="sportType" defaultValue="cricket" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-white">
                                    <option value="football">Football</option>
                                    <option value="cricket">Cricket</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Theme Accent Color</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" id="themeColor" defaultValue="#0ea5e9" className="w-10 h-10 rounded cursor-pointer bg-slate-900 border border-slate-700 p-1" />
                                    <span className="text-xs text-slate-400">Neon Glow</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Graphic Template</label>
                            <select id="cardType" defaultValue="result" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-medium">
                                <option value="result">🏆 Match Result</option>
                                <option value="fixture">📅 Match Fixture</option>
                                <option value="transfer">🚨 News / Alert</option>
                                <option value="h2h">⚔️ Head-to-Head</option>
                                <option value="milestone">⭐ Record / Milestone</option>
                                <option value="player">🏅 Player of the Match</option>
                                <option value="tournPlayerStat">🏏 Player Tournament Stats</option>
                                <option value="career">📈 Player Career Stats</option>
                                <option value="tournament">📊 Tournament Stats</option>
                                <option value="quote">💬 Player/Manager Quote</option>
                                <option value="lineup">📋 Playing XI / Lineup</option>
                                <option value="statsComp">⚖️ Match Stats Comparison</option>
                                <option value="ratings">⭐ Player Ratings</option>
                                <option value="trivia">🧠 Did You Know? / Trivia</option>
                                <option value="nextMatch">⏳ Next Match Countdown</option>
                            </select>
                        </div>

                        <div className="mt-4 mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Top-Right Branding Handle</label>
                            <input type="text" id="brandText" defaultValue="@VIRALSPORTS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-300 font-medium" />
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs text-slate-400 mb-1">Background Image</label>
                            <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700 hover:border-indigo-500 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <i data-lucide="upload-cloud" className="w-6 h-6 mb-1 text-slate-400"></i>
                                    <p className="text-xs text-slate-300"><span className="font-semibold">Upload Image</span></p>
                                </div>
                                <input id="imageUpload" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Team Details */}
                    <div id="sectionTeams" className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400">
                            <i data-lucide="users" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Team Info</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Team A Name</label>
                                <input type="text" id="teamA" defaultValue="INDIA" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Team B Name</label>
                                <input type="text" id="teamB" defaultValue="AUSTRALIA" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                            </div>
                        </div>
                    </div>

                    {/* Match Result Details */}
                    <div id="sectionScores" className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-amber-400">
                            <i data-lucide="trophy" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Match Score</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Team A Score</label>
                                <input type="text" id="scoreA" defaultValue="240/6" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Team B Score</label>
                                <input type="text" id="scoreB" defaultValue="238/9" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold uppercase" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Status (e.g. FULL TIME / INNINGS BREAK)</label>
                            <input type="text" id="matchStatus" defaultValue="INDIA WON BY 2 RUNS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Fixture Details */}
                    <div id="sectionFixture" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                            <i data-lucide="calendar" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Match Details</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Date & Time</label>
                            <input type="text" id="matchDate" defaultValue="SUNDAY, 19 NOV | 14:00 IST" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Venue / Stadium</label>
                            <input type="text" id="matchVenue" defaultValue="NARENDRA MODI STADIUM" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Transfer / News Details */}
                    <div id="sectionTransfer" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-red-500">
                            <i data-lucide="alert-triangle" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">News / Alert Info</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Alert Tag</label>
                            <input type="text" id="newsTag" defaultValue="INJURY UPDATE" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Main Headline</label>
                            <input type="text" id="newsHeadline" defaultValue="J. BUMRAH" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Details</label>
                            <input type="text" id="newsDetails" defaultValue="RULED OUT OF THE SERIES DUE TO BACK SPASM" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Head to Head Details */}
                    <div id="sectionH2H" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-orange-500">
                            <i data-lucide="swords" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Head to Head</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player 1</label>
                                <input type="text" id="h2hP1Name" defaultValue="KOHLI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player 2</label>
                                <input type="text" id="h2hP2Name" defaultValue="SMITH" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">P1 Stat</label>
                                <input type="text" id="h2hP1Stat" defaultValue="80 CENTURIES" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">P2 Stat</label>
                                <input type="text" id="h2hP2Stat" defaultValue="44 CENTURIES" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs text-slate-400 mb-1">Context</label>
                            <input type="text" id="h2hContext" defaultValue="MODERN GREATS COLLIDE" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Milestone Details */}
                    <div id="sectionMilestone" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-yellow-400">
                            <i data-lucide="award" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Record / Milestone</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Massive Number</label>
                                <input type="text" id="mileNumber" defaultValue="50" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player Name</label>
                                <input type="text" id="mileName" defaultValue="VIRAT KOHLI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Record Description</label>
                            <input type="text" id="mileDesc" defaultValue="MOST ODI CENTURIES IN HISTORY" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Player Info Details */}
                    <div id="sectionPlayer" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-orange-400">
                            <i data-lucide="star" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Player Info</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Player Name</label>
                            <input type="text" id="playerName" defaultValue="VIRAT KOHLI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Key Match Stats (Used in Player of Match)</label>
                            <input type="text" id="playerStats" defaultValue="85* (52) & 1/12" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Player Tournament Stats Specifics */}
                    <div id="sectionTournPlayerStat" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400">
                            <i data-lucide="activity" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Tournament Player Stats</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Tournament Name</label>
                            <input type="text" id="tpsTourn" defaultValue="ICC WORLD CUP 2023" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Player Name</label>
                            <input type="text" id="tpsName" defaultValue="VIRAT KOHLI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 1</label>
                                <input type="text" id="tpsS1L" defaultValue="INNINGS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none uppercase" />
                                <input type="text" id="tpsS1V" defaultValue="11" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 2</label>
                                <input type="text" id="tpsS2L" defaultValue="RUNS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none uppercase" />
                                <input type="text" id="tpsS2V" defaultValue="765" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 3</label>
                                <input type="text" id="tpsS3L" defaultValue="AVERAGE" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none uppercase" />
                                <input type="text" id="tpsS3V" defaultValue="95.62" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 4</label>
                                <input type="text" id="tpsS4L" defaultValue="STRIKE RATE" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none uppercase" />
                                <input type="text" id="tpsS4V" defaultValue="90.31" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 5</label>
                                <input type="text" id="tpsS5L" defaultValue="100S / 50S" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none uppercase" />
                                <input type="text" id="tpsS5V" defaultValue="3 / 6" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 6</label>
                                <input type="text" id="tpsS6L" defaultValue="BEST" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none uppercase" />
                                <input type="text" id="tpsS6V" defaultValue="117" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500 uppercase" />
                            </div>
                        </div>
                    </div>

                    {/* Career Stats Specifics */}
                    <div id="sectionCareer" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-cyan-400">
                            <i data-lucide="bar-chart-2" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Career Statistics Grid</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Format/Role Label</label>
                            <input type="text" id="careerRole" defaultValue="ODI BATTING CAREER" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 1 Label & Value</label>
                                <input type="text" id="cStat1L" defaultValue="MATCHES" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none" />
                                <input type="text" id="cStat1V" defaultValue="292" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 2 Label & Value</label>
                                <input type="text" id="cStat2L" defaultValue="RUNS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none" />
                                <input type="text" id="cStat2V" defaultValue="13,848" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 3 Label & Value</label>
                                <input type="text" id="cStat3L" defaultValue="AVERAGE" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none" />
                                <input type="text" id="cStat3V" defaultValue="58.67" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Stat 4 Label & Value</label>
                                <input type="text" id="cStat4L" defaultValue="STRIKE RATE" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs mb-1 text-slate-400 focus:outline-none" />
                                <input type="text" id="cStat4V" defaultValue="93.58" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm font-bold focus:outline-none focus:border-indigo-500" />
                            </div>
                        </div>
                    </div>

                    {/* Tournament Standings Specifics */}
                    <div id="sectionTournament" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <i data-lucide="list-ordered" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Tournament Standings</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Tournament Name</label>
                            <input type="text" id="tournName" defaultValue="ICC MEN'S CWC 2023" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Category (e.g. Most Runs / Points Table)</label>
                            <input type="text" id="tournCat" defaultValue="MOST RUNS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold uppercase" />
                        </div>
                        
                        {/* Ranks */}
                        <div className="space-y-3 mt-4 border-t border-slate-700 pt-4">
                            <div className="flex gap-2">
                                <input type="text" id="tRank1N" defaultValue="1. VIRAT KOHLI" className="w-2/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500" />
                                <input type="text" id="tRank1V" defaultValue="765" className="w-1/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-center" />
                            </div>
                            <div className="flex gap-2">
                                <input type="text" id="tRank2N" defaultValue="2. ROHIT SHARMA" className="w-2/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500" />
                                <input type="text" id="tRank2V" defaultValue="597" className="w-1/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-center" />
                            </div>
                            <div className="flex gap-2">
                                <input type="text" id="tRank3N" defaultValue="3. QUINTON DE KOCK" className="w-2/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500" />
                                <input type="text" id="tRank3V" defaultValue="594" className="w-1/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-center" />
                            </div>
                        </div>
                    </div>

                    {/* Quote Details */}
                    <div id="sectionQuote" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-pink-400">
                            <i data-lucide="message-square" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Quote</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Quote Text (English or Bengali)</label>
                            <textarea id="quoteText" rows="3" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500" defaultValue='"We showed incredible character today. The fans pushed us until the very last minute."'></textarea>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Speaker Name</label>
                            <input type="text" id="quoteSpeaker" defaultValue="ROHIT SHARMA" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                    </div>

                    {/* Lineup Details */}
                    <div id="sectionLineup" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400">
                            <i data-lucide="clipboard-list" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Playing Lineup</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Team Name (Uses Team A from Team Info)</label>
                            <p className="text-sm text-slate-500 italic">Configure in "Team Info" section</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Formation / Context (e.g., 4-3-3 or PLAYING XI)</label>
                            <input type="text" id="lineupContext" defaultValue="PLAYING XI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Players (One per line)</label>
                            <textarea id="lineupPlayers" rows="6" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase leading-relaxed font-sports tracking-wide" defaultValue={"ROHIT SHARMA (C)\nSHUBMAN GILL\nVIRAT KOHLI\nSHREYAS IYER\nKL RAHUL (WK)\nSURYAKUMAR YADAV\nRAVINDRA JADEJA\nMOHAMMED SHAMI\nKULDEEP YADAV\nJASPRIT BUMRAH\nMOHAMMED SIRAJ"}></textarea>
                        </div>
                    </div>

                    {/* Stats Comparison Details */}
                    <div id="sectionStatsComp" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-cyan-400">
                            <i data-lucide="bar-chart-horizontal" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Team Stats Comparison</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Compares Team A vs Team B</p>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1 text-center">Team A</label>
                                    <input type="text" id="sc1A" defaultValue="32" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1 text-center">Stat Name</label>
                                    <input type="text" id="sc1L" defaultValue="BOUNDARIES" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 text-center text-slate-300" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1 text-center">Team B</label>
                                    <input type="text" id="sc1B" defaultValue="18" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div><input type="text" id="sc2A" defaultValue="8" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" /></div>
                                <div><input type="text" id="sc2L" defaultValue="SIXES" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 text-center text-slate-300" /></div>
                                <div><input type="text" id="sc2B" defaultValue="4" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div><input type="text" id="sc3A" defaultValue="6" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" /></div>
                                <div><input type="text" id="sc3L" defaultValue="SPIN WICKETS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 text-center text-slate-300" /></div>
                                <div><input type="text" id="sc3B" defaultValue="4" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" /></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-end">
                                <div><input type="text" id="sc4A" defaultValue="4" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" /></div>
                                <div><input type="text" id="sc4L" defaultValue="PACE WICKETS" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs focus:outline-none focus:border-indigo-500 text-center text-slate-300" /></div>
                                <div><input type="text" id="sc4B" defaultValue="5" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 text-center font-bold" /></div>
                            </div>
                        </div>
                    </div>

                    {/* Player Ratings Details */}
                    <div id="sectionRatings" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-yellow-400">
                            <i data-lucide="star-half" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Player Ratings</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player 1 Name</label>
                                <input type="text" id="rat1N" defaultValue="VIRAT KOHLI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                                <label className="block text-xs text-slate-400 mt-2 mb-1">Rating</label>
                                <input type="text" id="rat1V" defaultValue="9.5" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-emerald-400" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player 2 Name</label>
                                <input type="text" id="rat2N" defaultValue="ROHIT SHARMA" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                                <label className="block text-xs text-slate-400 mt-2 mb-1">Rating</label>
                                <input type="text" id="rat2V" defaultValue="8.0" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-emerald-400" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player 3 Name</label>
                                <input type="text" id="rat3N" defaultValue="M. SHAMI" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                                <label className="block text-xs text-slate-400 mt-2 mb-1">Rating</label>
                                <input type="text" id="rat3V" defaultValue="9.0" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-emerald-400" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Player 4 Name</label>
                                <input type="text" id="rat4N" defaultValue="K. RAHUL" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                                <label className="block text-xs text-slate-400 mt-2 mb-1">Rating</label>
                                <input type="text" id="rat4V" defaultValue="7.5" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    {/* Trivia Details */}
                    <div id="sectionTrivia" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                            <i data-lucide="help-circle" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Did You Know?</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-400 mb-1">Trivia Headline</label>
                            <input type="text" id="triviaHead" defaultValue="DID YOU KNOW?" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-sports uppercase" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Fact / Details</label>
                            <textarea id="triviaFact" rows="4" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 uppercase" defaultValue={"SACHIN TENDULKAR IS THE ONLY PLAYER TO SCORE 100 INTERNATIONAL CENTURIES ACROSS ALL FORMATS."}></textarea>
                        </div>
                    </div>

                    {/* Next Match Countdown Details */}
                    <div id="sectionCountdown" className="hidden bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4 text-orange-500">
                            <i data-lucide="timer" className="w-5 h-5"></i>
                            <h2 className="font-semibold text-lg">Countdown Info</h2>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">Uses Team & Fixture info above</p>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Countdown Text</label>
                            <input type="text" id="countText" defaultValue="2 DAYS TO GO" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:outline-none focus:border-indigo-500 font-bold uppercase text-orange-400" />
                        </div>
                    </div>
                    
                </div>

                {/* Right Column: Preview/Canvas */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-800 shadow-inner p-4 relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
                    
                    <div className="w-full max-w-[600px] flex flex-col items-center gap-4">
                        <div id="canvasContainer" className="relative w-full aspect-square bg-slate-950 shadow-2xl rounded-lg border border-slate-700 overflow-hidden group">
                            <canvas id="renderCanvas" width="1080" height="1080" className="w-full h-full object-contain"></canvas>
                            
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" id="btnPreviewFullscreen">
                                <div className="bg-indigo-600 p-4 rounded-full text-white shadow-xl transform hover:scale-110 transition-transform">
                                    <i data-lucide="maximize" className="w-8 h-8"></i>
                                </div>
                            </div>
                            
                            {/* Recording HUD */}
                            <div id="recordingHud" className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-red-500 p-3 rounded-lg hidden items-center gap-3 z-[100] shadow-2xl shadow-red-500/20">
                                <div className="relative w-3 h-3">
                                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                    <div className="absolute inset-0 bg-red-500 rounded-full"></div>
                                </div>
                                <span className="text-white font-bold text-sm font-mono tracking-widest">REC</span>
                                <span id="recTime" className="text-red-400 font-mono text-sm font-bold w-12 text-right">0.0s</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <button id="btnPlayAnim" className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-full flex items-center gap-2 transition-all border border-slate-600 shadow-lg active:scale-95">
                                <i data-lucide="rotate-ccw" className="w-4 h-4"></i> Replay Animation
                            </button>
                        </div>
                    </div>

                </div>

            </main>

            <a id="downloadLink" className="hidden"></a>
        </div>
    );
};
