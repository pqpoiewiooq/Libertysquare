import { useCallback, useMemo } from 'react';
import styles from './PreviewItemList.module.scss';
import { PreviewItem, PreviewItemProps } from 'components/atoms';

export type PreviewItemListType = Array<Omit<PreviewItemProps, "onClick" | "index">>;

type PreviewItemListProps = {
	list: PreviewItemListType;
	onClickItem?: (index: number) => void;
};

const PreviewItemList = ({ list, onClickItem } : PreviewItemListProps) => {
	const onClickHandler = useCallback(
		(event, index) => {
			onClickItem?.(index);
		}, [onClickItem]
	);

	function renderItems(list: PreviewItemListType) {
		let result = [];
		for(let i = 0; i < list.length; i++) {
			result.push(<PreviewItem {...list[i]} key={i} index={i} onClick={onClickHandler} />);
		}
		return result;
	}

	const items = useMemo(() => renderItems(list), [list]);

	return (
		<div className={styles.list}>
			{items}
		</div>
	)
};

export default PreviewItemList;