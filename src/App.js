import React, { Component } from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

var jsonData = require('./config/config.json')
var pw = require('./config/password.json')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      isLogInModalOpen: false,
      password: pw[0],
      isChangePasswordModalOpen: false,
      isAddTabModalOpen: false,
      isAddContentModalOpen: false,
      selectedIndex: -1,
      config: jsonData,
      prices: Array(jsonData.length).fill(0),
      quantity: 0,
      totalPrice: 0,
    }

    this.changeQuantity = this.changeQuantity.bind(this)
  }

  openLogInModal = () => {
    this.setState({
      isLogInModalOpen: true,
    })
  }

  closeLogInModal = () => {
    this.setState({
      isLogInModalOpen: false,
    })
  }

  logIn = () => {
    const password = this.refs.password.value
    if(password !== this.state.password) {
      alert('Wrong password. Try again.')
    } else {
      this.setState({
        loggedIn: true,
        isLogInModalOpen: false,
      })
    }
  }

  openChangePasswordModal = () => {
    this.setState({
      isChangePasswordModalOpen: true,
    })
  }

  closeChangePasswordModal = () => {
    this.setState({
      isChangePasswordModalOpen: false,
    })
  }

  changePassword = () => {
    const newPassword = this.refs.password.value
    this.setState({
      password: newPassword
    })
    this.closeChangePasswordModal()
  }

  openAddTabModal = () => {
    this.setState({
      isAddTabModalOpen: true,
    })
  }

  closeAddTabModal = () => {
    this.setState({
      isAddTabModalOpen: false,
    })
  } 

  addTab = () => {
    const label = this.refs.label.value
    this.setState({
      config: [
        ...this.state.config,
        { 'name' : label, 'contents' : [] },
      ],
      selectedIndex: this.state.config.length,
    })
    this.closeAddTabModal()
  } 

  removeTab = (index) => {
    this.setState({
      config: this.state.config.filter((tab, i) => i !== index),
      selectedIndex: Math.max(this.state.selectedIndex - 1, 0),
    })
  } 

  openAddContentModal = () => {
    this.setState({
      isAddContentModalOpen: true,
    })
  }

  closeAddContentModal = () => {
    this.setState({
      isAddContentModalOpen: false,
    })
  }

  addContent = () => {
    const name = this.refs.name.value
    const price = this.refs.price.value
    const newConfig = this.state.config.slice()
    newConfig[this.state.selectedIndex]['contents'].push({ 'name' : name, 'price' : parseInt(price, 10) })
    this.setState({
      config: newConfig,
    })
    this.closeAddContentModal()
  } 

  removeContent = (index) => {
    const newConfig = this.state.config.slice()
    newConfig[this.state.selectedIndex]['contents'].splice(index, 1)
    this.setState({
      config: newConfig,
    })
  }

  selectContent = (index, content) => {
    const newPrices = this.state.prices.slice()
    for(var i = index; i >= newPrices.length; --i) {
      newPrices.push(0)
    }
    newPrices[index] = content['price']
    this.setState({
      prices: newPrices,
    })
  }

  changeQuantity(event) {
    this.setState({quantity: event.target.value});
  }

  calculateTotal = () => {
    for(var i = 0; i < this.state.prices.length; ++i) {
      console.log(this.state.prices[i])
      if(this.state.prices[i] === 0) {
        alert('Please select all fields.')
        return
      }
    }
    let total = this.state.prices.reduce((i, j) => i + j, 0) * this.state.quantity
    this.setState({totalPrice: total});
  }

  logOut = () => {
    this.setState({
      loggedIn: false,
    })
  }

  render() {
    return (
      <div style={{ padding: 50 }}>
        <p>
          {!this.state.loggedIn && <button onClick={this.openLogInModal}>Log in</button>} {' '}
          {this.state.loggedIn && <button onClick={this.logOut}>Log out</button>} {' '}
          {this.state.loggedIn && <button onClick={this.openChangePasswordModal}>Change password</button>} {' '}
          {this.state.loggedIn && <button>Save</button>} {' '}
          {this.state.loggedIn && <button onClick={this.openAddTabModal}>+ Add Tab</button>}
        </p>

        <Tabs
          selectedIndex={this.state.selectedIndex}
          onSelect={selectedIndex => this.setState({ selectedIndex })}
        >
          <TabList>
            {this.state.config.map((tab, i) => (
              <Tab key={i}>
                {tab['name']} {this.state.loggedIn && <a href="#" onClick={() => this.removeTab(i)}>✕</a>}
              </Tab>
            ))}
          </TabList>
          {this.state.config.map((tab, i) => 
            <TabPanel forceRender={true} key={i}>
              {tab['contents'].map((content, j) =>
                <p key={j}>
                  <input type="radio" name={tab['name']} onClick={() => this.selectContent(i, content)}></input>
                  <label>
                    {' '}{content['name']}{' '} 
                    {this.state.loggedIn && <a href="#" onClick={() => this.removeContent(j)}>✕</a>}
                  </label>
                </p>)}
                {this.state.loggedIn && <p><button onClick={this.openAddContentModal}>+ Add Content</button></p>}
            </TabPanel>)}
        </Tabs> 

        <p>
          <label>
            Quantity: {' '}
            <input type="number" value={this.state.quantity} onChange={this.changeQuantity} />
          </label>
        </p>
        <p>
          <button onClick={this.calculateTotal}>Calculate</button>
        </p>
        <p>
          <label>Total: ${this.state.totalPrice}</label>
        </p>

        <Modal
          isOpen={this.state.isLogInModalOpen}
          onRequestClose={this.closeLogInModal}
          style={{ width: 400, height: 350, margin: '0 auto' }}
          contentLabel="logIn"
        >
          <h2>Enter password</h2>
          <label htmlFor="password">Password:</label><br />
          <input id="password" type="text" ref="password" /><br /><br />
          <button onClick={this.logIn}>Log in</button> {' '}
          <button onClick={this.closeLogInModal}>Cancel</button>
        </Modal>

        <Modal
          isOpen={this.state.isChangePasswordModalOpen}
          onRequestClose={this.closeChangePasswordModal}
          style={{ width: 400, height: 350, margin: '0 auto' }}
          contentLabel="changePassword"
        >
          <h2>Change password</h2>
          <label htmlFor="password">New password:</label><br />
          <input id="password" type="text" ref="password" /><br /><br />
          <button onClick={this.changePassword}>Change</button> {' '}
          <button onClick={this.closeChangePasswordModal}>Cancel</button>
        </Modal>

        <Modal
          isOpen={this.state.isAddTabModalOpen}
          onRequestClose={this.closeAddTabModal}
          style={{ width: 400, height: 350, margin: '0 auto' }}
          contentLabel="tabs"
        >
          <h2>Add a Tab</h2>
          <label htmlFor="label">Label:</label><br />
          <input id="label" type="text" ref="label" /><br /><br />
          <button onClick={this.addTab}>OK</button> {' '}
          <button onClick={this.closeAddTabModal}>Cancel</button>
        </Modal> 

        <Modal
          isOpen={this.state.isAddContentModalOpen}
          onRequestClose={this.closeAddContentModal}
          style={{ width: 400, height: 350, margin: '0 auto' }}
          contentLabel="contents"
        >
          <h2>Add a Content</h2>
          <label htmlFor="label">Name:</label><br />
          <input id="name" type="text" ref="name" /><br /><br />
          <label htmlFor="label">Price:</label><br />
          <input id="price" type="number" ref="price" /><br /><br />
          <button onClick={this.addContent}>OK</button>{' '}
          <button onClick={this.closeAddContentModal}>Cancel</button>
        </Modal> 
      </div>
    );
  }
}

export default App;
