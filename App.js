import React from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import Modal, { ModalContent, ModalTitle } from 'react-native-modals'
import QRCode from 'react-native-qrcode'
import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner'

class App extends React.Component {
	state = {
		masterSecretID: '',
		username: '',
		password: '',
		masterSecretID: '',
		hasCameraPermissions: null,
		showQRScanner: false,
		scanned: undefined,
		proofData: undefined,
		showQR: false,
		showLicenseSelection: false,
		qrValue: '',
		licenseChoice: '',
		proofType: ''
	}

	getPermissions = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA)
		this.setState({ hasCameraPermissions: status === 'granted' })
	}

	getProof = async () => {
		let { password, username, masterSecretID, proofData } = this.state
		let proofjson = JSON.parse(proofData)
		let proofType = proofjson.proof
		const did = 'did'
		proofType = proofType.trim() //proofType.toString().trim() might work for trimming the whitespace
		const url = `http://34.244.193.16:8080/credentials-for-default-proof?masterSecretId=
				${masterSecretID}&proverWalletID=${username}&proverDID=${did}&proof=${proofType}
        &proverWalletKey=${password}`
		await fetch(url)
			.then(response => response.json())
			.then(response => {
				let json = JSON.stringify(response)
				this.setState({ scanned: false })
				console.log(json)
				this.setState({ qrValue: json })
				this.setState({ showQR: true })
				this.setState({ showQRScanner: false })
			})
			.catch(err => console.log('Well that dint work.\n' + err))
	}

	authenticateWallet = async () => {
		let { username, password, masterSecretID } = this.state
		const url = `http://34.244.193.16:8080/login?id=${username}&key=${password}&did=did&masterDid=${masterSecretID}`
		await fetch(url)
			.then(response => response.json())
			.then(response => {
				console.log(JSON.stringify(response))
				if (response.status !== undefined) {
					alert('could not log you in. please try again.')
				} else {
					this.setState({ showQRScanner: true })
					return JSON.stringify(response)
				}
			})
			.catch(err => alert(err))
	}

	render() {
		const loginPage = (
			<View style={{ backgroundColor: '#333', flex: 1 }}>
				<Text
					style={{
						fontWeight: 'bold',
						fontSize: 20,
						color: '#fff',
						marginLeft: 100,
						marginTop: 100
					}}
				>
					welcome to clueless.
				</Text>
				<View style={styles.logincontainer}>
					<TextInput
						style={styles.loginclueless}
						value={this.state.username}
						placeholder='wallet id'
						onChangeText={username => this.setState({ username })}
					/>
					<TextInput
						style={styles.loginclueless}
						value={this.state.password}
						placeholder='wallet key'
						secureTextEntry={true}
						onChangeText={password => this.setState({ password })}
					/>
					<TextInput
						style={styles.loginclueless}
						value={this.state.masterSecretID}
						placeholder='your mid'
						onChangeText={masterSecretID => this.setState({ masterSecretID })}
					/>
					<Button
						title='log in'
						onPress={this.authenticateWallet}
						color='#d65b35'
					></Button>
				</View>
			</View>
		)

		const qrGeneratorPage = (
			<View style={styles.container}>
				<Text>A qr code somewhere</Text>
				<QRCode value={this.state.qrValue} size={200} />
			</View>
		)

		const qrScannerPage = (
			<View style={styles.container}>
				{/* <Modal
					visible={this.state.scanned}
					onTouchOutside={() => this.setState({ scanned: false })}
					modalTitle={<ModalTitle title='Enter your master secret id' />}
					opacity={0.5}
				>
					<ModalContent>
						<TextInput
							style={{
								height: 40,
								borderColor: 'gray',
								borderWidth: 1,
								textAlign: 'center'
							}}
							value={this.state.masterSecretID}
							placeHolder='Charlie'
							onChangeText={masterSecretID => this.setState({ masterSecretID })}
						/>
					</ModalContent>
					<Button title='Verify' onPress={this.getProof}></Button>
				</Modal> */}

				<BarCodeScanner
					onBarCodeScanned={({ data }) => {
						this.setState({ proofData: data }, this.getProof)
					}}
					style={StyleSheet.absoluteFillObject}
				>
					<Text
						style={{
							color: 'white',
							fontWeight: 'bold',
							fontSize: 30,
							marginTop: 100,
							textAlign: 'center'
						}}
					>
						scan the qr code your verifier gives you.
					</Text>
				</BarCodeScanner>
			</View>
		)

		if (this.state.showQR) {
			return qrGeneratorPage
		} else if (this.state.showQRScanner) {
			return qrScannerPage
		} else {
			return loginPage
		}
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#333',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		flex: 1
	},

	loginflex: {
		height: 100,
		display: 'flex',
		flex: 0
		//backgroundimage: url('./../img/login_bg2.jpg'),
		//backgroundsize: 'cover',
		//backgroundposition: 'center',
	},

	leftcolumn: {
		position: 'relative',
		width: 45,
		backgroundColor: 'rgba(218, 218, 218, 0.699)'
		//transition: 'all',
	},

	leftcolumnhover: {
		backgroundColor: 'rgb(235, 240, 241)',
		width: 50
	},

	logincontainer: {
		position: 'relative',
		width: 200,
		height: 200,
		backgroundColor: '#333',
		justifyContent: 'center',
		borderTopWidth: 2,
		borderLeftWidth: 2,
		borderBottomWidth: 2,
		borderColor: '#ff0057',
		marginTop: 200,
		marginLeft: 100
	},

	loginclueless: {
		/* margin: px; */
		fontFamily: 'normal',
		fontSize: 16,
		textAlign: 'left',
		flex: 1,
		color: '#fff'
	}
})

export default App
