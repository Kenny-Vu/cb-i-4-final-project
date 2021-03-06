import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { playerJoins, updateGameState } from "../../actions";
import LogOut from "./LogOut";
import Like from "./Like";
import { useKeyPress } from "../../hooks/useKeyPress";
import { Sprite, Button } from "../../GlobalStyles";
import Bubble from "./Bubble";
import Npc from "./Npc";

//TEST
import Controller from "./Controller";

const Game = ({ socket, user, room }) => {
  const [interacting, setInteracting] = useState(false);
  const { keyPress, handleKeyPress, handleKeyUp } = useKeyPress();
  //retrieving current X and Y position of our user's sprite
  const { posX, posY, spriteY, spriteX } = useSelector(
    (state) => state.playerStates
  );
  const { activePlayers } = useSelector((state) => state.gameStates);
  const dispatch = useDispatch();
  const gameZoneRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    socket.emit("request-existing-players", { room });
    //adds users sprites that are already in room excluding main player
    socket.on("populate-game-zone", ({ players }) => {
      dispatch(updateGameState(players));
      //REDUX - ADDING NEW PLAYERSTATE HERE BECAUSE SOCKET.ID IS AVAILABLE
      dispatch(playerJoins({ id: socket.id, user, room }));
    });
    //main player
    socket.emit("player-joins", {
      user,
      room,
      posX,
      posY,
      spriteY,
      spriteX,
    });
    // friend joins room - add all members except main player
    socket.on("new-player-joins", ({ players }) => {
      delete players[`${socket.id}`];
      const playersArray = Object.values(players);
      dispatch(updateGameState(playersArray));
    });
    //update everyone's position except the main player
    socket.on("update-player-position", ({ players }) => {
      delete players[`${socket.id}`];
      const playersArray = Object.values(players);
      dispatch(updateGameState(playersArray));
    });
  }, []);

  const handleMusic = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handleInteraction = (e) => {
    if (e.code === "Space") {
      setInteracting(true);
    }
  };

  useEffect(() => {
    const gameZone = gameZoneRef.current;

    gameZoneRef.current.addEventListener("keydown", handleKeyPress);
    gameZoneRef.current.addEventListener("keydown", handleInteraction);
    gameZoneRef.current.addEventListener("keyup", handleKeyUp);
    return () => {
      gameZone.removeEventListener("keydown", handleKeyPress);
      gameZone.removeEventListener("keydown", handleInteraction);
      gameZone.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <GameZone ref={gameZoneRef} tabIndex={0}>
      <Camera>
        <Map
          style={{
            left: `${-posX}px`,
            top: `${-posY}px`,
          }}
        >
          <Controller
            socket={socket}
            user={user}
            room={room}
            keyPress={keyPress}
            interacting={interacting}
            setInteracting={setInteracting}
          />
          {activePlayers &&
            activePlayers.map((player, index) => (
              <div key={`div-${index}`}>
                {player.liked && (
                  <Bubble
                    friendX={player.posX}
                    friendY={player.posY}
                    key={`bubble-${index}`}
                  />
                )}
                <Sprite
                  key={`friend-${index}`}
                  style={{
                    left: `${player.posX + 256 * 2}px`,
                    top: `${player.posY + 144 + 144 / 2}px`,
                    backgroundPosition: `${player.spriteX}px ${player.spriteY}px`,
                    zIndex: 1,
                  }} //we have to alter the position of the character to center him in the Camera div
                />
              </div>
            ))}
          <Npc></Npc>
        </Map>
      </Camera>
      <ActionBar>
        <Like socket={socket} room={room}>
          Like
        </Like>
        <div>
          <audio ref={audioRef} src="assets/Abstraction-Candy.wav" />
          <Music onClick={handleMusic}>
            Music!
            <span role="img" aria-label="music notes">
              🎵
            </span>
          </Music>
        </div>
        <LogOut socket={socket}>Logout</LogOut>
      </ActionBar>
    </GameZone>
  );
};

const GameZone = styled.div`
  position: relative;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: grey;
`;

const Camera = styled.div`
  position: relative;
  height: ${`${144 * 4}px`};
  width: ${`${256 * 4}px`};
  background: lightgray;
  border: solid;
`;

const Map = styled.div`
  position: relative;
  height: ${`${144 * 6}px`};
  width: ${`${256 * 6}px`};
  background: url("assets/map.png");
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 0 16px black;
  image-rendering: pixelated;
`;
const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  border: solid;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
`;

const Music = styled(Button)`
  background: #53d769;
`;

export default Game;
