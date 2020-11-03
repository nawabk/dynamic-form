/*eslint-disable */
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button } from 'react-bootstrap';

import FormCreateLanding from './components/FormCreateLanding';
import './App.css';

const App = () => {
  const [creatingForm, setCreatingForm] = useState(true);
  return (
    <Container>
      <header className='d-flex'>
        <Button variant='link' onClick={() => setCreatingForm(true)}>
          Create Form
        </Button>
        <Button variant='link' onClick={() => setCreatingForm(false)}>
          Show All Form
        </Button>
      </header>
      <main>
        <FormCreateLanding />
      </main>
    </Container>
  );
};

export default App;
