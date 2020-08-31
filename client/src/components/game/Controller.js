import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Sprite } from "../../GlobalStyles";
// import { useKeyPress } from "../../hooks/useKeyPress";
import useInterval from "../../hooks/useInterval";
import { playerMoves, playerWalks } from "../../actions";

const SPEED = 1.5;
let delta = 0;

const Controller = ({ socket, user, room, keyPress }) => {
  const { posX, posY, spriteY, spriteX } = useSelector(
    (state) => state.playerStates
  );
  const dispatch = useDispatch();

  //MAIN GAME LOOP
  useInterval(() => {
    if (keyPress.a) {
      console.log(keyPress);
      if (posX < -544) {
        return;
      }
      delta++;
      if (delta > 60) {
        dispatch(playerWalks());
        delta = 0;
      }
      dispatch(playerMoves({ posX: posX - SPEED, posY, spriteY: -400 }));
      socket.emit("move-player", {
        room,
        posX: posX - SPEED,
        posY,
        spriteY,
        spriteX,
      });
    }
    if (keyPress.d) {
      if (posX > 900) {
        return;
      }
      delta++;
      if (delta > 60) {
        dispatch(playerWalks());
        delta = 0;
      }
      dispatch(playerMoves({ posX: posX + SPEED, posY: posY, spriteY: -144 }));
      socket.emit("move-player", {
        user,
        room,
        posX: posX + SPEED,
        posY,
        spriteY,
        spriteX,
      });
    }
    if (keyPress.w) {
      if (posY < -216) {
        return;
      }
      delta++;
      if (delta > 60) {
        dispatch(playerWalks());
        delta = 0;
      }
      dispatch(playerMoves({ posX, posY: posY - SPEED, spriteY: -272 }));
      socket.emit("move-player", {
        user,
        room,
        posX,
        posY: posY - SPEED,
        spriteY,
        spriteX,
      });
    }
    if (keyPress.s) {
      if (posY > 520) {
        return;
      }
      delta++;
      if (delta > 60) {
        dispatch(playerWalks());
        delta = 0;
      }
      dispatch(playerMoves({ posX, posY: posY + SPEED, spriteY: -16 }));
      socket.emit("move-player", {
        user,
        room,
        posX,
        posY: posY + SPEED,
        spriteY,
        spriteX,
      });
    }
  });

  return (
    <Player
      style={{
        left: `${posX + 256 * 2}px`,
        top: `${posY + 144 + 144 / 2}px`,
        backgroundPosition: `${spriteX}px ${spriteY}px`,
        zIndex: 2,
      }} //we have to alter the position of the character to center him in the Camera div
    />
  );
};

const Player = styled(Sprite)``;

export default Controller;