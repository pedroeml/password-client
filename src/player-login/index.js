import axios from 'axios';
import { useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import environment from '../environment';
import './index.css';

export default function PlayerLoginComponent({ onLogin, onNotFound }) {
  const [username, setUsername] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      axios.get(`${environment.API_URL}/users/name/${username}`)
        .then(({ data }) => {
          onLogin(data);
        })
        .catch(({ response, request }) => {
          const status = response?.status ?? request?.status;

          if (status === 404) {
            onNotFound(username);
          }
        });
    }

    setValidated(true);
  }, [username, onLogin, onNotFound]);

  return (
    <div className="form-container col-3 d-flex align-items-center">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">User name</Form.Label>
          <Form.Control
            id="username"
            type="text"
            placeholder="Enter your user name"
            onChange={e => setUsername(e.target.value)}
            required>
          </Form.Control>
        </Form.Group>
        <Button variant="outline-primary" type="submit">Login</Button>
      </Form>
    </div>
  );
}
