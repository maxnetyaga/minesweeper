'''request_templates'''

start_game = {
    "type": "object",
    "properties": {
        "action": {"const": "start"},
    }
}

join_game = {
    "type": "object",
    "properties": {
        "action": {"const": "join"},
        "game_id": {"type": "string"}
    }
}
