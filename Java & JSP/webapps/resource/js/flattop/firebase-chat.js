(function() {
	import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
	import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";

	const firebaseConfig = {
		apiKey: "AIzaSyAepoa5pMAGxB8C4jUCZbaUXb1yF6fRago",
		authDomain: "flattop-chat.firebaseapp.com",
		projectId: "flattop-chat",
		storageBucket: "flattop-chat.appspot.com",
		messagingSenderId: "566019965122",
		appId: "1:566019965122:web:537d643730256373e9bb5b",
		measurementId: "G-WLMZPZZ5BC"
	};

	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);



	
})();