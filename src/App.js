import React, { Component } from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './App.css';

var jsonData = require('./config/config.json')

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      selectedIndex: -1,
      config: jsonData,
      prices: Array(jsonData.length).fill(0),
      quantity: 0,
      totalPrice: 0,
    };

    this.changeQuantity = this.changeQuantity.bind(this);
  }

  /*
  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  } 

  addTab = () => {
    const label = this.refs.label.value;
    const content = this.refs.content.value;

    this.setState({
      tabs: [
        ...this.state.tabs,
        { label, content },
      ],
      selectedIndex: this.state.tabs.length,
    });
    this.closeModal();
  } */

  removeTab = (index) => {
    this.setState({
      config: this.state.config.filter((tab, i) => i !== index),
      selectedIndex: Math.max(this.state.selectedIndex - 1, 0),
    });
  } 

  selectContent = (index, content) => {
    const newPrices = this.state.prices.slice()
    newPrices[index] = content['price']
    this.setState({
      prices: newPrices,
    })
  }

  changeQuantity(event) {
    this.setState({quantity: event.target.value})
  }

  calculateTotal = () => {
    let total = this.state.prices.reduce((i, j) => i + j, 0) * this.state.quantity
    this.setState({totalPrice: total})
  }

  render() {
    return (
      <div style={{ padding: 50 }}>
        <Tabs
          selectedIndex={this.state.selectedIndex}
          onSelect={selectedIndex => this.setState({ selectedIndex })}
        >
          <TabList>
            {this.state.config.map((tab, i) => (
              <Tab key={i}>
                {tab['name']} <a href="#" onClick={() => this.removeTab(i)}>✕</a>
              </Tab>
            ))}
          </TabList>
          {this.state.config.map((tab, i) => 
            <TabPanel key={i}>
              {tab['contents'].map((content, j) =>
                <p key={j}>
                  <button onClick={() => this.selectContent(i, content)}>{content['name']}</button>
                </p>)}
            </TabPanel>)}
        </Tabs> 
        <p>
          <label>
            Quantity:
            <input type="number" value={this.state.quantity} onChange={this.changeQuantity} />
          </label>
        </p>
        <p>
          <button onClick={this.calculateTotal}>Calculate</button>
        </p>
        <p>
          <label>Total: ${this.state.totalPrice}</label>
        </p>
      </div>
        // <p>
        //   <button onClick={this.openModal}>+ Add</button>
        // </p>
        // <Modal
        //   isOpen={this.state.isModalOpen}
        //   onRequestClose={this.closeModal}
        //   style={{ width: 400, height: 350, margin: '0 auto' }}
        //   contentLabel="tabs"
        // >
        //   <h2>Add a Tab</h2>
        //   <label htmlFor="label">Label:</label><br />
        //   <input id="label" type="text" ref="label" /><br /><br />
        //   <label htmlFor="content">Content:</label><br />
        //   <textarea id="content" ref="content" rows="10" cols="50" /><br /><br />
        //   <button onClick={this.addTab}>OK</button>{' '}
        //   <button onClick={this.closeModal}>Cancel</button>
        // </Modal> 
    );
  }
}

export default App;
