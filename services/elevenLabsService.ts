
import { ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID } from '../constants';

const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

export const getAudioFromText = async (text: string): Promise<Blob> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_v3',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
          optimize_streaming_latency: 0
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("ElevenLabs API Error:", errorData);
      throw new Error(`ElevenLabs API request failed with status ${response.status}`);
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error("Error getting audio from ElevenLabs:", error);
    throw new Error("Failed to generate audio from ElevenLabs.");
  }
};
