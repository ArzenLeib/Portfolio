import { NextResponse } from 'next/server';
import { google } from 'googleapis';

function getCredentials() {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS);
}

// Función reutilizable para la autenticación
async function authenticate() {
    const auth = new google.auth.GoogleAuth({
        credentials: getCredentials(),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    return auth.getClient();
}

// Función para obtener la información de la hoja de cálculo y caché
async function getSpreadsheetInfo(spreadsheetId) {
    const client = await authenticate();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Obtener la información de la hoja de cálculo
    const response = await googleSheets.spreadsheets.get({
        spreadsheetId,
    });

    // Almacenar la información en caché
    const spreadSheetInfo = {
        fileName: response.data.properties.title,
        sheetNames: response.data.sheets.map(sheet => sheet.properties.title),
    };

    return spreadSheetInfo;
}

// Función para obtener los datos de una hoja específica
async function getSheetData(spreadsheetId, range) {
    const client = await authenticate();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const getRows = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return getRows.data.values || [];
}

export async function POST(request) {
    try {
        // Obtener el cuerpo de la solicitud
        const { spreadsheetId, range } = await request.json();

        // Obtener la información de la hoja de cálculo (caché o nueva)
        const { fileName, sheetNames } = await getSpreadsheetInfo(spreadsheetId);

        // Si no se proporciona un rango, seleccionar el primero de sheetNames
        let sheetRange = range;
        if (!sheetRange && sheetNames.length > 0) {
            sheetRange = sheetNames[0];
        }

        // Obtener datos de la hoja
        const sheetData = await getSheetData(spreadsheetId, sheetRange);

        return NextResponse.json({ sheetData, fileName, sheetNames });
    } catch (error) {
        console.error('Error al cargar la hoja de cálculo:', error);
        return NextResponse.json({ error: 'Error al cargar los datos' }, { status: 500 });
    }
}
