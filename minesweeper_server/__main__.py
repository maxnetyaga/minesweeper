#!/usr/bin/env python

'''minesweeper-server'''

import asyncio
import json
from typing import Dict, Tuple, Set
import random as rnd
import string

import websockets

from minesweeper_server.minesweeper import Minesweeper
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


async def send_error(user: websockets.WebSocketServerProtocol, message):
    '''send_error'''
    event = {
        "action": "error",
        "message": message
    }
    await user.send(json.dumps(event))


def disconnect_all_users(game_id):
    '''disconnect_all_users'''
    connected_users = GAMES[game_id][1].copy()

    for user in connected_users:
        disconnect_user(user, game_id)


def disconnect_user(player: websockets.WebSocketServerProtocol, game_id):
    '''disconnect_player'''
    game = GAMES.get(game_id)
    if not game:
        return

    connected_users = game[1]
    connected_users.remove(player)

    print(f"Player {player.remote_address} left game#{game_id}.")

    if len(connected_users) == 0:
        end_game(game_id)


def end_game(game_id):
    '''end_game'''
    del GAMES[game_id]
    print(f"Game #{game_id} finished.")


async def play_game(user: websockets.WebSocketServerProtocol,
                    game_id):
    '''play_game'''
    game, connected_users = GAMES[game_id]

    async for msg in user:
        event = mp.parse_play(json.loads(msg), game.field_size)
        print(f"Player {user.remote_address} has sent move: {msg}")

        move = game.play(
            event['cell_id'], event['action']
        )
        respons = {
            "action": "move",
            "moveData": move
        }

        websockets.broadcast(connected_users, json.dumps(respons))

        is_game_finished = move[0] in ["lost", "won"]
        if is_game_finished:
            disconnect_all_users(game_id)
            return


async def start_game(user: websockets.WebSocketServerProtocol, field_size: int,
                     game_difficulty: conf.GameDifficulty, init_cell_id: int):
    '''start_game'''
    game = Minesweeper(field_size, conf.GameDifficulty[game_difficulty],
                       init_cell_id)
    connected_users = {user}
    game_id = gen_game_id(conf.GAMEID_LEN)

    GAMES[game_id] = game, connected_users

    print(f"{user.remote_address} started new game #{game_id}.")

    try:
        event = {
            "action": "init",
            "gameId": game_id
        }
        await user.send(json.dumps(event))
        await play_game(user, game_id)
    finally:
        disconnect_user(user, game_id)


async def handler(user: websockets.WebSocketServerProtocol):
    '''handler'''
    try:
        message = await user.recv()
        print(f"Player {user.remote_address} has sent init: {message}")

        event = mp.parse_init(json.loads(message))

        match event["action"]:
            case "join":
                pass
            case "start":
                await start_game(user, event["field_size"],
                                 event["game_difficulty"], event["init_cell_id"])
    except Exception as exc:
        await send_error(user, str(exc))
        raise RuntimeError(f"Player {user.remote_address} error.") from exc


async def main():
    '''main'''
    async with websockets.serve(handler, "", conf.SERVER_PORT):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
