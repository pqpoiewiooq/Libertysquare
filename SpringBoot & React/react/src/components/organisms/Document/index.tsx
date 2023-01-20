import React from 'react';
import styles from './Document.module.scss';
import { SelectableNav } from 'components/atoms';

type DocumentProps = {
    navs: Array<{to: string, text: string}>;
    children?: React.ReactNode;
};

const Document = ({ navs, children } : DocumentProps) => {
	return (
        <main className={styles.container}>
            <nav className={styles.lnb}>
                {navs.map(nav => <SelectableNav to={nav.to} size="large" key={nav.to}>{nav.text}</SelectableNav>)}
            </nav>

            <div className={styles.formatter}>
                {children}
            </div>
        </main>
	);
};

export default React.memo(Document);