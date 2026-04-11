const { useState, useEffect, useRef } = React;

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztp3j5Kh1tmcMcQpXfgNp9mhYQRchm2iSB-fPAk-V5ikDcXHcJlmVJ-yb93iIiycJ7/exec"; 
const DOWNLOAD_COST = 5; 

function App() {
    const canvasRef = useRef(null);
    
    // --- STATE MANAGEMENT ---
    const [currentView, setCurrentView] = useState('home'); 
    const [appMode, setAppMode] = useState('h2h_3v3'); // Temporarily load the new tool by default for testing
    const [activeTab, setActiveTab] = useState('match');
    
    // Global Images
    const [bgImage, setBgImage] = useState(null);
    const [bgImage2, setBgImage2] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const [img1Pos, setImg1Pos] = useState({ x: 0, y: 0, scale: 1 });
    const [img2Pos, setImg2Pos] = useState({ x: 0, y: 0, scale: 1 });
    const [avatarPos, setAvatarPos] = useState({ x: 0, y: 0, scale: 1 });

    // ---> NEW 3V3 CLASH IMAGES STATE <---
    const [clashImages, setClashImages] = useState({
        t1p1: null, t1p2: null, t1p3: null,
        t2p1: null, t2p2: null, t2p3: null
    });
    
    // We default scale to a generic 300x400 cutout size
    const defaultClashScale = { x: 0, y: 0, scale: 1 };
    const [clashPos, setClashPos] = useState({
        t1p1: {...defaultClashScale}, t1p2: {...defaultClashScale}, t1p3: {...defaultClashScale},
        t2p1: {...defaultClashScale}, t2p2: {...defaultClashScale}, t2p3: {...defaultClashScale}
    });
    
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    
    const [userId, setUserId] = useState('');
    const [points, setPoints] = useState(0);
    const [isCheckingPoints, setIsCheckingPoints] = useState(true);
    
    const [appNotification, setAppNotification] = useState(null);
    const [showAppNotification, setShowAppNotification] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    // Pull defaults from config.js
    const [formData, setFormData] = useState(window.AppDefaultFormData);

    // --- INITIALIZATION ---
    useEffect(() => {
        let storedId = localStorage.getItem('poster_user_id');
        if (!storedId) { storedId = 'u_' + Math.random().toString(36).substr(2, 9); localStorage.setItem('poster_user_id', storedId); }
        setUserId(storedId); fetchPoints(storedId);

        const img = new Image(); img.crossOrigin = "Anonymous"; img.src = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1080&auto=format&fit=crop";
        img.onload = () => { 
            setBgImage(img); 
            const scale = Math.max(1080 / img.width, 1200 / img.height);
            setImg1Pos({ x: (1080 - img.width * scale) / 2, y: (1200 - img.height * scale) / 2, scale }); 
        };
    }, []);

    // --- USER & POINTS ---
    const fetchPoints = async (uid) => {
        if(GOOGLE_SCRIPT_URL.includes("xxxxxxxx")) { setPoints(0); setIsCheckingPoints(false); return; }
        setIsCheckingPoints(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=check&userId=${uid}`);
            const data = await response.json();
            if (data.status === 'success') {
                setPoints(Number(data.points) || 0);
                if (data.notification && data.notification.status === 'ON') {
                    const msgId = data.notification.title + data.notification.message;
                    if (localStorage.getItem('dismissed_notification') !== msgId) {
                        setAppNotification(data.notification);
                        setShowAppNotification(true);
                    }
                }
            }
        } catch (error) { console.error("Fetch Error:", error); setPoints(0); }
        setIsCheckingPoints(false);
    };

    const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 3000); };
    const copyId = () => { navigator.clipboard.writeText(userId); showToast("Account ID copied to clipboard!"); };

    // --- FORM ACTIONS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const swapTeams = () => setFormData(p => ({ ...p, team1: p.team2, team1Score: p.team2Score, team1Overs: p.team2Overs, team1Color: p.team2Color, team2: p.team1, team2Score: p.team1Score, team2Overs: p.team1Overs, team2Color: p.team1Color, pollPlayer1: p.pollPlayer2, pollPlayer2: p.pollPlayer1 }));
    
    // Array Handlers
    const handleResultChange = (id, field, value) => { setFormData(p => ({ ...p, resultsList: p.resultsList.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const addResult = () => { setFormData(p => ({ ...p, resultsList: [...p.resultsList, { id: Date.now(), team1: 'দল ১', team2: 'দল ২', score1: '০', score2: '০', tourney: 'টুর্নামেন্ট' }] })); };
    const removeResult = (id) => { setFormData(p => ({ ...p, resultsList: p.resultsList.filter(item => item.id !== id) })); };

    const handleScheduleChange = (id, field, value) => { setFormData(p => ({ ...p, scheduleList: p.scheduleList.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const addSchedule = () => { setFormData(p => ({ ...p, scheduleList: [...p.scheduleList, { id: Date.now(), sport: 'খেলা', tourney: 'টুর্নামেন্ট', match: 'দল বনাম দল', time: 'সময়' }] })); };
    const removeSchedule = (id) => { setFormData(p => ({ ...p, scheduleList: p.scheduleList.filter(item => item.id !== id) })); };

    const handleMatchupChange = (id, field, value) => { setFormData(p => ({ ...p, matchupList: p.matchupList.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const addMatchup = () => { setFormData(p => ({ ...p, matchupList: [...p.matchupList, { id: Date.now(), date: 'তারিখ', t1: 'দল ১', t1Sub: 'স্থান', t2: 'দল ২', t2Sub: 'স্থান' }] })); };
    const removeMatchup = (id) => { setFormData(p => ({ ...p, matchupList: p.matchupList.filter(item => item.id !== id) })); };

    // --- CANVAS ROUTER ---
    const drawCanvas = () => {
        const canvas = canvasRef.current; 
        if (!canvas || !window.PosterRenderer) return;
        
        canvas.width = 1080; canvas.height = 1200;
        
        // Pass everything to the Renderer, including the new clash states
        window.PosterRenderer(
            canvas.getContext('2d'), 1080, 1200, appMode, formData, 
            { bgImage, bgImage2, avatarImage, clashImages }, 
            { img1Pos, img2Pos, avatarPos, clashPos }, false
        );
    };

    useEffect(() => { drawCanvas(); }, [bgImage, bgImage2, formData, img1Pos, img2Pos, avatarPos, avatarImage, clashImages, clashPos, appMode, currentView]);

    // --- IMAGE UPLOADS & RESET ---
    const handleImageUpload = (e, isSecond = false) => {
        const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                if (isSecond) {
                    setBgImage2(img); 
                    const tW = appMode === 'f_scorecard' ? 360 : 540; const tH = appMode === 'f_scorecard' ? 360 : 1200;
                    const scale2 = Math.max(tW / img.width, tH / img.height);
                    setImg2Pos({ x: (appMode === 'f_scorecard' ? 0 : 540) + (tW - img.width * scale2) / 2, y: (tH - img.height * scale2) / 2, scale: scale2 });
                } else {
                    setBgImage(img); 
                    const tW = (bgImage2 && appMode !== 'f_scorecard') ? 540 : 1080; const scale1 = Math.max(tW / img.width, 1200 / img.height);
                    setImg1Pos({ x: (tW - img.width * scale1) / 2, y: (1200 - img.height * scale1) / 2, scale: scale1 });
                }
            }; img.src = ev.target.result;
        }; reader.readAsDataURL(file);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image(); img.onload = () => {
                setAvatarImage(img); const scale = Math.max(320 / img.width, 320 / img.height);
                setAvatarPos({ x: (320 - img.width * scale) / 2, y: (320 - img.height * scale) / 2, scale });
            }; img.src = ev.target.result;
        }; reader.readAsDataURL(file);
    };

    // ---> NEW 3V3 CLASH UPLOAD HANDLER <---
    const handleClashUpload = (e, slotId) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                setClashImages(prev => ({ ...prev, [slotId]: img }));
                // We use a generic cutout size of 300x400 for the math calculations later
                const scale = Math.max(300 / img.width, 400 / img.height);
                setClashPos(prev => ({ 
                    ...prev, 
                    [slotId]: { x: (300 - img.width * scale) / 2, y: (400 - img.height * scale) / 2, scale }
                }));
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    const resetImagePositions = () => { 
        if (bgImage) { const tW = (bgImage2 && appMode !== 'f_scorecard') ? 540 : 1080; const scale1 = Math.max(tW / bgImage.width, 1200 / bgImage.height); setImg1Pos({ x: (tW - bgImage.width * scale1) / 2, y: (1200 - bgImage.height * scale1) / 2, scale: scale1 }); }
        if (bgImage2) { const tW = appMode === 'f_scorecard' ? 360 : 540; const tH = appMode === 'f_scorecard' ? 360 : 1200; const scale2 = Math.max(tW / bgImage2.width, tH / bgImage2.height); setImg2Pos({ x: (appMode === 'f_scorecard' ? 0 : 540) + (tW - bgImage2.width * scale2) / 2, y: (tH - bgImage2.height * scale2) / 2, scale: scale2 }); }
        if (avatarImage) { const scale3 = Math.max(320 / avatarImage.width, 320 / avatarImage.height); setAvatarPos({ x: (320 - avatarImage.width * scale3) / 2, y: (320 - avatarImage.height * scale3) / 2, scale: scale3 }); }
    };

    // --- HIGH RES EXPORT ---
    const handleDownloadClick = async () => {
        if (isProcessing) return; 
        if (points < DOWNLOAD_COST) { setShowBuyModal(true); return; }
        setIsProcessing(true);

        if(GOOGLE_SCRIPT_URL.includes("xxxxxxxx")) { 
            performHighResDownload(); setPoints(prev => prev - DOWNLOAD_COST); setIsProcessing(false); return; 
        }

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=deduct&userId=${userId}&amount=${DOWNLOAD_COST}`);
            const data = await response.json();
            if (data.status === 'success') { setPoints(data.points); performHighResDownload(); } 
            else { showToast("Insufficient points to export!"); }
        } catch (error) { showToast("Network Error."); }
        setIsProcessing(false);
    };

    const performHighResDownload = () => {
        const SCALE = 4; const W = 1080; const H = 1200;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = W * SCALE; exportCanvas.height = H * SCALE;
        const ctx = exportCanvas.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.scale(SCALE, SCALE);
        
        window.PosterRenderer(ctx, W, H, appMode, formData, { bgImage, bgImage2, avatarImage, clashImages }, { img1Pos, img2Pos, avatarPos, clashPos }, true);

        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.download = `PosterBot_8K_${Date.now()}.png`; link.href = url;
            document.body.appendChild(link); link.click();
            setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); showToast("8K Graphic downloaded successfully!"); }, 100);
        }, 'image/png', 1.0);
    };

    return (
        <div className="flex flex-col min-h-screen text-slate-200 selection:bg-rose-500/30 selection:text-white" onContextMenu={(e) => e.preventDefault()}>
            
            <window.Modals 
                toastMsg={toastMsg}
                showAppNotification={showAppNotification}
                appNotification={appNotification}
                onDismissNotification={() => {
                    localStorage.setItem('dismissed_notification', appNotification.title + appNotification.message);
                    setShowAppNotification(false);
                }}
                showBuyModal={showBuyModal}
                onCloseBuyModal={() => setShowBuyModal(false)}
                points={points}
                downloadCost={DOWNLOAD_COST}
                userId={userId}
                onCopyId={copyId}
                onRefreshPoints={() => fetchPoints(userId)}
            />

            <window.Header 
                currentView={currentView}
                appMode={appMode}
                points={points}
                isCheckingPoints={isCheckingPoints}
                isProcessing={isProcessing}
                onBuyClick={() => setShowBuyModal(true)}
                onBack={() => setCurrentView('home')}
                onExport={handleDownloadClick}
            />

            <main className="flex-1 w-full p-4 md:p-6 max-w-7xl mx-auto">
                {currentView === 'home' ? (
                    <window.ToolGrid 
                        onSelectTool={(toolId) => { 
                            setAppMode(toolId); setActiveTab('match'); setCurrentView('editor'); window.scrollTo(0,0); 
                        }} 
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animation-slideUpFade">
                        
                        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
                            <div className="flex gap-2 overflow-x-auto custom-scroll pb-2 px-1">
                                {window.AppCategories.flatMap(c=>c.tools).map(toolConfig => (
                                    <button key={toolConfig.id} onClick={() => setAppMode(toolConfig.id)} className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${appMode === toolConfig.id ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800/50'}`}>
                                        {toolConfig.name}
                                    </button>
                                ))}
                            </div>

                            <window.CanvasPreview 
                                canvasRef={canvasRef}
                                appMode={appMode}
                                hasBgImage={!!bgImage}
                                hasBgImage2={!!bgImage2}
                                hasAvatar={!!avatarImage}
                                img1Pos={img1Pos} setImg1Pos={setImg1Pos}
                                img2Pos={img2Pos} setImg2Pos={setImg2Pos}
                                avatarPos={avatarPos} setAvatarPos={setAvatarPos}
                                // Pass down clash state for interaction tracking later
                                clashImages={clashImages}
                                clashPos={clashPos} setClashPos={setClashPos}
                                onReset={resetImagePositions}
                            />
                            
                            {/* Standard Image Transform Controls */}
                            {bgImage && appMode !== 'discussion' && appMode !== 't_fixture' && appMode !== 'h2h_3v3' && (
                                <div className="bg-slate-900 p-5 rounded-3xl shadow-xl border border-slate-800 flex flex-col gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 w-16 flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">Img 1 <window.AppIcons.Move className="w-3 h-3 text-rose-500"/></span>
                                        <window.AppIcons.ZoomIn className="text-slate-500" />
                                        <input type="range" min="0.1" max="5" step="0.05" value={img1Pos.scale} onChange={(e) => setImg1Pos(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full flex-1" />
                                    </div>
                                    {bgImage2 && appMode !== 'statement' && appMode !== 'squad' && (
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 w-16 flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">Img 2 <window.AppIcons.Move className="w-3 h-3 text-blue-500"/></span>
                                            <window.AppIcons.ZoomIn className="text-slate-500" />
                                            <input type="range" min="0.1" max="5" step="0.05" value={img2Pos.scale} onChange={(e) => setImg2Pos(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full flex-1" />
                                        </div>
                                    )}
                                    {avatarImage && appMode === 'statement' && (
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 w-16 flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">Avatar <window.AppIcons.Move className="w-3 h-3 text-amber-500"/></span>
                                            <window.AppIcons.ZoomIn className="text-slate-500" />
                                            <input type="range" min="0.1" max="5" step="0.05" value={avatarPos.scale} onChange={(e) => setAvatarPos(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full flex-1" />
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-full">
                            <window.EditorSidebar 
                                formData={formData}
                                appMode={appMode}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onChange={handleChange}
                                onImageUpload={handleImageUpload}
                                onAvatarUpload={handleAvatarUpload}
                                // Pass down new clash handlers
                                clashImages={clashImages}
                                onClashUpload={handleClashUpload}
                                hasBgImage2={!!bgImage2}
                                hasAvatarImage={!!avatarImage}
                                onRemoveAvatar={() => setAvatarImage(null)}
                                onRemoveBgImage2={() => setBgImage2(null)}
                                swapTeams={swapTeams}
                                addMatchup={addMatchup} removeMatchup={removeMatchup} handleMatchupChange={handleMatchupChange}
                                addResult={addResult} removeResult={removeResult} handleResultChange={handleResultChange}
                                addSchedule={addSchedule} removeSchedule={removeSchedule} handleScheduleChange={handleScheduleChange}
                            />
                        </div>

                    </div>
                )}
            </main>

            <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-900 mt-auto z-10 relative">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-slate-900 p-3 rounded-2xl shadow-inner border border-slate-800"><window.AppIcons.Logo className="text-slate-600 w-6 h-6" /></div>
                    </div>
                    <p className="text-sm font-bold text-slate-300 tracking-wide">© {new Date().getFullYear()} Poster Bot Pro</p>
                    <p className="text-xs font-medium text-slate-600 max-w-sm mx-auto">Premium sports graphic generator for professional creators.</p>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
