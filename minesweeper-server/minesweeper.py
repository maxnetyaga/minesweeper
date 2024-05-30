'''minesweeper'''

from typing import Self, List, Set, Dict, Literal
import enum
import random
import itertools


class Minesweeper:
    '''Minesweeper'''
    class GameDifficulty(enum.Enum):
        '''value is mine density'''
        EXPERT = 0.20625
        MEDIUM = 0.18888
        EASY = 0.16666

    class _Cell:
        def __init__(self, game: 'Minesweeper', cell_id: int,
                     value: int, adjacent_cells: Set['_Cell'] = None) -> None:
            self._game = game
            self._cell_id = cell_id
            self.value = value
            self._state: Literal['hidden', 'revealed'] = 'hidden'
            self._adjacent_cells = adjacent_cells or set()

        @property
        def adjacent_cells(self):
            '''get adjacent_cells'''
            return self._adjacent_cells

        def add_adjacent_cells(self, *cells):
            '''add_adjacent_cells'''
            for cell in cells:
                assert len(self._adjacent_cells) <= 8
                self._adjacent_cells.add(cell)

    def __init__(self, field_size: int, difficulty: GameDifficulty) -> None:
        self._field_size = field_size
        self._field: List[List[Minesweeper._Cell]]
        self._field = [[None] * field_size for _ in range(field_size)]
        self._field_index: Dict[int, Minesweeper._Cell]
        self._field_index = {}

        self._mine_count = round(difficulty.value * field_size**2)
        self._free_cells_count = field_size**2 - self._mine_count

        self._create_game()

    def __repr__(self) -> str:
        return '\n'.join(
            map(
                lambda row: ' '.join(
                    map(lambda cell: f"{cell.value:2d}", row)
                ),
                self._field
            )
        )

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

    # @staticmethod
    # def _group_by_len(sequence, chunk_size) -> List:
    #     return list(zip(*[iter(sequence)] * chunk_size))


if __name__ == "__main__":
    game = Minesweeper(18, Minesweeper.GameDifficulty.EASY)
    print(game)
