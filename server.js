const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const CSV_PATH = path.join(DATA_DIR, 'rsvps.csv');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, 'timestamp,naam,aanwezig,aantal_personen,dieetwensen,opmerking\n', 'utf8');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const sanitize = (value = '') => {
    const text = String(value).replace(/"/g, '""').trim();
    return `"${text}"`;
};

app.post('/api/rsvp', (req, res) => {
    const {
        naam = '',
        aanwezig = '',
        aantal_personen = '',
        dieetwensen = '',
        opmerking = ''
    } = req.body;

    if (!naam) {
        return res.status(400).json({ message: 'Naam is verplicht.' });
    }

    const row = [
        sanitize(new Date().toISOString()),
        sanitize(naam),
        sanitize(aanwezig),
        sanitize(aantal_personen),
        sanitize(dieetwensen),
        sanitize(opmerking)
    ].join(',') + '\n';

    fs.appendFile(CSV_PATH, row, (err) => {
        if (err) {
            console.error('Fout bij opslaan RSVP:', err);
            return res.status(500).json({ message: 'Opslaan mislukt' });
        }
        return res.json({ message: 'RSVP ontvangen, dankjewel!' });
    });
});

app.get('/api/rsvps', (req, res) => {
    fs.readFile(CSV_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Fout bij lezen RSVPs:', err);
            return res.status(500).json({ message: 'Kon RSVPs niet laden' });
        }

        const [headerLine, ...rows] = data.trim().split('\n');
        const headers = headerLine.split(',');
        const entries = rows
            .filter(Boolean)
            .map((line) => {
                const tokens = [];
                let current = '';
                let inQuotes = false;

                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"' && line[i + 1] === '"') {
                        current += '"';
                        i++;
                        continue;
                    }
                    if (char === '"') {
                        inQuotes = !inQuotes;
                        continue;
                    }
                    if (char === ',' && !inQuotes) {
                        tokens.push(current);
                        current = '';
                        continue;
                    }
                    current += char;
                }
                tokens.push(current);

                const entry = {};
                headers.forEach((key, idx) => {
                    entry[key] = tokens[idx] || '';
                });
                return entry;
            });

        res.json(entries);
    });
});

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});

