import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { io } from "socket.io-client";
import { serverUrl } from "../../Services/serverURL";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LiveMarker = ({ position, isLive }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 17, { animate: true });
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>
        <div style={{ textAlign: 'center', padding: '4px', fontWeight: '600' }}>
          {isLive ? '🟢 Live Location' : '🟠 Last Known Location'}
        </div>
      </Popup>
    </Marker>
  ) : null;
};

// ── Status definitions ──────────────────────────────────────────────────────
const STATUS = {
  VERIFYING:  { label: 'Verifying link...',           color: '#94a3b8', dot: '#94a3b8', pulse: false },
  CONNECTING: { label: 'Connecting...',               color: '#fbbf24', dot: '#fbbf24', pulse: true  },
  LIVE:       { label: 'Live',                        color: '#4ade80', dot: '#4ade80', pulse: true  },
  LAST_KNOWN: { label: 'Showing last known location', color: '#fb923c', dot: '#fb923c', pulse: false },
  ENDED:      { label: 'Tracking ended',              color: '#f87171', dot: '#f87171', pulse: false },
  INVALID:    { label: 'Link invalid or expired',     color: '#f87171', dot: '#f87171', pulse: false },
};

const TrackingPage = () => {
  const { token } = useParams();
  const [position, setPosition]     = useState(null);
  const [alertInfo, setAlertInfo]   = useState(null);
  const [statusKey, setStatusKey]   = useState('VERIFYING');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isPageValid, setIsPageValid] = useState(false);

  // Timeout ref — transitions LIVE → LAST_KNOWN only
  // (not ENDED — that only happens on socket disconnect)
  const staleTimeoutRef = useRef(null);

  const clearStaleTimeout = () => {
    if (staleTimeoutRef.current) {
      clearTimeout(staleTimeoutRef.current);
      staleTimeoutRef.current = null;
    }
  };

  const startStaleTimeout = () => {
    clearStaleTimeout();
    // If no update arrives for 8 seconds → sender has gone still but is still connected
    // Show LAST_KNOWN, not ENDED
    staleTimeoutRef.current = setTimeout(() => {
      setStatusKey(prev => prev === 'LIVE' ? 'LAST_KNOWN' : prev);
    }, 8000);
  };

  useEffect(() => {
    let socket;

    fetch(`${serverUrl}/track/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (!data.userId) {
          setStatusKey('INVALID');
          return;
        }

        setAlertInfo(data);
        setIsPageValid(true);

        // Show last known position from DB immediately while socket connects
        setPosition([data.location.latitude, data.location.longitude]);
        setStatusKey('CONNECTING');

        // Connect socket
        socket = io(serverUrl, {
          reconnection: true,          // auto-reconnect on tab switch
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
          console.log('Tracking socket connected');
          socket.emit('join-sos-room', data.userId);
          // Stay CONNECTING until first live event arrives
          // If no event in 8 seconds → LAST_KNOWN
          staleTimeoutRef.current = setTimeout(() => {
            setStatusKey(prev => prev === 'CONNECTING' ? 'LAST_KNOWN' : prev);
          }, 8000);
        });

        socket.on('user-location', ({ lat, lng }) => {
          // New live position received
          setPosition([lat, lng]);
          setLastUpdated(
            new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit', minute: '2-digit', second: '2-digit'
            })
          );
          setStatusKey('LIVE');
          startStaleTimeout(); // reset 8s stale timer on every update
        });

        socket.on('disconnect', (reason) => {
          console.log('Tracking socket disconnected:', reason);
          clearStaleTimeout();
          // Only mark ENDED on actual disconnect — not on stale timeout
          setStatusKey('ENDED');
        });

        socket.on('reconnect', () => {
          console.log('Tracking socket reconnected');
          socket.emit('join-sos-room', data.userId);
          setStatusKey('CONNECTING');
          // Give 8s for live events to resume
          staleTimeoutRef.current = setTimeout(() => {
            setStatusKey(prev => prev === 'CONNECTING' ? 'LAST_KNOWN' : prev);
          }, 8000);
        });

        socket.on('connect_error', () => {
          setStatusKey('LAST_KNOWN');
        });
      })
      .catch(() => {
        setStatusKey('INVALID');
      });

    // Handle tab visibility — when tab becomes visible again, rejoin room
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && socket?.connected && alertInfo?.userId) {
        socket.emit('join-sos-room', alertInfo.userId);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (socket) socket.disconnect();
      clearStaleTimeout();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token]);

  const status = STATUS[statusKey];
  const isLive = statusKey === 'LIVE';

  // ── Invalid / expired link screen ────────────────────────────────────────
  if (!isPageValid && statusKey !== 'VERIFYING' && statusKey !== 'CONNECTING') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '72px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '700', margin: '0 0 12px' }}>
            {status.label}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            This link may have expired or the SOS alert has been resolved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0f172a' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid #334155',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        zIndex: 1000,
        position: 'relative',
      }}>

        {/* Left — Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
            boxShadow: '0 0 16px rgba(220,38,38,0.4)'
          }}>🛡️</div>
          <div>
            <div style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: '800', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
              NeoAegis
            </div>
            <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '500', letterSpacing: '0.5px' }}>
              LIVE SOS TRACKING
            </div>
          </div>
        </div>

        {/* Center — Alert message */}
        {alertInfo && (
          <div style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', maxWidth: '280px', width: '100%',
          }}>
            <div style={{
              background: 'rgba(220,38,38,0.15)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '8px', padding: '6px 14px',
            }}>
              <p style={{
                color: '#fca5a5', fontSize: '12px', fontWeight: '600',
                margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                🚨 {alertInfo.message}
              </p>
            </div>
          </div>
        )}

        {/* Right — Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: status.dot, position: 'absolute',
            }} />
            {status.pulse && (
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: status.dot, position: 'absolute',
                animation: 'ping 1.2s ease-out infinite',
              }} />
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: status.color, fontSize: '13px', fontWeight: '700' }}>
              {status.label}
            </div>
            {lastUpdated && (
              <div style={{ color: '#475569', fontSize: '11px', marginTop: '1px' }}>
                Last update: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Info bar ───────────────────────────────────────────────────────── */}
      <div style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px' }}>📍</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Location:</span>
          <span style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: '600' }}>
            {alertInfo?.location?.city || 'Fetching...'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px' }}>⚡</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Status:</span>
          <span style={{
            fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px',
            background: isLive ? 'rgba(74,222,128,0.15)' : 'rgba(251,146,60,0.15)',
            color: isLive ? '#4ade80' : '#fb923c',
            border: `1px solid ${isLive ? 'rgba(74,222,128,0.3)' : 'rgba(251,146,60,0.3)'}`,
          }}>
            {isLive ? 'Receiving live updates' : 'Last known position'}
          </span>
        </div>
      </div>

      {/* ── Map ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative' }}>

        {/* Verifying overlay */}
        {statusKey === 'VERIFYING' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 999,
            background: 'rgba(15,23,42,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛰️</div>
              <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '600' }}>
                Verifying tracking link...
              </p>
            </div>
          </div>
        )}

        {position ? (
          <MapContainer
            center={position}
            zoom={17}
            style={{ height: 'calc(100vh - 106px)', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <LiveMarker position={position} isLive={isLive} />
          </MapContainer>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 'calc(100vh - 106px)',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
              <p style={{ color: '#64748b', fontSize: '15px' }}>{status.label}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ping {
          0%       { transform: scale(1);   opacity: 0.5; }
          75%, 100%{ transform: scale(2.5); opacity: 0;   }
        }
      `}</style>
    </div>
  );
};

export default TrackingPage;