import { useState, useEffect } from "react";



function Messages() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetch('http://3.8.159.233:8000/message')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error(error));
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = event => {
    setSortOrder(event.target.value);
  };

  const filteredMessages = messages.filter(
    message => message.phone_number.includes(searchTerm)
  );

  const sortedMessages = filteredMessages.sort((a, b) => {
    const timeA = new Date(a.created).getTime();
    const timeB = new Date(b.created).getTime();
    if (sortOrder === 'asc') {
      return timeA - timeB;
    } else {
      return timeB - timeA;
    }
  });
  return (
    <>

      <div className="messages">
      <div className="main">
        <div className="message-header">
          <h2>Messages</h2>
          <input
            className="search-bar"
            placeholder="Search by Phone number"
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select className="sort" id="sort" value={sortOrder} onChange={handleSort}>
            <option className="option" value="desc">Newest first</option>
            <option className="option" value="asc">Oldest first</option>
          </select>
        </div>
        <div className="userlist-head-mess">
          <div className="one" style={{flex: "0.3"}}>
            <p>ID</p>
          </div>
          <div style={{flex: "1.3"}}>
            <p>Phone</p>
          </div>
          <div className="one" style={{flex: "2"}}>
          <p>User</p>
          </div>
          <div style={{flex: "3"}}>
          <p>System</p>
          </div>
          <div style={{flex: "2"}}>
          <p>Recieved</p>
          </div>
        </div>
        <div>
          {sortedMessages.map((request) => (
            <div className="userlist-mess">
              <div className="two" style={{flex: "0.3"}}>
                {request.id}
              </div>
              <div style={{flex: "1.3"}}>
                {request.phone_number}
              </div>
              <div style={{flex: "2"}}>
                {request.user_message}
              </div>
              <div style={{flex: "3"}}>
                {request.sys_message}
              </div>
              <div style={{flex: "2"}}>
              {request.created}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
  }
  
  export default Messages