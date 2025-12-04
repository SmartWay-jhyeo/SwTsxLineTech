declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
    setMapTypeId(mapTypeId: MapTypeId): void;
    getCenter(): LatLng;
    getLevel(): number;
  }

  interface MapOptions {
    center: LatLng;
    level?: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
  }

  class Polygon {
    constructor(options: PolygonOptions);
    setMap(map: Map | null): void;
    getPath(): LatLng[];
    setPath(path: LatLng[]): void;
  }

  interface PolygonOptions {
    path: LatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    fillColor?: string;
    fillOpacity?: number;
    map?: Map;
  }

  class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
    getPath(): LatLng[];
    setPath(path: LatLng[]): void;
    getLength(): number;
  }

  interface PolylineOptions {
    path: LatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    map?: Map;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng): void;
    setContent(content: string | HTMLElement): void;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: string | HTMLElement;
    map?: Map;
    yAnchor?: number;
  }

  enum MapTypeId {
    ROADMAP = 1,
    SKYVIEW = 2,
    HYBRID = 3,
  }

  namespace event {
    function addListener(
      target: Map | Marker | Polygon,
      type: string,
      callback: (mouseEvent: MouseEvent) => void
    ): void;
    function removeListener(
      target: Map | Marker | Polygon,
      type: string,
      callback: (mouseEvent: MouseEvent) => void
    ): void;
  }

  interface MouseEvent {
    latLng: LatLng;
  }

  namespace services {
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: GeocoderResult[], status: Status) => void
      ): void;
    }

    interface GeocoderResult {
      address_name: string;
      x: string;
      y: string;
    }

    enum Status {
      OK = "OK",
      ZERO_RESULT = "ZERO_RESULT",
      ERROR = "ERROR",
    }
  }

  function load(callback: () => void): void;
}

interface Window {
  kakao: typeof kakao;
}
