import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/actions';
import GameControls from './GameControls';
import Gameboard from './Gameboard';
import NudgeControls from './NudgeControls';
import {arrayFromWidthHeightWeight} from '../helpers/boardMethods.js';
import '../assets/css/fontawesome-all.css';

export default connect(mapPropsToState, mapDispatchToProps)(class GameContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      iterationDelay: 200
    };
    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNudge = this.handleNudge.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.updateNumericalAttribute = this.updateNumericalAttribute.bind(this);
  }
  componentDidMount() {
    var timer = setInterval(() => {
      if (this.props.shouldIterate) {
        this.props.iterateBoard();
      }
    }, this.state.iterationDelay);
    this.setState({
      timer
    });
    this.resetBoard();
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  resetBoard() {
    this.props.setBoard(arrayFromWidthHeightWeight(this.props.width, this.props.height, this.props.chance));
  }
  updateNumericalAttribute(e) {
    this.props.updateNumericalAttribute(e.target.name, e.target.value);
  }
  handleCellClick(e) {
    let cell = e.target.getAttribute('data-num');
    e.preventDefault();
    // in the case of clicking the grid itself
    if (cell === null) {
      return;
    }
    this.props.flipCell(cell);
  }
  handleNudge(e) {
    this.props.nudgeBoard(e.target.value);
  }
  handleChange(e) {
    if (e.target.name === 'width') {
      this.props.setWidth(+e.target.value);
    }
    if (e.target.name === 'height') {
      this.props.setHeight(+e.target.value);
    }
    if (e.target.name === 'startAgain') {
      this.resetBoard();
    }
    if (e.target.name === 'setDefaultRules') {
      this.props.setDefaultRules();
    }
    if (e.target.name === 'clearBoard') {
      // no reason to iterate a blank board
      this.props.setShouldIterate(false);
      this.props.clearBoard();
    }
    if (e.target.name === 'updateDelay') {

      this.setState({iterationDelay: +e.target.value}, () => {
        clearInterval(this.state.timer);
        var timer = setInterval(() => {
          if (this.props.shouldIterate) {
            this.props.iterateBoard();
          }
        }, this.state.iterationDelay);
        this.setState({
          timer
        });
      });

    }
    if (e.target.name === 'playPause') {
      this.props.setShouldIterate(!this.props.shouldIterate);
    }
    if (e.target.name === 'step1') {
      this.props.iterateBoard();
    }
    e.preventDefault();
  }

  render() {
    return ( <div className='GameContainer'>

      <a href='https://github.com/lexjacobs/conways-game-of-life-explorer'><img style={{position: 'absolute', top: 0, right: 0, border: 0, width: '10%', height: 'auto'}} src='https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png' alt='Fork me on GitHub'/></a>

      <GameControls  height={this.props.height}  chance={this.props.chance} delay={this.state.iterationDelay} lazarus={this.props.lazarus} onAttribute={this.updateNumericalAttribute} onChange={this.handleChange} over={this.props.over} shouldIterate={this.props.shouldIterate} under={this.props.under} width={this.props.width}/>
      <NudgeControls onClick={this.handleNudge}/>
      <Gameboard height={+this.props.height} width={+this.props.width} board={this.props.board} onClick={this.handleCellClick}/>
    </div>
    );
  }

});

function mapPropsToState(state) {
  return state.boardState;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, actions), dispatch);
}
