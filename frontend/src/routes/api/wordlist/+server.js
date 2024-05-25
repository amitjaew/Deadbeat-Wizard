import { queryDatabase } from '$lib/db';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { name, description } = JSON.parse(request.body);

        const result = await queryDatabase(
            `INSERT INTO wordlists (name, description) VALUES (?, ?)`,
            [name, description]
        );

        return json({ success: true, message: 'Wordlist created successfully', result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

export async function GET({ request }) {
    try {
        const { id } = JSON.parse(request.body);

        let query = `SELECT * FROM wordlists`;
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
            `UPDATE wordlists SET name = ?, description = ? WHERE id = ?`,
            [name, description, id]
        );

        return json({ success: true, message: 'Wordlist updated successfully', result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

export async function DELETE({ request }) {
    try {
        const { id } = JSON.parse(request.body);

        const result = await queryDatabase(`DELETE FROM wordlists WHERE id = ?`, id);

        return json({ success: true, message: 'Wordlist deleted successfully', result });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

