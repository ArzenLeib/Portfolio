import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(request) {
    const { prompt, spreadsheetId } = await request.json();

    console.log(prompt);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        console.log(text);

        text = text.replace(/(^```|```$)/g, '').trim();
        text = text.replace(/^json/, '');
        console.log(text);

        const textoParseado = JSON.parse(text);

        const promptTituloHoja = "Teniendo en cuenta este prompt: \n" + prompt + " \n Y tu respuesta" + text + "Genera únicamente el título para mi hoja de calculo, que no sea más de 4 palabras, no mandes otra cosa sin saltos de linea, solo el título."
        const resultTituloHoja = await model.generateContent(promptTituloHoja);
        const responseTituloHoja = await resultTituloHoja.response
        let TituloHoja = responseTituloHoja.text();
        TituloHoja = TituloHoja.replace(/(\n)/, '');
        const TituloHojaGeneradoPorIA = `${TituloHoja} ${new Date().toDateString()} ${new Date().toLocaleTimeString()}`;

        const addSheetResponse = await fetch(`${process.env.BASE_URL}/api/generar-dataset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spreadsheetId,
                sheetTitle: TituloHojaGeneradoPorIA,
                data: textoParseado,
            }),
        });

        if (!addSheetResponse.ok) {
            throw new Error('Error al agregar la hoja y los datos');
        }

        return NextResponse.json({ textoParseado });
    } catch (error) {
        console.error("Error al generar contenido:", error);
        return NextResponse.json({ error: "Error al generar contenido" }, { status: 500 });
    }
}
