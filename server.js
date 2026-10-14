const express = require('express');
const connection = require('./db');

const app = express();

app.use(express.json());
app.use(express.static('frontend'));

app.get('/api/opportunities', (req, res) => {
    const sql = 'SELECT * FROM opportunities';

    connection.query(sql, (err, results) => {
        if (err) {
            console.log('Database query error:', err);

            return res.status(500).json({
                message: 'Failed to retrieve research opportunities.'
            });
        }

        res.status(200).json(results);
    });
});

app.get('/api/opportunities/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM opportunities WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.log('Database query error:', err);

            return res.status(500).json({
                message: 'Failed to retrieve research opportunity.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found.'
            });
        }

        res.status(200).json(results[0]);
    });
});

app.post('/api/opportunities', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: 'Title and description are required.'
        });
    }

    const sql = 'INSERT INTO opportunities (title, description) VALUES (?, ?)';

    connection.query(sql, [title, description], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to create research opportunity.'
            });
        }

        res.status(201).json({
            message: 'Research opportunity created successfully!',
            opportunity: {
                id: result.insertId,
                title: title,
                description: description,
                status: 'Open'
            }
        });
    });
});
app.put('/api/opportunities/:id', (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: 'Title and description are required.'
        });
    }

    const sql = 'UPDATE opportunities SET title = ?, description = ? WHERE id = ?';

    connection.query(sql, [title, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to update research opportunity.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found.'
            });
        }

        res.status(200).json({
            message: 'Research opportunity updated successfully!'
        });
    });
});
app.patch('/api/opportunities/:id/close', (req, res) => {
    const id = req.params.id;

    const sql = "UPDATE opportunities SET status = 'Closed' WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to close research opportunity.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found.'
            });
        }

        res.status(200).json({
            message: 'Research opportunity closed successfully!'
        });
    });
});
app.delete('/api/opportunities/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM opportunities WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Failed to delete research opportunity.'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found.'
            });
        }

        res.status(200).json({
            message: 'Research opportunity deleted successfully!'
        });
    });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
