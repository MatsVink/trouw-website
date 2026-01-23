const { createClient } = require('@supabase/supabase-js');

// Haal de geheime sleutels op uit de omgevingsvariabelen van Netlify
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    // 1. NIEUWE INSCHRIJVING (POST request vanuit index.html)
    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);

            // Veilig omzetten van tekst naar nummer voor de database
            // Als het veld leeg is, maken we er een 0 van.
            const aantal = data.aantal_personen ? parseInt(data.aantal_personen) : 0;

            const { error } = await supabase
                .from('rsvps')
                .insert([{
                    naam: data.naam,
                    gasttype: data.gasttype, // <--- DEZE WAS VERGETEN!
                    aanwezig: data.aanwezig,
                    aantal_personen: aantal, // <--- Nu als nummer opgeslagen
                    dieetwensen: data.dieetwensen,
                    opmerking: data.opmerking
                }]);

            if (error) throw error;

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Succesvol opgeslagen!" })
            };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
    }

    // 2. DATA OPHALEN VOOR JE ZUS (GET request vanuit overzicht.html)
    if (event.httpMethod === 'GET') {
        // Simpele beveiliging: check of er een geheim wachtwoord in de URL zit
        // Bijvoorbeeld: .netlify/functions/rsvp?secret=J&J2026
        const secret = event.queryStringParameters.secret;
        
        if (secret !== process.env.ADMIN_SECRET) {
            return { statusCode: 401, body: "Geen toegang" };
        }

        const { data, error } = await supabase
            .from('rsvps')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return { statusCode: 500, body: JSON.stringify(error) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};
