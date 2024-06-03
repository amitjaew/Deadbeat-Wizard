import { queryDatabase } from '$lib/db';
import { error } from '@sveltejs/kit';

export const load = async ({url}) => {
    try {
        let captureId = url.searchParams.get('capture_id');
        if (!captureId) return { capture: null };

        let query = `SELECT * FROM captures WHERE id = ?`;
        let params = [captureId];

        const result = await queryDatabase(query, params);
        return {
            capture: result[0]
        };
    } catch (err) {
        throw error(err.status || 500, err.message || 'Internal Server Error');
    }
}
