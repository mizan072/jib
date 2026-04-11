// --- TOOL GRID COMPONENT ---
// Handles the welcome banner and the dashboard grid of all available tools.

window.ToolGrid = function(props) {
    // Pull the categories from our global config
    const CATEGORIES = window.AppCategories;
    
    // FIX: Correctly map the exact icon names from config.js
    const { Star: IconStar } = window.AppIcons;

    return (
        <div className="space-y-12 animation-fadeIn">
            
            {/* --- Hero Banner --- */}
            <div className="relative text-center py-12 px-4 mb-4 rounded-[2rem] border border-slate-800 bg-slate-900/50 shadow-inner overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-rose-500/20 blur-[100px] pointer-events-none"></div>
                
                <div className="bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-6 border border-rose-500/20">
                    <IconStar className="w-4 h-4"/> v4.0 Cinematic HD Engine
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    Create Pro Graphics. <br className="md:hidden"/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-500">In Seconds.</span>
                </h2>
                
                <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto">
                    Select a tool from the dashboard below to instantly generate high-quality sports posters, news overlays, and match scorecards.
                </p>
            </div>

            {/* --- Dynamic Categories & Tools Grid --- */}
            {CATEGORIES.map(category => (
                <div key={category.name} className="mb-10">
                    <h3 className="text-xl font-black text-slate-300 mb-5 flex items-center gap-2 border-l-4 border-rose-500 pl-3">
                        {category.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {category.tools.map(tool => (
                            <div 
                                key={tool.id} 
                                onClick={() => props.onSelectTool(tool.id)} 
                                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-slate-900/50 transition-all hover:-translate-y-1 flex flex-col items-start text-left relative overflow-hidden"
                            >
                                {/* Glowing Hover Effect */}
                                <div className={`absolute -right-10 -bottom-10 w-32 h-32 ${tool.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                
                                {/* Tool Icon */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${tool.bg} ${tool.color} border ${tool.border} group-hover:scale-110 transition-transform shadow-inner [&>svg]:w-7 [&>svg]:h-7 relative z-10`}>
                                    <tool.icon />
                                </div>
                                
                                {/* Tool Text */}
                                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-rose-400 transition-colors relative z-10">
                                    {tool.name}
                                </h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
                                    {tool.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
        </div>
    );
};
