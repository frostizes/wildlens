// src/utils/location.ts

export function getUserLocation(
  onSuccess: (latitude: number, longitude: number) => void,
  onError?: (error: GeolocationPositionError) => void
): void {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      onSuccess(latitude, longitude);
    },
    (error) => {
      console.error("Error getting location:", error);
      if (onError) {
        onError(error);
      } else {
        alert("Unable to retrieve your location");
      }
    }
  );
}

export async function checkLocationPermission(): Promise<PermissionState | null> {
  if (!navigator.permissions) {
    console.warn("Permissions API not supported in this browser");
    return null;
  }

  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    // result.state will be "granted", "prompt", or "denied"
    return result.state;
  } catch (error) {
    console.error("Error checking geolocation permission:", error);
    return null;
  }
}
