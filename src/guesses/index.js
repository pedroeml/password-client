import { useCallback, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';

export default function GuessesComponent({ guesses, users, loggedUser }) {
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

  const getVariant = useCallback((user, correctChars) => {
    if (correctChars === 5) {
      return 'success';
    } else if (user.id === loggedUser.id) {
      return 'primary';
    }

    return undefined;
  }, [loggedUser]);

  return (
    <ListGroup variant="flush">
      { 
        localGuesses.map(({ guess, correctChars, misplacedChars, user }, i) => (
          <ListGroup.Item className="row d-flex justify-content-between"
            variant={getVariant(user, correctChars)} key={i}>
            <strong className="col-5 text-muted font-monospace">{ user?.name }</strong>
            <span className="col-4 d-flex justify-content-center text-uppercase font-monospace">{ guess }</span>
            <span className="col-3 d-flex justify-content-end">{ correctChars }, { misplacedChars }</span>
          </ListGroup.Item>))
      }
    </ListGroup>
  );
}
