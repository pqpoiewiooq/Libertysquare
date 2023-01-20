import React from 'react';
import styles from './ContentCardList.module.scss';
import { ContentCard, ContentCardProps } from 'components/molecules';

export type ContentCardListProps = {
	description?: string;
	contents: Array<ContentCardProps>;
};

const ContentCardList = ({ description, contents } : ContentCardListProps) => {
	console.log(contents);
	return (
		<>
			{ description && <p>{description}</p> }
			<article className={styles.container}>
				{contents.map(content => (
					<ContentCard {...content} key={content.to} />
				))}
			</article>
		</>
	);
};

export default React.memo(ContentCardList);