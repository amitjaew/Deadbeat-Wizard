import { queryDatabase } from '$lib/db';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const {
            wordlist_id,
            wordlist_index,
            capture_id,
            campaign_id,
            method,
            headers,
            body,
        } = JSON.parse(request.body);
        
        let response = await fetch(
            'https://google.com',
            {
                method:'get',
                cache:'no-cache',
                mode:'no-cors',
                headers: headers,
                body: body
            }
        );

        let r_status = response.status;
        let r_headers = Object.fromEntries(response.headers);
        let r_body = await response.text();

        const result = await queryDatabase(
            `INSERT INTO fuzz_request (
                wordlist_id,
                wordlist_index,
                capture_id,
                campaign_id,
                method,
                headers,
                body,
                r_headers,
                r_body,
                r_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                wordlist_id,
                wordlist_index,
                capture_id,
                campaign_id,
                method,
                JSON.stringify(headers),
                JSON.stringify(body),
                JSON.stringify(r_headers),
                r_body,
                r_status
            ]
        );

        return json({
            success: true,
            message: 'Fuzz request created successfully',
            result
        });
    } catch (err) {
        return error(err.status || 500, err.message || 'Internal Server Error');
    }
}

export async function GET({ request }) {
    try {
        const {
            campaign_id,
            capture_id,
            wordlist_id,
        } = JSON.parse(request.body);

        let query = `SELECT * FROM fuzz_request`;
        let params = [];

        if (campaign_id) {
            query += ` WHERE campaign_id = ?`;
            params.push(campaign_id);
        }
        if (capture_id) {
            query += ` WHERE capture_id = ?`;
            params.push(capture_id);
        }
        if (wordlist_id) {
            query += ` WHERE id = ?`;
            params.push(wordlist_id);
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
        const {
            id,
            wordlist_id,
            wordlist_index,
            capture_id,
            campaign_id,
            method,
            headers,
            body,
            r_headers,
            r_body,
            r_status
        } = JSON.parse(request.body);

        const result = await queryDatabase(
            `UPDATE fuzz_request SET 
                wordlist_id = ?, 
                wordlist_index = ?, 
                capture_id = ?, 
                campaign_id = ?, 
                method = ?, 
                headers = ?, 
                body = ?, 
                r_headers = ?, 
                r_body = ?, 
                r_status = ? 
            WHERE id = ?`,
            [
                wordlist_id,
                wordlist_index,
                capture_id,
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
            message: 'Fuzz request updated successfully',
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
            `DELETE FROM fuzz_request WHERE id = ?`,
            id
        );

        return json({
            success: true,
            message: 'Fuzz request deleted successfully',
            result
        });
    } catch (err) {
        return error(
            err.status || 500,
            err.message || 'Internal Server Error'
        );
    }
}

