import React from 'react';
import styles from './ContentList.module.scss';
import { ContentItem, ContentItemProps } from 'components/molecules';

export type ContentListProps = {
	title: string;
	description: string;
	contents: Array<ContentItemProps>;
};

const ContentList = ({ title, description, contents } : ContentListProps) => {
	return (
		<ul className={styles.box}>
			<li className={styles.title}>{title}</li>
			<li className={styles.description}>{description}</li>
			<li className={styles.container}>
				{contents.map(content => (
					<ContentItem {...content} key={content.to} />
				))}
			</li>
		</ul>
	);
};

export default React.memo(ContentList);