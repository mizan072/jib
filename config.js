// --- GLOBAL APP CONFIGURATION & DATA ---
// This file stores all icons, tool categories, and default form data.

// 1. SVG ICONS
window.AppIcons = {
    Logo: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>,
    Coin: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="gold" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>,
    Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>,
    Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>,
    Swap: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 2 10 10-10 10"></path><path d="M17 12H3"></path></svg>,
    Move: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>,
    ZoomIn: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>,
    Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    Calendar: ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    User: ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Install: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Copy: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
    Height: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="20"></line></svg>,
    Tg: ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.543 2.457L2.613 9.77c-1.32.533-1.316 1.272-.24 1.6l4.86 1.516 11.36-7.16c.536-.325 1.027.15.777.373l-9.206 8.307-.36 5.43c.528 0 .762-.24.905-.373l2.17-2.106 4.513 3.333c.832.458 1.432.22 1.64-.773l2.968-13.987c.304-1.216-.464-1.767-1.4-.93z"/></svg>,
    Chart: ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Star: ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    ArrowLeft: ({className}) => <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
    Trophy: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 1.1-.9 2-2 2H4"/><path d="M14 14.66V17c0 1.1.9 2 2 2h4"/><path d="M8 22H16"/><path d="M14 8c0 3.31-2.69 6-6 6s-6-2.69-6-6V2h12v6z"/></svg>,
    Megaphone: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
    Message: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    Help: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
    List: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Grid: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Users: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Layout: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
    Football: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 15.5 8.5 14.5 13.5 9.5 13.5 8.5 8.5 12 6"></polygon><line x1="12" y1="6" x2="12" y2="2"></line><line x1="15.5" y1="8.5" x2="20.5" y2="7"></line><line x1="14.5" y1="13.5" x2="18.5" y2="18"></line><line x1="9.5" y1="13.5" x2="5.5" y2="18"></line><line x1="8.5" y1="8.5" x2="3.5" y2="7"></line></svg>,
    Video: ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
};

// 2. TOOL CATEGORIES
// Colors updated to match the Deep Maroon (#8C0D17) and Yellow (#FFEB00) Theme
window.AppCategories = [
    {
        name: "Video & Motion",
        tools: [
            { id: 'viral_video', name: 'Viral Shorts Pro', desc: 'Animated sports videos', icon: window.AppIcons.Video, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' }
        ]
    },
    {
        name: "Pre-Match & Fixtures",
        tools: [
            { id: 't_fixture', name: 'Tournament Fixture', desc: 'Knockout/Round match list', icon: window.AppIcons.Layout, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' },
            { id: 'schedule', name: 'Single Schedule', desc: 'Upcoming fixture and venue', icon: window.AppIcons.Calendar, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' },
            { id: 'multi_schedule', name: 'All-Day Schedule', desc: 'Grid schedule of matches', icon: window.AppIcons.Grid, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' },
            { id: 'squad', name: 'Squad List', desc: 'Two-column team player list', icon: window.AppIcons.Users, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' }
        ]
    },
    {
        name: "Live & Match Results",
        tools: [
            { id: 'f_scorecard', name: 'Football PRO', desc: 'Photo-rich football result', icon: window.AppIcons.Football, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' },
            { id: 'scorecard', name: 'Match Scorecard', desc: 'Classic Match score updates', icon: window.AppIcons.Trophy, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' },
            { id: 'multi_result', name: 'Multi Results', desc: 'List of match scores', icon: window.AppIcons.List, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' },
            { id: 'poll', name: 'Reaction Poll', desc: 'Facebook-style reaction polls', icon: window.AppIcons.Swap, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' }
        ]
    },
    {
        name: "Player & Milestones",
        tools: [
            { id: 'player', name: 'Player Profile', desc: 'Highlight player performance', icon: window.AppIcons.User, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' },
            { id: 'career', name: 'Career Stats', desc: 'Overall career statistics', icon: window.AppIcons.Chart, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' },
            { id: 'milestone', name: 'Milestones', desc: 'Birthdays and records', icon: window.AppIcons.Star, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' }
        ]
    },
    {
        name: "Media & Engagement",
        tools: [
            { id: 'news', name: 'Breaking News', desc: 'Urgent updates and headlines', icon: window.AppIcons.Megaphone, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' },
            { id: 'discussion', name: 'Q&A / Discussion', desc: 'Text-heavy engagement posts', icon: window.AppIcons.Help, color: 'text-[#8C0D17]', bg: 'bg-[#8C0D17]/10', border: 'border-[#8C0D17]/20' },
            { id: 'statement', name: 'Quote Overlay', desc: 'Player quotes with avatar cutout', icon: window.AppIcons.Message, color: 'text-[#FFEB00]', bg: 'bg-[#FFEB00]/10', border: 'border-[#FFEB00]/20' }
        ]
    }
];

// 3. DEFAULT FORM DATA
// Default theme updated to match the Deep Maroon & Yellow aesthetic
window.AppDefaultFormData = {
    badgeText: 'ProSports', title: 'ওয়ার্ল্ড চ্যাম্পিয়নশিপ ২০২৬', footerHandle: '@ViralSportsEdits',
    primaryColor: '#FFEB00',   // Vibrant Yellow (Text & Highlights)
    secondaryColor: '#8C0D17', // Deep Maroon/Red (Backgrounds & Gradients)
    bgOpacity: 0.85, newsGradientHeight: 0.6,
    
    team1: 'রাওয়ালপিন্ডি', team1Color: '#FFEB00', // Yellow
    team2: 'লাহোর', team2Color: '#8C0D17', // Maroon
    team1Score: '2', team1Overs: '(২০ ওভার)', team2Score: '0', team2Overs: '(২০ ওভার)',
    result: 'একাদশে নেই রিশাদ হোসেন', resultColor: '#ffffff', 
    matchDate: '২০ অক্টোবর, ২০২৬', matchTime: 'রাত ৮:০০টা', matchVenue: 'মিরপুর স্টেডিয়াম',
    
    playerName: 'রিশাদ হোসেন', playerStatMain: '৮২*', playerStatSub: 'রান (৪৫ বল)', playerRole: 'লেগ স্পিনার', 
    careerMatches: '২৫৪', careerRuns: '৭৫৬২', careerHundreds: '১৪', careerFifties: '৪২', careerBest: '১১৪*', careerWickets: '৩১২', 
    
    pollQuestion: 'আজকের ম্যাচের সেরা খেলোয়াড় কে?', pollPlayer1: 'রিশাদ হোসেন', pollPlayer2: 'বিরাট কোহলি',
    milestoneOccasion: 'শুভ জন্মদিন', milestoneName: 'রিশাদ হোসেন', milestoneNumber: '৩৭ তম', milestoneMessage: 'বাংলাদেশ ক্রিকেটের জান, বাংলাদেশ ক্রিকেটের প্রাণ! শুভকামনা রইলো।',
    discTopic: 'ম্যাচ বিশ্লেষণ', discLine1: 'পাওয়ার প্লে-তে কে বেশি রান করবে?', discLine2: 'আজকের পিচ কাদের জন্য সহায়ক?', discLine3: 'সেরা বোলার কে হতে পারে?',
    quoteText: 'রাওয়ালপিন্ডির একাদশে নেই রিশাদ হোসেন, এটা দলের জন্য বড় ধাক্কা।', quoteAuthor: 'ম্যানেজমেন্ট',
    
    fTourneyTitle: 'সাফ চ্যাম্পিয়নশিপ', fMatchStatus: 'ফুল টাইম',
    squadTitle: 'রাওয়ালপিন্ডির একাদশ ঘোষণা',
    squadList: 'শাহিন শাহ আফ্রিদি (অধিনায়ক)\nমোহাম্মদ ওয়াসিম জুনিয়র\nসাহিবজাদা ফারহান\nমোহাম্মদ গাজী ঘুরি\nআবরার আহমেদ\nশাদ মাসুদ\nফাহিম আশরাফ\nআব্দুল সামাদ\nফাইসাল আকরাম\nসালমান আলী আগা\nহারিস রউফ\nশামিল হুসেন\nহুসাইন তালাত\nমাআজ সাদাকাত\nমোহাম্মদ রিজওয়ান (উইকেটকিপার)',
    
    multiResultTitle: 'আজকের সকল ম্যাচের ফলাফল',
    resultsList: [
        { id: 1, team1: 'বার্সেলোনা', team2: 'রিয়াল মাদ্রিদ', score1: '৩', score2: '১', tourney: 'লা লিগা' },
        { id: 2, team1: 'আর্সেনাল', team2: 'চেলসি', score1: '২', score2: '২', tourney: 'ইপিএল' },
        { id: 3, team1: 'বায়ার্ন', team2: 'ডর্টমুন্ড', score1: '১', score2: '০', tourney: 'বুন্দেসলিগা' }
    ],
    
    multiScheduleDate: '১৫ নভেম্বর ২০২৬',
    multiScheduleTitle: 'আজকের খেলার সময়সূচী',
    scheduleList: [
        { id: 1, sport: 'ক্রিকেট', tourney: 'টি-টোয়েন্টি বিশ্বকাপ', match: 'বাংলাদেশ বনাম ভারত', time: 'রাত ৮:০০ টা' },
        { id: 2, sport: 'ফুটবল', tourney: 'চ্যাম্পিয়ন্স লিগ', match: 'পিএসজি বনাম জুভেন্টাস', time: 'রাত ১:৪৫ মি.' },
        { id: 3, sport: 'ফুটবল', tourney: 'ইংলিশ প্রিমিয়ার লিগ', match: 'ম্যান সিটি বনাম আর্সেনাল', time: 'রাত ১০:৩০ মি.' },
        { id: 4, sport: 'ক্রিকেট', tourney: 'টি-টোয়েন্টি বিশ্বকাপ', match: 'অস্ট্রেলিয়া বনাম ইংল্যান্ড', time: 'বিকেল ৪:০০ টা' }
    ],
    
    fixtureTitle: 'গোপালনগর ক্রিকেট\nটুর্নামেন্ট ২০২৫', fixtureSubtitle: 'সিজন - ৪ | ১ম রাউন্ড', fixtureDateFooter: 'উদ্বোধনী ম্যাচ: ঈদের ৩য় দিন', fixtureOrganizerFooter: 'আয়োজনে: গোপালনগর ইয়ং বয়েজ',
    matchupList: [
        { id: 1, date: '২০ মার্চ', t1: 'আদমপুর', t1Sub: '১নং ওয়ার্ড', t2: 'মণিরামপুর', t2Sub: '১নং ওয়ার্ড' },
        { id: 2, date: '২১ মার্চ', t1: 'ফতেপুর', t1Sub: 'মমিন ট্রের্ডাস', t2: 'বাউবাডিয়া', t2Sub: 'একাদশ' },
        { id: 3, date: '২২ মার্চ', t1: 'শোলমারী', t1Sub: 'কাউন্সিল বয়েজ', t2: 'চেংগারা', t2Sub: 'একাদশ, গাংনী' },
        { id: 4, date: '২৩ মার্চ', t1: 'বারাদি', t1Sub: '৩নং ওয়ার্ড', t2: 'গৌরিনাথপুর', t2Sub: 'একাদশ, মেহেরপুর' },
        { id: 5, date: '২৪ মার্চ', t1: 'শিবপুর', t1Sub: 'সমাজকল্যাণ ক্লাব', t2: 'শুভরাজপুর', t2Sub: 'বর্ডার বয়েজ' },
        { id: 6, date: '২৫ মার্চ', t1: 'গোপালনগর', t1Sub: 'ইয়ং বয়েজ', t2: 'রামনগর', t2Sub: 'একাদশ' },
        { id: 7, date: '২৬ মার্চ', t1: 'বিশ্বনাথপুর', t1Sub: 'একাদশ', t2: 'ভবানীপুর', t2Sub: 'একাদশ' },
        { id: 8, date: '২৭ মার্চ', t1: 'শিবপুর', t1Sub: 'স্টারস', t2: 'গোপালনগর', t2Sub: 'জুনিয়র টাইগার্স' }
    ]
};
