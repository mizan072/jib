// --- CANVAS PREVIEW COMPONENT ---
// Handles the HTML5 Canvas wrapper, mouse/touch dragging, and pinch-to-zoom math.

window.CanvasPreview = function(props) {
    const { useRef } = React;
    
    // FIX: Correctly map the exact icon names from config.js
    const { Refresh: IconRefresh } = window.AppIcons;
    
    // We keep the gesture tracking internal to this component!
    const gestureStart = useRef({ mode: null, target: null, x: 0, y: 0, dist: 0, scale: 1, imgX: 0, imgY: 0 });

    // Helper to dynamically get the right coordinate state
    const getTargetPos = (target) => {
        if (['t1p1','t1p2','t1p3','t2p1','t2p2','t2p3'].includes(target)) return props.clashPos[target];
        if (target === 'img2') return props.img2Pos;
        if (target === 'avatar') return props.avatarPos;
        return props.img1Pos;
    };

    // Helper to dynamically update the right coordinate state
    const updateTargetPos = (target, newVals) => {
        if (['t1p1','t1p2','t1p3','t2p1','t2p2','t2p3'].includes(target)) {
            props.setClashPos(prev => ({ ...prev, [target]: { ...prev[target], ...newVals } }));
        } else if (target === 'img2') {
            props.setImg2Pos(prev => ({ ...prev, ...newVals }));
        } else if (target === 'avatar') {
            props.setAvatarPos(prev => ({ ...prev, ...newVals }));
        } else {
            props.setImg1Pos(prev => ({ ...prev, ...newVals }));
        }
    };

    // Helper to detect which image the user is clicking on based on canvas math
    const detectTarget = (touchX, touchY, rectWidth) => {
        let targetImg = 'img1'; 
        const s = 1080 / rectWidth;
        const canvasX = touchX * s; const canvasY = touchY * s;

        if (props.appMode === 'h2h_3v3') {
            const cW = 260, cH = 450, cY = 300, W = 1080;
            // Hit boxes for the 6 players (front to back)
            const hits = [
                { id: 't1p1', x: 230, y: cY }, { id: 't2p1', x: W-230-cW, y: cY },
                { id: 't1p2', x: 130, y: cY+30 }, { id: 't2p2', x: W-130-cW, y: cY+30 },
                { id: 't1p3', x: 30, y: cY+60 }, { id: 't2p3', x: W-30-cW, y: cY+60 }
            ];
            for(let box of hits) {
                if(canvasX >= box.x && canvasX <= box.x + cW && canvasY >= box.y && canvasY <= box.y + cH) {
                    targetImg = box.id; break;
                }
            }
        } else if (props.appMode === 'statement' && props.hasAvatar && Math.hypot(canvasX - 1080/2, canvasY - 750) < 160) {
            targetImg = 'avatar';
        } else if (props.appMode === 'f_scorecard' && props.hasBgImage2 && Math.hypot(canvasX - 830, canvasY - 360) < 180) {
            targetImg = 'img2';
        } else if (props.hasBgImage2 && touchX > rectWidth / 2 && props.appMode !== 'statement' && props.appMode !== 'f_scorecard') {
            targetImg = 'img2';
        }
        return targetImg;
    };

    // --- INTERACTION HANDLERS ---
    const handleTouchStart = (e) => { 
        if (props.appMode === 't_fixture') return; 
        const t = e.touches; const rect = e.target.getBoundingClientRect(); 
        const touchX = t[0].clientX - rect.left; const touchY = t[0].clientY - rect.top;
        
        const targetImg = detectTarget(touchX, touchY, rect.width);
        const currentPos = getTargetPos(targetImg);

        if (t.length === 1) { 
            gestureStart.current = { mode: 'pan', target: targetImg, x: t[0].clientX, y: t[0].clientY, imgX: currentPos.x, imgY: currentPos.y }; 
        } else if (t.length === 2) { 
            gestureStart.current = { mode: 'zoom', target: targetImg, dist: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY), scale: currentPos.scale }; 
        } 
    };

    const handleTouchMove = (e) => { 
        if (!gestureStart.current.mode) return; e.preventDefault(); 
        const s = 1080 / e.target.getBoundingClientRect().width; const t = e.touches; 
        const { target, imgX, x, imgY, y, scale, dist } = gestureStart.current;
        
        if (t.length === 1 && gestureStart.current.mode === 'pan') { 
            updateTargetPos(target, { x: imgX + (t[0].clientX - x) * s, y: imgY + (t[0].clientY - y) * s });
        } else if (t.length === 2 && gestureStart.current.mode === 'zoom') { 
            const d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); 
            updateTargetPos(target, { scale: scale * (d / dist) });
        } 
    };

    const handleMouseDown = (e) => {
        if (props.appMode === 't_fixture') return;
        const rect = e.target.getBoundingClientRect(); 
        const touchX = e.clientX - rect.left; const touchY = e.clientY - rect.top;
        
        const targetImg = detectTarget(touchX, touchY, rect.width);
        const currentPos = getTargetPos(targetImg);
        
        gestureStart.current = { mode: 'pan', target: targetImg, x: e.clientX, y: e.clientY, imgX: currentPos.x, imgY: currentPos.y };
    };

    const handleMouseMove = (e) => {
        if (gestureStart.current.mode === 'pan') {
            const s = 1080 / e.target.getBoundingClientRect().width; 
            const { target, imgX, x, imgY, y } = gestureStart.current;
            updateTargetPos(target, { x: imgX + (e.clientX - x) * s, y: imgY + (e.clientY - y) * s });
        }
    };
    
    const handleEnd = () => { gestureStart.current.mode = null; };

    return (
        <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 aspect-[1080/1200] relative group canvas-container touch-none ring-1 ring-white/5">
            {/* The Actual HTML Canvas */}
            <canvas 
                ref={props.canvasRef} 
                className={`w-full h-full object-contain touch-none ${props.appMode === 't_fixture' || props.appMode === 'discussion' ? '' : 'cursor-move'}`} 
                onTouchStart={handleTouchStart} 
                onTouchMove={handleTouchMove} 
                onTouchEnd={handleEnd} 
                onMouseDown={handleMouseDown} 
                onMouseMove={handleMouseMove} 
                onMouseUp={handleEnd} 
                onMouseLeave={handleEnd}
            ></canvas>
            
            {/* Reset Positions Button */}
            <div className="absolute top-5 right-5 flex flex-col gap-3 z-50">
                <button 
                    onClick={props.onReset} 
                    className="bg-slate-900/60 text-white p-3 rounded-full backdrop-blur-md hover:bg-rose-600 transition-colors border border-slate-700/50 shadow-lg" 
                    title="Reset Image Positions"
                >
                    <IconRefresh />
                </button>
            </div>
            
            {/* Loading / Initialize Placeholder */}
            {!props.hasBgImage && props.appMode !== 'discussion' && props.appMode !== 'squad' && props.appMode !== 't_fixture' && props.appMode !== 'h2h_3v3' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                    <span className="bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-3">
                        <div className="loader border-t-rose-500 border-white/20"></div> Initializing Canvas...
                    </span>
                </div>
            )}
        </div>
    );
};
