import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import environment from '../environment';

export default function NewGameComponent({ loggedUser, onNewGame }) {
  const [answer, setAnswer] = useState('');
  const [validated, setValidated] = useState(false);
  const [isFiveCharsLong, setIsFiveCharsLong] = useState(false);

  useEffect(() => {
    setIsFiveCharsLong(answer.length === 5);
  }, [answer]);

  useEffect(() => {
    setValidated(isFiveCharsLong);
  }, [isFiveCharsLong]);

  const handleGuess = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isFiveCharsLong) {
      axios.post(`${environment.API_URL}/games`, { answer, ownerUserId: loggedUser.id })
        .then(({ data }) => {
          onNewGame(data);
        });
      setAnswer('');
      const form = event.currentTarget;
      form.reset();
    }
  }, [answer, isFiveCharsLong, loggedUser, onNewGame]);

  return (
    <>
      <h3 className="mt-3 mb-3 text-center">Create Your Game</h3>
      <Form className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-3" noValidate validated={validated} onSubmit={handleGuess}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="guess">Word</Form.Label>
          <Form.Control
            id="guess"
            type="text"
            placeholder="Enter the game answer"
            onChange={e => setAnswer(e.target.value.toLowerCase())}
            isInvalid={answer.length > 0 && !isFiveCharsLong}
            aria-describedby="guessHelpBlock"
            required>
          </Form.Control>
          { (answer.length === 0 || isFiveCharsLong) && <Form.Text id="guessHelpBlock" muted>A word 5 characters long.</Form.Text> }
          { answer.length > 0 && !isFiveCharsLong && <Form.Control.Feedback type="invalid">Must be a word 5 characters long.</Form.Control.Feedback> }
        </Form.Group>
        <Button variant="outline-primary" type="submit">New Game</Button>
      </Form>
    </>
  );
}
