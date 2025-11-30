import TicketView from "./TicketView";

export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("This is not HTML element!");
    }
    this.container = container;
    this.ticketService = ticketService;
  }

  init() {
    this.container.insertAdjacentHTML(
      "beforeend",
      '<div class="ticketView"></div>',
    );
    const ticketView = this.container.querySelector(".ticketView");
    this.ticketView = new TicketView(ticketView, this.ticketService);

    console.info("init");
    this.ticketView.renderTickets();

    this.container
      .querySelector(".add-ticket")
      .addEventListener(
        "click",
        this.ticketView.addTicket.bind(this.ticketView),
      );
  }
}
