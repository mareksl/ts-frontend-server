import { Request, Response } from 'express';
import axios from 'axios';

const restApi = process.env.REST_API;

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

    res.render('index.hbs', {
      title: 'Band',
      eventList: events.data,
      memberList: members.data,
      contactList: contacts.data,
      galleryImageList: images.data
    });
  } catch (e) {
    res.status(500).send();
  }
};
