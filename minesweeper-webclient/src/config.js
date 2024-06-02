import cellBg1 from "./assets/cells_hidden/1.png";
import cellBg2 from "./assets/cells_hidden/2.png";
import cellBg3 from "./assets/cells_hidden/3.png";
import cellBg4 from "./assets/cells_hidden/4.png";

import cellR0 from "./assets/cells_revealed/0.png";
import cellR1 from "./assets/cells_revealed/1.png";
import cellR2 from "./assets/cells_revealed/2.png";
import cellR3 from "./assets/cells_revealed/3.png";
import cellR4 from "./assets/cells_revealed/4.png";
import cellR5 from "./assets/cells_revealed/5.png";
import cellR6 from "./assets/cells_revealed/6.png";
import cellR7 from "./assets/cells_revealed/7.png";
import cellR8 from "./assets/cells_revealed/8.png";

import cellBomb from "./assets/cell_bomb.png";
import cellMarked from "./assets/cell_marked.png";

export const config = {
    cellBackgrounds: [cellBg1, cellBg2, cellBg3, cellBg4],
    cellRevealedTextures: [
        cellR0,
        cellR1,
        cellR2,
        cellR3,
        cellR4,
        cellR5,
        cellR6,
        cellR7,
        cellR8,
    ],
    cellBombTexture: cellBomb,
    cellMarkedTexture: cellMarked,
    defFieldSize: 16,
    minFieldSize: 4,
    maxFieldSize: 48,
};
