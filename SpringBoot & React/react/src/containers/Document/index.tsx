import React from 'react';
import { Document } from 'components/organisms';
import { withBaseComponents } from 'components/HOC';
import { Routes, Route } from 'react-router';

import Help from './Help';
import COC from './COC';
import Terms from './Terms';
import Privacy from './Privacy';
import PaymentAgreement from './PaymentAgreement';

const navs = [
	{
		to: '/document/help',
		text: "헬프 데스크"
	},
	{
		to: '/document/code-of-conduct',
		text: "COC"
	},
	{
		to: '/document/terms',
		text: "이용약관"
	},
	{
		to: '/document/privacy',
		text: "개인정보처리방침"
	},
	{
		to: '/document/payment-agreement',
		text: "결제정보제공동의"
	}
];

const DocumentTemplate = () => (
		<Document navs={navs}>
			<Routes>
				<Route path="help" element={<Help />} />
				<Route path="code-of-conduct" element={<COC />} />
				<Route path="terms" element={<Terms />} />
				<Route path="privacy" element={<Privacy />} />
				<Route path="payment-agreement" element={<PaymentAgreement />} />
			</Routes>
		</Document>
	);

export default React.memo(withBaseComponents(DocumentTemplate));