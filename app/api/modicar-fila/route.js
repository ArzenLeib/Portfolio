import { NextResponse } from 'next/server';
import { google } from 'googleapis';

function getCredentials() {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS);
}

async function addSheetAndInsertData(spreadsheetId, sheetTitle, data) {
    const auth = new google.auth.GoogleAuth({
        credentials: getCredentials(),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Paso 1: Crear una nueva hoja
    const addSheetRequest = {
        spreadsheetId: spreadsheetId,
        resource: {
            requests: [{
                addSheet: {
                    properties: {
                        title: sheetTitle,
                    }
                }
            }]
        }
    };

    // Ejecutar la solicitud de agregar hoja
    const addSheetResponse = await sheets.spreadsheets.batchUpdate(addSheetRequest);
    const newSheetId = addSheetResponse.data.replies[0].addSheet.properties.sheetId;

    // Paso 2: Insertar los datos en la nueva hoja
    const updateRequest = {
        spreadsheetId: spreadsheetId,
        range: `${sheetTitle}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: data
        }
    };

    await sheets.spreadsheets.values.update(updateRequest);
}

// Define el endpoint `POST`
export async function POST(request) {
    try {
        // Parsear el cuerpo de la solicitud
        const { spreadsheetId, sheetTitle, data } = await request.json();

        // Llamar a la función `addSheetAndInsertData`
        await addSheetAndInsertData(spreadsheetId, sheetTitle, data);

        return NextResponse.json({ message: 'Hoja creada y datos insertados correctamente' });
    } catch (error) {
        console.error("Error en addSheetAndInsertData:", error);
        return NextResponse.json({ error: "Error al agregar hoja y datos" }, { status: 500 });
    }
}
