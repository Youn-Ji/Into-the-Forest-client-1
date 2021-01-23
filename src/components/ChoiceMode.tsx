import React, { useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './ChoiceMode.css';
import Story from './Story';
// import CreateRoom from './CreateRoom';
// import GoRoom from './GoRoom';

// import { useDispatch } from 'react-redux';
// import { CHOICESOLO, CHOICEMULTI } from '../redux/actions';
// import { choiceSolo, choiceMultiCreateRoom, choiceMultiGoRoom } from '../redux/actions/choiceMode';

const ChoiceMode = () => {

    // const dispatch = useDispatch();
    // const mode = useSelector((state: null) => state); // state: RootState
    const [modeClick, setModeClick] = useState(null);
    const [modeHover, setModeHover] = useState(null);

    const soloMode = ()=> {
        // const solo = dispatch(choiceSolo('solo'));
        // console.log(solo.payload);
        const text ='솔로 모드';
        setModeClick(text);
        setModeHover(text);
    }

    const multiModeCreateRoom = ()=> {
        const text ='멀티 모드: 방 만들기';
        setModeClick(text);
        setModeHover(text);
    }
    
    const multiModeGoRoom = () => {
        const text ='멀티 모드: 방에 참가하기';
        setModeClick(text);
        setModeHover(text);
    }

    return  (<Switch>
                <Route path="/choicemode">
                <div className="game-size" onMouseOut={() => setModeHover(null)}>
                    <div className="mode">
                        <div className="mode-solo">
                            <div className="mode-name">
                                솔로
                            </div>
                                <Link to="/story">
                                    <button
                                        onClick={soloMode}
                                        onMouseOver={soloMode} 
                                    >
                                        혼자하기
                                    </button>
                                </Link>
                        </div>
                        <div className="mode-multi">
                            <div className="mode-name">멀티</div>
                            {/* <Link to="/createroom"> */}
                                <button
                                    onClick={multiModeCreateRoom}
                                    onMouseOver={multiModeCreateRoom}
                                    className="multi-create"
                                >
                                    생성
                                </button>
                            {/* </Link> */}
                            {/* <Link to="/goroom"> */}
                                <button
                                    onClick={multiModeGoRoom}
                                    onMouseOver={multiModeGoRoom}
                                    className="multi-join"
                                    >
                                    참가
                                </button>
                            {/* </Link> */}
                        </div>
                    </div>
                    <div className="text">
                        {modeHover === null?
                        <div className="choiceMode">모드를 선택하세요</div>
                        :
                        <div className="choiceMode">{modeHover}</div>
                        }
                        <Link to="/">
                            <div className="exit" onMouseOver={() => setModeHover("정말로 나가시겠습니까?")}>
                                나가기
                            </div>
                        </Link>
                    </div>
                </div>
                </Route>

                <Route exact path="/story">
                    <Story />
                </Route>
                {/* <Route exact path="/createroom">
                    <CreateRoom />
                </Route>
                <Route exact path="/goroom">
                    <GoRoom />
                </Route> */}
            </Switch>)
}

export default ChoiceMode;