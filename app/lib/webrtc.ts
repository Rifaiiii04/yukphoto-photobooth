/* ============================================================
   WEBRTC MULTIPLAYER MANAGER
   Menggunakan PeerJS untuk koneksi P2P tanpa server (selain signaling).
   Peringatan: Class ini HANYA BOLEH di-instantiate di Client Side (di dalam useEffect).
   ============================================================ */

import Peer, { DataConnection, MediaConnection } from 'peerjs';

export type MultiplayerRole = 'host' | 'guest';

export interface MultiplayerEvents {
  onRemoteStream: (stream: MediaStream) => void;
  onRemoteDisconnect: () => void;
  onSyncMessage: (type: string, payload?: any) => void;
  onError: (error: string) => void;
  onReady?: () => void;
}

export class CollaborationManager {
  private peer: Peer | null = null;
  private dataConnection: DataConnection | null = null;
  private mediaConnection: MediaConnection | null = null;
  private localStream: MediaStream;
  private role: MultiplayerRole;
  private events: MultiplayerEvents;

  constructor(
    role: MultiplayerRole,
    localStream: MediaStream,
    events: MultiplayerEvents,
    sessionId?: string // Diisi jika guest, atau di-generate jika host
  ) {
    this.role = role;
    this.localStream = localStream;
    this.events = events;
    this.init(sessionId);
  }

  private init(sessionId?: string) {
    // Prefix untuk memastikan unik di public PeerJS server
    const prefix = 'yukphoto-';
    
    if (this.role === 'host') {
      const code = sessionId || Math.floor(100000 + Math.random() * 900000).toString();
      const peerId = prefix + code;
      this.peer = new Peer(peerId);

      this.peer.on('open', (id) => {
        console.log('Host ready with ID:', id);
        // Beritahu UI bahwa host sudah siap (dan pass kodenya)
        if (this.events.onReady) this.events.onReady();
      });

      // Menerima data connection dari guest
      this.peer.on('connection', (conn) => {
        this.setupDataConnection(conn);
      });

      // Menerima call (video stream) dari guest
      this.peer.on('call', (call) => {
        this.mediaConnection = call;
        call.answer(this.localStream); // Jawab dengan video kita
        this.setupMediaConnection(call);
      });

    } else {
      // Guest
      if (!sessionId) {
        this.events.onError('Session ID tidak valid');
        return;
      }

      this.peer = new Peer(); // ID random untuk guest

      this.peer.on('open', (id) => {
        console.log('Guest ready with ID:', id);
        const hostId = prefix + sessionId;

        // 1. Konek data channel ke host
        const conn = this.peer!.connect(hostId);
        this.setupDataConnection(conn);

        // 2. Telepon host sambil bawa video kita
        const call = this.peer!.call(hostId, this.localStream);
        this.setupMediaConnection(call);
        
        if (this.events.onReady) this.events.onReady();
      });
    }

    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
      this.events.onError(err.message);
    });
  }

  private setupDataConnection(conn: DataConnection) {
    this.dataConnection = conn;
    
    conn.on('open', () => {
      console.log('Data connection opened');
    });

    conn.on('data', (data: any) => {
      if (data && data.type) {
        this.events.onSyncMessage(data.type, data.payload);
      }
    });

    conn.on('close', () => {
      this.events.onRemoteDisconnect();
    });
  }

  private setupMediaConnection(call: MediaConnection) {
    this.mediaConnection = call;

    call.on('stream', (remoteStream) => {
      this.events.onRemoteStream(remoteStream);
    });

    call.on('close', () => {
      this.events.onRemoteDisconnect();
    });
  }

  /**
   * Kirim pesan sync ke partner (misal: 'start_countdown', 'filter_change')
   */
  public sendMessage(type: string, payload?: any) {
    if (this.dataConnection && this.dataConnection.open) {
      this.dataConnection.send({ type, payload });
    }
  }

  /**
   * Tutup semua koneksi
   */
  public destroy() {
    if (this.dataConnection) this.dataConnection.close();
    if (this.mediaConnection) this.mediaConnection.close();
    if (this.peer) this.peer.destroy();
  }
}
