import heapq

GOAL = (
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 0
)

def manhattan(state):
    d = 0
    for i, v in enumerate(state):
        if v == 0:
            continue
        tx, ty = (v - 1) // 4, (v - 1) % 4
        cx, cy = i // 4, i % 4
        d += abs(tx - cx) + abs(ty - cy)
    return d

def neighbors(state):
    res = []
    i = state.index(0)
    x, y = i // 4, i % 4

    moves = {
        "up": (x + 1, y),
        "down": (x - 1, y),
        "left": (x, y + 1),
        "right": (x, y - 1)
    }

    for m, (nx, ny) in moves.items():
        if 0 <= nx < 4 and 0 <= ny < 4:
            ni = nx * 4 + ny
            s = list(state)
            s[i], s[ni] = s[ni], s[i]
            res.append((tuple(s), m))
    return res

def solve(board):
    start = tuple(sum(board, []))
    pq = [(manhattan(start), 0, start, [])]
    visited = set()

    while pq:
        _, cost, state, path = heapq.heappop(pq)

        if state == GOAL:
            return path

        if state in visited:
            continue
        visited.add(state)

        for nxt, move in neighbors(state):
            heapq.heappush(
                pq,
                (cost + 1 + manhattan(nxt), cost + 1, nxt, path + [move])
            )
    return []