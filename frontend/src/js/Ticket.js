import moment from "moment";

export default class Ticket {
  constructor({ id, name, description, status, created }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;
  }

  getHTML() {
    return `
      <div class="ticket-item" data-id="${this.id}">
        <div class="item">
          <button class="ticket-notice${this.status ? " active" : ""}"></button>
        </div>
        <div class="item-title item">${this.name}</div>
        <div class="item-date item">${moment(this.created).format("DD.MM.YY HH:mm")}</div>
        <div class="item item-controls">
          <button class="ticket-edit"></button>
          <button class="ticket-delete"></button>
        </div>
      </div>
    `;
  }
}
