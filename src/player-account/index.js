import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import DismissibleAlert from '../dismissible-alert';
import environment from '../environment';
import PlayerLoginComponent from '../player-login';
import PlayerRegisterComponent from '../player-register';
import PlayerWelcomeComponent from '../player-welcome';

const Step = {
  LOGIN: 1,
  LOGGED: 2,
  REGISTER: 3,
};

export default function PlayerAccountComponent({ onLogin, onLogout }) {
  const [user, setUser] = useState();
  const [step, setStep] = useState(Step.LOGIN);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id && parsedUser.name) {
        setUser(parsedUser);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id && user?.name) {
      localStorage.setItem('user', JSON.stringify(user));
      setStep(Step.LOGGED);
      onLogin(user);
    } else if (!user?.id && user?.name) {
      setStep(Step.REGISTER);
    } else {
      setStep(Step.LOGIN);
      onLogout();
    }
  }, [user, onLogin, onLogout]);

  const handleLogin = userResponse => {
    setUser(userResponse);
  };

  const handleNotFound = name => {
    setUser({ name });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleRegisterAccept = useCallback(() => {
    axios.post(`${environment.API_URL}/users`, user)
      .then(({ data }) => {
        setUser(data);
      })
      .catch(({ response, request}) => {
        const status = response?.status ?? request?.status;

        if (status === 403) {
          const message = response?.data?.error ?? '';

          if (message) {
            setError(message);
          }
        }
      });
  }, [user]);

  const handleRegisterDecline = () => {
    setUser(null);
  };

  const handleCloseAlert = () => {
    setError('');
  };

  return error
    ? <DismissibleAlert message={error} onClose={handleCloseAlert}/>
    : (
      <>
        { step === Step.LOGGED  && user && <PlayerWelcomeComponent username={user.name} onLogout={handleLogout}/> }
        { step === Step.LOGIN && <PlayerLoginComponent onLogin={handleLogin} onNotFound={handleNotFound}/> }
        { step === Step.REGISTER && user && <PlayerRegisterComponent username={user.name} onAccept={handleRegisterAccept} onDecline={handleRegisterDecline}/> }
      </>
    );
}
