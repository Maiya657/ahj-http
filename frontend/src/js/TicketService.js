import Ticket from "./Ticket";

export default class TicketService {
  list(callback) {
    fetch('http://localhost:7070/?method=allTickets', {
      method: 'GET',
    }).then((response)=>{
      response.json()
        .then(value => {
          if (!response.ok) {
            callback(undefined, 'Ошибка при загрузке билетов!');
            return;
          }

          const tickets = value.map(ticket => new Ticket(ticket));

          callback(tickets);
        })
        .catch(error => { callback(undefined, error) });
    }).catch(error => { callback(undefined, error) });
  }

  get(id, callback) {
    fetch(`http://localhost:7070/?method=ticketById&id=${id}`, {
      method: 'GET',
    }).then((response)=>{
      response.json()
        .then(value => {
          if (!response.ok) {
            callback(undefined, 'Ошибка при получении билета!');
            return;
          }

          callback(value);
        })
        .catch(error => { callback(undefined, error) });
    }).catch(error => { callback(undefined, error) });
  }

  create(data, callback) {
    fetch('http://localhost:7070/?method=createTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response)=>{
      response.json()
        .then(value => {
          if (!response.ok) {
            callback(undefined, 'Ошибка при отправке билета!');
            return;
          }

          callback(value);
        })
        .catch(error => { callback(undefined, error) });
    }).catch(error => { callback(undefined, error) });
  }

  update(id, data, callback) {
    fetch(`http://localhost:7070/?method=updateById&id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      response.json()
        .then(value => {
          if (!response.ok) {
            callback(undefined, 'Ошибка при обновлении билета!');
            return;
          }

          callback(value);
        })
        .catch(error => { callback(undefined, error) });
      }).catch(error => { callback(undefined, error) });
  }

  delete(id, callback) {
    fetch(`http://localhost:7070/?method=deleteById&id=${id}`, {
      method: 'GET',
    }).then((response)=>{
      response.json()
        .then(value => {
          if (!response.ok) {
            callback(undefined, 'Ошибка при удалении билета!');
            return;
          }

          callback(value);
        })
        .catch(error => { callback(undefined, error) });
    }).catch(error => { callback(undefined, error) });
  }
}