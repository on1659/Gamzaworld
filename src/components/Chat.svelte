<script>
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  
  let socket;
  let messages = [];
  let newMessage = '';
  let username = '게스트' + Math.floor(Math.random() * 1000);
  let isConnected = false;

  onMount(() => {
    const socketUrl = import.meta.env.PROD 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    socket = io(socketUrl);

    socket.on('connect', () => {
      isConnected = true;
      addSystemMessage('채팅방에 입장했습니다');
    });

    socket.on('disconnect', () => {
      isConnected = false;
      addSystemMessage('연결이 끊어졌습니다');
    });

    socket.on('chat:message', (data) => {
      messages = [...messages, data];
      scrollToBottom();
    });
  });

  onDestroy(() => {
    if (socket) socket.disconnect();
  });

  function addSystemMessage(text) {
    messages = [...messages, {
      type: 'system',
      text,
      timestamp: Date.now()
    }];
    scrollToBottom();
  }

  function sendMessage() {
    if (!newMessage.trim() || !isConnected) return;

    socket.emit('chat:message', {
      type: 'user',
      username,
      text: newMessage,
      tier: '브론즈',
      icon: '🥉'
    });

    newMessage = '';
  }

  function scrollToBottom() {
    setTimeout(() => {
      const chatBox = document.querySelector('.chat-messages');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="chat">
  <h2>💬 전체 채팅</h2>
  <p class="subtitle">다른 플레이어들과 대화하세요!</p>

  <div class="chat-status">
    <span class="status-dot" class:connected={isConnected}></span>
    {isConnected ? '연결됨' : '연결 중...'}
  </div>

  <div class="chat-container">
    <div class="chat-messages">
      {#each messages as msg}
        {#if msg.type === 'system'}
          <div class="message system">
            <span class="system-text">{msg.text}</span>
          </div>
        {:else}
          <div class="message user">
            <div class="message-header">
              <span class="user-icon">{msg.icon}</span>
              <span class="username">{msg.username}</span>
              <span class="tier">{msg.tier}</span>
              <span class="time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="message-text">{msg.text}</div>
          </div>
        {/if}
      {/each}
    </div>

    <div class="chat-input">
      <input 
        type="text" 
        bind:value={newMessage}
        on:keydown={handleKeydown}
        placeholder="메시지를 입력하세요..."
        disabled={!isConnected}
      />
      <button on:click={sendMessage} disabled={!isConnected || !newMessage.trim()}>
        전송
      </button>
    </div>
  </div>
</div>

<style>
  .chat {
    text-align: center;
  }

  h2 {
    font-size: 32px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: #666;
    margin-bottom: 16px;
  }

  .chat-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 20px;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ccc;
  }

  .status-dot.connected {
    background: #4caf50;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .chat-container {
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 500px;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 12px 12px 0 0;
    border: 1px solid #e0e0e0;
  }

  .message {
    margin-bottom: 12px;
    text-align: left;
  }

  .message.system {
    text-align: center;
  }

  .system-text {
    display: inline-block;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    font-size: 12px;
    color: #666;
  }

  .message.user {
    background: white;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 14px;
  }

  .user-icon {
    font-size: 18px;
  }

  .username {
    font-weight: bold;
    color: #667eea;
  }

  .tier {
    padding: 2px 8px;
    background: #f0f0f0;
    border-radius: 8px;
    font-size: 11px;
    color: #666;
  }

  .time {
    margin-left: auto;
    font-size: 11px;
    color: #999;
  }

  .message-text {
    color: #333;
  }

  .chat-input {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: white;
    border: 1px solid #e0e0e0;
    border-top: none;
    border-radius: 0 0 12px 12px;
  }

  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 14px;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  button {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  button:hover:not(:disabled) {
    transform: scale(1.05);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .chat-container {
      height: 400px;
    }
  }
</style>
