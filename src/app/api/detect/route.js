
import { NextResponse } from "next/server";



export async function POST(request) {
    const { imageB64 } = await request.json();
    const invokeUrl = "https://ai.api.nvidia.com/v1/vlm/nvidia/neva-22b";
    const apiKey = process.env.NVIDIA_API_KEY
    const headers = {
      "Authorization": "Bearer " + apiKey,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
    const payload = {
      "messages": [
        {
          "role": "user",
          "content": `tell me the object inside the picture. Just answer the object itself. <img src="${imageB64}" />`
        }
      ],
      "max_tokens": 1024,
      "temperature": 0.20,
      "top_p": 0.70,
      "seed": 0,
    };
    const response = await fetch(invokeUrl, {
      method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data.choices[0].message.content);
  }