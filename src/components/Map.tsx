"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface MapProps {
  latitude: number;
  longitude: number;
}

export default function Map({ latitude, longitude }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Dynamically import Leaflet only in the browser
    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current!, {
          zoomControl: false,
          attributionControl: false,
        }).setView([latitude, longitude], 13);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        L.control.attribution({
          position: 'bottomright',
          prefix: 'IPor'
        }).addTo(mapInstanceRef.current);

        L.control.zoom({
          position: 'topright'
        }).addTo(mapInstanceRef.current);
      }

      const map = mapInstanceRef.current;
      map.setView([latitude, longitude], 13);

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-8 h-8 relative">
                  <div class="absolute inset-0 bg-primary/40 rounded-full animate-ping"></div>
                  <div class="absolute inset-2 bg-primary rounded-full border-2 border-white shadow-lg shadow-primary/50"></div>
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        
        markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      }
    };

    initMap();

    return () => {
      // Cleanup if needed
    };
  }, [latitude, longitude]);

  return (
    <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 h-[300px] w-full">
      <div ref={mapContainerRef} className="h-full w-full grayscale-[0.2] brightness-[0.8] contrast-[1.1]" />
      
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl shadow-inner shadow-black/50" />
      <div className="absolute top-4 left-4 p-3 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 z-[400]">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        实时地理位置定位
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #0a0a0a !important;
        }
        .leaflet-tile {
          filter: grayscale(0.2) invert(0.0) !important;
        }
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
