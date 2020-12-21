import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  background-color: #c4c4dc;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  max-height: 500px;
  overflow: auto;
  width: 400px;
  border: 1px solid lightgray;
  background-color: #fff;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;

const TextArea = styled.textarea`
  width: 98%;
  height: 50px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 1px solid lightgray;
  background-color: #fff;
  outline: none;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: #444;
  }
`;

const Button = styled.button`
  background-color: #2962ff;
  width: 100%;
  border: none;
  height: 35px;
  border-radius: 10px;
  color: white;
  font-size: 17px;
`;

const Form = styled.form`
  width: 400px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: #418bef;
  color: white;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: #898f9d;
  color: white;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [login, setlogin] = useState(false);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })

    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (message) {
      const messageObject = {
        body: message,
        id: yourID,
        name: name
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  const onEnterPressName = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessageName(e);
    }
  }

  function sendMessageName(e) {
    e.preventDefault();
    if (name) {
      setlogin(true);
    } else {
      alert("Vui lòng nhập vào name");
    }
  }


  return (
    <>
      <Page>
        <h2>App chat box</h2>
        {login &&
          <>
            <Container>
              {messages.map((message, index) => {
                if (message.id === yourID) {
                  return (
                    <MyRow key={index}>
                      <MyMessage>
                        {message.body}
                      </MyMessage>
                    </MyRow>
                  )
                }
                return (
                  <PartnerRow key={index}>
                    <PartnerMessage>
                      {message.name}: {message.body}
                    </PartnerMessage>
                  </PartnerRow>
                )
              })}
            </Container>

            <Form onSubmit={sendMessage}>
              <TextArea value={message} onChange={handleChange} placeholder="Nội dung tin nhắn..."
                rows="2"
                onKeyDown={onEnterPress}
              />
              <Button>GỬI</Button>
            </Form>
          </>
        }

        {!login && <Form onSubmit={sendMessageName}>
          <TextArea value={name}
            onChange={handleChangeName}
            placeholder="Nhập vào tên"
            rows="2"
            onKeyDown={onEnterPressName}
          />
          <Button>VÀO CHAT</Button>
        </Form>}

      </Page>
    </>
  );
};

export default App;
