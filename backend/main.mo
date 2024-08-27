import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

actor {
  // Types
  type Position = { x: Float; y: Float };
  type GameState = {
    playerPosition: Position;
    housePosition: ?Position;
  };

  // Stable variables
  stable var gameState : GameState = {
    playerPosition = { x = 0.0; y = 0.0 };
    housePosition = ?{ x = 5.0; y = 5.0 };
  };

  // Initialize game
  public func initializeGame() : async GameState {
    gameState := {
      playerPosition = { x = 0.0; y = 0.0 };
      housePosition = ?{ x = 5.0; y = 5.0 };
    };
    Debug.print("Game initialized: " # debug_show(gameState));
    return gameState;
  };

  // Move player
  public func movePlayer(direction : Text) : async GameState {
    let currentPosition = gameState.playerPosition;
    let newPosition = switch (direction) {
      case ("up") { { x = currentPosition.x; y = currentPosition.y + 1.0 } };
      case ("down") { { x = currentPosition.x; y = currentPosition.y - 1.0 } };
      case ("left") { { x = currentPosition.x - 1.0; y = currentPosition.y } };
      case ("right") { { x = currentPosition.x + 1.0; y = currentPosition.y } };
      case (_) { currentPosition };
    };

    // Basic collision detection
    let isCollision = switch (gameState.housePosition) {
      case (null) { false };
      case (?housePos) {
        Float.abs(newPosition.x - housePos.x) < 1.0 and
        Float.abs(newPosition.y - housePos.y) < 1.0
      };
    };

    if (not isCollision) {
      gameState := {
        playerPosition = newPosition;
        housePosition = gameState.housePosition;
      };
    };

    Debug.print("Player moved: " # debug_show(gameState));
    return gameState;
  };

  // Enter house
  public func enterHouse() : async Bool {
    switch (gameState.housePosition) {
      case (null) { false };
      case (?housePos) {
        let playerPos = gameState.playerPosition;
        if (Float.abs(playerPos.x - housePos.x) < 1.0 and
            Float.abs(playerPos.y - housePos.y) < 1.0) {
          Debug.print("Player entered house");
          true
        } else {
          false
        };
      };
    };
  };

  // Get game state
  public query func getGameState() : async GameState {
    Debug.print("Current game state: " # debug_show(gameState));
    gameState
  };
};
