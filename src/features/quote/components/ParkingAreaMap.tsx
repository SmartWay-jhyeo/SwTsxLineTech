"use client";

import { useEffect, useRef, useState } from "react";
import { Search, RotateCcw, MapPin, HelpCircle } from "lucide-react";
import Image from "next/image";

type ParkingAreaMapProps = {
  onAreaChange: (area: number) => void;
  onAddressChange: (address: string) => void;
  onReset?: () => void;  // 부모 컴포넌트 초기화 콜백
};

export function ParkingAreaMap({ onAreaChange, onAddressChange, onReset }: ParkingAreaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const polygonRef = useRef<kakao.maps.Polygon | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const pointsRef = useRef<kakao.maps.LatLng[]>([]);
  const isDrawingRef = useRef(false);

  const [searchAddress, setSearchAddress] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // 폴리곤 면적 계산 (Shoelace formula)
  const calculatePolygonArea = (coords: kakao.maps.LatLng[]): number => {
    if (coords.length < 3) return 0;

    let area = 0;
    const n = coords.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const lat1 = coords[i].getLat();
      const lng1 = coords[i].getLng();
      const lat2 = coords[j].getLat();
      const lng2 = coords[j].getLng();

      const y1 = lat1 * 111320;
      const x1 = lng1 * 111320 * Math.cos((lat1 * Math.PI) / 180);
      const y2 = lat2 * 111320;
      const x2 = lng2 * 111320 * Math.cos((lat2 * Math.PI) / 180);

      area += x1 * y2;
      area -= x2 * y1;
    }

    return Math.abs(area / 2);
  };

  // 중심점 기준 각도로 점 정렬 (클릭 순서 무관하게 폴리곤 형성)
  const sortPointsByAngle = (points: kakao.maps.LatLng[]): kakao.maps.LatLng[] => {
    if (points.length < 3) return points;

    // 중심점(centroid) 계산
    const centroid = {
      lat: points.reduce((sum, p) => sum + p.getLat(), 0) / points.length,
      lng: points.reduce((sum, p) => sum + p.getLng(), 0) / points.length,
    };

    // 중심점 기준 시계방향 정렬
    return [...points].sort((a, b) => {
      const angleA = Math.atan2(a.getLat() - centroid.lat, a.getLng() - centroid.lng);
      const angleB = Math.atan2(b.getLat() - centroid.lat, b.getLng() - centroid.lng);
      return angleA - angleB;
    });
  };

  // 폴리곤 업데이트 및 면적 계산
  const updatePolygon = () => {
    if (!mapRef.current) return;

    // 기존 폴리곤 제거
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    const points = pointsRef.current;

    if (points.length < 3) {
      setCalculatedArea(0);
      onAreaChange(0);
      return;
    }

    // 클릭 순서와 무관하게 올바른 폴리곤을 형성하도록 정렬
    const sortedPoints = sortPointsByAngle(points);

    // 새 폴리곤 생성 (정렬된 점 사용)
    const polygon = new window.kakao.maps.Polygon({
      path: sortedPoints,
      strokeWeight: 3,
      strokeColor: "#f58220",
      strokeOpacity: 0.9,
      fillColor: "#f58220",
      fillOpacity: 0.3,
      map: mapRef.current,
    });
    polygonRef.current = polygon;

    // 정렬된 점으로 면적 계산
    const area = calculatePolygonArea(sortedPoints);
    setCalculatedArea(area);
    onAreaChange(area);
  };

  // 포인트 추가
  const addPoint = (latLng: kakao.maps.LatLng) => {
    if (!mapRef.current || !isDrawingRef.current) return;

    // 마커 추가
    const marker = new window.kakao.maps.Marker({
      position: latLng,
      map: mapRef.current,
    });
    markersRef.current.push(marker);
    pointsRef.current.push(latLng);
    setPointCount(pointsRef.current.length);
    updatePolygon();
  };

  // 카카오맵 초기화
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 50; // 5초 대기

    const initMap = () => {
      if (typeof window === "undefined") return;

      // 카카오 SDK가 로드될 때까지 대기
      if (!window.kakao || !window.kakao.maps) {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(initMap, 100);
        } else {
          console.error("카카오맵 SDK 로드 실패");
        }
        return;
      }

      window.kakao.maps.load(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        try {
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };

          const map = new window.kakao.maps.Map(mapContainerRef.current, options);
          map.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
          mapRef.current = map;
          setIsMapLoaded(true);

          // 지도 로드 시 바로 그리기 모드 활성화
          isDrawingRef.current = true;
          setIsDrawing(true);

          // 지도 클릭 이벤트
          window.kakao.maps.event.addListener(map, "click", (mouseEvent: kakao.maps.MouseEvent) => {
            addPoint(mouseEvent.latLng);
          });
        } catch (error) {
          console.error("지도 초기화 오류:", error);
        }
      });
    };

    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 주소 검색
  const handleSearch = () => {
    if (!searchAddress.trim() || !mapRef.current) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(searchAddress, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const coords = new window.kakao.maps.LatLng(
          parseFloat(result[0].y),
          parseFloat(result[0].x)
        );

        mapRef.current?.setCenter(coords);
        mapRef.current?.setLevel(2);
        onAddressChange(result[0].address_name);

        // 검색 후 자동으로 그리기 모드 활성화
        isDrawingRef.current = true;
        setIsDrawing(true);
      } else {
        alert("주소를 찾을 수 없습니다. 다시 확인해주세요.");
      }
    });
  };

  // 초기화 (그리기 모드는 유지)
  const handleReset = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }

    pointsRef.current = [];
    setPointCount(0);
    setCalculatedArea(0);
    onAreaChange(0);
    // 그리기 모드 유지
    isDrawingRef.current = true;
    setIsDrawing(true);

    // 부모 컴포넌트 상태도 초기화
    onReset?.();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-white text-sm font-medium">시공 위치 및 면적</h3>

      {/* 주소 검색 */}
      <div className="flex gap-2" data-tour="address-search">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="주소를 입력하세요 (예: 서울시 강남구 테헤란로 123)"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2.5 bg-primary rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          검색
        </button>
      </div>

      {/* 지도 */}
      <div className="relative" data-tour="map-area">
        <div
          ref={mapContainerRef}
          className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-800"
        />

        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
            <span className="text-white/50 text-sm">지도 로딩 중...</span>
          </div>
        )}

        {/* 도움말 아이콘 */}
        {isMapLoaded && (
          <div
            className="absolute top-3 left-3 z-10"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
          >
            <div className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center cursor-help transition-colors shadow-md">
              <HelpCircle size={20} className="text-gray-500" />
            </div>

            {/* 도움말 툴팁 */}
            {showHelp && (
              <div className="absolute top-10 left-0 bg-white rounded-lg shadow-xl p-2 z-20">
                <Image
                  src="/images/manual-region2.gif"
                  alt="사용 방법 안내"
                  width={300}
                  height={200}
                  className="rounded"
                  unoptimized
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  영역의 모서리를 클릭하여 측정하세요
                </p>
              </div>
            )}
          </div>
        )}

        {/* 안내 오버레이 */}
        {isMapLoaded && pointCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg pointer-events-none">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 text-primary" size={32} />
              <p className="text-white text-sm">지도를 클릭하여 영역을 그려주세요</p>
            </div>
          </div>
        )}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {pointCount > 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {pointCount}점 선택됨
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white/70 text-sm hover:bg-white/20 transition-colors"
              >
                <RotateCcw size={16} />
                초기화
              </button>
            </>
          )}
        </div>

        {/* 면적 표시 */}
        {calculatedArea > 0 && (
          <div className="text-right">
            <span className="text-white/50 text-xs">측정 면적</span>
            <p className="text-primary text-xl font-bold">
              {calculatedArea.toLocaleString("ko-KR", { maximumFractionDigits: 1 })} m²
            </p>
          </div>
        )}
      </div>

      {/* 도움말 */}
      <p className="text-white/40 text-xs">
        * 위성지도에서 주차장 영역의 모서리를 클릭하면 자동으로 면적이 계산됩니다.
      </p>
    </div>
  );
}
