import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }
  return (
    <div className="App">
      <h1>
        {store.isAuth
          ? `User is authorized ${store.user.email}`
          : "Authorize PLEASE"}
      </h1>
      <h1>
        {store.user.isActivated
          ? "Account submited on email"
          : "PLEASE SUBMIT ACCOUNT"}
      </h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>Get users</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
}

export default observer(App);
