// --- ADVANCED 8K RENDERING ENGINE v5.2 (3v3 CLASH - RESIZED & UNIFIED COLORS) ---

window.PosterRenderer = function(ctx, W, H, appMode, formData, assets, positions, isExport = false) {
    const splitY = 700;

    // --- BULLETPROOF TEXT HELPERS ---
    const measureText = (text, fs, fw) => { ctx.font = `${fw} ${fs}px "Hind Siliguri", sans-serif`; return ctx.measureText(text).width; };

    const drawText = (text, x, y, fs, color, align, fw) => { 
        ctx.font = `${fw} ${fs}px "Hind Siliguri", sans-serif`; 
        ctx.fillStyle = color; 
        ctx.textAlign = align; 
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
        ctx.fillText(text, x, y); 
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    };

    const wrapText = (text, maxWidth) => {
        if (!text) return [];
        const words = text.toString().split(' ');
        let lines = []; let currentLine = words[0] || '';
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) currentLine += " " + word;
            else { lines.push(currentLine); currentLine = word; }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    };

    const drawResponsiveText = (text, x, y, maxW, defaultFs, color, align, fw) => {
        let fs = defaultFs;
        ctx.font = `${fw} ${fs}px "Hind Siliguri", sans-serif`;
        while (ctx.measureText(text).width > maxW && fs > 14) {
            fs -= 1;
            ctx.font = `${fw} ${fs}px "Hind Siliguri", sans-serif`;
        }
        ctx.fillStyle = color; ctx.textAlign = align;
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
        ctx.fillText(text, x, y); 
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    };

    const drawSmartText = (text, x, y, boxW, boxH, maxFs, minFs, color, align, fw, lhRatio = 1.3) => {
        let fs = maxFs;
        let lines = [];
        let textHeight = 0;

        while (fs >= minFs) {
            ctx.font = `${fw} ${fs}px "Hind Siliguri", sans-serif`;
            lines = wrapText(text, boxW);
            textHeight = lines.length * (fs * lhRatio);
            if (textHeight <= boxH) break;
            fs -= 2;
        }

        if (textHeight > boxH) {
            const maxAllowedLines = Math.floor(boxH / (fs * lhRatio));
            lines = lines.slice(0, maxAllowedLines);
            if (lines.length > 0) {
                lines[lines.length - 1] = lines[lines.length - 1].replace(/\s+\S*$/, '...');
            }
            textHeight = lines.length * (fs * lhRatio);
        }

        let currentY = y - (textHeight / 2) + (fs * lhRatio * 0.7) / 2;
        if(align === 'top') currentY = y + fs;
        if(align === 'left' && textHeight > fs * lhRatio) {
            currentY = y - (textHeight / 2) + fs; 
        }

        ctx.fillStyle = color; ctx.textAlign = align === 'top' ? 'center' : align;
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;

        lines.forEach(line => {
            ctx.fillText(line, x, currentY);
            currentY += (fs * lhRatio);
        });
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    };

    const drawFBIcon = (cx, cy, size) => {
        ctx.save(); ctx.translate(cx, cy); ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#1877F2'; ctx.fill(); ctx.fillStyle = '#ffffff';
        const scale = size / 40; ctx.scale(scale, scale); ctx.translate(-12, -12);
        ctx.fill(new Path2D('M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z')); 
        ctx.restore();
    };

    const drawRoundedRect = (x, y, width, height, radius) => {
        if (ctx.roundRect) {
            let r = radius; if (Array.isArray(radius)) r = radius;
            ctx.beginPath(); ctx.roundRect(x, y, width, height, r); ctx.fill();
        } else { ctx.fillRect(x, y, width, height); }
    };

    const drawPremiumGlassBox = (x, y, w, h, radius, alpha, accentColor) => {
        ctx.save(); 
        ctx.globalAlpha = alpha;
        ctx.fillStyle = formData.secondaryColor;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill(); 
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, 'rgba(255,255,255,0.1)'); 
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fill(); 
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (accentColor) {
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.stroke();
        }
        ctx.restore();
    };

    // --- CORE RENDER PIPELINE ---
    try {
        ctx.fillStyle = '#000000'; 
        ctx.fillRect(0, 0, W, H);

        // 1. Draw Backgrounds & Auto Color Grading
        if (appMode === 'discussion') {
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#000000'); grad.addColorStop(1, formData.secondaryColor);
            ctx.fillStyle = grad; ctx.globalAlpha = formData.bgOpacity; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1.0;
            ctx.font = "bold 600px serif"; ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.textAlign = "center"; ctx.fillText("❝", W/2, H/2 + 100);
        } else if (appMode === 't_fixture' || appMode === 'h2h_3v3') {
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, '#000000'); grad.addColorStop(1, formData.secondaryColor);
            ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            if (assets.bgImage) {
                ctx.save(); 
                ctx.globalAlpha = formData.bgOpacity * 0.5; 
                ctx.translate(positions.img1Pos.x, positions.img1Pos.y); ctx.scale(positions.img1Pos.scale, positions.img1Pos.scale); 
                ctx.drawImage(assets.bgImage, 0, 0); 
                ctx.restore();
            }
        } else if (appMode === 'f_scorecard') {
            if (assets.bgImage) {
                ctx.save(); 
                ctx.filter = 'contrast(1.2) saturate(0.85) brightness(0.95)';
                ctx.translate(positions.img1Pos.x, positions.img1Pos.y); ctx.scale(positions.img1Pos.scale, positions.img1Pos.scale); 
                ctx.drawImage(assets.bgImage, 0, 0); 
                ctx.restore();
            } else {
                ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, W, H); 
                drawText("Loading Image 1...", W/2, H/3, 50, "#ffffff", "center", "bold");
            }
            if (assets.bgImage2) {
                ctx.save();
                const cx = 830; const cy = 360; const r = 180;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
                ctx.translate(positions.img2Pos.x, positions.img2Pos.y); ctx.scale(positions.img2Pos.scale, positions.img2Pos.scale);
                ctx.drawImage(assets.bgImage2, 0, 0);
                ctx.restore();
                ctx.lineWidth = 10; ctx.strokeStyle = formData.primaryColor;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            }
        } else if (appMode === 'squad') {
            const topH = H * 0.38; 
            if (assets.bgImage) {
                ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, topH); ctx.clip();
                ctx.filter = 'contrast(1.15) saturate(0.9) brightness(0.9)';
                ctx.translate(positions.img1Pos.x, positions.img1Pos.y); ctx.scale(positions.img1Pos.scale, positions.img1Pos.scale); 
                ctx.drawImage(assets.bgImage, 0, 0); ctx.restore();
            } else {
                ctx.fillStyle = formData.secondaryColor; ctx.fillRect(0, 0, W, topH); drawText("Team Photo Area", W/2, topH/2, 40, "#ffffff", "center", "bold");
            }
            ctx.fillStyle = formData.secondaryColor; ctx.fillRect(0, topH, W, H - topH);
        } else {
            if (assets.bgImage && assets.bgImage2 && appMode !== 'statement') {
                ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W/2, H); ctx.clip(); ctx.translate(positions.img1Pos.x, positions.img1Pos.y); ctx.scale(positions.img1Pos.scale, positions.img1Pos.scale); ctx.drawImage(assets.bgImage, 0, 0); ctx.restore();
                ctx.save(); ctx.beginPath(); ctx.rect(W/2, 0, W/2, H); ctx.clip(); ctx.translate(positions.img2Pos.x, positions.img2Pos.y); ctx.scale(positions.img2Pos.scale, positions.img2Pos.scale); ctx.drawImage(assets.bgImage2, 0, 0); ctx.restore();
                ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 4; ctx.stroke();
            } else if (assets.bgImage) {
                ctx.save(); ctx.filter = 'contrast(1.2) saturate(0.9) brightness(0.9)'; ctx.translate(positions.img1Pos.x, positions.img1Pos.y); ctx.scale(positions.img1Pos.scale, positions.img1Pos.scale); ctx.drawImage(assets.bgImage, 0, 0); ctx.restore();
            } else {
                ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, W, H); 
                drawText("Loading Image...", W/2, H/2, 50, "#ffffff", "center", "bold");
            }
        }

        const titleBoxY = splitY + 40; const titleBoxW = 800; const titleBoxH = 90; const titleBoxX = (W - titleBoxW) / 2;
        const scoresY = titleBoxY + 160; const leftCenter = W * 0.25; const rightCenter = W * 0.75; const footerH = 60; const footerY = H - footerH;

        // 2. Overlays - 100% Solid Color Bottoms (Removed Opacity constraint)
        ctx.save();
        
        if (appMode === 'news') { 
            const h = H * formData.newsGradientHeight; const startY = H - h;
            const gradient = ctx.createLinearGradient(0, startY, 0, startY + 150);
            gradient.addColorStop(0, 'transparent'); gradient.addColorStop(1, formData.secondaryColor);
            ctx.fillStyle = gradient; ctx.fillRect(0, startY, W, 150); 
            ctx.fillStyle = formData.secondaryColor; ctx.fillRect(0, startY + 150, W, H - (startY + 150));
        } else if (appMode === 'multi_result' || appMode === 'multi_schedule') {
            ctx.fillStyle = formData.secondaryColor; ctx.fillRect(0, 0, W, H);
        } else if (['scorecard', 'schedule', 'player', 'career', 'poll', 'milestone'].includes(appMode)) { 
            const startY = splitY - 150;
            const gradient = ctx.createLinearGradient(0, startY, 0, startY + 200);
            gradient.addColorStop(0, 'transparent'); gradient.addColorStop(1, formData.secondaryColor);
            ctx.fillStyle = gradient; ctx.fillRect(0, startY, W, 200); 
            ctx.fillStyle = formData.secondaryColor; ctx.fillRect(0, startY + 200, W, H - (startY + 200));
        }
        
        if (['scorecard', 'schedule', 'player'].includes(appMode)) { 
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; drawRoundedRect(titleBoxX, titleBoxY, titleBoxW, titleBoxH, 20);
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; ctx.strokeRect(titleBoxX, titleBoxY, titleBoxW, titleBoxH);
            drawResponsiveText(formData.title, W / 2, titleBoxY + 60, titleBoxW - 40, 50, '#ffffff', 'center', 'bold');
        }
        ctx.restore(); 

        // 3. Module Rendering
        
        // ==========================================
        // ---> NEW 3V3 CLASH RENDERER <---
        // ==========================================
        if (appMode === 'h2h_3v3') {
            // Header Info - REDUCED FONT SIZES
            drawResponsiveText(formData.h2hTournament, W/2, 120, 900, 55, formData.primaryColor, 'center', '900');
            drawResponsiveText(`${formData.h2hDay}, ${formData.h2hDate} | ${formData.h2hTime}`, W/2, 170, 900, 28, '#ffffff', 'center', 'bold');
            
            ctx.beginPath(); ctx.moveTo(W/2 - 200, 200); ctx.lineTo(W/2 + 200, 200); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth=3; ctx.stroke();

            // Player Card Drawing Function (Slanted Parallelograms, NO NAMES)
            const drawClashCard = (img, pos, x, y, w, h, color, isLeft) => {
                ctx.save();
                const slant = 35; // Slightly reduced slant for smaller cards
                
                // Draw the Slanted Shape Path
                ctx.beginPath();
                if(isLeft) {
                    ctx.moveTo(x, y + slant); ctx.lineTo(x + w, y);
                    ctx.lineTo(x + w, y + h - slant); ctx.lineTo(x, y + h);
                } else {
                    ctx.moveTo(x, y); ctx.lineTo(x + w, y + slant);
                    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h - slant);
                }
                ctx.closePath();
                
                // Clip canvas to this shape
                ctx.save();
                ctx.clip();
                ctx.fillStyle = formData.secondaryColor; 
                ctx.fill();
                
                // Draw the actual uploaded image
                if (img) {
                    ctx.translate(x + w/2 + pos.x, y + h/2 + pos.y); 
                    ctx.scale(pos.scale, pos.scale);
                    ctx.drawImage(img, -img.width/2, -img.height/2);
                }
                ctx.restore(); 
                
                // Add Outer Border
                ctx.lineWidth = 5; // Slightly thinner border for smaller cards
                ctx.strokeStyle = color;
                ctx.stroke();

                ctx.restore();
            };

            // RESIZED CARDS - Equally smaller dimensions
            const cW = 220; 
            const cH = 380; 
            const cY = 320; // Pushed slightly down
            
            // Draw Team 1 (Left Side - Overlapping Back to Front)
            drawClashCard(assets.clashImages?.t1p3, positions.clashPos?.t1p3 || {x:0, y:0, scale:1}, 40, cY+50, cW, cH, formData.team1Color, true);
            drawClashCard(assets.clashImages?.t1p2, positions.clashPos?.t1p2 || {x:0, y:0, scale:1}, 140, cY+25, cW, cH, formData.team1Color, true);
            drawClashCard(assets.clashImages?.t1p1, positions.clashPos?.t1p1 || {x:0, y:0, scale:1}, 240, cY, cW, cH, formData.team1Color, true);

            // Draw Team 2 (Right Side - Overlapping Back to Front)
            drawClashCard(assets.clashImages?.t2p3, positions.clashPos?.t2p3 || {x:0, y:0, scale:1}, W-40-cW, cY+50, cW, cH, formData.team2Color, false);
            drawClashCard(assets.clashImages?.t2p2, positions.clashPos?.t2p2 || {x:0, y:0, scale:1}, W-140-cW, cY+25, cW, cH, formData.team2Color, false);
            drawClashCard(assets.clashImages?.t2p1, positions.clashPos?.t2p1 || {x:0, y:0, scale:1}, W-240-cW, cY, cW, cH, formData.team2Color, false);

            // Big "VS" Logo in Center Over Everything
            ctx.beginPath(); ctx.arc(W/2, cY + cH/2, 55, 0, Math.PI*2); 
            ctx.fillStyle = formData.secondaryColor; ctx.fill();
            ctx.lineWidth = 5; ctx.strokeStyle = formData.primaryColor; ctx.stroke();
            drawText("VS", W/2, cY + cH/2 + 18, 45, formData.primaryColor, 'center', '900');

            // Bottom Team Names Box (Reduced Size)
            drawPremiumGlassBox(60, 820, W-120, 120, 20, 1, formData.primaryColor);
            
            // Team Names (Reduced Font Size & UNIFIED COLOR to pure white)
            drawResponsiveText(formData.h2hTeam1Name, W/4 + 30, 892, 380, 50, '#ffffff', 'center', '900');
            drawResponsiveText(formData.h2hTeam2Name, (3*W/4) - 30, 892, 380, 50, '#ffffff', 'center', '900');
            
            // Center Divider Line inside Team Names Box
            ctx.beginPath(); ctx.moveTo(W/2, 840); ctx.lineTo(W/2, 920); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3; ctx.stroke();
        }
        else if (appMode === 'f_scorecard') {
            const darkGradient = ctx.createLinearGradient(0, 450, 0, H);
            darkGradient.addColorStop(0, 'transparent'); darkGradient.addColorStop(0.35, formData.secondaryColor); darkGradient.addColorStop(1, formData.secondaryColor);
            ctx.fillStyle = darkGradient; ctx.fillRect(0, 450, W, H - 450);

            const panelY = 740; const panelH = H - panelY - footerH;
            ctx.fillStyle = formData.secondaryColor; ctx.beginPath(); 
            if(ctx.roundRect) ctx.roundRect(40, panelY, W - 80, panelH, 24); else ctx.fillRect(40, panelY, W - 80, panelH); ctx.fill();

            const tGrad = ctx.createLinearGradient(40, 0, W-80, 0); tGrad.addColorStop(0, formData.team1Color); tGrad.addColorStop(1, formData.team2Color);
            ctx.fillStyle = tGrad; ctx.beginPath(); 
            if(ctx.roundRect) ctx.roundRect(40, panelY, W - 80, 12, [24, 24, 0, 0]); else ctx.fillRect(40, panelY, W - 80, 12); ctx.fill();

            drawResponsiveText(formData.fTourneyTitle, W/2, panelY + 65, W - 160, 48, formData.primaryColor, 'center', '900');
            ctx.beginPath(); ctx.moveTo(80, panelY + 100); ctx.lineTo(W - 80, panelY + 100); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; ctx.stroke();

            const scoreBoxY = panelY + 140; const scoreBoxH = 140;
            ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath();
            ctx.moveTo(W/2 - 140, scoreBoxY); ctx.lineTo(W/2 + 100, scoreBoxY); ctx.lineTo(W/2 + 140, scoreBoxY + scoreBoxH); ctx.lineTo(W/2 - 100, scoreBoxY + scoreBoxH);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 2; ctx.stroke();
            
            drawText(formData.team1Score + " - " + formData.team2Score, W/2, scoreBoxY + 100, 100, formData.primaryColor, 'center', '900');
            const nameY = scoreBoxY + 85; 
            drawResponsiveText(formData.team1, W/2 - 280, nameY, 280, 60, '#ffffff', 'center', '900'); drawResponsiveText(formData.team2, W/2 + 280, nameY, 280, 60, '#ffffff', 'center', '900');
            drawResponsiveText(formData.fMatchStatus, W/2, panelY + 340, 300, 32, formData.primaryColor, 'center', 'bold');
        }
        else if (appMode === 't_fixture') {
            const topY = 100; const titleLines = formData.fixtureTitle.split('\n'); let currentY = topY;
            titleLines.forEach(line => { drawResponsiveText(line.trim(), W/2, currentY + 40, 960, 65, formData.primaryColor, 'center', '900'); currentY += 75; });
            drawResponsiveText(formData.fixtureSubtitle, W/2, currentY + 30, 800, 40, '#ffffff', 'center', 'bold'); currentY += 70;
            ctx.beginPath(); ctx.moveTo(W/2 - 250, currentY); ctx.lineTo(W/2 + 250, currentY); ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 3; ctx.stroke(); currentY += 40;

            const list = formData.matchupList; const colCount = 2; const rowCount = Math.ceil((list.length||1) / colCount);
            const footerAreaH = 260; const availableH = (H - footerH - footerAreaH - currentY);
            const spacingY = availableH / rowCount; const boxH = Math.min(110, spacingY * 0.85); const boxW = 460; const startX = (W - (boxW * 2 + 20)) / 2;

            list.forEach((match, i) => {
                const col = i % colCount; const row = Math.floor(i / colCount); const x = startX + (col * (boxW + 20)); const y = currentY + (row * spacingY);
                ctx.fillStyle = '#ffffff'; drawRoundedRect(x, y, boxW, boxH, 16);
                const pillarW = 95; ctx.fillStyle = formData.secondaryColor;
                if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, pillarW, boxH, [16, 0, 0, 16]); ctx.fill(); } else { ctx.fillRect(x, y, pillarW, boxH); }
                drawResponsiveText(match.date, x + pillarW/2, y + boxH/2 + 8, pillarW - 10, 24, formData.primaryColor, 'center', '900');
                const vsX = x + pillarW + (boxW - pillarW) / 2;
                ctx.beginPath(); ctx.arc(vsX, y + boxH/2, 26, 0, Math.PI*2); ctx.fillStyle = formData.primaryColor; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#000000'; ctx.stroke(); drawText("VS", vsX, y + boxH/2 + 8, 22, formData.secondaryColor, 'center', '900');
                const t1W = (vsX - 26) - (x + pillarW) - 10; const t1X = (x + pillarW) + t1W/2 + 5; drawResponsiveText(match.t1, t1X, y + boxH/2 - 2, t1W, 26, '#000000', 'center', '900'); drawResponsiveText(match.t1Sub, t1X, y + boxH/2 + 22, t1W, 18, formData.secondaryColor, 'center', 'bold');
                const t2W = (x + boxW) - (vsX + 26) - 10; const t2X = (vsX + 26) + t2W/2 + 5; drawResponsiveText(match.t2, t2X, y + boxH/2 - 2, t2W, 26, '#000000', 'center', '900'); drawResponsiveText(match.t2Sub, t2X, y + boxH/2 + 22, t2W, 18, formData.secondaryColor, 'center', 'bold');
            });

            const footY1 = H - footerH - 220; ctx.fillStyle = 'rgba(0,0,0, 0.3)'; ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 3; drawRoundedRect(W/2 - 280, footY1, 560, 70, 35); ctx.stroke(); drawText("📅 " + formData.fixtureDateFooter, W/2, footY1 + 46, 30, formData.primaryColor, 'center', 'bold');
            const footY2 = footY1 + 95; ctx.fillStyle = 'rgba(0,0,0, 0.5)'; ctx.strokeStyle = 'rgba(255,255,255,0.1)'; drawRoundedRect(W/2 - 320, footY2, 640, 60, 30); ctx.stroke(); drawText("🛡️ " + formData.fixtureOrganizerFooter, W/2, footY2 + 40, 26, '#ffffff', 'center', 'bold');
        } else if (appMode === 'squad') {
            const topH = H * 0.38; const titleBarH = 150; 
            const tGrad = ctx.createLinearGradient(0, topH - 30, W, topH - 30); tGrad.addColorStop(0, '#000000'); tGrad.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = tGrad; 
            ctx.beginPath(); ctx.roundRect(40, topH - 30, W - 80, titleBarH, 20); ctx.fill(); ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 3; ctx.stroke();
            drawSmartText(formData.squadTitle, W/2, topH + titleBarH/2 - 30, W-120, titleBarH - 30, 50, 18, formData.primaryColor, 'center', 'bold');

            const gridY = topH + titleBarH + 20; const gridH = H - footerH - gridY - 20; const gridW = W - 60; const gridX = 30;
            const players = formData.squadList.split('\n').filter(line => line.trim() !== ''); const colCount = 2; const rowCount = Math.ceil(players.length / colCount);
            const colW = gridW / colCount; const rowH = gridH / rowCount; const fontSize = Math.min(42, rowH * 0.55); 

            players.forEach((player, i) => {
                const col = i % colCount; const row = Math.floor(i / colCount); const itemX = gridX + (col * colW); const itemY = gridY + (row * rowH);
                const bx = itemX + 30; const by = itemY + rowH/2;
                ctx.beginPath(); ctx.moveTo(bx, by-8); ctx.lineTo(bx+12, by); ctx.lineTo(bx, by+8); ctx.closePath(); ctx.fillStyle = formData.primaryColor; ctx.fill();

                let pText = player.trim(); let isSpecial = false; const specialTags = ['(c)', '(C)', '(wk)', '(WK)', '(অধিনায়ক)', '(উইকেটকিপার)', '(captain)'];
                specialTags.forEach(tag => { if (pText.includes(tag)) isSpecial = true; });
                const pColor = isSpecial ? formData.primaryColor : '#ffffff'; const pWeight = isSpecial ? '900' : 'bold';

                ctx.font = `${pWeight} ${fontSize}px "Hind Siliguri", sans-serif`; ctx.fillStyle = pColor; ctx.textAlign = 'left';
                ctx.fillText(pText, bx + 25, by + (fontSize*0.35));
            });
        } else if (appMode === 'poll') {
            const py = splitY + 40; drawResponsiveText(formData.pollQuestion, W / 2, py + 20, 900, 55, formData.primaryColor, 'center', 'bold');
            ctx.beginPath(); ctx.moveTo(W/2-250, py+40); ctx.lineTo(W/2+250, py+40); ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.lineWidth=2; ctx.stroke();

            const boxW = 440; const boxH = 140; const leftX = W/4 - boxW/2; const rightX = (3*W/4) - boxW/2; const topY = py + 80;
            drawPremiumGlassBox(leftX, topY, boxW, boxH, 20, 1, formData.primaryColor);
            drawFBIcon(leftX + 80, topY + 70, 75); drawText("লাইক (LIKE)", leftX + boxW/2 + 20, topY + 60, 26, formData.primaryColor, 'center', 'bold');
            drawResponsiveText(formData.pollPlayer1, leftX + boxW/2 + 20, topY + 105, 300, 40, '#ffffff', 'center', 'bold');

            drawPremiumGlassBox(rightX, topY, boxW, boxH, 20, 1, formData.primaryColor);
            ctx.save(); ctx.translate(rightX + 80, topY + 70); ctx.beginPath(); ctx.arc(0, 0, 75 / 2, 0, Math.PI * 2); ctx.fillStyle = '#ff0000'; ctx.fill(); ctx.fillStyle = '#ffffff'; const scale = 75 / 40; ctx.scale(scale, scale); ctx.translate(-12, -12); ctx.fill(new Path2D('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')); ctx.restore();
            drawText("লাভ (LOVE)", rightX + boxW/2 + 20, topY + 60, 26, '#ff0000', 'center', 'bold'); drawResponsiveText(formData.pollPlayer2, rightX + boxW/2 + 20, topY + 105, 300, 40, '#ffffff', 'center', 'bold');

            ctx.beginPath(); ctx.arc(W/2, topY + boxH/2, 40, 0, Math.PI*2); ctx.fillStyle = formData.secondaryColor; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = formData.primaryColor; ctx.stroke(); drawText("VS", W/2, topY + boxH/2 + 12, 32, formData.primaryColor, 'center', '900');
        } else if (appMode === 'milestone') {
            const py = splitY + 40; drawPremiumGlassBox(100, py, W - 200, 240, 24, 1, formData.primaryColor);
            drawResponsiveText(formData.milestoneOccasion, W/2, py + 55, W-250, 35, '#ffffff', 'center', 'bold'); drawResponsiveText(formData.milestoneNumber, W/2, py + 140, W-250, 90, formData.primaryColor, 'center', 'bold'); drawResponsiveText(formData.milestoneName, W/2, py + 210, W-250, 50, '#ffffff', 'center', 'bold'); drawText(formData.milestoneMessage, W/2, py + 300, 28, formData.primaryColor, 'center', 'normal');
        } else if (appMode === 'scorecard') {
            drawResponsiveText(formData.team1, leftCenter, scoresY, 400, 65, '#ffffff', 'center', 'bold');
            const t1w = measureText(formData.team1Score, 60, 'bold'), t1o = measureText(formData.team1Overs, 35, 'normal'); const t1x = leftCenter - ((t1w + 15 + t1o) / 2);
            ctx.textAlign = 'left'; ctx.font = `bold 60px "Hind Siliguri", sans-serif`; ctx.fillStyle = formData.primaryColor; ctx.fillText(formData.team1Score, t1x, scoresY + 80); ctx.font = `normal 35px "Hind Siliguri", sans-serif`; ctx.fillStyle = '#ffffff'; ctx.fillText(formData.team1Overs, t1x + t1w + 15, scoresY + 80);
            ctx.beginPath(); ctx.moveTo(W/2, scoresY-20); ctx.lineTo(W/2, scoresY+100); ctx.lineWidth=4; ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.stroke();
            
            drawResponsiveText(formData.team2, rightCenter, scoresY, 400, 65, '#ffffff', 'center', 'bold');
            const t2w = measureText(formData.team2Score, 60, 'bold'), t2o = measureText(formData.team2Overs, 35, 'normal'); const t2x = rightCenter - ((t2w + 15 + t2o) / 2);
            ctx.textAlign = 'left'; ctx.font = `bold 60px "Hind Siliguri", sans-serif`; ctx.fillStyle = formData.primaryColor; ctx.fillText(formData.team2Score, t2x, scoresY + 80); ctx.font = `normal 35px "Hind Siliguri", sans-serif`; ctx.fillStyle = '#ffffff'; ctx.fillText(formData.team2Overs, t2x + t2w + 15, scoresY + 80);
            drawResponsiveText(formData.result, W / 2, scoresY + 180, 900, 45, formData.primaryColor, 'center', 'bold');
        } else if (appMode === 'schedule') {
            drawResponsiveText(formData.team1, leftCenter - 20, scoresY + 40, 380, 80, '#ffffff', 'center', 'bold'); ctx.beginPath(); ctx.arc(W/2, scoresY+30, 50, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = formData.primaryColor; ctx.stroke(); drawText("VS", W/2, scoresY+45, 40, formData.primaryColor, 'center', 'bold'); drawResponsiveText(formData.team2, rightCenter + 20, scoresY + 40, 380, 80, '#ffffff', 'center', 'bold');
            const dy = scoresY + 130; drawPremiumGlassBox((W-700)/2, dy, 700, 100, 20, 1); drawResponsiveText(formData.matchDate, W/2, dy+45, 650, 40, formData.primaryColor, 'center', 'bold'); drawResponsiveText(`${formData.matchTime} | ${formData.matchVenue}`, W/2, dy+85, 650, 30, '#ffffff', 'center', 'normal');
        } else if (appMode === 'player') {
            const py = scoresY - 20; drawResponsiveText(formData.playerStatMain, W/2, py + 40, 800, 130, formData.primaryColor, 'center', 'bold'); drawResponsiveText(formData.playerStatSub, W/2, py + 90, 800, 40, '#ffffff', 'center', 'normal'); ctx.beginPath(); ctx.moveTo(W/2-150, py+120); ctx.lineTo(W/2+150, py+120); ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=2; ctx.stroke(); drawResponsiveText(formData.playerName, W/2, py + 180, 800, 60, formData.primaryColor, 'center', 'bold');
        } else if (appMode === 'career') {
            const py = splitY + 40; drawSmartText(formData.playerName, W/2, py, 800, 70, 60, 35, formData.primaryColor, 'center', 'bold'); drawText(formData.playerRole, W/2, py + 45, 22, '#ffffff', 'center', 'bold'); ctx.beginPath(); ctx.moveTo(W/2-250, py+65); ctx.lineTo(W/2+250, py+65); ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=2; ctx.stroke();
            const boxW = 400; const boxH = 90; const gap = 15; const leftX = W/2 - boxW - gap/2; const rightX = W/2 + gap/2; const topY = py + 85; const midY = topY + boxH + gap; const botY = midY + boxH + gap;
            const drawStatBox = (label, val, x, y) => { drawPremiumGlassBox(x, y, boxW, boxH, 15, 1, formData.primaryColor); drawText(label, x + boxW/2, y + 35, 20, '#ffffff', 'center', 'bold'); drawResponsiveText(val, x + boxW/2, y + 75, 380, 45, formData.primaryColor, 'center', 'bold'); };
            drawStatBox("ম্যাচ (MATCHES)", formData.careerMatches, leftX, topY); drawStatBox("রান (RUNS)", formData.careerRuns, rightX, topY); drawStatBox("সেঞ্চুরি (100s)", formData.careerHundreds, leftX, midY); drawStatBox("ফিফটি (50s)", formData.careerFifties, rightX, midY); drawStatBox("সর্বোচ্চ (BEST SCORE)", formData.careerBest, leftX, botY); drawStatBox("উইকেট (WICKETS)", formData.careerWickets, rightX, botY);
        } else if (appMode === 'news') {
            const h = H * formData.newsGradientHeight; const nsy = H - h; const csy = nsy + 60; const nw = 880;
            ctx.fillStyle = '#000000'; drawRoundedRect(W/2 - 150, csy - 90, 300, 55, 10); drawText("ব্রেকিং নিউজ", W/2, csy - 48, 36, formData.primaryColor, 'center', 'bold');
            ctx.font = "140px serif"; ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.textAlign = "center"; ctx.fillText("❝", W/2, csy + 30);
            const authorZoneH = 120; const safeBottomY = footerY - authorZoneH; const textStartY = csy + 110; const newsBoxH = Math.max(100, safeBottomY - textStartY); 
            drawSmartText(formData.quoteText, W/2, textStartY + (newsBoxH/2), nw, newsBoxH, 55, 20, formData.primaryColor, 'center', 'bold');
            const ay = footerY - 90; ctx.beginPath(); ctx.moveTo(W/2 - 120, ay); ctx.lineTo(W/2 + 120, ay); ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 5; ctx.stroke(); drawResponsiveText(formData.quoteAuthor, W/2, ay + 60, 900, 38, '#ffffff', 'center', 'bold');
        } else if (appMode === 'statement') {
            const sy = 750; ctx.save(); ctx.globalAlpha = 1.0; 
            const grad = ctx.createLinearGradient(0, sy, 0, H); grad.addColorStop(0, 'transparent'); grad.addColorStop(0.2, formData.secondaryColor); grad.addColorStop(1, formData.secondaryColor); 
            ctx.fillStyle = grad; ctx.fillRect(0, sy - 150, W, H - sy + 150); ctx.fillStyle = formData.primaryColor; ctx.fillRect(0, sy - 10, W, 10);
            const cx = W / 2, cy = sy; const r = 160; ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.closePath(); ctx.fillStyle = formData.secondaryColor; ctx.fill(); ctx.clip();
            if (assets.avatarImage) { ctx.translate(cx - r + positions.avatarPos.x, cy - r + positions.avatarPos.y); ctx.scale(positions.avatarPos.scale, positions.avatarPos.scale); ctx.drawImage(assets.avatarImage, 0, 0); } else { drawText("Upload Avatar", cx, cy + 10, 30, "#ffffff", "center", "bold"); }
            ctx.restore(); ctx.lineWidth = 12; ctx.strokeStyle = formData.primaryColor; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            const quoteBoxH = 250; drawSmartText(`“${formData.quoteText}”`, W/2, sy + r + 130, 960, quoteBoxH, 55, 24, formData.primaryColor, 'center', 'bold');
            const authorY = sy + r + quoteBoxH + 60; drawResponsiveText(`— ${formData.quoteAuthor}`, W/2, authorY, 900, 45, '#ffffff', 'center', 'bold'); ctx.beginPath(); ctx.moveTo(W/2 - 250, authorY + 40); ctx.lineTo(W/2 + 250, authorY + 40); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        } else if (appMode === 'discussion') {
            const totalAvailableH = H - footerH - 120; const centerY = H / 2; const topicBoxH = totalAvailableH * 0.3; const topicY = centerY - (totalAvailableH/2) + (topicBoxH/2);
            drawText("DISCUSSION", W/2, topicY - (topicBoxH/2), 26, formData.primaryColor, 'center', 'bold'); ctx.beginPath(); ctx.moveTo(W/2 - 40, topicY - (topicBoxH/2) + 25); ctx.lineTo(W/2 + 40, topicY - (topicBoxH/2) + 25); ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 4; ctx.stroke();
            drawSmartText(formData.discTopic, W/2, topicY + 20, 950, topicBoxH - 40, 130, 40, formData.primaryColor, 'center', '900');
            const divY = topicY + (topicBoxH/2) + 20; ctx.beginPath(); ctx.moveTo(W/2 - 150, divY); ctx.lineTo(W/2 + 150, divY); ctx.strokeStyle = formData.primaryColor; ctx.lineWidth = 8; ctx.stroke(); ctx.shadowColor = formData.primaryColor; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
            const linesBoxH = totalAvailableH * 0.55; const gap = linesBoxH / 3;
            drawSmartText(formData.discLine1, W/2, divY + 40 + (gap*0.5), 950, gap-20, 80, 24, '#ffffff', 'center', 'bold'); drawSmartText(formData.discLine2, W/2, divY + 40 + (gap*1.5), 950, gap-20, 80, 24, formData.primaryColor, 'center', 'bold'); drawSmartText(formData.discLine3, W/2, divY + 40 + (gap*2.5), 950, gap-20, 80, 24, '#ffffff', 'center', 'bold');
        } else if (appMode === 'multi_result') {
            const py = 120; drawPremiumGlassBox(W/2 - 350, py, 700, 80, 40, 1, formData.primaryColor);
            drawResponsiveText(formData.multiResultTitle, W/2, py + 55, 600, 45, formData.primaryColor, 'center', '900');
            const sy = py + 140; const totalH = H - footerH - sy - 40; const numItems = formData.resultsList.length || 1; const spacing = totalH / numItems; const boxH = Math.min(150, spacing * 0.85); 
            const fsTeam = Math.min(42, boxH * 0.28); const fsScore = Math.min(55, boxH * 0.4); const fsTourney = Math.min(22, boxH * 0.16);
            formData.resultsList.forEach((res, index) => {
                const y = sy + (index * spacing); const cardW = 880; const cardX = W/2 - cardW/2;
                drawPremiumGlassBox(cardX, y, cardW, boxH, 20, 1);
                ctx.fillStyle = formData.primaryColor; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(cardX, y, 12, boxH, [20, 0, 0, 20]); ctx.fill(); } else { ctx.fillRect(cardX, y, 12, boxH); }
                ctx.fillStyle = formData.primaryColor; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(cardX + cardW - 12, y, 12, boxH, [0, 20, 20, 0]); ctx.fill(); } else { ctx.fillRect(cardX + cardW - 12, y, 12, boxH); }
                const scorePillW = 220; ctx.fillStyle = 'rgba(0,0,0,0.5)'; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(W/2 - scorePillW/2, y + 15, scorePillW, boxH - 30, 15); ctx.fill(); } else { ctx.fillRect(W/2 - scorePillW/2, y + 15, scorePillW, boxH - 30); }
                drawResponsiveText(res.score1, W/2 - 50, y + boxH/2 + fsScore*0.35, 60, fsScore, formData.primaryColor, 'center', '900'); drawText("-", W/2, y + boxH/2 + fsScore*0.3, fsScore*0.8, 'rgba(255,255,255,0.5)', 'center', '900'); drawResponsiveText(res.score2, W/2 + 50, y + boxH/2 + fsScore*0.35, 60, fsScore, formData.primaryColor, 'center', '900');
                drawResponsiveText(res.team1, W/2 - scorePillW/2 - 30, y + boxH/2 + fsTeam*0.35, 260, fsTeam, '#ffffff', 'right', 'bold'); drawResponsiveText(res.team2, W/2 + scorePillW/2 + 30, y + boxH/2 + fsTeam*0.35, 260, fsTeam, '#ffffff', 'left', 'bold');
                ctx.fillStyle = formData.primaryColor; ctx.font = `bold ${fsTourney}px "Hind Siliguri", sans-serif`; const tw = ctx.measureText(res.tourney).width + 60; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(W/2 - tw/2, y - 14, tw, 28, 14); ctx.fill(); } else { ctx.fillRect(W/2 - tw/2, y - 14, tw, 28); } drawResponsiveText(res.tourney, W/2, y + 6, tw - 20, fsTourney, '#000000', 'center', 'bold');
            });
        } else if (appMode === 'multi_schedule') {
            const py = 120; drawPremiumGlassBox(W/2 - 250, py, 500, 60, 30, 1);
            drawResponsiveText(formData.multiScheduleDate, W/2, py + 42, 450, 35, formData.primaryColor, 'center', 'bold'); drawResponsiveText(formData.multiScheduleTitle, W/2, py + 140, 900, 70, formData.primaryColor, 'center', 'bold'); ctx.beginPath(); ctx.moveTo(60, py + 180); ctx.lineTo(W - 60, py + 180); ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth=4; ctx.stroke();
            const sy = py + 220; const totalH = H - footerH - sy - 30; const numItems = formData.scheduleList.length || 1; const rows = Math.ceil(numItems / 2); const spacing = totalH / rows; const boxH = Math.min(180, spacing * 0.85); const colW = 460;
            const fsSport = Math.min(24, boxH * 0.13); const fsTourney = Math.min(26, boxH * 0.14); const fsMatch = Math.min(38, boxH * 0.21); const fsTime = Math.min(28, boxH * 0.15);
            formData.scheduleList.forEach((sch, index) => {
                const col = index % 2; const row = Math.floor(index / 2); const cx = col === 0 ? W/2 - colW - 20 : W/2 + 20; const y = sy + (row * spacing);
                drawPremiumGlassBox(cx, y, colW, boxH, 20, 1);
                ctx.fillStyle = formData.primaryColor; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(cx, y, 12, boxH, [20, 0, 0, 20]); ctx.fill(); } else { ctx.fillRect(cx, y, 12, boxH); }
                ctx.fillStyle = 'rgba(0,0,0,0.5)'; if(ctx.roundRect) { ctx.beginPath(); ctx.roundRect(cx + 30, y + (boxH*0.1), 120, boxH*0.18, 8); ctx.fill(); } else { ctx.fillRect(cx + 30, y + (boxH*0.1), 120, boxH*0.18); }
                drawResponsiveText(sch.sport, cx + 90, y + (boxH*0.23), 100, fsSport, formData.primaryColor, 'center', 'bold'); ctx.textAlign = 'right'; drawResponsiveText(sch.tourney, cx + colW - 25, y + (boxH*0.23), 280, fsTourney, '#ffffff', 'right', 'normal'); drawResponsiveText(sch.match, cx + colW/2, y + (boxH*0.6), colW - 60, fsMatch, formData.primaryColor, 'center', 'bold'); drawText("🕒 " + sch.time, cx + colW/2, y + (boxH*0.85), fsTime, '#ffffff', 'center', 'bold');
            });
        }
        
        // 4. Draw Branding & Footer
        if (appMode !== 't_fixture') {
            ctx.fillStyle = formData.secondaryColor; ctx.fillRect(0, footerY, W, footerH); 
            drawText(formData.footerHandle, W / 2, footerY + 40, 24, '#ffffff', 'center', 'bold');
        }

        ctx.save(); ctx.font = 'bold 30px "Hind Siliguri", sans-serif'; const fwText = ctx.measureText(formData.badgeText).width; const pillW = fwText + 90; const pillX = W - pillW - 40; const pillY = 40;
        drawPremiumGlassBox(pillX, pillY, pillW, 60, 30, 1, formData.primaryColor);
        drawFBIcon(pillX + 30, pillY + 30, 40); drawText(formData.badgeText, pillX + 65, pillY + 41, 30, '#fff', 'left', 'bold'); ctx.restore();

        if (!isExport) {
            ctx.save(); ctx.translate(W/2, H/2); ctx.rotate(-Math.PI / 6);
            ctx.font = "bold 150px sans-serif"; ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; ctx.textAlign = "center"; ctx.fillText("PREVIEW", 0, 0); ctx.restore();
        }
    } catch(e) { console.error(e); }
};
