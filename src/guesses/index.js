import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

export default function GuessesComponent({ guesses, users }) {
  const [localGuesses, setLocalGuesses] = useState([]);
  
  useEffect(() => {
    if (guesses.length && users.length) {
      const updatedGuesses = guesses
        .map(guess => ({
          ...guess,
          user: users.find(({ id }) => id === guess.ownerUserId),
        }))
        .sort((a, b) => b.misplacedChars - a.misplacedChars)
        .sort((a, b) => b.correctChars - a.correctChars);

      setLocalGuesses(updatedGuesses);
    }
  }, [guesses, users]);

  return (
    <ListGroup variant="flush">
      { 
        localGuesses.map(({ guess, correctChars, misplacedChars, user }, i) => (
          <ListGroup.Item className="d-flex justify-content-between" variant={correctChars === 5 ? "success" : undefined} key={i}>
            <strong className="text-muted font-monospace">{ user?.name }</strong>
            <span className="text-uppercase">{ guess }</span>
            <span>{ correctChars }, { misplacedChars }</span>
          </ListGroup.Item>))
      }
    </ListGroup>
  );
}
