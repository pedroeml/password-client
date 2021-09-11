import axios from 'axios';
import { useEffect, useState } from 'react';
import environment from '../environment';
import InProgressCardComponent from '../in-progress-card';
import { mapToOwnerUserIds } from '../utils/array-utils';
import { getUsers } from '../utils/user-request-utils';

export default function InProgressComponent({ onLoadGames, onJoinGame }) {
  const [guesses, setGuesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(`${environment.API_URL}/games/in-progress`)
      .then(({ data }) => {
        onLoadGames(data);

        if (data?.length) {
          setGames(data);
        }
      });
  }, [onLoadGames]);

  useEffect(() => {
    const ownerUserIds = mapToOwnerUserIds(games, true);

    getUsers(ownerUserIds)
      .then(axios.spread((...responses) => {
        const data = responses.map(({ data }) => data);

        if (data?.length) {
          setUsers(games.map(({ ownerUserId }) => data.find(({ id }) => id === ownerUserId)));
        }
      }));
  }, [games]);

  useEffect(() => {
    axios.all(games.map(({ id }) => axios.get(`${environment.API_URL}/guesses/game/${id}`)))
    .then(axios.spread((...responses) => {
      const data = responses.map(({ data }) => data);

      if (data?.length) {
        setGuesses(data.map(d => ({
          highestScore: d.length ? d.reduce((prev, curr) =>
            curr.correctChars > prev.correctChars || (curr.correctChars === prev.correctChars && curr.misplacedChars > prev.misplacedChars)
              ? curr
              : prev,
            d[0])
            : { correctChars: 0, misplacedChars: 0 },
          count: d.length ?? 0
        })));
      }
    }));
  }, [games]);

  return (
    <>
      { games?.length && <h2 className="mt-3 mb-3 text-center">Games In Progress</h2> }
      <div className="row justify-content-around">
        { games.map((game, i) => <InProgressCardComponent
            key={i}
            gameId={game.id}
            ownerUserName={users[i]?.name}
            guessesCount={guesses[i]?.count}
            highestScore={guesses[i]?.highestScore}
            onJoinGame={onJoinGame}/>) }
      </div>
    </>
  );
}
