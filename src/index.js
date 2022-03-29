import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// + Display the location for each move in the format (col, row) in the move history list.
// + Bold the currently selected item in the move list.
// + Rewrite Board to use two loops to make the squares instead of hardcoding them.
// + Add a toggle button that lets you sort the moves in either ascending or descending order.
// - When someone wins, highlight the three squares that caused the win.
// - When no one wins, display a message about the result being a draw
// test 2

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {[0,3,6].map(row => {
          return (
            <div key={row} className="board-row">
              {[0,1,2].map(col => this.renderSquare(col+row))}
            </div>
            )
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isASC: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;    
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastClickedSquare: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  getCoordinate(move) {
    // [0, 1, 2],
    // [3, 4, 5],
    // [6, 7, 8],
    const lastClickedSquare = this.state.history[move].lastClickedSquare;
    return [this.getCol(lastClickedSquare), this.getRow(lastClickedSquare)]
  }

  getRow(squareIndex) {
    switch (squareIndex) {
      case 0: case 1: case 2:
        return 1;
      case 3: case 4: case 5:
        return 2;
      case 6: case 7: case 8:
        return 3;
      default:
        return -1;
    }
  }

  getCol(squareIndex) {
    switch (squareIndex) {
      case 0: case 3: case 6:
        return 1;
      case 1: case 4: case 7:
        return 2;
      case 2: case 5: case 8:
        return 3;
      default:
        return -1;
    }
  }

  reorder() {
    this.setState({ isASC: !this.state.isASC });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move + " (" + this.getCoordinate(move) + ")" :
        'Go to game start';
        return (
          <li key={move}>
            <button className="move-list-btn" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });

    if(!this.state.isASC) {
      moves.reverse();
    }
    
    let status;
    if (winner) status = 'Winner: ' + winner;
    else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="history-order-btn" onClick={() => this.reorder()}>re-oreder</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
