export class GeoService {
    /**
     * Calculates the distance between two points in meters using the Haversine formula.
     */
    static getDistanceFromLatLonInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const earthRadiusInMeters = 6371000;
        const deltaLat = (lat2 - lat1) * Math.PI / 180;
        const deltaLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusInMeters * c;
    }

    static toRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    static toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }

    /**
     * Calculates the bearing from start point to destination point.
     */
    static bearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
        const sLat = this.toRadians(startLat);
        const sLng = this.toRadians(startLng);
        const dLat = this.toRadians(destLat);
        const dLng = this.toRadians(destLng);

        const y = Math.sin(dLng - sLng) * Math.cos(dLat);
        const x = Math.cos(sLat) * Math.sin(dLat) -
            Math.sin(sLat) * Math.cos(dLat) * Math.cos(dLng - sLng);
        let brng = Math.atan2(y, x);
        brng = this.toDegrees(brng);
        return (brng + 360) % 360;
    }

    /**
     * Converts a degree bearing to a human-readable compass direction.
     */
    static degToCompass(num: number): string {
        const val = Math.floor((num / 45) + 0.5);
        const arr = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
        return arr[(val % 8)];
    }
}
