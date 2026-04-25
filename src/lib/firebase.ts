import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCtcVnuNmxHsSuh_7WJcsWR3OyGEOW_U0s",
  authDomain: "adsenseblog-5cc6a.firebaseapp.com",
  projectId: "adsenseblog-5cc6a",
  storageBucket: "adsenseblog-5cc6a.firebasestorage.app",
  messagingSenderId: "396327708483",
  appId: "1:396327708483:web:6384c4022372e8cd5471f6",
  measurementId: "G-9ZFTXFDG6C"
};

export const app = initializeApp(firebaseConfig);

// Analytics는 브라우저 환경에서만 초기화
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
