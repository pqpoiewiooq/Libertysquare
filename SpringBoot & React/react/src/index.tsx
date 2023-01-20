import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from "react-redux";
import ScrollToTop from 'common/ScrollToTop';


import App from './App';
import store from 'store';
import './index.scss';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<HelmetProvider>
				<Provider store={store}>
					<ScrollToTop />
					<App />
				</Provider>
			</HelmetProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);