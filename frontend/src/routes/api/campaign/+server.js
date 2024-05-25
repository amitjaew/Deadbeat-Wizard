import { queryDatabase } from '$lib/db';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { name, description } = JSON.parse(request.body);

        const result = await queryDatabase(
            `INSERT INTO campaigns (name, description) VALUES (?, ?)`,
            [name, description]
        );

        return json({ success: true, message: 'Campaign created successfully', result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

export async function GET({ request }) {
    try {
        const { id } = JSON.parse(request.body) || { id: null };

        let query = `SELECT * FROM campaigns`;
        let params = [];

        if (id) {
            query += ` WHERE id = ?`;
            params.push(id);
        }

        const result = await queryDatabase(query, params);

        return json({ success: true, data: result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

export async function PATCH({ request }) {
    try {
        const { id, name, description } = JSON.parse(request.body);

        const result = await queryDatabase(
            `UPDATE campaigns SET name = ?, description = ? WHERE id = ?`,
            [name, description, id]
        );

        return json({ success: true, message: 'Campaign updated successfully', result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

export async function DELETE({ request }) {
    try {
        const { id } = JSON.parse(request.body);

        const result = await queryDatabase(`DELETE FROM campaigns WHERE id = ?`, id);

        return json({ success: true, message: 'Campaign deleted successfully', result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

