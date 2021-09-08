import { useState } from 'react';
import InProgressComponent from './in-progress';
import GameComponent from './game';
import PlayerAccountComponent from './player-account';
import NewGameComponent from './new-game';

function App() {
  const [user, setUser] = useState();
  const [gameId, setGameId] = useState();
  const [newGameEnabled, setNewGameEnabled] = useState(false);

  const handleLogin = loggedUser => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setGameId(null);
  };

  const handleJoinGame = gameId => {
    setGameId(gameId);
  };

  const handleLeaveGame = () => {
    setGameId(null);
  };

  const handleLoadedGames = games => {
    const noGameInProgress = !games.find(({ ownerUserId }) => ownerUserId === user.id);
    setNewGameEnabled(games.length < 4 && noGameInProgress);
  };

  const handleNewGame = game => {
    setGameId(game.id);
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <PlayerAccountComponent onLogin={handleLogin} onLogout={handleLogout}/>
      </div>
      {
        user && !gameId && newGameEnabled && <div className="row justify-content-center">
          <NewGameComponent loggedUser={user} onNewGame={handleNewGame}/>
        </div>
      }
      {
        user && <div className="row justify-content-center">
          { !gameId && <InProgressComponent onLoadGames={handleLoadedGames} onJoinGame={handleJoinGame}/> }
          { gameId && <GameComponent loggedUser={user} gameId={gameId} onLeaveGame={handleLeaveGame}/> }
        </div>
      }
    </div>
  );
}

export default App;
