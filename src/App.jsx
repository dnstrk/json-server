import axios from "axios";
import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import { useReducer } from "react";

const initialState = {
    users: [],
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_SUCCESS":
            return {
                ...state,
                users: action.payload,
            };
        case "FETCH_ERR":
            return {
                ...state,
                error: action.payload,
            };
        default:
            return { ...state };
    }
}

async function fetch(dispatch) {
    try {
        const promise = await axios.get("http://localhost:3001/users");
        dispatch({ type: "FETCH_SUCCESS", payload: promise.data });
    } catch (e) {
        dispatch({ type: "FETCH_ERR", payload: e });
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [newUser, setNewUser] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
    });

    const [isUsed, setIsUsed] = useState(false);
    const [check, setCheck] = useState(false);

    useEffect(() => {
        fetch(dispatch);
    }, [newUser]);

    useEffect(() => {
        if (isUsed) {
            setTimeout(() => {
                setCheck(!check);
                setNewUser({ ...newUser, name: "" });
                setIsUsed(!isUsed);
            }, 2000);
        }
    }, [isUsed]);

    useEffect(() => {
        state.users.map((u) => {
            if (u.name.toLowerCase() == newUser.name.toLowerCase()) {
                setIsUsed(true);
            }
            console.log(isUsed);
        });
    }, [newUser]);

    function postUser() {
        if (isUsed) {
            setCheck(!check);
        } else {
            axios.post("http://localhost:3001/users", { ...newUser });
            setNewUser({ ...newUser, name: "" });
        }
    }

    // function editNewUser() {
    //     newUser.name.length > 0
    //         ? setNewUser({ ...newUser, name: name, username: username })
    //         : console.log("err");
    // }

    return (
        <div className="App">
            <div className="container">
                <div className="main">
                    <b className="title">json-server api</b>
                    <div className="actionForm">
                        <div className="formField">
                            <label>Name:</label>
                            <input
                                className="inp"
                                type="text"
                                value={newUser.name}
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        name: e.target.value,
                                    });
                                }}
                            />
                            {/* <button onClick={editNewUser}>Click</button> */}
                        </div>
                        {/* <div className="formField">
                            <span>{newUser.name}</span>
                            <span>{newUser.username}</span>
                        </div> */}
                        {/* <div className="formField">
                            <label>Username:</label>
                            <input
                                className="inp"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        username: e.target.value,
                                    });
                                }}
                            />
                        </div> */}
                        {/* <div className="formField">
                    <label>Email:</label>
                    <input
                        className="inp"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div>
                <div className="formField">
                    <label>Phone:</label>
                    <input
                        className="inp"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </div> */}
                    </div>
                    {isUsed ? (
                        <label style={{ color: "red" }}>Already taken</label>
                    ) : null}
                    <button onClick={postUser}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default App;
