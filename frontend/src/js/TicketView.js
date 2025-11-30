import Ticket from "./Ticket";

export default class TicketView {
  constructor(container, ticketService) {
    this.container = container;
    this.ticketService = ticketService;
  }

  renderTickets() {
    this.ticketService.list((tickets) => {
      this.tickets = tickets;
      this.render();
    });
  }

  render() {
    this.container.innerHTML = '';

    this.tickets.forEach(ticket => {
      this.container.insertAdjacentHTML('beforeend', ticket.getHTML());
    });

    Array.from(this.container.querySelectorAll('.ticket-notice')).forEach(ticketNotice => {
      ticketNotice.addEventListener('click', this.toggleStatus.bind(this));
    });

    Array.from(this.container.querySelectorAll('.ticket-edit')).forEach(ticket => {
      ticket.addEventListener('click', this.editTicket.bind(this));
    });

    Array.from(this.container.querySelectorAll('.ticket-delete')).forEach(ticket => {
      ticket.addEventListener('click', this.deleteTicket.bind(this));
    });

    Array.from(this.container.querySelectorAll('.item-title')).forEach(ticket => {
      ticket.addEventListener('click', this.toggleTicketTitle.bind(this));
    });
  }

  renderModalDelete(id) {
    this.container.insertAdjacentHTML('beforeend', `
      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">Удалить тикет</div>
          Вы уверены, что хотите удалить тикет? Это действие необратимо.
          <div class="modal-buttons">
            <button class="btn btn-cancel" name="intent" value="cancel">Отмена</button>
            <button class="btn btn-ok" type="submit" name="intent" value="save">Ок</button>
          </div>
        </div>
      </div>
    `);

    this.container.querySelector('.btn-cancel').addEventListener('click', e => {
      e.preventDefault();
      this.closeModal();
    })

    this.container.querySelector('.btn-ok').addEventListener('click', e => {

      this.ticketService.delete(id, () => {
        this.closeModal();
        this.renderTickets();
      });
    })
  }

  toggleStatus(e) {
    e.preventDefault();
    const id = e.target.closest('.ticket-item').dataset.id;
    const data = this.tickets.find(ticket => ticket.id === id);

    data.status = !data.status;
    
    this.ticketService.update(id, data, () => {
      this.renderTickets();
    });
  }

  toggleTicketTitle(e) {
    e.preventDefault();
    const parent = e.target.closest('.ticket-item');
    const title = parent.querySelector('.item-title');
    const description = title.querySelector('.item-description');
    
    if (description) {
      description.remove();
    } else {
      const id = parent.dataset.id;
      const data = this.tickets.find(ticket => ticket.id === id);

      title.insertAdjacentHTML('beforeend', `<p class="item-description">${data.description}</p>`);
    }
  }

  addTicket(e) {
    e.preventDefault();
    this.renderModal();
  }

  editTicket(e) {
    e.preventDefault();
    const id = e.target.closest('.ticket-item').dataset.id;
    const data = this.tickets.find(ticket => ticket.id === id);

    this.renderModal(data);
  }

  deleteTicket(e) {
    e.preventDefault();
    const id = e.target.closest('.ticket-item').dataset.id;

    this.renderModalDelete(id);
  }

  renderModal(data = {}) {
    this.container.insertAdjacentHTML('beforeend', `
      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">${data.id ? 'Изменить тикет' : 'Добавить тикет'}</div>
          <form class="ticket-submit-form">
            <input type="hidden" name="id" value="${data.id ? data.id : ''}"></input>
            <div class="text-field">
              <label for="ticket-name">Краткое описание</label>
              <input type="text" name="name" id="ticket-name" value="${data.name ? data.name : ''}"></input>
            </div>
            <div class="text-field">
              <label for="ticket-description">Полное описание</label>
              <textarea name="description" id="ticket-description">${data.description ? data.description : ''}</textarea>
            </div>
            <div class="modal-buttons">
              <button class="btn btn-cancel" name="intent" value="cancel">Отмена</button>
              <button class="btn btn-ok" type="submit" name="intent" value="save">Ок</button>
            </div>
          </form>
        </div>
      </div>
    `);

    this.container.querySelector('.btn-cancel').addEventListener('click', e => {
      e.preventDefault();
      this.closeModal();
    })

    this.container.querySelector('.ticket-submit-form').addEventListener('submit', this.modalFormSubmit.bind(this));
  }

  modalFormSubmit(e) {
    e.preventDefault();
    const formData = new Ticket(Object.fromEntries((new FormData(e.target, e.submitter)).entries()));

    if (formData.id) {
      const data = this.tickets.find(ticket => ticket.id === formData.id);
      this.ticketService.update(formData.id, {...data, ...formData}, () => {
        this.closeModal();
        this.renderTickets();
      });
    } else {
      this.ticketService.create(formData, () => {
        this.closeModal();
        this.renderTickets();
      });
    }
  }

  closeModal() {
    this.container.querySelector('.modal').remove();
  }
}