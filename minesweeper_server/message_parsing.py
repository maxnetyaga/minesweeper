'''message_parsing'''

import minesweeper_server.config as conf


def _check_connect_action(event):
    action = event.get("action")
    if action not in conf.CONNECT_ACTIONS:
        raise ValueError(f"Connect action is invalid or missing. {event=}")
    return action


def _check_field_size(event):
    field_size = event.get("fieldSize")
    if not isinstance(field_size, int):
        raise ValueError(f"fieldSize is missing or has invalid type. {event=}")
    field_size = int(field_size)

    is_field_size_valid = (
        isinstance(field_size, int)
        and field_size >= conf.MIN_FIELD_SIZE
    )
    if not is_field_size_valid:
        raise ValueError(f"fieldSize must be an ineger >= {
                         conf.MIN_FIELD_SIZE}. {event=}")
    return field_size


def _check_game_difficulty(event):
    game_difficulty = event.get("gameDifficulty")
    if not game_difficulty:
        raise ValueError(f"gameDifficulty is missing or invalid. {event=}")

    possible_difficulties = [
        d.name for d in conf.GameDifficulty
    ]
    is_game_difficulty_valid = game_difficulty in possible_difficulties
    if not is_game_difficulty_valid:
        raise ValueError(f"gameDifficulty must be {
                         possible_difficulties}. {event=}")

    return game_difficulty


def _check_cell_id(event, field_size):
    cell_id = event.get("cellId")
    if not isinstance(cell_id, int):
        raise ValueError(
            f"cellId is missing or has invalid type. {event=}"
        )

    cell_id = int(cell_id)

    is_cell_id_valid = cell_id < field_size**2
    if not is_cell_id_valid:
        raise ValueError(f"cellId must be < field_size^2. {event=}")

    return cell_id


def parse_init(event):
    '''parse_init'''
    try:
        if not isinstance(event, dict):
            raise ValueError(f"Event must be json object. {event=}")
        result = {}

        result["action"] = _check_connect_action(event)

        match result["action"]:
            case "start":
                result["field_size"] = _check_field_size(event)
                result["game_difficulty"] = _check_game_difficulty(event)
                result["init_cell_id"] = _check_cell_id(
                    event, result["field_size"])

        return result
    except ValueError as e:
        raise RuntimeError("Init failed.") from e


def _check_play_action(event):
    action = event.get("action")
    if action not in conf.PLAY_ACTIONS:
        raise ValueError(f"Play action is invalid or missing. {event=}")
    return action


def parse_play(event, field_size):
    '''parse_init'''
    try:
        if not isinstance(event, dict):
            raise ValueError(f"Event must be json object. {event=}")
        result = {}

        result["cell_id"] = _check_cell_id(
            event, field_size)
        result["action"] = _check_play_action(event)

        return result
    except ValueError as e:
        raise RuntimeError("Step failed.") from e
