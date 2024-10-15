import type { PageLoad } from './$types';
import { newCrossword } from '$lib/crossword';

export const load: PageLoad = ({ params }) => {
	if (params.puzzle_id === 'new') {
		return newCrossword(15);
	} else return newCrossword(15)
};
