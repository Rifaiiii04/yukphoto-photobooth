/* ============================================================
   PHOTOBOOTH APP - MAIN CLIENT COMPONENT
   Komponen utama yang mengelola seluruh state dan flow
   photobooth. Mengontrol langkah-langkah: idle → camera →
   countdown → review → result.
   ============================================================ */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Camera, Download, RotateCcw, ArrowLeft, Check, ImagePlus,
  Sparkles, RefreshCw, X, ChevronRight, Users, Copy
} from 'lucide-react';
import type { FrameLayoutType, PhotoboothStep, CameraFacing } from '@/app/types/photobooth';
import { getFrameLayout } from '@/app/lib/frames';
import { getFilterCSS } from '@/app/lib/filters';
import { initCamera, stopCamera, captureFrame, captureMultiplayerFrame, hasMultipleCameras } from '@/app/lib/camera';
import { renderPhotoFrame, downloadCanvas } from '@/app/lib/canvas';
import { DEFAULT_RENDER_OPTIONS } from '@/app/lib/frames';
import Button from '@/app/components/ui/Button';
import IconButton from '@/app/components/ui/IconButton';
import CountdownTimer from '@/app/components/photobooth/CountdownTimer';
import FilterSelector from '@/app/components/photobooth/FilterSelector';
import FrameSelector from '@/app/components/photobooth/FrameSelector';
import { PhotoPreview } from '@/app/components/photobooth/PhotoResult';
import { CollaborationManager, MultiplayerRole } from '@/app/lib/webrtc';

export default function PhotoboothApp() {
  /* ----------------------------------------------------------
     State
     ---------------------------------------------------------- */

  const [step, setStep] = useState<PhotoboothStep>('idle');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [selectedFrame, setSelectedFrame] = useState<FrameLayoutType>('strip-4');
  const [showFlash, setShowFlash] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  // Multiplayer State
  const [multiplayerMode, setMultiplayerMode] = useState<false | MultiplayerRole>(false);
  const [sessionId, setSessionId] = useState<string>(''); // Host's code or Guest's input
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isPeerReady, setIsPeerReady] = useState(false);
  const webrtcRef = useRef<CollaborationManager | null>(null);

  // Result state
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const [facing, setFacing] = useState<CameraFacing>('user');
  const [showSwitchBtn, setShowSwitchBtn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const frameConfig = getFrameLayout(selectedFrame);
  const requiredPhotos = frameConfig.photoCount;

  /* ----------------------------------------------------------
     WebRTC Management
     ---------------------------------------------------------- */

  const initMultiplayer = useCallback((role: MultiplayerRole, stream: MediaStream, joinCode?: string) => {
    setIsPeerReady(false);
    if (webrtcRef.current) {
      webrtcRef.current.destroy();
    }

    const newCode = role === 'host' 
      ? Math.floor(100000 + Math.random() * 900000).toString() 
      : joinCode!;
      
    if (role === 'host') setSessionId(newCode);

    webrtcRef.current = new CollaborationManager(
      role,
      stream,
      {
        onRemoteStream: (rStream) => {
          setRemoteStream(rStream);
        },
        onRemoteDisconnect: () => {
          setRemoteStream(null);
          alert('Teman kamu terputus dari sesi.');
        },
        onSyncMessage: (type, payload) => {
          if (type === 'START_COUNTDOWN') {
            setStep('countdown');
          } else if (type === 'FILTER_CHANGE') {
            setSelectedFilter(payload);
          } else if (type === 'RETAKE_LAST') {
            setPhotos((prev) => prev.slice(0, -1));
            setStep('camera');
          }
        },
        onError: (err) => {
          alert(`Koneksi error: ${err}`);
          setStep('idle');
        },
        onReady: () => {
          setIsPeerReady(true);
        }
      },
      newCode
    );
  }, []);

  useEffect(() => {
    // Konek remote stream ke elemen <video> ketika remoteStream tersedia
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(console.error);
    }
  }, [remoteStream, step]);

  /* ----------------------------------------------------------
     Camera Management
     ---------------------------------------------------------- */

  const startCamera = useCallback(async (facingMode: CameraFacing) => {
    try {
      setCameraError(null);
      setIsCameraReady(false);
      stopCamera(streamRef.current);

      const stream = await initCamera(facingMode);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);

        setTimeout(() => {
          if (videoRef.current) {
            try {
              const preview = captureFrame(videoRef.current, 'none', facingMode === 'user');
              setPreviewImage(preview);
            } catch { /* ignore */ }
          }
        }, 500);
      }
      return stream;
    } catch (err) {
      setCameraError(err instanceof Error ? err.message : 'Gagal mengakses kamera');
      return null;
    }
  }, []);

  const handleStopCamera = useCallback(() => {
    stopCamera(streamRef.current);
    streamRef.current = null;
    setIsCameraReady(false);
    
    if (webrtcRef.current) {
      webrtcRef.current.destroy();
      webrtcRef.current = null;
    }
    setRemoteStream(null);
  }, []);

  /* ----------------------------------------------------------
     Step Handlers
     ---------------------------------------------------------- */

  const handleStartSingle = useCallback(async () => {
    setPhotos([]);
    setMultiplayerMode(false);
    setSessionId('');
    setStep('camera');
    await startCamera(facing);
    hasMultipleCameras().then(setShowSwitchBtn);
  }, [facing, startCamera]);

  const handleStartHost = useCallback(async () => {
    setPhotos([]);
    setMultiplayerMode('host');
    setStep('camera');
    const stream = await startCamera(facing);
    hasMultipleCameras().then(setShowSwitchBtn);

    if (stream) {
      initMultiplayer('host', stream);
    }
  }, [facing, startCamera, initMultiplayer]);

  const handleJoinSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCodeInput.length !== 6) return;
    
    setPhotos([]);
    setMultiplayerMode('guest');
    setSessionId(joinCodeInput);
    setStep('camera');
    const stream = await startCamera(facing);
    hasMultipleCameras().then(setShowSwitchBtn);

    if (stream) {
      initMultiplayer('guest', stream, joinCodeInput);
    }
  }, [joinCodeInput, facing, startCamera, initMultiplayer]);

  const handleStartCountdown = useCallback(() => {
    // Sinkronkan countdown ke partner
    if (multiplayerMode && webrtcRef.current) {
      webrtcRef.current.sendMessage('START_COUNTDOWN');
    }
    setStep('countdown');
  }, [multiplayerMode]);

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
    if (multiplayerMode && webrtcRef.current) {
      webrtcRef.current.sendMessage('FILTER_CHANGE', filter);
    }
  }, [multiplayerMode]);

  const handleCountdownComplete = useCallback(() => {
    if (!videoRef.current || !isCameraReady) return;
    
    const filterCSS = getFilterCSS(selectedFilter);
    let dataUrl = '';

    if (multiplayerMode && remoteVideoRef.current && remoteStream) {
      // Split Screen Capture! (pass false for isMirrored to disable mirroring)
      dataUrl = captureMultiplayerFrame(videoRef.current, remoteVideoRef.current, filterCSS, false);
    } else {
      // Single Capture (pass false to disable mirroring)
      dataUrl = captureFrame(videoRef.current, filterCSS, false);
    }

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 400);

    const newPhotos = [...photos, dataUrl];
    setPhotos(newPhotos);

    if (newPhotos.length >= requiredPhotos) {
      setStep('review');
    } else {
      setStep('camera');
    }
  }, [isCameraReady, selectedFilter, facing, photos, requiredPhotos, multiplayerMode, remoteStream]);

  const handleSwitchCamera = useCallback(() => {
    const newFacing = facing === 'user' ? 'environment' : 'user';
    setFacing(newFacing);
    // Restart camera & update WebRTC track
    startCamera(newFacing).then(newStream => {
       if (multiplayerMode && webrtcRef.current && newStream) {
         // Idealnya kita replace track di WebRTC, tapi untuk simpelnya, kita abaikan dulu 
         // atau beritahu user bahwa ganti kamera di tengah multiplayer mungkin menyebabkan disconnect
       }
    });
  }, [facing, startCamera, multiplayerMode]);

  const handleRetakeLastPhoto = useCallback(() => {
    setPhotos((prev) => prev.slice(0, -1));
    setStep('camera');
    if (multiplayerMode && webrtcRef.current) {
      webrtcRef.current.sendMessage('RETAKE_LAST');
    }
  }, [multiplayerMode]);

  const handleReset = useCallback(() => {
    handleStopCamera();
    setPhotos([]);
    setStep('idle');
    setResultPreviewUrl(null);
    setPreviewImage(undefined);
    setMultiplayerMode(false);
    setJoinCodeInput('');
  }, [handleStopCamera]);

  const handleProceedToResult = useCallback(async () => {
    setStep('result');
    setIsRendering(true);

    try {
      const canvas = await renderPhotoFrame(
        photos,
        selectedFrame,
        'original',
        DEFAULT_RENDER_OPTIONS
      );
      resultCanvasRef.current = canvas;
      setResultPreviewUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Gagal merender foto:', err);
    } finally {
      setIsRendering(false);
    }
  }, [photos, selectedFrame]);

  const handleDownload = useCallback(async () => {
    if (!resultCanvasRef.current) return;
    await downloadCanvas(resultCanvasRef.current);
  }, []);

  useEffect(() => {
    if (step === 'result' && photos.length > 0) {
      handleProceedToResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFrame]);

  useEffect(() => {
    return () => {
      handleStopCamera();
    };
  }, [handleStopCamera]);

  /* ----------------------------------------------------------
     Render: IDLE
     ---------------------------------------------------------- */

  if (step === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-10 px-4 animate-fade-in">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Siap Foto?
            </h2>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Pilih mode fotomu. Sendiri atau bareng teman secara online?
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
            <FrameSelector
              activeLayoutId={selectedFrame}
              onSelect={setSelectedFrame}
            />
          </div>

          <div className="space-y-3 pt-2">
            <Button variant="primary" size="lg" fullWidth icon={<Camera size={20} />} onClick={handleStartSingle}>
              Foto Sendiri
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" fullWidth icon={<Users size={20} />} onClick={handleStartHost}>
                Buat Sesi
              </Button>
              <Button variant="secondary" size="lg" fullWidth onClick={() => setStep('join_session')}>
                Gabung Sesi
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     Render: JOIN SESSION
     ---------------------------------------------------------- */

  if (step === 'join_session') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 px-4 animate-fade-in h-full">
        <div className="w-full max-w-sm bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
          <IconButton icon={<ArrowLeft size={20} />} label="Kembali" variant="ghost" onClick={() => setStep('idle')} className="mb-4" />
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Gabung Sesi</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">Masukkan 6 digit kode dari host untuk berfoto bersama secara live.</p>
          
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center text-3xl tracking-[0.25em] font-bold p-4 rounded-xl border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors"
            />
            <Button variant="primary" size="lg" fullWidth type="submit" disabled={joinCodeInput.length !== 6}>
              Gabung Sekarang
            </Button>
          </form>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     Render: CAMERA / COUNTDOWN
     ---------------------------------------------------------- */

  if (step === 'camera' || step === 'countdown') {
    return (
      <div className="flex flex-col gap-4 py-4 px-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <IconButton icon={<X size={20} />} label="Batal" variant="ghost" onClick={handleReset} />
          <div className="flex items-center gap-2">
            {Array.from({ length: requiredPhotos }, (_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < photos.length ? 'bg-[var(--color-primary)] scale-100' :
                  i === photos.length ? 'bg-[var(--color-primary)] scale-125 animate-pulse' : 'bg-[var(--color-border)]'
                }`}
              />
            ))}
            <span className="text-xs text-[var(--color-text-muted)] ml-1">{photos.length}/{requiredPhotos}</span>
          </div>
          <div className="w-11" />
        </div>

        {/* Info Multiplayer */}
        {multiplayerMode && (
          <div className="bg-[var(--color-bg-alt)] border border-[var(--color-primary)] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[var(--color-primary)]" />
              <span className="font-semibold text-[var(--color-text)]">Sesi Foto Bareng</span>
            </div>
            
            {multiplayerMode === 'host' && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <span className="text-[var(--color-text-secondary)] text-xs">Kode Invite:</span>
                <span className="font-bold tracking-widest text-[var(--color-text)]">{sessionId}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(sessionId)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                  title="Copy kode"
                >
                  <Copy size={14} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${remoteStream ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`} />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {remoteStream ? 'Teman terhubung!' : (multiplayerMode === 'host' ? 'Menunggu teman masuk...' : 'Menghubungkan ke host...')}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Camera Viewfinder */}
          <div className="flex-1 w-full lg:max-w-none">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black shadow-lg">
              
              {/* If Single Player */}
              {!multiplayerMode && (
                <div className="w-full h-full bg-white p-3 pb-8 shadow-sm">
                  <div className="w-full h-full overflow-hidden rounded-sm bg-black relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterCSS(selectedFilter) === 'none' ? undefined : getFilterCSS(selectedFilter) }}
                    />
                  </div>
                </div>
              )}

              {/* If Multiplayer Split Screen */}
              {multiplayerMode && (
                <div className="flex w-full h-full gap-2 bg-white p-3 pb-8 shadow-sm">
                  {/* Local Camera (Left Half) */}
                  <div className="w-1/2 h-full overflow-hidden rounded-sm bg-black relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterCSS(selectedFilter) === 'none' ? undefined : getFilterCSS(selectedFilter) }}
                    />
                  </div>
                  {/* Remote Camera (Right Half) */}
                  <div className="w-1/2 h-full overflow-hidden rounded-sm bg-[var(--color-bg-alt)] flex items-center justify-center relative">
                    {remoteStream ? (
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ filter: getFilterCSS(selectedFilter) === 'none' ? undefined : getFilterCSS(selectedFilter) }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Users size={24} className="text-[var(--color-text-muted)] animate-pulse" />
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">Menunggu</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Loading */}
              {!isCameraReady && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-alt)] z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Camera size={32} className="text-[var(--color-text-muted)] animate-pulse" />
                    <p className="text-xs text-[var(--color-text-muted)]">Memulai kamera...</p>
                  </div>
                </div>
              )}

              {/* Countdown overlay */}
              {step === 'countdown' && (
                <CountdownTimer onComplete={handleCountdownComplete} />
              )}

              {/* Flash overlay */}
              {showFlash && <div className="flash-overlay animate-flash z-20" />}
            </div>

            {/* Capture Button */}
            {isCameraReady && step === 'camera' && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleStartCountdown}
                  disabled={multiplayerMode !== false && !remoteStream}
                  className={`capture-btn ${multiplayerMode !== false && !remoteStream ? 'opacity-50 cursor-not-allowed scale-100' : ''}`}
                  aria-label="Ambil foto"
                >
                  <Camera size={28} className="text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar: controls */}
          {isCameraReady && step === 'camera' && (
            <div className="w-full lg:w-96 flex flex-col gap-3">
              <div className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
                <FilterSelector activeFilterId={selectedFilter} onSelect={handleFilterChange} previewImage={previewImage} />
              </div>

              {photos.length > 0 && (
                <div className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Foto Diambil</p>
                  <div className="flex gap-2 flex-wrap">
                    {photos.map((photo, i) => (
                      <div key={i} className="w-14 h-10 rounded-lg overflow-hidden border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                        <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {Array.from({ length: requiredPhotos - photos.length }, (_, i) => (
                      <div key={`empty-${i}`} className="w-14 h-10 rounded-lg border-2 border-dashed border-[var(--color-border)] flex items-center justify-center">
                        <Camera size={12} className="text-[var(--color-text-muted)]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     Render: REVIEW
     ---------------------------------------------------------- */

  if (step === 'review') {
    return (
      <div className="flex flex-col gap-4 py-4 px-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <IconButton icon={<ArrowLeft size={20} />} label="Kembali" variant="ghost" onClick={handleReset} />
          <div className="text-center">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Review Foto</h2>
          </div>
          <div className="w-11" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-5xl mx-auto w-full mt-2">
          <div className="flex-1 w-full lg:max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--color-surface)] shadow-[var(--shadow-card)] border border-[var(--color-border)] animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">{i + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[420px] flex flex-col gap-4">
            <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
              <FrameSelector activeLayoutId={selectedFrame} onSelect={setSelectedFrame} />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="md" icon={<RotateCcw size={18} />} onClick={handleRetakeLastPhoto} className="flex-1">Foto Ulang</Button>
              <Button variant="primary" size="md" icon={<ChevronRight size={18} />} onClick={handleProceedToResult} className="flex-1">Lanjut</Button>
            </div>
            
            <p className="text-xs text-center text-[var(--color-text-secondary)] mt-2">Cek semua foto sebelum membuat hasil akhir.</p>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     Render: RESULT
     ---------------------------------------------------------- */

  if (step === 'result') {
    return (
      <div className="flex flex-col gap-4 py-4 px-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <IconButton icon={<ArrowLeft size={20} />} label="Kembali" variant="ghost" onClick={handleReset} />
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--color-primary)]" />
            <h2 className="text-lg font-bold text-[var(--color-text)]">Foto Kamu Siap!</h2>
          </div>
          <div className="w-11" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-5xl mx-auto w-full mt-2">
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <PhotoPreview previewUrl={resultPreviewUrl} isRendering={isRendering} />
            </div>
          </div>

          <div className="w-full lg:w-[420px] flex flex-col gap-4">
            <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-[var(--shadow-card)] border border-[var(--color-border)]">
              <FrameSelector activeLayoutId={selectedFrame} onSelect={setSelectedFrame} />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="md" icon={<ImagePlus size={18} />} onClick={handleReset} className="flex-1">Foto Baru</Button>
              <Button variant="primary" size="md" icon={<Download size={18} />} onClick={handleDownload} disabled={isRendering || !resultPreviewUrl} className="flex-1">Download</Button>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-text-muted)] p-4 rounded-xl bg-[var(--color-bg-alt)]/50 border border-[var(--color-border)]/50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[var(--color-primary)]">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Foto tidak disimpan di server. Semua proses di browser kamu.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
