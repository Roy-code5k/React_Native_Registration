import React, { createContext, useContext, useState } from 'react';

export const TRANSLATIONS = {
  ENG: {
    // Navigation & Headers
    goBack: 'Go back',
    home: 'Home',
    explore: 'Explore',
    competitions: 'Competitions',
    profile: 'Profile',
    myProfile: 'My Profile',
    backToCompetition: 'Back to Competition',
    fetchingDetails: 'Fetching Competition Details...',
    failedLoad: 'Failed to load competition',
    retry: 'Retry',

    // Competition Stats & Header
    prizePool: 'Prize Pool',
    entryFee: 'Entry Fee',
    spotsLeft: 'Only {count} spots left',
    allSpotsFilled: 'All spots filled',
    booked: '{current} / {max} Booked',
    registered: 'Registered',
    full: 'Full',

    // Judge Card
    judgeLabel: 'Judge',
    watchIntro: 'Watch Intro',
    introVideo: 'Intro Video',
    experience: 'Experience',

    // Countdown Card
    countdown: {
      registrationClosesIn: 'Registration Closes In',
      submissionsOpenIn: 'Submissions Open In',
      submissionsCloseIn: 'Submissions Close In',
      resultsIn: 'Results In',
      closed: 'Registration has ended for this round',
      hurryUp: 'Hurry up!',
      days: 'Days',
      hours: 'Hours',
      mins: 'Mins',
      secs: 'Secs',
    },

    // Dates
    dates: {
      importantDates: 'Important Dates',
      registerBefore: 'Register Before',
      registrationStarts: 'Registration Starts',
      registrationEnds: 'Registration Ends',
      submissionStarts: 'Submission Starts',
      submissionEnds: 'Submission Ends',
      resultsDate: 'Result Date',
    },

    // Tabs
    tabs: {
      about: 'About Competition',
      judging: 'Judging Parameters',
      rules: 'Rules & Eligibility',
      rewards: 'Rewards Pool',
      viewMore: 'View more',
      viewLess: 'View less',
      highlightsTitle: 'Competition Highlights:',
      officialRules: 'Official Rules:',
      eligibilityCriteria: 'Eligibility Criteria:',
    },

    // Rewards
    rewardsSection: {
      title: 'Rewards',
      allPositions: '(All Positions)',
    },

    // Sticky Actions & Buttons
    sticky: {
      registerNow: 'Register Now',
      uploadSubmission: 'Upload Submission',
      submissionUploaded: 'Submission Uploaded',
      underEvaluation: 'Under Evaluation by Judge',
      registered: 'Registered',
      submissionWindowPending: 'Submission Window Pending',
      competitionFull: 'Competition Full',
      noSpotsRemaining: 'No spots remaining',
      viewResults: 'View Results',
      winnersAnnounced: 'Winners Announced',
      registrationClosed: 'Registration Closed',
      entryWindowEnded: 'Entry window has ended',
    },

    // Trust & Guarantee
    trustBadges: {
      guaranteed: '100% Genuine & Verified Competition',
      safePayments: 'Secured via Razorpay & UPI Payments',
      referralTitle: 'Refer a Friend & Earn ₹10',
      referralDesc: 'Share your referral code with fellow dancers and get rewarded for every confirmed booking.',
    },

    // Modals
    submissionModal: {
      title: 'Submit Your Video Entry',
      entryTitle: 'Entry Title',
      videoUrl: 'Video URL (Google Drive / YouTube / Cloud)',
      caption: 'Caption / Performance Notes',
      submitBtn: 'Submit Entry',
      cancelBtn: 'Cancel',
    },

    // Auth & Profile
    auth: {
      logIn: 'Log In',
      signUp: 'Sign Up',
      logOut: 'Log Out',
      welcome: 'Welcome to Feedants',
      createAccount: 'Create your participant account',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      createBtn: 'Create Account',
      loginBtn: 'Log In to Feedants',
      demoFill: 'Quick Fill Demo User (demo@example.com)',
      verifiedParticipant: 'Verified Feedants Participant',
      accountDetails: 'Account Details',
      referralCode: 'Your Referral Code',
    },

    // Home & Explore
    homeScreen: {
      tagline: 'Online Talent Competitions',
      featured: 'FEATURED EVENT',
      browseCompetitions: 'Browse Competitions',
      allEvents: 'All Events',
      open: '🟢 Open',
      submissions: '🟡 Submissions',
      results: '🟣 Results Out',
      viewDetails: 'View Details & Register',
      searchPlaceholder: 'Search competitions, categories, judges...',
    },
  },

  HI: {
    // Navigation & Headers
    goBack: 'वापस जाएं',
    home: 'होम',
    explore: 'खोजें',
    competitions: 'प्रतियोगिताएं',
    profile: 'प्रोफ़ाइल',
    myProfile: 'मेरी प्रोफ़ाइल',
    backToCompetition: 'प्रतियोगिता पर वापस जाएं',
    fetchingDetails: 'प्रतियोगिता विवरण लोड हो रहा है...',
    failedLoad: 'प्रतियोगिता लोड करने में असमर्थ',
    retry: 'पुनः प्रयास करें',

    // Competition Stats & Header
    prizePool: 'पुरस्कार राशि',
    entryFee: 'प्रवेश शुल्क',
    spotsLeft: 'केवल {count} स्थान शेष',
    allSpotsFilled: 'सभी स्थान भर चुके हैं',
    booked: '{current} / {max} बुक',
    registered: 'पंजीकृत',
    full: 'पूर्ण',

    // Judge Card
    judgeLabel: 'निर्णायक',
    watchIntro: 'परिचय देखें',
    introVideo: 'परिचय वीडियो',
    experience: 'अनुभव',

    // Countdown Card
    countdown: {
      registrationClosesIn: 'पंजीकरण समाप्त होने में शेष',
      submissionsOpenIn: 'सबमिशन शुरू होने में शेष',
      submissionsCloseIn: 'सबमिशन समाप्त होने में शेष',
      resultsIn: 'परिणाम आने में शेष',
      closed: 'इस दौर के लिए पंजीकरण समाप्त हो चुका है',
      hurryUp: 'जल्दी करें!',
      days: 'दिन',
      hours: 'घंटे',
      mins: 'मिनट',
      secs: 'सेकंड',
    },

    // Dates
    dates: {
      importantDates: 'महत्वपूर्ण तिथियां',
      registerBefore: 'पंजीकरण अंतिम तिथि',
      registrationStarts: 'पंजीकरण शुरू',
      registrationEnds: 'पंजीकरण समाप्त',
      submissionStarts: 'प्रविष्टि सबमिशन शुरू',
      submissionEnds: 'प्रविष्टि सबमिशन समाप्त',
      resultsDate: 'परिणाम तिथि',
    },

    // Tabs
    tabs: {
      about: 'प्रतियोगिता विवरण',
      judging: 'निर्णायक मानदंड',
      rules: 'नियम और पात्रता',
      rewards: 'पुरस्कार पूल',
      viewMore: 'और देखें',
      viewLess: 'कम देखें',
      highlightsTitle: 'प्रतियोगिता मुख्य विशेषताएं:',
      officialRules: 'आधिकारिक नियम:',
      eligibilityCriteria: 'पात्रता मानदंड:',
    },

    // Rewards
    rewardsSection: {
      title: 'पुरस्कार',
      allPositions: '(सभी स्थान)',
    },

    // Sticky Actions & Buttons
    sticky: {
      registerNow: 'अभी पंजीकरण करें',
      uploadSubmission: 'प्रविष्टि अपलोड करें',
      submissionUploaded: 'प्रविष्टि अपलोड की गई',
      underEvaluation: 'निर्णायक द्वारा मूल्यांकन जारी',
      registered: 'पंजीकृत',
      submissionWindowPending: 'सबमिशन विंडो प्रतीक्षित',
      competitionFull: 'स्थान भर चुके हैं',
      noSpotsRemaining: 'कोई स्थान शेष नहीं',
      viewResults: 'परिणाम देखें',
      winnersAnnounced: 'विजेता घोषित',
      registrationClosed: 'पंजीकरण समाप्त',
      entryWindowEnded: 'प्रवेश विंडो समाप्त हो चुकी है',
    },

    // Trust & Guarantee
    trustBadges: {
      guaranteed: '100% प्रामाणिक एवं सत्यापित प्रतियोगिता',
      safePayments: 'रेज़रपे एवं यूपीआई द्वारा सुरक्षित भुगतान',
      referralTitle: 'मित्र को आमंत्रित करें और ₹10 कमाएं',
      referralDesc: 'अपने साथी नर्तकियों के साथ रेफरल कोड साझा करें और प्रत्येक पुष्टि पर पुरस्कार पाएं।',
    },

    // Modals
    submissionModal: {
      title: 'अपनी वीडियो प्रविष्टि सबमिट करें',
      entryTitle: 'प्रविष्टि का शीर्षक',
      videoUrl: 'वीडियो लिंक (गूगल ड्राइव / यूट्यूब)',
      caption: 'प्रदर्शन विवरण / टिप्पणी',
      submitBtn: 'प्रविष्टि सबमिट करें',
      cancelBtn: 'रद्द करें',
    },

    // Auth & Profile
    auth: {
      logIn: 'लॉग इन',
      signUp: 'साइन अप',
      logOut: 'लॉग आउट',
      welcome: 'फीडेंट्स में आपका स्वागत है',
      createAccount: 'अपना प्रतिभागी खाता बनाएं',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      createBtn: 'खाता बनाएं',
      loginBtn: 'फीडेंट्स में लॉग इन करें',
      demoFill: 'डेमो उपयोगकर्ता भरें (demo@example.com)',
      verifiedParticipant: 'सत्यापित फीडेंट्स प्रतिभागी',
      accountDetails: 'खाता विवरण',
      referralCode: 'आपका रेफरल कोड',
    },

    // Home & Explore
    homeScreen: {
      tagline: 'ऑनलाइन प्रतिभा प्रतियोगिताएं',
      featured: 'विशेष कार्यक्रम',
      browseCompetitions: 'प्रतियोगिताएं देखें',
      allEvents: 'सभी कार्यक्रम',
      open: '🟢 खुले हैं',
      submissions: '🟡 सबमिशन',
      results: '🟣 परिणाम घोषित',
      viewDetails: 'विवरण देखें और पंजीकरण करें',
      searchPlaceholder: 'प्रतियोगिता, श्रेणी या निर्णायक खोजें...',
    },
  },
};

const LanguageContext = createContext({
  language: 'ENG',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ENG');

  // Helper function to resolve dot-notation keys like 'tabs.description'
  const t = (path, params = {}) => {
    const keys = path.split('.');
    let current = TRANSLATIONS[language] || TRANSLATIONS.ENG;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = TRANSLATIONS.ENG;
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
        }
        current = fallback || path;
        break;
      }
    }

    if (typeof current === 'string') {
      let result = current;
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(`{${pKey}}`, pVal);
      }
      return result;
    }

    return current || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
