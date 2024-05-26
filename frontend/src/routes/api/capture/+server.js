import { queryDatabase } from '$lib/db';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const {
            campaign_id,
            method,
            headers,
            body,
            r_headers,
            r_body,
            r_status
        } = JSON.parse(request.body);

        const result = await queryDatabase(
            `INSERT INTO captures (
                campaign_id,
                method,
                headers,
                body,
                r_headers,
                r_body,
                r_status
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                campaign_id,
                method,
                JSON.stringify(headers),
                JSON.stringify(body),
                JSON.stringify(r_headers),
                JSON.stringify(r_body),
                r_status
            ]
        );

        return json({
            success: true,
            message: 'Capture created successfully',
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
        const { id } = JSON.parse(request.body);

        let query = `SELECT * FROM captures`;
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
        const { 
            id,
            campaign_id,
            method,
            headers,
            body,
            r_headers,
            r_body,
            r_status
        } = JSON.parse(request.body);

        const result = await queryDatabase(
            `UPDATE captures SET 
                campaign_id = ?,
                method = ?,
                headers = ?,
                body = ?,
                r_headers = ?,
                r_body = ?,
                r_status = ?
            WHERE id = ?`,
            [
                campaign_id,
                method,
                JSON.stringify(headers),
                JSON.stringify(body),
                JSON.stringify(r_headers),
                JSON.stringify(r_body),
                r_status,
                id
            ]
        );

        return json({
            success: true,
            message: 'Capture updated successfully',
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
            `DELETE FROM captures WHERE id = ?`,
            id
        );

        return json({
            success: true,
            message: 'Capture deleted successfully',
            result
        });
    } catch (err) {
        return error(
            err.status || 500,
            err.message || 'Internal Server Error'
        );
    }
}

