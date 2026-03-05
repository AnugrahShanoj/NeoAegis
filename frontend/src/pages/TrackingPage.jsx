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
        <div style={{ textAlign: 'center', padding: '4px', fontWeight: '600', fontSize: '13px' }}>
          {isLive ? '🟢 Live Location' : '🟠 Last Known Location'}
        </div>
      </Popup>
    </Marker>
  ) : null;
};

const STATUS = {
  VERIFYING:  { label: 'Verifying...',            color: '#94a3b8', dot: '#94a3b8', pulse: false },
  CONNECTING: { label: 'Connecting...',           color: '#fbbf24', dot: '#fbbf24', pulse: true  },
  LIVE:       { label: 'Live',                    color: '#4ade80', dot: '#4ade80', pulse: true  },
  LAST_KNOWN: { label: 'Last known location',     color: '#fb923c', dot: '#fb923c', pulse: false },
  ENDED:      { label: 'Tracking ended',          color: '#f87171', dot: '#f87171', pulse: false },
  INVALID:    { label: 'Link invalid or expired', color: '#f87171', dot: '#f87171', pulse: false },
};

const TrackingPage = () => {
  const { token } = useParams();
  const [position,    setPosition]    = useState(null);
  const [alertInfo,   setAlertInfo]   = useState(null);
  const [statusKey,   setStatusKey]   = useState('VERIFYING');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isPageValid, setIsPageValid] = useState(false);

  // Track infobar height dynamically so map fills exactly the rest
  const [infoBarHeight, setInfoBarHeight] = useState(0);
  const infoBarRef = useRef(null);
  const staleTimeoutRef = useRef(null);

  // Measure infobar height after render so map can fill remainder
  useEffect(() => {
    if (!infoBarRef.current) return;
    const observer = new ResizeObserver(() => {
      setInfoBarHeight(infoBarRef.current?.offsetHeight || 0);
    });
    observer.observe(infoBarRef.current);
    return () => observer.disconnect();
  }, [alertInfo]); // re-measure if alertInfo changes (mobile row added/removed)

  const clearStaleTimeout = () => {
    if (staleTimeoutRef.current) {
      clearTimeout(staleTimeoutRef.current);
      staleTimeoutRef.current = null;
    }
  };

  const startStaleTimeout = () => {
    clearStaleTimeout();
    staleTimeoutRef.current = setTimeout(() => {
      setStatusKey(prev => prev === 'LIVE' ? 'LAST_KNOWN' : prev);
    }, 8000);
  };

  useEffect(() => {
    let socket;

    fetch(`${serverUrl}/track/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        if (!data.userId) { setStatusKey('INVALID'); return; }

        setAlertInfo(data);
        setIsPageValid(true);
        setPosition([data.location.latitude, data.location.longitude]);
        setStatusKey('CONNECTING');

        socket = io(serverUrl, {
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
          socket.emit('join-sos-room', data.userId);
          staleTimeoutRef.current = setTimeout(() => {
            setStatusKey(prev => prev === 'CONNECTING' ? 'LAST_KNOWN' : prev);
          }, 8000);
        });

        socket.on('user-location', ({ lat, lng }) => {
          setPosition([lat, lng]);
          setLastUpdated(new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
          }));
          setStatusKey('LIVE');
          startStaleTimeout();
        });

        socket.on('disconnect', () => { clearStaleTimeout(); setStatusKey('ENDED'); });
        socket.on('reconnect',   () => {
          socket.emit('join-sos-room', data.userId);
          setStatusKey('CONNECTING');
          staleTimeoutRef.current = setTimeout(() => {
            setStatusKey(prev => prev === 'CONNECTING' ? 'LAST_KNOWN' : prev);
          }, 8000);
        });
        socket.on('connect_error', () => setStatusKey('LAST_KNOWN'));
      })
      .catch(() => setStatusKey('INVALID'));

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && socket?.connected && alertInfo?.userId)
        socket.emit('join-sos-room', alertInfo.userId);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (socket) socket.disconnect();
      clearStaleTimeout();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [token]);

  const status = STATUS[statusKey];
  const isLive = statusKey === 'LIVE';

  // Navbar is always 60px. Map height = 100dvh - 60px (navbar) - infoBarHeight
  const NAVBAR_H = 60;
  const mapHeight = `calc(100dvh - ${NAVBAR_H}px - ${infoBarHeight}px)`;

  // ── Invalid screen ──────────────────────────────────────────────────────
  if (!isPageValid && statusKey !== 'VERIFYING' && statusKey !== 'CONNECTING') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100dvh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '700', margin: '0 0 10px' }}>
            {status.label}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
            This link may have expired or the SOS alert has already been resolved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Global styles ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes ping {
          0%        { transform: scale(1);   opacity: 0.5; }
          75%, 100% { transform: scale(2.5); opacity: 0;   }
        }

        /* Mobile: hide center badge in navbar, show message row in infobar */
        @media (max-width: 600px) {
          .tracking-center-badge  { display: none !important; }
          .tracking-mobile-msg    { display: block !important; }
        }

        /* Tablet */
        @media (min-width: 601px) and (max-width: 900px) {
          .tracking-center-badge { display: flex !important; }
          .tracking-mobile-msg   { display: none !important; }
        }

        /* Desktop */
        @media (min-width: 901px) {
          .tracking-center-badge { display: flex !important; }
          .tracking-mobile-msg   { display: none !important; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',       /* exact viewport — no overflow, no gap */
        background: '#0f172a',
        overflow: 'hidden',
      }}>

        {/* ══════════════════════════════════════════
            NAVBAR  (fixed 60px)
        ══════════════════════════════════════════ */}
        <nav style={{
          height: `${NAVBAR_H}px`,
          minHeight: `${NAVBAR_H}px`,
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
          borderBottom: '1px solid #334155',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          zIndex: 1000,
          gap: '8px',
          flexShrink: 0,
        }}>

          {/* Left — Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', boxShadow: '0 0 14px rgba(220,38,38,0.4)',
            }}>🛡️</div>
            <div>
              <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '800', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                NeoAegis
              </div>
              <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '600', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                LIVE SOS TRACKING
              </div>
            </div>
          </div>

          {/* Center — Alert badge (tablet + desktop only) */}
          {alertInfo && (
            <div
              className="tracking-center-badge"
              style={{ flex: 1, justifyContent: 'center', padding: '0 8px', minWidth: 0, overflow: 'hidden' }}
            >
              {/* ✅ inline-block so box wraps message width, not full width */}
              <div style={{
                display: 'inline-block',
                maxWidth: '100%',
                background: 'rgba(220,38,38,0.15)',
                border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: '8px', padding: '5px 12px',
              }}>
                <p style={{
                  color: '#fca5a5', fontSize: '12px', fontWeight: '600',
                  margin: 0, whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  🚨 {alertInfo.message}
                </p>
              </div>
            </div>
          )}

          {/* Right — Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
              <div style={{ color: status.color, fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {status.label}
              </div>
              {lastUpdated && (
                <div style={{ color: '#475569', fontSize: '10px', marginTop: '1px', whiteSpace: 'nowrap' }}>
                  {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════
            INFO BAR  (dynamic height — measured by ResizeObserver)
        ══════════════════════════════════════════ */}
        <div
          ref={infoBarRef}
          style={{
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            padding: '8px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          {/* Location + status row */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px' }}>📍</span>
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>Location:</span>
              <span style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: '600' }}>
                {alertInfo?.location?.city || 'Fetching...'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '12px' }}>⚡</span>
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>Status:</span>
              <span style={{
                fontSize: '10px', fontWeight: '700',
                padding: '2px 8px', borderRadius: '100px',
                background: isLive ? 'rgba(74,222,128,0.15)' : 'rgba(251,146,60,0.15)',
                color: isLive ? '#4ade80' : '#fb923c',
                border: `1px solid ${isLive ? 'rgba(74,222,128,0.3)' : 'rgba(251,146,60,0.3)'}`,
                whiteSpace: 'nowrap',
              }}>
                {isLive ? 'Receiving live updates' : 'Last known position'}
              </span>
            </div>
          </div>

          {/* Mobile-only alert message row */}
          {alertInfo && (
            <div
              className="tracking-mobile-msg"
              style={{ display: 'none' }} /* shown via media query */
            >
              {/* ✅ inline-block so box fits message, not full row width */}
              <div style={{
                display: 'inline-block',
                maxWidth: '100%',
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.25)',
                borderRadius: '6px',
                padding: '5px 10px',
              }}>
                <p style={{
                  color: '#fca5a5', fontSize: '11px', fontWeight: '600',
                  margin: 0, lineHeight: 1.4,
                  wordBreak: 'break-word',  /* long messages wrap instead of overflow */
                }}>
                  🚨 {alertInfo.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            MAP  — fills exactly what remains
        ══════════════════════════════════════════ */}
        <div style={{
          height: mapHeight,        /* precise: 100dvh - navbar - infobar */
          width: '100%',
          position: 'relative',
          flexShrink: 0,            /* don't let flex shrink it */
        }}>

          {/* Verifying overlay */}
          {statusKey === 'VERIFYING' && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 999,
              background: 'rgba(15,23,42,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '44px', marginBottom: '14px' }}>🛰️</div>
                <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: '600', margin: 0 }}>
                  Verifying tracking link...
                </p>
              </div>
            </div>
          )}

          {position ? (
            <MapContainer
              center={position}
              zoom={17}
              style={{ height: '100%', width: '100%' }}
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
              height: '100%',
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            }}>
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '44px', marginBottom: '14px' }}>📡</div>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{status.label}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default TrackingPage;