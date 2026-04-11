// --- MODALS COMPONENT ---
// Handles the Toast notifications, App Announcements, and the "Get Points" purchasing modal.

window.Modals = function(props) {
    // FIX: Correctly map the exact icon names from config.js to the names used in this component
    const { Close: IconClose, Copy: IconCopy, Tg: IconTg } = window.AppIcons;

    return (
        <>
            {/* --- 1. TOAST NOTIFICATION --- */}
            {props.toastMsg && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700 font-bold text-sm flex items-center gap-3 toast-enter">
                    <span className="text-emerald-400">✓</span> {props.toastMsg}
                </div>
            )}

            {/* --- 2. APP ANNOUNCEMENT MODAL --- */}
            {props.showAppNotification && props.appNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop">
                    <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm p-8 text-center modal-content border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500"></div>
                        <button 
                            onClick={props.onDismissNotification} 
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full"
                        >
                            <IconClose />
                        </button>
                        <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-slate-700">
                            🔔
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                            {props.appNotification.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                            {props.appNotification.message}
                        </p>
                        <button 
                            onClick={props.onDismissNotification} 
                            className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* --- 3. GET PRO POINTS MODAL --- */}
            {props.showBuyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop">
                    <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm p-8 text-center modal-content border border-slate-800">
                        <div className="bg-rose-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border border-rose-500/20">
                            💎
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Get Pro Points</h3>
                        <p className="text-slate-400 text-sm mb-6 font-medium">
                            Export costs {props.downloadCost} points. Balance: <span className="text-amber-400 font-bold">{props.points}</span>
                        </p>
                        
                        <div className="bg-slate-800/50 p-5 rounded-2xl mb-6 text-sm text-slate-300 border border-slate-700/50 text-left">
                            <p className="font-bold text-white mb-3 uppercase tracking-wider text-xs">Pricing Tiers</p>
                            <ul className="space-y-2 font-medium">
                                <li className="flex justify-between"><span>100 Points</span><span className="text-white">৳100</span></li>
                                <li className="flex justify-between"><span>200 Points</span><span className="text-white">৳150</span></li>
                            </ul>
                        </div>
                        
                        <div className="bg-slate-950 p-4 rounded-2xl mb-6 text-left border border-slate-800">
                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">Your Account ID</p>
                            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
                                <code className="text-sm font-mono text-rose-400 select-all">{props.userId}</code>
                                <button onClick={props.onCopyId} className="text-slate-400 hover:text-white p-1 transition-colors">
                                    <IconCopy />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <a href="https://t.me/Mizan0072" target="_blank" rel="noreferrer" className="block w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2">
                                <IconTg className="w-5 h-5"/> Contact Admin
                            </a>
                            <button 
                                onClick={props.onRefreshPoints} 
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700"
                            >
                                Refresh Balance
                            </button>
                            <button 
                                className="mt-2 text-sm text-slate-500 hover:text-slate-300 font-medium transition-colors w-full" 
                                onClick={props.onCloseBuyModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
