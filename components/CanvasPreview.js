// --- CANVAS PREVIEW COMPONENT ---
// Handles the HTML5 Canvas wrapper, mouse/touch dragging, and pinch-to-zoom math.

window.CanvasPreview = function(props) {
    const { useRef } = React;
    const { IconRefresh } = window.AppIcons;
    
    // We keep the gesture tracking internal to this component!
    const gestureStart = useRef({ mode: null, target: null, x: 0, y: 0, dist: 0, scale: 1, imgX: 0, imgY: 0 });

    // --- INTERACTION HANDLERS ---
    const handleTouchStart = (e) => { 
        if (props.appMode === 't_fixture') return; 
        const t = e.touches; const rect = e.target.getBoundingClientRect(); 
        const touchX = t[0].clientX - rect.left; const touchY = t[0].clientY - rect.top;
        
        let targetImg = 'img1'; 
        const s = 1080 / rect.width;
        const canvasX = touchX * s; const canvasY = touchY * s;

        if (props.appMode === 'statement' && props.hasAvatar && Math.hypot(canvasX - 1080/2, canvasY - 750) < 160) {
            targetImg = 'avatar';
        } else if (props.appMode === 'f_scorecard' && props.hasBgImage2 && Math.hypot(canvasX - 830, canvasY - 360) < 180) {
            targetImg = 'img2';
        } else if (props.hasBgImage2 && touchX > rect.width / 2 && props.appMode !== 'statement' && props.appMode !== 'f_scorecard') {
            targetImg = 'img2';
        }
        
        const currentPos = targetImg === 'img1' ? props.img1Pos : (targetImg === 'img2' ? props.img2Pos : props.avatarPos);
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
        const setPos = target === 'img1' ? props.setImg1Pos : (target === 'img2' ? props.setImg2Pos : props.setAvatarPos);
        
        if (t.length === 1 && gestureStart.current.mode === 'pan') { 
            setPos(prev => ({ ...prev, x: imgX + (t[0].clientX - x) * s, y: imgY + (t[0].clientY - y) * s })); 
        } else if (t.length === 2 && gestureStart.current.mode === 'zoom') { 
            const d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); 
            setPos(prev => ({ ...prev, scale: scale * (d / dist) })); 
        } 
    };

    const handleMouseDown = (e) => {
        if (props.appMode === 't_fixture') return;
        const rect = e.target.getBoundingClientRect(); 
        const touchX = e.clientX - rect.left; const touchY = e.clientY - rect.top;
        
        let targetImg = 'img1'; 
        const s = 1080 / rect.width;
        const canvasX = touchX * s; const canvasY = touchY * s;

        if (props.appMode === 'statement' && props.hasAvatar && Math.hypot(canvasX - 1080/2, canvasY - 750) < 160) {
            targetImg = 'avatar';
        } else if (props.appMode === 'f_scorecard' && props.hasBgImage2 && Math.hypot(canvasX - 830, canvasY - 360) < 180) {
            targetImg = 'img2';
        } else if (props.hasBgImage2 && touchX > rect.width / 2 && props.appMode !== 'statement' && props.appMode !== 'f_scorecard') {
            targetImg = 'img2';
        }
        
        const currentPos = targetImg === 'img1' ? props.img1Pos : (targetImg === 'img2' ? props.img2Pos : props.avatarPos);
        gestureStart.current = { mode: 'pan', target: targetImg, x: e.clientX, y: e.clientY, imgX: currentPos.x, imgY: currentPos.y };
    };

    const handleMouseMove = (e) => {
        if (gestureStart.current.mode === 'pan') {
            const s = 1080 / e.target.getBoundingClientRect().width; 
            const { target, imgX, x, imgY, y } = gestureStart.current;
            const setPos = target === 'img1' ? props.setImg1Pos : (target === 'img2' ? props.setImg2Pos : props.setAvatarPos);
            setPos(p => ({...p, x: imgX + (e.clientX - x) * s, y: imgY + (e.clientY - y) * s}));
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
            {!props.hasBgImage && props.appMode !== 'discussion' && props.appMode !== 'squad' && props.appMode !== 't_fixture' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
                    <span className="bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-3">
                        <div className="loader border-t-rose-500 border-white/20"></div> Initializing Canvas...
                    </span>
                </div>
            )}
        </div>
    );
};
