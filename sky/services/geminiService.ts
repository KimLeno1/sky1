
import { GoogleGenAI, Type } from "@google/genai";
import { Hotel, Flight, SearchParams, FlightSearchResponse } from "../types.ts";
import { AIRLINES } from "./mockData.ts";
import { HOTEL_PHOTOS } from "./extraMockData.ts";

/**
 * Robust JSON extraction with fallback for grounding text noise and markdown blocks.
 */
const extractJson = (text: string | undefined) => {
  if (!text) return [];
  
  // Clean markdown formatting if present
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    // Attempt to find an array in the text
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Intelligence Parsing Error. Raw Text snippet:", text?.substring(0, 100));
    return [];
  }
};

export const fetchRealFlights = async (params: SearchParams): Promise<FlightSearchResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Intelligence core unavailable. API Key missing.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use flash-preview for faster search-grounded lookups
    const modelName = "gemini-3-flash-preview";
    
    const prompt = `SEARCH TASK: Find real, current flight schedules and pricing.
    ROUTE: From ${params.origin} to ${params.destination}
    DATE: ${params.date}
    PASSENGERS: ${params.passengers}
    CABIN: ${params.cabinClass}

    REQUIRED OUTPUT: A raw JSON array of flight objects. 
    Each object MUST have: "airline", "price" (total for all passengers), "duration", "departureTime", "arrivalTime", "stops", "aircraftType".

    CRITICAL: Output ONLY the JSON array. Do not include conversational text or markdown explanation. Ensure prices are in USD.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Lower temperature for more structured adherence
      },
    });

    const textOutput = response.text;
    const results = extractJson(textOutput);
    
    // Extract grounding chunks for source transparency
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    if (!results || results.length === 0) {
      throw new Error("No structured data returned from Intelligence.");
    }

    const flights: Flight[] = results.map((f: any) => {
      const airlineMatch = AIRLINES.find(a => 
        f.airline?.toLowerCase().includes(a.name.toLowerCase()) || 
        a.name.toLowerCase().includes(f.airline?.toLowerCase())
      );
      
      // Enforce markup and basic validation
      const basePrice = Number(f.price) || 299;
      const finalPrice = Math.floor(basePrice * 1.44);

      return {
        id: `${airlineMatch?.code || 'FL'}${Math.floor(100 + Math.random() * 899)}`,
        airline: f.airline || "SkyNet Partner",
        logo: airlineMatch?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.airline || "FL")}&background=f1f5f9&color=64748b&bold=true`,
        departureAirport: params.origin,
        arrivalAirport: params.destination,
        departureTime: f.departureTime || "09:00",
        arrivalTime: f.arrivalTime || "13:00",
        duration: f.duration || "4h 00m",
        price: finalPrice,
        class: params.cabinClass,
        stops: Number(f.stops) || 0,
        aircraftType: f.aircraftType || "Modern Jet",
        baggageAllowance: "1 x 23kg Checked, 1 Carry-on",
        verifiedSchedule: true
      };
    });

    return { flights, sources };
  } catch (error: any) {
    console.error("Intelligence Search Failure:", error);
    throw error;
  }
};

export const fetchRealHotels = async (city: string): Promise<Hotel[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: `List 5 luxury/premium hotels in ${city}. Star rating must be 4 or 5. Description must be evocative and premium.` }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              city: { type: Type.STRING },
              stars: { type: Type.INTEGER },
              pricePerNight: { type: Type.INTEGER },
              description: { type: Type.STRING },
            },
            required: ["id", "name", "city", "stars", "pricePerNight", "description"],
          },
        },
      },
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((h: any, i: number) => ({
      ...h,
      pricePerNight: Math.floor((h.pricePerNight || 200) * 1.44),
      image: HOTEL_PHOTOS[i % HOTEL_PHOTOS.length]
    }));
  } catch (error) {
    console.error("Hotel search failure:", error);
    return [];
  }
};
