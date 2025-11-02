// src/services/weatherApiService.js
export class WeatherApiService {
  static API_KEY = '2a9d2a80a02744f29de61425253108';
  static BASE_URL = 'https://api.weatherapi.com/v1';

  static async getCurrentWeather(city) {
    try {
      // Use real API call
      const response = await fetch(
        `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformWeatherData(data);
      
    } catch (error) {
      console.error('Weather fetch failed:', error);
      throw new Error(`Failed to fetch weather data for ${city}`);
    }
  }

  static transformWeatherData(apiData) {
    return {
      location: {
        name: apiData.location.name,
        country: apiData.location.country,
        region: apiData.location.region
      },
      current: {
        temp_c: apiData.current.temp_c,
        feelslike_c: apiData.current.feelslike_c,
        condition: {
          text: apiData.current.condition.text,
          icon: `https:${apiData.current.condition.icon}`
        },
        humidity: apiData.current.humidity,
        wind_kph: apiData.current.wind_kph,
        pressure_mb: apiData.current.pressure_mb,
        last_updated: apiData.current.last_updated,
        uv: apiData.current.uv,
        vis_km: apiData.current.vis_km,
        gust_kph: apiData.current.gust_kph,
        precip_mm: apiData.current.precip_mm,
        cloud: apiData.current.cloud
      }
    };
  }
}

export default WeatherApiService;