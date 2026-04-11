// --- HEADER COMPONENT ---
// Handles top navigation, branding, points display, and the export button.

window.Header = function(props) {
    // FIX: Correctly map the exact icon names from config.js to the names used in this component
    const { 
        ArrowLeft: IconArrowLeft, 
        Logo: IconLogo, 
        Coin: IconCoin, 
        Download: IconDownload 
    } = window.AppIcons;
    
    // Dynamically find the name of the currently active tool to display in the header
    const activeToolName = props.currentView === 'editor' 
        ? window.AppCategories.flatMap(c => c.tools).find(t => t.id === props.appMode)?.name || 'Editor'
        : 'Poster Bot';

    return (
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30 px-4 py-3 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* --- Left Side: Branding & Back Button --- */}
                <div className="flex items-center gap-3">
                    {props.currentView === 'editor' ? (
                        <button 
                            onClick={props.onBack} 
                            className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center shadow-inner" 
                            title="Back to Dashboard"
                        >
                            <IconArrowLeft />
                        </button>
                    ) : (
                        <div className="bg-gradient-to-tr from-rose-600 to-rose-400 p-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center">
                            <IconLogo className="text-white w-5 h-5" />
                        </div>
                    )}
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-black text-white tracking-tight leading-none">
                            {activeToolName} <span className="text-rose-500">PRO</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {props.currentView === 'editor' ? 'Editor Studio' : 'Studio'}
                        </p>
                    </div>
                </div>

                {/* --- Right Side: Points & Export Action --- */}
                <div className="flex items-center gap-4">
                    
                    {/* Points Pill */}
                    <div 
                        className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-inner" 
                        onClick={props.onBuyClick}
                    >
                        <IconCoin />
                        {props.isCheckingPoints ? (
                            <div className="loader"></div>
                        ) : (
                            <span className="text-sm font-bold text-amber-400">{props.points}</span>
                        )}
                    </div>
                    
                    {/* Export Button (Only visible in Editor mode) */}
                    {props.currentView === 'editor' && (
                        <button 
                            onClick={props.onExport} 
                            disabled={props.isProcessing} 
                            className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
                        >
                            {props.isProcessing ? 'Processing...' : <><IconDownload /> 8K Export</>}
                        </button>
                    )}
                </div>
                
            </div>
        </header>
    );
};
