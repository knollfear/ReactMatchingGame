import React from "react";

export default function Card({ card, backImage, onClick }) {
  return (
    <div
      onClick={!card.flipped ? onClick : undefined}
      className={`square ${card.matched ? "matched" : ""} ${
        card.flipped ? "flip" : ""
      }`}
    >
      <div className="content">
        {card.flipped ? (
          card.useImg ? (
            <img className={"img-card"} src={card.img} alt={card.txt} />
          ) : (
            <React.Fragment>{card.txt}</React.Fragment>
          )
        ) : (
          <img className="back-card" src={backImage} alt="Memory Card" />
        )}
      </div>
    </div>
  );
}
