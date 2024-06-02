#!/usr/bin/env python

'''minesweeper-server'''

import asyncio
import json
from typing import Dict, Tuple, Set
import random as rnd
import string

import websockets

from minesweeper_server.minesweeper import Minesweeper, GameResponse
import minesweeper_server.config as conf
import minesweeper_server.message_parsing as mp

GAMES: Dict[str, Tuple[Minesweeper, Set[websockets.WebSocketServerProtocol]]]
GAMES = {}


def gen_game_id(id_len: int) -> str:
    '''gen_gameid'''
    def gen_id():
        return ''.join(rnd.choices(string.ascii_lowercase + string.digits, k=id_len))

    game_id = gen_id()
    while game_id in GAMES.keys():  # avoid destroying current game
        game_id = gen_id()

    return game_id


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


async def play_game(websocket: websockets.WebSocketServerProtocol,
                    game: Minesweeper,
                    connected_users: Set[websockets.WebSocketServerProtocol],
                    ):
    '''play_game'''
    async for msg in websocket:
        event = mp.parse_play(json.loads(msg), game.field_size)

        try:
            move = game.play(
                event['cell_id'], event['action']
            )
            respons = {
                "action": "move",
                "moveData": move
            }
        except RuntimeError as exc:
            await send_error(websocket, str(exc))
            continue

        websockets.broadcast(connected_users, json.dumps(respons))


async def start_game(websocket: websockets.WebSocketServerProtocol, field_size: int,
                     game_difficulty: conf.GameDifficulty, init_cell_id: int):
    '''start_game'''
    game = Minesweeper(field_size, conf.GameDifficulty[game_difficulty],
                       init_cell_id)
    connected_users = {websocket}
    game_id = gen_game_id(conf.GAMEID_LEN)

    GAMES[game_id] = game, connected_users

    print(f"{websocket.remote_address} started new game")

    try:
        event = {
            "action": "init",
            "gameId": game_id
        }
        await websocket.send(json.dumps(event))
        await play_game(websocket, game, connected_users)
    finally:
        disconnect_player(websocket, game_id)


async def handler(websocket: websockets.WebSocketServerProtocol):
    '''handler'''
    try:
        message = await websocket.recv()
        print(message)

        event = mp.parse_init(json.loads(message))

        match event["action"]:
            case "join":
                pass
            case "start":
                await start_game(websocket, event["field_size"],
                                 event["game_difficulty"], event["init_cell_id"])
    except Exception as exc:
        await send_error(websocket, str(exc))
        raise RuntimeError(f"{websocket} error.") from exc


async def main():
    '''main'''
    async with websockets.serve(handler, "", conf.SERVER_PORT):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
