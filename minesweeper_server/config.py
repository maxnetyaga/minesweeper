import enum


class GameDifficulty(enum.Enum):
    '''value is mine density'''
    EXPERT = 0.20625
    MEDIUM = 0.18888
    EASY = 0.16666


SERVER_PORT = 8001

MIN_FIELD_SIZE = 4
MAX_FIELD_SIZE = 48

GAMEID_LEN = 8
CONNECT_ACTIONS = ["start", "join"]
PLAY_ACTIONS = ["reveal", "mark", "unmark"]
