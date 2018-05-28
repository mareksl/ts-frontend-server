import { Request, Response } from 'express';
import axios from 'axios';

const restApi = process.env.REST_API;
const eventsPerPageString = process.env.EVENTS_PER_PAGE || '5';
const eventsPerPage = parseInt(eventsPerPageString);

interface Event {
  _id: string;
  location: string;
  date: number;
  description: string;
  link: string;
  __v: string;
}

export const getImage = async (req: Request, res: Response) => {
  const id = req.params.id;
  const getImageFromApi = axios.get(`${restApi}/gallery/${id}`, {
    responseType: 'arraybuffer'
  });

  try {
    const image = await getImageFromApi;
    res.write(image.data);
    res.end();
  } catch (e) {
    res.status(404).send();
  }
};

export const get = async (req: Request, res: Response) => {
  const getEvents = axios.get(`${restApi}/events`);
  const getMembers = axios.get(`${restApi}/members`);
  const getContacts = axios.get(`${restApi}/contacts`);
  const getImages = axios.get(`${restApi}/gallery`);

  try {
    const [events, members, contacts, images] = await Promise.all([
      getEvents,
      getMembers,
      getContacts,
      getImages
    ]);

    const filteredEvents: { upcoming: Event[]; past: Event[] } = {
      upcoming: events.data.events.filter((event: Event) => {
        return event.date >= Date.now();
      }),
      past: events.data.events.filter((event: Event) => {
        return event.date < Date.now();
      })
    };

    res.render('index.hbs', {
      title: 'Band',
      eventList: filteredEvents,
      memberList: members.data,
      contactList: contacts.data,
      galleryImageList: images.data
    });
  } catch (e) {
    res.status(500).send();
  }
};

export const notFound = (req: Request, res: Response) => {
  res.render('404.hbs', { route: req.originalUrl });
};
