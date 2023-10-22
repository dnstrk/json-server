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
        const promise = await axios.get(
            "https://wkjnb4kz-3001.euw.devtunnels.ms/users"
        );
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
        password: "",
        email: "",
        phone: "",
    });

    const [isUsed, setIsUsed] = useState(false);
    const [check, setCheck] = useState(false);

    useEffect(() => {
        fetch(dispatch);
    }, [newUser]);

    useEffect(() => {
        if (check) {
            setTimeout(() => {
                setCheck(!check);
                setNewUser({
                    ...newUser,
                    name: "",
                    username: "",
                    password: "",
                    email: "",
                    phone: "",
                });
                setIsUsed(!isUsed);
            }, 2000);
        }
    }, [check]);

    useEffect(() => {
        state.users.map((u) => {
            if (u.username.toLowerCase() == newUser.username.toLowerCase()) {
                setIsUsed(true);
            }
            console.log(isUsed);
        });
    }, [newUser]);

    function postUser() {
        if (isUsed) {
            setCheck(!check);
        } else {
            axios.post("https://wkjnb4kz-3001.euw.devtunnels.ms/users", {
                ...newUser,
            });
            setNewUser({
                ...newUser,
                name: "",
                username: "",
                password: "",
                email: "",
                phone: "",
            });
        }
    }

    // function editNewUser() {
    //     newUser.name.length > 0
    //         ? setNewUser({ ...newUser, name: name, username: username })
    //         : console.log("err");
    // }

    function click() {}

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
                            {/* <button onClick={click}>Click</button> */}
                        </div>
                        <div className="formField">
                            <label>Username:</label>
                            <input
                                className="inp"
                                type="text"
                                value={newUser.username}
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        username: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="formField">
                            <label>Password: </label>
                            <input
                                className="inp"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        password: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    {check ? (
                        <label style={{ color: "red" }}>Already taken</label>
                    ) : null}
                    <button type="submit" onClick={postUser}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
