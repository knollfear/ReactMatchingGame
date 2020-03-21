import React from "react";
import Card from "./card";
import GameSelector from "./gameSelector";
import fearless from "../img/fearless.png"

export default class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    let urlParams = new URLSearchParams(window.location.search);
    let rows = urlParams.get("rows") || 4;
    let columns = urlParams.get("columns") || 4;
    rows*columns % 2 && rows ++;
    console.log(rows);
    console.log(columns);
    this.sendResults = this.sendResults.bind(this);
    this.state = {
      columns: columns,
      rows: rows,
      cards: [],
      winner: false,
      turns: 0,
      matches: 0,
      activeCard: null,
      index: null,
      selectedSource: "fearless",
      backImage: `${fearless}`
    };
    this.handleClick = this.handleClick.bind(this);
  }

  sendResults(source) {
    this.setState({ selectedSource: source }, () => {
      console.log(`Set selectedSource to ${this.state.selectedSource}`);
    });
  }

  setupGame() {
    fetch(`../static/media/${this.state.selectedSource}.json`)
      .then(response => {
        return response.json();
      })
      .then(entity => {
        console.log(entity);
        let possibleCards = entity.cards;

        let chosenCards = [].fill(null, this.state.columns * this.state.rows);
        for (let i = 0; i < (this.state.columns * this.state.rows) / 2; i++) {
          let randomPos = Math.floor(Math.random() * possibleCards.length);

          let card = possibleCards[randomPos];
          card.useImg = true;
          card.flipped = false;
          chosenCards.push(card);
          card = Object.assign({}, card);
          card.useImg = false;
          chosenCards.push(card);
          possibleCards.splice(randomPos, 1);
        }

        shuffle(chosenCards);

        this.setState({ cards: chosenCards });
      });
  }
  componentDidMount() {
    this.setupGame();
  }
  handleClick(index) {
    console.log(this.state);
    if (this.state.transition) {
      return;
    }
    let cards = this.state.cards.slice();
    let card = cards[index];
    card.flipped = true;
    this.setState({ cards: cards, transition: true }, () => {
      let cards = this.state.cards.slice();
      let flippedCards = cards.filter(card => card.flipped && !card.matched);
      let matches = this.state.matches;
      let turns = this.state.turns;
      let toSleep = 0;
      if (flippedCards.length === 2) {
        turns++;
        if (flippedCards[0].txt === flippedCards[1].txt) {
          flippedCards.forEach(card => (card.matched = true));
          matches++;
        } else {
          toSleep = 1000;
          flippedCards.forEach(card => (card.flipped = false));
        }
      }
      sleep(toSleep).then(() => {
        this.setState({
          matches: matches,
          turns: turns,
          cards: cards,
          transition: false
        });
      });
    });
  }

  render() {
    return (
      <div className={"memory-game"}>
        {this.state.selectedSource ? (
          <div
            className="grid-container parent"
            style={{
              gridTemplateColumns: `repeat(${this.state.columns}, 1fr)`,
              gridTemplateRows: `repeat(${this.state.rows}, 1fr)`
            }}
          >
            {this.state.cards.map((card, index) => {
              return (
                <Card
                  card={card}
                  backImage={this.state.backImage}
                  onClick={() => this.handleClick(index)}
                  key={`${card.useImg ? "pic" : "name"}-${card.img}`}
                />
              );
            })}
          </div>
        ) : (
          <GameSelector sendResults={this.sendResults} />
        )}
      </div>
    );
  }
}

function shuffle(array) {
  let m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
