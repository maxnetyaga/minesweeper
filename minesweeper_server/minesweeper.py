'''minesweeper'''

from typing import Self, List, Tuple, Set, Dict, Literal
import enum
import random
import itertools
import math

# Typings
GameStatus = Literal['lost', 'won', 'inprogress']

CellStateAction = Literal['hide', 'reveal']
CellStateType = Literal['hidden', 'revealed', 'marked', 'exploded']
CellId = int
CellResponse = Tuple[CellId, CellStateType]

GameResponse = Tuple[GameStatus, List[CellResponse]]


class Minesweeper:
    '''Minesweeper'''
    class GameDifficulty(enum.Enum):
        '''value is mine density'''
        EXPERT = 0.20625
        MEDIUM = 0.18888
        EASY = 0.16666

    class _Cell:
        '''
        Cell class\n
        '-1' in value prop represents mine\n
        '[0-8]' in value prop represents number of adjacent cells with mines 
        '''

        def __init__(self, parent_game: 'Minesweeper', cell_id: int,
                     value: int, adjacent_cells: Set['_Cell'] = None) -> None:
            self._parent_game = parent_game
            self._cell_id = cell_id
            self.value = value
            self._state: CellStateType
            self._state = 'hidden'
            self._adjacent_cells = adjacent_cells or set()

        def __repr__(self):
            string = f"{self.value:2d}({self._cell_id:5d})"
            color = '\033[92m' if self.state == 'revealed' else ''
            return color + string + '\033[0m'

        @property
        def adjacent_cells(self):
            '''get adjacent_cells'''
            return self._adjacent_cells

        def add_adjacent_cells(self, *cells):
            '''add_adjacent_cells'''
            for cell in cells:
                assert len(self._adjacent_cells) <= 8
                self._adjacent_cells.add(cell)

        @property
        def state(self):
            return self._state

        def set_state(self, action: CellStateAction,
                      cell_responses: List[CellResponse] = None,
                      activated_cells: Set['_Cell'] = None) -> List[CellResponse]:
            cell_responses = cell_responses or []
            activated_cells = activated_cells or set()
            activated_cells.add(self)

            if action == 'mark':
                self._state = 'marked'
                cell_responses.append((self._cell_id, 'marked'))

            elif action == 'reveal':
                self._state = 'revealed'
                cell_responses.append((self._cell_id, 'revealed'))
                self._parent_game._revealed_cells_count += 1
                if self.value == 0:
                    for adj_cell in self._adjacent_cells:
                        if adj_cell.state == 'hidden':
                            adj_cell.set_state(action, cell_responses,
                                               activated_cells)
                if self.value == -1:
                    self._state = 'exploded'
                    cell_responses.append((self._cell_id, 'exploded'))

            else:
                raise ValueError(f"{action!r}: Unknown action")

            return cell_responses

    def __init__(self, field_size: int, difficulty: GameDifficulty) -> None:
        self._field_size = field_size
        self._field: List[List[Minesweeper._Cell]]
        self._field = [[None] * field_size for _ in range(field_size)]
        self._field_index: Dict[int, Minesweeper._Cell]
        self._field_index = {}

        self._mine_count = round(difficulty.value * field_size**2)
        self._free_cells_count = field_size**2 - self._mine_count
        self._revealed_cells_count = 0

        self._game_status: GameStatus = 'inprogress'

        self._create_game()

    def __repr__(self) -> str:
        field: List[List[str]] = list(
            map(lambda row: (list(map(str, row))), self._field)
        )
        col_width = len(field[0][0])
        row_height = math.ceil(col_width / 4)
        return ('\n' * row_height).join(map(' '.join, field))

    def _create_field(self) -> Self:
        # filling field and fiels_index with cells
        for rowi, row in enumerate(self._field):
            for coli, _ in enumerate(row):
                cell_id = rowi*self._field_size + coli
                row[coli] = Minesweeper._Cell(self, cell_id, 0)
                self._field_index[cell_id] = row[coli]

        for rowi, row in enumerate(self._field):
            for coli, cur_cell in enumerate(row):
                # indices with respect to boundaries (current cell included!)
                adj_cells_indices = itertools.product(
                    range(max(0, rowi-1), min(self._field_size, rowi+2)),
                    range(max(0, coli-1), min(self._field_size, coli+2))
                )
                # filling adjacent cells for current cell
                for (adj_cell_rowi, adf_cell_coli) in adj_cells_indices:
                    adj_cell = self._field[adj_cell_rowi][adf_cell_coli]
                    if adj_cell is not cur_cell:
                        cur_cell.add_adjacent_cells(adj_cell)

        return self

    def _populate_mines(self) -> Self:
        # flat indices
        mine_indices = random.sample(
            range(self._field_size**2),
            self._mine_count
        )

        for index in mine_indices:
            self._field_index[index].value = -1

        return self

    def _populate_hints(self) -> Self:
        for cell in self._field_index.values():
            # skip cells with mines
            if cell.value == -1:
                continue
            # fill hints
            cell.value = sum(
                1 for adj_cell in cell.adjacent_cells
                if adj_cell.value == -1
            )
        return self
        # def _get_adjacent_cells

    def _create_game(self):
        # pylint: disable-next=protected-access
        self \
            ._create_field() \
            ._populate_mines() \
            ._populate_hints() \


    def update_game_status(self, cell_response: CellResponse) -> GameStatus:
        if self._revealed_cells_count == self._free_cells_count:
            self._game_status = 'won'
        if cell_response[1] == 'exploded':
            self._game_status = 'lost'

        return self._game_status

    def take_step(self, cell_id: int, action: CellStateType) -> GameResponse:
        if self._game_status != 'inprogress':
            raise RuntimeError("Game is finished")

        cell_responses = self._field_index[cell_id].set_state(action)

        for response in cell_responses:
            self.update_game_status(response)

        return (self._game_status, cell_responses)


if __name__ == "__main__":
    game = Minesweeper(4, Minesweeper.GameDifficulty.EASY)
    while True:
        print(game)
        step = int(input('step: '))
        action = 'reveal'
        print(game.take_step(step, action))
