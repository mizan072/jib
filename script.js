const { useState, useEffect, useRef } = React;

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztp3j5Kh1tmcMcQpXfgNp9mhYQRchm2iSB-fPAk-V5ikDcXHcJlmVJ-yb93iIiycJ7/exec"; 
const DOWNLOAD_COST = 5; 

// --- SVG ICONS ---
const IconLogo = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>;
const IconCoin = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="gold" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
const IconSwap = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 2 10 10-10 10"></path><path d="M17 12H3"></path></svg>;
const IconMove = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>;
const IconZoomIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconCalendar = ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconUser = ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconInstall = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const IconHeight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline><line x1="12" y1="4" x2="12" y2="20"></line></svg>;
const IconTg = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.543 2.457L2.613 9.77c-1.32.533-1.316 1.272-.24 1.6l4.86 1.516 11.36-7.16c.536-.325 1.027.15.777.373l-9.206 8.307-.36 5.43c.528 0 .762-.24.905-.373l2.17-2.106 4.513 3.333c.832.458 1.432.22 1.64-.773l2.968-13.987c.304-1.216-.464-1.767-1.4-.93z"/></svg>;
const IconChart = ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const IconStar = ({className}) => <svg className={className || ""} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconArrowLeft = ({className}) => <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const IconTrophy = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 1.1-.9 2-2 2H4"/><path d="M14 14.66V17c0 1.1.9 2 2 2h4"/><path d="M8 22H16"/><path d="M14 8c0 3.31-2.69 6-6 6s-6-2.69-6-6V2h12v6z"/></svg>;
const IconMegaphone = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
const IconMessage = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconHelp = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const IconList = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const IconGrid = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const IconUsers = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconLayout = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const IconFootball = ({className}) => <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 15.5 8.5 14.5 13.5 9.5 13.5 8.5 8.5 12 6"></polygon><line x1="12" y1="6" x2="12" y2="2"></line><line x1="15.5" y1="8.5" x2="20.5" y2="7"></line><line x1="14.5" y1="13.5" x2="18.5" y2="18"></line><line x1="9.5" y1="13.5" x2="5.5" y2="18"></line><line x1="8.5" y1="8.5" x2="3.5" y2="7"></line></svg>;

// --- TOOL CATEGORIES ---
const TOOL_CATEGORIES = [
    {
        name: "Pre-Match & Fixtures",
        tools: [
            { id: 't_fixture', name: 'Tournament Fixture', desc: 'Knockout/Round match list', icon: IconLayout, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
            { id: 'schedule', name: 'Single Schedule', desc: 'Upcoming fixture and venue', icon: IconCalendar, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
            { id: 'multi_schedule', name: 'All-Day Schedule', desc: 'Grid schedule of matches', icon: IconGrid, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
            { id: 'squad', name: 'Squad List', desc: 'Two-column team player list', icon: IconUsers, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' }
        ]
    },
    {
        name: "Live & Match Results",
        tools: [
            { id: 'f_scorecard', name: 'Football PRO', desc: 'Photo-rich football result', icon: IconFootball, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
            { id: 'scorecard', name: 'Match Scorecard', desc: 'Classic Match score updates', icon: IconTrophy, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
            { id: 'multi_result', name: 'Multi Results', desc: 'List of match scores', icon: IconList, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
            { id: 'poll', name: 'Reaction Poll', desc: 'Facebook-style reaction polls', icon: IconSwap, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' }
        ]
    },
    {
        name: "Player & Milestones",
        tools: [
            { id: 'player', name: 'Player Profile', desc: 'Highlight player performance', icon: IconUser, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
            { id: 'career', name: 'Career Stats', desc: 'Overall career statistics', icon: IconChart, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
            { id: 'milestone', name: 'Milestones', desc: 'Birthdays and records', icon: IconStar, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' }
        ]
    },
    {
        name: "Media & Engagement",
        tools: [
            { id: 'news', name: 'Breaking News', desc: 'Urgent updates and headlines', icon: IconMegaphone, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
            { id: 'discussion', name: 'Q&A / Discussion', desc: 'Text-heavy engagement posts', icon: IconHelp, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
            { id: 'statement', name: 'Quote Overlay', desc: 'Player quotes with avatar cutout', icon: IconMessage, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'border-fuchsia-400/20' }
        ]
    }
];

const TOOLS = TOOL_CATEGORIES.flatMap(cat => cat.tools);

function App() {
    const canvasRef = useRef(null);
    
    // --- STATE MANAGEMENT ---
    const [currentView, setCurrentView] = useState('home'); 
    const [appMode, setAppMode] = useState('t_fixture'); 
    const [activeTab, setActiveTab] = useState('match');
    
    const [bgImage, setBgImage] = useState(null);
    const [bgImage2, setBgImage2] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    
    const [img1Pos, setImg1Pos] = useState({ x: 0, y: 0, scale: 1 });
    const [img2Pos, setImg2Pos] = useState({ x: 0, y: 0, scale: 1 });
    const [avatarPos, setAvatarPos] = useState({ x: 0, y: 0, scale: 1 });
    
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    const gestureStart = useRef({ mode: null, target: null, x: 0, y: 0, dist: 0, scale: 1, imgX: 0, imgY: 0 });
    
    const [userId, setUserId] = useState('');
    const [points, setPoints] = useState(0);
    const [isCheckingPoints, setIsCheckingPoints] = useState(true);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    
    const [appNotification, setAppNotification] = useState(null);
    const [showAppNotification, setShowAppNotification] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);

    // READY-MADE PROFESSIONAL DEFAULTS
    const [formData, setFormData] = useState({
        badgeText: 'ProSports', title: 'ওয়ার্ল্ড চ্যাম্পিয়নশিপ ২০২৬', footerHandle: 'Created with Poster Bot Pro',
        primaryColor: '#dc2626', secondaryColor: '#020617', bgOpacity: 0.85, newsGradientHeight: 0.6,
        team1: 'বাংলাদেশ', team1Color: '#16a34a', team2: 'পাকিস্তান', team2Color: '#047857', 
        team1Score: '2', team1Overs: '(২০ ওভার)', team2Score: '0', team2Overs: '(২০ ওভার)',
        result: 'বাংলাদেশ ১৪ রানে জয়ী', resultColor: '#ffffff', 
        matchDate: '২০ অক্টোবর, ২০২৬', matchTime: 'রাত ৮:০০টা', matchVenue: 'মিরপুর স্টেডিয়াম',
        playerName: 'সাকিব আল হাসান', playerStatMain: '৮২*', playerStatSub: 'রান (৪৫ বল)', playerRole: 'ব্যাটসম্যান', 
        careerMatches: '২৫৪', careerRuns: '৭৫৬২', careerHundreds: '১৪', careerFifties: '৪২', careerBest: '১১৪*', careerWickets: '৩১২', 
        pollQuestion: 'আজকের ম্যাচের সেরা খেলোয়াড় কে?', pollPlayer1: 'সাকিব আল হাসান', pollPlayer2: 'বিরাট কোহলি',
        milestoneOccasion: 'শুভ জন্মদিন', milestoneName: 'সাকিব আল হাসান', milestoneNumber: '৩৭ তম', milestoneMessage: 'বাংলাদেশ ক্রিকেটের জান, বাংলাদেশ ক্রিকেটের প্রাণ! শুভকামনা রইলো।',
        discTopic: 'ম্যাচ বিশ্লেষণ', discLine1: 'পাওয়ার প্লে-তে কে বেশি রান করবে?', discLine2: 'আজকের পিচ কাদের জন্য সহায়ক?', discLine3: 'সেরা বোলার কে হতে পারে?',
        quoteText: 'ফিলিস্তিনের মাটিতে জন্ম নেওয়াটাই কি দোষ? আমাদের নিষ্পাপ শিশুরা কি দোষ করছে?', quoteAuthor: 'পেপ গার্দিওলা',
        
        fTourneyTitle: 'সাফ অনূর্ধ্ব-২০ চ্যাম্পিয়নশিপ',
        fMatchStatus: 'ফুল টাইম',

        squadTitle: 'বাংলাদেশের বিপক্ষে ওয়ানডে সিরিজের জন্য পাকিস্তানের স্কোয়াড',
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

        fixtureTitle: 'গোপালনগর ক্রিকেট\nটুর্নামেন্ট ২০২৫',
        fixtureSubtitle: 'সিজন - ৪ | ১ম রাউন্ড',
        fixtureDateFooter: 'উদ্বোধনী ম্যাচ: ঈদের ৩য় দিন',
        fixtureOrganizerFooter: 'আয়োজনে: গোপালনগর ইয়ং বয়েজ',
        matchupList: [
            { id: 1, date: '২০ মার্চ', t1: 'আদমপুর', t1Sub: '১নং ওয়ার্ড', t2: 'মণিরামপুর', t2Sub: '১নং ওয়ার্ড' },
            { id: 2, date: '২১ মার্চ', t1: 'ফতেপুর', t1Sub: 'মমিন ট্রের্ডাস', t2: 'বাউবাডিয়া', t2Sub: 'একাদশ' },
            { id: 3, date: '২২ মার্চ', t1: 'শোলমারী', t1Sub: 'কাউন্সিল বয়েজ', t2: 'চেংগারা', t2Sub: 'একাদশ, গাংনী' },
            { id: 4, date: '২৩ মার্চ', t1: 'বারাদি', t1Sub: '৩নং ওয়ার্ড', t2: ' গৌরিনাথপুর', t2Sub: 'একাদশ, মেহেরপুর' },
            { id: 5, date: '২৪ মার্চ', t1: 'শিবপুর', t1Sub: 'সমাজকল্যাণ ক্লাব', t2: 'শুভরাজপুর', t2Sub: 'বর্ডার বয়েজ' },
            { id: 6, date: '২৫ মার্চ', t1: 'গোপালনগর', t1Sub: 'ইয়ং বয়েজ', t2: 'রামনগর', t2Sub: 'একাদশ' },
            { id: 7, date: '২৬ মার্চ', t1: 'বিশ্বনাথপুর', t1Sub: 'একাদশ', t2: 'ভবানীপুর', t2Sub: 'একাদশ' },
            { id: 8, date: '২৭ মার্চ', t1: 'শিবপুর', t1Sub: 'স্টারস', t2: 'গোপালনগর', t2Sub: 'জুনিয়র টাইগার্স' }
        ]
    });

    // --- INITIALIZATION ---
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); setShowInstallPrompt(true); };
        window.addEventListener('beforeinstallprompt', handler);
        let storedId = localStorage.getItem('poster_user_id');
        if (!storedId) { storedId = 'u_' + Math.random().toString(36).substr(2, 9); localStorage.setItem('poster_user_id', storedId); }
        setUserId(storedId); fetchPoints(storedId);
        if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); if(window.Telegram.WebApp.expand) window.Telegram.WebApp.expand(); }

        const img = new Image(); img.crossOrigin = "Anonymous"; img.src = "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1080&auto=format&fit=crop";
        img.onload = () => { 
            setBgImage(img); 
            const scale = Math.max(1080 / img.width, 1200 / img.height);
            setImg1Pos({ x: (1080 - img.width * scale) / 2, y: (1200 - img.height * scale) / 2, scale }); 
        };
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // --- USER & POINTS ---
    const fetchPoints = async (uid) => {
        if(GOOGLE_SCRIPT_URL.includes("xxxxxxxx")) { setPoints(0); setIsCheckingPoints(false); return; }
        setIsCheckingPoints(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=check&userId=${uid}`);
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();
            if (data.status === 'success') {
                setPoints(Number(data.points) || 0);
                if (data.notification && data.notification.status === 'ON') {
                    const msgId = data.notification.title + data.notification.message;
                    const dismissedId = localStorage.getItem('dismissed_notification');
                    if (dismissedId !== msgId) {
                        setAppNotification(data.notification);
                        setShowAppNotification(true);
                    }
                }
            }
        } catch (error) { console.error("Fetch Error:", error); setPoints(0); }
        setIsCheckingPoints(false);
    };

    const dismissNotification = () => {
        if (appNotification) {
            const msgId = appNotification.title + appNotification.message;
            localStorage.setItem('dismissed_notification', msgId);
        }
        setShowAppNotification(false);
    };

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const copyId = () => { 
        navigator.clipboard.writeText(userId); 
        showToast("Account ID copied to clipboard!"); 
    };

    // --- FORM ACTIONS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const swapTeams = () => setFormData(p => ({ ...p, team1: p.team2, team1Score: p.team2Score, team1Overs: p.team2Overs, team1Color: p.team2Color, team2: p.team1, team2Score: p.team1Score, team2Overs: p.team1Overs, team2Color: p.team1Color, pollPlayer1: p.pollPlayer2, pollPlayer2: p.pollPlayer1 }));
    
    const handleResultChange = (id, field, value) => { setFormData(p => ({ ...p, resultsList: p.resultsList.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const addResult = () => { setFormData(p => ({ ...p, resultsList: [...p.resultsList, { id: Date.now(), team1: 'দল ১', team2: 'দল ২', score1: '০', score2: '০', tourney: 'টুর্নামেন্ট' }] })); };
    const removeResult = (id) => { setFormData(p => ({ ...p, resultsList: p.resultsList.filter(item => item.id !== id) })); };

    const handleScheduleChange = (id, field, value) => { setFormData(p => ({ ...p, scheduleList: p.scheduleList.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const addSchedule = () => { setFormData(p => ({ ...p, scheduleList: [...p.scheduleList, { id: Date.now(), sport: 'খেলা', tourney: 'টুর্নামেন্ট', match: 'দল বনাম দল', time: 'সময়' }] })); };
    const removeSchedule = (id) => { setFormData(p => ({ ...p, scheduleList: p.scheduleList.filter(item => item.id !== id) })); };

    const handleMatchupChange = (id, field, value) => { setFormData(p => ({ ...p, matchupList: p.matchupList.map(item => item.id === id ? { ...item, [field]: value } : item) })); };
    const addMatchup = () => { setFormData(p => ({ ...p, matchupList: [...p.matchupList, { id: Date.now(), date: 'তারিখ', t1: 'দল ১', t1Sub: 'স্থান', t2: 'দল ২', t2Sub: 'স্থান' }] })); };
    const removeMatchup = (id) => { setFormData(p => ({ ...p, matchupList: p.matchupList.filter(item => item.id !== id) })); };

    const handleInstallApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') { setDeferredPrompt(null); setShowInstallPrompt(false); }
        }
    };

    // --- CANVAS ROUTER (Connects to renderer.js) ---
    const drawCanvas = (isExport = false) => {
        const canvas = canvasRef.current; 
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = 1080, H = 1200;
        canvas.width = W; canvas.height = H;

        // Route all rendering to our global math engine
        if (window.PosterRenderer) {
            window.PosterRenderer(
                ctx, W, H, appMode, formData, 
                { bgImage, bgImage2, avatarImage }, 
                { img1Pos, img2Pos, avatarPos }, 
                isExport
            );
        }
    };

    useEffect(() => { drawCanvas(false); }, [bgImage, bgImage2, formData, img1Pos, img2Pos, avatarPos, avatarImage, appMode, currentView]);

    // --- CANVAS INTERACTIONS ---
    const handleImageUpload = (e, isSecond = false) => {
        const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                if (isSecond) {
                    setBgImage2(img); 
                    let targetW = 540; let targetH = 1200;
                    if(appMode === 'f_scorecard') { targetW = 360; targetH = 360; }
                    const scale2 = Math.max(targetW / img.width, targetH / img.height);
                    if(appMode === 'f_scorecard') setImg2Pos({ x: (360 - img.width * scale2) / 2, y: (360 - img.height * scale2) / 2, scale: scale2 });
                    else setImg2Pos({ x: 540 + (540 - img.width * scale2) / 2, y: (1200 - img.height * scale2) / 2, scale: scale2 });
                    if (bgImage && appMode !== 'f_scorecard') { const scale1 = Math.max(540 / bgImage.width, 1200 / bgImage.height); setImg1Pos({ x: (540 - bgImage.width * scale1) / 2, y: (1200 - bgImage.height * scale1) / 2, scale: scale1 }); }
                } else {
                    setBgImage(img); const targetW = (bgImage2 && appMode !== 'f_scorecard') ? 540 : 1080; const scale1 = Math.max(targetW / img.width, 1200 / img.height);
                    setImg1Pos({ x: (targetW - img.width * scale1) / 2, y: (1200 - img.height * scale1) / 2, scale: scale1 });
                }
            }; img.src = ev.target.result;
        }; reader.readAsDataURL(file);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                setAvatarImage(img); 
                const scale = Math.max(320 / img.width, 320 / img.height);
                setAvatarPos({ x: (320 - img.width * scale) / 2, y: (320 - img.height * scale) / 2, scale: scale });
            }; img.src = ev.target.result;
        }; reader.readAsDataURL(file);
    };

    const resetImage = () => { 
        if (bgImage) { const targetW = (bgImage2 && appMode !== 'f_scorecard') ? 540 : 1080; const scale1 = Math.max(targetW / bgImage.width, 1200 / bgImage.height); setImg1Pos({ x: (targetW - bgImage.width * scale1) / 2, y: (1200 - bgImage.height * scale1) / 2, scale: scale1 }); }
        if (bgImage2) { 
            let targetW = 540; let targetH = 1200;
            if(appMode === 'f_scorecard') { targetW = 360; targetH = 360; }
            const scale2 = Math.max(targetW / bgImage2.width, targetH / bgImage2.height);
            if(appMode === 'f_scorecard') setImg2Pos({ x: (360 - bgImage2.width * scale2) / 2, y: (360 - bgImage2.height * scale2) / 2, scale: scale2 });
            else setImg2Pos({ x: 540 + (540 - bgImage2.width * scale2) / 2, y: (1200 - bgImage2.height * scale2) / 2, scale: scale2 });
        }
        if (avatarImage) { const scale3 = Math.max(320 / avatarImage.width, 320 / avatarImage.height); setAvatarPos({ x: (320 - avatarImage.width * scale3) / 2, y: (320 - avatarImage.height * scale3) / 2, scale: scale3 }); }
    };

    const handleTouchStart = (e) => { 
        if (appMode === 't_fixture') return; 
        const t = e.touches; const rect = e.target.getBoundingClientRect(); 
        const touchX = t[0].clientX - rect.left; const touchY = t[0].clientY - rect.top;
        
        let targetImg = 'img1'; 
        const s = 1080 / rect.width;
        const canvasX = touchX * s; const canvasY = touchY * s;

        if (appMode === 'statement' && avatarImage && Math.hypot(canvasX - 1080/2, canvasY - 750) < 160) targetImg = 'avatar';
        else if (appMode === 'f_scorecard' && bgImage2 && Math.hypot(canvasX - 830, canvasY - 360) < 180) targetImg = 'img2';
        else if (bgImage2 && touchX > rect.width / 2 && appMode !== 'statement' && appMode !== 'f_scorecard') targetImg = 'img2';
        
        const currentPos = targetImg === 'img1' ? img1Pos : (targetImg === 'img2' ? img2Pos : avatarPos);
        if (t.length === 1) { gestureStart.current = { mode: 'pan', target: targetImg, x: t[0].clientX, y: t[0].clientY, imgX: currentPos.x, imgY: currentPos.y }; 
        } else if (t.length === 2) { gestureStart.current = { mode: 'zoom', target: targetImg, dist: Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY), scale: currentPos.scale }; } 
    };

    const handleTouchMove = (e) => { 
        if (!gestureStart.current.mode) return; e.preventDefault(); 
        const s = 1080 / e.target.getBoundingClientRect().width; const t = e.touches; 
        const { target, imgX, x, imgY, y, scale, dist } = gestureStart.current;
        const setPos = target === 'img1' ? setImg1Pos : (target === 'img2' ? setImg2Pos : setAvatarPos);
        if (t.length === 1 && gestureStart.current.mode === 'pan') { setPos(prev => ({ ...prev, x: imgX + (t[0].clientX - x) * s, y: imgY + (t[0].clientY - y) * s })); 
        } else if (t.length === 2 && gestureStart.current.mode === 'zoom') { const d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); setPos(prev => ({ ...prev, scale: scale * (d / dist) })); } 
    };

    const handleMouseDown = (e) => {
        if (appMode === 't_fixture') return;
        const rect = e.target.getBoundingClientRect(); 
        const touchX = e.clientX - rect.left; const touchY = e.clientY - rect.top;
        
        let targetImg = 'img1'; 
        const s = 1080 / rect.width;
        const canvasX = touchX * s; const canvasY = touchY * s;

        if (appMode === 'statement' && avatarImage && Math.hypot(canvasX - 1080/2, canvasY - 750) < 160) targetImg = 'avatar';
        else if (appMode === 'f_scorecard' && bgImage2 && Math.hypot(canvasX - 830, canvasY - 360) < 180) targetImg = 'img2';
        else if (bgImage2 && touchX > rect.width / 2 && appMode !== 'statement' && appMode !== 'f_scorecard') targetImg = 'img2';
        
        const currentPos = targetImg === 'img1' ? img1Pos : (targetImg === 'img2' ? img2Pos : avatarPos);
        gestureStart.current = { mode: 'pan', target: targetImg, x: e.clientX, y: e.clientY, imgX: currentPos.x, imgY: currentPos.y };
    };

    const handleMouseMove = (e) => {
        if (gestureStart.current.mode === 'pan') {
            const s = 1080 / e.target.getBoundingClientRect().width; const { target, imgX, x, imgY, y } = gestureStart.current;
            const setPos = target === 'img1' ? setImg1Pos : (target === 'img2' ? setImg2Pos : setAvatarPos);
            setPos(p => ({...p, x: imgX + (e.clientX - x) * s, y: imgY + (e.clientY - y) * s}));
        }
    };
    const handleEnd = () => { gestureStart.current.mode = null; };

    // --- HIGH RESOLUTION 8K EXPORT ENGINE ---
    const handleDownloadClick = async () => {
        if (isProcessing) return; 
        if (points < DOWNLOAD_COST) { setShowBuyModal(true); return; }
        setIsProcessing(true);

        if(GOOGLE_SCRIPT_URL.includes("xxxxxxxx")) { 
            performHighResDownload(); 
            setPoints(prev => prev - DOWNLOAD_COST); 
            setIsProcessing(false); 
            return; 
        }

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=deduct&userId=${userId}&amount=${DOWNLOAD_COST}`);
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();
            if (data.status === 'success') { 
                setPoints(data.points); 
                performHighResDownload(); 
            } else { 
                showToast("Insufficient points to export!"); 
            }
        } catch (error) { 
            console.error("Deduction Error:", error); 
            showToast("Network Error."); 
        }
        setIsProcessing(false);
    };

    const performHighResDownload = () => {
        // Create an offscreen canvas at 4x resolution (4320 x 4800)
        const SCALE = 4; 
        const W = 1080; 
        const H = 1200;
        
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = W * SCALE;
        exportCanvas.height = H * SCALE;
        
        const ctx = exportCanvas.getContext('2d');
        
        // Disable smoothing for ultra-crisp fonts
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Scale the entire rendering context up
        ctx.scale(SCALE, SCALE);
        
        // Run the renderer mathematically scaled up
        if (window.PosterRenderer) {
            window.PosterRenderer(
                ctx, W, H, appMode, formData, 
                { bgImage, bgImage2, avatarImage }, 
                { img1Pos, img2Pos, avatarPos }, 
                true // isExport = true (hides watermark)
            );
        }

        // Export at 100% quality PNG
        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob); 
            const link = document.createElement('a'); 
            link.download = `PosterBot_8K_${Date.now()}.png`; 
            link.href = url;
            document.body.appendChild(link); 
            link.click();
            setTimeout(() => { 
                document.body.removeChild(link); 
                URL.revokeObjectURL(url); 
                showToast("8K Graphic downloaded successfully!"); 
            }, 100);
        }, 'image/png', 1.0);
    };

    return (
        <div className="flex flex-col min-h-screen text-slate-200 selection:bg-rose-500/30 selection:text-white" onContextMenu={(e) => e.preventDefault()}>
            
            {toastMsg && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700 font-bold text-sm flex items-center gap-3 toast-enter">
                    <span className="text-emerald-400">✓</span> {toastMsg}
                </div>
            )}

            {showAppNotification && appNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop">
                    <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm p-8 text-center modal-content border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500"></div>
                        <button onClick={dismissNotification} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full"><IconClose /></button>
                        <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner border border-slate-700">🔔</div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{appNotification.title}</h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{appNotification.message}</p>
                        <button onClick={dismissNotification} className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all">Got it!</button>
                    </div>
                </div>
            )}

            {showBuyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop">
                    <div className="bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm p-8 text-center modal-content border border-slate-800">
                        <div className="bg-rose-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border border-rose-500/20">💎</div>
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Get Pro Points</h3>
                        <p className="text-slate-400 text-sm mb-6 font-medium">Export costs {DOWNLOAD_COST} points. Balance: <span className="text-amber-400 font-bold">{points}</span></p>
                        
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
                                <code className="text-sm font-mono text-rose-400 select-all">{userId}</code>
                                <button onClick={copyId} className="text-slate-400 hover:text-white p-1 transition-colors"><IconCopy /></button>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <a href="https://t.me/Mizan0072" target="_blank" rel="noreferrer" className="block w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"><IconTg className="w-5 h-5"/> Contact Admin</a>
                            <button onClick={() => { setShowBuyModal(false); fetchPoints(userId); }} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700">Refresh Balance</button>
                            <button className="mt-2 text-sm text-slate-500 hover:text-slate-300 font-medium transition-colors w-full" onClick={() => setShowBuyModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30 px-4 py-3 shadow-lg shadow-black/20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {currentView === 'editor' ? (
                            <button onClick={() => setCurrentView('home')} className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center shadow-inner" title="Back to Dashboard">
                                <IconArrowLeft />
                            </button>
                        ) : (
                            <div className="bg-gradient-to-tr from-rose-600 to-rose-400 p-2.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center">
                                <IconLogo className="text-white w-5 h-5" />
                            </div>
                        )}
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-black text-white tracking-tight leading-none">
                                {currentView === 'editor' ? TOOLS.find(t => t.id === appMode)?.name : 'Poster Bot'} <span className="text-rose-500">PRO</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                {currentView === 'editor' ? 'Editor Studio' : 'Studio'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors shadow-inner" onClick={() => setShowBuyModal(true)}>
                            <IconCoin />
                            {isCheckingPoints ? <div className="loader"></div> : <span className="text-sm font-bold text-amber-400">{points}</span>}
                        </div>
                        {currentView === 'editor' && (
                            <button onClick={handleDownloadClick} disabled={isProcessing} className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none">
                                {isProcessing ? 'Processing...' : <><IconDownload /> 8K Export</>}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full p-4 md:p-6 max-w-7xl mx-auto">
                {currentView === 'home' ? (
                    <div className="space-y-12 animation-fadeIn">
                        <div className="relative text-center py-12 px-4 mb-4 rounded-[2rem] border border-slate-800 bg-slate-900/50 shadow-inner overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-rose-500/20 blur-[100px] pointer-events-none"></div>
                            <div className="bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-6 border border-rose-500/20"><IconStar className="w-4 h-4"/> v4.0 Cinematic HD Engine</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Create Pro Graphics. <br className="md:hidden"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-500">In Seconds.</span></h2>
                            <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto">Select a tool from the dashboard below to instantly generate high-quality sports posters, news overlays, and match scorecards.</p>
                        </div>

                        {/* CATEGORIZED TOOL GRID */}
                        {TOOL_CATEGORIES.map(category => (
                            <div key={category.name} className="mb-10">
                                <h3 className="text-xl font-black text-slate-300 mb-5 flex items-center gap-2 border-l-4 border-rose-500 pl-3">
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {category.tools.map(tool => (
                                        <div key={tool.id} onClick={() => { setAppMode(tool.id); setActiveTab('match'); setCurrentView('editor'); window.scrollTo(0,0); }} className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-slate-900/50 transition-all hover:-translate-y-1 flex flex-col items-start text-left relative overflow-hidden">
                                            <div className={`absolute -right-10 -bottom-10 w-32 h-32 ${tool.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${tool.bg} ${tool.color} border ${tool.border} group-hover:scale-110 transition-transform shadow-inner [&>svg]:w-7 [&>svg]:h-7 relative z-10`}>
                                                <tool.icon />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-rose-400 transition-colors relative z-10">{tool.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">{tool.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animation-slideUpFade">
                        {showInstallPrompt && (<div className="lg:col-span-12 install-prompt bg-slate-900 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700"><div className="flex items-center gap-4"><div className="bg-rose-500/10 text-rose-500 p-3 rounded-xl border border-rose-500/20"><IconInstall /></div><div><h4 className="font-bold text-sm">Install App</h4><p className="text-xs text-slate-400 font-medium">Add to Home Screen for best experience</p></div></div><div className="flex gap-2"><button onClick={() => setShowInstallPrompt(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><IconClose /></button><button onClick={handleInstallApp} className="bg-white hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-xl text-sm font-bold transition-colors">Install</button></div></div>)}

                        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
                            <div className="flex gap-2 overflow-x-auto custom-scroll pb-2 px-1">
                                {TOOLS.map(toolConfig => (
                                    <button key={toolConfig.id} onClick={() => setAppMode(toolConfig.id)} className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${appMode === toolConfig.id ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800/50'}`}>
                                        {toolConfig.name}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 aspect-[1080/1200] relative group canvas-container touch-none ring-1 ring-white/5">
                                <canvas 
                                    ref={canvasRef} 
                                    className={`w-full h-full object-contain touch-none ${appMode === 't_fixture' || appMode === 'discussion' ? '' : 'cursor-move'}`} 
                                    onTouchStart={handleTouchStart} 
                                    onTouchMove={handleTouchMove} 
                                    onTouchEnd={handleEnd} 
                                    onMouseDown={handleMouseDown} 
                                    onMouseMove={handleMouseMove} 
                                    onMouseUp={handleEnd} 
                                    onMouseLeave={handleEnd}
                                ></canvas>
                                
                                <div className="absolute top-5 right-5 flex flex-col gap-3 z-50">
                                    <button onClick={resetImage} className="bg-slate-900/60 text-white p-3 rounded-full backdrop-blur-md hover:bg-rose-600 transition-colors border border-slate-700/50 shadow-lg" title="Reset Image Positions"><IconRefresh /></button>
                                </div>
                                
                                {!bgImage && appMode !== 'discussion' && appMode !== 'squad' && appMode !== 't_fixture' && <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-slate-950/50 backdrop-blur-sm"><span className="bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-3"><div className="loader border-t-rose-500 border-white/20"></div> Initializing Canvas...</span></div>}
                            </div>
                            
                            {bgImage && appMode !== 'discussion' && appMode !== 't_fixture' && (
                                <div className="bg-slate-900 p-5 rounded-3xl shadow-xl border border-slate-800 flex flex-col gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 w-16 flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">Img 1 <IconMove className="w-3 h-3 text-rose-500"/></span>
                                        <IconZoomIn className="text-slate-500" />
                                        <input type="range" min="0.1" max="5" step="0.05" value={img1Pos.scale} onChange={(e) => setImg1Pos(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full flex-1" />
                                    </div>
                                    {bgImage2 && appMode !== 'statement' && appMode !== 'squad' && (
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 w-16 flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">Img 2 <IconMove className="w-3 h-3 text-blue-500"/></span>
                                            <IconZoomIn className="text-slate-500" />
                                            <input type="range" min="0.1" max="5" step="0.05" value={img2Pos.scale} onChange={(e) => setImg2Pos(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full flex-1" />
                                        </div>
                                    )}
                                    {avatarImage && appMode === 'statement' && (
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 w-16 flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800">Avatar <IconMove className="w-3 h-3 text-amber-500"/></span>
                                            <IconZoomIn className="text-slate-500" />
                                            <input type="range" min="0.1" max="5" step="0.05" value={avatarPos.scale} onChange={(e) => setAvatarPos(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full flex-1" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-full">
                            <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 flex flex-col flex-1 relative overflow-hidden h-[calc(100vh-140px)] lg:h-[85vh]">
                                <div className="p-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-20">
                                    <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                                        <button onClick={() => setActiveTab('match')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'match' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Content</button>
                                        {(appMode === 'scorecard' || appMode === 'schedule' || appMode === 'f_scorecard') && (
                                            <button onClick={() => setActiveTab('teams')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'teams' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Teams</button>
                                        )}
                                        <button onClick={() => setActiveTab('style')} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'style' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Style</button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6 overflow-y-auto custom-scroll flex-1">
                                    {activeTab === 'match' && (
                                        <div className="space-y-6">
                                            {appMode !== 'discussion' && appMode !== 't_fixture' && (
                                                <div className="flex gap-4">
                                                    <div className="relative group flex-1">
                                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-950/50 group-hover:bg-slate-800/80 group-hover:border-rose-500/50 transition-all">
                                                            <div className="bg-slate-800 p-3 rounded-full shadow-lg text-rose-500 group-hover:scale-110 transition-transform"><IconUpload /></div>
                                                            <span className="text-xs font-bold text-slate-400">Photo 1 (Main)</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative group flex-1">
                                                        {appMode === 'statement' ? (
                                                            avatarImage ? (
                                                                <div className="h-full border border-amber-500/30 bg-amber-500/5 rounded-2xl flex flex-col items-center justify-center relative shadow-inner p-4">
                                                                    <span className="text-xs font-bold text-amber-400 mb-2">Avatar Active</span>
                                                                    <button onClick={() => setAvatarImage(null)} className="flex items-center justify-center w-full gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-bold border border-slate-700 transition-colors z-20 relative"><IconTrash /> Remove</button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                                    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-950/50 group-hover:bg-slate-800/80 group-hover:border-amber-500/50 transition-all">
                                                                        <div className="bg-slate-800 p-3 rounded-full shadow-lg text-amber-500 group-hover:scale-110 transition-transform"><IconUser /></div>
                                                                        <span className="text-xs font-bold text-slate-400">Avatar</span>
                                                                    </div>
                                                                </>
                                                            )
                                                        ) : (
                                                            (appMode !== 'squad' && bgImage2) ? (
                                                                <div className="h-full border border-blue-500/30 bg-blue-500/5 rounded-2xl flex flex-col items-center justify-center relative shadow-inner p-4">
                                                                    <span className="text-xs font-bold text-blue-400 mb-2">Img 2 Active</span>
                                                                    <button onClick={() => setBgImage2(null)} className="flex items-center justify-center w-full gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-bold border border-slate-700 transition-colors z-20 relative"><IconTrash /> Remove</button>
                                                                </div>
                                                            ) : (
                                                                appMode !== 'squad' && (
                                                                    <>
                                                                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-slate-950/50 group-hover:bg-slate-800/80 group-hover:border-blue-500/50 transition-all">
                                                                            <div className="bg-slate-800 p-3 rounded-full shadow-lg text-blue-500 group-hover:scale-110 transition-transform"><IconUpload /></div>
                                                                            <span className="text-xs font-bold text-slate-400">{appMode === 'f_scorecard' ? 'Photo 2 (Inset Circle)' : 'Photo 2 (Opt)'}</span>
                                                                        </div>
                                                                    </>
                                                                )
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Badge Text</label>
                                                        <input type="text" name="badgeText" value={formData.badgeText} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="Badge" />
                                                    </div>
                                                    {appMode !== 'news' && appMode !== 'career' && appMode !== 'poll' && appMode !== 'milestone' && appMode !== 'statement' && appMode !== 'discussion' && appMode !== 'multi_result' && appMode !== 'multi_schedule' && appMode !== 'squad' && appMode !== 't_fixture' && appMode !== 'f_scorecard' && (
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Main Title</label>
                                                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="Tournament Name" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Footer / Handle</label>
                                                    <input type="text" name="footerHandle" value={formData.footerHandle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="e.g., @proscorecard_bot" />
                                                </div>
                                            </div>

                                            {/* NEW FOOTBALL SCORECARD TOOL EDITOR */}
                                            {appMode === 'f_scorecard' && (
                                                <div className="p-5 bg-emerald-500/10 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                                                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconFootball /> Football PRO Setup</h4>
                                                    
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Tournament Title</label>
                                                        <input type="text" name="fTourneyTitle" value={formData.fTourneyTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Match Status (e.g. ফুল টাইম)</label>
                                                        <input type="text" name="fMatchStatus" value={formData.fMatchStatus} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 't_fixture' && (
                                                <div className="p-5 bg-orange-500/10 rounded-2xl border-l-4 border-orange-500 shadow-inner space-y-4">
                                                    <h4 className="text-sm font-black text-orange-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconLayout /> Tournament Fixtures</h4>
                                                    
                                                    {/* Top Headers */}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Main Event Title (Use Enter to split lines)</label>
                                                            <textarea name="fixtureTitle" value={formData.fixtureTitle} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="Title..."></textarea>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Subtitle (Round / Season)</label>
                                                            <input type="text" name="fixtureSubtitle" value={formData.fixtureSubtitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="Subtitle" />
                                                        </div>
                                                    </div>

                                                    {/* Footers */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Footer 1 (Date / Opening)</label>
                                                            <input type="text" name="fixtureDateFooter" value={formData.fixtureDateFooter} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-orange-300 mb-1.5 block ml-1">Footer 2 (Organizer)</label>
                                                            <input type="text" name="fixtureOrganizerFooter" value={formData.fixtureOrganizerFooter} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-orange-500/30 rounded-xl text-sm font-bold text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
                                                        </div>
                                                    </div>

                                                    {/* Dynamic Matchups Array */}
                                                    <div className="space-y-4 mt-8 pt-6 border-t border-orange-500/20">
                                                        <h5 className="text-xs font-black text-slate-300 uppercase tracking-widest text-center">Matchups List</h5>
                                                        
                                                        {formData.matchupList.map((match, index) => (
                                                            <div key={match.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 relative group transition-all hover:border-orange-500/30">
                                                                <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-0.5 rounded text-[10px] font-bold text-slate-300 shadow-sm border border-slate-700">Match {index + 1}</div>
                                                                <button onClick={() => removeMatchup(match.id)} className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20" title="Delete"><IconTrash /></button>
                                                                
                                                                <div className="mt-3 mb-2">
                                                                    <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Match Date / Info</label>
                                                                    <input type="text" value={match.date} onChange={(e) => handleMatchupChange(match.id, 'date', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white focus:border-orange-500 transition-colors" placeholder="e.g. 20 Mar" />
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                                    <div className="space-y-2">
                                                                        <div>
                                                                            <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Team</label>
                                                                            <input type="text" value={match.t1} onChange={(e) => handleMatchupChange(match.id, 't1', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-orange-500 transition-colors" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Sub-Text</label>
                                                                            <input type="text" value={match.t1Sub} onChange={(e) => handleMatchupChange(match.id, 't1Sub', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 focus:border-orange-500 transition-colors" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <div>
                                                                            <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Team</label>
                                                                            <input type="text" value={match.t2} onChange={(e) => handleMatchupChange(match.id, 't2', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-orange-500 transition-colors" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Sub-Text</label>
                                                                            <input type="text" value={match.t2Sub} onChange={(e) => handleMatchupChange(match.id, 't2Sub', e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 focus:border-orange-500 transition-colors" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button onClick={addMatchup} className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-orange-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-orange-500/30 hover:border-orange-500/60 transition-all">+ Add Fixture Match</button>
                                                </div>
                                            )}
                                            
                                            {appMode === 'squad' && (
                                                <div className="p-5 bg-green-500/10 rounded-2xl border-l-4 border-green-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-green-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconUsers /> Squad Builder</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-green-300 mb-1.5 block ml-1">Series Title (Red Box)</label>
                                                        <input type="text" name="squadTitle" value={formData.squadTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-green-500/30 rounded-xl text-sm font-bold text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-green-300 mb-1.5 block ml-1">Player List (Enter names on new lines)</label>
                                                        <textarea name="squadList" value={formData.squadList} onChange={handleChange} rows="10" className="w-full px-4 py-3 bg-slate-900 border border-green-500/30 rounded-xl text-sm font-medium text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all leading-relaxed whitespace-pre" placeholder="List players here..."></textarea>
                                                        <p className="text-[10px] text-slate-500 mt-2">💡 Tip: Use <b>(c)</b>, <b>(wk)</b>, or <b>(captain)</b> next to a name to highlight it in yellow.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 'multi_result' && (
                                                <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/20 shadow-inner space-y-4">
                                                    <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconList /> Results Builder</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-rose-300 mb-1.5 block ml-1">Main Headline</label>
                                                        <input type="text" name="multiResultTitle" value={formData.multiResultTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-rose-500/30 rounded-xl text-sm font-bold text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                                                    </div>
                                                    
                                                    <div className="space-y-4 mt-6">
                                                        {formData.resultsList.map((res, index) => (
                                                            <div key={res.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 relative group transition-all hover:border-slate-700">
                                                                <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-0.5 rounded text-[10px] font-bold text-slate-300 shadow-sm border border-slate-700">Match {index + 1}</div>
                                                                <button onClick={() => removeResult(res.id)} className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20" title="Delete"><IconTrash /></button>
                                                                
                                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Team</label><input type="text" value={res.team1} onChange={(e) => handleResultChange(res.id, 'team1', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-colors" /></div>
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Team</label><input type="text" value={res.team2} onChange={(e) => handleResultChange(res.id, 'team2', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-colors" /></div>
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Left Score</label><input type="text" value={res.score1} onChange={(e) => handleResultChange(res.id, 'score1', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white text-center focus:border-rose-500 transition-colors" /></div>
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Right Score</label><input type="text" value={res.score2} onChange={(e) => handleResultChange(res.id, 'score2', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white text-center focus:border-rose-500 transition-colors" /></div>
                                                                </div>
                                                                <div className="mt-4"><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Tournament</label><input type="text" value={res.tourney} onChange={(e) => handleResultChange(res.id, 'tourney', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 transition-colors" /></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button onClick={addResult} className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-rose-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-rose-500/30 hover:border-rose-500/60 transition-all">+ Add Match Result</button>
                                                </div>
                                            )}

                                            {appMode === 'multi_schedule' && (
                                                <div className="p-5 bg-sky-500/5 rounded-2xl border border-sky-500/20 shadow-inner space-y-4">
                                                    <h4 className="text-sm font-black text-sky-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconGrid /> Schedule Builder</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-sky-300 mb-1.5 block ml-1">Schedule Date</label>
                                                            <input type="text" name="multiScheduleDate" value={formData.multiScheduleDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-sky-500/30 rounded-xl text-sm font-bold text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-sky-300 mb-1.5 block ml-1">Main Headline</label>
                                                            <input type="text" name="multiScheduleTitle" value={formData.multiScheduleTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-sky-500/30 rounded-xl text-sm font-bold text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-4 mt-6">
                                                        {formData.scheduleList.map((sch, index) => (
                                                            <div key={sch.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 relative group transition-all hover:border-slate-700">
                                                                <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-0.5 rounded text-[10px] font-bold text-slate-300 shadow-sm border border-slate-700">Fixture {index + 1}</div>
                                                                <button onClick={() => removeSchedule(sch.id)} className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20" title="Delete"><IconTrash /></button>
                                                                
                                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Sport Type</label><input type="text" value={sch.sport} onChange={(e) => handleScheduleChange(sch.id, 'sport', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 transition-colors" placeholder="e.g. ফুটবল" /></div>
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Tournament</label><input type="text" value={sch.tourney} onChange={(e) => handleScheduleChange(sch.id, 'tourney', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-sky-500 transition-colors" /></div>
                                                                </div>
                                                                <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Match / Teams</label><input type="text" value={sch.match} onChange={(e) => handleScheduleChange(sch.id, 'match', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-sky-500 transition-colors" /></div>
                                                                    <div><label className="text-[9px] uppercase font-bold text-slate-500 mb-1 block ml-1">Time</label><input type="text" value={sch.time} onChange={(e) => handleScheduleChange(sch.id, 'time', e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white text-center focus:border-sky-500 transition-colors" /></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button onClick={addSchedule} className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-sky-500/30 hover:border-sky-500/60 transition-all">+ Add Schedule Item</button>
                                                </div>
                                            )}

                                            {appMode === 'discussion' && (
                                                <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 shadow-inner space-y-4">
                                                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-4"><IconHelp /> Q&A / Discussion</h4>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className="text-[10px] uppercase font-bold text-emerald-300 ml-1">Topic / Main Heading</label>
                                                        </div>
                                                        <input type="text" name="discTopic" value={formData.discTopic} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                    </div>
                                                    <div className="pt-2">
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <label className="text-[10px] uppercase font-bold text-emerald-300 ml-1">Discussion Lines (Auto Wraps)</label>
                                                        </div>
                                                        <textarea name="discLine1" value={formData.discLine1} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all mb-3" placeholder="Line 1 (Accent Color)"></textarea>
                                                        <textarea name="discLine2" value={formData.discLine2} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all mb-3" placeholder="Line 2 (White Color)"></textarea>
                                                        <textarea name="discLine3" value={formData.discLine3} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Line 3 (Accent Color)"></textarea>
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 'poll' && (
                                                <div className="p-5 bg-indigo-500/10 rounded-2xl border-l-4 border-indigo-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconChart /> Reaction Poll Settings</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-indigo-300 mb-1.5 block ml-1">Poll Question / Headline</label>
                                                        <input type="text" name="pollQuestion" value={formData.pollQuestion} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-indigo-500/30 rounded-xl text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-blue-400 mb-1.5 block ml-1">👍 Left Player</label>
                                                            <input type="text" name="pollPlayer1" value={formData.pollPlayer1} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-rose-400 mb-1.5 block ml-1">❤️ Right Player</label>
                                                            <input type="text" name="pollPlayer2" value={formData.pollPlayer2} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-rose-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                                                        </div>
                                                    </div>
                                                    <button onClick={swapTeams} className="w-full py-3 mt-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-indigo-500/30"><IconSwap /> Swap Players</button>
                                                </div>
                                            )}

                                            {appMode === 'milestone' && (
                                                <div className="p-5 bg-yellow-500/10 rounded-2xl border-l-4 border-yellow-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconStar /> Birthday & Milestone</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Occasion Type</label>
                                                            <input type="text" name="milestoneOccasion" value={formData.milestoneOccasion} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-sm font-bold text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" placeholder="e.g. শুভ জন্মদিন" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Player Name</label>
                                                            <input type="text" name="milestoneName" value={formData.milestoneName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-sm font-bold text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Main Highlight (Age / Record)</label>
                                                        <input type="text" name="milestoneNumber" value={formData.milestoneNumber} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-xl font-black text-white text-center tracking-wide focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" placeholder="e.g. ১০,০০০ রান" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-yellow-300 mb-1.5 block ml-1">Sub-Message</label>
                                                        <textarea name="milestoneMessage" value={formData.milestoneMessage} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-yellow-500/30 rounded-xl text-sm text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all" placeholder="Wishing text..."></textarea>
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 'scorecard' && (
                                                <div>
                                                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 block ml-1">Match Result Headline</label>
                                                    <textarea name="result" value={formData.result} onChange={handleChange} rows="2" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="Result Text"></textarea>
                                                </div>
                                            )}

                                            {appMode === 'schedule' && (
                                                <div className="p-5 bg-blue-500/10 rounded-2xl border-l-4 border-blue-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconCalendar /> Match Details</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-blue-300 mb-1.5 block ml-1">Date</label>
                                                        <input type="text" name="matchDate" value={formData.matchDate} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Date" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-blue-300 mb-1.5 block ml-1">Time</label>
                                                            <input type="text" name="matchTime" value={formData.matchTime} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Time" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-blue-300 mb-1.5 block ml-1">Venue</label>
                                                            <input type="text" name="matchVenue" value={formData.matchVenue} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-blue-500/30 rounded-xl text-sm font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Venue" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 'player' && (
                                                <div className="p-5 bg-emerald-500/10 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconUser /> Player Stats</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Player Name</label>
                                                        <input type="text" name="playerName" value={formData.playerName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Player Name" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Primary Stat</label>
                                                            <input type="text" name="playerStatMain" value={formData.playerStatMain} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-xl font-black text-center text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Run/Wicket" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] uppercase font-bold text-emerald-300 mb-1.5 block ml-1">Sub Stat</label>
                                                            <input type="text" name="playerStatSub" value={formData.playerStatSub} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-emerald-500/30 rounded-xl text-sm font-bold text-center text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="Balls/Econ" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 'career' && (
                                                <div className="p-5 bg-cyan-500/10 rounded-2xl border-l-4 border-cyan-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconChart /> Career Statistics</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Player Name</label><input type="text" name="playerName" value={formData.playerName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Role</label><input type="text" name="playerRole" value={formData.playerRole} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Matches</label><input type="text" name="careerMatches" value={formData.careerMatches} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Total Runs</label><input type="text" name="careerRuns" value={formData.careerRuns} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">100s</label><input type="text" name="careerHundreds" value={formData.careerHundreds} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">50s</label><input type="text" name="careerFifties" value={formData.careerFifties} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Best Score</label><input type="text" name="careerBest" value={formData.careerBest} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                        <div><label className="text-[10px] uppercase font-bold text-cyan-300 mb-1.5 block ml-1">Wickets</label><input type="text" name="careerWickets" value={formData.careerWickets} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/30 rounded-xl text-sm font-bold text-white text-center focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" /></div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {appMode === 'news' && (
                                                <div className="p-5 bg-red-500/10 rounded-2xl border-l-4 border-red-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconMegaphone /> Breaking News</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-red-300 mb-1.5 block ml-1">News Body / Quote Text</label>
                                                        <textarea name="quoteText" value={formData.quoteText} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-900 border border-red-500/30 rounded-xl text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" placeholder="Enter content..."></textarea>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-red-300 mb-1.5 block ml-1">Headline / Author / Source</label>
                                                        <input type="text" name="quoteAuthor" value={formData.quoteAuthor} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-red-500/30 rounded-xl text-sm font-bold text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" placeholder="Author/Source" />
                                                    </div>
                                                </div>
                                            )}

                                            {appMode === 'statement' && (
                                                <div className="p-5 bg-fuchsia-500/10 rounded-2xl border-l-4 border-fuchsia-500 shadow-inner space-y-4">
                                                    <h4 className="text-xs font-black text-fuchsia-400 uppercase tracking-wider flex items-center gap-2 mb-2"><IconMessage /> Statement / Quote Overlay</h4>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-fuchsia-300 mb-1.5 block ml-1">Statement Text</label>
                                                        <textarea name="quoteText" value={formData.quoteText} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-900 border border-fuchsia-500/30 rounded-xl text-sm text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all" placeholder="Enter statement..."></textarea>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-fuchsia-300 mb-1.5 block ml-1">Author Name / Credit</label>
                                                        <input type="text" name="quoteAuthor" value={formData.quoteAuthor} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-fuchsia-500/30 rounded-xl text-sm font-bold text-white focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all" placeholder="Author name" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {activeTab === 'teams' && (appMode === 'scorecard' || appMode === 'schedule' || appMode === 'f_scorecard') && (
                                        <div className="space-y-6">
                                            <button onClick={swapTeams} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-slate-700 shadow-sm"><IconSwap /> Swap Sides</button>
                                            
                                            <div className="bg-slate-950 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Left Team</h3>
                                                    <input type="color" name="team1Color" value={formData.team1Color} onChange={handleChange} className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-800 cursor-pointer shadow-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Full Team Name</label>
                                                    <input type="text" name="team1" value={formData.team1} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                </div>
                                                
                                                {appMode === 'f_scorecard' && (
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Short Name (Badge Text)</label>
                                                        <input type="text" name="fTeam1Short" value={formData.fTeam1Short} onChange={handleChange} maxLength="4" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase" placeholder="e.g. BAN" />
                                                    </div>
                                                )}

                                                {(appMode === 'scorecard' || appMode === 'f_scorecard') && (
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Score / Goals</label>
                                                            <input type="text" name="team1Score" value={formData.team1Score} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                        </div>
                                                        {appMode === 'scorecard' && (
                                                            <div className="w-28">
                                                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Overs</label>
                                                                <input type="text" name="team1Overs" value={formData.team1Overs} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="bg-slate-950 p-5 rounded-2xl border-l-4 border-emerald-500 shadow-inner space-y-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">Right Team</h3>
                                                    <input type="color" name="team2Color" value={formData.team2Color} onChange={handleChange} className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-800 cursor-pointer shadow-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Full Team Name</label>
                                                    <input type="text" name="team2" value={formData.team2} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                </div>

                                                {appMode === 'f_scorecard' && (
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Short Name (Badge Text)</label>
                                                        <input type="text" name="fTeam2Short" value={formData.fTeam2Short} onChange={handleChange} maxLength="4" className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase" placeholder="e.g. PAK" />
                                                    </div>
                                                )}

                                                {(appMode === 'scorecard' || appMode === 'f_scorecard') && (
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Score / Goals</label>
                                                            <input type="text" name="team2Score" value={formData.team2Score} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                                        </div>
                                                        {appMode === 'scorecard' && (
                                                            <div className="w-28">
                                                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block ml-1">Overs</label>
                                                                <input type="text" name="team2Overs" value={formData.team2Overs} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {activeTab === 'style' && (
                                        <div className="space-y-6">
                                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                                                <label className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-wider mb-4"><IconEye className="text-rose-500"/> Background Opacity</label>
                                                <div className="px-2">
                                                    <input type="range" min="0" max="1" step="0.05" value={formData.bgOpacity} onChange={(e) => setFormData({...formData, bgOpacity: parseFloat(e.target.value)})} className="w-full" />
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2 uppercase"><span>Clear</span><span>Dark</span></div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                                                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-4">Colors</label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Primary Color</label>
                                                        <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                                    </div>
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Secondary Color</label>
                                                        <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 mt-4">
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Accent / Team 1</label>
                                                        <input type="color" name="team1Color" value={formData.team1Color} onChange={handleChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                                    </div>
                                                    <div className="flex-1 space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Accent / Team 2</label>
                                                        <input type="color" name="team2Color" value={formData.team2Color} onChange={handleChange} className="h-12 w-full rounded-xl cursor-pointer border-0 p-0 bg-transparent" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {appMode === 'news' && (
                                                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
                                                    <label className="flex items-center gap-2 text-xs font-black text-slate-300 uppercase tracking-wider mb-4"><IconHeight className="text-rose-500"/> News Overlay Height</label>
                                                    <div className="px-2">
                                                        <input type="range" min="0.2" max="0.9" step="0.05" value={formData.newsGradientHeight} onChange={(e) => setFormData({...formData, newsGradientHeight: parseFloat(e.target.value)})} className="w-full" />
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2 uppercase"><span>Low</span><span>High</span></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-900 mt-auto z-10 relative">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-slate-900 p-3 rounded-2xl shadow-inner border border-slate-800">
                            <IconLogo className="text-slate-600 w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-300 tracking-wide">© {new Date().getFullYear()} Poster Bot Pro</p>
                    <p className="text-xs font-medium text-slate-600 max-w-sm mx-auto">Premium sports graphic generator for professional creators.</p>
                    <div className="flex justify-center gap-6 pt-6 text-xs font-bold uppercase tracking-wider">
                        <a href="https://t.me/Mizan0072" target="_blank" rel="noreferrer" className="hover:text-rose-400 transition-colors flex items-center gap-2"><IconTg className="w-4 h-4" /> Support & Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
