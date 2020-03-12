import React from "react";
import Row from 'react-bootstrap'

export default function Card({ cards, backImage, onClick }) {
  return (
    <Row>
     {for (i=0; i<cards.length; i ++{
       
     }           <Card
                  card={card}
                  backImage={this.state.backImage}
                  onClick={() => this.handleClick(index)}
                  key={`${card.useImg ? "pic" : "name"}-${card.img}`}
                />
     }
     )
    </Row>
  )
}