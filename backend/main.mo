import Bool "mo:base/Bool";
import Text "mo:base/Text";

import Float "mo:base/Float";
import Debug "mo:base/Debug";

actor {
  type Position = { x: Float; y: Float };
  type GameState = {
    playerPosition: Position;
    housePosition: Position;
  };

  var gameState : GameState = {
    playerPosition = { x = 0.0; y = 0.0 };
    housePosition = { x = 5.0; y = 5.0 };
  };

  public func initializeGame() : async GameState {
    gameState := {
      playerPosition = { x = 0.0; y = 0.0 };
      housePosition = { x = 5.0; y = 5.0 };
    };
    Debug.print("Game initialized");
    gameState
  };

  public func movePlayer(direction : Text) : async GameState {
    let currentPosition = gameState.playerPosition;
    let newPosition = switch (direction) {
      case ("up") { { x = currentPosition.x; y = currentPosition.y + 1.0 } };
      case ("down") { { x = currentPosition.x; y = currentPosition.y - 1.0 } };
      case ("left") { { x = currentPosition.x - 1.0; y = currentPosition.y } };
      case ("right") { { x = currentPosition.x + 1.0; y = currentPosition.y } };
      case (_) { currentPosition };
    };
    gameState := { playerPosition = newPosition; housePosition = gameState.housePosition };
    Debug.print("Player moved to: " # debug_show(newPosition));
    gameState
  };

  public func enterHouse() : async Bool {
    let playerPos = gameState.playerPosition;
    let housePos = gameState.housePosition;
    let inHouse = Float.abs(playerPos.x - housePos.x) < 1.0 and Float.abs(playerPos.y - housePos.y) < 1.0;
    Debug.print("Player in house: " # debug_show(inHouse));
    inHouse
  };

  public query func getGameState() : async GameState {
    gameState
  };
};
