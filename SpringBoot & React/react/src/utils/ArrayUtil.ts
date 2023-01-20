export function isEmpty(array?: Array<any> | null): array is undefined | null {
	return (!Array.isArray(array) || array.length < 1);
}

export function contains<T>(array?: Array<T> | null, findValue?: T | null) {
	if(isEmpty(array)) return false;

	return array.findIndex(value => value === findValue) !== -1;
}

export function equals<T>(lhs: Array<T>, rhs: Array<T>) {
	if(lhs.length !== rhs.length) return true;

	for(let i = 0; i < lhs.length; i++) {
		if(!contains(rhs, lhs[i])) return true;
	}

	return false;
}

export function containsOrganizer(array: Array<Organizer>, findOrganizer?: Organizer['id']) {
	if(isEmpty(array)) return false;
	if(!findOrganizer) return false;

	return array.findIndex(organizer => organizer.id === findOrganizer) !== -1;
}

const ArrayUtil = { isEmpty, contains, equals, containsOrganizer };
export default ArrayUtil;