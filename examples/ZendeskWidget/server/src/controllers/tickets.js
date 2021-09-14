const {
  fetchTickets,
  createNewTicket,
  fetchUserById,
} = require("../services/zendesk");
const { getToken } = require("../store");

const getTickets = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const ticketsRequest = await fetchTickets(user.accessToken);

    const ticketsResponse = await Promise.all(
      ticketsRequest.tickets.map(async (ticket) => {
        const requesterId = ticket.requester_id;
        const requester = await fetchUserById(requesterId, user.accessToken);
        return {
          ...ticket,
          requester,
        };
      }),
    );

    res.status(200).send({ tickets: ticketsResponse });
  } catch (e) {
    next(e);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const ticket = await createNewTicket(user.accessToken, req.body);

    res.status(200).send(ticket);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getTickets,
  createTicket,
};
