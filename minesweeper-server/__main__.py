#!/usr/bin/env python

import asyncio
import json

import websockets

SERVER_PORT = 8001


async def handler(websocket):
    while (True):
        message = await websocket.recv()
        event = json.loads(message)
        print(event)


async def main():
    async with websockets.serve(handler, "", SERVER_PORT):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
