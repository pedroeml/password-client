import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import environment from '../environment';
import { mapToOwnerUserIds } from '../utils/array-utils';
import { getUsers } from '../utils/user-request-utils';
import GuessesComponent from '../guesses';
import GuessComponent from '../guess';

export default function GameComponent({ loggedUser, gameId, onLeaveGame }) {
  const [game, setGame] = useState();
  const [guesses, setGuesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState();
  const intervalRef = useRef(null);

  const loadGuesses = useCallback(() => {
    axios.get(`${environment.API_URL}/guesses/game/${gameId}`)
      .then(({ data }) => {
        setGuesses(data);
      });
  }, [gameId]);

  useEffect(() => {
    axios.get(`${environment.API_URL}/games/${gameId}`)
      .then(({ data }) => {
        loadGuesses();
        setGame(data);
      });

    intervalRef.current = setInterval(loadGuesses, 10000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [gameId, loadGuesses]);

  const updateWinner = (userList, winnerGuess) => {
    const winnerUser = userList.find(({ id }) => id === winnerGuess.ownerUserId);

    if (winnerUser) {
      setWinner(winnerUser);
      if (intervalRef?.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  useEffect(() => {
    if (guesses.length) {
      const userIdsToRequest = mapToOwnerUserIds(guesses, true).filter(id => !users.find(user => user.id === id));
      const winnerGuess = guesses.find(({ correctChars }) => correctChars === 5);

      if (userIdsToRequest.length) {
        getUsers(userIdsToRequest)
          .then(axios.spread((...responses) => {
            const data = responses.map(({ data }) => data);
            const updatedUsers = users.concat(data);

            if (winnerGuess) {
              updateWinner(updatedUsers, winnerGuess);
            }

            setUsers(updatedUsers);        
          }));
      } else if (winnerGuess) {
        updateWinner(users, winnerGuess);
      }
    }
  }, [guesses, users]);

  const handleGuess = useCallback(guess => {
    axios.post(`${environment.API_URL}/guesses`, { guess, gameId, ownerUserId: loggedUser.id })
      .then(() => {
        axios.get(`${environment.API_URL}/guesses/game/${game.id}`)
          .then(({ data }) => {
            setGuesses(data);
          });
      });
  }, [game, gameId, loggedUser]);

  return (
    <>
      <div className="row align-items-start justify-content-around">
        <div className="col-3">
          <GuessComponent guesses={guesses} disabled={winner || game?.ownerUserId === loggedUser.id} onGuess={handleGuess}/>
        </div>
        <Button className="col-2" variant="danger" onClick={onLeaveGame}>Leave Game</Button>
      </div>
      <div className="row col-5">
        <GuessesComponent guesses={guesses} users={users} loggedUser={loggedUser}/>
      </div>
    </>
  );
}
