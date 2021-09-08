import { useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function GuessComponent({ guesses, disabled, onGuess }) {
  const [guess, setGuess] = useState('');
  const [validated, setValidated] = useState(false);
  const [isFiveCharsLong, setIsFiveCharsLong] = useState(false);
  const [isUnique, setIsUnique] = useState(false);

  useEffect(() => {
    setIsFiveCharsLong(guess.length === 5);
    if (guesses?.length) {
      setIsUnique(!guesses.find(g => g.guess === guess));
    } else {
      setIsUnique(true);
    }
  }, [guess, guesses]);

  useEffect(() => {
    setValidated(isFiveCharsLong && isUnique);
  }, [isFiveCharsLong, isUnique]);

  const handleGuess = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isFiveCharsLong && isUnique) {
      onGuess(guess);
      setGuess('');
      const form = event.currentTarget;
      form.reset();
    }
  }, [guess, onGuess, isFiveCharsLong, isUnique]);

  return (
    <Form noValidate validated={validated} onSubmit={handleGuess}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="guess">Guess</Form.Label>
        <Form.Control
          id="guess"
          type="text"
          placeholder="Enter your guess"
          onChange={e => setGuess(e.target.value.toLowerCase())}
          isInvalid={guess.length > 0 && (!isFiveCharsLong || !isUnique)}
          disabled={disabled}
          aria-describedby="guessHelpBlock"
          required>
        </Form.Control>
        { (guess.length === 0 || (isFiveCharsLong && isUnique)) && <Form.Text id="guessHelpBlock" muted>An unique word 5 characters long.</Form.Text> }
        { guess.length > 0 && !isFiveCharsLong && <Form.Control.Feedback type="invalid">Must be a word 5 characters long.</Form.Control.Feedback> }
        { guess.length > 0 && !isUnique && <Form.Control.Feedback type="invalid">Must be unique.</Form.Control.Feedback>}
      </Form.Group>
      <Button variant="outline-primary" type="submit" disabled={disabled}>Guess</Button>
    </Form>
  );
}
