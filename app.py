from flask import Flask, request, jsonify
from solver import solve
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   # allow browser to talk to backend

@app.route("/solve", methods=["POST"])
def solve_puzzle():
    data = request.get_json()
    board_state = data["board"]

    moves = solve(board_state)

    return jsonify({
        "moves": moves
    })

if __name__ == "__main__":
    app.run(debug=True)
