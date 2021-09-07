import { Button, Card } from 'react-bootstrap';
import { useCallback } from 'react';
import './index.css';

export default function InProgressCardComponent({ gameId, ownerUserName, guessesCount, highestScore, onJoinGame }) {
  const handleJoinGame = useCallback(() => {
    onJoinGame(gameId);
  }, [gameId, onJoinGame]);

  return (
    <Card>
      <Card.Header className="text-center">{ ownerUserName }</Card.Header>
      <Card.Body>
        <Card.Title className="text-center">Guesses: { guessesCount }</Card.Title>
        <Card.Text className="d-flex flex-column">
          <span className="h6 text-center">Highest Score</span>
          <span>Correct characters: { highestScore?.correctChars }</span>
          <span>Misplaced characters: { highestScore?.misplacedChars }</span>
        </Card.Text>
        <div className="row justify-content-center">
          <Button variant="outline-primary" onClick={handleJoinGame}>Join Game</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
