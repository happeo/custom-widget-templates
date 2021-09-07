import { API_URL } from "./constants";
import { get } from "./utils";

export const getTickets = async (token) => {
  const { tickets } = await get(`${API_URL}/tickets`, { token });
  return tickets;
};

export const submitTicket = async (token, ticket) => {
  const { tickets } = await get(`${API_URL}/tickets`, { body: ticket, token });
  return tickets;
};
