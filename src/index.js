import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function encodeIndexToCoodinate(i) {
  var coodinate = [i < 3 ? 1 : i < 6 ? 2 : 3, i % 3 + 1];
  return coodinate;
}


function calcurateWinner(squares) {
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

class Board extends React.Component {

  render() {
    const columns = [];
    for (let i = 0; i < 3; i++) {
      columns.push(this.renderColumn(i))
    }
    return (
      <div>
        {columns}
      </div>
    );
  }

  renderColumn(columnIndex) {
    const cells = [];
    for (let i = 0 + 3 * columnIndex; i < 3 * (1 + columnIndex); i++) {
      cells.push(this.renderSquare(i))
    }
    return (
      <div className="board-row">
        {cells}
      </div>
    );
  }

  renderSquare(i) {
    return (
      < Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
}

class Game extends React.Component {
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calcurateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: encodeIndexToCoodinate(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calcurateWinner(current.squares);

    const moves = history.map((data, step) => {
      const desc = step ?
        'Go to move #' + step + '(' + data.move[0] + ',' + data.move[1] + ')' :
        'Go to game start';
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
