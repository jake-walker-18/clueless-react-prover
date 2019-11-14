import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import QRCode from "react-native-qrcode";

class App extends React.Component {
  state = {
    name: "",
    username: "",
    password: "",
    masterSecretID: "",
    showQR: false,
    qrValue: ""
  };

  handleSubmit = async () => {
    let { masterSecretID } = this.state.masterSecretID;
    let { name } = this.state.name;
    let { password } = this.state.password;
    let { username } = this.state.username;
    const url = `http://34.244.72.181:8080/credentials-for-default-proof?masterSecretId=${masterSecretID}&proverDID=${name}&proverWalletID=${username}&proverWalletKey=${password}`;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        let json = JSON.stringify(response);
        this.setState({ qrValue: json });
        this.setState({ showQR: true });
      });
  };

  render() {
    const loginPage = (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <TextInput
          style={styles.logincontainer}
          value={this.state.name}
          placeholder="name"
          onChangeText={name => this.setState({ name })}
        />
        <TextInput
          style={styles.logincontainer}
          value={this.state.username}
          placeholder="username"
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          style={styles.logincontainer}
          value={this.state.password}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
        />
        <TextInput
          style={styles.logincontainer}
          value={this.state.masterSecretID}
          placeholder="master secret id"
          onChangeText={masterSecretID => this.setState({ masterSecretID })}
        />
        <Button title="log in" onPress={this.handleSubmit}></Button>
      </View>
    );

    const qrPage = (
      <View style={styles.container}>
        <Text>A qr code somewhere</Text>
        <QRCode value={this.state.qrValue} size={200} />
      </View>
    );

    return this.state.showQR ? qrPage : loginPage;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },

  loginflex: {
    height: 100,
    display: "flex",
    flex: 0
    //backgroundimage: url('./../img/login_bg2.jpg'),
    //backgroundsize: 'cover',
    //backgroundposition: 'center',
  },

  leftcolumn: {
    position: "relative",
    width: 45,
    backgroundColor: "rgba(218, 218, 218, 0.699)"
    //transition: 'all',
  },

  leftcolumnhover: {
    backgroundColor: "rgb(235, 240, 241)",
    width: 50
  },

  logincontainer: {
    position: "relative",
    width: 30,
    marginTop: 10,
    marginLeft: 10
    /* background-color: white; */
  },

  loginclueless: {
    /* margin: px; */
    fontFamily: "helvetica",
    fontSize: 7
  },

  loginforgot: {
    marginTop: 30,
    position: "absolute",
    right: 0,
    color: "rgb(166, 202, 211)",
    textDecorationStyle: "solid"
    //cursor: 'pointer',
  },

  loginbutton: {
    marginTop: 60
  },

  formcontainer: {
    /* position: absolute; */
    /* top: 20vh;
		left: 20vh; */
    width: 100,
    marginTop: 10
  },

  myForm: {
    display: "flex",
    flexDirection: "column"
  }
});

export default App;
