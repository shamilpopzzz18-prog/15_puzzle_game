GOAL_STATE = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
]

class Board:
    def __init__(self):
        self.board = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 0, 15]
        ]

    def find_empty(self):
        for i in range(4):
            for j in range(4):
                if self.board[i][j] == 0:
                    return i, j

    def move(self, direction):
        x, y = self.find_empty()

        if direction == "up" and x < 3:
            self.board[x][y], self.board[x+1][y] = self.board[x+1][y], self.board[x][y]
        elif direction == "down" and x > 0:
            self.board[x][y], self.board[x-1][y] = self.board[x-1][y], self.board[x][y]
        elif direction == "left" and y < 3:
            self.board[x][y], self.board[x][y+1] = self.board[x][y+1], self.board[x][y]
        elif direction == "right" and y > 0:
            self.board[x][y], self.board[x][y-1] = self.board[x][y-1], self.board[x][y]

    def is_solved(self):
        return self.board == GOAL_STATE