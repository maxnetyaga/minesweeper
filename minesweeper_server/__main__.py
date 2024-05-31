#!/usr/bin/env python

'''minesweeper-server'''

import asyncio
import json
from typing import Dict, Tuple, Set
import random as rnd
import string

import websockets

from minesweeper_server.minesweeper import Minesweeper

MIN_FIELD_SIZE = 1

GAMEID_LEN = 8
CONNECT_ACTIONS = ["start", "join"]

SERVER_PORT = 8001

GAMES: Dict[str, Tuple[Minesweeper, Set[websockets.WebSocketServerProtocol]]]
GAMES = {}


def gen_gameid(id_len: int) -> str:
    '''gen_gameid'''
    return ''.join(rnd.choices(string.ascii_lowercase + string.digits, k=id_len))


def validate_init_event(event: Dict):
    '''validate_init_event'''
    error = None

    if not isinstance(event, dict):
        error = "Event must be json object"

    if event.get("action") not in CONNECT_ACTIONS:
        error = "Connect action is invalid or missing"

    # if not ((isinstance(event.get("gameId"), str))
    #         and (len(event.get("gameId")) == GAMEID_LEN)):
    #     error = f"gameId must be a string of length {GAMEID_LEN}"

    match event["action"]:
        case "start":
            field_size = event.get("fieldSize")
            if not (isinstance(field_size, int) and field_size >= MIN_FIELD_SIZE):
                error = ("fieldSize is missing or invalid. "
                         f"fieldSize must be an ineger >= {MIN_FIELD_SIZE}")

            game_difficulty = event.get("gameDifficulty")
            possible_difficulties = [
                d.name for d in Minesweeper.GameDifficulty
            ]

            if game_difficulty not in possible_difficulties:
                error = ("gameDifficulty is missing or invalid. "
                         f"gameDifficulty must be {possible_difficulties}")

    return error


async def send_error(websocket: websockets.WebSocketServerProtocol, message):
    '''send_error'''
    event = {
        "action": "error",
        "message": message
    }
    await websocket.send(json.dumps(event))


def disconnect_player(websocket: websockets.WebSocketServerProtocol, game_id):
    '''disconnect_player'''
    connected_players = GAMES[game_id][1]
    connected_players.remove(websocket)
    print(f"{websocket.remote_address} left game#{game_id}")


async def start_game(websocket: websockets.WebSocketServerProtocol, field_size, game_difficulty):
    '''start_game'''
    game = Minesweeper(field_size, Minesweeper.GameDifficulty[game_difficulty])
    connected = {websocket}

    game_id = gen_gameid(GAMEID_LEN)
    while game_id in GAMES.keys():  # avoid destroying current game
        game_id = gen_gameid(GAMEID_LEN)
    GAMES[game_id] = game, connected

    print(f"{websocket.remote_address} started new game")

    try:
        event = {
            "action": "init",
            "gameId": game_id
        }
        await websocket.send(json.dumps(event))
        await asyncio.sleep(15)
    finally:
        disconnect_player(websocket, game_id)


async def handler(websocket):
    message = await websocket.recv()
    event = json.loads(message)

    error = validate_init_event(event)
    if error:
        print(f"Player init failed: {error}")
        await send_error(websocket, error)
        return

    match event["action"]:
        case "join":
            pass
        case "start":
            await start_game(websocket, event["fieldSize"], event["gameDifficulty"])


async def main():
    async with websockets.serve(handler, "", SERVER_PORT):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
