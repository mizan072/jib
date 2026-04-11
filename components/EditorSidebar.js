// --- EDITOR SIDEBAR COMPONENT ---
// Handles the tabs (Content, Teams, Style) and all the dynamic form inputs.

window.EditorSidebar = function(props) {
    // Destructure icons
    const { 
        IconUpload, IconUser, IconTrash, IconSwap, IconFootball, IconLayout, 
        IconUsers, IconList, IconGrid, IconHelp, IconChart, IconStar, 
        IconCalendar, IconEye, IconHeight, IconMegaphone, IconMessage 
    } = window.AppIcons;

    const { formData, appMode, activeTab, setActiveTab } = props;

    return (
        <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 flex flex-col flex-1 relative overflow-hidden h-[calc(100vh-140px)] lg:h-[85vh]">
            
            {/* --- TABS --- */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-20">
                <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                    <button 
                        onClick={() => setActiveTab('match')} 
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'match' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Content
                    </button>
                    {(appMode === 'scorecard' || appMode === 'schedule' || appMode === 'f_scorecard') && (
                        <button 
                            onClick={() => setActiveTab('teams')} 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'teams' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Teams
                        </button>
                    )}
                    <button 
                        onClick={() => setActiveTab('style')} 
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'style' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Style
                    </button>
                </div>
            </div>

            {/* --- SCROLLABLE FORM AREA --- */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scroll flex-1">
                
                {/* =========================================
                    TAB 1: CONTENT
                ========================================= */}
                {activeTab === 'match' && (
                    <div className="space-y-6">
                        
                        {/* --- Standard Image Uploaders --- */}
                        {appMode !== 'discussion' && appMode !== 't_fixture' && (
                            <div className="flex gap-4">
                                <div className="relative group flex-1">
                                    <input type="file" accept="image/*" onChange={(e) => props.onImageUpload(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-950/50 group-hover:bg-slate-800/80 group-hover:border-rose-500/50 transition-all">
                                        <div className="bg-slate-800 p-3 rounded-full shadow-lg text-rose-500 group-hover:scale-110 transition-transform"><IconUpload /></div>
                                        <span className="text-xs font-bold text-slate-400">Photo 1 (Background)</span>
                                    </div>
                                </div>
                                
                                {/* Hide Image 2/Avatar box if we are in 3v3 Clash mode, because players have their own boxes */}
                                {appMode !== 'h2h_3v3' && (
                                    <div className="relative group flex-1">
                                        {appMode === 'statement' ? (
                                            props.hasAvatarImage ? (
                                                <div className="h-full border border-amber-500/30 bg-amber-500/5 rounded-2xl flex flex-col items-center justify-center relative shadow-inner p-4">
                                                    <span className="text-xs font-bold text-amber-400 mb-2">Avatar Active</span>
                                                    <button onClick={props.onRemoveAvatar} className="flex items-center justify-center w-full gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-bold border border-slate-700 transition-colors z-20 relative"><IconTrash /> Remove</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <input type="file" accept="image/*" onChange={props.onAvatarUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-950/50 group-hover:bg-slate-800/80 group-hover:border-amber-500/50 transition-all">
                                                        <div className="bg-slate-800 p-3 rounded-full shadow-lg text-amber-500 group-hover:scale-110 transition-transform"><IconUser /></div>
                                                        <span className="text-xs font-bold text-slate-400">Avatar</span>
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            (appMode !== 'squad' && props.hasBgImage2) ? (
                                                <div className="h-full border border-blue-500/30 bg-blue-500/5 rounded-2xl flex flex-col items-center justify-center relative shadow-inner p-4">
                                                    <span className="text-xs font-bold text-blue-400 mb-2">Img 2 Active</span>
                                                    <button onClick={props.onRemoveBgImage2} className="flex items-center justify-center w-full gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-bold border border-slate-700 transition-colors z-20 relative"><IconTrash /> Remove</button>
                                                </div>
                                            ) : (
                                                appMode !== 'squad' && (
                                                    <>
                                                        <input type="file" accept="image/*" onChange={(e) => props.onImageUpload(e, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-950/50 group-hover:bg-slate-800/80 group-hover:border-blue-500/50 transition-all">
                                                            <div className="bg-slate-800 p-3 rounded-full shadow-lg text-blue-500 group-hover:scale-110 transition-transform"><IconUpload /></div>
                                                            <span className="text-xs font-bold text-slate-400">{appMode === 'f_scorecard' ? 'Photo 2 (Inset)' : 'Photo 2 (Opt)'}</span>
                                                        </div>
                                                    </>
                                                )
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- Global Fields --- */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Badge Text</label>
                                    <input type="text" name="badgeText" value={formData.badgeText} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                                </div>
                                {!['news', 'career', 'poll', 'milestone', 'statement', 'discussion', 'multi_result', 'multi_schedule', 'squad', 't_fixture', 'f_scorecard', 'h2h_3v3'].includes(appMode) && (
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Main Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Footer / Handle</label>
                                <input type="text" name="footerHandle" value={formData.footerHandle} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                            </div>
                        </div>

                        {/* --- Tool Specific Forms --- */}

                        {/* ---> NEW 3V3 CLASH UI <--- */}
                        {appMode === 'h2h_3v3' && (
                            <div className="p-5 bg-amber-500/10 rounded-2xl border-l-4 border-amber-500 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconUsers /> 3v3 Clash Setup</h4>
                                
                                {/* Match Info */}
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-amber-300 mb-1.5 block ml-1">Tournament / League</label>
                                    <input type="text" name="h2hTournament" value={formData.h2hTournament} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm font-bold text-white focus:border-amber-500 transition-all" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-amber-300 mb-1.5 block ml-1">Date</label>
                                        <input type="text" name="h2hDate" value={formData.h2hDate} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm font-bold text-white focus:border-amber-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-amber-300 mb-1.5 block ml-1">Day</label>
                                        <input type="text" name="h2hDay" value={formData.h2hDay} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm font-bold text-white focus:border-amber-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-amber-300 mb-1.5 block ml-1">Time</label>
                                        <input type="text" name="h2hTime" value={formData.h2hTime} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm font-bold text-white focus:border-amber-500 transition-all" />
                                    </div>
                                </div>

                                {/* Teams & Players Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-amber-500/20">
                                    {/* Left Team */}
                                    <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-emerald-400 mb-1.5 block">Left Team Name</label>
                                            <input type="text" name="h2hTeam1Name" value={formData.h2hTeam1Name} onChange={props.onChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold text-white focus:border-emerald-500 transition-all mb-2" />
                                        </div>
                                        {[1, 2, 3].map(num => (
                                            <div key={`t1p${num}`} className="flex gap-3 items-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                                                <label className="relative w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden border border-slate-700 hover:border-emerald-500 transition-colors shrink-0">
                                                    <input type="file" accept="image/*" onChange={(e) => props.onClashUpload(e, `t1p${num}`)} className="hidden" />
                                                    {props.clashImages[`t1p${num}`] ? (
                                                        <img src={props.clashImages[`t1p${num}`].src} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <IconUpload className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </label>
                                                <input type="text" name={`h2hT1P${num}`} value={formData[`h2hT1P${num}`]} onChange={props.onChange} placeholder={`Player ${num}`} className="w-full bg-transparent border-0 text-sm font-bold text-white focus:ring-0 p-1" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Team */}
                                    <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-rose-400 mb-1.5 block">Right Team Name</label>
                                            <input type="text" name="h2hTeam2Name" value={formData.h2hTeam2Name} onChange={props.onChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold text-white focus:border-rose-500 transition-all mb-2" />
                                        </div>
                                        {[1, 2, 3].map(num => (
                                            <div key={`t2p${num}`} className="flex gap-3 items-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                                                <label className="relative w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden border border-slate-700 hover:border-rose-500 transition-colors shrink-0">
                                                    <input type="file" accept="image/*" onChange={(e) => props.onClashUpload(e, `t2p${num}`)} className="hidden" />
                                                    {props.clashImages[`t2p${num}`] ? (
                                                        <img src={props.clashImages[`t2p${num}`].src} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <IconUpload className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </label>
                                                <input type="text" name={`h2hT2P${num}`} value={formData[`h2hT2P${num}`]} onChange={props.onChange} placeholder={`Player ${num}`} className="w-full bg-transparent border-0 text-sm font-bold text-white focus:ring-0 p-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {appMode === 'f_scorecard' && (
                            <div className="p-5 bg-emerald-500/10 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconFootball /> Football PRO Setup</h4>
                                <div><label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Tournament Title</label><input type="text" name="fTourneyTitle" value={formData.fTourneyTitle} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                                <div><label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Match Status (e.g. ফুল টাইম)</label><input type="text" name="fMatchStatus" value={formData.fMatchStatus} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                            </div>
                        )}

                        {appMode === 't_fixture' && (
                            <div className="p-5 bg-orange-500/10 rounded-2xl border-l-4 border-orange-500 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-orange-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconLayout /> Tournament Fixtures</h4>
                                <div className="space-y-4">
                                    <div><label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Main Event Title (Use Enter to split lines)</label><textarea name="fixtureTitle" value={formData.fixtureTitle} onChange={props.onChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 transition-all"></textarea></div>
                                    <div><label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Subtitle (Round / Season)</label><input type="text" name="fixtureSubtitle" value={formData.fixtureSubtitle} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 transition-all" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Footer 1 (Date / Opening)</label><input type="text" name="fixtureDateFooter" value={formData.fixtureDateFooter} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Footer 2 (Organizer)</label><input type="text" name="fixtureOrganizerFooter" value={formData.fixtureOrganizerFooter} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 transition-all" /></div>
                                </div>
                                <div className="space-y-4 mt-8 pt-6 border-t border-orange-500/20">
                                    <h5 className="text-xs font-black text-slate-300 uppercase tracking-widest text-center">Matchups List</h5>
                                    {formData.matchupList.map((match, index) => (
                                        <div key={match.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 relative group transition-all hover:border-orange-500/30">
                                            <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-0.5 rounded text-[10px] font-bold text-slate-300 shadow-sm border border-slate-700">Match {index + 1}</div>
                                            <button onClick={() => props.removeMatchup(match.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"><IconTrash /></button>
                                            <div className="mt-3 mb-2"><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Match Date / Info</label><input type="text" value={match.date} onChange={(e) => props.handleMatchupChange(match.id, 'date', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white focus:border-orange-500 transition-colors" /></div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="space-y-2">
                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Team</label><input type="text" value={match.t1} onChange={(e) => props.handleMatchupChange(match.id, 't1', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-orange-500 transition-colors" /></div>
                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Sub-Text</label><input type="text" value={match.t1Sub} onChange={(e) => props.handleMatchupChange(match.id, 't1Sub', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 focus:border-orange-500 transition-colors" /></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Team</label><input type="text" value={match.t2} onChange={(e) => props.handleMatchupChange(match.id, 't2', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-orange-500 transition-colors" /></div>
                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Sub-Text</label><input type="text" value={match.t2Sub} onChange={(e) => props.handleMatchupChange(match.id, 't2Sub', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 focus:border-orange-500 transition-colors" /></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={props.addMatchup} className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-orange-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-orange-500/30 hover:border-orange-500/60 transition-all">+ Add Fixture Match</button>
                            </div>
                        )}

                        {appMode === 'squad' && (
                            <div className="p-5 bg-green-500/10 rounded-2xl border-l-4 border-green-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-green-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconUsers /> Squad Builder</h4>
                                <div><label className="text-[10px] uppercase font-bold text-green-300 mb-1.5 block ml-1">Series Title (Red Box)</label><input type="text" name="squadTitle" value={formData.squadTitle} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-green-500/30 rounded-xl text-sm font-bold text-white focus:border-green-500 transition-all" /></div>
                                <div><label className="text-[10px] uppercase font-bold text-green-300 mb-1.5 block ml-1">Player List (Enter names on new lines)</label><textarea name="squadList" value={formData.squadList} onChange={props.onChange} rows="10" className="w-full px-4 py-3 bg-slate-900 border border-green-500/30 rounded-xl text-sm font-medium text-white focus:border-green-500 transition-all leading-relaxed whitespace-pre"></textarea></div>
                            </div>
                        )}

                        {appMode === 'multi_result' && (
                            <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/20 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconList /> Results Builder</h4>
                                <div><label className="text-[10px] uppercase font-bold text-rose-300 mb-1.5 block ml-1">Main Headline</label><input type="text" name="multiResultTitle" value={formData.multiResultTitle} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-rose-500/30 rounded-xl text-sm font-bold text-white focus:border-rose-500 transition-all" /></div>
                                <div className="space-y-4 mt-6">
                                    {formData.resultsList.map((res, index) => (
                                        <div key={res.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 relative group transition-all hover:border-slate-700">
                                            <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-0.5 rounded text-[10px] font-bold text-slate-300 shadow-sm border border-slate-700">Match {index + 1}</div>
                                            <button onClick={() => props.removeResult(res.id)} className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"><IconTrash /></button>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Team</label><input type="text" value={res.team1} onChange={(e) => props.handleResultChange(res.id, 'team1', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-colors" /></div>
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Team</label><input type="text" value={res.team2} onChange={(e) => props.handleResultChange(res.id, 'team2', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-colors" /></div>
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Score</label><input type="text" value={res.score1} onChange={(e) => props.handleResultChange(res.id, 'score1', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white text-center focus:border-rose-500 transition-colors" /></div>
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Score</label><input type="text" value={res.score2} onChange={(e) => props.handleResultChange(res.id, 'score2', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white text-center focus:border-rose-500 transition-colors" /></div>
                                            </div>
                                            <div className="mt-4"><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Tournament</label><input type="text" value={res.tourney} onChange={(e) => props.handleResultChange(res.id, 'tourney', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-colors" /></div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={props.addResult} className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-rose-500/30 hover:border-rose-500/60 transition-all">+ Add Match Result</button>
                            </div>
                        )}

                        {appMode === 'multi_schedule' && (
                            <div className="p-5 bg-sky-500/5 rounded-2xl border border-sky-500/20 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconGrid /> Schedule Builder</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-sky-300 mb-1.5 block ml-1">Schedule Date</label><input type="text" name="multiScheduleDate" value={formData.multiScheduleDate} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-sky-500/30 rounded-xl text-sm font-bold text-white focus:border-sky-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-sky-300 mb-1.5 block ml-1">Main Headline</label><input type="text" name="multiScheduleTitle" value={formData.multiScheduleTitle} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-sky-500/30 rounded-xl text-sm font-bold text-white focus:border-sky-500 transition-all" /></div>
                                </div>
                                <div className="space-y-4 mt-6">
                                    {formData.scheduleList.map((sch, index) => (
                                        <div key={sch.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 relative group transition-all hover:border-slate-700">
                                            <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-0.5 rounded text-[10px] font-bold text-slate-300 shadow-sm border border-slate-700">Fixture {index + 1}</div>
                                            <button onClick={() => props.removeSchedule(sch.id)} className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"><IconTrash /></button>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Sport Type</label><input type="text" value={sch.sport} onChange={(e) => props.handleScheduleChange(sch.id, 'sport', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 transition-colors" /></div>
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Tournament</label><input type="text" value={sch.tourney} onChange={(e) => props.handleScheduleChange(sch.id, 'tourney', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 transition-colors" /></div>
                                            </div>
                                            <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Match / Teams</label><input type="text" value={sch.match} onChange={(e) => props.handleScheduleChange(sch.id, 'match', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-sky-500 transition-colors" /></div>
                                                <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Time</label><input type="text" value={sch.time} onChange={(e) => props.handleScheduleChange(sch.id, 'time', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white text-center focus:border-sky-500 transition-colors" /></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={props.addSchedule} className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-sky-500/30 hover:border-sky-500/60 transition-all">+ Add Schedule Item</button>
                            </div>
                        )}

                        {appMode === 'discussion' && (
                            <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 shadow-inner space-y-4">
                                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconHelp /> Q&A / Discussion</h4>
                                <div><label className="text-[10px] uppercase font-bold text-emerald-300 ml-1">Topic / Main Heading</label><input type="text" name="discTopic" value={formData.discTopic} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                                <div className="pt-2"><label className="text-[10px] uppercase font-bold text-emerald-300 ml-1">Discussion Lines (Auto Wraps)</label>
                                    <textarea name="discLine1" value={formData.discLine1} onChange={props.onChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all mb-3"></textarea>
                                    <textarea name="discLine2" value={formData.discLine2} onChange={props.onChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all mb-3"></textarea>
                                    <textarea name="discLine3" value={formData.discLine3} onChange={props.onChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all"></textarea>
                                </div>
                            </div>
                        )}

                        {appMode === 'poll' && (
                            <div className="p-5 bg-indigo-500/10 rounded-2xl border-l-4 border-indigo-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconChart /> Reaction Poll Settings</h4>
                                <div><label className="text-[10px] uppercase font-bold text-indigo-300 mb-1.5 block ml-1">Poll Question</label><input type="text" name="pollQuestion" value={formData.pollQuestion} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-indigo-500/30 rounded-xl text-sm font-bold text-white focus:border-indigo-500 transition-all" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-blue-400 mb-1.5 block ml-1">👍 Left Player</label><input type="text" name="pollPlayer1" value={formData.pollPlayer1} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-blue-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-rose-400 mb-1.5 block ml-1">❤️ Right Player</label><input type="text" name="pollPlayer2" value={formData.pollPlayer2} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-rose-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-rose-500 transition-all" /></div>
                                </div>
                                <button onClick={props.swapTeams} className="w-full py-3 mt-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-indigo-500/30"><IconSwap /> Swap Players</button>
                            </div>
                        )}

                        {appMode === 'milestone' && (
                            <div className="p-5 bg-yellow-500/10 rounded-2xl border-l-4 border-yellow-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconStar /> Birthday & Milestone</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Occasion Type</label><input type="text" name="milestoneOccasion" value={formData.milestoneOccasion} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-sm font-bold text-white focus:border-yellow-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Player Name</label><input type="text" name="milestoneName" value={formData.milestoneName} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-sm font-bold text-white focus:border-yellow-500 transition-all" /></div>
                                </div>
                                <div><label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Main Highlight</label><input type="text" name="milestoneNumber" value={formData.milestoneNumber} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-xl font-black text-white text-center tracking-wide focus:border-yellow-500 transition-all" /></div>
                                <div><label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Sub-Message</label><textarea name="milestoneMessage" value={formData.milestoneMessage} onChange={props.onChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-sm text-white focus:border-yellow-500 transition-all"></textarea></div>
                            </div>
                        )}

                        {appMode === 'scorecard' && (
                            <div><label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Match Result Headline</label><textarea name="result" value={formData.result} onChange={props.onChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-all"></textarea></div>
                        )}

                        {appMode === 'schedule' && (
                            <div className="p-5 bg-blue-500/10 rounded-2xl border-l-4 border-blue-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconCalendar /> Match Details</h4>
                                <div><label className="text-[10px] uppercase font-bold text-blue-300 mb-1.5 block ml-1">Date</label><input type="text" name="matchDate" value={formData.matchDate} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white focus:border-blue-500 transition-all" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-blue-300 mb-1.5 block ml-1">Time</label><input type="text" name="matchTime" value={formData.matchTime} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white focus:border-blue-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-blue-300 mb-1.5 block ml-1">Venue</label><input type="text" name="matchVenue" value={formData.matchVenue} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white focus:border-blue-500 transition-all" /></div>
                                </div>
                            </div>
                        )}

                        {appMode === 'player' && (
                            <div className="p-5 bg-emerald-500/10 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconUser /> Player Stats</h4>
                                <div><label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Player Name</label><input type="text" name="playerName" value={formData.playerName} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Primary Stat</label><input type="text" name="playerStatMain" value={formData.playerStatMain} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-xl font-black text-center text-white focus:border-emerald-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Sub Stat</label><input type="text" name="playerStatSub" value={formData.playerStatSub} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-center text-white focus:border-emerald-500 transition-all" /></div>
                                </div>
                            </div>
                        )}

                        {appMode === 'career' && (
                            <div className="p-5 bg-cyan-500/10 rounded-2xl border-l-4 border-cyan-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconChart /> Career Statistics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Player Name</label><input type="text" name="playerName" value={formData.playerName} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white focus:border-cyan-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Role</label><input type="text" name="playerRole" value={formData.playerRole} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white focus:border-cyan-500 transition-all" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Matches</label><input type="text" name="careerMatches" value={formData.careerMatches} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Total Runs</label><input type="text" name="careerRuns" value={formData.careerRuns} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">100s</label><input type="text" name="careerHundreds" value={formData.careerHundreds} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">50s</label><input type="text" name="careerFifties" value={formData.careerFifties} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Best Score</label><input type="text" name="careerBest" value={formData.careerBest} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 transition-all" /></div>
                                    <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Wickets</label><input type="text" name="careerWickets" value={formData.careerWickets} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 transition-all" /></div>
                                </div>
                            </div>
                        )}

                        {appMode === 'news' && (
                            <div className="p-5 bg-red-500/10 rounded-2xl border-l-4 border-red-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconMegaphone /> Breaking News</h4>
                                <div><label className="text-[10px] uppercase font-bold text-red-300 mb-1.5 block ml-1">News Body / Quote Text</label><textarea name="quoteText" value={formData.quoteText} onChange={props.onChange} rows="3" className="w-full px-4 py-3 bg-slate-900 border border-red-500/30 rounded-xl text-sm text-white focus:border-red-500 transition-all"></textarea></div>
                                <div><label className="text-[10px] uppercase font-bold text-red-300 mb-1.5 block ml-1">Headline / Author / Source</label><input type="text" name="quoteAuthor" value={formData.quoteAuthor} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-red-500/30 rounded-xl text-sm font-bold text-white focus:border-red-500 transition-all" /></div>
                            </div>
                        )}

                        {appMode === 'statement' && (
                            <div className="p-5 bg-fuchsia-500/10 rounded-2xl border-l-4 border-fuchsia-500 shadow-inner space-y-4">
                                <h4 className="text-xs font-black text-fuchsia-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconMessage /> Statement / Quote Overlay</h4>
                                <div><label className="text-[10px] uppercase font-bold text-fuchsia-300 mb-1.5 block ml-1">Statement Text</label><textarea name="quoteText" value={formData.quoteText} onChange={props.onChange} rows="3" className="w-full px-4 py-3 bg-slate-900 border border-fuchsia-500/30 rounded-xl text-sm text-white focus:border-fuchsia-500 transition-all"></textarea></div>
                                <div><label className="text-[10px] uppercase font-bold text-fuchsia-300 mb-1.5 block ml-1">Author Name / Credit</label><input type="text" name="quoteAuthor" value={formData.quoteAuthor} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-fuchsia-500/30 rounded-xl text-sm font-bold text-white focus:border-fuchsia-500 transition-all" /></div>
                            </div>
                        )}
                    </div>
                )}

                {/* =========================================
                    TAB 2: TEAMS (Only for specific modes)
                ========================================= */}
                {activeTab === 'teams' && (appMode === 'scorecard' || appMode === 'schedule' || appMode === 'f_scorecard') && (
                    <div className="space-y-6">
                        <button onClick={props.swapTeams} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-slate-700 shadow-sm"><IconSwap /> Swap Sides</button>
                        
                        <div className="bg-slate-950 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Left Team</h3>
                                <input type="color" name="team1Color" value={formData.team1Color} onChange={props.onChange} className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-800 cursor-pointer shadow-sm" />
                            </div>
                            <div><label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Full Team Name</label><input type="text" name="team1" value={formData.team1} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                            {(appMode === 'scorecard' || appMode === 'f_scorecard') && (
                                <div className="flex gap-4">
                                    <div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Score / Goals</label><input type="text" name="team1Score" value={formData.team1Score} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                                    {appMode === 'scorecard' && (
                                        <div className="w-28"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Overs</label><input type="text" name="team1Overs" value={formData.team1Overs} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-emerald-500 text-center" /></div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-slate-950 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Right Team</h3>
                                <input type="color" name="team2Color" value={formData.team2Color} onChange={props.onChange} className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-800 cursor-pointer shadow-sm" />
                            </div>
                            <div><label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Full Team Name</label><input type="text" name="team2" value={formData.team2} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                            {(appMode === 'scorecard' || appMode === 'f_scorecard') && (
                                <div className="flex gap-4">
                                    <div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Score / Goals</label><input type="text" name="team2Score" value={formData.team2Score} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 transition-all" /></div>
                                    {appMode === 'scorecard' && (
                                        <div className="w-28"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Overs</label><input type="text" name="team2Overs" value={formData.team2Overs} onChange={props.onChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-emerald-500 text-center" /></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* =========================================
                    TAB 3: STYLE
                ========================================= */}
                {activeTab === 'style' && (
                    <div className="space-y-6">
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-wider mb-4"><IconEye className="text-rose-500"/> Background Opacity</label>
                            <div className="px-2">
                                <input type="range" min="0" max="1" step="0.05" value={formData.bgOpacity} onChange={(e) => props.onChange({target: {name: 'bgOpacity', value: parseFloat(e.target.value)}})} className="w-full" />
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2 uppercase"><span>Clear</span><span>Dark</span></div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-4">Colors</label>
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Primary Color</label>
                                    <input type="color" name="primaryColor" value={formData.primaryColor} onChange={props.onChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Secondary Color</label>
                                    <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={props.onChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Accent / Team 1</label>
                                    <input type="color" name="team1Color" value={formData.team1Color} onChange={props.onChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Accent / Team 2</label>
                                    <input type="color" name="team2Color" value={formData.team2Color} onChange={props.onChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                </div>
                            </div>
                        </div>
                        
                        {appMode === 'news' && (
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-wider mb-4"><IconHeight className="text-rose-500"/> News Overlay Height</label>
                                <div className="px-2">
                                    <input type="range" min="0.2" max="0.9" step="0.05" value={formData.newsGradientHeight} onChange={(e) => props.onChange({target: {name: 'newsGradientHeight', value: parseFloat(e.target.value)}})} className="w-full" />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2 uppercase"><span>Low</span><span>High</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
