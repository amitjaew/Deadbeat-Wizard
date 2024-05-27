import { queryDatabase } from '$lib/db';
import { error, json } from '@sveltejs/kit';

export const load = async ({params}) => {
    try {
        let query = `SELECT * FROM captures`;
        let params = [];

        const result = await queryDatabase(query, params);
        console.log(result);
        return {
            captures: result
        };
    } catch (err) {
        throw error(err.status || 500, err.message || 'Internal Server Error');
    }
}
