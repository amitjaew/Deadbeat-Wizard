import { queryDatabase } from '$lib/db';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const payload = request.formData();
        const name = payload.get('name');
        const description = payload.get('description');
        const file = payload.get('file');

        const result = await queryDatabase(
            `INSERT INTO wordlists (name, description, file) VALUES (?, ?, ?)`,
            [name, description, file]
        );

        return json({
            success: true,
            message: 'Wordlist created successfully',
            result
        });
    } catch (err) {
        return error(
            err.status || 500,
            err.message || 'Internal Server Error'
        );
    }
}

export async function GET({ request }) {
    try {
        const { id } = JSON.parse(request.body) || { id: null };

        let query;
        let params = [];
        if (id) {
            query = `SELECT * FROM wordlists WHERE id=?`;
            params.push(id);
        }
        else {
            query = `SELECT id, name, description FROM wordlists`;
        }

        const result = await queryDatabase(query, params);

        return json({
            success: true,
            data: result
        });
    } catch (err) {
        return error(
            err.status || 500,
            err.message || 'Internal Server Error'
        );
    }
}

export async function PATCH({ request }) {
    try {
        const payload = request.formData();
        const id = payload.get('id');
        const name = payload.get('name');
        const description = payload.get('description');
        const file = payload.get('file');
    
        let result;
        if (
            !file                   ||
            file.size == 0          ||
            !(file instanceof File)
        ){
            result = await queryDatabase(
                `UPDATE wordlists SET
                    name = ?,
                    description = ?
                WHERE id = ?`,
                [name, description, id]
            );
        }
        else {
            result = await queryDatabase(
                `UPDATE wordlists SET
                    name = ?,
                    description = ?,
                    file = ?
                WHERE id = ?`,
                [name, description, id, file]
            );
        }

        return json({
            success: true,
            message: 'Wordlist updated successfully',
            result
        });
    } catch (err) {
        return error(
            err.status || 500,
            err.message || 'Internal Server Error'
        );
    }
}

export async function DELETE({ request }) {
    try {
        const { id } = JSON.parse(request.body);

        const result = await queryDatabase(
            `DELETE FROM wordlists WHERE id = ?`,
            id
        );

        return json({
            success: true,
            message: 'Wordlist deleted successfully',
            result
        });
    } catch (err) {
        return error(
            err.status || 500,
            err.message || 'Internal Server Error'
        );
    }
}

