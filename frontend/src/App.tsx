import React, { useEffect, useRef, useState } from 'react';
import { Button, Box } from '@mui/material';
import { backend } from 'declarations/backend';
import * as THREE from 'three';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  playerPosition: Position;
  housePosition: Position;
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isInHouse, setIsInHouse] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const houseRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    initializeGame();
    initializeThreeJS();
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (gameState) {
      updateGameObjects();
    }
  }, [gameState]);

  const initializeGame = async () => {
    try {
      const initialState = await backend.initializeGame();
      console.log('Initial game state:', JSON.stringify(initialState));
      setGameState(initialState);
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  };

  const initializeThreeJS = () => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xCCCCCC);

    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 20;
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const player = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x4A90E2 })
    );
    scene.add(player);

    const house = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xF5A623 })
    );
    scene.add(house);

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    playerRef.current = player;
    houseRef.current = house;

    animate();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const updateGameObjects = () => {
    if (gameState && playerRef.current && houseRef.current) {
      playerRef.current.position.set(gameState.playerPosition.x, gameState.playerPosition.y, 0);
      houseRef.current.position.set(gameState.housePosition.x, gameState.housePosition.y, 0);
      console.log('Updated game objects:', JSON.stringify({
        player: gameState.playerPosition,
        house: gameState.housePosition
      }));
    }
  };

  const handleKeyPress = async (event: KeyboardEvent) => {
    if (isInHouse) return;

    let direction = '';
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      default:
        return;
    }

    try {
      const newState = await backend.movePlayer(direction);
      console.log('New game state after move:', JSON.stringify(newState));
      setGameState(newState);
      checkIfInHouse();
    } catch (error) {
      console.error('Failed to move player:', error);
    }
  };

  const checkIfInHouse = async () => {
    try {
      const inHouse = await backend.enterHouse();
      console.log('Player in house:', inHouse);
      setIsInHouse(inHouse);
      if (inHouse && !isVideoActive) {
        initializeVideoChat();
      }
    } catch (error) {
      console.error('Failed to check if in house:', error);
    }
  };

  const initializeVideoChat = () => {
    if (isVideoActive) return;

    try {
      const callFrame = (window as any).Daily.createFrame({
        iframeStyle: {
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '300px',
          height: '225px',
          border: 'none',
          borderRadius: '10px',
        },
      });
      callFrame.join({ url: 'https://you.daily.co/hello' });
      console.log('Video chat initialized');
      setIsVideoActive(true);
    } catch (error) {
      console.error('Failed to initialize video chat:', error);
    }
  };

  return (
    <Box id="game-container">
      <canvas ref={canvasRef} id="game-canvas" />
      <Box id="video-chat">
        {isVideoActive ? 'Video chat active' : 'Video chat inactive'}
      </Box>
      {isInHouse && (
        <Button
          variant="contained"
          color="primary"
          style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000 }}
          onClick={initializeGame}
        >
          Exit House
        </Button>
      )}
    </Box>
  );
};

export default App;
