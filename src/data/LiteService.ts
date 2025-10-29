
const BASE_URL = 'https://lite-api.jup.ag/swap/v1';

export class LiteapiClient {
  static async getProgramIdToLabel(): Promise<Record<string, string>> {
    const response = await fetch(`${BASE_URL}/program-id-to-label`);
    if (!response.ok) {
      throw response;
    }
    const data: Record<string, string> = await response.json();
    return data;
  }
 
}
