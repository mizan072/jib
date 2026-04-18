// --- MODALS COMPONENT ---
// Handles the Toast notifications, App Announcements, and the "Pro Subscription & License Key" modal.

window.Modals = function(props) {
    // Correctly map the exact icon names from config.js to the names used in this component
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

            {/* --- 3. PRO SUBSCRIPTION & LICENSE KEY MODAL --- */}
            {props.showBuyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop">
                    <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm p-8 text-center modal-content border border-slate-800">
                        
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border ${props.subStatus?.userStatus === 'Banned' ? 'bg-red-500/10 border-red-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                            {props.subStatus?.userStatus === 'Banned' ? '🚫' : '👑'}
                        </div>
                        
                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Poster Bot PRO</h3>
                        
                        <p className={`text-xs mb-6 font-bold px-3 py-1.5 rounded-lg inline-block ${props.subStatus?.isValid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {props.subStatus?.userMessage || (props.subStatus?.isValid ? "Subscription Active" : "No Active Plan")}
                        </p>
                        
                        {/* Show Plan Details */}
                        <div className="bg-slate-800/50 p-4 rounded-2xl mb-6 text-sm border border-slate-700/50 text-left">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status: Valid Until</p>
                            <p className="text-white font-bold text-lg mb-4">{props.subStatus?.expireDate || "N/A"}</p>
                            
                            {/* --- LICENSE KEY INPUT SYSTEM --- */}
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Activate / Extend Package</p>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="e.g. PRO-ABCD-1234" 
                                    value={props.licenseKey}
                                    onChange={(e) => props.setLicenseKey(e.target.value.toUpperCase())}
                                    className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl px-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                                />
                                <button 
                                    onClick={props.onActivateKey}
                                    disabled={props.isActivating || !props.licenseKey}
                                    className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] disabled:shadow-none shrink-0"
                                >
                                    {props.isActivating ? "..." : "Use"}
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {/* Admin Telegram Contact for buying keys */}
                            <a href="https://t.me/Mizan0072" target="_blank" rel="noreferrer" className="block w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 text-sm">
                                <IconTg className="w-5 h-5"/> Buy License Key (৳450/mo)
                            </a>
                            
                            <button 
                                onClick={props.onRefreshPoints} 
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all border border-slate-700 text-sm"
                            >
                                Refresh Status
                            </button>
                            
                            {/* ID For Debugging/Support */}
                            <div className="text-center mt-4">
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Your Device ID</p>
                                <div className="flex justify-center items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800 mx-8">
                                    <code className="text-[10px] font-mono text-slate-400 select-all">{props.userId}</code>
                                    <button onClick={props.onCopyId} className="text-slate-500 hover:text-white transition-colors" title="Copy ID">
                                        <IconCopy className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                className="mt-4 text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors w-full uppercase tracking-wider" 
                                onClick={props.onCloseBuyModal}
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
