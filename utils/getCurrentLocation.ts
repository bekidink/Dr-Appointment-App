// utils/locationUtils.ts
import * as Location from 'expo-location';

export async function getCurrentLocationDetails() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    const [address] = await Location.reverseGeocodeAsync(location.coords);

    return {
      location,
      city: address.city,
      country: address.country,
    };
  } catch (error) {
    throw error;
  }
}
