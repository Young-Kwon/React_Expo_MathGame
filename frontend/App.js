//"StAuth10244: I Young Sang Kwon, 000847777 certify that this material is my original work. 
//No other person's work has been used without due acknowledgement. 
//I have not made my work available to anyone else."

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const MathGameScreen = ({ onGameEnd }) => {
  const [number1, setNumber1] = useState(Math.floor(Math.random() * 100));
  const [number2, setNumber2] = useState(Math.floor(Math.random() * 100));
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const checkAnswer = () => {
    if (parseInt(answer) === number1 + number2) {
      setScore(score + 1);
    }

    if (round < 10) {
      setRound(round + 1);
      setNumber1(Math.floor(Math.random() * 100));
      setNumber2(Math.floor(Math.random() * 100));
      setAnswer('');
    } else {
      onGameEnd(score);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Math Game</Text>
      <Text style={styles.questionText}>{`${number1} + ${number2}`}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={answer}
        onChangeText={setAnswer}
        placeholder="Enter answer"
      />
      <Button title="Check Answer" onPress={checkAnswer} />
      <Text>Score: {score}</Text>
      <Text>Round: {round}/10</Text>
    </View>
  );
};

const SignUpScreen = ({ onSignUp, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    if (!username || !password || !confirmPassword) {
      setErrorMessage('All fields must be completed');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    onSignUp(username, password);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input} 
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input} 
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} />
        <View style={styles.buttonSpacer} />
        <Button title="Back to Login" onPress={onBack} />
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUpScreen, setIsSignUpScreen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleLogin = async () => {
    try {
      let response = await fetch('http://192.168.2.34:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      let data = await response.json();
      if (data.status === 'success') {
        setIsLoggedIn(true); 
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message);
    }
  };

  const handleSignUp = async (username, password) => {
    try {
      let signupResponse = await fetch('http://192.168.2.34:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      let signupData = await signupResponse.json();
      if (signupData.status === 'success') {
         let loginResponse = await fetch('http://192.168.2.34:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        let loginData = await loginResponse.json();
        if (loginData.status === 'success') {
          setIsLoggedIn(true);
        } else {
          setErrorMessage(loginData.message || 'Login failed');
        }
      } else {
        setErrorMessage(signupData.message || 'Sign up failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    setGameOver(false);
  };

  const handleGameEnd = (score) => {
    setFinalScore(score);
    setGameOver(true);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        gameOver ? (
          <View style={styles.container}>
            <Text>Your Final Score: {finalScore}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Play Again" onPress={() => { setGameOver(false); setFinalScore(0); }} />
              <View style={styles.buttonSpacer} />
              <Button title="Logout" onPress={handleLogout} />
            </View>
          </View>
        ) : (
          <MathGameScreen onGameEnd={handleGameEnd} />
        )
      ) : isSignUpScreen ? (
        <SignUpScreen onSignUp={handleSignUp} onBack={() => setIsSignUpScreen(false)} />
      ) : (
        <View style={styles.loginContainer}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button title="LOGIN" onPress={handleLogin} />
            <View style={styles.buttonSpacer} />
            <Button title="Go to SIGNUP" onPress={() => setIsSignUpScreen(true)} />
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 20, 
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  buttonSpacer: {
    width: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
  },
  messageText: {
    color: 'blue',
    marginTop: 20,
    fontSize: 18,
  },
});

export default App;
