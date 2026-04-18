// --- POSTER BOT PRO: 8K CANVAS RENDERING ENGINE ---
// Handles all canvas drawing operations, image positioning, and typography.

(function() {
    // Helper: Draw Glassmorphism Panel
    function drawGlassPanel(ctx, x, y, width, height, radius, color, opacity = 0.8) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        // Fill with shadow
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.fill();

        // Inner Light Border for Glass effect
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
    }

    // Helper: Smart Text Wrapper
    function drawSmartText(ctx, text, x, y, maxWidth, lineHeight) {
        if (!text) return;
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
        return currentY + lineHeight;
    }

    // Helper: Draw Image with Transform
    function drawTransformedImage(ctx, img, pos) {
        if (!img) return;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.scale(pos.scale, pos.scale);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    // --- MAIN RENDERER EXPORT ---
    window.PosterRenderer = function(ctx, w, h, appMode, formData, images, positions, isExport = false) {
        // Clear Canvas
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0f172a'; // Base dark slate
        ctx.fillRect(0, 0, w, h);

        const { bgImage, bgImage2, avatarImage, clashImages } = images;
        const { img1Pos, img2Pos, avatarPos, clashPos } = positions;
        const pColor = formData.primaryColor || '#FFEB00';
        const sColor = formData.secondaryColor || '#8C0D17';

        // 1. GLOBAL BACKGROUND RENDERING (If not a split-screen mode)
        if (appMode !== 'player_comparison' && appMode !== 'h2h_3v3' && bgImage) {
            drawTransformedImage(ctx, bgImage, img1Pos);
            
            // Background Dimming/Overlay
            ctx.fillStyle = '#000000';
            ctx.globalAlpha = formData.bgOpacity !== undefined ? formData.bgOpacity : 0.6;
            ctx.fillRect(0, 0, w, h);
            ctx.globalAlpha = 1.0;
        }

        // --- SPECIFIC TOOL LAYOUTS ---

        // ==========================================
        // 🏆 1. MAN OF THE MATCH (NEW)
        // ==========================================
        if (appMode === 'motm_award') {
            // Draw heavy bottom gradient so text pops
            let grad = ctx.createLinearGradient(0, h * 0.4, 0, h);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.5, 'rgba(0,0,0,0.8)');
            grad.addColorStop(1, 'rgba(0,0,0,0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Top Badge
            drawGlassPanel(ctx, 40, 40, 250, 60, 15, pColor, 0.9);
            ctx.fillStyle = '#000'; ctx.font = 'bold 28px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.badgeText.toUpperCase(), 165, 80);

            // MAN OF THE MATCH TITLE
            ctx.fillStyle = '#ffffff'; ctx.font = 'black 80px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.shadowColor = pColor; ctx.shadowBlur = 30;
            ctx.fillText("MAN OF THE MATCH", w/2, h - 350);
            ctx.shadowBlur = 0; // reset

            // Glass Stats Panel
            drawGlassPanel(ctx, 50, h - 300, w - 100, 220, 30, '#1e293b', 0.85);
            
            // Player & Team
            ctx.fillStyle = pColor; ctx.font = 'black 65px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.motmPlayerName, w/2, h - 210);
            ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.motmTeam, w/2, h - 160);

            // 3 Stats Row
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 35px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.motmStat1, w/2 - 250, h - 105);
            ctx.fillText(formData.motmStat2, w/2, h - 105);
            ctx.fillText(formData.motmStat3, w/2 + 250, h - 105);

        // ==========================================
        // ⚖️ 2. PLAYER COMPARISON (H2H) (NEW)
        // ==========================================
        } else if (appMode === 'player_comparison') {
            // Left Half
            ctx.save();
            ctx.beginPath(); ctx.rect(0, 0, w/2, h); ctx.clip();
            if (bgImage) drawTransformedImage(ctx, bgImage, img1Pos);
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,w/2,h);
            ctx.restore();

            // Right Half
            ctx.save();
            ctx.beginPath(); ctx.rect(w/2, 0, w/2, h); ctx.clip();
            if (bgImage2) drawTransformedImage(ctx, bgImage2, img2Pos);
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(w/2,0,w/2,h);
            ctx.restore();

            // Center Slanted Divider
            ctx.fillStyle = sColor;
            ctx.beginPath();
            ctx.moveTo(w/2 - 20, 0); ctx.lineTo(w/2 + 20, 0);
            ctx.lineTo(w/2 + 20, h); ctx.lineTo(w/2 - 20, h);
            ctx.fill();

            // Player Names at Top
            drawGlassPanel(ctx, 40, 40, w/2 - 80, 100, 20, '#000000', 0.8);
            drawGlassPanel(ctx, w/2 + 40, 40, w/2 - 80, 100, 20, '#000000', 0.8);
            ctx.fillStyle = pColor; ctx.font = 'black 50px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.compPlayer1, w/4, 108);
            ctx.fillText(formData.compPlayer2, w*0.75, 108);

            // VS Badge Center
            ctx.beginPath(); ctx.arc(w/2, 90, 50, 0, Math.PI*2); ctx.fillStyle = pColor; ctx.fill();
            ctx.fillStyle = '#000'; ctx.font = 'black 40px Arial';
            ctx.fillText("VS", w/2, 105);

            // Stats Matrix Loop
            let startY = 400;
            const rowHeight = 120;
            
            for(let i=1; i<=4; i++) {
                const label = formData[`compStat${i}Label`];
                if(!label) continue;
                const p1Stat = formData[`compP1Stat${i}`];
                const p2Stat = formData[`compP2Stat${i}`];

                // Center Label Pill
                drawGlassPanel(ctx, w/2 - 120, startY, 240, 70, 35, pColor, 1);
                ctx.fillStyle = '#000'; ctx.font = 'bold 35px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText(label, w/2, startY + 48);

                // Player 1 Stat (Left)
                ctx.fillStyle = '#fff'; ctx.font = 'black 65px "Hind Siliguri", sans-serif'; ctx.textAlign = 'right';
                ctx.shadowColor = '#000'; ctx.shadowBlur = 10;
                ctx.fillText(p1Stat, w/2 - 150, startY + 58);

                // Player 2 Stat (Right)
                ctx.textAlign = 'left';
                ctx.fillText(p2Stat, w/2 + 150, startY + 58);
                ctx.shadowBlur = 0;

                startY += rowHeight;
            }

        // ==========================================
        // 📊 3. INNINGS SUMMARY (NEW)
        // ==========================================
        } else if (appMode === 'innings_summary') {
            // Top Banner
            drawGlassPanel(ctx, 40, 40, w - 80, 200, 30, sColor, 0.9);
            ctx.fillStyle = pColor; ctx.font = 'bold 40px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("INNINGS BREAK - " + formData.summaryTeamTitle, w/2, 100);
            ctx.fillStyle = '#ffffff'; ctx.font = 'black 90px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.summaryTeamTotal, w/2, 200);

            // Left Panel (Batsmen)
            drawGlassPanel(ctx, 40, 280, w/2 - 60, h - 450, 30, '#000000', 0.7);
            ctx.fillStyle = pColor; ctx.font = 'bold 45px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("TOP BATSMEN", w/4 + 10, 360);
            
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 40px "Hind Siliguri", sans-serif';
            let bY = 460;
            [1, 2, 3].forEach(num => {
                if(formData[`summaryBat${num}`]) {
                    ctx.fillText(formData[`summaryBat${num}`], w/4 + 10, bY);
                    bY += 90;
                }
            });

            // Right Panel (Bowlers)
            drawGlassPanel(ctx, w/2 + 20, 280, w/2 - 60, h - 450, 30, '#000000', 0.7);
            ctx.fillStyle = pColor; ctx.font = 'bold 45px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("TOP BOWLERS", w*0.75 - 10, 360);
            
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 40px "Hind Siliguri", sans-serif';
            let bwY = 460;
            [1, 2, 3].forEach(num => {
                if(formData[`summaryBowl${num}`]) {
                    ctx.fillText(formData[`summaryBowl${num}`], w*0.75 - 10, bwY);
                    bwY += 90;
                }
            });

        // ==========================================
        // 🗞️ 4. NEWS & QUOTES (Existing Refined)
        // ==========================================
        } else if (appMode === 'news' || appMode === 'statement') {
            const gradH = formData.newsGradientHeight !== undefined ? formData.newsGradientHeight : 0.6;
            let grad = ctx.createLinearGradient(0, h * (1 - gradH), 0, h);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.3, 'rgba(0,0,0,0.8)');
            grad.addColorStop(1, 'rgba(0,0,0,0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            if (appMode === 'statement' && avatarImage) {
                drawTransformedImage(ctx, avatarImage, avatarPos);
            }

            // Top Badge
            drawGlassPanel(ctx, 40, 40, 250, 60, 15, pColor, 1);
            ctx.fillStyle = '#000'; ctx.font = 'bold 28px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.badgeText.toUpperCase(), 165, 80);

            // Quote Text
            ctx.fillStyle = '#ffffff'; ctx.font = 'black 65px "Hind Siliguri", sans-serif'; ctx.textAlign = 'left';
            const authorY = drawSmartText(ctx, "“" + formData.quoteText + "”", 60, h - 350, w - 120, 85);
            
            // Author Name
            ctx.fillStyle = pColor; ctx.font = 'bold 40px "Hind Siliguri", sans-serif';
            ctx.fillText("- " + formData.quoteAuthor, 60, authorY + 20);

        // ==========================================
        // 🏏 5. CLASSIC SCORECARD (Existing Refined)
        // ==========================================
        } else if (appMode === 'scorecard') {
            // Main Glass Box
            drawGlassPanel(ctx, 40, h - 450, w - 80, 300, 40, '#1e293b', 0.85);
            
            // Result Banner
            drawGlassPanel(ctx, 60, h - 480, w - 120, 80, 20, pColor, 1);
            ctx.fillStyle = '#000'; ctx.font = 'bold 35px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.result, w/2, h - 425);

            // Teams & Scores
            ctx.textAlign = 'left';
            ctx.fillStyle = formData.team1Color || '#ffffff'; ctx.font = 'bold 50px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.team1, 80, h - 300);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff'; ctx.font = 'black 65px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.team1Score, w - 80, h - 300);
            ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.team1Overs, w - 80, h - 260);

            // Divider line
            ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(80, h - 240); ctx.lineTo(w - 80, h - 240); ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = formData.team2Color || '#ffffff'; ctx.font = 'bold 50px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.team2, 80, h - 160);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff'; ctx.font = 'black 65px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.team2Score, w - 80, h - 160);
            ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.team2Overs, w - 80, h - 120);

        // ==========================================
        // ⚽ 6. FOOTBALL PRO (Existing Refined)
        // ==========================================
        } else if (appMode === 'f_scorecard') {
            if(bgImage2) {
                ctx.save();
                ctx.beginPath(); ctx.roundRect(w/2 - 180, 150, 360, 360, 20); ctx.clip();
                drawTransformedImage(ctx, bgImage2, img2Pos);
                ctx.restore();
            }

            drawGlassPanel(ctx, 40, h - 450, w - 80, 320, 40, '#000000', 0.85);
            ctx.fillStyle = pColor; ctx.font = 'bold 35px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.fTourneyTitle, w/2, h - 380);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
            ctx.fillText(formData.fMatchStatus, w/2, h - 330);

            ctx.fillStyle = formData.team1Color; ctx.font = 'bold 50px "Hind Siliguri", sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(formData.team1, w/2 - 150, h - 220);
            
            ctx.fillStyle = formData.team2Color; ctx.font = 'bold 50px "Hind Siliguri", sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(formData.team2, w/2 + 150, h - 220);

            ctx.fillStyle = '#ffffff'; ctx.font = 'black 100px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(`${formData.team1Score} - ${formData.team2Score}`, w/2, h - 200);

        // ==========================================
        // ⚔️ 7. 3V3 CLASH (Existing Refined)
        // ==========================================
        } else if (appMode === 'h2h_3v3') {
            // Split Background
            ctx.fillStyle = formData.team1Color || '#1e293b'; ctx.fillRect(0, 0, w/2, h);
            ctx.fillStyle = formData.team2Color || '#8C0D17'; ctx.fillRect(w/2, 0, w/2, h);

            // Draw player slots
            const slotWidth = 300; const slotHeight = 400;
            const drawPlayerSlot = (imgKey, x, y, posObj) => {
                ctx.save();
                ctx.beginPath();
                // Parallelogram clip for premium sports feel
                ctx.moveTo(x + 30, y); ctx.lineTo(x + slotWidth, y);
                ctx.lineTo(x + slotWidth - 30, y + slotHeight); ctx.lineTo(x, y + slotHeight);
                ctx.closePath(); ctx.clip();
                
                ctx.fillStyle = '#000'; ctx.fillRect(x, y, slotWidth, slotHeight);
                if (clashImages[imgKey]) drawTransformedImage(ctx, clashImages[imgKey], posObj);
                
                ctx.lineWidth = 8; ctx.strokeStyle = '#ffffff'; ctx.stroke();
                ctx.restore();
            };

            // T1 Left
            drawPlayerSlot('t1p1', 120, 200, clashPos.t1p1);
            drawPlayerSlot('t1p2', 60, 480, clashPos.t1p2);
            drawPlayerSlot('t1p3', 120, 760, clashPos.t1p3);

            // T2 Right
            drawPlayerSlot('t2p1', w - 120 - slotWidth, 200, clashPos.t2p1);
            drawPlayerSlot('t2p2', w - 60 - slotWidth, 480, clashPos.t2p2);
            drawPlayerSlot('t2p3', w - 120 - slotWidth, 760, clashPos.t2p3);

            // Center Banner
            drawGlassPanel(ctx, w/2 - 150, 40, 300, 100, 20, '#000', 0.9);
            ctx.fillStyle = pColor; ctx.font = 'black 45px Arial'; ctx.textAlign = 'center';
            ctx.fillText("VS", w/2, 110);
            
            drawGlassPanel(ctx, 40, h - 160, w - 80, 100, 20, '#000', 0.8);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 35px "Hind Siliguri", sans-serif';
            ctx.fillText(`${formData.h2hTournament} | ${formData.h2hDate} | ${formData.h2hTime}`, w/2, h - 95);
        }

        // --- GLOBAL FOOTER ---
        if (appMode !== 'h2h_3v3') { // 3v3 has its own footer layout
            drawGlassPanel(ctx, 0, h - 70, w, 70, 0, '#000000', 0.8);
            ctx.fillStyle = pColor; ctx.font = 'bold 24px "Hind Siliguri", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(formData.footerHandle, w/2, h - 25);
        }
    };
})();
